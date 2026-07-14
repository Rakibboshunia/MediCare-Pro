'use client';

import { useState } from 'react';
import { ChartBarIcon, ArrowTrendingUpIcon, UsersIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

export default function Analytics() {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert('Data exported successfully!');
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-text-primary">Analytics & Reports</h1>
        <button
          className="px-5 py-3 bg-bg-secondary text-text-primary border border-border rounded-xl font-semibold transition-colors hover:bg-border flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          onClick={handleExport}
          disabled={isExporting}
        >
          {isExporting ? 'Exporting...' : (
            <>Export Data <ArrowDownTrayIcon className="w-4 h-4" /></>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="glass-panel p-6 flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <UsersIcon className="w-6 h-6 text-accent-primary" />
              <h3 className="text-lg font-semibold text-text-primary">Patient Growth</h3>
            </div>
            <span className="flex items-center gap-1 text-success font-semibold text-sm bg-success-light px-2 py-1 rounded-md">
              +12.5% <ArrowTrendingUpIcon className="w-4 h-4" />
            </span>
          </div>
          <div className="h-[200px] flex items-end pt-4 border-b border-border">
            <div className="flex justify-between w-full h-full items-end">
              {[40, 60, 45, 80, 65, 90, 75].map((h, i) => (
                <div key={i} className="flex flex-col items-center gap-2 w-[10%] h-full justify-end">
                  <div
                    className="w-full rounded-t bg-gradient-to-t from-accent-primary to-purple-400 transition-all duration-500"
                    style={{ height: `${h}%` }}
                  ></div>
                  <span className="text-xs text-text-muted">{['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <ChartBarIcon className="w-6 h-6 text-warning" />
              <h3 className="text-lg font-semibold text-text-primary">Revenue Overview</h3>
            </div>
            <span className="flex items-center gap-1 text-success font-semibold text-sm bg-success-light px-2 py-1 rounded-md">
              +8.2% <ArrowTrendingUpIcon className="w-4 h-4" />
            </span>
          </div>
          <div className="flex flex-col gap-4">
            {[
              { label: 'Total Revenue', value: '$124,500' },
              { label: 'Outstanding', value: '$12,300' },
              { label: 'Expenses', value: '$45,200' },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center p-4 bg-bg-primary rounded-xl border border-border">
                <span className="text-text-muted font-medium">{item.label}</span>
                <span className="text-text-primary font-bold text-xl">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
