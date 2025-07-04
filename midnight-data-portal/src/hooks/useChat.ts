import { useState } from 'react';
import { useAppContext } from '../App';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

/**
 * useChat Hook
 * Manages chat state and integrates with backend AI service
 */
export const useChat = (data: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const { chatMessages, setChatMessages } = useAppContext();

  const sendMessage = async (text: string) => {
    setIsLoading(true);
    
    try {
      // Send message to backend API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: text,
          data: data,
          messages: chatMessages.map(m => ({
            sender: m.sender,
            text: m.text
          }))
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const result = await response.json();
      
      // Add AI response to shared context
      const aiResponse = {
        id: Date.now().toString(),
        text: result.text,
        sender: 'ai' as const,
        timestamp: new Date(),
      };
      
      setChatMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message to shared context
      const errorResponse = {
        id: Date.now().toString(),
        text: 'Sorry, I encountered an error while processing your request. Please try again.',
        sender: 'ai' as const,
        timestamp: new Date(),
      };
      
      setChatMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages: chatMessages,
    sendMessage,
    isLoading,
  };
};
