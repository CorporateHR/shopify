import type { NextApiRequest, NextApiResponse } from 'next';
import Shopify from 'shopify-api-node';

// Interface for store metrics
interface StoreMetrics {
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  totalRevenue: number;
}

// Interface for GET request parameters
interface GetRequestParams {
  page?: number;
  limit?: number;
}

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse<StoreMetrics | { error: string }>
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

    // Fetch store metrics
    const [
      productsCount,
      ordersCount,
      customersCount,
      orders
    ] = await Promise.all([
      shopify.product.count(),
      shopify.order.count(),
      shopify.customer.count(),
      shopify.order.list({ status: 'any' })
    ]);

    // Calculate total revenue
    const calculateTotalRevenue = (total: number, order: { total_price: string }): number => {
      return total + parseFloat(order.total_price || '0');
    };

    const totalRevenue = orders.reduce(calculateTotalRevenue, 0);

    // Prepare and send metrics
    const metrics: StoreMetrics = {
      totalProducts: productsCount,
      totalOrders: ordersCount,
      totalCustomers: customersCount,
      totalRevenue: parseFloat(totalRevenue.toFixed(2))
    };

    res.status(200).json(metrics);
  } catch (error) {
    console.error('Store Metrics Fetch Error:', error);
    
    // Provide a meaningful error response
    res.status(500).json({ 
      error: error instanceof Error 
        ? error.message 
        : 'Failed to fetch store metrics' 
    });
  }
}
