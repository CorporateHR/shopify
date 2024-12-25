# Shopify Storefront API Integration

## Overview
This module provides a comprehensive hook for interacting with the Shopify Storefront API, enabling developers to fetch and manage products, collections, and recommendations with advanced querying capabilities.

## Features
- Initialize Shopify Storefront API client
- Advanced product querying with multiple filters
- Retrieve collections with detailed product information
- Fetch single product details
- Get product recommendations with multiple intent options
- Comprehensive error handling
- TypeScript support with detailed type definitions

## Prerequisites
- Shopify store with Storefront API access
- Storefront Access Token
- Shopify store domain

## Installation
```bash
npm install @shopify/hydrogen-react
```

## Usage

### Initializing the Client
```typescript
const { 
  initializeClient, 
  fetchProducts, 
  fetchCollections 
} = useStorefrontAPI();

// Connect to your Shopify store
const client = initializeClient(
  'your-store', 
  'your_storefront_access_token'
);
```

### Advanced Product Querying
```typescript
// Fetch first 10 products
const products = await fetchProducts({ first: 10 });

// Filter and sort products
const saleProducts = await fetchProducts({
  first: 5,
  query: 'tag:sale',
  sortKey: 'PRICE',
  reverse: true,
  availableForSale: true,
  productType: 'Clothing'
});
```

### Fetching Collections
```typescript
// Fetch collections with their products
const collections = await fetchCollections({ 
  first: 5,
  query: 'featured',
  sortKey: 'TITLE'
});
```

### Single Product Details
```typescript
// Fetch by ID
const productById = await fetchProductDetails({ 
  id: 'gid://shopify/Product/1234' 
});

// Fetch by handle
const productByHandle = await fetchProductDetails({ 
  handle: 'summer-shirt' 
});
```

### Product Recommendations
```typescript
// Get related product recommendations
const recommendations = await fetchProductRecommendations(
  'gid://shopify/Product/1', 
  'RELATED'
);

// Get complementary product recommendations
const complementaryProducts = await fetchProductRecommendations(
  'gid://shopify/Product/1', 
  'COMPLEMENTARY'
);
```

## Advanced Querying Options

### Product Query Options
- `first`: Number of products to fetch
- `after`: Cursor for pagination
- `query`: Search or filter query
- `sortKey`: Sort by title, price, creation date, etc.
- `reverse`: Reverse sorting order
- `availableForSale`: Filter by product availability
- `productType`: Filter by product type
- `tags`: Filter by product tags

### Collection Query Options
- `first`: Number of collections to fetch
- `after`: Cursor for pagination
- `query`: Search or filter query
- `sortKey`: Sort by title or update time
- `reverse`: Reverse sorting order

## Error Handling
The hook provides comprehensive error handling:
- Detailed error messages
- Loading states
- Validation for API credentials

## Security
- Never expose your Storefront Access Token publicly
- Use environment variables for sensitive information
- Implement proper authentication in production

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License
MIT License
