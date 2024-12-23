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
  const [uploadType] = useState<'csv'>('csv');

  const handleDownloadTemplate = async () => {
    window.location.href = '/api/csv/template';
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Upload Products</h1>
          <p className="text-gray-600">
            Import your product data using CSV
          </p>
        </div>

        <div className="mb-8">
          <Card 
            className="ring-2 ring-primary"
          >
            <CardHeader>
              <CardTitle>CSV Upload</CardTitle>
              <CardDescription>
                Import multiple products at once using a CSV file
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CSVUploader />
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleDownloadTemplate} variant="outline">
            <Download className="mr-2 h-4 w-4" /> Download Template
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
