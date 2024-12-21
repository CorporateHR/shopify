"use client";

import Image from 'next/image';
import { Bell, Settings, LogOut } from 'lucide-react';

export function DashboardHeader() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* User Profile Section */}
        <div className="flex items-center space-x-4">
          <div className="relative w-12 h-12">
            <img 
              src="/default-avatar.png" 
              alt="User Profile" 
              className="rounded-full object-cover w-full h-full"
            />
          </div>
          <div>
            <h2 className="text-lg font-semibold">John Doe</h2>
            <p className="text-sm text-gray-500">Shopify CSV Manager</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center space-x-4">
          <button className="text-gray-600 hover:text-blue-600 transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <button className="text-gray-600 hover:text-blue-600 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
          <button 
            className="text-gray-600 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
