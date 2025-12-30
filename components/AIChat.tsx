
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Sparkles } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    {role: 'ai', text: 'Olá! Sou o Albert. Como posso ajudar na sua formação hoje?'}
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    // Obter chave de forma segura
    const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : '';
    if (!apiKey) {
      setMessages(prev => [...prev, {role: 'ai', text: 'Desculpe, o assistente de IA não está configurado neste ambiente.'}]);
      return;
    }

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, {role: 'user', text: userMsg}]);
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userMsg,
        config: {
          systemInstruction: "Você é o Albert, assistente da Academia Albert em Moçambique. Ajude alunos com cursos e dúvidas. Seja amigável e profissional."
        }
      });
      setMessages(prev => [...prev, {role: 'ai', text: response.text || 'Desculpe, tente novamente.'}]);
    } catch (e) {
      setMessages(prev => [...prev, {role: 'ai', text: 'Erro ao processar sua pergunta. Tente novamente mais tarde.'}]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] ai-chat-button">
      {isOpen ? (
        <div className="w-[350px] h-[500px] bg-white dark:bg-slate-800 rounded-[2rem] shadow-2xl flex flex-col border border-slate-100 dark:border-slate-700 animate-in slide-in-from-bottom-4">
          <div className="bg-indigo-600 p-6 flex justify-between items-center text-white rounded-t-[2rem]">
            <div className="flex items-center gap-3">
              <Sparkles size={20} />
              <span className="font-bold">Albert AI</span>
            </div>
            <button onClick={() => setIsOpen(false)}><X size={20} /></button>
          </div>
          <div ref={scrollRef} className="flex-grow p-6 overflow-y-auto space-y-4 bg-slate-50 dark:bg-slate-900/50 no-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 text-slate-900 dark:text-white'}`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-slate-100 dark:border-slate-700 flex gap-2 bg-white dark:bg-slate-800 rounded-b-[2rem]">
            <input 
              className="flex-grow p-3 bg-slate-50 dark:bg-slate-900 rounded-xl outline-none text-slate-900 dark:text-white text-sm" 
              placeholder="Escreva aqui..."
              value={input} 
              onChange={e => setInput(e.target.value)} 
              onKeyDown={e => e.key === 'Enter' && handleSend()} 
            />
            <button onClick={handleSend} className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all">
              <Send size={18} />
            </button>
          </div>
        </div>
      ) : (
        <button onClick={() => setIsOpen(true)} className="w-16 h-16 bg-indigo-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-all active:scale-95">
          <MessageCircle size={30} />
        </button>
      )}
    </div>
  );
};

export default AIChat;
