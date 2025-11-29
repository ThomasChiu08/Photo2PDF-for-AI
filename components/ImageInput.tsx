import React, { useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageInputProps {
  id: number;
  previewUrl: string | null;
  onChange: (file: File | null) => void;
}

export const ImageInput: React.FC<ImageInputProps> = ({ id, previewUrl, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onChange(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      
      {!previewUrl ? (
        <div 
          onClick={triggerUpload}
          className="h-40 w-full border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors cursor-pointer flex flex-col items-center justify-center text-gray-500"
        >
          <Upload className="w-8 h-8 mb-2" />
          <span className="text-sm font-medium">Upload Image {id}</span>
          <span className="text-xs text-gray-400 mt-1">Click to browse</span>
        </div>
      ) : (
        <div className="relative group w-full h-40 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
          <img 
            src={previewUrl} 
            alt={`Upload ${id}`} 
            className="w-full h-full object-contain" 
          />
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            title="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/50 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
            Change
          </div>
        </div>
      )}
    </div>
  );
};