import type { NextApiRequest, NextApiResponse } from 'next';
import Shopify from 'shopify-api-node';

// Interface for product
interface Product {
  id: string;
  title: string;
  price: string;
  inventory: number;
}

// Interface for GET request parameters
interface GetRequestParams {
  page?: number;
  limit?: number;
}

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse<Product[] | { error: string }>
) {
  // Ensure only GET requests are allowed
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Retrieve store credentials from environment or session
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

    // Fetch products with inventory
    const products = await shopify.product.list();

    // Transform products to our interface
    const formattedProducts: Product[] = products.map(product => {
      // Safely get the first variant's price or default to '0.00'
      const price = product.variants[0]?.price 
        ? product.variants[0].price 
        : '0.00';

      // Calculate total inventory across all variants
      const inventory = product.variants.reduce((total: number, variant) => {
        const inventoryQuantity = variant.inventory_quantity 
          ? parseInt(variant.inventory_quantity, 10) 
          : 0;
        return total + inventoryQuantity;
      }, 0);

      return {
        id: product.id.toString(),
        title: product.title,
        price: price,
        inventory: inventory
      };
    });

    res.status(200).json(formattedProducts);
  } catch (error) {
    console.error('Products Fetch Error:', error);
    
    // Provide a meaningful error response
    res.status(500).json({ 
      error: error instanceof Error 
        ? error.message 
        : 'Failed to fetch products' 
    });
  }
}
