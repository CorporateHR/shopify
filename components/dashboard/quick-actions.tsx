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
      <button 
        className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-5 flex flex-col items-center justify-center hover:bg-[#2A2A2A] transition-colors"
      >
        <Upload className="w-8 h-8 text-[#00A6B2] mb-2" />
        <span className="text-sm font-medium text-[#EAEAEA]">New Import</span>
      </button>

      <button 
        className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-5 flex flex-col items-center justify-center hover:bg-[#2A2A2A] transition-colors"
      >
        <FileSpreadsheet className="w-8 h-8 text-[#00A6B2] mb-2" />
        <span className="text-sm font-medium text-[#EAEAEA]">Templates</span>
      </button>

      <button 
        className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-5 flex flex-col items-center justify-center hover:bg-[#2A2A2A] transition-colors"
      >
        <Settings className="w-8 h-8 text-[#00A6B2] mb-2" />
        <span className="text-sm font-medium text-[#EAEAEA]">API Config</span>
      </button>

      <button 
        className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-5 flex flex-col items-center justify-center hover:bg-[#2A2A2A] transition-colors"
      >
        <Download className="w-8 h-8 text-[#00A6B2] mb-2" />
        <span className="text-sm font-medium text-[#EAEAEA]">Export</span>
      </button>
    </div>
  );
}
