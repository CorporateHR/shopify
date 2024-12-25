import type { NextApiRequest, NextApiResponse } from 'next';
import Shopify from 'shopify-api-node';

// Interface for order
interface Order {
  id: string;
  customerName: string;
  total: number;
  status: string;
  date: string;
}

// Interface for GET request parameters
interface GetRequestParams {
  page?: number;
  limit?: number;
}

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse<Order[] | { error: string }>
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

    // Fetch recent orders (last 50)
    const orders = await shopify.order.list({ 
      status: 'any', 
      limit: 50 
    });

    // Transform orders to our interface
    const formattedOrders: Order[] = orders.map(order => ({
      id: order.id.toString(),
      customerName: order.customer?.first_name 
        ? `${order.customer.first_name} ${order.customer.last_name || ''}`.trim() 
        : 'Guest',
      total: parseFloat(order.total_price || '0'),
      status: order.financial_status || 'unknown',
      date: new Date(order.created_at || Date.now()).toISOString()
    }));

    res.status(200).json(formattedOrders);
  } catch (error) {
    console.error('Orders Fetch Error:', error);
    
    // Provide a meaningful error response
    res.status(500).json({ 
      error: error instanceof Error 
        ? error.message 
        : 'Failed to fetch orders' 
    });
  }
}
