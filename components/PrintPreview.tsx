import React from 'react';
import { ReportItem } from '../types';

interface PrintPreviewProps {
  items: ReportItem[];
  containerId: string;
}

export const PrintPreview: React.FC<PrintPreviewProps> = ({ items, containerId }) => {
  return (
    <div className="w-full flex justify-center bg-gray-200/50 p-4 rounded-xl overflow-hidden shadow-inner">
      {/* 
        A4 Aspect Ratio Container 
        Width: 210mm, Height: 297mm -> Ratio ~0.707
        Standard A4 at 96 DPI is approx 794px x 1123px.
      */}
      <div 
        id={containerId}
        className="bg-white shadow-lg mx-auto flex flex-col"
        style={{
          width: '794px',
          minHeight: '1123px', // Minimum A4 height
          padding: '40px',
          boxSizing: 'border-box'
        }}
      >
        {/* Content Items */}
        <div className="flex-1 space-y-8">
          {items.map((item) => (
            <div key={item.id} className="flex flex-col gap-3 break-inside-avoid">
              
              <div className="">
                {/* Description - Only render if description exists */}
                {item.description && (
                  <p className="text-gray-700 text-base leading-relaxed mb-4 whitespace-pre-wrap">
                    {item.description}
                  </p>
                )}

                {/* Image */}
                {item.imagePreviewUrl ? (
                  <div className="w-full flex justify-center bg-gray-50 rounded-lg border border-gray-100 p-2">
                    <img 
                      src={item.imagePreviewUrl} 
                      alt={`Evidence ${item.id}`}
                      className="max-w-full max-h-[450px] object-contain shadow-sm rounded"
                    />
                  </div>
                ) : (
                  <div className="w-full h-32 bg-gray-50 border border-dashed border-gray-300 rounded flex items-center justify-center text-gray-400 text-sm italic">
                    [No Image Provided]
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};