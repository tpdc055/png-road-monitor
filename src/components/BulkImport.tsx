"use client";

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Upload,
  FileText,
  Download,
  CheckCircle,
  AlertTriangle,
  X,
  Eye,
  Save
} from "lucide-react";

interface GPSDataRow {
  latitude: number;
  longitude: number;
  chainage: number;
  workType: string;
  status: string;
  comments?: string;
  projectId: string;
  userId: string;
}

interface ValidationError {
  row: number;
  field: string;
  message: string;
}

interface BulkImportProps {
  projectId: string;
  userId: string;
  onImport: (data: GPSDataRow[]) => Promise<void>;
  onCancel?: () => void;
}

export default function BulkImport({ projectId, userId, onImport, onCancel }: BulkImportProps) {
  const [csvData, setCsvData] = useState<any[]>([]);
  const [validatedData, setValidatedData] = useState<GPSDataRow[]>([]);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [step, setStep] = useState<'upload' | 'validate' | 'preview' | 'import'>('upload');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.type === 'text/csv') {
      setIsProcessing(true);

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setCsvData(results.data);
          setStep('validate');
          validateData(results.data);
          setIsProcessing(false);
        },
        error: (error) => {
          console.error('CSV Parse Error:', error);
          setIsProcessing(false);
        }
      });
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv']
    },
    maxFiles: 1
  });

  const validateData = (data: any[]) => {
    const validationErrors: ValidationError[] = [];
    const validated: GPSDataRow[] = [];

    data.forEach((row, index) => {
      const rowNumber = index + 1;

      // Required fields validation
      if (!row.latitude || isNaN(Number.parseFloat(row.latitude))) {
        validationErrors.push({
          row: rowNumber,
          field: 'latitude',
          message: 'Invalid or missing latitude'
        });
      }

      if (!row.longitude || isNaN(Number.parseFloat(row.longitude))) {
        validationErrors.push({
          row: rowNumber,
          field: 'longitude',
          message: 'Invalid or missing longitude'
        });
      }

      if (!row.chainage || isNaN(Number.parseFloat(row.chainage))) {
        validationErrors.push({
          row: rowNumber,
          field: 'chainage',
          message: 'Invalid or missing chainage'
        });
      }

      if (!row.workType) {
        validationErrors.push({
          row: rowNumber,
          field: 'workType',
          message: 'Missing work type'
        });
      }

      if (!row.status) {
        validationErrors.push({
          row: rowNumber,
          field: 'status',
          message: 'Missing status'
        });
      }

      // GPS coordinate ranges validation
      const lat = Number.parseFloat(row.latitude);
      const lng = Number.parseFloat(row.longitude);

      if (lat && (lat < -90 || lat > 90)) {
        validationErrors.push({
          row: rowNumber,
          field: 'latitude',
          message: 'Latitude must be between -90 and 90'
        });
      }

      if (lng && (lng < -180 || lng > 180)) {
        validationErrors.push({
          row: rowNumber,
          field: 'longitude',
          message: 'Longitude must be between -180 and 180'
        });
      }

      // PNG region validation (approximate bounds)
      if (lat && lng && (lat < -12 || lat > -1 || lng < 140 || lng > 155)) {
        validationErrors.push({
          row: rowNumber,
          field: 'coordinates',
          message: 'Coordinates appear to be outside PNG region'
        });
      }

      // If no errors for this row, add to validated data
      const rowErrors = validationErrors.filter(err => err.row === rowNumber);
      if (rowErrors.length === 0) {
        validated.push({
          latitude: Number.parseFloat(row.latitude),
          longitude: Number.parseFloat(row.longitude),
          chainage: Number.parseFloat(row.chainage),
          workType: row.workType,
          status: row.status,
          comments: row.comments || '',
          projectId,
          userId
        });
      }
    });

    setErrors(validationErrors);
    setValidatedData(validated);
    setStep('preview');
  };

  const handleImport = async () => {
    if (validatedData.length === 0) return;

    setIsProcessing(true);
    setStep('import');

    try {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      await onImport(validatedData);
      setUploadProgress(100);
    } catch (error) {
      console.error('Import failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadTemplate = () => {
    const template = [
      {
        latitude: '-9.4438',
        longitude: '147.1803',
        chainage: '0.000',
        workType: 'Earthworks',
        status: 'IN_PROGRESS',
        comments: 'Example GPS data entry'
      }
    ];

    const csv = Papa.unparse(template);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'gps_data_template.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const reset = () => {
    setCsvData([]);
    setValidatedData([]);
    setErrors([]);
    setUploadProgress(0);
    setStep('upload');
    setIsProcessing(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Bulk GPS Data Import
        </CardTitle>
        <CardDescription>
          Import GPS data from CSV files with validation and preview
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-6">
          {[
            { key: 'upload', label: 'Upload', icon: Upload },
            { key: 'validate', label: 'Validate', icon: CheckCircle },
            { key: 'preview', label: 'Preview', icon: Eye },
            { key: 'import', label: 'Import', icon: Save }
          ].map((s, index) => (
            <div key={s.key} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                step === s.key ? 'border-blue-500 bg-blue-500 text-white' :
                ['validate', 'preview', 'import'].indexOf(step) > ['validate', 'preview', 'import'].indexOf(s.key) ?
                'border-green-500 bg-green-500 text-white' : 'border-gray-300 bg-gray-100'
              }`}>
                <s.icon className="h-4 w-4" />
              </div>
              <span className="ml-2 text-sm font-medium">{s.label}</span>
              {index < 3 && <div className="w-8 h-0.5 bg-gray-300 mx-4" />}
            </div>
          ))}
        </div>

        {/* Upload Step */}
        {step === 'upload' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Select CSV File</h3>
              <Button variant="outline" onClick={downloadTemplate}>
                <Download className="mr-2 h-4 w-4" />
                Download Template
              </Button>
            </div>

            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input {...getInputProps()} />
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              {isDragActive ? (
                <p className="text-blue-600">Drop the CSV file here...</p>
              ) : (
                <div>
                  <p className="text-gray-600 mb-2">Drag and drop a CSV file here, or click to select</p>
                  <p className="text-sm text-gray-500">Only .csv files are accepted</p>
                </div>
              )}
            </div>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Required CSV columns:</strong> latitude, longitude, chainage, workType, status, comments (optional)
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Validation Results */}
        {step === 'validate' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Validation Results</h3>

            {errors.length > 0 ? (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Found {errors.length} validation errors. Please fix these issues before importing.
                </AlertDescription>
              </Alert>
            ) : (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  All {csvData.length} rows passed validation successfully!
                </AlertDescription>
              </Alert>
            )}

            {errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 mb-2">Validation Errors:</h4>
                <div className="space-y-1 max-h-60 overflow-y-auto">
                  {errors.map((error, index) => (
                    <div key={index} className="text-sm text-red-700">
                      Row {error.row}, {error.field}: {error.message}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={reset} variant="outline">
                <X className="mr-2 h-4 w-4" />
                Start Over
              </Button>
              {errors.length === 0 && (
                <Button onClick={() => setStep('preview')}>
                  Continue to Preview
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Preview Step */}
        {step === 'preview' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Data Preview</h3>
              <Badge variant="secondary">
                {validatedData.length} valid rows
              </Badge>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Latitude</TableHead>
                    <TableHead>Longitude</TableHead>
                    <TableHead>Chainage</TableHead>
                    <TableHead>Work Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Comments</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {validatedData.slice(0, 10).map((row, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-mono text-sm">{row.latitude.toFixed(6)}</TableCell>
                      <TableCell className="font-mono text-sm">{row.longitude.toFixed(6)}</TableCell>
                      <TableCell>{row.chainage.toFixed(3)} km</TableCell>
                      <TableCell>{row.workType}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{row.status}</Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{row.comments}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {validatedData.length > 10 && (
              <p className="text-sm text-gray-600 text-center">
                Showing first 10 rows of {validatedData.length} total rows
              </p>
            )}

            <div className="flex gap-2">
              <Button onClick={reset} variant="outline">
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={handleImport} disabled={validatedData.length === 0}>
                <Save className="mr-2 h-4 w-4" />
                Import {validatedData.length} Records
              </Button>
            </div>
          </div>
        )}

        {/* Import Progress */}
        {step === 'import' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Importing Data</h3>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>

            {uploadProgress === 100 && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Successfully imported {validatedData.length} GPS data records!
                </AlertDescription>
              </Alert>
            )}

            {isProcessing && (
              <div className="text-center text-sm text-gray-600">
                Processing {validatedData.length} records...
              </div>
            )}

            {uploadProgress === 100 && (
              <div className="flex gap-2">
                <Button onClick={reset} variant="outline">
                  Import More Data
                </Button>
                {onCancel && (
                  <Button onClick={onCancel}>
                    Done
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
