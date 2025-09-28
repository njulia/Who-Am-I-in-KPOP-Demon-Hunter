import React, { useState, useRef, useCallback } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface ImageUploaderProps {
  onImageSelect: (file: File | null) => void;
  selectedImagePreview: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, selectedImagePreview }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };
  
  const handleContainerClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  }, [onImageSelect]);


  return (
    <div 
      className="w-full max-w-lg mx-auto"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
      />
      <div 
        onClick={handleContainerClick}
        className="cursor-pointer bg-gray-900/50 border-2 border-dashed border-gray-600 rounded-xl p-8 text-center transition-colors duration-300 hover:border-pink-500 hover:bg-gray-800/50"
      >
        {selectedImagePreview ? (
          <img src={selectedImagePreview} alt="Selected preview" className="max-h-64 w-auto mx-auto rounded-lg" />
        ) : (
          <div className="flex flex-col items-center text-gray-400">
            <UploadIcon className="w-12 h-12 mb-4" />
            <p className="font-semibold">Click to upload or drag & drop</p>
            <p className="text-sm text-gray-500">PNG, JPG or WEBP</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
