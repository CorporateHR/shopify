"use client";

import { 
  Package, 
  Upload, 
  AlertCircle, 
  CheckCircle 
} from 'lucide-react';

export function PerformanceWidgets() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Total Products Widget */}
      <div className="bg-white shadow-md rounded-lg p-5 flex items-center space-x-4">
        <Package className="w-10 h-10 text-blue-500" />
        <div>
          <h3 className="text-sm text-gray-500">Total Products</h3>
          <p className="text-2xl font-bold">1,245</p>
        </div>
      </div>

      {/* Recent Imports Widget */}
      <div className="bg-white shadow-md rounded-lg p-5 flex items-center space-x-4">
        <Upload className="w-10 h-10 text-green-500" />
        <div>
          <h3 className="text-sm text-gray-500">Recent Imports</h3>
          <p className="text-2xl font-bold">24</p>
        </div>
      </div>

      {/* Successful Uploads Widget */}
      <div className="bg-white shadow-md rounded-lg p-5 flex items-center space-x-4">
        <CheckCircle className="w-10 h-10 text-emerald-500" />
        <div>
          <h3 className="text-sm text-gray-500">Successful Uploads</h3>
          <p className="text-2xl font-bold">98%</p>
        </div>
      </div>

      {/* Error Logs Widget */}
      <div className="bg-white shadow-md rounded-lg p-5 flex items-center space-x-4">
        <AlertCircle className="w-10 h-10 text-red-500" />
        <div>
          <h3 className="text-sm text-gray-500">Error Logs</h3>
          <p className="text-2xl font-bold">3</p>
        </div>
      </div>
    </div>
  );
}
