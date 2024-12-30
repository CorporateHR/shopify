import { createStorefrontClient, StorefrontClient, I18nBase } from '@shopify/hydrogen';

// Storefront API configuration
export const shopifyStorefrontClient = createStorefrontClient<I18nBase>({
  storeDomain: process.env.SHOPIFY_STORE_DOMAIN || '',
  publicStorefrontToken: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || '',
  // Explicitly type the client
  i18n: { language: 'EN', country: 'US' }
});

// Utility function to handle GraphQL queries
export async function shopifyStorefrontQuery<T = any>(
  query: string, 
  variables: Record<string, any> = {}
): Promise<T> {
  try {
    const response = await shopifyStorefrontClient.query(query, { variables });

    return response as T;
  } catch (error) {
    console.error('Storefront API Query Error:', error);
    throw error;
  }
}

// Utility function to handle GraphQL mutations
export async function shopifyStorefrontMutation<T = any>(
  mutation: string, 
  variables: Record<string, any> = {}
): Promise<T> {
  try {
    const response = await shopifyStorefrontClient.query(mutation, { variables });

    return response as T;
  } catch (error) {
    console.error('Storefront API Mutation Error:', error);
    throw error;
  }
}

// Predefined GraphQL Queries and Mutations
export const GRAPHQL_QUERIES = {
  // Fetch product listings
  PRODUCTS: `
    query Products($first: Int = 10, $query: String) {
      products(first: $first, query: $query) {
        edges {
          node {
            id
            title
            description
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 1) {
              edges {
                node {
                  originalSrc
                  altText
                }
              }
            }
            variants(first: 1) {
              edges {
                node {
                  availableForSale
                  selectedOptions {
                    name
                    value
                  }
                }
              }
            }
          }
        }
      }
    }
  `,

  // Fetch product details
  PRODUCT_DETAILS: `
    query ProductDetails($id: ID!) {
      product(id: $id) {
        id
        title
        description
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 10) {
          edges {
            node {
              originalSrc
              altText
            }
          }
        }
        variants(first: 10) {
          edges {
            node {
              id
              title
              availableForSale
              selectedOptions {
                name
                value
              }
              price {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  `,

  // Create a checkout
  CREATE_CHECKOUT: `
    mutation CheckoutCreate($input: CheckoutCreateInput!) {
      checkoutCreate(input: $input) {
        checkout {
          id
          webUrl
          lineItems(first: 10) {
            edges {
              node {
                title
                quantity
                variant {
                  price {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
        checkoutUserErrors {
          code
          field
          message
        }
      }
    }
  `,

  // Add line items to checkout
  ADD_LINE_ITEMS: `
    mutation CheckoutLineItemsAdd($checkoutId: ID!, $lineItems: [CheckoutLineItemInput!]!) {
      checkoutLineItemsAdd(checkoutId: $checkoutId, lineItems: $lineItems) {
        checkout {
          id
          lineItems(first: 10) {
            edges {
              node {
                title
                quantity
                variant {
                  price {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
        checkoutUserErrors {
          code
          field
          message
        }
      }
    }
  `
};

// Predefined GraphQL Mutations
export const GRAPHQL_MUTATIONS = {
  // Customer creation
  CREATE_CUSTOMER: `
    mutation CustomerCreate($input: CustomerCreateInput!) {
      customerCreate(input: $input) {
        customer {
          id
          email
          firstName
          lastName
        }
        customerUserErrors {
          code
          field
          message
        }
      }
    }
  `,

  // Customer login
  CUSTOMER_LOGIN: `
    mutation CustomerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
      customerAccessTokenCreate(input: $input) {
        customerAccessToken {
          accessToken
          expiresAt
        }
        customerUserErrors {
          code
          field
          message
        }
      }
    }
  `
};
