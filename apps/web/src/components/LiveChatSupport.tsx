'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'support';
  timestamp: Date;
}

export default function LiveChatSupport() {
  const [isOpen, setIsOpen] = useState(false);

  // Listen for the custom event to open the chat
  useEffect(() => {
    const handleOpenChat = () => {
      setIsOpen(true);
    };

    window.addEventListener('openLiveChat', handleOpenChat);

    return () => {
      window.removeEventListener('openLiveChat', handleOpenChat);
    };
  }, []);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! How can I help you today?',
      sender: 'support',
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    // Simulate typing indicator
    setIsTyping(true);

    // Simulate response after delay
    setTimeout(() => {
      const responses = [
        "I understand your concern. Let me check that for you.",
        "Thanks for reaching out! I'll assist you with that.",
        "I can help you with that. Here's what you need to do...",
        "Great question! Let me provide you with more information.",
        "I've noted your request. Is there anything else I can help with?"
      ];
      
      const supportMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: 'support',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, supportMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="w-80 h-[500px] bg-white rounded-xl shadow-xl flex flex-col border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-[#EB6426] text-white p-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5" />
              <h3 className="font-semibold">Live Support</h3>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      message.sender === 'user'
                        ? 'bg-[#EB6426] text-white rounded-br-none'
                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.sender === 'support' && (
                        <Bot className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      )}
                      <p className="text-sm">{message.text}</p>
                      {message.sender === 'user' && (
                        <User className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      )}
                    </div>
                    <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-4 py-2">
                    <div className="flex items-center space-x-1">
                      <Bot className="w-4 h-4 text-gray-500" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-3 bg-white">
            <div className="flex items-center space-x-2">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-[#EB6426]"
                rows={2}
              />
              <button
                onClick={handleSendMessage}
                disabled={inputText.trim() === ''}
                className={`p-2 rounded-full ${
                  inputText.trim() === '' 
                    ? 'bg-gray-200 text-gray-400' 
                    : 'bg-[#EB6426] text-white hover:bg-[#d0521e]'
                } transition-colors`}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#EB6426] hidden sm:inline text-white p-4 rounded-full shadow-lg hover:bg-[#d0521e] transition-all transform hover:scale-105 flex items-center justify-center"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="ml-2 hidden sm:inline">Support</span>
        </button>
      )}
    </div>
  );
}