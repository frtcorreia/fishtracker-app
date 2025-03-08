import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Fish, MapPin, Calendar, Scale, Plus, Pencil, Trash2, Search, Eye } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCatchesStore } from '../../store/catchesStore';

const ITEMS_PER_PAGE = 10;

export function CatchesList() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useAuthStore();
  const { catches, loading, deleteCatch, loadCatches } = useCatchesStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadCatches(user.uid);
    }
  }, [user, loadCatches]);

  const handleDelete = async (id: string, imageUrl?: string) => {
    if (window.confirm(t('catches.list.actions.confirmDelete'))) {
      try {
        await deleteCatch(id, imageUrl);
      } catch (error) {
        console.error('Error deleting catch:', error);
      }
    }
  };

  const filteredCatches = catches.filter(catch_ => {
    if (!search) return true;
    
    const searchLower = search.toLowerCase();
    const searchTerms = searchLower.split(' ').filter(term => term.length > 0);
    
    return searchTerms.every(term => { 
      const weight = catch_.catch.weight?.toString() || '';
      const length = catch_.catch.length?.toString() || '';
      const date = catch_.date || '';
      const time = catch_.time || ''; 
      
      return ( 
        weight.includes(term) ||
        length.includes(term) ||
        date.includes(term) ||
        time.includes(term)
      );
    });
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredCatches.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentCatches = filteredCatches.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('catches.list.title')}
        </h1>
        <Link
          to="/catches/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          {t('catches.list.addNew')}
        </Link>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
        <input
          type="text"
          placeholder={t('catches.list.searchPlaceholder')}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1); // Reset to first page when searching
          }}
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        {currentCatches.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            {search ? t('catches.list.emptySearch') : t('catches.list.empty')}
            {!search && (
              <div className="mt-2">
                <Link to="/catches/new" className="text-blue-600 hover:text-blue-500">
                  {t('catches.list.addFirst')}
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {currentCatches.map((catch_) => (
              <div
                key={catch_.id}
                className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {catch_.catch.imageUrl ? (
                      <img
                        src={catch_.catch.imageUrl}
                        alt={t('catches.list.details.species')}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                        <Fish className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {catch_.catch.species}
                      </p>
                      <div className="flex items-center flex-wrap gap-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {(catch_.catch.weight || catch_.catch.length) && (
                          <div className="flex items-center">
                            <Scale className="w-4 h-4 mr-1" />
                            {catch_.catch.weight && `${catch_.catch.weight}g`}
                            {catch_.catch.weight && catch_.catch.length && ' • '}
                            {catch_.catch.length && `${catch_.catch.length}cm`}
                          </div>
                        )}
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {catch_.date} {catch_.time}
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          catch_.visibility === 'public'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                        }`}>
                          {t(`catches.list.details.visibility.${catch_.visibility}`)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => navigate(`/catches/view/${catch_.id}`)}
                      className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                      title={t('catches.list.actions.view')}
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => navigate(`/catches/edit/${catch_.id}`)}
                      className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                      title={t('catches.list.actions.edit')}
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(catch_.id, catch_.catch.imageUrl)}
                      className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                      title={t('catches.list.actions.delete')}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {t('catches.list.pagination.showing')}{' '}
                <span className="font-medium">{startIndex + 1}</span>{' '}
                {t('catches.list.pagination.to')}{' '}
                <span className="font-medium">
                  {Math.min(endIndex, filteredCatches.length)}
                </span>{' '}
                {t('catches.list.pagination.of')}{' '}
                <span className="font-medium">{filteredCatches.length}</span>{' '}
                {t('catches.list.pagination.results')}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}