"use client";

import { useState } from 'react';
import { 
  FileSpreadsheet, 
  UploadCloud, 
  FileText, 
  FileSpreadsheet as FileXls, 
  FileCheck 
} from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { X } from 'lucide-react';

export function UploadZone() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const supportedFormats = [
    { icon: FileSpreadsheet, name: 'CSV', ext: '.csv' },
    { icon: FileText, name: 'TXT', ext: '.txt' },
    { icon: FileXls, name: 'Excel', ext: '.xlsx' }
  ];

  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) {
      setUploadStatus('error');
      setErrorMessage('No file selected');
      return;
    }

    const file = files[0];
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedExtensions = ['.csv', '.txt', '.xlsx'];

    if (file.size > maxSize) {
      setUploadStatus('error');
      setErrorMessage('File size exceeds 10MB limit');
      return;
    }

    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      setUploadStatus('error');
      setErrorMessage('Unsupported file format');
      return;
    }

    // Simulate upload success
    setUploadStatus('success');
  };

  return (
    <div className="bg-[#1A1A1A] shadow-lg rounded-xl p-8 border border-[#2A2A2A]">
      <div 
        className={`border-2 border-dashed ${isDragOver ? 'border-[#00A6B2]' : 'border-[#2A2A2A]'} rounded-lg p-8 text-center transition-colors`}
        onDragEnter={() => setIsDragOver(true)}
        onDragLeave={() => setIsDragOver(false)}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          handleFileUpload(e.dataTransfer.files);
        }}
      >
        <div 
          className={`flex justify-center mb-4 ${isDragOver ? 'text-[#00A6B2]' : 'text-[#C0C0C0]'}`}
        >
          <UploadCloud 
            className={`w-20 h-20 ${isDragOver ? 'text-[#00A6B2]' : 'text-[#C0C0C0]'}`} 
          />
        </div>

        <h2 className="text-2xl font-semibold mb-4 text-[#EAEAEA]">
          Drag and Drop Your Files Here
        </h2>

        <input 
          type="file" 
          accept=".csv,.txt,.xlsx" 
          className="hidden" 
          id="file-upload"
          onChange={(e) => handleFileUpload(e.target.files)}
        />
        <label 
          htmlFor="file-upload" 
          className="text-[#C0C0C0] mb-6 block"
        >
          or <span className="text-[#00A6B2] cursor-pointer">Browse Files</span>
        </label>

        <div className="flex justify-center space-x-4">
          {supportedFormats.map((format) => (
            <div 
              key={format.name} 
              className="flex flex-col items-center text-[#C0C0C0]"
            >
              <format.icon className="w-8 h-8 mb-2" />
              <span className="text-sm">{format.name}</span>
              <span className="text-xs text-[#C0C0C0]">{format.ext}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 text-center text-sm text-[#C0C0C0]">
        Max file size: 10MB | Supported formats: CSV, TXT, XLSX
      </div>

      <Dialog.Root open={uploadStatus !== 'idle'} onOpenChange={() => setUploadStatus('idle')}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          <Dialog.Content 
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
              bg-[#2A2A2A] p-6 rounded-xl shadow-xl w-[90%] max-w-md"
            aria-labelledby="upload-status-title"
            aria-describedby="upload-status-description"
          >
            <Dialog.Title className="sr-only">
              {uploadStatus === 'success' ? 'Upload Successful' : 'Upload Error'}
            </Dialog.Title>

            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-[#EAEAEA]">
                {uploadStatus === 'success' ? 'Upload Successful' : 'Upload Error'}
              </h3>
              
              <Dialog.Close asChild>
                <button 
                  aria-label="Close upload status dialog" 
                  className="text-[#C0C0C0] hover:text-[#00A6B2]"
                >
                  <X className="w-6 h-6" />
                </button>
              </Dialog.Close>
            </div>

            <Dialog.Description className="sr-only">
              {uploadStatus === 'success' 
                ? 'Your file has been uploaded successfully.' 
                : errorMessage}
            </Dialog.Description>

            <div 
              className={`p-4 rounded-lg ${
                uploadStatus === 'success' 
                  ? 'bg-green-900/20 text-green-400' 
                  : 'bg-red-900/20 text-red-400'
              }`}
            >
              {uploadStatus === 'success' 
                ? 'Your file has been uploaded successfully.' 
                : errorMessage}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
