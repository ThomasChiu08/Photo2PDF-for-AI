import React, { useState, useCallback } from 'react';
import { FileText, Download, Loader2, RefreshCw } from 'lucide-react';
import { ImageInput } from './components/ImageInput';
import { PrintPreview } from './components/PrintPreview';
import { generatePDF } from './services/pdfService';
import { ReportItem } from './types';

const PREVIEW_ID = "pdf-report-preview";

const App: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [items, setItems] = useState<ReportItem[]>([
    { id: 1, description: '', image: null, imagePreviewUrl: null },
    { id: 2, description: '', image: null, imagePreviewUrl: null },
    { id: 3, description: '', image: null, imagePreviewUrl: null },
  ]);

  // Handle Text Change
  const handleTextChange = (id: number, text: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, description: text } : item
    ));
  };

  // Handle Image Change
  const handleImageChange = (id: number, file: File | null) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        // Clean up old preview URL to avoid memory leaks
        if (item.imagePreviewUrl) {
          URL.revokeObjectURL(item.imagePreviewUrl);
        }
        return {
          ...item,
          image: file,
          imagePreviewUrl: file ? URL.createObjectURL(file) : null
        };
      }
      return item;
    }));
  };

  // Handle PDF Generation
  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    // Small timeout to allow UI to update to loading state
    setTimeout(async () => {
      try {
        await generatePDF(PREVIEW_ID, 'my-report.pdf');
      } catch (err) {
        console.error(err);
        alert('Failed to generate PDF. Check console for details.');
      } finally {
        setIsGenerating(false);
      }
    }, 100);
  }, []);

  // Handle Reset
  const handleReset = () => {
    if(window.confirm("Are you sure you want to clear all data?")) {
      items.forEach(i => {
        if(i.imagePreviewUrl) URL.revokeObjectURL(i.imagePreviewUrl);
      });
      setItems([
        { id: 1, description: '', image: null, imagePreviewUrl: null },
        { id: 2, description: '', image: null, imagePreviewUrl: null },
        { id: 3, description: '', image: null, imagePreviewUrl: null },
      ]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* LEFT PANEL: INPUT FORM */}
      <div className="w-full lg:w-1/3 bg-white border-r border-gray-200 h-auto lg:h-screen lg:overflow-y-auto shadow-xl z-10 flex flex-col">
        <div className="p-6 border-b border-gray-100 bg-white sticky top-0 z-20">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-indigo-600 rounded-lg">
               <FileText className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">Editor</h1>
          </div>
          <p className="text-sm text-gray-500">
            Fill in the 3 sections below. The preview on the right updates automatically.
          </p>
        </div>

        <div className="p-6 space-y-8 flex-1">
          {items.map((item, index) => (
            <div key={item.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider bg-indigo-50 px-2 py-1 rounded">
                  Section {index + 1}
                </span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description / Question
                  </label>
                  <textarea
                    value={item.description}
                    onChange={(e) => handleTextChange(item.id, e.target.value)}
                    placeholder={`Enter details for item #${item.id}...`}
                    className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[80px] transition-all resize-y"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image Evidence
                  </label>
                  <ImageInput
                    id={item.id}
                    previewUrl={item.imagePreviewUrl}
                    onChange={(file) => handleImageChange(item.id, file)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 sticky bottom-0 z-20 space-y-3">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className={`w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-semibold text-white transition-all transform active:scale-95 ${
              isGenerating 
                ? 'bg-indigo-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-indigo-500/30'
            }`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating PDF...
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                Download PDF Report
              </>
            )}
          </button>
          
          <button
            onClick={handleReset}
            className="w-full py-2 px-4 rounded-lg flex items-center justify-center gap-2 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Reset Form
          </button>
        </div>
      </div>

      {/* RIGHT PANEL: PREVIEW */}
      <div className="w-full lg:w-2/3 bg-gray-100 h-auto min-h-screen lg:h-screen lg:overflow-y-auto p-4 lg:p-12 flex flex-col items-center">
        <div className="mb-4 flex items-center justify-between w-full max-w-[794px]">
          <h2 className="text-lg font-semibold text-gray-700">Live Preview (A4)</h2>
          <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded border shadow-sm">
            What you see is what you get
          </span>
        </div>
        
        {/* 
           This container holds the visual representation of the PDF.
           The pdfService targets the ID passed here.
        */}
        <div className="transform scale-50 sm:scale-75 md:scale-90 xl:scale-100 origin-top transition-transform duration-300">
          <PrintPreview items={items} containerId={PREVIEW_ID} />
        </div>
      </div>
    </div>
  );
};

export default App;