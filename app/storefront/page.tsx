'use client';

import { useState, useEffect } from 'react';
import { useStorefrontAPI, StorefrontProduct, StorefrontCollection } from '@/hooks/useStorefrontAPI';

export default function StorefrontPage() {
  const {
    initializeClient,
    fetchProducts,
    fetchCollections,
    fetchProductRecommendations,
    loading,
    error
  } = useStorefrontAPI();

  // State for storing API data
  const [products, setProducts] = useState<StorefrontProduct[]>([]);
  const [collections, setCollections] = useState<StorefrontCollection[]>([]);
  const [recommendations, setRecommendations] = useState<StorefrontProduct[]>([]);

  // Form state for connection
  const [storeUrl, setStoreUrl] = useState('');
  const [storefrontAccessToken, setStorefrontAccessToken] = useState('');

  // Handle store connection
  const handleConnect = async () => {
    try {
      // Initialize client
      const client = initializeClient(
        storeUrl.replace('https://', '').replace('.myshopify.com', ''),
        storefrontAccessToken
      );

      if (client) {
        // Fetch initial data
        const fetchedProducts = await fetchProducts({ first: 10 });
        const fetchedCollections = await fetchCollections({ first: 5 });

        // If products exist, get recommendations for the first product
        if (fetchedProducts.length > 0) {
          const productRecommendations = await fetchProductRecommendations(
            fetchedProducts[0].id
          );
          setRecommendations(productRecommendations);
        }

        setProducts(fetchedProducts);
        setCollections(fetchedCollections);
      }
    } catch (err) {
      console.error('Connection failed:', err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Shopify Storefront API Explorer</h1>

      {/* Connection Form */}
      <div className="mb-6 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-4">Connect to Storefront</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Store URL (e.g., your-store.myshopify.com)"
            value={storeUrl}
            onChange={(e) => setStoreUrl(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Storefront Access Token"
            value={storefrontAccessToken}
            onChange={(e) => setStorefrontAccessToken(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <button
            onClick={handleConnect}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Connect
          </button>
        </div>
      </div>

      {/* Loading and Error States */}
      {loading && <p className="text-blue-500">Loading...</p>}
      {error && <p className="text-red-500">Error: {error.message}</p>}

      {/* Products Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="border rounded p-4 hover:shadow-lg transition-shadow"
            >
              {/* Product Image */}
              {product.images.edges.length > 0 && (
                <img
                  src={product.images.edges[0].node.url}
                  alt={product.images.edges[0].node.altText || product.title}
                  className="w-full h-48 object-cover mb-4"
                />
              )}

              {/* Product Details */}
              <h3 className="font-bold text-lg">{product.title}</h3>
              <p className="text-gray-600 text-sm mb-2 truncate">
                {product.description}
              </p>
              <p className="font-semibold text-blue-600">
                {product.priceRange.minVariantPrice.amount.toLocaleString(
                  'en-US', 
                  { 
                    style: 'currency', 
                    currency: product.priceRange.minVariantPrice.currencyCode 
                  }
                )}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Collections Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Collections</h2>
        {collections.map((collection) => (
          <div 
            key={collection.id} 
            className="mb-6 p-4 border rounded"
          >
            <h3 className="text-xl font-bold mb-2">{collection.title}</h3>
            <p className="text-gray-600 mb-4">{collection.description}</p>
            
            {/* Collection Products */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {collection.products.edges.map(({ node: product }) => (
                <div 
                  key={product.id} 
                  className="border rounded p-2 hover:shadow-md transition-shadow"
                >
                  {product.images.edges.length > 0 && (
                    <img
                      src={product.images.edges[0].node.url}
                      alt={product.images.edges[0].node.altText || product.title}
                      className="w-full h-32 object-cover mb-2"
                    />
                  )}
                  <h4 className="font-semibold text-sm truncate">{product.title}</h4>
                  <p className="text-blue-600 text-xs">
                    {product.priceRange.minVariantPrice.amount.toLocaleString(
                      'en-US', 
                      { 
                        style: 'currency', 
                        currency: product.priceRange.minVariantPrice.currencyCode 
                      }
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Product Recommendations Section */}
      {recommendations.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-4">Recommended Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {recommendations.map((product) => (
              <div 
                key={product.id} 
                className="border rounded p-4 hover:shadow-lg transition-shadow"
              >
                {product.images.edges.length > 0 && (
                  <img
                    src={product.images.edges[0].node.url}
                    alt={product.images.edges[0].node.altText || product.title}
                    className="w-full h-48 object-cover mb-4"
                  />
                )}
                <h3 className="font-bold text-lg">{product.title}</h3>
                <p className="font-semibold text-blue-600">
                  {product.priceRange.minVariantPrice.amount.toLocaleString(
                    'en-US', 
                    { 
                      style: 'currency', 
                      currency: product.priceRange.minVariantPrice.currencyCode 
                    }
                  )}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
