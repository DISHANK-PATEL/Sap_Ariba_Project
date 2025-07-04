import React, { useState } from 'react';
import { Loader2, Zap } from 'lucide-react';
import { useFetchEventData } from '../hooks/useFetchEventData';
import { useAppContext } from '../App';
import { toast } from 'sonner';

/**
 * FetchButton Component
 * Renders a large, rounded button that fetches event data from API
 * Shows loading state and handles success/error states
 */
const FetchButton: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [taskId, setTaskId] = useState('');
  const { fetchEventData } = useFetchEventData();
  const { setData } = useAppContext();

  const handleFetchData = async () => {
    if (!taskId.trim()) {
      toast.error('Please enter a Task ID');
      return;
    }

    setIsLoading(true);
    try {
      const result = await fetchEventData(taskId.trim());
      setData(result);
      toast.success('Data fetched successfully!');
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Task ID Input */}
      <div className="flex justify-center">
        <div className="relative group">
          <input
            type="text"
            value={taskId}
            onChange={(e) => setTaskId(e.target.value)}
            placeholder="Enter Task ID..."
            className="px-6 py-4 bg-black/20 backdrop-blur-lg border border-gray-800/50 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-[#BB86FC] focus:ring-2 focus:ring-[#BB86FC]/20 transition-all duration-300 min-w-[300px] text-center"
            disabled={isLoading}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#BB86FC]/10 to-[#4ECDC4]/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        </div>
      </div>

      {/* Fetch Button */}
      <div className="relative group flex justify-center">
        {/* Subtle shadow only, no overextended glow */}
        <button
          onClick={handleFetchData}
          disabled={isLoading || !taskId.trim()}
          className="relative px-12 py-6 bg-gradient-to-r from-[#BB86FC] to-[#9965f4] text-black font-bold text-xl rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed min-w-[250px] flex items-center justify-center gap-3 overflow-hidden group"
        >
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#9965f4] to-[#BB86FC] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>
          
          {/* Content */}
          <div className="relative z-10 flex items-center gap-3">
            {isLoading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="animate-pulse">Fetching...</span>
              </>
            ) : (
              <>
                <Zap className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                <span>Fetch Data</span>
              </>
            )}
          </div>

          {/* Shine effect */}
          <div className="absolute inset-0 -top-1 -left-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 group-hover:animate-shine rounded-3xl"></div>
        </button>
      </div>
    </div>
  );
};

export default FetchButton;
