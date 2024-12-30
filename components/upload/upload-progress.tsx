"use client";

import { Pause, X } from 'lucide-react';

export function UploadProgress() {
  const uploadProgress = [
    {
      name: 'summer_products.csv',
      progress: 75,
      speed: '2.3 MB/s',
      status: 'uploading'
    },
    {
      name: 'winter_inventory.xlsx',
      progress: 45,
      speed: '1.8 MB/s',
      status: 'uploading'
    }
  ];

  return (
    <div className="bg-[#1A1A1A] shadow-md rounded-lg p-6 border border-[#2A2A2A]">
      <h2 className="text-xl font-semibold mb-4 text-[#EAEAEA]">
        Upload Progress
      </h2>

      {uploadProgress.map((file, index) => (
        <div 
          key={index} 
          className="mb-4 last:mb-0 border-b border-[#2A2A2A] pb-4"
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-[#EAEAEA]">{file.name}</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-[#C0C0C0]">{file.speed}</span>
              <button 
                className="text-[#C0C0C0] hover:text-[#EAEAEA]"
                title="Pause upload"
              >
                <Pause className="w-4 h-4" />
              </button>
              <button 
                className="text-[#C0C0C0] hover:text-[#EAEAEA]"
                title="Cancel upload"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="w-full bg-[#2A2A2A] rounded-full h-2.5 mt-2">
            <div 
              className="h-2.5 bg-[#00A6B2] rounded-full" 
              style={{ width: `${file.progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-[#C0C0C0] mt-1 text-right">
            {file.progress}% Uploaded
          </p>
        </div>
      ))}

      {uploadProgress.length === 0 && (
        <div className="text-center text-[#C0C0C0] py-6">
          No active uploads
        </div>
      )}
    </div>
  );
}
