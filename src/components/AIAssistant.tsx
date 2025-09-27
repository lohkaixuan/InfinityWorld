// AIAssistant.tsx
import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User } from 'lucide-react';
import { ChatMessage } from '../types';
import { chatSuggestions } from '../data/Data';

interface AIAssistantProps {
  onClose: () => void;
  variant?: 'modal' | 'dock';   // NEW
  className?: string;           // optional external sizing
}

const AIAssistant: React.FC<AIAssistantProps> = ({ onClose, variant = 'modal', className }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: "Hello! I'm your location analysis assistant. I can help you understand the data and insights about your selected location. What would you like to know?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(() => { scrollToBottom(); }, [messages]);

  const fetchBedrockResponse = async (userMessage: string): Promise<string> => {
    try {
      const apiUrl = "https://qze1ayrtf4.execute-api.ap-southeast-1.amazonaws.com/prod/api/bedrock-chat";
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });
      if (!res.ok) throw new Error('Failed to fetch response');
      const data = await res.json();
      return data.response || 'Sorry, I could not get a response from the AI.';
    } catch {
      return 'Error contacting AI service.';
    }
  };

  const handleSendMessage = async (text: string = inputValue) => {
    if (!text.trim()) return;

    // Wrap context into JSON for backend
    const contextPayload = {
      location: sessionStorage.getItem("lastLocation") || "Unknown",
      businessType: sessionStorage.getItem("lastBusinessType") || "Unknown",
      scale: sessionStorage.getItem("lastScale") || "SME",
      score: sessionStorage.getItem("lastScore") || null,
      kpis: JSON.parse(sessionStorage.getItem("lastKpis") || "{}"),
      userPrompt: text.trim(),
    };

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // 🚀 Send JSON instead of plain text
    const aiText = await fetchBedrockResponse(JSON.stringify(contextPayload, null, 2));

    const aiResponse: ChatMessage = {
      id: (Date.now() + 1).toString(),
      text: aiText,
      isUser: false,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, aiResponse]);
    setIsTyping(false);
  };


  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // === Docked layout (no overlay) ===
  if (variant === 'dock') {
    return (
      <div className={`h-full flex flex-col ${className || ''}`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            <div>
              <h2 className="text-sm font-semibold">AI Location Assistant</h2>
              <p className="text-blue-100 text-xs">Ask me about your location analysis</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-black/20 rounded-lg transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-white">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-2 ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.isUser ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {message.isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>
              <div
                className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
                  message.isUser ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p>{message.text}</p>
                <p className={`text-[10px] mt-1 ${message.isUser ? 'text-blue-200' : 'text-gray-500'}`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-2">
              <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="bg-gray-100 px-3 py-2 rounded-2xl">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.1s]" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        {messages.length === 1 && (
          <div className="px-3 py-2 bg-white border-t">
            <p className="text-xs text-gray-600 mb-2">Try asking about:</p>
            <div className="grid grid-cols-1 gap-2">
              {chatSuggestions.slice(0, 3).map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(s)}
                  className="text-left p-2 text-xs bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t border-gray-200 p-3 bg-white">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about this location..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              disabled={isTyping}
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isTyping}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // === Original modal layout ===
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl h-[600px] flex flex-col">
        {/* ... keep your original modal content here ... */}
        {/* (You can keep your existing modal JSX for 'variant === modal') */}
        {/* For brevity, omitted since it's unchanged from your code */}
      </div>
    </div>
  );
};

export default AIAssistant;
