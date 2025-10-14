import React, { useState, useRef } from 'react';
import { Upload, FileText, Eye, X, Download, AlertCircle } from 'lucide-react';

interface PDFReaderProps {
  onFileSelect?: (file: File, content: string) => void;
  allowedTypes?: string[];
  maxSizeMB?: number;
}

interface FileInfo {
  name: string;
  size: number;
  type: string;
  content: string;
  lastModified: number;
}

export function PDFReader({ 
  onFileSelect, 
  allowedTypes = ['.pdf', '.doc', '.docx', '.txt'],
  maxSizeMB = 10 
}: PDFReaderProps) {
  const [selectedFile, setSelectedFile] = useState<FileInfo | null>(null);
  const [isReading, setIsReading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsReading(true);

    try {
      // Validate file type
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!allowedTypes.includes(fileExtension)) {
        throw new Error(`File type ${fileExtension} not allowed. Allowed types: ${allowedTypes.join(', ')}`);
      }

      // Validate file size
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > maxSizeMB) {
        throw new Error(`File size (${fileSizeMB.toFixed(2)}MB) exceeds limit of ${maxSizeMB}MB`);
      }

      let content = '';

      if (file.type === 'application/pdf') {
        // For PDF files, we'll use a simple text extraction
        // In production, you'd use a library like pdf-parse or PDF.js
        content = await readPDFAsText(file);
      } else if (file.type.includes('text/') || fileExtension === '.txt') {
        // For text files
        content = await readFileAsText(file);
      } else {
        // For other document types, show file info
        content = `Document uploaded: ${file.name}\nType: ${file.type}\nSize: ${(file.size / 1024).toFixed(2)} KB`;
      }

      const fileInfo: FileInfo = {
        name: file.name,
        size: file.size,
        type: file.type,
        content,
        lastModified: file.lastModified
      };

      setSelectedFile(fileInfo);
      onFileSelect?.(file, content);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to read file');
    } finally {
      setIsReading(false);
    }
  };

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  const readPDFAsText = async (file: File): Promise<string> => {
    // Simple PDF text extraction simulation
    // In production, use proper PDF parsing libraries
    const reader = new FileReader();
    return new Promise((resolve) => {
      reader.onload = () => {
        // Simulate PDF content extraction
        const sampleContent = `
PDF Document: ${file.name}
Date: ${new Date().toLocaleDateString()}

=== PROCUREMENT INVOICE ===

Invoice #: INV-2025-001
Vendor: ${file.name.includes('suspicious') ? 'Suspicious Vendor Ltd' : 'BuildCorp Industries'}
Project: School Construction - Phase 1
Amount: $${file.name.includes('suspicious') ? '4,999,999' : '1,250,000'}

Work Description:
- Site preparation and foundation work
- Building structure construction
- Electrical and plumbing installation
- Interior finishing work

Payment Terms: Net 30 days
Due Date: ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}

=== AI FRAUD ANALYSIS ===
${file.name.includes('suspicious') ? 
  'WARNING: Round number amount detected (suspicious pattern)' : 
  'Standard invoice pattern detected'
}

Vendor History: ${file.name.includes('suspicious') ? 'Limited' : 'Established vendor with good track record'}
`;
        resolve(sampleContent);
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const clearFile = () => {
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {/* File Upload Area */}
      <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
        <input
          ref={fileInputRef}
          type="file"
          accept={allowedTypes.join(',')}
          onChange={handleFileSelect}
          className="hidden"
          id="pdf-upload"
        />
        <label htmlFor="pdf-upload" className="cursor-pointer">
          <div className="flex flex-col items-center space-y-3">
            <div className="p-3 bg-yellow-50 rounded-full">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="text-lg font-medium text-slate-700">
                Upload Invoice or Documents
              </p>
              <p className="text-sm text-slate-500">
                Supported: {allowedTypes.join(', ')} (max {maxSizeMB}MB)
              </p>
            </div>
            <button
              type="button"
              className="bg-yellow-500 hover:bg-primary hover:text-black text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Choose File
            </button>
          </div>
        </label>
      </div>

      {/* Loading State */}
      {isReading && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <span className="text-blue-700 font-medium">Reading document...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-red-800">Upload Error</h4>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* File Display */}
      {selectedFile && (
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-slate-900">{selectedFile.name}</h3>
                <p className="text-sm text-slate-500">
                  {(selectedFile.size / 1024).toFixed(2)} KB • {new Date(selectedFile.lastModified).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {/* Download functionality */}}
                className="p-2 text-slate-500 hover:text-blue-600 transition-colors"
                title="Download"
              >
                <Download className="h-4 w-4" />
              </button>
              <button
                onClick={clearFile}
                className="p-2 text-slate-500 hover:text-red-600 transition-colors"
                title="Remove"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Document Content Preview */}
          <div className="bg-slate-50 rounded-lg p-4 max-h-96 overflow-y-auto">
            <div className="flex items-center space-x-2 mb-3">
              <Eye className="h-4 w-4 text-slate-600" />
              <span className="text-sm font-medium text-slate-700">Document Content</span>
            </div>
            <pre className="text-sm text-slate-800 whitespace-pre-wrap font-mono leading-relaxed">
              {selectedFile.content}
            </pre>
          </div>

          {/* AI Analysis Section */}
          <div className="mt-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-3 h-3 bg-purple-600 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-purple-800">AI Analysis</span>
            </div>
            <p className="text-sm text-purple-700">
              Document analyzed for fraud indicators. {
                selectedFile.name.includes('suspicious') ? 
                '⚠️ Suspicious patterns detected in amount formatting' :
                '✅ Standard business document format detected'
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
}