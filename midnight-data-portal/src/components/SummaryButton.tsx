import React, { useState } from 'react';
import { Sparkles, Loader2, X } from 'lucide-react';
import { generateSummary } from '../utils/generateSummary';
import { toast } from 'sonner';
import { useAppContext } from '../App';
import { Rnd } from 'react-rnd';

/**
 * SummaryButton Component
 * Generates AI summary of the data and displays it in a resizable modal window
 */
const SummaryButton: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const { data } = useAppContext();

  const handleGenerateSummary = async () => {
    if (!data) {
      toast.error('No data available. Please fetch data first.');
      return;
    }
    setIsLoading(true);
    try {
      const summaryText = await generateSummary(data);
      setSummary(summaryText);
      setShowModal(true);
      toast.success('Summary generated successfully!');
    } catch (error) {
      console.error('Error generating summary:', error);
      toast.error('Failed to generate summary. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 rounded-3xl blur opacity-30 group-hover:opacity-70 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
        <button
          onClick={handleGenerateSummary}
          disabled={isLoading || !data}
          className="relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-700 text-white font-bold rounded-3xl shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center gap-3 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10 flex items-center gap-3">
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                <span>Generate AI Summary</span>
              </>
            )}
          </div>
        </button>
      </div>

      {/* Resizable Modal for summary */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <Rnd
            default={{
              x: window.innerWidth / 2 - 400,
              y: window.innerHeight / 2 - 300,
              width: 800,
              height: 600,
            }}
            minWidth={400}
            minHeight={300}
            bounds="window"
            className="z-50"
            dragHandleClassName="summary-modal-header"
            enableResizing={{
              top: true,
              right: true,
              bottom: true,
              left: true,
              topRight: true,
              bottomRight: true,
              bottomLeft: true,
              topLeft: true,
            }}
          >
            <div className="relative group w-full h-full flex flex-col bg-black/90 backdrop-blur-lg border border-gray-800/50 rounded-3xl shadow-2xl overflow-hidden animate-scale-in">
              {/* Header */}
              <div className="summary-modal-header cursor-move p-6 border-b border-gray-700/50 flex justify-between items-center bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-t-3xl">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-[#E0E0E0] via-blue-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-blue-500 animate-pulse" />
                  AI Generated Summary
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-800/50 group/close"
                >
                  <X className="w-6 h-6 group-hover/close:rotate-90 transition-transform duration-300" />
                </button>
              </div>
              {/* Content */}
              <div className="flex-1 p-8 overflow-y-auto max-h-full">
                <div className="prose prose-invert max-w-none">
                  <div className="relative">
                    <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500 rounded-full opacity-30"></div>
                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-lg pl-4">
                      {summary}
                    </p>
                  </div>
                </div>
              </div>
              {/* Footer */}
              <div className="p-6 border-t border-gray-700/50 flex justify-end bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-b-3xl">
                <div className="relative group/btn">
                  <div className="absolute -inset-1 bg-gradient-to-r from-gray-700 to-gray-600 rounded-2xl blur opacity-30 group-hover/btn:opacity-70 transition duration-300"></div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="relative px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-600 text-white rounded-2xl transition-all duration-300 transform hover:scale-105 font-semibold"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </Rnd>
        </div>
      )}
    </>
  );
};

export default SummaryButton;
