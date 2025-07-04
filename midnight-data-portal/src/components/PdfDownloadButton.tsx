
import React, { useState } from 'react';
import { FileDown, Loader2 } from 'lucide-react';
import { generatePdf } from '../utils/generatePdf';
import { toast } from 'sonner';

interface PdfDownloadButtonProps {
  data: any;
}

/**
 * PdfDownloadButton Component
 * Generates and downloads PDF report from data using jsPDF
 */
const PdfDownloadButton: React.FC<PdfDownloadButtonProps> = ({ data }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownloadPdf = async () => {
    setIsLoading(true);
    try {
      await generatePdf(data);
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-red-600 via-pink-600 to-red-600 rounded-3xl blur opacity-30 group-hover:opacity-70 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
      
      <button
        onClick={handleDownloadPdf}
        disabled={isLoading}
        className="relative px-8 py-4 bg-gradient-to-r from-red-600 to-pink-700 text-white font-bold rounded-3xl shadow-2xl hover:shadow-red-500/30 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-3 overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-pink-700 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <div className="relative z-10 flex items-center gap-3">
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <FileDown className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              <span>Download PDF</span>
            </>
          )}
        </div>

        {/* Shine effect */}
        <div className="absolute inset-0 -top-1 -left-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 group-hover:animate-shine"></div>
      </button>
    </div>
  );
};

export default PdfDownloadButton;
