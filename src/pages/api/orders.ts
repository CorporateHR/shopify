import type { NextApiRequest, NextApiResponse } from 'next';
import { shopifyApi, LATEST_API_VERSION } from '@shopify/shopify-api';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Retrieve store credentials from environment or database
    const storeDomain = process.env.SHOPIFY_STORE_DOMAIN;
    const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;

    if (!storeDomain || !accessToken) {
      return res.status(400).json({ 
        message: 'Store credentials not configured' 
      });
    }

    // Configure Shopify API
    const shopify = shopifyApi({
      apiKey: process.env.SHOPIFY_API_KEY || '',
      apiSecretKey: process.env.SHOPIFY_API_SECRET || '',
      scopes: ['read_orders'],
      hostName: storeDomain,
      isEmbeddedApp: false,
      apiVersion: LATEST_API_VERSION
    });

    // Create a session
    const session = shopify.session.customAppSession(storeDomain);
    session.accessToken = accessToken;

    // Create a REST client
    const client = new shopify.clients.Rest({ session });

    // Fetch recent orders
    const ordersResponse = await client.get({
      path: 'orders',
      params: { 
        status: 'any', 
        limit: 50,  // Adjust limit as needed
        order: 'created_at DESC'
      }
    });

    // Transform orders to match our interface
    const formattedOrders = ordersResponse.body.orders.map((order: any) => ({
      id: order.id.toString(),
      customerName: order.customer?.first_name 
        ? `${order.customer.first_name} ${order.customer.last_name || ''}`.trim() 
        : 'Guest',
      total: parseFloat(order.total_price),
      status: order.financial_status || 'unknown',
      date: new Date(order.created_at).toLocaleDateString()
    }));

    res.status(200).json(formattedOrders);

  } catch (error) {
    console.error('Orders Fetch Error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch orders',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
