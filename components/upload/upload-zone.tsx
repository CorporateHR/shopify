"use client";

import { useState } from 'react';
import { 
  FileSpreadsheet, 
  UploadCloud, 
  FileText, 
  FileSpreadsheet as FileXls, 
  FileCheck 
} from 'lucide-react';

export function UploadZone() {
  const [isDragOver, setIsDragOver] = useState(false);

  const supportedFormats = [
    { icon: FileSpreadsheet, name: 'CSV', ext: '.csv' },
    { icon: FileText, name: 'TXT', ext: '.txt' },
    { icon: FileXls, name: 'Excel', ext: '.xlsx' }
  ];

  return (
    <div className="bg-white shadow-lg rounded-xl p-8">
      <div 
        className={`
          border-2 border-dashed rounded-lg p-12 text-center transition-all duration-300
          ${isDragOver 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-blue-300'
          }
        `}
        onDragEnter={() => setIsDragOver(true)}
        onDragLeave={() => setIsDragOver(false)}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
        }}
      >
        <div className="flex justify-center mb-6">
          <UploadCloud 
            className={`
              w-20 h-20 
              ${isDragOver ? 'text-blue-500' : 'text-gray-400'}
            `} 
          />
        </div>

        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Drag and Drop Your Files Here
        </h2>

        <p className="text-gray-600 mb-6">
          or <span className="text-blue-600 cursor-pointer">Browse Files</span>
        </p>

        <div className="flex justify-center space-x-4">
          {supportedFormats.map((format) => (
            <div 
              key={format.name} 
              className="flex flex-col items-center text-gray-500"
            >
              <format.icon className="w-8 h-8 mb-2" />
              <span className="text-sm">{format.name}</span>
              <span className="text-xs text-gray-400">{format.ext}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 text-center text-sm text-gray-500">
        Max file size: 10MB | Supported formats: CSV, TXT, XLSX
      </div>
    </div>
  );
}
