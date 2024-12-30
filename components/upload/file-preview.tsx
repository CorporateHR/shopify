"use client";

import { FileSpreadsheet, Trash2, FileCheck } from 'lucide-react';

export function FilePreviewArea() {
  const mockFiles = [
    {
      name: 'summer_products.csv',
      size: '2.3 MB',
      type: 'CSV',
      status: 'ready'
    },
    {
      name: 'winter_inventory.xlsx',
      size: '5.1 MB',
      type: 'XLSX',
      status: 'error'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'ready':
        return <FileCheck className="text-[#00A6B2] w-5 h-5" />;
      case 'error':
        return <FileSpreadsheet className="text-[#FF3737] w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#1A1A1A] shadow-md rounded-lg p-6 border border-[#2A2A2A]">
      <h2 className="text-xl font-semibold mb-4 text-[#EAEAEA]">
        Uploaded Files
      </h2>

      {mockFiles.map((file, index) => (
        <div 
          key={index} 
          className="flex items-center justify-between border-b py-3 last:border-b-0 border-[#2A2A2A]"
        >
          <div className="flex items-center space-x-4">
            {getStatusIcon(file.status)}
            <div>
              <h3 className="font-medium text-[#EAEAEA]">{file.name}</h3>
              <p className="text-sm text-[#C0C0C0]">
                {file.size} • {file.type}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button 
              className="text-[#FF3737] hover:text-[#FF5555] transition-colors"
              title="Remove file"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}

      {mockFiles.length === 0 && (
        <div className="text-center text-[#C0C0C0] py-6">
          No files uploaded yet
        </div>
      )}
    </div>
  );
}
