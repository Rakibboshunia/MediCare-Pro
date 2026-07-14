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
    <div className="flex flex-col gap-6 h-[calc(100vh-8rem)]">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl text-white shadow-lg shadow-indigo-500/30">
            <SparklesIcon className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-text-primary">MediCare AI</h1>
            <p className="text-sm text-text-muted mt-1">Your intelligent medical and administrative assistant</p>
          </div>
        </div>
      </div>

      <div className="glass-panel flex-1 flex flex-col overflow-hidden relative border-accent-light">
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-start gap-4 max-w-[80%] ${msg.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-md ${
                msg.sender === 'ai' ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white' : 'bg-bg-secondary text-text-primary border border-border'
              }`}>
                {msg.sender === 'ai' ? <CpuChipIcon className="w-6 h-6" /> : <span className="font-bold">U</span>}
              </div>
              
              <div className="flex flex-col gap-1">
                <div className={`p-4 text-sm leading-relaxed ${
                  msg.sender === 'user' 
                    ? 'bg-accent-primary text-white rounded-2xl rounded-tr-sm shadow-md shadow-accent-primary/20' 
                    : 'bg-bg-primary text-text-primary border border-border rounded-2xl rounded-tl-sm'
                }`}>
                  {msg.text}
                </div>
                <span className={`text-[10px] text-text-muted ${msg.sender === 'user' ? 'text-right mr-2' : 'ml-2'}`}>
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
              <div className="p-4 bg-bg-primary border border-border rounded-2xl rounded-tl-sm flex items-center gap-1.5 h-[52px]">
                <div className="w-2 h-2 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSend} className="p-4 border-t border-border bg-bg-card/50 backdrop-blur-md">
          <div className="flex items-center gap-3 px-4 py-3 bg-bg-primary border border-border rounded-xl focus-within:border-accent-light focus-within:shadow-glow transition-all">
            <input 
              type="text" 
              placeholder="Ask MediCare AI to analyze reports, find patients, or summarize data..." 
              className="flex-1 bg-transparent border-none text-text-primary outline-none text-sm placeholder:text-text-muted"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button 
              type="submit" 
              disabled={!input.trim() || isTyping}
              className="p-2 bg-accent-primary text-white rounded-lg hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <PaperAirplaneIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="text-center mt-3">
            <p className="text-[11px] text-text-muted">MediCare AI can make mistakes. Consider verifying important clinical information.</p>
          </div>
        </form>
      </div>
    </div>
  );
}
