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
        return <CheckCircle className="w-5 h-5 text-[#00A6B2]" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-destructive" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#EAEAEA]">Recent Activity</h2>
        <button className="text-[#00A6B2] hover:text-[#008A94] text-sm">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {activityLogs.map((log) => (
          <div 
            key={log.id} 
            className="flex items-center justify-between border-b border-[#2A2A2A] pb-3 last:border-b-0"
          >
            <div className="flex items-center space-x-4">
              <FileSpreadsheet className="w-6 h-6 text-[#00A6B2]" />
              <div>
                <h3 className="font-medium text-[#EAEAEA]">{log.fileName}</h3>
                <p className="text-sm text-[#C0C0C0]">{log.timestamp}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {getStatusIcon(log.status)}
              <span 
                className={`
                  px-3 py-1 rounded-full text-xs font-medium capitalize
                  ${log.status === 'success' 
                    ? 'bg-[#00A6B2]/20 text-[#00A6B2]' 
                    : log.status === 'pending'
                    ? 'bg-yellow-500/20 text-yellow-500'
                    : 'bg-destructive/20 text-destructive'
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
