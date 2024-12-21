import Papa from 'papaparse';
import { DEFAULT_TEMPLATE } from './csv-template';

// Enhanced mapping configuration interface
export interface CSVMappingConfig {
  // Custom column name mappings
  columnMappings?: Record<string, string>;
  
  // Default values for missing fields
  defaultValues?: Record<string, string>;
  
  // Fields that must be present or have a default
  requiredFields?: string[];
  
  // Custom transformation functions for specific fields
  transformations?: {
    [key: string]: (value: string) => string | number | boolean;
  };
}

// Default mapping configuration
const DEFAULT_MAPPING_CONFIG: CSVMappingConfig = {
  columnMappings: {
    // Common alternative column names
    'Product Name': 'Title',
    'Description': 'Body (HTML)',
    'Brand': 'Vendor',
    'Price': 'Variant Price',
    'SKU': 'Variant SKU'
  },
  defaultValues: {
    'Published': 'TRUE',
    'Variant Inventory Policy': 'deny',
    'Variant Fulfillment Service': 'manual',
    'Status': 'active',
    'Variant Requires Shipping': 'TRUE',
    'Variant Taxable': 'TRUE'
  },
  requiredFields: [
    'Title', 
    'Variant Price', 
    'Variant SKU', 
    'Published'
  ],
  transformations: {
    // Example: Normalize price to ensure it's a number
    'Variant Price': (value: string) => {
      const numericPrice = parseFloat(value.replace(/[^0-9.-]+/g, ''));
      return isNaN(numericPrice) ? '0' : numericPrice.toFixed(2);
    },
    // Example: Ensure boolean fields are properly formatted
    'Published': (value: string) => {
      return ['true', '1', 'yes'].includes(value.toLowerCase()) ? 'TRUE' : 'FALSE';
    }
  }
};

/**
 * Advanced CSV to Shopify template mapper
 * @param csvContent Raw CSV content
 * @param customConfig Optional custom mapping configuration
 * @returns Transformed CSV in Shopify template format
 */
export function mapCSVToShopifyTemplate(
  csvContent: string, 
  customConfig: CSVMappingConfig = {}
): string {
  // Merge default and custom configurations
  const config: CSVMappingConfig = {
    ...DEFAULT_MAPPING_CONFIG,
    ...customConfig,
    columnMappings: {
      ...DEFAULT_MAPPING_CONFIG.columnMappings,
      ...customConfig.columnMappings
    },
    defaultValues: {
      ...DEFAULT_MAPPING_CONFIG.defaultValues,
      ...customConfig.defaultValues
    },
    transformations: {
      ...DEFAULT_MAPPING_CONFIG.transformations,
      ...customConfig.transformations
    }
  };

  // Parse CSV
  const parsedCSV = Papa.parse(csvContent, { header: true });
  
  // Get Shopify headers from default template
  const shopifyHeaders = DEFAULT_TEMPLATE.split('\n')[0].split(',');
  
  // Transform rows
  const outputRows = parsedCSV.data.map((row: any) => {
    const outputRow: string[] = new Array(shopifyHeaders.length).fill('');

    // Map columns
    shopifyHeaders.forEach((header, index) => {
      // Check for direct match or mapped column
      const sourceColumn = Object.keys(config.columnMappings || {})
        .find(key => config.columnMappings?.[key] === header) || header;
      
      let value: string = row[sourceColumn] as string || '';

      // Apply transformations if exists
      if (config.transformations?.[header]) {
        const transformedValue = config.transformations[header](value);
        value = typeof transformedValue === 'string' 
          ? transformedValue 
          : String(transformedValue);
      }

      // Use value or default
      if (value) {
        outputRow[index] = value;
      } else if (config.defaultValues?.[header]) {
        outputRow[index] = String(config.defaultValues[header]);
      }
    });

    // Validate required fields
    config.requiredFields?.forEach(field => {
      const fieldIndex = shopifyHeaders.indexOf(field);
      if (fieldIndex !== -1 && !outputRow[fieldIndex]) {
        console.warn(`Missing required field: ${field}`);
      }
    });

    return outputRow;
  });

  // Convert back to CSV string
  return [shopifyHeaders.join(','), ...outputRows.map(row => row.join(','))].join('\n');
}

/**
 * Validate a single Shopify product row
 * @param row Product row data
 * @returns Boolean indicating if the row is valid
 */
export function validateShopifyProduct(row: Record<string, unknown>): boolean {
  // Basic validation checks
  return !!(
    row['Title'] && 
    row['Variant Price'] && 
    row['Variant SKU']
  );
}

/**
 * Map a single CSV row to Shopify product template
 * @param csvRow CSV row data
 * @returns Mapped Shopify product template
 */
export function mapCSVToShopifyProduct(csvRow: Record<string, unknown>): Record<string, unknown> {
  // Basic mapping logic
  return {
    title: csvRow['Title'] || '',
    body_html: csvRow['Body (HTML)'] || '',
    vendor: csvRow['Vendor'] || '',
    product_type: csvRow['Type'] || '',
    published: csvRow['Published'] === 'TRUE',
    price: csvRow['Variant Price'] ? parseFloat(csvRow['Variant Price'] as string) : 0,
    sku: csvRow['Variant SKU'] || '',
    inventory_policy: csvRow['Variant Inventory Policy'] || 'deny',
    fulfillment_service: csvRow['Variant Fulfillment Service'] || 'manual'
  };
}
