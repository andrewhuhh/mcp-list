import React, { useState } from 'react';
import { uploadImage } from '../lib/supabase';

interface ImageUploadProps {
  bucket: 'logos' | 'thumbnails';
  onUploadComplete: (url: string) => void;
  onUploadError: (error: Error) => void;
  className?: string;
  currentImageUrl?: string;
  fileName: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  bucket,
  onUploadComplete,
  onUploadError,
  className = '',
  currentImageUrl,
  fileName
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Create preview
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      
      setIsUploading(true);
      const publicUrl = await uploadImage(file, bucket, fileName);
      onUploadComplete(publicUrl);
      
      // Cleanup preview URL
      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      onUploadError(error instanceof Error ? error : new Error('Upload failed'));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors">
        {previewUrl ? (
          <div className="relative aspect-video">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-cover rounded-lg"
            />
            <label
              htmlFor={`file-upload-${bucket}`}
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer rounded-lg"
            >
              <span className="text-white font-medium">Change {bucket === 'logos' ? 'Logo' : 'Thumbnail'}</span>
            </label>
          </div>
        ) : (
          <label
            htmlFor={`file-upload-${bucket}`}
            className="flex flex-col items-center justify-center h-48 cursor-pointer"
          >
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span className="mt-2 text-sm font-medium text-gray-900">
              Upload {bucket === 'logos' ? 'Logo' : 'Thumbnail'}
            </span>
            <span className="mt-1 text-xs text-gray-500">
              PNG, JPG, GIF up to 5MB
            </span>
          </label>
        )}
        
        <input
          id={`file-upload-${bucket}`}
          name={`file-upload-${bucket}`}
          type="file"
          className="sr-only"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isUploading}
        />
      </div>

      {isUploading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            <span className="text-sm font-medium text-gray-900">Uploading...</span>
          </div>
        </div>
      )}
    </div>
  );
}; 