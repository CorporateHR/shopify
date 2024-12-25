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
      scopes: ['read_customers'],
      hostName: storeDomain,
      isEmbeddedApp: false,
      apiVersion: LATEST_API_VERSION
    });

    // Create a session
    const session = shopify.session.customAppSession(storeDomain);
    session.accessToken = accessToken;

    // Create a REST client
    const client = new shopify.clients.Rest({ session });

    // Fetch customers
    const customersResponse = await client.get({
      path: 'customers',
      params: { 
        limit: 50,  // Adjust limit as needed
        order: 'total_spent DESC'
      }
    });

    // Transform customers to match our interface
    const formattedCustomers = customersResponse.body.customers.map((customer: any) => ({
      id: customer.id.toString(),
      name: `${customer.first_name} ${customer.last_name || ''}`.trim(),
      email: customer.email || 'N/A',
      totalSpent: parseFloat(customer.total_spent || '0')
    }));

    res.status(200).json(formattedCustomers);

  } catch (error) {
    console.error('Customers Fetch Error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch customers',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
