import React from 'react';
import { Upload, X } from 'lucide-react';

interface FormImageUploadProps {
  label: string;
  imagePreview: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageRemove: () => void;
  uploadText: string;
  dragDropText: string;
  formatsText: string;
}

export function FormImageUpload({
  label,
  imagePreview,
  onImageChange,
  onImageRemove,
  uploadText,
  dragDropText,
  formatsText,
}: FormImageUploadProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {label}
      </h2>
      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg">
        <div className="space-y-1 text-center">
          {imagePreview ? (
            <div className="relative inline-block">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-48 rounded-lg"
              />
              <button
                type="button"
                onClick={onImageRemove}
                className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          ) : (
            <>
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600 dark:text-gray-400">
                <label
                  htmlFor="image"
                  className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                >
                  <span>{uploadText}</span>
                  <input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={onImageChange}
                  />
                </label>
                <p className="pl-1">{dragDropText}</p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatsText}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}