import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import path from 'path';
import { getShopifyTemplateHeaders } from '../../utils/shopify-template';

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { fileId, format } = req.query;

  if (!fileId || typeof fileId !== 'string') {
    return res.status(400).json({ error: 'File ID is required' });
  }

  // Validate format
  const validFormats = ['csv', 'json'];
  const requestedFormat = format && typeof format === 'string' ? format.toLowerCase() : 'csv';
  
  if (!validFormats.includes(requestedFormat)) {
    return res.status(400).json({ error: 'Invalid format. Supported formats: csv, json' });
  }

  try {
    // Locate the mapped file
    const mappedDir = path.join(process.cwd(), 'mapped');
    const mappedFilepath = path.join(mappedDir, `mapped_${fileId}.json`);

    console.log('Reading file from:', mappedFilepath);

    // Check if file exists
    try {
      await fs.access(mappedFilepath);
    } catch {
      return res.status(404).json({ error: 'Mapped file not found' });
    }

    // Read the mapped data
    const rawData = await fs.readFile(mappedFilepath, 'utf-8');
    console.log('Raw data length:', rawData.length);
    
    const mappedData = JSON.parse(rawData);
    console.log('Parsed data length:', mappedData.length);
    console.log('Sample row:', mappedData[0]);

    // Convert to requested format
    if (requestedFormat === 'csv') {
      // Convert JSON to CSV
      if (mappedData.length === 0) {
        return res.status(400).json({ error: 'No data to convert' });
      }

      // Get headers in the correct order
      const headers = getShopifyTemplateHeaders();
      console.log('Headers:', headers);
      
      // Transform the data to match the Shopify template structure
      const transformedData = mappedData.map((row: any) => {
        const transformedRow: Record<string, any> = {};
        headers.forEach(header => {
          // Get the value from the mapped data, or use empty string if not found
          const value = row[header];
          transformedRow[header] = value !== undefined && value !== null ? value : '';
          
          // If value is empty, try to find it in the original data with case-insensitive match
          if (!transformedRow[header]) {
            const key = Object.keys(row).find(k => 
              k.toLowerCase() === header.toLowerCase() ||
              k.toLowerCase().includes(header.toLowerCase()) ||
              header.toLowerCase().includes(k.toLowerCase())
            );
            if (key) {
              transformedRow[header] = row[key];
            }
          }
        });
        return transformedRow;
      });

      console.log('First transformed row:', transformedData[0]);

      // Create CSV content with proper escaping
      const csvRows = [
        headers.join(','),
        ...transformedData.map(row => 
          headers.map(header => {
            const value = row[header];
            // Handle different value types and ensure proper escaping
            if (value === null || value === undefined) return '""';
            if (typeof value === 'string') {
              // Escape quotes and wrap in quotes
              return `"${value.replace(/"/g, '""')}"`;
            }
            if (typeof value === 'number' || typeof value === 'boolean') {
              return `"${value}"`;
            }
            if (Array.isArray(value)) {
              return `"${value.join(', ').replace(/"/g, '""')}"`;
            }
            return '""';
          }).join(',')
        )
      ];

      const csvContent = csvRows.join('\n');
      console.log('CSV first few lines:', csvContent.split('\n').slice(0, 3));

      // Set headers for CSV download
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=mapped_${fileId}.csv`);
      return res.status(200).send(csvContent);
    } else {
      // JSON download
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename=mapped_${fileId}.json`);
      return res.status(200).send(rawData);
    }

  } catch (error) {
    console.error('Download error:', error);
    return res.status(500).json({ 
      error: 'Error downloading mapped file',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}