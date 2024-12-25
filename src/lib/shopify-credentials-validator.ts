// Shopify Credentials Validation Utility

export interface ShopifyCredentials {
  storeDomain: string;
  apiKey: string;
  apiSecretKey: string;
  accessToken: string;
}

export function validateShopifyCredentials(credentials: Partial<ShopifyCredentials>): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Store Domain Validation
  if (!credentials.storeDomain) {
    errors.push('Store Domain is required');
  } else {
    // Check if it's a valid Shopify store domain
    const domainRegex = /^[a-zA-Z0-9-]+\.myshopify\.com$/;
    if (!domainRegex.test(credentials.storeDomain)) {
      errors.push('Invalid Shopify store domain format. Should be like "your-store.myshopify.com"');
    }
  }

  // API Key Validation
  if (!credentials.apiKey) {
    errors.push('API Key is required');
  } else if (credentials.apiKey.length < 10) {
    errors.push('API Key seems too short');
  }

  // API Secret Key Validation
  if (!credentials.apiSecretKey) {
    errors.push('API Secret Key is required');
  } else if (credentials.apiSecretKey.length < 10) {
    errors.push('API Secret Key seems too short');
  }

  // Access Token Validation
  if (!credentials.accessToken) {
    errors.push('Access Token is required');
  } else if (credentials.accessToken.length < 10) {
    errors.push('Access Token seems too short');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function formatShopifyCredentials(credentials: Partial<ShopifyCredentials>): ShopifyCredentials {
  // Trim and clean credentials
  return {
    storeDomain: credentials.storeDomain?.trim().toLowerCase() || '',
    apiKey: credentials.apiKey?.trim() || '',
    apiSecretKey: credentials.apiSecretKey?.trim() || '',
    accessToken: credentials.accessToken?.trim() || ''
  };
}

export function maskCredentials(credentials: Partial<ShopifyCredentials>): Partial<ShopifyCredentials> {
  return {
    storeDomain: credentials.storeDomain 
      ? credentials.storeDomain.replace(/^(.{3}).*(.{3})$/, '$1***$2') 
      : undefined,
    apiKey: credentials.apiKey 
      ? credentials.apiKey.substring(0, 3) + '***' + credentials.apiKey.slice(-3) 
      : undefined,
    apiSecretKey: credentials.apiSecretKey 
      ? credentials.apiSecretKey.substring(0, 3) + '***' + credentials.apiSecretKey.slice(-3) 
      : undefined,
    accessToken: credentials.accessToken 
      ? credentials.accessToken.substring(0, 3) + '***' + credentials.accessToken.slice(-3) 
      : undefined
  };
}

// Recommended Scopes for different use cases
export const RECOMMENDED_SCOPES = {
  readOnly: [
    'read_products',
    'read_orders',
    'read_customers',
    'read_themes',
    'read_reports'
  ],
  fullAccess: [
    'write_products',
    'write_orders',
    'write_customers',
    'write_themes',
    'read_products',
    'read_orders',
    'read_customers',
    'read_themes',
    'read_reports'
  ],
  storefront: [
    'unauthenticated_read_product_listings',
    'unauthenticated_read_product_inventory',
    'unauthenticated_read_customers',
    'unauthenticated_write_checkouts'
  ]
};
