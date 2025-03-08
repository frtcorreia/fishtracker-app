import React, { useEffect } from 'react';
import { X, Download, ZoomIn, ZoomOut } from 'lucide-react';

interface ImageViewerProps {
  imageUrl: string;
  onClose: () => void;
}

export function ImageViewer({ imageUrl, onClose }: ImageViewerProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `catch-${Date.now()}.${blob.type.split('/')[1]}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-90  !mt-0">
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        {/* Toolbar */}
        <div className="absolute top-4 right-4 flex items-center space-x-4 z-[9999]">
          <button
            onClick={handleDownload}
            className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
            title="Download image"
          >
            <Download className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={onClose}
            className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
            title="Close"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Image */}
        <div className="relative max-w-[90%] max-h-[90vh]">
          <img
            src={imageUrl}
            alt="Catch"
            className="max-w-full max-h-[90vh] object-contain"
          />
        </div>
      </div>
    </div>
  );
}