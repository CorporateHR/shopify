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
      <div className="container mx-auto px-4 py-8 min-h-screen bg-[#121212] text-[#EAEAEA]">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-[#EAEAEA]">Upload Products</h1>
          <p className="text-[#C0C0C0]">
            Import your product data using CSV
          </p>
        </div>

        <div className="mb-8">
          <Card 
            className="bg-[#1A1A1A] border border-[#2A2A2A] ring-2 ring-[#00A6B2]"
          >
            <CardHeader>
              <CardTitle className="text-[#EAEAEA]">CSV Upload</CardTitle>
              <CardDescription className="text-[#C0C0C0]">
                Import multiple products at once using a CSV file
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CSVUploader />
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button 
            onClick={handleDownloadTemplate} 
            variant="outline" 
            className="border-[#00A6B2] text-[#00A6B2] hover:bg-[#00A6B2]/20"
          >
            <Download className="mr-2 h-4 w-4" /> Download Template
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
