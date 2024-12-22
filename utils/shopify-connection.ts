// Mock Shopify API type for type safety
interface ShopifyAPI {
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

export interface ShopifyConnectionConfig {
  shopDomain: string;
  accessToken: string;
}

export class ShopifyStoreConnection {
  private shopify: ShopifyAPI;

  constructor(config: ShopifyConnectionConfig) {
    // In a real implementation, this would use the actual Shopify API library
    this.shopify = {
      shop: {
        get: async () => ({ name: config.shopDomain }),
      },
      product: {
        list: async () => [],
        create: async () => ({}),
      }
    };
  }

  // Validate connection
  async testConnection(): Promise<boolean> {
    try {
      // Attempt to fetch shop information
      const shop = await this.shopify.shop.get();
      console.log('Successfully connected to Shopify store:', shop.name);
      return true;
    } catch (error) {
      console.error('Shopify connection failed:', error);
      return false;
    }
  }

  // Fetch product fields
  async getProductFields(): Promise<string[]> {
    try {
      // Retrieve a sample product to get its fields
      const products = await this.shopify.product.list({ limit: 1 });
      
      if (products.length > 0) {
        return Object.keys(products[0]);
      }
      
      // Fallback fields if no products found
      return [
        'id', 'title', 'body_html', 'vendor', 'product_type', 
        'created_at', 'handle', 'updated_at', 'published_at', 
        'template_suffix', 'status', 'published_scope', 
        'tags', 'admin_graphql_api_id'
      ];
    } catch (error) {
      console.error('Failed to retrieve product fields:', error);
      return [];
    }
  }

  // Upload products in bulk
  async uploadProducts(products: Record<string, any>[]): Promise<{ 
    successful: number, 
    failed: number, 
    errors: ProductUploadError[] 
  }> {
    const results = {
      successful: 0,
      failed: 0,
      errors: [] as ProductUploadError[]
    };

    for (const product of products) {
      try {
        await this.shopify.product.create(product);
        results.successful++;
      } catch (error) {
        results.failed++;
        results.errors.push({
          product,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return results;
  }
}

// Utility function to create connection
export const createShopifyConnection = (
  shopDomain: string, 
  accessToken: string
): ShopifyStoreConnection => {
  return new ShopifyStoreConnection({ shopDomain, accessToken });
}
