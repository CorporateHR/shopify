"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Upload, 
  Settings, 
  HelpCircle, 
  LogOut, 
  Link as LinkIcon 
} from 'lucide-react';

const navItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard
  },
  {
    name: 'Upload',
    href: '/upload',
    icon: Upload
  },
  {
    name: 'Store Connection',
    href: '/store-connection',
    icon: LinkIcon
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings
  },
  {
    name: 'Help',
    href: '/help',
    icon: HelpCircle
  }
];

const MappingProgress = ({ mappedFields, totalFields }) => {
  const progress = (mappedFields / totalFields) * 100;
  
  return (
    <div className="mt-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium">Mapping Progress</span>
        <span className="text-sm text-gray-500">{mappedFields}/{totalFields} fields mapped</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

const BulkActions = ({ onAutoMap, onClearAll }) => {
  return (
    <div className="flex gap-4 mb-6">
      <button 
        onClick={onAutoMap}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Auto-Map Fields
      </button>
      <button 
        onClick={onClearAll}
        className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
      >
        Clear All Mappings
      </button>
    </div>
  );
};

const MappingRow = ({ sourceField, onMapField }) => {
  return (
    <div className="flex items-center gap-4 p-2 hover:bg-gray-50">
      <div className="flex-1">
        <p className="font-medium">{sourceField}</p>
        <p className="text-sm text-gray-500">Source Column</p>
      </div>
      
      <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
      </svg>
      
      <select 
        className="flex-1 p-2 border rounded-md"
        onChange={(e) => onMapField(sourceField, e.target.value)}
      >
        <option value="">Select destination field...</option>
        {/* Destination field options */}
      </select>
    </div>
  );
};

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg border-r">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-gray-800">Shopify CSV</h1>
        <p className="text-sm text-gray-500">Data Management Tool</p>
      </div>

      <nav className="mt-8">
        {navItems.map((item) => (
          <Link 
            key={item.href}
            href={item.href}
            className={`
              flex items-center px-6 py-3 transition-colors duration-200
              ${pathname === item.href 
                ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' 
                : 'text-gray-600 hover:bg-gray-100'
              }
            `}
          >
            <item.icon className="w-5 h-5 mr-3" />
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-6 border-t">
        <button 
          className="w-full flex items-center justify-center py-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
}
