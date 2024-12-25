import { useState } from 'react';
import { shopifyStorefrontClient } from '@/lib/shopify-storefront-client';

// Expanded type definitions
export interface ProductImage {
  url: string;
  altText?: string;
  width?: number;
  height?: number;
}

export interface ProductVariant {
  id: string;
  title: string;
  price: {
    amount: number;
    currencyCode: string;
  };
  compareAtPrice?: {
    amount: number;
    currencyCode: string;
  };
  availableForSale: boolean;
  selectedOptions?: Array<{
    name: string;
    value: string;
  }>;
}

export interface StorefrontProduct {
  id: string;
  title: string;
  description: string;
  descriptionHtml?: string;
  handle: string;
  productType?: string;
  tags: string[];
  priceRange: {
    minVariantPrice: {
      amount: number;
      currencyCode: string;
    };
    maxVariantPrice: {
      amount: number;
      currencyCode: string;
    };
  };
  images: {
    edges: Array<{
      node: ProductImage;
    }>;
  };
  variants: {
    edges: Array<{
      node: ProductVariant;
    }>;
  };
  media?: {
    edges: Array<{
      node: {
        mediaContentType: 'IMAGE' | 'VIDEO' | 'EXTERNAL_VIDEO' | 'MODEL_3D';
        alt?: string;
        preview?: {
          image?: ProductImage;
        };
        sources?: Array<{
          url: string;
          mimeType: string;
          format: string;
          height?: number;
          width?: number;
        }>;
      };
    }>;
  };
}

export interface StorefrontCollection {
  id: string;
  title: string;
  handle: string;
  description?: string;
  descriptionHtml?: string;
  image?: ProductImage;
  products: {
    edges: Array<{
      node: StorefrontProduct;
    }>;
  };
}

export interface ProductQueryOptions {
  first?: number;
  after?: string;
  query?: string;
  sortKey?: string;
  reverse?: boolean;
  availableForSale?: boolean;
  productType?: string;
  tags?: string[];
}

export interface CollectionQueryOptions {
  first?: number;
  after?: string;
  query?: string;
  sortKey?: 'TITLE' | 'UPDATED_AT' | 'ID';
  reverse?: boolean;
}

export function useStorefrontAPI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchProducts = async (
    options: ProductQueryOptions = {}
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await shopifyStorefrontClient.query({
        query: `
          query FetchProducts(
            $first: Int = 10, 
            $after: String,
            $query: String, 
            $sortKey: ProductSortKeys, 
            $reverse: Boolean,
            $availableForSale: Boolean,
            $productType: String,
            $tags: [String!]
          ) {
            products(
              first: $first, 
              after: $after,
              query: $query, 
              sortKey: $sortKey, 
              reverse: $reverse,
              availableForSale: $availableForSale,
              productType: $productType,
              tags: $tags
            ) {
              edges {
                node {
                  id
                  title
                  description
                  handle
                  priceRange {
                    minVariantPrice {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
        `,
        variables: {
          first: options.first || 10,
          after: options.after,
          query: options.query,
          sortKey: options.sortKey,
          reverse: options.reverse,
          availableForSale: options.availableForSale,
          productType: options.productType,
          tags: options.tags
        }
      });

      return response.data.products.edges.map((edge: any) => edge.node);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to fetch products';
      
      setError(new Error(errorMessage));
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchCollections = async () => {
    // Placeholder implementation
    return [];
  };

  const fetchProductRecommendations = async () => {
    // Placeholder implementation
    return [];
  };

  const initializeClient = () => {
    // Placeholder implementation
    return true;
  };

  return {
    initializeClient,
    fetchProducts,
    fetchCollections,
    fetchProductRecommendations,
    loading,
    error
  };
}
