'use client';

import { useState, useRef, useEffect } from 'react';
import { PaperAirplaneIcon, SparklesIcon, CpuChipIcon } from '@heroicons/react/24/outline';

type Message = {
  id: number;
  text: string;
  sender: 'ai' | 'user';
  time: string;
};

const initialMessages: Message[] = [
  { 
    id: 1, 
    text: "Hello! I am MediCare AI, your hospital assistant. How can I help you today? I can help you analyze patient data, find medical records, or generate reports.", 
    sender: 'ai', 
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
  },
];

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: input,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: Date.now() + 1,
        text: getDummyAIResponse(userMessage.text),
        sender: 'ai',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const getDummyAIResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes('patient') || lowerQuery.includes('record')) {
      return "I've checked the database. Patient PT-001 (Sarah Jenkins) had her last visit on Nov 15th for a General Checkup. Her blood pressure was slightly elevated. Would you like me to schedule a follow-up?";
    } else if (lowerQuery.includes('report') || lowerQuery.includes('analytics')) {
      return "Based on this month's analytics, patient admissions are up by 15%, while average wait times have decreased by 5 minutes. The Cardiology department is currently seeing the highest volume.";
    } else if (lowerQuery.includes('appointment') || lowerQuery.includes('schedule')) {
      return "You have 86 appointments scheduled for today. Dr. Smith is fully booked, but Dr. Jane has 2 slots available at 2:00 PM and 4:30 PM.";
    } else {
      return "I understand you're asking about that. As an AI assistant, I can pull up specific medical records, analyze hospital revenue, or manage doctor schedules. Could you please specify what you need?";
    }
  };

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-8rem)] animate-fade-in">
      <div className="flex justify-between items-center bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-5 sm:p-6 rounded-2xl border border-indigo-500/20 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl text-white shadow-lg shadow-indigo-500/30">
            <SparklesIcon className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">MediCare AI</h1>
            <p className="text-sm text-text-muted mt-1 font-medium">Your intelligent medical and administrative assistant</p>
          </div>
        </div>
      </div>

      <div className="glass-panel flex-1 flex flex-col overflow-hidden relative border-indigo-500/20 shadow-lg">
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 scroll-smooth">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-start gap-4 max-w-[85%] ${msg.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-md ${
                msg.sender === 'ai' ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white' : 'bg-gradient-to-br from-bg-secondary to-bg-primary text-text-primary border border-border'
              }`}>
                {msg.sender === 'ai' ? <CpuChipIcon className="w-6 h-6" /> : <span className="font-bold">U</span>}
              </div>
              
              <div className="flex flex-col gap-1.5">
                <div className={`p-4 text-sm leading-relaxed shadow-sm ${
                  msg.sender === 'user' 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl rounded-tr-sm' 
                    : 'bg-bg-primary/80 backdrop-blur-sm text-text-primary border border-border rounded-2xl rounded-tl-sm'
                }`}>
                  {msg.text}
                </div>
                <span className={`text-[10px] font-medium text-text-muted ${msg.sender === 'user' ? 'text-right mr-1' : 'ml-1'}`}>
                  {msg.time}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-start gap-4 max-w-[80%] self-start animate-fade-in">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-md">
                <CpuChipIcon className="w-6 h-6" />
              </div>
              <div className="p-4 bg-bg-primary/80 backdrop-blur-sm border border-border rounded-2xl rounded-tl-sm flex items-center gap-1.5 h-[52px]">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-border bg-bg-card/80 backdrop-blur-xl">
          {/* Predefined Prompts */}
          {messages.length === 1 && !isTyping && (
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
              {[
                "Summarize today's appointments",
                "Show patient record PT-001",
                "What's the current bed occupancy?",
                "Analyze monthly revenue"
              ].map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => setInput(prompt)}
                  className="whitespace-nowrap px-4 py-2 bg-indigo-500/10 text-indigo-600 text-xs font-semibold rounded-full border border-indigo-500/20 hover:bg-indigo-500 hover:text-white transition-all transform hover:-translate-y-0.5 cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}
          <form onSubmit={handleSend}>
            <div className="flex items-center gap-3 px-5 py-3.5 bg-bg-primary border border-border rounded-xl focus-within:border-indigo-500/50 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all shadow-sm">
              <input 
                type="text" 
                placeholder="Ask MediCare AI to analyze reports, find patients, or summarize data..." 
                className="flex-1 bg-transparent border-none text-text-primary outline-none text-sm placeholder:text-text-muted/70 font-medium"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button 
                type="submit" 
                disabled={!input.trim() || isTyping}
                className="p-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transform hover:scale-105 shadow-md shadow-indigo-500/20"
              >
                <PaperAirplaneIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="text-center mt-3">
              <p className="text-[11px] font-medium text-text-muted">MediCare AI can make mistakes. Consider verifying important clinical information.</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
