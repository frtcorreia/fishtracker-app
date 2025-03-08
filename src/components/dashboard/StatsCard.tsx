import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  change: string;
  up: boolean;
}

export function StatsCard({ title, value, icon: Icon, change, up }: StatsCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-semibold mt-1 text-gray-900 dark:text-white">
            {value}
          </p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
          <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
      </div>
      <div className="mt-4 flex items-center">
        {up ? (
          <ArrowUp className="w-4 h-4 text-green-500" />
        ) : (
          <ArrowDown className="w-4 h-4 text-red-500" />
        )}
        <span
          className={`ml-2 text-sm ${
            up ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {change}
        </span>
      </div>
    </div>
  );
}