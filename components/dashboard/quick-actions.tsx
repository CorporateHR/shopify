"use client";

import { 
  Upload, 
  FileSpreadsheet, 
  Settings, 
  Download 
} from 'lucide-react';

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <button className="bg-white shadow-md rounded-lg p-5 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors">
        <Upload className="w-8 h-8 text-blue-500 mb-2" />
        <span className="text-sm font-medium">New Import</span>
      </button>

      <button className="bg-white shadow-md rounded-lg p-5 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors">
        <FileSpreadsheet className="w-8 h-8 text-green-500 mb-2" />
        <span className="text-sm font-medium">Templates</span>
      </button>

      <button className="bg-white shadow-md rounded-lg p-5 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors">
        <Settings className="w-8 h-8 text-purple-500 mb-2" />
        <span className="text-sm font-medium">API Config</span>
      </button>

      <button className="bg-white shadow-md rounded-lg p-5 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors">
        <Download className="w-8 h-8 text-indigo-500 mb-2" />
        <span className="text-sm font-medium">Export</span>
      </button>
    </div>
  );
}
