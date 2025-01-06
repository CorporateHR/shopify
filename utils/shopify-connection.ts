import { 
  shopifyApi, 
  LATEST_API_VERSION,
  Session,
  ApiVersion
} from '@shopify/shopify-api';
import { 
  RestClientParams,
  GetRequestParams,
  PostRequestParams
} from '@shopify/shopify-api/lib/clients/types';

// Ensure Shopify Context is initialized only once
let isShopifyInitialized = false;

// Mock Shopify API type for type safety
interface ShopifyAPIInterface {
  shop: {
    get: () => Promise<{ name: string }>;
  };
  product: {
    list: (options: { limit: number }) => Promise<any[]>;
    create: (product: Record<string, any>) => Promise<any>;
  };
}

// Define a more specific type for product and error
interface ProductUploadError {
  product: Record<string, any>;
  error: string;
}

// Define a more specific interface for connection configuration
export interface ShopifyConnectionConfig {
  shopDomain: string;
  accessToken: string;
  apiKey: string;
  apiSecret: string;
}

export class ShopifyStoreConnection {
  private shopDomain: string;
  private accessToken: string;
  private apiKey: string;
  private apiSecret: string;
  private shopifyClient!: ReturnType<typeof shopifyApi>;

  constructor(config: ShopifyConnectionConfig) {
    // Validate inputs
    this.validateInputs(config);

    this.shopDomain = config.shopDomain.replace('https://', '').replace('http://', '');
    this.accessToken = config.accessToken;
    this.apiKey = config.apiKey;
    this.apiSecret = config.apiSecret;

    // Initialize Shopify context if not already done
    this.initializeShopifyContext();
  }

  private validateInputs(config: ShopifyConnectionConfig) {
    const requiredFields: (keyof ShopifyConnectionConfig)[] = [
      'shopDomain', 'accessToken', 'apiKey', 'apiSecret'
    ];

    for (const field of requiredFields) {
      if (!config[field] || config[field].trim() === '') {
        throw new Error(`${field} is required`);
      }
    }

    if (!config.shopDomain.endsWith('.myshopify.com')) {
      throw new Error('Shop domain must end with .myshopify.com');
    }
  }

  private initializeShopifyContext() {
    if (!isShopifyInitialized) {
      try {
        // Initialize Shopify Client
        this.shopifyClient = shopifyApi({
          apiKey: this.apiKey,
          apiSecretKey: this.apiSecret,
          scopes: ['read_products', 'write_products', 'read_orders', 'read_customers'],
          hostName: this.shopDomain.replace('.myshopify.com', ''),
          isEmbeddedApp: false,
          apiVersion: LATEST_API_VERSION
        });

        isShopifyInitialized = true;
      } catch (error) {
        console.error('Detailed Shopify Context Initialization Error:', error);
        throw new Error(`Failed to initialize Shopify Context: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      // Create a REST client for this specific connection
      const client = new this.shopifyClient.clients.Rest({
        shop: this.shopDomain,
        accessToken: this.accessToken
      });

      // Attempt to fetch shop information
      const response = await client.get({
        path: 'shop',
        query: {}
      });

      console.log('Shopify connection successful:', response.body);
      return true;
    } catch (error) {
      console.error('Shopify connection test failed:', error);
      return false;
    }
  }

  async getProductFields(): Promise<string[]> {
    try {
      // Create a REST client for this specific connection
      const client = new this.shopifyClient.clients.Rest({
        shop: this.shopDomain,
        accessToken: this.accessToken
      });
      
      const response = await client.get({
        path: 'products',
        query: { limit: 1 }
      });

      // Extract field names from the first product
      const products = (response.body as any).products;
      return products.length > 0 ? Object.keys(products[0]) : [];
    } catch (error) {
      console.error('Failed to get product fields:', error);
      return [];
    }
  }

  async getProducts(limit: number = 50): Promise<any[]> {
    try {
      // Create a REST client for this specific connection
      const client = new this.shopifyClient.clients.Rest({
        shop: this.shopDomain,
        accessToken: this.accessToken
      });
      
      const response = await client.get({
        path: 'products',
        query: { limit }
      });

      return (response.body as any).products || [];
    } catch (error) {
      console.error('Failed to get products:', error);
      return [];
    }
  }

  async uploadProducts(products: Record<string, any>[]): Promise<{ 
    successful: number, 
    failed: number, 
    errors: ProductUploadError[] 
  }> {
    const result = {
      successful: 0,
      failed: 0,
      errors: [] as ProductUploadError[]
    };

    for (const product of products) {
      try {
        // Create a REST client for this specific connection
        const client = new this.shopifyClient.clients.Rest({
          shop: this.shopDomain,
          accessToken: this.accessToken
        });
        
        const response = await client.post({
          path: 'products',
          data: { product }
        });

        result.successful++;
      } catch (error) {
        result.failed++;
        result.errors.push({
          product,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return result;
  }
}

// Utility function to create connection
export const createShopifyConnection = (
  config: ShopifyConnectionConfig
): ShopifyStoreConnection => {
  return new ShopifyStoreConnection(config);
}
