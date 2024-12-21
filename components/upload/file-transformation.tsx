"use client";

import { Table, Columns, FileCheck } from 'lucide-react';

export function FileTransformationPreview() {
  const mockTransformationData = {
    fileName: 'summer_products.csv',
    totalRows: 250,
    columns: [
      { name: 'Product Name', type: 'String', detected: true },
      { name: 'Price', type: 'Number', detected: true },
      { name: 'Category', type: 'String', detected: true },
      { name: 'SKU', type: 'String', detected: true }
    ]
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          File Transformation Preview
        </h2>
        <div className="flex items-center space-x-2 text-green-600">
          <FileCheck className="w-5 h-5" />
          <span className="text-sm">Ready for Shopify</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center space-x-3 mb-4">
            <Table className="w-6 h-6 text-gray-500" />
            <h3 className="font-medium">File Details</h3>
          </div>
          <div className="space-y-2 text-sm">
            <p>
              <span className="text-gray-600">File Name:</span>{' '}
              {mockTransformationData.fileName}
            </p>
            <p>
              <span className="text-gray-600">Total Rows:</span>{' '}
              {mockTransformationData.totalRows}
            </p>
          </div>
        </div>

        <div>
          <div className="flex items-center space-x-3 mb-4">
            <Columns className="w-6 h-6 text-gray-500" />
            <h3 className="font-medium">Column Detection</h3>
          </div>
          <div className="space-y-2">
            {mockTransformationData.columns.map((column, index) => (
              <div 
                key={index} 
                className="flex justify-between items-center text-sm"
              >
                <span>{column.name}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">{column.type}</span>
                  {column.detected && (
                    <FileCheck className="w-4 h-4 text-green-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
          Proceed to Shopify Upload
        </button>
      </div>
    </div>
  );
}
