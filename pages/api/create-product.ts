import type { NextApiRequest, NextApiResponse } from 'next';
import Shopify from 'shopify-api-node';

// Interface for product creation request
interface ProductCreationRequest {
  title: string;
  description: string;
  price: string;
  sku: string;
  vendor?: string;
  quantity: string;
}

// Interface for product creation response
interface ProductCreationResponse {
  id: string;
  title: string;
  price: string;
  inventory: number;
}

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse<ProductCreationResponse | { error: string }>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Check for Shopify store credentials
  const shopName = process.env.NEXT_PUBLIC_SHOPIFY_SHOP_DOMAIN;
  const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;

  if (!shopName || !accessToken) {
    return res.status(401).json({ 
      error: 'Shopify store credentials are not configured' 
    });
  }

  try {
    // Validate request body
    const { 
      title, 
      description, 
      price, 
      sku, 
      vendor, 
      quantity 
    } = req.body as ProductCreationRequest;

    // Validate required fields
    if (!title || !description || !price || !sku || !quantity) {
      return res.status(400).json({ 
        error: 'Missing required fields for product creation' 
      });
    }

    // Initialize Shopify client
    const shopify = new Shopify({
      shopName,
      accessToken
    });

    // Create product
    const product = await shopify.product.create({
      title,
      body_html: description,
      vendor: vendor || 'Default Vendor',
      variants: [{
        price,
        sku,
        inventory_quantity: parseInt(quantity, 10)
      }]
    });

    // Return created product details
    return res.status(201).json({
      id: product.id.toString(),
      title: product.title,
      price: product.variants[0].price,
      inventory: product.variants[0].inventory_quantity || 0
    });

  } catch (error) {
    console.error('Product creation error:', error);
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    });
  }
}
