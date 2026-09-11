import React, { useState, useRef, useEffect } from 'react';
import { useLifeOS } from '../context/LifeOSContext';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  Lightbulb,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export const AiCoachModal: React.FC = () => {
  const {
    isAiCoachOpen,
    setIsAiCoachOpen,
    chatMessages = [],
    sendChatMessage,
    isGeneratingAi,
  } = useLifeOS();

  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const promptChips = [
    'How am I doing this week?',
    'Where am I spending too much?',
    'Why did my Life Score fall?',
    "What should I focus on today?",
    'How does my sleep affect my habits?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isAiCoachOpen) {
      scrollToBottom();
    }
  }, [isAiCoachOpen, chatMessages]);

  if (!isAiCoachOpen) return null;

  const handleSend = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isGeneratingAi) return;
    setInputMessage('');
    if (sendChatMessage) {
      await sendChatMessage(trimmed);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#000000]/80 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-xl h-[620px] max-h-[90vh] bg-[#FFFFFF] dark:bg-[#121212] rounded-3xl border border-[#E5E5E5] dark:border-[#222222] shadow-2xl overflow-hidden flex flex-col transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E5E5] dark:border-[#222222] bg-[#FFFFFF] dark:bg-[#121212]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#111111] dark:bg-[#C5FF00] text-[#C5FF00] dark:text-[#111111] flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-black uppercase tracking-tight text-[#111111] dark:text-[#FFFFFF]">
                  LIFEOS Intelligence Coach
                </h2>
                <span className="w-2 h-2 rounded-full bg-[#C5FF00] border border-[#111111] animate-pulse" />
              </div>
              <p className="text-[11px] text-[#7E7E7E] dark:text-[#A1A1AA]">
                Cross-domain advisor powered by Gemini AI
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAiCoachOpen(false)}
            className="p-1.5 rounded-full text-[#7E7E7E] hover:text-[#111111] dark:hover:text-[#FFFFFF] hover:bg-[#F5F5F5] dark:hover:bg-[#202020] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Prompt Chips Bar */}
        <div className="px-4 py-2.5 border-b border-[#E5E5E5] dark:border-[#222222] overflow-x-auto flex gap-2 bg-[#F5F5F5] dark:bg-[#181818] no-scrollbar">
          {promptChips.map((chip, idx) => (
            <button
              key={idx}
              disabled={isGeneratingAi}
              onClick={() => handleSend(chip)}
              className="text-[11px] font-bold uppercase tracking-wider whitespace-nowrap px-3.5 py-1.5 rounded-full bg-[#FFFFFF] dark:bg-[#222222] hover:bg-[#111111] hover:text-[#C5FF00] dark:hover:bg-[#C5FF00] dark:hover:text-[#111111] border border-[#E5E5E5] dark:border-[#2E2E2E] text-[#111111] dark:text-[#FFFFFF] transition-all cursor-pointer"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-[#FFFFFF] dark:bg-[#0E0E0E]">
          {(chatMessages || []).map((msg) => {
            const isUser = msg.role === 'user' || (msg as any).sender === 'user';
            const messageText = msg.content || (msg as any).text || '';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-full bg-[#111111] text-[#C5FF00] flex-shrink-0 flex items-center justify-center mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-[#111111] text-[#FFFFFF] dark:bg-[#C5FF00] dark:text-[#111111] font-semibold rounded-tr-xs shadow-md'
                      : 'bg-[#F5F5F5] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#282828] text-[#111111] dark:text-[#EAEAEA] rounded-tl-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{messageText}</p>
                  <span
                    className={`block text-[10px] mt-1.5 opacity-60 ${
                      isUser ? 'text-right' : 'text-left text-[#7E7E7E] dark:text-[#999999]'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {isUser && (
                  <div className="w-7 h-7 rounded-full bg-[#F5F5F5] dark:bg-[#222222] text-[#111111] dark:text-[#FFFFFF] flex-shrink-0 flex items-center justify-center mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isGeneratingAi && (
            <div className="flex gap-3 items-center">
              <div className="w-7 h-7 rounded-full bg-[#111111] text-[#C5FF00] flex-shrink-0 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-[#F5F5F5] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#282828] rounded-2xl px-4 py-2.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#111111] dark:bg-[#C5FF00] animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#111111] dark:bg-[#C5FF00] animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#111111] dark:bg-[#C5FF00] animate-bounce [animation-delay:0.4s]" />
                <span className="text-xs font-bold text-[#7E7E7E] dark:text-[#A1A1AA] ml-1">Analyzing cross-domain metrics...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(inputMessage);
          }}
          className="p-4 border-t border-[#E5E5E5] dark:border-[#222222] bg-[#FFFFFF] dark:bg-[#121212] flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask anything about your health, water limits, habits or goals..."
            value={inputMessage}
            disabled={isGeneratingAi}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-full bg-[#F5F5F5] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#2A2A2A] text-xs sm:text-sm font-semibold text-[#111111] dark:text-[#FFFFFF] placeholder-[#7E7E7E] focus:outline-none focus:border-[#111111] dark:focus:border-[#C5FF00]"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isGeneratingAi}
            className="p-2.5 rounded-full btn-nike-black disabled:opacity-40 shadow-xs transition-all flex items-center justify-center cursor-pointer"
          >
            <Send className="w-4 h-4 text-[#C5FF00]" />
          </button>
        </form>
      </div>
    </div>
  );
};
