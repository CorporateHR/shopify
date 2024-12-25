import type { NextApiRequest, NextApiResponse } from 'next';
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
    // Comprehensive environment variable logging
    const diagnosticInfo = {
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
      credentials: {
        storeDomain: {
          exists: !!process.env.SHOPIFY_STORE_DOMAIN,
          value: process.env.SHOPIFY_STORE_DOMAIN 
            ? process.env.SHOPIFY_STORE_DOMAIN.substring(0, 5) + '...' 
            : null
        },
        apiKey: {
          exists: !!process.env.SHOPIFY_API_KEY,
          value: process.env.SHOPIFY_API_KEY 
            ? process.env.SHOPIFY_API_KEY.substring(0, 5) + '...' 
            : null
        },
        apiSecret: {
          exists: !!process.env.SHOPIFY_API_SECRET,
          value: process.env.SHOPIFY_API_SECRET 
            ? process.env.SHOPIFY_API_SECRET.substring(0, 5) + '...' 
            : null
        },
        accessToken: {
          exists: !!process.env.SHOPIFY_ACCESS_TOKEN,
          value: process.env.SHOPIFY_ACCESS_TOKEN 
            ? process.env.SHOPIFY_ACCESS_TOKEN.substring(0, 5) + '...' 
            : null
        }
      }
    };

    // Validate required credentials
    const requiredVars = [
      'SHOPIFY_STORE_DOMAIN', 
      'SHOPIFY_API_KEY', 
      'SHOPIFY_API_SECRET', 
      'SHOPIFY_ACCESS_TOKEN'
    ];

    const missingVars = requiredVars.filter(
      varName => !process.env[varName]
    );

    if (missingVars.length > 0) {
      return res.status(400).json({
        message: 'Missing required Shopify credentials',
        missingVariables: missingVars,
        diagnosticInfo
      });
    }

    // Configure Shopify API
    const shopify = shopifyApi({
      apiKey: process.env.SHOPIFY_API_KEY || '',
      apiSecretKey: process.env.SHOPIFY_API_SECRET || '',
      scopes: [
        'read_products', 
        'read_orders', 
        'read_customers'
      ],
      hostName: process.env.SHOPIFY_STORE_DOMAIN || '',
      isEmbeddedApp: false,
      apiVersion: LATEST_API_VERSION
    });

    // Create a session
    const session = shopify.session.customAppSession(
      process.env.SHOPIFY_STORE_DOMAIN || ''
    );
    session.accessToken = process.env.SHOPIFY_ACCESS_TOKEN || '';

    // Create a REST client
    const client = new shopify.clients.Rest({ session });

    // Perform diagnostic API calls
    const diagnosticResults: Record<string, any> = {};

    try {
      // Test products count
      const productsResponse = await client.get({
        path: 'products/count'
      });
      diagnosticResults.productsCount = productsResponse.body?.count;
    } catch (productError) {
      diagnosticResults.productsError = String(productError);
    }

    try {
      // Test orders count
      const ordersResponse = await client.get({
        path: 'orders/count'
      });
      diagnosticResults.ordersCount = ordersResponse.body?.count;
    } catch (orderError) {
      diagnosticResults.ordersError = String(orderError);
    }

    try {
      // Test store information
      const shopResponse = await client.get({
        path: 'shop'
      });
      diagnosticResults.shopInfo = {
        name: shopResponse.body?.shop?.name,
        primaryDomain: shopResponse.body?.shop?.primary_domain?.host
      };
    } catch (shopError) {
      diagnosticResults.shopError = String(shopError);
    }

    // Comprehensive diagnostic response
    res.status(200).json({
      message: 'Shopify API Diagnostic Complete',
      diagnosticInfo,
      diagnosticResults,
      status: 'success'
    });

  } catch (error) {
    // Comprehensive error logging
    console.error('Shopify Diagnostic Error:', {
      errorName: error instanceof Error ? error.name : 'Unknown Error',
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      errorStack: error instanceof Error ? error.stack : 'No stack trace'
    });

    // Send detailed error response
    res.status(500).json({ 
      message: 'Shopify API Diagnostic Failed',
      error: {
        name: error instanceof Error ? error.name : 'Unknown Error',
        message: error instanceof Error ? error.message : 'Unknown error',
        details: error instanceof Error ? error.stack : 'No additional details'
      }
    });
  }
}
