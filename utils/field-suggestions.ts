import Fuse from 'fuse.js';

// Comprehensive Shopify field variations
export const SHOPIFY_FIELD_VARIATIONS = {
  'Title': [
    'Product Title', 'Item Name', 'Product Name', 'Variant Title', 
    'Product Label', 'Merchandise Name', 'Article Title', 
    'Listing Name', 'Product Descriptor', 'Variant Designation'
  ],
  'Body (HTML)': [
    'Product Description', 'Item Details', 'Long Description', 
    'Product Body Text', 'Extended Description', 'Product Information', 
    'Features and Benefits', 'Detailed Description'
  ],
  'Vendor': [
    'Manufacturer', 'Brand', 'Supplier', 'Producer', 'Creator', 
    'Company', 'Maker', 'Source', 'Origin', 'Distributor'
  ],
  'Product Type': [
    'Product Category', 'Classification', 'Group', 'Section', 
    'Department', 'Genre', 'Collection', 'Line', 'Series', 'Product Family'
  ],
  'Type': [
    'Product Classification', 'Item Type', 'Variant Type', 
    'Product Genre', 'Merchandise Category', 'Product Class', 
    'Item Group', 'Taxonomy', 'Product Segment'
  ],
  'Tags': [
    'Keywords', 'Labels', 'Attributes', 'Descriptors', 'Markers', 
    'Classifiers', 'Metadata', 'Search Terms', 'Identifiers', 
    'Taxonomic Markers'
  ],
  'Published': [
    'Visibility Status', 'Live Status', 'Active', 'Visible', 'Public', 
    'Listing State', 'Display Status', 'Availability', 
    'Online Status', 'Publication Flag'
  ]
};

// Interface for field suggestion result
export interface FieldSuggestion {
  originalField: string;
  bestMatch: string;
  confidence: number;
}

/**
 * Find the best matching Shopify field for a given input
 * @param inputField The field name to match
 * @returns Detailed field suggestion or null if no good match found
 */
export function findBestFieldMatch(inputField: string): FieldSuggestion | null {
  // Normalize input by trimming and converting to lowercase
  const normalizedInput = inputField.trim().toLowerCase();

  // Collect all possible variations
  const allVariations: {[key: string]: string[]} = {};
  Object.entries(SHOPIFY_FIELD_VARIATIONS).forEach(([standardField, variations]) => {
    allVariations[standardField] = [standardField.toLowerCase(), ...variations.map(v => v.toLowerCase())];
  });

  // Find the best match across all fields
  let bestMatch: FieldSuggestion | null = null;
  
  Object.entries(allVariations).forEach(([standardField, variations]) => {
    // Create Fuse instance for this field's variations
    const fuse = new Fuse(variations, {
      includeScore: true,
      threshold: 0.4, // Lower threshold for more lenient matching
    });

    // Search for the best match
    const results = fuse.search(normalizedInput);
    
    if (results.length > 0) {
      const match = results[0];
      const confidence = 1 - (match.score || 1);
      
      // Update best match if this is more confident
      if (!bestMatch || confidence > bestMatch.confidence) {
        bestMatch = {
          originalField: inputField,
          bestMatch: standardField,
          confidence: confidence
        };
      }
    }
  });

  return bestMatch;
}

/**
 * Find suggestions for multiple fields in a CSV header
 * @param csvHeaders Array of headers from the CSV
 * @returns Map of original fields to their best Shopify field matches
 */
export function findFieldSuggestions(csvHeaders: string[]): Map<string, FieldSuggestion | null> {
  const suggestions = new Map<string, FieldSuggestion | null>();
  
  csvHeaders.forEach(header => {
    suggestions.set(header, findBestFieldMatch(header));
  });

  return suggestions;
}
