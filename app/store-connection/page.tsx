"use client";

import React, { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { DrawerContext } from '@/contexts/drawer-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Store } from '@/types/store';

// Define types for form state and response
interface StoreConnectionFormState {
  storeUrl: string;
  apiKey?: string;
  apiSecret?: string;
  accessToken?: string;
}

interface ValidationErrors {
  storeUrl?: string;
  apiKey?: string;
  apiSecret?: string;
  accessToken?: string;
}

interface StoreConnectionResponse {
  success: boolean;
  message: string;
  store?: {
    name: string;
    primaryDomain: string;
    timezone: string;
    shopOwner: string;
    connectedAt: string;
  };
  credentials?: {
    storeUrl: string;
    apiKeyProvided: boolean;
    accessTokenProvided: boolean;
  };
  errors?: ValidationErrors;
  error?: string;
}

interface Store {
  id: string;
  name: string;
  url: string;
  products: number;
  orders: number;
  lastSync: string;
  status: 'connected' | 'error';
  additionalInfo?: any; 
}

export default function StoreConnectionPage() {
  const { openDrawer } = useContext(DrawerContext);
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState<StoreConnectionFormState>({
    storeUrl: '',
    apiKey: '',
    apiSecret: '',
    accessToken: ''
  });

  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [connectionSuccess, setConnectionSuccess] = useState<StoreConnectionResponse | null>(null);

  // Store state - load from localStorage on initial render
  const [stores, setStores] = useState<Store[]>(() => {
    if (typeof window !== 'undefined') {
      const storedStores = localStorage.getItem('connectedStores');
      return storedStores ? JSON.parse(storedStores) : [];
    }
    return [];
  });

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear specific validation error when user starts typing
    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof ValidationErrors];
        return newErrors;
      });
    }
  };

  // Handle store selection to open drawer
  const handleStoreSelect = (store: Store) => {
    openDrawer({
      content: 'store-dashboard',
      title: `${store.name} Dashboard`,
      props: {
        store: store
      }
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setConnectionError(null);
    setValidationErrors({});
    setConnectionSuccess(null);

    try {
      const response = await fetch('/api/store-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data: StoreConnectionResponse = await response.json();

      if (data.success) {
        setConnectionSuccess(data);
        
        // Create new store object
        const newStore: Store = {
          id: Date.now().toString(),
          name: data.store?.name ?? '',
          url: formData.storeUrl,
          products: 0,
          orders: 0,
          lastSync: new Date().toLocaleString(),
          status: 'connected',
          additionalInfo: {
            storeInfo: data.store,
            rawResponse: data
          }
        };

        // Update stores state and localStorage
        const updatedStores = [...stores, newStore];
        setStores(updatedStores);
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('connectedStores', JSON.stringify(updatedStores));
        }

        // Reset form after successful connection
        setFormData({
          storeUrl: '',
          apiKey: '',
          apiSecret: '',
          accessToken: ''
        });
      } else {
        // Handle validation errors or connection errors
        if (data.errors) {
          setValidationErrors(data.errors);
        }
        setConnectionError(data.message || 'Connection failed');
      }
    } catch (error) {
      console.error('Store Connection Error:', error);
      setConnectionError(
        error instanceof Error 
          ? error.message 
          : 'An unexpected error occurred'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle remove store
  const handleRemoveStore = (storeId: string) => {
    const updatedStores = stores.filter(store => store.id !== storeId);
    setStores(updatedStores);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('connectedStores', JSON.stringify(updatedStores));
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#121212] py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl space-y-8">
        {/* Page Heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-[#EAEAEA]">Connect Store</h1>
          <p className="text-[#C0C0C0]">
            Connect your Shopify store to import products and manage data
          </p>
        </div>

        {/* Store Connection Form */}
        <div className="bg-[#1A1A1A] shadow-md rounded-lg p-8 border border-[#2A2A2A]">
          <h2 className="text-3xl font-extrabold text-[#EAEAEA] mb-6">
            Connect Your Shopify Store
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Existing form inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="storeUrl" className="block text-sm font-medium text-[#C0C0C0]">
                  Store URL
                </label>
                <input
                  id="storeUrl"
                  name="storeUrl"
                  type="text"
                  required
                  className={`mt-1 block w-full rounded-md border ${
                    validationErrors.storeUrl 
                      ? 'border-destructive text-destructive' 
                      : 'border-[#2A2A2A] text-[#EAEAEA] bg-[#2A2A2A]'
                  } shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00A6B2]`}
                  placeholder="your-store.myshopify.com"
                  value={formData.storeUrl}
                  onChange={handleInputChange}
                />
                {validationErrors.storeUrl && (
                  <p className="mt-1 text-xs text-destructive">
                    {validationErrors.storeUrl}
                  </p>
                )}
              </div>
              {/* Add other input fields similarly */}
              <div>
                <label htmlFor="apiKey" className="block text-sm font-medium text-[#C0C0C0]">
                  API Key (Optional)
                </label>
                <input
                  id="apiKey"
                  name="apiKey"
                  type="text"
                  className={`mt-1 block w-full rounded-md border ${
                    validationErrors.apiKey 
                      ? 'border-destructive text-destructive' 
                      : 'border-[#2A2A2A] text-[#EAEAEA] bg-[#2A2A2A]'
                  } shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00A6B2]`}
                  placeholder="API Key (Optional)"
                  value={formData.apiKey}
                  onChange={handleInputChange}
                />
                {validationErrors.apiKey && (
                  <p className="mt-1 text-xs text-destructive">
                    {validationErrors.apiKey}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="apiSecret" className="block text-sm font-medium text-[#C0C0C0]">
                  API Secret (Optional)
                </label>
                <input
                  id="apiSecret"
                  name="apiSecret"
                  type="text"
                  className={`mt-1 block w-full rounded-md border ${
                    validationErrors.apiSecret 
                      ? 'border-destructive text-destructive' 
                      : 'border-[#2A2A2A] text-[#EAEAEA] bg-[#2A2A2A]'
                  } shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00A6B2]`}
                  placeholder="API Secret (Optional)"
                  value={formData.apiSecret}
                  onChange={handleInputChange}
                />
                {validationErrors.apiSecret && (
                  <p className="mt-1 text-xs text-destructive">
                    {validationErrors.apiSecret}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="accessToken" className="block text-sm font-medium text-[#C0C0C0]">
                  Access Token (Optional)
                </label>
                <input
                  id="accessToken"
                  name="accessToken"
                  type="text"
                  className={`mt-1 block w-full rounded-md border ${
                    validationErrors.accessToken 
                      ? 'border-destructive text-destructive' 
                      : 'border-[#2A2A2A] text-[#EAEAEA] bg-[#2A2A2A]'
                  } shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00A6B2]`}
                  placeholder="Access Token (Optional)"
                  value={formData.accessToken}
                  onChange={handleInputChange}
                />
                {validationErrors.accessToken && (
                  <p className="mt-1 text-xs text-destructive">
                    {validationErrors.accessToken}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-center">
              <Button 
                type="submit" 
                className="w-full md:w-auto"
                disabled={isLoading}
              >
                {isLoading ? 'Connecting...' : 'Connect Store'}
              </Button>
            </div>
          </form>
        </div>

        {/* Connected Stores Section */}
        {stores.length > 0 && (
          <div className="bg-[#1A1A1A] shadow-md rounded-lg p-8 mt-8 border border-[#2A2A2A]">
            <h3 className="text-xl font-semibold text-[#EAEAEA] mb-4">
              Connected Stores
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stores.map((store) => (
                <Card 
                  key={store.id} 
                  className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleStoreSelect(store)}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-lg font-medium">{store.name}</h4>
                    <Badge 
                      variant={store.status === 'connected' ? 'default' : 'destructive'}
                    >
                      {store.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-[#C0C0C0]">
                    <p>URL: {store.url}</p>
                    <p>Products: {store.products}</p>
                    <p>Last Sync: {store.lastSync}</p>
                  </div>
                  <div className="flex justify-between mt-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStoreSelect(store);
                      }}
                    >
                      View Dashboard
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveStore(store.id);
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
