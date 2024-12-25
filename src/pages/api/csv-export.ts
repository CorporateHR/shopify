import type { NextApiRequest, NextApiResponse } from 'next';
import { ShopifyCSVParser } from '@/lib/shopify-csv-parser';
import { shopifyApi, LATEST_API_VERSION } from '@shopify/shopify-api';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Retrieve store credentials from environment
    const storeDomain = process.env.SHOPIFY_STORE_DOMAIN;
    const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;

    if (!storeDomain || !accessToken) {
      return res.status(400).json({ 
        message: 'Store credentials not configured' 
      });
    }

    // Configure Shopify API
    const shopify = shopifyApi({
      apiKey: process.env.SHOPIFY_API_KEY || '',
      apiSecretKey: process.env.SHOPIFY_API_SECRET || '',
      scopes: ['read_products', 'read_orders', 'read_customers'],
      hostName: storeDomain,
      isEmbeddedApp: false,
      apiVersion: LATEST_API_VERSION
    });

    // Create a session
    const session = shopify.session.customAppSession(storeDomain);
    session.accessToken = accessToken;

    // Create a REST client
    const client = new shopify.clients.Rest({ session });

    // Determine export type from query
    const { type = 'products' } = req.query;

    // Mapping for different export types
    const exportEndpoints: Record<string, string> = {
      products: 'products/export',
      orders: 'orders/export',
      customers: 'customers/export'
    };

    // Validate export type
    if (!exportEndpoints[type as string]) {
      return res.status(400).json({ 
        message: 'Invalid export type',
        validTypes: Object.keys(exportEndpoints)
      });
    }

    // Fetch CSV export
    const csvResponse = await client.get({
      path: exportEndpoints[type as string],
      // Optional: Add query parameters for filtering
      params: {
        // Example filters
        limit: 250,
        fields: 'id,title,price,inventory_quantity'
      }
    });

    // Parse CSV 
    const csvString = csvResponse.body as string;
    const parsedData = await ShopifyCSVParser.parseString(csvString);
    const transformedData = ShopifyCSVParser.transformShopifyData(
      parsedData, 
      // Use predefined or custom mappings
      type === 'products' 
        ? { 'Title': 'name', 'Price': 'price' } 
        : {}
    );

    // Return parsed and transformed data
    res.status(200).json({
      type: type as string,
      totalRecords: transformedData.length,
      data: transformedData,
      fetchTimestamp: new Date().toISOString()
    });

  } catch (error) {
    // Comprehensive error logging
    console.error('CSV Export Error:', {
      errorName: error instanceof Error ? error.name : 'Unknown Error',
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      errorStack: error instanceof Error ? error.stack : 'No stack trace'
    });

    // Send detailed error response
    res.status(500).json({ 
      message: 'Failed to export CSV',
      error: {
        name: error instanceof Error ? error.name : 'Unknown Error',
        message: error instanceof Error ? error.message : 'Unknown error',
        details: error instanceof Error ? error.stack : 'No additional details'
      }
    });
  }
}
