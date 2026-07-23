'use client';

import React, { useState } from 'react';

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hello! I'm Abena, your Civitas AI Assistant. 🌿 How can I help you today with property management, solar micro-grids, or maintenance SLAs?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch('https://wbjyktvvmcnbihbcunvg.supabase.co/functions/v1/ai-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, user_id: '00000000-0000-0000-0000-000000000001' })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'bot', text: data.response || "I'm available to answer any questions about Civitas properties and maintenance SLAs!" }]);
    } catch {
      setMessages(prev => [...prev, { role: 'bot', text: "I'm currently connected to offline fallback. Feel free to call our support line at +233 55 506 2589!" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 h-[480px] bg-white/95 backdrop-blur-xl border border-[#D8E4DC] rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300">
          {/* Header */}
          <div className="bg-[#0F3D26] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#E87722]/20 border border-[#E87722]/40 flex items-center justify-center text-lg">
                🌿
              </div>
              <div>
                <div className="font-semibold text-sm">Abena (Civitas AI)</div>
                <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Online
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white text-lg">✕</button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                  m.role === 'bot'
                    ? 'bg-[#EEF7F2] text-[#111A14] self-start rounded-tl-none border border-[#D6EDE1]'
                    : 'bg-[#1A5C3A] text-white self-end rounded-tr-none'
                }`}
              >
                {m.text}
              </div>
            ))}
            {loading && (
              <div className="bg-[#EEF7F2] text-[#6B7E72] self-start p-3 rounded-2xl text-xs animate-pulse">
                Abena is analyzing...
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-[#D8E4DC] bg-white flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask a question..."
              className="flex-1 px-4 py-2 rounded-full border border-[#D8E4DC] text-xs outline-none focus:border-[#1A5C3A]"
            />
            <button
              onClick={sendMessage}
              className="w-9 h-9 rounded-full bg-[#1A5C3A] hover:bg-[#2E7D52] text-white flex items-center justify-center text-xs font-bold"
            >
              ➔
            </button>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-[#1A5C3A] border-2 border-[#D6EDE1] text-white shadow-xl hover:scale-105 transition-transform flex items-center justify-center text-2xl relative"
      >
        💬
        <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-[#E87722] border-2 border-white rounded-full"></span>
      </button>
    </div>
  );
}
