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

// Field mapping dictionary
const fieldMappings: Record<string, string> = {
  'Product Name': 'Title',
  'Description': 'Body (HTML)',
  'Brand Name': 'Vendor',
  'Category': 'Product Category',
  'Item Group': 'Type',
  'Keywords': 'Tags',
  'Live Status': 'Published',
  'Size Type': 'Option1 Name',
  'Size Value': 'Option1 Value',
  'Color Type': 'Option2 Name',
  'Color Choice': 'Option2 Value',
  'Item Code': 'Variant SKU',
  'Weight in G': 'Variant Grams',
  'Stock System': 'Variant Inventory Tracker',
  'Stock Count': 'Variant Inventory Qty',
  'Stock Rule': 'Variant Inventory Policy',
  'Shipping Method': 'Variant Fulfillment Service',
  'Current Price': 'Variant Price',
  'Original Price': 'Variant Compare At Price',
  'Needs Shipping': 'Variant Requires Shipping',
  'Tax Rule': 'Variant Taxable',
  'Barcode ID': 'Variant Barcode',
  'Image Link': 'Image Src',
  'Visual Order': 'Image Position',
  'Picture Text': 'Image Alt Text',
  'Digital Gift': 'Gift Card',
  'Meta Title': 'SEO Title',
  'Meta Details': 'SEO Description',
  'Store Category': 'Google Shopping / Google Product Category',
  'Target Gender': 'Google Shopping / Gender',
  'Target Age': 'Google Shopping / Age Group',
  'Item Number': 'Google Shopping / MPN',
  'Marketing Group': 'Google Shopping / AdWords Grouping',
  'Marketing Keywords': 'Google Shopping / AdWords Labels',
  'Custom Item': 'Google Shopping / Custom Product',
  'Store Label 0': 'Google Shopping / Custom Label 0',
  'Store Label 1': 'Google Shopping / Custom Label 1',
  'Store Label 2': 'Google Shopping / Custom Label 2',
  'Store Label 3': 'Google Shopping / Custom Label 3',
  'Store Label 4': 'Google Shopping / Custom Label 4',
  'Product Image': 'Variant Image',
  'Product Mass Unit': 'Variant Weight Unit',
  'Unit Cost': 'Cost per item',
  'Sales Amount': 'Price / International',
  'Compare Rate': 'Compare At Price / International',
  'Item State': 'Status',
  'Extra Info': 'Additional Field 1',
  'Style Type': 'Additional Field 2',
  'URL Path': 'Handle'
};

// Mapping function that uses the field mappings
export const mapToShopifyTemplate = (
  uploadedData: Record<string, any>[], 
  headerMappings: Record<string, string> = {}
): ShopifyProduct[] => {
  const shopifyHeaders = getShopifyTemplateHeaders();
  
  return uploadedData.map(row => {
    const mappedRow: ShopifyProduct = {};
    
    // First, apply any custom header mappings
    Object.entries(headerMappings).forEach(([originalHeader, shopifyHeader]) => {
      if (row[originalHeader] !== undefined) {
        mappedRow[shopifyHeader as keyof ShopifyProduct] = row[originalHeader];
      }
    });

    // Then, apply our predefined field mappings
    Object.entries(fieldMappings).forEach(([originalHeader, shopifyHeader]) => {
      if (row[originalHeader] !== undefined && !mappedRow[shopifyHeader as keyof ShopifyProduct]) {
        mappedRow[shopifyHeader as keyof ShopifyProduct] = row[originalHeader];
      }
    });

    // For any unmapped fields, try direct mapping
    Object.entries(row).forEach(([originalHeader, value]) => {
      if (shopifyHeaders.includes(originalHeader) && !mappedRow[originalHeader as keyof ShopifyProduct]) {
        mappedRow[originalHeader as keyof ShopifyProduct] = value;
      }
    });

    // Fill in any missing fields with empty strings
    shopifyHeaders.forEach(header => {
      if (mappedRow[header as keyof ShopifyProduct] === undefined) {
        mappedRow[header as keyof ShopifyProduct] = '';
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
