import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { shopifyApi, LATEST_API_VERSION } from '@shopify/shopify-api';
import { TokenManager } from '@/utils/server/token-manager';

// Configure Shopify API
const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY || '',
  apiSecretKey: process.env.SHOPIFY_API_SECRET || '',
  scopes: ['read_products', 'read_orders', 'read_store'],
  hostName: '',
  isEmbeddedApp: false,
  apiVersion: LATEST_API_VERSION
});

// Updated store connection schema to match frontend
const storeConnectionSchema = z.object({
  storeName: z.string().min(2, { message: "Store name must be at least 2 characters" }),
  storeUrl: z.string().url({ message: "Please enter a valid store URL" }),
  apiKey: z.string().min(10, { message: "API Key must be at least 10 characters" }),
  apiSecretKey: z.string().min(10, { message: "API Secret Key must be at least 10 characters" }),
  apiAccessToken: z.string().min(10, { message: "API Access Token must be at least 10 characters" }),
  apiScopes: z.string().optional(),
  webhookSecret: z.string().optional()
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      // Validate incoming request body
      const validatedData = storeConnectionSchema.parse(req.body);

      // Extract store domain from URL
      const storeDomain = new URL(validatedData.storeUrl).hostname;

      // Create a REST client
      const session = shopify.session.customAppSession(storeDomain);
      session.accessToken = validatedData.apiAccessToken;

      // Create a REST client with the session
      const client = new shopify.clients.Rest({ session });

      // Fetch store information
      let storeInfo, productsCount, ordersCount;
      
      try {
        // Fetch shop details
        const shopResponse = await client.get({
          path: 'shop',
        });
        storeInfo = shopResponse.body;
      } catch (shopError) {
        console.error('Shop Fetch Error:', shopError);
      }

      try {
        // Fetch products count
        const productsResponse = await client.get({
          path: 'products/count',
        });
        productsCount = productsResponse.body;
      } catch (productsError) {
        console.error('Products Count Error:', productsError);
      }

      try {
        // Fetch orders count
        const ordersResponse = await client.get({
          path: 'orders/count',
        });
        ordersCount = ordersResponse.body;
      } catch (ordersError) {
        console.error('Orders Count Error:', ordersError);
      }

      // Save store connection details
      await TokenManager.saveStoreConnection({
        storeUrl: validatedData.storeUrl,
        accessToken: validatedData.apiAccessToken,
        storeName: validatedData.storeName,
        storeInfo,
        productsCount: productsCount?.count,
        ordersCount: ordersCount?.count,
        connectedAt: new Date().toISOString()
      });

      // Comprehensive logging of received data and API responses
      console.log('Shopify Store Connection Details:', {
        storeName: validatedData.storeName,
        storeUrl: validatedData.storeUrl,
        storeInfo,
        productsCount,
        ordersCount
      });

      // Successful connection
      res.status(200).json({ 
        success: true,
        message: 'Store connected successfully', 
        store: {
          storeName: validatedData.storeName,
          storeUrl: validatedData.storeUrl,
          storeInfo,
          productsCount: productsCount?.count,
          ordersCount: ordersCount?.count,
          connectedAt: new Date().toISOString()
        }
      });

    } catch (error) {
      // Handle validation errors
      if (error instanceof z.ZodError) {
        console.error('Validation Error:', error.errors);
        return res.status(400).json({ 
          success: false,
          message: 'Invalid store connection details',
          errors: error.errors 
        });
      }

      // Handle Shopify API errors
      console.error('Store Connection Error:', error);
      
      // Detailed error response
      res.status(500).json({ 
        success: false,
        message: 'Failed to connect store',
        error: error instanceof Error 
          ? {
              name: error.name,
              message: error.message,
              stack: error.stack
            }
          : 'Unknown error',
        rawError: JSON.stringify(error)
      });
    }
  } else {
    // Handle unsupported HTTP methods
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
