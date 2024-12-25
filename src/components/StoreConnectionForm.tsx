import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../contexts/auth-context';
import { useRouter } from 'next/navigation';

// Updated Store Connection Schema
const storeConnectionSchema = z.object({
  storeName: z.string().min(2, { message: "Store name must be at least 2 characters" }),
  storeUrl: z.string().url({ message: "Please enter a valid store URL" }),
  apiKey: z.string().min(10, { message: "API Key must be at least 10 characters" }),
  apiSecretKey: z.string().min(10, { message: "API Secret Key must be at least 10 characters" }),
  apiAccessToken: z.string().min(10, { message: "API Access Token must be at least 10 characters" }),
  apiScopes: z.string().optional(), // Optional field for API scopes
  webhookSecret: z.string().optional() // Optional webhook secret
});

type StoreConnectionFormData = z.infer<typeof storeConnectionSchema>;

interface StoreConnectionFormProps {
  onCancel?: () => void;
  onSuccess?: () => void;
}

const StoreConnectionForm: React.FC<StoreConnectionFormProps> = ({ 
  onCancel, 
  onSuccess 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { login } = useAuth();
  const router = useRouter();

  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    reset 
  } = useForm<StoreConnectionFormData>({
    resolver: zodResolver(storeConnectionSchema)
  });

  const onSubmit = async (data: StoreConnectionFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/store-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Store connection failed');
      }

      const result = await response.json();
      
      // Login the user and store connection data
      login(result.store.name);
      
      // Reset form after successful submission
      reset();
      
      // Navigate to store dashboard
      router.push('/app/store-dashboard');
      
      // Call onSuccess callback if provided
      onSuccess?.();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Connect Your Shopify Store</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {submitError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            {submitError}
          </div>
        )}

        <div>
          <label htmlFor="storeName" className="block text-sm font-medium text-gray-700">
            Store Name
          </label>
          <input
            id="storeName"
            type="text"
            {...register('storeName')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder="Enter your store name"
          />
          {errors.storeName && (
            <p className="mt-1 text-sm text-red-600">{errors.storeName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="storeUrl" className="block text-sm font-medium text-gray-700">
            Store URL
          </label>
          <input
            id="storeUrl"
            type="text"
            {...register('storeUrl')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder="https://your-store.myshopify.com"
          />
          {errors.storeUrl && (
            <p className="mt-1 text-sm text-red-600">{errors.storeUrl.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">
            API Key
          </label>
          <input
            id="apiKey"
            type="text"
            {...register('apiKey')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder="Enter your Shopify API key"
          />
          {errors.apiKey && (
            <p className="mt-1 text-sm text-red-600">{errors.apiKey.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="apiSecretKey" className="block text-sm font-medium text-gray-700">
            API Secret Key
          </label>
          <input
            id="apiSecretKey"
            type="password"
            {...register('apiSecretKey')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder="Enter your Shopify API secret key"
          />
          {errors.apiSecretKey && (
            <p className="mt-1 text-sm text-red-600">{errors.apiSecretKey.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="apiAccessToken" className="block text-sm font-medium text-gray-700">
            API Access Token
          </label>
          <input
            id="apiAccessToken"
            type="password"
            {...register('apiAccessToken')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder="Enter your Shopify API access token"
          />
          {errors.apiAccessToken && (
            <p className="mt-1 text-sm text-red-600">{errors.apiAccessToken.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="apiScopes" className="block text-sm font-medium text-gray-700">
            API Scopes (Optional)
          </label>
          <input
            id="apiScopes"
            type="text"
            {...register('apiScopes')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder="read_products,write_orders"
          />
          {errors.apiScopes && (
            <p className="mt-1 text-sm text-red-600">{errors.apiScopes.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="webhookSecret" className="block text-sm font-medium text-gray-700">
            Webhook Secret (Optional)
          </label>
          <input
            id="webhookSecret"
            type="password"
            {...register('webhookSecret')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder="Enter webhook secret"
          />
          {errors.webhookSecret && (
            <p className="mt-1 text-sm text-red-600">{errors.webhookSecret.message}</p>
          )}
        </div>

        <div className="flex justify-between space-x-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Connecting...' : 'Connect Store'}
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default StoreConnectionForm;
