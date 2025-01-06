import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import path from 'path';

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

    // Check if file exists
    try {
      await fs.access(mappedFilepath);
    } catch {
      return res.status(404).json({ error: 'Mapped file not found' });
    }

    // Read the mapped data
    const rawData = await fs.readFile(mappedFilepath, 'utf-8');
    const mappedData = JSON.parse(rawData);

    // Convert to requested format
    if (requestedFormat === 'csv') {
      // Convert JSON to CSV
      if (mappedData.length === 0) {
        return res.status(400).json({ error: 'No data to convert' });
      }

      const headers = Object.keys(mappedData[0]);
      const csvRows = [
        headers.join(','),
        ...mappedData.map(row => 
          headers.map(header => 
            row[header] !== undefined ? 
              `"${String(row[header]).replace(/"/g, '""')}"` : 
              '""'
          ).join(',')
        )
      ];

      const csvContent = csvRows.join('\n');

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
