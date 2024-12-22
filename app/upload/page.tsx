"use client";

import { useState } from 'react';
import { Download } from 'lucide-react';
import AppLayout from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { CSVUploader } from "@/components/upload/csv-uploader";
import { ManualUploader } from "@/components/upload/manual-uploader";

export default function UploadPage() {
  const [uploadType, setUploadType] = useState<'csv' | 'manual'>('csv');

  const handleDownloadTemplate = async () => {
    window.location.href = '/api/csv/template';
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Upload Products</h1>
          <p className="text-gray-600">
            Import your product data using CSV or enter manually
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card 
            className={`cursor-pointer transition-all ${
              uploadType === 'csv' ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setUploadType('csv')}
          >
            <CardHeader>
              <CardTitle>CSV Upload</CardTitle>
              <CardDescription>
                Import multiple products at once using a CSV file
              </CardDescription>
            </CardHeader>
          </Card>

          <Card 
            className={`cursor-pointer transition-all ${
              uploadType === 'manual' ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setUploadType('manual')}
          >
            <CardHeader>
              <CardTitle>Manual Entry</CardTitle>
              <CardDescription>
                Add products one by one with a form interface
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {uploadType === 'csv' ? 'CSV Upload' : 'Manual Entry'}
            </CardTitle>
            <CardDescription>
              {uploadType === 'csv' 
                ? 'Upload your product data using a CSV file' 
                : 'Enter your product details manually'
              }
            </CardDescription>
            {uploadType === 'csv' && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleDownloadTemplate}
                className="mt-2"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Template
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {uploadType === 'csv' ? (
              <CSVUploader />
            ) : (
              <ManualUploader />
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
