"use client";

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { toast } from "@/components/ui/use-toast";
import { AIFieldMapper, FieldMapping } from '@/utils/ai-field-mapper';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, X, Check, AlertTriangle, FileSpreadsheet } from 'lucide-react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ToastAction } from '@/components/ui/toast';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface UploadedData {
  data: any[];
  headers: string[];
}

export function CSVUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadedData, setUploadedData] = useState<UploadedData | null>(null);
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>([]);
  const [uploading, setUploading] = useState(false);
  const [mapping, setMapping] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadToServer = async (uploadedFile: File) => {
    const formData = new FormData();
    formData.append('file', uploadedFile);

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          setUploadProgress(progress);
        },
      });

      return response.data;
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload Failed',
        variant: 'destructive',
        action: (
          <ToastAction altText="Upload failed">
            Unable to upload CSV file
          </ToastAction>
        )
      });
      throw error;
    }
  };

  const parseFile = async (file: File): Promise<UploadedData> => {
    return new Promise((resolve, reject) => {
      if (file.type === 'text/csv') {
        Papa.parse(file, {
          complete: (results) => {
            if (results.data && Array.isArray(results.data)) {
              const headers = results.data[0] as string[];
              const data = results.data.slice(1) as any[];
              resolve({ data, headers });
            } else {
              reject(new Error('Invalid CSV format'));
            }
          },
          header: false,
          error: (error) => {
            reject(error);
          }
        });
      } else {
        reject(new Error('Unsupported file type'));
      }
    });
  };

  const mapFieldsWithAI = async () => {
    if (!uploadedData) return;

    setMapping(true);
    try {
      const aiMapper = new AIFieldMapper();
      const mappings = await aiMapper.mapFields(uploadedData.headers);
      setFieldMappings(mappings);

      toast({
        title: 'Mapping Complete',
        action: (
          <ToastAction altText="Mapping complete">
            {`Successfully mapped ${mappings.length} fields`}
          </ToastAction>
        )
      });
    } catch (error) {
      console.error('AI mapping error:', error);
      toast({
        title: 'Mapping Failed',
        variant: 'destructive',
        action: (
          <ToastAction altText="Mapping failed">
            Unable to map fields automatically
          </ToastAction>
        )
      });
    } finally {
      setMapping(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      toast({
        title: 'File Selected',
        action: (
          <ToastAction altText="File details">
            {`${uploadedFile.name} (${(uploadedFile.size / 1024).toFixed(2)} KB)`}
          </ToastAction>
        )
      });
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv']
    },
    maxFiles: 1,
    multiple: false
  });

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      await uploadToServer(file);
      const parsedData = await parseFile(file);
      setUploadedData(parsedData);

      // Automatically start AI mapping
      await mapFieldsWithAI();
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Processing Failed',
        variant: 'destructive',
        action: (
          <ToastAction altText="Processing failed">
            Unable to process the file
          </ToastAction>
        )
      });
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setUploadProgress(0);
    setUploadedData(null);
    setFieldMappings([]);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* File Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileSpreadsheet className="h-6 w-6" />
            <span>CSV File Upload</span>
          </CardTitle>
          <CardDescription>
            Upload a CSV file to map fields to Shopify
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
              transition-colors duration-200 hover:bg-muted/10
              ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted'}
              ${file ? 'bg-muted/5' : ''}
            `}
          >
            <input {...getInputProps()} />
            
            {file ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Upload className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile();
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                <div className="text-muted-foreground">
                  {isDragActive ? (
                    <p>Drop the file here</p>
                  ) : (
                    <>
                      <p className="font-medium">Drag and drop or click to upload</p>
                      <p className="text-xs">CSV files only</p>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {file && (
            <div className="mt-4 space-y-3">
              {uploading && (
                <Progress value={uploadProgress} className="w-full" />
              )}
              
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={removeFile}
                  disabled={uploading || mapping}
                >
                  Remove
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={uploading || mapping}
                >
                  {uploading ? 'Processing...' : 'Upload & Map'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Field Mapping Section */}
      {uploadedData && fieldMappings.length > 0 && (
        <Card className="bg-white border-0 shadow-md">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-green-50 p-2 rounded-full">
                  <Check className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <CardTitle className="text-xl">Field Mapping Results</CardTitle>
                  <CardDescription className="text-sm mt-1">
                    AI-suggested mappings for your Shopify product fields
                  </CardDescription>
                </div>
              </div>
              <Badge variant="secondary" className="px-3 py-1">
                {fieldMappings.length} Fields Mapped
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-hidden rounded-b-lg">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="font-semibold">Shopify Field</TableHead>
                    <TableHead className="font-semibold">CSV Field</TableHead>
                    <TableHead className="font-semibold text-right">Confidence</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fieldMappings.map((mapping, index) => {
                    const isHighConfidence = mapping.confidence >= 80;
                    const isMediumConfidence = mapping.confidence >= 60 && mapping.confidence < 80;

                    return (
                      <TableRow 
                        key={index}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${
                              isHighConfidence 
                                ? 'bg-green-500' 
                                : isMediumConfidence 
                                  ? 'bg-yellow-500' 
                                  : 'bg-gray-300'
                            }`} />
                            <span>{mapping.suggestedField}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {mapping.originalField}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge 
                            variant={
                              isHighConfidence 
                                ? 'success' 
                                : isMediumConfidence 
                                  ? 'warning' 
                                  : 'secondary'
                            }
                            className={`
                              px-2 py-0.5 
                              ${isHighConfidence 
                                ? 'bg-green-100 text-green-800' 
                                : isMediumConfidence 
                                  ? 'bg-yellow-100 text-yellow-800' 
                                  : 'bg-gray-100 text-gray-800'}
                            `}
                          >
                            {mapping.confidence}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            
            <div className="p-4 bg-gray-50 border-t">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  {fieldMappings.filter(m => m.confidence >= 80).length} high confidence matches
                </div>
                <Button variant="outline" className="text-sm">
                  Review Mappings
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
