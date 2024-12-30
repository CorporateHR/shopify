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
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-5 flex items-center space-x-4">
        <Package className="w-10 h-10 text-[#00A6B2]" />
        <div>
          <h3 className="text-sm text-[#C0C0C0]">Total Products</h3>
          <p className="text-2xl font-bold text-[#EAEAEA]">1,245</p>
        </div>
      </div>

      {/* Recent Imports Widget */}
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-5 flex items-center space-x-4">
        <Upload className="w-10 h-10 text-[#00A6B2]" />
        <div>
          <h3 className="text-sm text-[#C0C0C0]">Recent Imports</h3>
          <p className="text-2xl font-bold text-[#EAEAEA]">24</p>
        </div>
      </div>

      {/* Successful Uploads Widget */}
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-5 flex items-center space-x-4">
        <CheckCircle className="w-10 h-10 text-[#00A6B2]" />
        <div>
          <h3 className="text-sm text-[#C0C0C0]">Successful Uploads</h3>
          <p className="text-2xl font-bold text-[#EAEAEA]">98%</p>
        </div>
      </div>

      {/* Error Logs Widget */}
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-5 flex items-center space-x-4">
        <AlertCircle className="w-10 h-10 text-destructive" />
        <div>
          <h3 className="text-sm text-[#C0C0C0]">Error Logs</h3>
          <p className="text-2xl font-bold text-[#EAEAEA]">3</p>
        </div>
      </div>
    </div>
  );
}
