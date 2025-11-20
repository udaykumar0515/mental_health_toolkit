import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createChatSession } from '../services/geminiService';
import { MessageSquare, User, Send } from 'lucide-react';
import { ChatMessage } from '../types';
import { Chat, GenerateContentResponse } from '@google/genai';

const FloatingChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const startChat = useCallback(() => {
    const session = createChatSession();
    setChatSession(session);
    setMessages([{ sender: 'bot', text: "Hello, I'm CalmBot. How are you feeling today?" }]);
  }, []);

  useEffect(() => {
    if (isOpen && !chatSession) {
      startChat();
    }
  }, [isOpen, chatSession, startChat]);

  const handleSend = async () => {
    if (!input.trim() || isLoading || !chatSession) return;

    const userMessage: ChatMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const stream = await chatSession.sendMessageStream({ message: input });
      let botResponse = '';
      
      setMessages(prev => [...prev, { sender: 'bot', text: '' }]);

      for await (const chunk of stream) {
        const chunkText = (chunk as GenerateContentResponse).text;
        botResponse += chunkText;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].text = botResponse;
          return newMessages;
        });
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setMessages(prev => [...prev, { sender: 'bot', text: "I'm having a little trouble connecting right now. Please try again in a moment." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-full p-4 shadow-lg transition-all duration-300 transform hover:scale-110 z-40"
        aria-label="Open CalmBot chat"
      >
        <MessageSquare size={24} />
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col border border-slate-200 dark:border-gray-700 z-50">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400 rounded-full p-2">
                <MessageSquare size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800 dark:text-white">CalmBot</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">Your companion</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((msg, index) => (
              <div key={index} className={`flex items-start gap-2 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                {msg.sender === 'bot' && <div className="bg-gray-200 dark:bg-gray-700 rounded-full p-1.5 flex-shrink-0"><MessageSquare size={16} /></div>}
                <div className={`max-w-xs p-2.5 rounded-lg text-sm ${msg.sender === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-bl-none'}`}>
                  {msg.text || <span className="animate-pulse">...</span>}
                </div>
                {msg.sender === 'user' && <div className="bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400 rounded-full p-1.5 flex-shrink-0"><User size={16} /></div>}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Message..."
                className="flex-1 p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:bg-gray-400 dark:disabled:bg-gray-600 transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingChatBot;
