import { useState } from 'react';
import { ShopifyCSVParser, SHOPIFY_CSV_MAPPINGS } from '@/lib/shopify-csv-parser';

export function useShopifyCSV() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Fetch and parse products CSV
  const fetchProductsCSV = async (
    url: string, 
    accessToken: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      const rawData = await ShopifyCSVParser.downloadAndParse(url, accessToken);
      const transformedData = ShopifyCSVParser.transformShopifyData(
        rawData, 
        SHOPIFY_CSV_MAPPINGS.products
      );

      return transformedData;
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to fetch products CSV';
      
      setError(new Error(errorMessage));
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Fetch and parse orders CSV
  const fetchOrdersCSV = async (
    url: string, 
    accessToken: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      const rawData = await ShopifyCSVParser.downloadAndParse(url, accessToken);
      const transformedData = ShopifyCSVParser.transformShopifyData(
        rawData, 
        SHOPIFY_CSV_MAPPINGS.orders
      );

      return transformedData;
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to fetch orders CSV';
      
      setError(new Error(errorMessage));
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Fetch and parse customers CSV
  const fetchCustomersCSV = async (
    url: string, 
    accessToken: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      const rawData = await ShopifyCSVParser.downloadAndParse(url, accessToken);
      const transformedData = ShopifyCSVParser.transformShopifyData(
        rawData, 
        SHOPIFY_CSV_MAPPINGS.customers
      );

      return transformedData;
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to fetch customers CSV';
      
      setError(new Error(errorMessage));
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Generic CSV parsing method
  const parseCSV = async (
    csvString: string, 
    mappings?: Record<string, string>
  ) => {
    setLoading(true);
    setError(null);

    try {
      const rawData = await ShopifyCSVParser.parseString(csvString);
      const transformedData = mappings 
        ? ShopifyCSVParser.transformShopifyData(rawData, mappings)
        : rawData;

      return transformedData;
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to parse CSV';
      
      setError(new Error(errorMessage));
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchProductsCSV,
    fetchOrdersCSV,
    fetchCustomersCSV,
    parseCSV,
    loading,
    error
  };
}
