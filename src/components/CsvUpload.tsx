import React, { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";

interface CsvRecord {
  firstName: string;
  phone: string;
  notes: string;
}

interface CsvUploadProps {
  adminId: string;
}

const CsvUpload = ({ adminId }: CsvUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [csvData, setCsvData] = useState<CsvRecord[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const agents = useQuery(api.agents.getAllAgents) || [];
  const processCsvData = useMutation(api.csvUpload.processCsvData);

  const validateFileType = (file: File) => {
    const allowedTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    const allowedExtensions = ['.csv', '.xls', '.xlsx'];
    
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    return allowedTypes.includes(file.type) || allowedExtensions.includes(fileExtension);
  };

  const parseCSV = (text: string): CsvRecord[] => {
    const lines = text.split('\n').filter((line: string) => line.trim());
    const headers = lines[0].split(',').map((h: string) => h.trim().toLowerCase());
    
    // Validate headers
    const requiredHeaders = ['firstname', 'phone', 'notes'];
    const hasRequiredHeaders = requiredHeaders.every(header => 
      headers.some((h: string) => h.includes(header))
    );
    
    if (!hasRequiredHeaders) {
      throw new Error('CSV must contain columns: FirstName, Phone, Notes');
    }
    
    const data: CsvRecord[] = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map((v: string) => v.trim().replace(/"/g, ''));
      if (values.length >= 3) {
        data.push({
          firstName: values[0] || '',
          phone: values[1] || '',
          notes: values[2] || '',
        });
      }
    }
    
    return data;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!validateFileType(selectedFile)) {
      toast.error('Please upload a valid CSV, XLS, or XLSX file');
      return;
    }

    setFile(selectedFile);
    
    // Read and parse the file
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsedData = parseCSV(text);
        setCsvData(parsedData);
        setShowPreview(true);
        toast.success(`File parsed successfully! Found ${parsedData.length} records.`);
      } catch (error: any) {
        toast.error(error.message || 'Error parsing CSV file');
        setFile(null);
      }
    };
    reader.readAsText(selectedFile);
  };

  const handleUpload = async () => {
    if (!file || csvData.length === 0) {
      toast.error('Please select and parse a valid file first');
      return;
    }

    if (agents.length === 0) {
      toast.error('No agents available. Please create agents first.');
      return;
    }

    setIsProcessing(true);
    
    try {
      await processCsvData({
        fileName: file.name,
        csvData: csvData,
        uploadedBy: adminId as Id<"adminUsers">,
      });
      
      toast.success(`Successfully distributed ${csvData.length} records among ${agents.length} agents!`);
      setFile(null);
      setCsvData([]);
      setShowPreview(false);
      
      // Reset file input
      const fileInput = document.getElementById('csvFile') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (error: any) {
      toast.error(error.message || 'Failed to process CSV file');
    } finally {
      setIsProcessing(false);
    }
  };

  const getDistributionPreview = () => {
    if (agents.length === 0 || csvData.length === 0) return [];
    
    const recordsPerAgent = Math.floor(csvData.length / agents.length);
    const remainingRecords = csvData.length % agents.length;
    
    return agents.map((agent, index) => ({
      agent: agent.name,
      records: recordsPerAgent + (index < remainingRecords ? 1 : 0),
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">CSV Upload & Distribution</h2>
        <p className="mt-2 text-sm text-gray-600">
          Upload a CSV file with FirstName, Phone, and Notes columns to distribute among agents.
        </p>
      </div>

      {/* Upload Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Upload CSV File</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select File (CSV, XLS, XLSX)
            </label>
            <input
              id="csvFile"
              type="file"
              accept=".csv,.xls,.xlsx"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          
          {file && (
            <div className="p-4 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>Selected:</strong> {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Preview Section */}
      {showPreview && csvData.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Data Preview ({csvData.length} records)
          </h3>
          
          {/* Distribution Preview */}
          <div className="mb-6">
            <h4 className="text-md font-medium text-gray-700 mb-2">Distribution Preview:</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {getDistributionPreview().map((item, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-md">
                  <p className="text-sm font-medium text-gray-900">{item.agent}</p>
                  <p className="text-sm text-gray-600">{item.records} records</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Data Preview Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    First Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {csvData.slice(0, 5).map((row, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.firstName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.notes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {csvData.length > 5 && (
              <p className="text-sm text-gray-500 mt-2 text-center">
                Showing first 5 records of {csvData.length} total records
              </p>
            )}
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => {
                setShowPreview(false);
                setFile(null);
                setCsvData([]);
                const fileInput = document.getElementById('csvFile') as HTMLInputElement;
                if (fileInput) fileInput.value = '';
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={isProcessing || agents.length === 0}
              className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing...' : 'Upload & Distribute'}
            </button>
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">CSV Format Requirements</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <ul className="list-disc list-inside space-y-1">
                <li>File must be in CSV, XLS, or XLSX format</li>
                <li>Required columns: FirstName, Phone, Notes</li>
                <li>First row should contain column headers</li>
                <li>Records will be distributed equally among all agents</li>
                <li>You currently have {agents.length} agents available</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CsvUpload;
