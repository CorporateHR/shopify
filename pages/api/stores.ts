import type { NextApiRequest, NextApiResponse } from 'next';
import { TokenManager } from '@/utils/server/token-manager';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Retrieve stored credentials
    const storedCredentials = await TokenManager.getStoredCredentials();

    // Transform credentials into store objects
    const stores = storedCredentials.map(cred => ({
      id: cred.storeUrl,
      name: cred.storeName || cred.storeUrl.split('.')[0],
      url: cred.storeUrl,
      products: cred.productsCount || 0,
      orders: cred.ordersCount || 0,
      lastSync: cred.connectedAt || new Date().toISOString(),
      status: 'connected' as const,
      additionalInfo: cred.storeInfo || {}
    }));

    res.status(200).json({
      success: true,
      stores: stores
    });
  } catch (error) {
    console.error('Error fetching stores:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve stores'
    });
  }
}
