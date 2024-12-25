import type { NextApiRequest, NextApiResponse } from 'next';
import { shopifyApi, LATEST_API_VERSION } from '@shopify/shopify-api';
import { GetRequestParams } from '@/types/api';

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

  if (req.method === 'GET') {
    const { 
      page = '1', 
      limit = '10', 
      query = '' 
    } = req.query as GetRequestParams;

    // Convert to number safely
    const pageNum = Number(page);
    const limitNum = Number(limit);

    try {
      // Log request details
      console.log('Request Headers:', req.headers);
      console.log('Request Method:', req.method);
      console.log('Environment Variables:', {
        SHOPIFY_STORE_DOMAIN: process.env.SHOPIFY_STORE_DOMAIN ? 'SET' : 'UNSET',
        SHOPIFY_ACCESS_TOKEN: process.env.SHOPIFY_ACCESS_TOKEN ? 'SET' : 'UNSET'
      });

      // Retrieve store credentials from environment or database
      const storeDomain = process.env.SHOPIFY_STORE_DOMAIN;
      const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;

      if (!storeDomain || !accessToken) {
        console.error('Missing store credentials', { storeDomain, accessToken });
        return res.status(400).json({ 
          message: 'Store credentials not configured',
          details: {
            storeDomain: !!storeDomain,
            accessToken: !!accessToken
          }
        });
      }

      // Configure Shopify API
      const shopify = shopifyApi({
        apiKey: process.env.SHOPIFY_API_KEY || '',
        apiSecretKey: process.env.SHOPIFY_API_SECRET || '',
        scopes: ['read_products'],
        hostName: storeDomain,
        isEmbeddedApp: false,
        apiVersion: LATEST_API_VERSION
      });

      // Create a session
      const session = shopify.session.customAppSession(storeDomain);
      session.accessToken = accessToken;

      // Create a REST client
      const client = new shopify.clients.Rest({ session });

      // Fetch products with error handling
      let products: any[] = [];
      try {
        const productsResponse = await client.get({
          path: 'products',
          params: { limit: limitNum }  // Adjust limit as needed
        });
        
        products = productsResponse.body?.products || [];
      } catch (fetchError) {
        console.error('Products Fetch Error:', fetchError);
      }

      // Transform products to match our interface
      const formattedProducts = products.map((product: any) => ({
        id: product.id.toString(),
        title: product.title,
        price: parseFloat(product.variants[0]?.price || '0'),
        inventory: product.variants.reduce(
          (total: number, variant: any) => total + (variant.inventory_quantity || 0), 
          0
        ),
        // Additional product details
        description: product.body_html || '',
        vendor: product.vendor || '',
        productType: product.product_type || '',
        tags: product.tags ? product.tags.split(',') : []
      }));

      // Return formatted products with metadata
      res.status(200).json({
        products: formattedProducts,
        page: pageNum,
        limit: limitNum,
        total: formattedProducts.length,
        fetchTimestamp: new Date().toISOString()
      });

    } catch (error) {
      // Comprehensive error logging
      console.error('Products Fetch Error:', {
        errorName: error instanceof Error ? error.name : 'Unknown Error',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        errorStack: error instanceof Error ? error.stack : 'No stack trace'
      });

      // Send detailed error response
      res.status(500).json({ 
        message: 'Failed to fetch products',
        error: {
          name: error instanceof Error ? error.name : 'Unknown Error',
          message: error instanceof Error ? error.message : 'Unknown error',
          details: error instanceof Error ? error.stack : 'No additional details'
        }
      });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
