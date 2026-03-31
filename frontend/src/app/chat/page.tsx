"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { Send, UserCircle, BrainCircuit, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Message = { id: string, role: string, content: string };

export default function Chat() {
  const { userId } = useUserStore();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatSessionId, setChatSessionId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!userId) {
      router.push('/onboarding');
      return;
    }
  }, [userId, router]);

  useEffect(() => {
    // Scroll to bottom
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch('http://localhost:8002/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, message: userMsg, chatSessionId })
      });
      const data = await res.json();
      
      if (data.chatSessionId) setChatSessionId(data.chatSessionId);
      
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'ai', content: data.reply }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'ai', content: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col max-w-4xl w-full mx-auto p-4 md:p-6 h-[calc(100vh-80px)]">
      
      <div className="bg-[#1a1a24] border border-white/10 p-4 rounded-t-2xl flex items-center justify-between shadow-xl z-10 relative">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400">
                <BrainCircuit className="w-5 h-5"/>
            </div>
            <div>
                <h2 className="font-bold text-white">NODENEXUS AI Counselor</h2>
                <div className="flex items-center gap-2 text-xs text-brand-400">
                    <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" /> Online
                </div>
            </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-[#1a1a24]/50 border-x border-white/5 p-6 space-y-6" ref={scrollRef}>
        
        {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center px-4">
                <BrainCircuit className="w-16 h-16 text-white/10 mb-6" />
                <p className="text-xl text-white font-medium mb-2">How can I help you today?</p>
                <p className="text-gray-400 text-sm max-w-md">I have access to your academic profile and skill gap data. Ask me anything about career paths, resume tips, or what to learn next.</p>
            </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={msg.id} 
                className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-white/10' : 'bg-brand-500'}`}>
                {msg.role === 'user' ? <UserCircle className="text-gray-300 w-5 h-5" /> : <BrainCircuit className="text-white w-5 h-5" />}
              </div>
              <div className={`max-w-[80%] rounded-2xl p-4 text-sm md:text-base leading-relaxed ${
                msg.role === 'user' ? 'bg-white/10 text-white rounded-tr-none' : 'bg-[#252533] border border-white/5 text-gray-200 rounded-tl-none'
              }`}>
                {/* Simple formatting for AI Markdown response */}
                {msg.content.split('\n').map((line, i) => (
                    <p key={i} className="mb-2 last:mb-0">{line.replace(/\*\*/g, '')}</p>
                ))}
              </div>
            </motion.div>
          ))}
          {loading && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
               <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-brand-500">
                  <BrainCircuit className="text-white w-5 h-5" />
               </div>
               <div className="bg-[#252533] border border-white/5 rounded-2xl rounded-tl-none p-4 flex items-center">
                  <Loader2 className="w-5 h-5 text-brand-400 animate-spin" />
               </div>
             </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="bg-[#1a1a24] border border-white/10 p-4 rounded-b-2xl shadow-xl z-10 relative">
        <form onSubmit={handleSend} className="relative flex items-center">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={loading}
            placeholder="Type your question..."
            className="w-full bg-[#12121c] border border-white/10 rounded-xl pl-4 pr-14 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 transition-colors"
          />
          <button 
            type="submit" 
            disabled={loading || !input.trim()}
            className="absolute right-2 p-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
