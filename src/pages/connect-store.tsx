import React, { useState } from 'react';
import StoreConnectionForm from '../components/StoreConnectionForm';
import Head from 'next/head';
import { PlusIcon } from 'lucide-react';

const ConnectStorePage: React.FC = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-[#121212] text-[#EAEAEA]">
      <Head>
        <title>Connect Your Shopify Store</title>
        <meta name="description" content="Connect your Shopify store to our application" />
      </Head>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-[#EAEAEA]">Connect Store</h1>
        <p className="text-[#C0C0C0]">
          Connect your Shopify store to import products and manage data
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="mt-6 text-center text-3xl font-extrabold text-[#EAEAEA]">
          Shopify Store Connections
        </h1>
        <p className="mt-2 text-center text-sm text-[#C0C0C0]">
          Manage and connect your Shopify stores
        </p>

        {!isFormVisible && (
          <div className="mt-6 text-center">
            <button 
              onClick={() => setIsFormVisible(true)}
              className="inline-flex items-center px-4 py-2 border border-[#2A2A2A] text-sm font-medium rounded-md shadow-sm text-[#EAEAEA] bg-[#00A6B2] hover:bg-[#008A94] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00A6B2]"
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
