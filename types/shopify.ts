// Shopify Product Type Definition

export interface ShopifyProductVariant {
  id?: number;
  price: number;
  sku: string;
  inventory_quantity: number;
}

export interface ShopifyProduct {
  id: number;
  title: string;
  body_html: string;
  vendor: string;
  variants: ShopifyProductVariant[];
}

// Helper function to ensure type safety when creating products
export function createShopifyProduct(
  product: Omit<ShopifyProduct, 'id'> & { id?: number }
): ShopifyProduct {
  return {
    id: product.id || Date.now(), // Generate a temporary ID if not provided
    ...product
  };
}

/**
 * Comprehensive Shopify Product CSV Import Interface
 * Covers all standard Shopify product import fields
 */
export interface ShopifyProductImport {
  // Basic Product Information
  Handle: string;
  Title: string;
  Body: string;
  'Product Category': string;
  Type: string;
  Tags: string;
  Published: boolean | string;

  // Product Options
  'Option1 Name'?: string;
  'Option1 Value'?: string;
  'Option2 Name'?: string;
  'Option2 Value'?: string;
  'Option3 Name'?: string;
  'Option3 Value'?: string;

  // Variant Details
  'Variant SKU'?: string;
  'Variant Grams'?: number;
  'Variant Inventory Tracker'?: string;
  'Variant Inventory Qty'?: number;
  'Variant Inventory Policy'?: 'deny' | 'continue';
  'Variant Fulfillment Service'?: string;
  'Variant Price'?: number;
  'Variant Compare At Price'?: number;
  'Variant Requires Shipping'?: boolean;
  'Variant Taxable'?: boolean;
  'Variant Barcode'?: string;

  // Image Information
  'Image Src'?: string;
  'Image Position'?: number;
  'Image Alt Text'?: string;
  'Variant Image'?: string;

  // Gift Card
  'Gift Card'?: boolean;

  // SEO Metadata
  'SEO Title'?: string;
  'SEO Description'?: string;

  // Google Shopping Metadata
  'Google Shopping / Google Product Category'?: string;
  'Google Shopping / Gender'?: 'male' | 'female' | 'unisex';
  'Google Shopping / Age Group'?: 'adult' | 'kids' | 'toddler' | 'infant';
  'Google Shopping / MPN'?: string;
  'Google Shopping / AdWords Grouping'?: string;
  'Google Shopping / AdWords Labels'?: string;
  'Google Shopping / Condition'?: 'new' | 'refurbished' | 'used';
  'Google Shopping / Custom Product'?: string;
  
  // Custom Labels
  'Google Shopping / Custom Label 0'?: string;
  'Google Shopping / Custom Label 1'?: string;
  'Google Shopping / Custom Label 2'?: string;
  'Google Shopping / Custom Label 3'?: string;
  'Google Shopping / Custom Label 4'?: string;

  // Additional Variant Details
  'Variant Weight Unit'?: 'g' | 'kg' | 'oz' | 'lb';
  'Variant Tax Code'?: string;
  
  // Pricing
  'Cost per item'?: number;
  'Price / International'?: number;
  'Compare At Price / International'?: number;

  // Status
  Status?: 'active' | 'draft' | 'archived';
}

/**
 * Utility type to create a mapping between CSV headers and their corresponding types
 */
export type ShopifyProductImportMapping = {
  [K in keyof ShopifyProductImport]: string;
};

/**
 * Function to validate and map CSV data to Shopify Product Import interface
 */
export function mapShopifyProductImport(
  data: Record<string, string>
): ShopifyProductImport {
  // Create a type-safe object with initial required fields
  const mappedProduct = {
    Handle: data['Handle'] || '',
    Title: data['Title'] || '',
    Body: data['Body (HTML)'] || '',
    'Product Category': data['Product Category'] || '',
    Type: data['Type'] || '',
    Tags: data['Tags'] || '',
    Published: data['Published'] === 'true' || data['Published'] === '1',
  } as ShopifyProductImport;

  // Define the fields that can be optionally mapped
  const optionalFields: Array<keyof ShopifyProductImport> = [
    'Option1 Name', 'Option1 Value',
    'Option2 Name', 'Option2 Value',
    'Option3 Name', 'Option3 Value',
    'Variant SKU', 'Variant Grams',
    'Variant Inventory Tracker', 'Variant Inventory Qty',
    'Variant Inventory Policy', 'Variant Fulfillment Service',
    'Variant Price', 'Variant Compare At Price',
    'Variant Requires Shipping', 'Variant Taxable',
    'Variant Barcode', 'Image Src',
    'Image Position', 'Image Alt Text',
    'Gift Card', 'SEO Title',
    'SEO Description', 'Google Shopping / Google Product Category',
    'Google Shopping / Gender', 'Google Shopping / Age Group',
    'Google Shopping / MPN', 'Google Shopping / AdWords Grouping',
    'Google Shopping / AdWords Labels', 'Google Shopping / Condition',
    'Google Shopping / Custom Product', 'Variant Image',
    'Variant Weight Unit', 'Variant Tax Code',
    'Cost per item', 'Price / International',
    'Compare At Price / International', 'Status'
  ];

  // Mapping function with type-safe assignment
  optionalFields.forEach((field) => {
    const csvHeader = field.replace(/\s*\/\s*/g, ' / ');
    const value = data[csvHeader];
    
    if (value !== undefined) {
      switch (field) {
        case 'Variant Grams':
        case 'Variant Inventory Qty':
        case 'Variant Price':
        case 'Variant Compare At Price':
        case 'Image Position':
        case 'Cost per item':
        case 'Price / International':
        case 'Compare At Price / International':
          (mappedProduct as any)[field] = value ? parseFloat(value) : undefined;
          break;
        
        case 'Variant Requires Shipping':
        case 'Variant Taxable':
        case 'Gift Card':
        case 'Published':
          (mappedProduct as any)[field] = value === 'true' || value === '1';
          break;
        
        default:
          (mappedProduct as any)[field] = value;
      }
    }
  });

  return mappedProduct;
}

// Type guard to validate Shopify Product Import
export function isValidShopifyProductImport(
  product: Partial<ShopifyProductImport>
): product is ShopifyProductImport {
  // Validate required fields
  return !!(
    product.Handle && 
    product.Title && 
    product.Body !== undefined
  );
}

// Validation function with detailed error reporting
export function validateShopifyProductImport(
  product: Partial<ShopifyProductImport>
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check required fields
  if (!product.Handle) errors.push('Handle is required');
  if (!product.Title) errors.push('Title is required');
  
  // Optional additional validations
  if (product['Variant Price'] && product['Variant Price'] < 0) {
    errors.push('Variant Price cannot be negative');
  }

  // Add more specific validations as needed

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * CSV Import Configuration for Shopify Products
 */
export const ShopifyProductImportConfig = {
  requiredFields: ['Handle', 'Title'],
  optionalFields: [
    'Body (HTML)', 'Product Category', 'Type', 'Tags', 'Published',
    'Option1 Name', 'Option1 Value', 
    'Option2 Name', 'Option2 Value', 
    'Option3 Name', 'Option3 Value'
  ],
  variantFields: [
    'Variant SKU', 'Variant Grams', 'Variant Inventory Tracker', 
    'Variant Inventory Qty', 'Variant Inventory Policy', 
    'Variant Fulfillment Service', 'Variant Price', 
    'Variant Compare At Price', 'Variant Requires Shipping', 
    'Variant Taxable', 'Variant Barcode'
  ],
  imageFields: [
    'Image Src', 'Image Position', 'Image Alt Text', 'Variant Image'
  ],
  seoFields: [
    'SEO Title', 'SEO Description'
  ],
  googleShoppingFields: [
    'Google Shopping / Google Product Category', 
    'Google Shopping / Gender', 
    'Google Shopping / Age Group', 
    'Google Shopping / MPN', 
    'Google Shopping / AdWords Grouping', 
    'Google Shopping / AdWords Labels', 
    'Google Shopping / Condition', 
    'Google Shopping / Custom Product',
    'Google Shopping / Custom Label 0',
    'Google Shopping / Custom Label 1',
    'Google Shopping / Custom Label 2',
    'Google Shopping / Custom Label 3',
    'Google Shopping / Custom Label 4'
  ]
};

export interface ShopifyProductTemplate {
  title: string;
  body_html?: string;
  vendor?: string;
  product_type?: string;
  tags?: string[];
  price: number;
  compare_at_price?: number;
  sku?: string;
  barcode?: string;
  inventory_quantity?: number;
  weight?: number;
  weight_unit?: 'kg' | 'lb';
  images?: string[];
}
