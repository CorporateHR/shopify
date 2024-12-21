'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList 
} from '@/components/ui/command';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { mapCSVToShopifyTemplate } from '@/utils/csv-mapper';
import { DEFAULT_TEMPLATE } from '@/utils/csv-template';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

type UploadStage = 'initial' | 'uploading' | 'mapping' | 'completed' | 'error';

export function CSVUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [stage, setStage] = useState<UploadStage>('initial');
  const [progress, setProgress] = useState(0);
  const [parsedCSV, setParsedCSV] = useState<any[]>([]);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [mappedCSV, setMappedCSV] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<any[]>([]);
  const [fieldMappings, setFieldMappings] = useState<{[key: string]: string}>({});
  const [openDropdowns, setOpenDropdowns] = useState<{[key: string]: boolean}>({});
  
  const { toast } = useToast();

  // Shopify template headers
  const shopifyHeaders = useMemo(() => 
    DEFAULT_TEMPLATE.split('\n')[0].split(','), 
    []
  );

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const csvFile = acceptedFiles[0];
    if (csvFile) {
      setFile(csvFile);
      
      // Parse headers
      Papa.parse(csvFile, {
        complete: (results: Papa.ParseResult<any>) => {
          if (results.data.length > 0) {
            const headers = Object.keys(results.data[0] as object);
            setCsvHeaders(headers);
            setParsedCSV(results.data);
            setStage('mapping');
          }
        },
        header: true,
        skipEmptyLines: true,
      });
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv']
    },
    multiple: false
  });

  const handleFieldMapping = (shopifyField: string, csvField: string) => {
    setFieldMappings(prev => ({
      ...prev,
      [shopifyField]: csvField
    }));
    // Close the dropdown after selection
    setOpenDropdowns(prev => ({
      ...prev,
      [shopifyField]: false
    }));
  };

  const completeMapping = () => {
    try {
      // Validate that all required fields are mapped
      const requiredFields = [
        'Title', 
        'Variant Price', 
        'Variant SKU', 
        'Published'
      ];

      const missingMappings = requiredFields.filter(
        field => !fieldMappings[field]
      );

      if (missingMappings.length > 0) {
        toast({
          children: (
            <div>
              <div className="font-semibold">Mapping Incomplete</div>
              <div>Please map the following required fields: {missingMappings.join(', ')}</div>
            </div>
          ),
          variant: 'destructive'
        });
        return;
      }

      // Transform CSV based on mappings
      const mappedData = parsedCSV.map(row => {
        const mappedRow: {[key: string]: string} = {};
        
        Object.entries(fieldMappings).forEach(([shopifyField, csvField]) => {
          mappedRow[shopifyField] = row[csvField] || '';
        });

        return mappedRow;
      });

      // Convert mapped data to CSV
      const csvContent = [
        shopifyHeaders.join(','),
        ...mappedData.map(row => 
          shopifyHeaders.map(header => row[header] || '').join(',')
        )
      ].join('\n');

      setMappedCSV(csvContent);
      setStage('completed');

      toast({
        children: (
          <div>
            <div className="font-semibold">Mapping Completed</div>
            <div>Successfully mapped {mappedData.length} rows</div>
          </div>
        ),
        variant: 'default'
      });

    } catch (error) {
      console.error('Mapping error:', error);
      
      toast({
        children: (
          <div>
            <div className="font-semibold">Mapping Error</div>
            <div>An error occurred while mapping the CSV</div>
          </div>
        ),
        variant: 'destructive'
      });
    }
  };

  const renderMappingInterface = () => (
    <div className="grid grid-cols-2 gap-8 p-4">
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Shopify Template Fields</h3>
          <div className="space-y-2">
            {shopifyHeaders.map((header, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input 
                  value={header} 
                  readOnly 
                  className="flex-grow bg-white" 
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Map Your CSV Fields</h3>
          <div className="space-y-2">
            {shopifyHeaders.map((header, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Label className="w-1/3 text-sm font-medium">{header}</Label>
                <Popover 
                  open={openDropdowns[header]} 
                  onOpenChange={(open) => 
                    setOpenDropdowns(prev => ({
                      ...prev,
                      [header]: open
                    }))
                  }
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openDropdowns[header]}
                      className="w-full justify-between"
                    >
                      {fieldMappings[header] 
                        ? fieldMappings[header]
                        : "Select CSV field"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput 
                        placeholder="Search CSV fields..." 
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>No field found.</CommandEmpty>
                        <CommandGroup>
                          <CommandItem 
                            key="_none" 
                            value="_none"
                            onSelect={() => handleFieldMapping(header, '')}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                fieldMappings[header] === '' 
                                  ? "opacity-100" 
                                  : "opacity-0"
                              )}
                            />
                            None
                          </CommandItem>
                          {csvHeaders.map((csvHeader) => (
                            <CommandItem 
                              key={csvHeader} 
                              value={csvHeader}
                              onSelect={() => handleFieldMapping(header, csvHeader)}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  fieldMappings[header] === csvHeader 
                                    ? "opacity-100" 
                                    : "opacity-0"
                                )}
                              />
                              {csvHeader}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            ))}
          </div>
        </div>
        
        <Button 
          onClick={completeMapping} 
          className="w-full"
          variant="default"
        >
          Complete Mapping
        </Button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (stage) {
      case 'initial':
        return (
          <div 
            {...getRootProps()} 
            className={`border-2 border-dashed p-10 text-center cursor-pointer ${
              isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
          >
            <input {...getInputProps()} />
            <p>Drag 'n' drop a CSV file here, or click to select</p>
          </div>
        );
      case 'mapping':
        return renderMappingInterface();
      case 'completed':
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">Mapped CSV Preview</h3>
            <pre className="bg-gray-100 p-4 rounded max-h-[300px] overflow-auto">
              {mappedCSV?.slice(0, 1000)}
              {(mappedCSV?.length || 0) > 1000 ? '...' : ''}
            </pre>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shopify Product CSV Uploader</CardTitle>
        <CardDescription>
          Upload and map your product CSV to Shopify format
        </CardDescription>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/shopify-template.csv'}
          >
            Download Template
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
}
