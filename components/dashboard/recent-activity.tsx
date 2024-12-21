"use client";

import { 
  FileSpreadsheet, 
  CheckCircle, 
  AlertTriangle, 
  Clock 
} from 'lucide-react';

const activityLogs = [
  {
    id: 1,
    type: 'upload',
    fileName: 'summer_collection.csv',
    status: 'success',
    timestamp: '2 hours ago'
  },
  {
    id: 2,
    type: 'upload',
    fileName: 'winter_inventory.xlsx',
    status: 'pending',
    timestamp: '5 hours ago'
  },
  {
    id: 3,
    type: 'upload',
    fileName: 'accessories_list.csv',
    status: 'error',
    timestamp: 'Yesterday'
  }
];

export function RecentActivity() {
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Recent Activity</h2>
        <button className="text-blue-600 hover:underline text-sm">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {activityLogs.map((log) => (
          <div 
            key={log.id} 
            className="flex items-center justify-between border-b pb-3 last:border-b-0"
          >
            <div className="flex items-center space-x-4">
              <FileSpreadsheet className="w-6 h-6 text-gray-500" />
              <div>
                <h3 className="font-medium">{log.fileName}</h3>
                <p className="text-sm text-gray-500">{log.timestamp}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {getStatusIcon(log.status)}
              <span 
                className={`
                  px-3 py-1 rounded-full text-xs font-medium capitalize
                  ${log.status === 'success' 
                    ? 'bg-green-100 text-green-800' 
                    : log.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                  }
                `}
              >
                {log.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
