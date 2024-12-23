import { z } from 'zod';

// Comprehensive Shopify Product Template Schema
export const ShopifyProductSchema = z.object({
  Handle: z.string().optional(),
  Title: z.string().optional(),
  'Body (HTML)': z.string().optional(),
  Vendor: z.string().optional(),
  'Product Category': z.string().optional(),
  Type: z.string().optional(),
  Tags: z.string().optional(),
  Published: z.string().optional(),
  'Option1 Name': z.string().optional(),
  'Option1 Value': z.string().optional(),
  'Option2 Name': z.string().optional(),
  'Option2 Value': z.string().optional(),
  'Option3 Name': z.string().optional(),
  'Option3 Value': z.string().optional(),
  'Variant SKU': z.string().optional(),
  'Variant Grams': z.string().optional(),
  'Variant Inventory Tracker': z.string().optional(),
  'Variant Inventory Qty': z.string().optional(),
  'Variant Inventory Policy': z.string().optional(),
  'Variant Fulfillment Service': z.string().optional(),
  'Variant Price': z.string().optional(),
  'Variant Compare At Price': z.string().optional(),
  'Variant Requires Shipping': z.string().optional(),
  'Variant Taxable': z.string().optional(),
  'Variant Barcode': z.string().optional(),
  'Image Src': z.string().optional(),
  'Image Position': z.string().optional(),
  'Image Alt Text': z.string().optional(),
  'Gift Card': z.string().optional(),
  'SEO Title': z.string().optional(),
  'SEO Description': z.string().optional(),
  'Google Shopping / Google Product Category': z.string().optional(),
  'Google Shopping / Gender': z.string().optional(),
  'Google Shopping / Age Group': z.string().optional(),
  'Google Shopping / MPN': z.string().optional(),
  'Google Shopping / AdWords Grouping': z.string().optional(),
  'Google Shopping / AdWords Labels': z.string().optional(),
  'Google Shopping / Condition': z.string().optional(),
  'Google Shopping / Custom Product': z.string().optional(),
  'Google Shopping / Custom Label 0': z.string().optional(),
  'Google Shopping / Custom Label 1': z.string().optional(),
  'Google Shopping / Custom Label 2': z.string().optional(),
  'Google Shopping / Custom Label 3': z.string().optional(),
  'Google Shopping / Custom Label 4': z.string().optional(),
  'Variant Image': z.string().optional(),
  'Variant Weight Unit': z.string().optional(),
  'Variant Tax Code': z.string().optional(),
  'Cost per item': z.string().optional(),
  'Price / International': z.string().optional(),
  'Compare At Price / International': z.string().optional(),
  Status: z.string().optional(),
  'Additional Field 1': z.string().optional(),
  'Additional Field 2': z.string().optional(),
  'Additional Field 3': z.string().optional()
});

// Type for Shopify Product
export type ShopifyProduct = z.infer<typeof ShopifyProductSchema>;

// Get all headers
export const getShopifyTemplateHeaders = (): string[] => {
  const baseHeaders = [
    ...Object.keys(ShopifyProductSchema.shape),
    'Additional Field 1',
    'Additional Field 2',
    'Additional Field 3'
  ];
  
  return baseHeaders;
};

// Comprehensive mapping function
export const mapToShopifyTemplate = (
  uploadedData: Record<string, any>[], 
  headerMappings: Record<string, string> = {}
): ShopifyProduct[] => {
  const shopifyHeaders = getShopifyTemplateHeaders();
  
  return uploadedData.map(row => {
    const mappedRow: ShopifyProduct = {};
    
    // Create a reverse mapping from original headers to Shopify headers
    const reverseHeaderMappings: Record<string, string> = {};
    Object.entries(headerMappings).forEach(([originalHeader, shopifyHeader]) => {
      reverseHeaderMappings[originalHeader] = shopifyHeader;
    });

    // Track which Shopify headers have been mapped
    const mappedShopifyHeaders = new Set<string>();

    // First, try exact and mapped matches
    Object.keys(row).forEach(originalHeader => {
      const shopifyHeader = reverseHeaderMappings[originalHeader];
      
      if (shopifyHeader) {
        mappedRow[shopifyHeader as keyof ShopifyProduct] = row[originalHeader];
        mappedShopifyHeaders.add(shopifyHeader);
      } else if (shopifyHeaders.includes(originalHeader)) {
        mappedRow[originalHeader as keyof ShopifyProduct] = row[originalHeader];
        mappedShopifyHeaders.add(originalHeader);
      }
    });

    // Then, try case-insensitive and partial matches
    Object.keys(row).forEach(originalHeader => {
      if (!reverseHeaderMappings[originalHeader]) {
        const matchedHeader = shopifyHeaders.find(shopifyHeader => 
          shopifyHeader.toLowerCase() === originalHeader.toLowerCase() ||
          shopifyHeader.toLowerCase().includes(originalHeader.toLowerCase()) ||
          originalHeader.toLowerCase().includes(shopifyHeader.toLowerCase())
        );

        if (matchedHeader && !mappedShopifyHeaders.has(matchedHeader)) {
          mappedRow[matchedHeader as keyof ShopifyProduct] = row[originalHeader];
          mappedShopifyHeaders.add(matchedHeader);
        }
      }
    });
    
    // Fill in unmapped Shopify headers with 'N/A'
    shopifyHeaders.forEach(shopifyHeader => {
      if (!mappedShopifyHeaders.has(shopifyHeader)) {
        mappedRow[shopifyHeader as keyof ShopifyProduct] = 'N/A';
      }
    });
    
    return mappedRow;
  });
};

// Validation function
export const validateShopifyProduct = (product: ShopifyProduct): boolean => {
  try {
    ShopifyProductSchema.parse(product);
    return true;
  } catch (error) {
    console.error('Product validation failed:', error);
    return false;
  }
};
