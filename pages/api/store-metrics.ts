import type { NextApiRequest, NextApiResponse } from 'next';
import Shopify from 'shopify-api-node';

// Interface for store metrics
interface StoreMetrics {
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  totalRevenue: number;
}

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse<StoreMetrics | { error: string }>
) {
  // Ensure only GET requests are allowed
  if (req.method !== 'GET') {
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
    // Initialize Shopify client
    const shopify = new Shopify({
      shopName,
      accessToken
    });

    // Fetch store metrics concurrently
    const [
      productsCount,
      ordersCount,
      customersCount,
      orders
    ] = await Promise.all([
      shopify.product.count(),
      shopify.order.count(),
      shopify.customer.count(),
      shopify.order.list({ limit: 250 })
    ]);

    // Calculate total revenue
    const totalRevenue = orders.reduce((total, order) => {
      return total + parseFloat(order.total_price || '0');
    }, 0);

    // Return store metrics
    return res.status(200).json({
      totalProducts: productsCount,
      totalOrders: ordersCount,
      totalCustomers: customersCount,
      totalRevenue: parseFloat(totalRevenue.toFixed(2))
    });

  } catch (error) {
    console.error('Store metrics retrieval error:', error);
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to retrieve store metrics' 
    });
  }
}
