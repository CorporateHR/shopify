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

    // Retrieve store credentials from environment
    const shopName = process.env.SHOPIFY_STORE_DOMAIN;
    const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;

    if (!shopName || !accessToken) {
      return res.status(401).json({ 
        error: 'Shopify store credentials are not configured' 
      });
    }

    // Initialize Shopify client
    const shopify = new Shopify({
      shopName: shopName,
      accessToken: accessToken
    });

    // Prepare product data for Shopify
    const productData = {
      title: title,
      body_html: description,
      vendor: vendor || '',
      product_type: '',
      tags: [],
      variants: [{
        price: price,
        sku: sku,
        inventory_quantity: parseInt(quantity, 10).toString(),
        inventory_management: 'shopify'
      }]
    };

    // Create product in Shopify
    const createdProduct = await shopify.product.create(productData);

    // Prepare response
    const response: ProductCreationResponse = {
      id: createdProduct.id.toString(),
      title: createdProduct.title,
      price: createdProduct.variants[0]?.price || price,
      inventory: createdProduct.variants[0]?.inventory_quantity 
        ? parseInt(createdProduct.variants[0].inventory_quantity, 10) 
        : parseInt(quantity, 10)
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Product Creation Error:', error);
    
    // Provide a meaningful error response
    res.status(500).json({ 
      error: error instanceof Error 
        ? error.message 
        : 'Failed to create product' 
    });
  }
}
