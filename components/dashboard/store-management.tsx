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
    <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#EAEAEA]">Connected Stores</h2>
        <button className="flex items-center text-[#00A6B2] hover:bg-[#00A6B2]/20 px-3 py-2 rounded-md">
          <Plus className="w-5 h-5 mr-2" />
          Add Store
        </button>
      </div>

      <div className="space-y-4">
        {stores.map((store, index) => (
          <div 
            key={index} 
            className="flex items-center justify-between border-b border-[#2A2A2A] pb-4 last:border-b-0"
          >
            <div className="flex items-center space-x-4">
              <img 
                src={store.logo} 
                alt={`${store.name} logo`} 
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h3 className="font-medium text-[#EAEAEA]">{store.name}</h3>
                <p className="text-sm text-[#C0C0C0]">{store.domain}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span 
                className={`
                  px-3 py-1 rounded-full text-xs font-medium
                  ${store.status === 'connected' 
                    ? 'bg-[#00A6B2]/20 text-[#00A6B2]' 
                    : 'bg-yellow-500/20 text-yellow-500'
                  }
                `}
              >
                {store.status === 'connected' ? 'Connected' : 'Pending'}
              </span>
              <button className="text-[#C0C0C0] hover:text-[#EAEAEA]">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
