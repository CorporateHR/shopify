import React, { useState } from 'react';
import StoreConnectionForm from '../components/StoreConnectionForm';
import Head from 'next/head';
import { PlusIcon } from 'lucide-react';

const ConnectStorePage: React.FC = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Head>
        <title>Connect Your Shopify Store</title>
        <meta name="description" content="Connect your Shopify store to our application" />
      </Head>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Shopify Store Connections
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          Manage and connect your Shopify stores
        </p>

        {!isFormVisible && (
          <div className="mt-6 text-center">
            <button 
              onClick={() => setIsFormVisible(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Store
            </button>
          </div>
        )}
      </div>

      {isFormVisible && (
        <div className="mt-8">
          <StoreConnectionForm 
            onCancel={() => setIsFormVisible(false)}
            onSuccess={() => setIsFormVisible(false)}
          />
        </div>
      )}
    </div>
  );
};

export default ConnectStorePage;
