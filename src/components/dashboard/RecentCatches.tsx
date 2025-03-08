import React from 'react';
import { Link } from 'react-router-dom';
import { Fish, Scale, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface RecentCatch {
  id: string;
  species: string;
  weight: number;
  length: number | null;
  date: string;
  time: string;
  imageUrl?: string;
}

interface RecentCatchesProps {
  catches: RecentCatch[];
}

export function RecentCatches({ catches }: RecentCatchesProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t('dashboard.recentCatches.title')}
        </h3>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {catches.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            {t('dashboard.recentCatches.empty')}{' '}
            <Link to="/catches/new" className="text-blue-600 hover:text-blue-500">
              {t('dashboard.recentCatches.addFirst')}
            </Link>
          </div>
        ) : (
          catches.map((catch_) => (
            <div
              key={catch_.id}
              className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    {catch_.imageUrl ? (
                      <img
                        src={catch_.imageUrl}
                        alt="Captura"
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                        <Fish className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {catch_.species}
                    </p>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <Scale className="w-4 h-4 mr-1" />
                        {catch_.weight && `${catch_.weight}g`}
                        {catch_.weight && catch_.length && ' • '}
                        {catch_.length && `${catch_.length}cm`}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {catch_.date} {catch_.time}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}