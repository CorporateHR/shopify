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
You are an expert at mapping CSV headers to Shopify product fields with maximum coverage.

Input CSV Headers:
${csvHeaders.join('\n')}

Available Shopify Fields:
${shopifyHeaders.join('\n')}

Comprehensive Mapping Guidelines:
1. Attempt to map EVERY input CSV header to a Shopify field
2. Use flexible, intelligent matching strategies:
   - Exact match
   - Case-insensitive match
   - Partial word match
   - Semantic similarity
   - Common synonyms and variations
3. Be creative and lenient in mapping
4. Assign confidence scores considering mapping strategy

Mapping Strategies:
- Exact match gets 100% confidence
- Case-insensitive match gets 90% confidence
- Partial word match gets 70-80% confidence
- Semantic similarity gets 60-70% confidence
- Generic fallback gets 50% confidence

Return ALL mappings in this JSON format:
{
  "mappings": [
    {
      "originalField": "input_field_name",
      "suggestedField": "matching_shopify_field",
      "confidence": confidence_score
    }
  ]
}

Specific Mapping Hints:
- "Product Name" → "Title"
- "Description" → "Body (HTML)"
- "Price" → "Variant Price"
- "SKU" → "Variant SKU"
- "Weight" → "Variant Grams"
- "Category" → "Product Category"
- "Vendor" → "Vendor"
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

        // Ensure at least 50% confidence, but be more inclusive
        return data.mappings.filter(
          (mapping: FieldMapping) => mapping.confidence >= 50
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
