import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

const DistributedLists = () => {
  const [selectedUpload, setSelectedUpload] = useState<Id<"csvUploads"> | null>(null);
  
  const csvUploads = useQuery(api.csvUpload.getAllCsvUploads) || [];
  const distributedLists = useQuery(
    api.csvUpload.getDistributedLists,
    selectedUpload ? { csvUploadId: selectedUpload } : "skip"
  ) || [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Distributed Lists</h2>
        <p className="mt-2 text-sm text-gray-600">
          View how CSV uploads have been distributed among agents.
        </p>
      </div>

      {/* CSV Uploads List */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">CSV Uploads</h3>
        </div>
        {csvUploads.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No CSV uploads found. Upload a CSV file to see distributions.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    File Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Records
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uploaded
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {csvUploads.map((upload) => (
                  <tr key={upload._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {upload.fileName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {upload.totalRecords}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        upload.status === 'completed' 
                          ? 'bg-green-100 text-green-800'
                          : upload.status === 'processing'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {upload.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(upload._creationTime).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedUpload(upload._id)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View Distribution
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Distribution Details */}
      {selectedUpload && distributedLists.length > 0 && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Distribution Details</h3>
            <button
              onClick={() => setSelectedUpload(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {distributedLists.map((list) => (
                <div key={list.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-md font-medium text-gray-900">
                        {list.agent?.name || 'Unknown Agent'}
                      </h4>
                      <p className="text-sm text-gray-600">{list.agent?.email}</p>
                    </div>
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                      {list.assignedCount} records
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium text-gray-700">Assigned Records:</h5>
                    <div className="max-h-40 overflow-y-auto space-y-1">
                      {list.records.slice(0, 3).map((record, index) => (
                        <div key={index} className="text-xs bg-gray-50 p-2 rounded">
                          <p><strong>Name:</strong> {record.firstName}</p>
                          <p><strong>Phone:</strong> {record.phone}</p>
                          <p><strong>Notes:</strong> {record.notes}</p>
                        </div>
                      ))}
                      {list.records.length > 3 && (
                        <p className="text-xs text-gray-500 text-center">
                          ... and {list.records.length - 3} more records
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DistributedLists;
