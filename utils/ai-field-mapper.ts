import { GoogleGenerativeAI } from "@google/generative-ai";
import { getShopifyTemplateHeaders } from "./shopify-template";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export interface FieldMapping {
  originalField: string;
  suggestedField: string;
  confidence: number;
}

export class AIFieldMapper {
  private genAI: GoogleGenerativeAI;

  constructor() {
    const apiKey = 
      process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_KEY || 
      process.env.GOOGLE_GENERATIVE_AI_KEY;

    if (!apiKey) {
      console.error('CRITICAL: No Google Generative AI key found');
      throw new Error("No Google Generative AI key is set. Please check your environment variables.");
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  private sanitizeJSON(text: string): string {
    // Remove any text before the first '{' and after the last '}'
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No valid JSON found in the response");
    }

    // Replace single quotes with double quotes
    let jsonString = jsonMatch[0]
      .replace(/'/g, '"')
      // Ensure keys are double-quoted
      .replace(/(\w+):/g, '"$1":')
      // Handle potential trailing commas
      .replace(/,\s*}/g, '}')
      .replace(/,\s*\]/g, ']');

    return jsonString;
  }

  async mapFields(csvHeaders: string[]): Promise<FieldMapping[]> {
    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
      const shopifyHeaders = getShopifyTemplateHeaders();

      const prompt = `
You are an expert at mapping CSV headers to Shopify product fields.

Input CSV Headers:
${csvHeaders.join('\n')}

Available Shopify Fields:
${shopifyHeaders.join('\n')}

Task:
Analyze each input CSV header and map it to the most appropriate Shopify field.

Requirements:
1. Map ONLY the input fields that have a clear corresponding Shopify field
2. Consider common variations and synonyms (e.g., "name" = "title", "description" = "body (html)")
3. Assign a confidence score (0-100) based on how certain the mapping is

Return the results in this exact JSON format:
{
  "mappings": [
    {
      "originalField": "input_field_name",
      "suggestedField": "matching_shopify_field",
      "confidence": confidence_score
    }
  ]
}

Important:
- Only include mappings with confidence > 50
- Each Shopify field should only be mapped once (no duplicates)
- Preserve exact field names (case-sensitive)
- Include reasoning for low-confidence matches
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = await response.text();

      // Sanitize and parse the JSON
      const sanitizedJson = this.sanitizeJSON(text);
      
      try {
        const data = JSON.parse(sanitizedJson);
        
        // Validate the parsed data
        if (!data.mappings || !Array.isArray(data.mappings)) {
          throw new Error("Invalid mapping format");
        }

        // Filter out low-confidence mappings
        return data.mappings.filter(
          (mapping: FieldMapping) => mapping.confidence > 50
        );
      } catch (parseError) {
        console.error('JSON Parsing Error:', parseError);
        console.error('Raw Response:', text);
        console.error('Sanitized JSON:', sanitizedJson);
        throw new Error('Failed to parse AI mapping response');
      }

    } catch (error) {
      console.error('AI Mapping Error:', error);
      throw new Error('Failed to map fields with AI');
    }
  }
}
