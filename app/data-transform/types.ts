// Data Transformation Types

export interface SourceColumn {
  name: string;
  dataType: 'string' | 'number' | 'date' | 'boolean';
  sampleValues: string[];
}

export interface ShopifyColumn {
  name: string;
  required: boolean;
  description: string;
}

export interface ColumnMapping {
  sourceColumn: SourceColumn;
  shopifyColumn?: ShopifyColumn;
  confidence: number;
  status: 'unmatched' | 'partial' | 'matched';
  transformationRules?: TransformationRule[];
}

export interface TransformationRule {
  type: 'trim' | 'lowercase' | 'uppercase' | 'replace' | 'default';
  parameters?: Record<string, string | number>;
}

export interface DataTransformationState {
  originalData: Record<string, any>[];
  mappings: ColumnMapping[];
  errors: DataValidationError[];
  transformedPreview?: Record<string, any>[];
}

export interface DataValidationError {
  type: 'missing_column' | 'type_mismatch' | 'format_error';
  severity: 'warning' | 'critical';
  message: string;
  affectedColumns?: string[];
}

export interface ImportConfiguration {
  delimiter: string;
  encoding: string;
  hasHeaderRow: boolean;
  trimWhitespace: boolean;
}

// Shopify-specific constants
export const SHOPIFY_REQUIRED_COLUMNS: ShopifyColumn[] = [
  {
    name: 'Handle',
    required: true,
    description: 'Unique product identifier for URL'
  },
  {
    name: 'Title',
    required: true,
    description: 'Product name displayed to customers'
  },
  {
    name: 'Body (HTML)',
    required: false,
    description: 'Product description with HTML formatting'
  },
  {
    name: 'Vendor',
    required: false,
    description: 'Product manufacturer or brand'
  },
  {
    name: 'Price',
    required: true,
    description: 'Product selling price'
  }
  // Add more Shopify columns as needed
];
