import React, { useState, useRef, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import { X, Send, MessageCircle, Bot, User } from 'lucide-react';
import { useChat } from '../hooks/useChat';
import { useAppContext, ChatMessage } from '../App';

interface ChatbotWindowProps {
  data: any;
}

/**
 * ChatbotWindow Component
 * Draggable and resizable chat interface for AI interaction
 * Uses react-rnd for window management
 */
const ChatbotWindow: React.FC<ChatbotWindowProps> = ({ data }) => {
  const [input, setInput] = useState('');
  const { setChatVisible, chatMessages, setChatMessages } = useAppContext();
  const { sendMessage, isLoading } = useChat(data);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    // Add user message to context
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };
    setChatMessages(prev => [...prev, userMessage]);
    await sendMessage(input);
    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Rnd
      default={{
        x: window.innerWidth / 2 - 250,
        y: window.innerHeight / 2 - 300,
        width: 500,
        height: 600,
      }}
      minWidth={350}
      minHeight={400}
      bounds="window"
      dragHandleClassName="chat-header"
      className="z-50"
    >
      <div className="w-full h-full relative group">
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-[#BB86FC] via-[#4ECDC4] to-[#BB86FC] rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
        
        <div className="relative w-full h-full bg-black/90 backdrop-blur-lg border border-gray-800/50 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="chat-header bg-gradient-to-r from-gray-900/80 to-gray-800/80 px-6 py-4 flex justify-between items-center cursor-move border-b border-gray-700/50">
            <div className="flex items-center gap-3">
              <div className="relative">
                <MessageCircle className="w-6 h-6 text-[#BB86FC]" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <h3 className="font-bold text-xl bg-gradient-to-r from-[#E0E0E0] to-[#BB86FC] bg-clip-text text-transparent">
                AI Chat
              </h3>
            </div>
            <button
              onClick={() => setChatVisible(false)}
              className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-800/50 group/close"
            >
              <X className="w-5 h-5 group-hover/close:rotate-90 transition-transform duration-300" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-transparent to-black/20">
            {chatMessages.length === 0 ? (
              <div className="text-center text-gray-500 mt-12">
                <div className="relative mb-6">
                  <Bot className="w-16 h-16 mx-auto opacity-50 animate-pulse" />
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-[#BB86FC] rounded-full animate-bounce"></div>
                </div>
                <p className="text-lg font-semibold mb-2">Ready to assist!</p>
                <p>Start a conversation about your data</p>
              </div>
            ) : (
              chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                >
                  <div className={`group flex items-start gap-3 max-w-[85%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                    {/* Avatar */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                      message.sender === 'user' 
                        ? 'bg-gradient-to-r from-[#BB86FC] to-[#9965f4]' 
                        : 'bg-gradient-to-r from-gray-700 to-gray-600'
                    }`}>
                      {message.sender === 'user' ? (
                        <User className="w-5 h-5 text-black" />
                      ) : (
                        <Bot className="w-5 h-5 text-white" />
                      )}
                    </div>
                    
                    {/* Message bubble */}
                    <div className={`relative p-4 rounded-2xl shadow-lg transform group-hover:scale-105 transition-all duration-300 ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-[#BB86FC] to-[#9965f4] text-black'
                        : 'bg-gradient-to-r from-gray-800/80 to-gray-700/80 text-white backdrop-blur-sm border border-gray-600/30'
                    }`}>
                      <p className="text-sm leading-relaxed">{message.text}</p>
                      <span className="text-xs opacity-70 mt-2 block">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
            
            {isLoading && (
              <div className="flex justify-start animate-fade-in">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-700 to-gray-600 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 text-white p-4 rounded-2xl backdrop-blur-sm border border-gray-600/30">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-[#BB86FC] rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-[#4ECDC4] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-[#BB86FC] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-sm">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-6 border-t border-gray-700/50 bg-gradient-to-r from-gray-900/50 to-gray-800/50">
            <div className="flex gap-3">
              <div className="flex-1 relative group/input">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about your data..."
                  className="w-full bg-gray-800/80 backdrop-blur-sm text-white border border-gray-600/50 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-[#BB86FC] focus:ring-2 focus:ring-[#BB86FC]/30 transition-all duration-300 group-hover/input:border-gray-500"
                  disabled={isLoading}
                />
              </div>
              
              <div className="relative group/send">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#BB86FC] to-[#9965f4] rounded-2xl blur opacity-30 group-hover/send:opacity-70 transition duration-300"></div>
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="relative px-4 py-3 bg-gradient-to-r from-[#BB86FC] to-[#9965f4] text-black rounded-2xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                >
                  <Send className="w-5 h-5 group-hover/send:rotate-12 transition-transform duration-300" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Rnd>
  );
};

export default ChatbotWindow;
