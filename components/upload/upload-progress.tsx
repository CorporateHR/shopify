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
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Upload Progress
      </h2>

      {uploadProgress.map((file, index) => (
        <div 
          key={index} 
          className="mb-4 last:mb-0"
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">{file.name}</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">{file.speed}</span>
              <button 
                className="text-gray-500 hover:text-gray-700"
                title="Pause upload"
              >
                <Pause className="w-4 h-4" />
              </button>
              <button 
                className="text-red-500 hover:text-red-700"
                title="Cancel upload"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${file.progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 mt-1 text-right">
            {file.progress}% Uploaded
          </p>
        </div>
      ))}

      {uploadProgress.length === 0 && (
        <div className="text-center text-gray-500 py-6">
          No active uploads
        </div>
      )}
    </div>
  );
}
