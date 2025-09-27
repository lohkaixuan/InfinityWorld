// AIAssistant.tsx
import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User } from 'lucide-react';
import { ChatMessage } from '../types';
import { chatSuggestions } from '../data/Data';

interface AIAssistantProps {
  onClose: () => void;
  variant?: 'modal' | 'dock';
  className?: string;
}
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_KEY as string;

// Choose a lightweight, fast model for UI chat
const OPENAI_MODEL = 'gpt-4o-mini'; // good balance of cost/speed/  quality

const AIAssistant: React.FC<AIAssistantProps> = ({ onClose, variant = 'modal', className }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text:
        "Hello! I'm your location analysis assistant. I can help you understand the data and insights about your selected location. What would you like to know?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // --- OpenAI call (browser fetch) ---
  const fetchOpenAIResponse = async (payload: any): Promise<string> => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000); // 20s

    const systemPrompt =
      "You are an assistant for a location analysis dashboard. Be concise and actionable. " +
      "Use the JSON context (location, businessType, scale, score, kpis) to answer the user's prompt directly.";

    const userJson = JSON.stringify(payload, null, 2);
    const userPrompt = `${systemPrompt}

<INPUT_JSON>
${userJson}
</INPUT_JSON>`;

    try {
      console.log('[OpenAI] → request', { model: OPENAI_MODEL, payload });

      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: OPENAI_MODEL,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.7,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      const raw = await res.text();
      let data: any = null;
      try {
        data = JSON.parse(raw);
      } catch {
        /* ignore non-JSON (shouldn't happen) */
      }

      console.log('[OpenAI] ← status', res.status);
      if (!res.ok) {
        const msg =
          data?.error?.message ||
          raw ||
          `HTTP ${res.status} calling OpenAI.`;
        return `API error: ${msg}`;
      }

      const text =
        data?.choices?.[0]?.message?.content?.trim?.() || 'Empty response.';
      console.log('[OpenAI] parsed text:', text);
      return text;
    } catch (err: any) {
      clearTimeout(timeout);
      console.error('[OpenAI] fetch error:', err);
      if (err?.name === 'AbortError') return 'Request timed out. Please try again.';
      return `Network error: ${err?.message || String(err)}`;
    }
  };

  const handleSendMessage = async (text: string = inputValue) => {
    if (!text.trim()) return;

    const context = {
      location: sessionStorage.getItem('lastLocation') || 'Unknown',
      businessType: sessionStorage.getItem('lastBusinessType') || 'Unknown',
      scale: sessionStorage.getItem('lastScale') || 'SME',
      score: Number(sessionStorage.getItem('lastScore')) || null,
      kpis: (() => {
        try {
          return JSON.parse(sessionStorage.getItem('lastKpis') || '{}');
        } catch {
          return {};
        }
      })(),
    };

    const payload = {
      prompt: text.trim(),
      context,
      meta: { source: 'location-analysis-ui', ts: Date.now() },
    };

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    const aiText = await fetchOpenAIResponse(payload);

    const aiResponse: ChatMessage = {
      id: (Date.now() + 1).toString(),
      text: aiText,
      isUser: false,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, aiResponse]);
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

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
            <div key={message.id} className={`flex gap-2 ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.isUser ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {message.isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>
              <div
                className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm break-words whitespace-pre-wrap ${
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
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0.1s]" />
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0.2s]" />
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

  // (Optional) modal variant can reuse the same inner UI
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl h-[600px] flex flex-col">
        {/* reuse dock UI if needed */}
      </div>
    </div>
  );
};

export default AIAssistant;
