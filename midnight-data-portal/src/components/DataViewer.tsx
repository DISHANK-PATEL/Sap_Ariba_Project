
import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Download, Database } from 'lucide-react';
import { toast } from 'sonner';

interface DataViewerProps {
  data: any;
}

/**
 * DataViewer Component
 * Displays fetched JSON data with syntax highlighting
 * Includes download functionality for the JSON data
 */
const DataViewer: React.FC<DataViewerProps> = ({ data }) => {
  const downloadJson = () => {
    if (!data) return;

    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `jindal-data-${new Date().getTime()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('JSON file downloaded successfully!');
  };

  if (!data) {
    return (
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-gray-800 to-gray-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
        <div className="relative bg-black/40 backdrop-blur-lg rounded-3xl p-12 text-center border border-gray-800/50 shadow-2xl transform hover:scale-105 transition-all duration-500">
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              <Database className="w-20 h-20 text-gray-600 animate-pulse" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#FF6B6B] rounded-full animate-ping"></div>
            </div>
            <div>
              <p className="text-gray-400 text-2xl font-semibold mb-2">No data fetched yet.</p>
              <p className="text-gray-500 text-lg">Click "Fetch Data" to load information.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-[#4ECDC4] via-[#BB86FC] to-[#4ECDC4] rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
      
      <div className="relative bg-black/40 backdrop-blur-lg rounded-3xl border border-gray-800/50 overflow-hidden shadow-2xl transform hover:scale-102 transition-all duration-500">
        <div className="p-6 border-b border-gray-800/50 flex justify-between items-center bg-gradient-to-r from-gray-900/50 to-gray-800/50">
          <div className="flex items-center gap-3">
            <Database className="w-6 h-6 text-[#4ECDC4]" />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-[#E0E0E0] to-[#4ECDC4] bg-clip-text text-transparent">
              Data Viewer
            </h2>
          </div>
          
          <div className="relative group/btn">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-30 group-hover/btn:opacity-70 transition duration-300"></div>
            <button
              onClick={downloadJson}
              className="relative flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/30"
            >
              <Download className="w-5 h-5 group-hover/btn:rotate-12 transition-transform duration-300" />
              <span className="font-semibold">Download JSON</span>
            </button>
          </div>
        </div>
        
        <div className="max-h-96 overflow-auto relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none"></div>
          <SyntaxHighlighter
            language="json"
            style={tomorrow}
            customStyle={{
              margin: 0,
              background: 'transparent',
              fontSize: '14px',
              padding: '1.5rem'
            }}
          >
            {JSON.stringify(data, null, 2)}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
};

export default DataViewer;
