import { useState } from 'react';
import { 
  shopifyStorefrontQuery, 
  shopifyStorefrontMutation,
  GRAPHQL_QUERIES,
  GRAPHQL_MUTATIONS
} from '@/lib/shopify-storefront-client';

export function useShopifyStorefront() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Fetch product listings
  const fetchProducts = async (first = 10, query = '') => {
    setLoading(true);
    setError(null);

    try {
      const result = await shopifyStorefrontQuery(GRAPHQL_QUERIES.PRODUCTS, { 
        first, 
        query 
      });
      return result.products.edges.map((edge: any) => edge.node);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch products'));
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Fetch product details
  const fetchProductDetails = async (productId: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await shopifyStorefrontQuery(GRAPHQL_QUERIES.PRODUCT_DETAILS, { 
        id: productId 
      });
      return result.product;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch product details'));
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Create a checkout
  const createCheckout = async (lineItems: any[]) => {
    setLoading(true);
    setError(null);

    try {
      const result = await shopifyStorefrontMutation(GRAPHQL_QUERIES.CREATE_CHECKOUT, {
        input: { lineItems }
      });
      return result.checkoutCreate.checkout;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create checkout'));
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Add line items to existing checkout
  const addLineItems = async (checkoutId: string, lineItems: any[]) => {
    setLoading(true);
    setError(null);

    try {
      const result = await shopifyStorefrontMutation(GRAPHQL_QUERIES.ADD_LINE_ITEMS, {
        checkoutId,
        lineItems
      });
      return result.checkoutLineItemsAdd.checkout;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to add line items'));
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Create a customer
  const createCustomer = async (customerData: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const result = await shopifyStorefrontMutation(GRAPHQL_MUTATIONS.CREATE_CUSTOMER, {
        input: customerData
      });
      return result.customerCreate.customer;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create customer'));
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Customer login
  const customerLogin = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await shopifyStorefrontMutation(GRAPHQL_MUTATIONS.CUSTOMER_LOGIN, {
        input: { email, password }
      });
      return result.customerAccessTokenCreate.customerAccessToken;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to login'));
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchProducts,
    fetchProductDetails,
    createCheckout,
    addLineItems,
    createCustomer,
    customerLogin,
    loading,
    error
  };
}
