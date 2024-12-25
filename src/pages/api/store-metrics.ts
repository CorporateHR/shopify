import type { NextApiRequest, NextApiResponse } from 'next';
import { shopifyApi, LATEST_API_VERSION } from '@shopify/shopify-api';
import { GetRequestParams } from '@/types/api';

// Define types for metrics calculation
interface Order {
  total_price: number;
  created_at: string;
  financial_status: string;
}

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

  if (req.method === 'GET') {
    const { 
      page = '1', 
      limit = '10', 
      query = '' 
    } = req.query as GetRequestParams;

    // Convert to number safely
    const pageNum = Number(page);
    const limitNum = Number(limit);

    try {
      // Log all incoming request details for debugging
      console.log('Request Headers:', req.headers);
      console.log('Request Method:', req.method);
      console.log('Environment Variables:', {
        SHOPIFY_STORE_DOMAIN: process.env.SHOPIFY_STORE_DOMAIN ? 'SET' : 'UNSET',
        SHOPIFY_ACCESS_TOKEN: process.env.SHOPIFY_ACCESS_TOKEN ? 'SET' : 'UNSET'
      });

      // Retrieve store credentials from environment or database
      const storeDomain = process.env.SHOPIFY_STORE_DOMAIN;
      const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;

      if (!storeDomain || !accessToken) {
        console.error('Missing store credentials', { storeDomain, accessToken });
        return res.status(400).json({ 
          message: 'Store credentials not configured',
          details: {
            storeDomain: !!storeDomain,
            accessToken: !!accessToken
          }
        });
      }

      // Configure Shopify API with detailed logging
      const shopify = shopifyApi({
        apiKey: process.env.SHOPIFY_API_KEY || '',
        apiSecretKey: process.env.SHOPIFY_API_SECRET || '',
        scopes: ['read_products', 'read_orders', 'read_customers'],
        hostName: storeDomain,
        isEmbeddedApp: false,
        apiVersion: LATEST_API_VERSION
      });

      // Create a session
      const session = shopify.session.customAppSession(storeDomain);
      session.accessToken = accessToken;

      // Create a REST client
      const client = new shopify.clients.Rest({ session });

      // Fetch products count with error handling
      let productsCount = 0;
      try {
        const productsResponse = await client.get({
          path: 'products/count'
        });
        productsCount = productsResponse.body?.count || 0;
      } catch (productError) {
        console.error('Products Count Error:', productError);
      }

      // Fetch orders count with error handling
      let ordersCount = 0;
      try {
        const ordersResponse = await client.get({
          path: 'orders/count'
        });
        ordersCount = ordersResponse.body?.count || 0;
      } catch (orderError) {
        console.error('Orders Count Error:', orderError);
      }

      // Fetch customers count with error handling
      let customersCount = 0;
      try {
        const customersResponse = await client.get({
          path: 'customers/count'
        });
        customersCount = customersResponse.body?.count || 0;
      } catch (customerError) {
        console.error('Customers Count Error:', customerError);
      }

      // Calculate total revenue (simplified)
      let totalRevenue = 0;
      try {
        const ordersListResponse = await client.get({
          path: 'orders',
          params: { status: 'any', limit: 250 }
        });

        totalRevenue = ordersListResponse.body?.orders?.reduce(
          (total, order) => total + parseFloat(order.total_price || '0'), 
          0
        ) || 0;
      } catch (revenueError) {
        console.error('Revenue Calculation Error:', revenueError);
      }

      // Calculate total metrics
      const calculateTotalMetrics = (orders: Order[]) => {
        const total = orders.reduce((acc, order) => {
          acc.totalRevenue += Number(order.total_price);
          acc.orderCount++;
          return acc;
        }, { 
          totalRevenue: 0, 
          orderCount: 0 
        });

        return total;
      };

      // Placeholder orders data
      const orders: Order[] = [];

      const metrics = calculateTotalMetrics(orders);

      // Return metrics with comprehensive error handling
      res.status(200).json({
        totalProducts: productsCount,
        totalOrders: ordersCount,
        totalCustomers: customersCount,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        metrics,
        page: pageNum,
        limit: limitNum,
        total: orders.length,
        fetchTimestamp: new Date().toISOString()
      });

    } catch (error) {
      // Comprehensive error logging
      console.error('Store Metrics Fetch Error:', {
        errorName: error instanceof Error ? error.name : 'Unknown Error',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        errorStack: error instanceof Error ? error.stack : 'No stack trace'
      });

      // Send detailed error response
      res.status(500).json({ 
        message: 'Failed to fetch store metrics',
        error: {
          name: error instanceof Error ? error.name : 'Unknown Error',
          message: error instanceof Error ? error.message : 'Unknown error',
          details: error instanceof Error ? error.stack : 'No additional details'
        }
      });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
