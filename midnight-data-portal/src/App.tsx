import React, { useState, createContext, useContext } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import FetchButton from './components/FetchButton';
import DataViewer from './components/DataViewer';
import ChatbotWindow from './components/ChatbotWindow';
import PdfDownloadButton from './components/PdfDownloadButton';

const queryClient = new QueryClient();

// Add Message type for chat
export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

// Context for app state management
interface AppContextType {
  data: any;
  setData: (data: any) => void;
  chatVisible: boolean;
  setChatVisible: (visible: boolean) => void;
  summaryText: string;
  setSummaryText: (text: string) => void;
  chatMessages: ChatMessage[];
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  addAIMessage: (text: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<any>(null);
  const [chatVisible, setChatVisible] = useState(false);
  const [summaryText, setSummaryText] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // Method to add an AI message to the chat
  const addAIMessage = (text: string) => {
    setChatVisible(true);
    setChatMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        text,
        sender: 'ai',
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <AppContext.Provider value={{
      data,
      setData,
      chatVisible,
      setChatVisible,
      summaryText,
      setSummaryText,
      chatMessages,
      setChatMessages,
      addAIMessage,
    }}>
      {children}
    </AppContext.Provider>
  );
};

const AppContent = () => {
  const { data, chatVisible, setChatVisible } = useAppContext();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#000000] via-[#0a0a0a] to-[#1a1a1a] text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#BB86FC] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#FF6B6B] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-[#4ECDC4] rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Header */}
      <header className="w-full py-8 relative z-10">
        <div className="container mx-auto px-4">
          <div className="bg-black/20 backdrop-blur-lg border border-gray-800/50 rounded-3xl p-6 shadow-2xl transform hover:scale-105 transition-all duration-300">
            <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-[#E0E0E0] via-[#BB86FC] to-[#E0E0E0] bg-clip-text text-transparent animate-pulse">
              Dashboard
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-[#BB86FC] to-[#4ECDC4] mx-auto mt-4 rounded-full"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-12 relative z-10">
        {/* Fetch Button */}
        <div className="flex justify-center">
          <FetchButton />
        </div>

        {/* Data Viewer */}
        <div className="transform hover:scale-102 transition-all duration-500">
          <DataViewer data={data} />
        </div>

        {/* Action Buttons */}
        {data && (
          <div className="flex flex-wrap justify-center gap-6">
            <div className="transform hover:scale-110 hover:rotate-2 transition-all duration-300">
              <PdfDownloadButton data={data} />
            </div>
            <div className="transform hover:scale-110 hover:-rotate-1 transition-all duration-300">
              <button
                onClick={() => setChatVisible(true)}
                className="group relative px-8 py-4 bg-gradient-to-r from-[#BB86FC] to-[#9965f4] text-black font-bold rounded-3xl shadow-2xl hover:shadow-[#BB86FC]/30 transition-all duration-300 transform hover:scale-105 overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-[#9965f4] to-[#BB86FC] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative z-10 flex items-center gap-2">
                  💬 Chat with Data
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Chatbot Window */}
        {chatVisible && <ChatbotWindow data={data} />}
      </main>

      {/* Floating elements */}
      <div className="fixed bottom-8 right-8 pointer-events-none">
        <div className="w-4 h-4 bg-[#BB86FC] rounded-full animate-bounce opacity-60"></div>
      </div>
      <div className="fixed top-20 left-8 pointer-events-none">
        <div className="w-3 h-3 bg-[#4ECDC4] rounded-full animate-pulse opacity-40"></div>
      </div>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppProvider>
        <AppContent />
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
