import React, { useState, useContext, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { LanguageContext } from '../App';
import { getPedagogyAdvice } from '../services/geminiService';
import { ChatMessage } from '../types';

export default function KnowledgeModule() {
  const { t, lang } = useContext(LanguageContext);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const responseText = await getPedagogyAdvice(userMsg.text, lang);

    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, botMsg]);
    setLoading(false);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 bg-indigo-50 border-b border-indigo-100 flex items-center gap-3">
        <div className="p-2 bg-indigo-600 rounded-lg text-white">
          <Sparkles size={20} />
        </div>
        <div>
          <h3 className="font-bold text-indigo-900">{t('aiAssistant')}</h3>
          <p className="text-xs text-indigo-600">Powered by Google Gemini</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50" ref={scrollRef}>
        {messages.length === 0 && (
           <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 p-8">
             <Bot size={48} className="mb-4 text-gray-300" />
             <p>{t('aiPrompt')}</p>
           </div>
        )}
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
             <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${
               msg.role === 'user' 
               ? 'bg-green-700 text-white rounded-tr-none' 
               : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
             }`}>
               <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>
             </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-100 flex gap-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex gap-2">
          <input 
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder={t('aiPrompt')}
            className="flex-1 p-3 rounded-xl bg-gray-100 border-transparent focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
          />
          <button 
            onClick={handleSend}
            disabled={loading}
            className="p-3 bg-green-700 text-white rounded-xl hover:bg-green-800 disabled:opacity-50 transition-colors"
          >
            <Send size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}