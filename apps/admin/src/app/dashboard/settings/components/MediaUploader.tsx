'use client';

import { useRef, useState, useCallback } from 'react';
import { Globe, Star, Loader2 } from 'lucide-react';

interface MediaUploaderProps {
  label: string;
  type: 'logo' | 'favicon';
  currentUrl: string;
  onUpload: (file: File) => Promise<void>;
  isUploading: boolean;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  label,
  type,
  currentUrl,
  onUpload,
  isUploading
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [imageError, setImageError] = useState(false);

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await onUpload(file);
      setImageError(false);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
  }, [onUpload]);

  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const Icon = type === 'logo' ? Globe : Star;
  const accept = type === 'logo' ? 'image/*' : 'image/*,.ico';
  const dimensionHint = type === 'logo' 
    ? 'Recommended: 200x200px' 
    : 'Recommended: 16x16px or 32x32px';

  return (
    <div>
      <label className="block text-sm font-medium custom-font text-gray-700 mb-2">
        {label}
      </label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors">
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleFileSelect}
          disabled={isUploading}
        />
        <button
          onClick={handleClick}
          disabled={isUploading}
          className="w-full cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
        >
          {isUploading ? (
            <div className="space-y-2">
              <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
              <p className="text-sm text-gray-500">Uploading...</p>
            </div>
          ) : currentUrl ? (
            <div className="space-y-2">
              <div className="w-16 h-16 mx-auto flex items-center justify-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                {imageError ? (
                  <Icon className="w-8 h-8 text-gray-400" />
                ) : (
                  <img
                    src={currentUrl}
                    alt={label}
                    className="w-full h-full object-contain"
                    crossOrigin="anonymous"
                    onError={() => setImageError(true)}
                    onLoad={() => setImageError(false)}
                  />
                )}
              </div>
              <p className="text-sm text-blue-600">Click to change {label.toLowerCase()}</p>
              <p className="text-xs text-gray-400 truncate max-w-[200px] mx-auto px-2">{currentUrl}</p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto flex items-center justify-center">
                <Icon className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500">Click to upload {label.toLowerCase()}</p>
              <p className="text-xs text-gray-400">{dimensionHint}</p>
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

