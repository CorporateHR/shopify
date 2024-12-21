"use client";

import { Plus, Link, MoreHorizontal } from 'lucide-react';

const stores = [
  {
    name: 'Main Store',
    domain: 'myshopify.com',
    status: 'connected',
    logo: '/shopify-logo.png'
  },
  {
    name: 'Backup Store',
    domain: 'backup-store.myshopify.com',
    status: 'pending',
    logo: '/shopify-logo.png'
  }
];

export function StoreManagement() {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Connected Stores</h2>
        <button className="flex items-center text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md">
          <Plus className="w-5 h-5 mr-2" />
          Add Store
        </button>
      </div>

      <div className="space-y-4">
        {stores.map((store, index) => (
          <div 
            key={index} 
            className="flex items-center justify-between border-b pb-4 last:border-b-0"
          >
            <div className="flex items-center space-x-4">
              <img 
                src={store.logo} 
                alt={`${store.name} logo`} 
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h3 className="font-medium">{store.name}</h3>
                <p className="text-sm text-gray-500">{store.domain}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span 
                className={`
                  px-3 py-1 rounded-full text-xs font-medium
                  ${store.status === 'connected' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                  }
                `}
              >
                {store.status === 'connected' ? 'Connected' : 'Pending'}
              </span>
              <button className="text-gray-500 hover:text-gray-700">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
