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

export default function UploadPage() {
  const [uploadType, setUploadType] = useState<'csv' | 'manual'>('csv');

  const handleDownloadTemplate = async () => {
    window.location.href = '/api/csv/template';
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl">Shopify CSV Uploader</CardTitle>
                  <CardDescription>
                    Upload and transform your product data for Shopify
                  </CardDescription>
                </div>
                <Button 
                  onClick={handleDownloadTemplate}
                >
                  <Download className="mr-2 h-4 w-4" /> 
                  Download Template
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-6">
                <div className="flex space-x-2">
                  <Button 
                    variant={uploadType === 'csv' ? 'default' : 'outline'}
                    onClick={() => setUploadType('csv')}
                  >
                    CSV Upload
                  </Button>
                  <Button 
                    variant={uploadType === 'manual' ? 'default' : 'outline'}
                    onClick={() => setUploadType('manual')}
                  >
                    Manual Entry
                  </Button>
                </div>
              </div>

              {uploadType === 'csv' && (
                <CSVUploader />
              )}

              {uploadType === 'manual' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Manual Product Entry</CardTitle>
                    <CardDescription>
                      Manually add products to your Shopify store
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Manual product entry coming soon...</p>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
