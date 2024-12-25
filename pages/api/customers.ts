import type { NextApiRequest, NextApiResponse } from 'next';
import Shopify from 'shopify-api-node';

// Interface for customer
interface Customer {
  id: string;
  name: string;
  email: string;
  totalSpent: number;
}

// Interface for GET request parameters
interface GetRequestParams {
  page?: number;
  limit?: number;
}

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse<Customer[] | { error: string }>
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

    // Fetch recent customers (last 50)
    const customers = await shopify.customer.list({ 
      limit: 50 
    });

    // Transform customers to our interface
    const formattedCustomers: Customer[] = customers.map(customer => ({
      id: customer.id.toString(),
      name: `${customer.first_name || ''} ${customer.last_name || ''}`.trim(),
      email: customer.email || 'N/A',
      totalSpent: parseFloat(customer.total_spent || '0')
    }));

    res.status(200).json(formattedCustomers);
  } catch (error) {
    console.error('Customers Fetch Error:', error);
    
    // Provide a meaningful error response
    res.status(500).json({ 
      error: error instanceof Error 
        ? error.message 
        : 'Failed to fetch customers' 
    });
  }
}
