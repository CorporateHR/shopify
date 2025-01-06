import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

// Disable bodyParser to handle form data
export const config = {
  api: {
    bodyParser: false,
  },
};

// Function to map CSV or JSON file
async function mapFile(filepath: string, fileType: string): Promise<any[]> {
  try {
    if (fileType === 'text/csv') {
      // Use native Node.js CSV parsing
      const fileContent = await fs.readFile(filepath, 'utf-8');
      const lines = fileContent.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      
      return lines.slice(1).filter(line => line.trim()).map(line => {
        const values = line.split(',');
        return headers.reduce((obj, header, index) => {
          obj[header] = values[index] ? values[index].trim() : '';
          return obj;
        }, {} as Record<string, string>);
      });
    } else if (fileType === 'application/json') {
      const jsonContent = await fs.readFile(filepath, 'utf-8');
      return JSON.parse(jsonContent);
    } else {
      throw new Error('Unsupported file type for mapping');
    }
  } catch (error) {
    console.error('File mapping error:', error);
    throw error;
  }
}

// Function to generate a unique identifier for the mapped file
function generateUniqueId(): string {
  return crypto.randomBytes(16).toString('hex');
}

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Ensure uploads and mapped directories exist
  const uploadDir = path.join(process.cwd(), 'uploads');
  const mappedDir = path.join(process.cwd(), 'mapped');
  
  try {
    await Promise.all([uploadDir, mappedDir].map(async (dir) => {
      try {
        await fs.mkdir(dir, { recursive: true });
      } catch (err) {
        // Directory might already exist
        if ((err as NodeJS.ErrnoException).code !== 'EEXIST') {
          throw err;
        }
      }
    }));

    const form = formidable({
      uploadDir,
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
    });

    const [fields, files] = await form.parse(req);
    const file = files.file?.[0];

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Validate file type
    const allowedTypes = [
      'text/csv',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/json'
    ];

    if (!allowedTypes.includes(file.mimetype || '')) {
      await fs.unlink(file.filepath); // Clean up invalid file
      return res.status(400).json({ error: 'Invalid file type' });
    }

    // Map the file
    const mappedData = await mapFile(file.filepath, file.mimetype || '');

    // Generate a unique ID for this mapped file
    const mappedFileId = generateUniqueId();
    const mappedFilename = `mapped_${mappedFileId}.json`;
    const mappedFilepath = path.join(mappedDir, mappedFilename);

    // Save mapped data to a JSON file for later download
    await fs.writeFile(mappedFilepath, JSON.stringify(mappedData, null, 2));

    // Return success response with mapped file details
    return res.status(200).json({
      message: 'File uploaded and mapped successfully',
      mappedFileId: mappedFileId,
      originalFile: {
        filename: file.originalFilename,
        filepath: file.filepath,
        size: file.size,
        type: file.mimetype
      },
      mappedFileInfo: {
        id: mappedFileId,
        totalRecords: mappedData.length,
        headers: mappedData.length > 0 ? Object.keys(mappedData[0]) : []
      }
    });

  } catch (error) {
    console.error('Upload and mapping error:', error);
    return res.status(500).json({ 
      error: 'Error uploading and mapping file',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
