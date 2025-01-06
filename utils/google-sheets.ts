import { google } from 'googleapis';

export class GoogleSheetsService {
  async appendToSheet(values: any[][]): Promise<void> {
    try {
      const response = await fetch('/api/sheets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ values }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to append to Google Sheet');
      }
    } catch (error) {
      console.error('Error appending to Google Sheet:', error);
      throw error;
    }
  }

  // Transform mapped data to match sheet columns
  transformData(data: any[], fieldMapping: Record<string, string>): any[][] {
    const sheetColumns = [
      'Product Name', 'Benefits', 'Features', 'Used by', 'Price',
      'Product Type', 'Quantity', 'Image', 'Vendor', 'Status',
      'Tags', 'Description'
    ];

    return data.map(item => {
      return sheetColumns.map(column => {
        const mappedField = Object.entries(fieldMapping)
          .find(([_, target]) => target === column)?.[0];
        return mappedField ? item[mappedField] : '';
      });
    });
  }
}

// Create and export a singleton instance
export const googleSheetsService = new GoogleSheetsService();
