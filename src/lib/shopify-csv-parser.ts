import * as csv from 'csv-parse';
import * as fs from 'fs';
import * as path from 'path';
import { Readable } from 'stream';
import axios from 'axios';

export interface CSVParseOptions {
  delimiter?: string;
  trim?: boolean;
  skipEmptyLines?: boolean;
  columns?: boolean | string[];
}

export class ShopifyCSVParser {
  /**
   * Parse CSV from a string
   * @param csvString Raw CSV string
   * @param options Parsing options
   * @returns Promise resolving to parsed data
   */
  static async parseString(
    csvString: string, 
    options: CSVParseOptions = {}
  ): Promise<any[]> {
    const defaultOptions: CSVParseOptions = {
      delimiter: ',',
      trim: true,
      skipEmptyLines: true,
      columns: true
    };

    const mergedOptions = { ...defaultOptions, ...options };

    return new Promise((resolve, reject) => {
      csv.parse(
        csvString, 
        mergedOptions, 
        (err, records) => {
          if (err) reject(err);
          else resolve(records);
        }
      );
    });
  }

  /**
   * Parse CSV from a file
   * @param filePath Path to CSV file
   * @param options Parsing options
   * @returns Promise resolving to parsed data
   */
  static async parseFile(
    filePath: string, 
    options: CSVParseOptions = {}
  ): Promise<any[]> {
    try {
      const fileContents = await fs.promises.readFile(filePath, 'utf8');
      return this.parseString(fileContents, options);
    } catch (error) {
      throw new Error(`Failed to read CSV file: ${error instanceof Error ? error.message : error}`);
    }
  }

  /**
   * Parse CSV from a stream
   * @param stream Readable stream containing CSV data
   * @param options Parsing options
   * @returns Promise resolving to parsed data
   */
  static parseStream(
    stream: Readable, 
    options: CSVParseOptions = {}
  ): Promise<any[]> {
    const defaultOptions: CSVParseOptions = {
      delimiter: ',',
      trim: true,
      skipEmptyLines: true,
      columns: true
    };

    const mergedOptions = { ...defaultOptions, ...options };

    return new Promise((resolve, reject) => {
      const records: any[] = [];

      stream
        .pipe(csv.parse(mergedOptions))
        .on('data', (record) => records.push(record))
        .on('error', (err) => reject(err))
        .on('end', () => resolve(records));
    });
  }

  /**
   * Convert parsed CSV to JSON
   * @param parsedData Parsed CSV data
   * @returns Transformed JSON data
   */
  static toJSON(parsedData: any[]): any[] {
    return parsedData.map(row => {
      // Remove any undefined or null values
      const cleanedRow: any = {};
      Object.keys(row).forEach(key => {
        if (row[key] !== undefined && row[key] !== null) {
          cleanedRow[key] = row[key];
        }
      });
      return cleanedRow;
    });
  }

  /**
   * Download and parse CSV from a URL
   * @param url URL of the CSV file
   * @param accessToken Authentication token
   * @returns Promise resolving to parsed data
   */
  static async downloadAndParse(
    url: string, 
    accessToken: string
  ): Promise<any[]> {
    try {
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'text/csv'
        }
      });

      return await this.parseString(response.data);
    } catch (error) {
      console.error('CSV Download Error:', error);
      throw error;
    }
  }

  /**
   * Transform Shopify CSV data based on mapping
   * @param data Raw CSV data
   * @param mapping Mapping configuration
   * @returns Transformed data
   */
  static transformShopifyData(
    data: any[], 
    mapping: Record<string, string>
  ): any[] {
    return data.map(row => {
      const transformedRow: Record<string, any> = {};
      
      Object.entries(mapping).forEach(([sourceKey, targetKey]) => {
        transformedRow[targetKey] = row[sourceKey] || null;
      });

      return transformedRow;
    });
  }
}

// Predefined Shopify CSV Mappings
export const SHOPIFY_CSV_MAPPINGS = {
  products: {
    'Handle': 'handle',
    'Title': 'title',
    'Body (HTML)': 'description',
    'Vendor': 'vendor',
    'Type': 'product_type',
    'Tags': 'tags',
    'Published': 'published',
    'Option1 Name': 'option1_name',
    'Option1 Value': 'option1_value',
    'Variant Price': 'price',
    'Variant SKU': 'sku',
    'Variant Inventory Qty': 'inventory_quantity'
  },
  orders: {
    'Name': 'order_name',
    'Created At': 'created_at',
    'Financial Status': 'financial_status',
    'Fulfillment Status': 'fulfillment_status',
    'Total Price': 'total_price',
    'Customer Email': 'customer_email',
    'Shipping City': 'shipping_city',
    'Shipping Country': 'shipping_country'
  },
  customers: {
    'Email': 'email',
    'First Name': 'first_name', 
    'Last Name': 'last_name',
    'Total Spent': 'total_spent',
    'Total Orders': 'total_orders',
    'Accepts Marketing': 'accepts_marketing',
    'Created At': 'created_at',
    'Updated At': 'updated_at',
    'Phone': 'phone',
    'Address1': 'address1',
    'City': 'city',
    'Province': 'province',
    'Country': 'country',
    'Zip': 'zip'
  }
};
