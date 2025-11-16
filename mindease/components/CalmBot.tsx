import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createChatSession } from '../services/geminiService';
import BotIcon from './icons/BotIcon';
import UserIcon from './icons/UserIcon';
import { ChatMessage, Page } from '../types';
import { Chat, GenerateContentResponse } from '@google/genai';
import ArrowLeftIcon from './icons/ArrowLeftIcon';

interface CalmBotProps {
    onNavigate: (page: Page) => void;
}

const CalmBot: React.FC<CalmBotProps> = ({ onNavigate }) => {
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
    startChat();
  }, [startChat]);


  const handleSend = async () => {
    if (!input.trim() || isLoading || !chatSession) return;

    const userMessage: ChatMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
        const stream = await chatSession.sendMessageStream({ message: input });
        let botResponse = '';
        
        // Add a placeholder for the bot's message to update it as chunks stream in
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
    <div className="max-w-2xl mx-auto">
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-lg flex flex-col h-[70vh] border border-slate-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400 rounded-full p-2">
                        <BotIcon />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">CalmBot</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Your supportive companion</p>
                    </div>
                </div>
                <button onClick={() => onNavigate('dashboard')} className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition-colors">
                    <ArrowLeftIcon />
                    Dashboard
                </button>
            </div>
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                        {msg.sender === 'bot' && <div className="bg-gray-200 dark:bg-gray-700 rounded-full p-2"><BotIcon/></div>}
                        <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-bl-none'}`}>
                            {msg.text || <span className="animate-pulse">...</span>}
                        </div>
                         {msg.sender === 'user' && <div className="bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400 rounded-full p-2"><UserIcon/></div>}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type your message..."
                        className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                        disabled={isLoading}
                    />
                    <button onClick={handleSend} disabled={isLoading || !input.trim()} className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:bg-gray-400 dark:disabled:bg-gray-600 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default CalmBot;