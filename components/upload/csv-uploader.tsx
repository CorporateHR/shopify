"use client";

import React, { useState, useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { toast } from "@/components/ui/use-toast";
import { AIFieldMapper, FieldMapping } from '@/utils/ai-field-mapper';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, X, Check, AlertTriangle, FileSpreadsheet, Download } from 'lucide-react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from '@/components/ui/select';
import { getShopifyTemplateHeaders } from '@/utils/shopify-template';
import { googleSheetsService } from '@/utils/google-sheets';

interface UploadedData {
  data: any[];
  headers: string[];
}

interface ValidationError {
  type: 'FILE_SIZE' | 'FILE_TYPE' | 'DATA_INTEGRITY' | 'COLUMN_MAPPING';
  message: string;
  details?: any;
}

interface FileValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface FieldMapping {
  originalField: string;
  suggestedField: string;
  confidence: number;
}

const validateFileSize = (file: File, maxSizeMB: number = 10): ValidationError | null => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      type: 'FILE_SIZE',
      message: `File size exceeds ${maxSizeMB}MB limit`,
      details: { currentSize: file.size, maxSize: maxSizeBytes }
    };
  }
  return null;
};

const validateFileType = (file: File): ValidationError | null => {
  const allowedTypes = ['text/csv', 'application/vnd.ms-excel'];
  if (!allowedTypes.includes(file.type)) {
    return {
      type: 'FILE_TYPE',
      message: 'Unsupported file type. Please upload a CSV file.',
      details: { currentType: file.type, allowedTypes }
    };
  }
  return null;
};

const validateDataIntegrity = (data: any[]): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Check for empty data
  if (!data || data.length === 0) {
    errors.push({
      type: 'DATA_INTEGRITY',
      message: 'No data found in the uploaded file',
    });
  }

  // Pricing and inventory validation example
  data.forEach((row, index) => {
    const rowErrors: ValidationError[] = [];

    // Price validation
    if (row.price && (isNaN(parseFloat(row.price)) || parseFloat(row.price) < 0)) {
      rowErrors.push({
        type: 'DATA_INTEGRITY',
        message: `Invalid price at row ${index + 2}`,
        details: { price: row.price }
      });
    }

    // Inventory validation
    if (row.inventory && (isNaN(parseInt(row.inventory)) || parseInt(row.inventory) < 0)) {
      rowErrors.push({
        type: 'DATA_INTEGRITY',
        message: `Invalid inventory at row ${index + 2}`,
        details: { inventory: row.inventory }
      });
    }

    if (rowErrors.length > 0) {
      errors.push(...rowErrors);
    }
  });

  return errors;
};

const fuzzyColumnMatch = (headers: string[], targetColumns: string[]): FieldMapping[] => {
  const normalizeHeader = (header: string) => 
    header.toLowerCase().replace(/[^a-z0-9]/g, '');

  return targetColumns.map(target => {
    const bestMatch = headers.find(header => 
      normalizeHeader(header).includes(normalizeHeader(target))
    );

    return {
      originalField: bestMatch || '',
      suggestedField: target,
      confidence: bestMatch ? 0.8 : 0.2
    };
  });
};

// Simplified Field Mapping Analysis
const FieldMappingAnalysis = ({ 
  mappings 
}: { 
  mappings: FieldMapping[] 
}) => {
  const confidenceStats = {
    high: mappings.filter(m => m.confidence >= 90).length,
    medium: mappings.filter(m => m.confidence >= 70 && m.confidence < 90).length,
    low: mappings.filter(m => m.confidence < 70).length
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-[#1A1A1A] border-[#2A2A2A]">
      <CardHeader>
        <CardTitle className="text-[#EAEAEA]">AI Mapping Analysis</CardTitle>
        <CardDescription className="text-[#A0A0A0]">
          Mapping Confidence Overview
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-green-500/10 p-4 rounded-lg">
            <h3 className="text-green-400 font-semibold">High Confidence</h3>
            <p className="text-2xl font-bold text-green-300">{confidenceStats.high}</p>
          </div>
          <div className="bg-yellow-500/10 p-4 rounded-lg">
            <h3 className="text-yellow-400 font-semibold">Medium Confidence</h3>
            <p className="text-2xl font-bold text-yellow-300">{confidenceStats.medium}</p>
          </div>
          <div className="bg-red-500/10 p-4 rounded-lg">
            <h3 className="text-red-400 font-semibold">Low Confidence</h3>
            <p className="text-2xl font-bold text-red-300">{confidenceStats.low}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Manual Mapping Component
const ManualFieldMapping = ({ 
  originalHeaders, 
  currentMappings, 
  onSave,
  onCancel 
}: { 
  originalHeaders: string[], 
  currentMappings: FieldMapping[], 
  onSave: (mappings: FieldMapping[]) => void,
  onCancel: () => void 
}) => {
  const [editedMappings, setEditedMappings] = useState<FieldMapping[]>(currentMappings);

  // Get full list of Shopify template headers
  const shopifyFields = useMemo(() => {
    return getShopifyTemplateHeaders();
  }, []);

  const handleFieldChange = (index: number, newField: string) => {
    // Check if the field is already assigned
    const isDuplicate = editedMappings.some((mapping, idx) => 
      idx !== index && mapping.suggestedField === newField
    );

    if (isDuplicate) {
      toast({
        title: 'Mapping Error',
        description: 'This Shopify field is already assigned to another column.',
        variant: 'destructive'
      });
      return;
    }

    const updatedMappings = [...editedMappings];
    updatedMappings[index] = {
      ...updatedMappings[index],
      suggestedField: newField,
      confidence: 100 // Manual mapping gets 100% confidence
    };
    setEditedMappings(updatedMappings);
  };

  // Fuzzy search for headers
  const fuzzySearch = (header: string, options: string[]) => {
    const normalizeString = (str: string) => 
      str.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    const normalizedHeader = normalizeString(header);
    
    return options.filter(option => 
      normalizeString(option).includes(normalizedHeader) || 
      normalizedHeader.includes(normalizeString(option))
    );
  };

  return (
    <Card className="mt-4 bg-[#1A1A1A] border-[#2A2A2A]">
      <CardHeader>
        <CardTitle className="text-[#EAEAEA]">Manual Field Mapping</CardTitle>
        <CardDescription className="text-[#A0A0A0]">
          Adjust AI-suggested mappings to match your CSV structure
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-[#EAEAEA]">Original Field</TableHead>
              <TableHead className="text-[#EAEAEA]">Current Mapping</TableHead>
              <TableHead className="text-[#EAEAEA]">Manually Select Shopify Field</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {editedMappings.map((mapping, index) => {
              // Find potential matches for the current header
              const potentialMatches = fuzzySearch(mapping.originalField, shopifyFields);

              // Determine which fields are already assigned
              const assignedFields = editedMappings.map(m => m.suggestedField);

              // Filter out already assigned fields
              const availableFields = shopifyFields.filter(
                field => !assignedFields.includes(field) || field === mapping.suggestedField
              );

              return (
                <TableRow key={index}>
                  <TableCell className="text-[#C0C0C0]">
                    {mapping.originalField}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        mapping.confidence >= 90 ? 'default' : 
                        mapping.confidence >= 70 ? 'secondary' : 'destructive'
                      }
                    >
                      {mapping.suggestedField}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Select 
                      value={mapping.suggestedField}
                      onValueChange={(newField) => handleFieldChange(index, newField)}
                    >
                      <SelectTrigger className="w-[250px] bg-[#2A2A2A] text-[#EAEAEA]">
                        <SelectValue placeholder="Select Shopify Field" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1A1A1A] border-[#2A2A2A] max-h-[300px] overflow-y-auto">
                        {/* Prioritize potential matches */}
                        {potentialMatches.length > 0 && (
                          <SelectGroup>
                            <SelectLabel>Recommended Matches</SelectLabel>
                            {potentialMatches
                              .filter(field => availableFields.includes(field))
                              .map((field) => (
                                <SelectItem 
                                  key={field} 
                                  value={field}
                                  className="text-[#EAEAEA] hover:bg-[#2A2A2A]"
                                >
                                  {field}
                                </SelectItem>
                              ))
                            }
                          </SelectGroup>
                        )}
                        
                        {/* Full list of fields */}
                        <SelectGroup>
                          <SelectLabel>All Shopify Fields</SelectLabel>
                          {availableFields.map((field) => (
                            <SelectItem 
                              key={field} 
                              value={field}
                              className="text-[#EAEAEA] hover:bg-[#2A2A2A]"
                            >
                              {field}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <div className="flex justify-between mt-4 space-x-4">
          <Button 
            variant="outline"
            onClick={onCancel}
            className="flex-1 text-[#EAEAEA] border-[#3A3A3A] hover:bg-[#2A2A2A]"
          >
            Cancel
          </Button>
          <Button 
            onClick={() => onSave(editedMappings)}
            className="flex-1 bg-[#00A6B2] text-white hover:bg-[#00A6B2]/90"
          >
            Save Mappings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export function CSVUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadedData, setUploadedData] = useState<UploadedData | null>(null);
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>([]);
  const [uploading, setUploading] = useState(false);
  const [mapping, setMapping] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isManualMapping, setIsManualMapping] = useState(false);
  const [mappedFileId, setMappedFileId] = useState<string | null>(null);

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

      // Store the mapped file ID for download
      if (response.data.mappedFileId) {
        setMappedFileId(response.data.mappedFileId);
      }

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
      const fileValidationErrors: ValidationError[] = [];

      // File size and type validation
      const sizeError = validateFileSize(file);
      const typeError = validateFileType(file);

      if (sizeError) fileValidationErrors.push(sizeError);
      if (typeError) fileValidationErrors.push(typeError);

      if (fileValidationErrors.length > 0) {
        reject({ type: 'FILE_VALIDATION', errors: fileValidationErrors });
        return;
      }

      Papa.parse(file, {
        complete: (results) => {
          if (results.data && Array.isArray(results.data)) {
            const headers = results.data[0] as string[];
            const data = results.data.slice(1) as any[];

            // Data integrity validation
            const dataErrors = validateDataIntegrity(data);
            if (dataErrors.length > 0) {
              reject({ type: 'DATA_VALIDATION', errors: dataErrors });
              return;
            }

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
    });
  };

  // Enhanced Mapping Process in CSVUploader
  const mapFieldsWithAI = async () => {
    if (!uploadedData) return;

    setMapping(true);
    try {
      const aiMapper = new AIFieldMapper();
      
      // Intelligent field mapping
      const mappings = await aiMapper.mapFields(uploadedData.headers);

      // Categorize mappings by confidence
      const confidenceLevels = {
        high: mappings.filter(m => m.confidence >= 90),
        medium: mappings.filter(m => m.confidence >= 70 && m.confidence < 90),
        low: mappings.filter(m => m.confidence < 70)
      };

      // Visualization and interaction
      setFieldMappings(mappings);

      // Enhanced toast notifications
      toast({
        title: 'AI Field Mapping Complete',
        description: `Mapped ${mappings.length} fields with varying confidence`,
        variant: 'default'
      });

      // Optional: Show detailed mapping preview
      if (confidenceLevels.low.length > 0) {
        toast({
          title: 'Mapping Requires Attention',
          description: `${confidenceLevels.low.length} fields need manual review`,
          variant: 'default'
        });
      }

    } catch (error) {
      console.error('AI mapping error:', error);
      toast({
        title: 'Mapping Failed',
        description: 'Unable to map fields automatically. Please map manually.',
        variant: 'destructive'
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

      const transformedData = googleSheetsService.transformData(
        parsedData.data,
        fieldMappings.reduce((acc, map) => ({
          ...acc,
          [map.originalField]: map.suggestedField
        }), {})
      );
      
      await googleSheetsService.appendToSheet(transformedData);
      toast({
        title: "Success",
        description: "Data successfully uploaded to Google Sheets",
        variant: "default",
      });
    } catch (error) {
      console.error('Error uploading to Google Sheets:', error);
      toast({
        title: "Error",
        description: "Failed to upload data to Google Sheets",
        variant: "destructive",
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

  const handleManualMappingSave = (updatedMappings: FieldMapping[]) => {
    // Update field mappings with manually corrected version
    setFieldMappings(updatedMappings);
    setIsManualMapping(false);

    // Optional: Show success toast
    toast({
      title: 'Mapping Updated',
      description: 'Manual mappings have been saved successfully',
      variant: 'default'
    });
  };

  const handleManualMappingCancel = () => {
    setIsManualMapping(false);

    toast({
      title: 'Mapping Cancelled',
      description: 'Manual mapping was cancelled. Previous mappings remain unchanged.',
      variant: 'default'
    });
  };

  const downloadMappedFile = async (format: 'csv' | 'json' = 'csv') => {
    if (!mappedFileId) return;

    try {
      const response = await axios({
        url: `/api/download-mapped?fileId=${mappedFileId}&format=${format}`,
        method: 'GET',
        responseType: 'blob'
      });

      // Create a link to download the file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `mapped_file.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast({
        title: "Download Successful",
        description: `Mapped file downloaded in ${format.toUpperCase()} format.`,
        variant: "success"
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: "There was an error downloading the mapped file.",
        variant: "destructive"
      });
    }
  };

  const renderFieldMappingResults = () => {
    if (!fieldMappings.length) return null;

    if (isManualMapping) {
      return (
        <ManualFieldMapping 
          originalHeaders={uploadedData?.headers || []} 
          currentMappings={fieldMappings}
          onSave={handleManualMappingSave}
          onCancel={handleManualMappingCancel}
        />
      );
    }

    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Field Mapping Results</CardTitle>
          <CardDescription>
            Review and confirm the mapping of your CSV headers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Original Field</TableHead>
                <TableHead>Mapped Shopify Field</TableHead>
                <TableHead>Confidence</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fieldMappings.map((mapping, index) => (
                <TableRow key={index}>
                  <TableCell>{mapping.originalField}</TableCell>
                  <TableCell>{mapping.suggestedField}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        mapping.confidence >= 90 ? 'default' : 
                        mapping.confidence >= 70 ? 'secondary' : 'destructive'
                      }
                    >
                      {mapping.confidence.toFixed(2)}%
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {/* Mapping Action Buttons */}
          <div className="flex justify-between mt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsManualMapping(true)}
              className="text-[#EAEAEA] border-[#3A3A3A] hover:bg-[#2A2A2A]"
            >
              Manual Mapping
            </Button>
          
          </div>
          {uploadedData && mappedFileId && (
            <div className="mt-4 flex space-x-2">
              <Button 
                variant="outline" 
                onClick={() => downloadMappedFile('csv')}
              >
                <Download className="mr-2 h-4 w-4" /> 
                Download CSV
              </Button>
              <Button 
                variant="outline" 
                onClick={() => downloadMappedFile('json')}
              >
                <Download className="mr-2 h-4 w-4" /> 
                Download JSON
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* File Upload Section */}
      <Card 
        className="bg-[#1A1A1A] border border-[#2A2A2A]"
      >
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-[#EAEAEA]">
            <FileSpreadsheet className="h-6 w-6 text-[#00A6B2]" />
            <span>CSV File Upload</span>
          </CardTitle>
          <CardDescription className="text-[#C0C0C0]">
            Upload a CSV file to map fields to Shopify
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
              transition-colors duration-200 hover:bg-[#2A2A2A]/20
              ${isDragActive ? 'border-[#00A6B2] bg-[#00A6B2]/10' : 'border-[#2A2A2A]'}
              ${file ? 'bg-[#2A2A2A]/5' : ''}
            `}
          >
            <input {...getInputProps()} />
            
            {file ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-[#00A6B2]/20 p-2 rounded-full">
                    <Check className="h-6 w-6 text-[#00A6B2]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#EAEAEA]">{file.name}</p>
                    <p className="text-xs text-[#C0C0C0]">
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
                  <X className="h-4 w-4 text-[#C0C0C0] hover:text-[#EAEAEA]" />
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="h-8 w-8 mx-auto text-[#C0C0C0]" />
                <div className="text-[#C0C0C0]">
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
                <div className={`h-2 rounded-full ${uploadProgress === 100 ? 'bg-[#00A6B2]' : 'bg-[#2A2A2A]'}`} 
                  style={{ width: `${uploadProgress}%` }}
                />
              )}
              
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  className="border-[#00A6B2] text-[#00A6B2] hover:bg-[#00A6B2]/20"
                  onClick={removeFile}
                  disabled={uploading || mapping}
                >
                  Remove
                </Button>
                <Button
                  className="bg-[#00A6B2] hover:bg-[#008A94]"
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

      {/* Field Mapping Analysis */}
      {fieldMappings.length > 0 && (
        <FieldMappingAnalysis mappings={fieldMappings} />
      )}
      
      {/* Field Mapping Results */}
      {renderFieldMappingResults()}
    </div>
  );
}
