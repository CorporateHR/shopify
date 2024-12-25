import type { NextApiRequest, NextApiResponse } from 'next';
import { default as Shopify } from 'shopify-api-node';

// Enhanced logging utility
function logRequest(req: NextApiRequest) {
  console.log('------- Incoming Store Connection Request -------');
  console.log('Request Method:', req.method);
  console.log('Request Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Request Body:', JSON.stringify(req.body, null, 2));
  console.log('Request Query:', JSON.stringify(req.query, null, 2));
  console.log('------- End Request Log -------');
}

// Validation utility
function validateStoreUrl(url: string): boolean {
  const shopifyDomainRegex = /^[a-zA-Z0-9-]+\.myshopify\.com$/;
  return shopifyDomainRegex.test(url.replace(/^https?:\/\//, ''));
}

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse
) {
  // Log the entire incoming request for debugging
  logRequest(req);

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method Not Allowed. Only POST requests are supported.' 
    });
  }

  try {
    // Parse request body with error handling
    const body = req.body;
    
    // Detailed body validation
    const validationErrors: Record<string, string> = {};

    // Validate store URL
    const cleanStoreUrl = body.storeUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
    if (!body.storeUrl) {
      validationErrors.storeUrl = 'Store URL is required';
    } else if (!validateStoreUrl(cleanStoreUrl)) {
      validationErrors.storeUrl = 'Invalid Shopify store URL format. Must be like your-store.myshopify.com';
    }

    // Validate credentials
    if (!body.apiKey) {
      validationErrors.apiKey = 'API Key is required';
    }

    if (!body.accessToken) {
      validationErrors.accessToken = 'Access Token is required';
    }

    // If any validation errors, return detailed response
    if (Object.keys(validationErrors).length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    // Configure Shopify API Client
    const shopify = new Shopify({
      shopName: cleanStoreUrl,
      apiKey: body.apiKey,
      password: body.accessToken
    });

    // Verify store connection by fetching basic shop information
    const shopInfo = await shopify.shop.get();

    // Successful connection response
    res.status(200).json({ 
      success: true, 
      message: 'Store connected successfully',
      store: {
        name: shopInfo.name,
        primaryDomain: shopInfo.domain,
        timezone: shopInfo.iana_timezone,
        shopOwner: shopInfo.shop_owner,
        connectedAt: new Date().toISOString()
      },
      credentials: {
        storeUrl: cleanStoreUrl,
        apiKeyProvided: !!body.apiKey,
        accessTokenProvided: !!body.accessToken
      }
    });

  } catch (error) {
    // Log the full error for debugging
    console.error('Store Connection Error:', error);

    // Handle specific Shopify API errors
    if (error instanceof Error) {
      // Authentication failures
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        return res.status(401).json({ 
          success: false, 
          message: 'Authentication failed. Check your API credentials.',
          error: error.message 
        });
      }

      // Network or connection issues
      if (error.message.includes('ENOTFOUND') || error.message.includes('network')) {
        return res.status(503).json({ 
          success: false, 
          message: 'Unable to connect to Shopify. Check your store URL and network connection.',
          error: error.message 
        });
      }

      // Generic server error
      return res.status(500).json({ 
        success: false, 
        message: 'Unexpected error during store connection',
        error: {
          message: error.message,
          name: error.name
        }
      });
    }

    // Fallback for unexpected errors
    res.status(500).json({ 
      success: false, 
      message: 'An unknown error occurred',
      error: String(error)
    });
  }
}
