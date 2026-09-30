import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  FileText,
  ExternalLink,
  Volume2,
  Copy,
  Check,
  RotateCcw,
  CornerDownLeft,
  ChevronRight,
} from 'lucide-react';
import { CopilotMessage } from '../../types';
import { AIComplianceService } from '../../services/aiService';
import { useProcurement } from '../../context/ProcurementContext';
import { cn } from '../../utils';

export const AIAssistantChat: React.FC = () => {
  const { selectedTender, selectedVendor } = useProcurement();
  const [inputQuery, setInputQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null);
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'INIT-1',
      sender: 'assistant',
      timestamp: 'Just now',
      text: `Welcome to **Compliance Copilot**. I am indexed on GeM Tender **${selectedTender.gemBidNumber}** (${selectedTender.department}) and all uploaded vendor bid packages. Ask me any compliance question, clause verification inquiry, or financial anomaly check.`,
      suggestedActions: [
        'Why was TECH-04 flagged?',
        'Show missing documents.',
        'Compare technical specifications.',
        'Explain financial anomalies.',
        'Which tender clauses require manual review?',
        'Show high-risk compliance issues.',
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (textToSend?: string) => {
    const q = textToSend || inputQuery;
    if (!q.trim()) return;

    const userMsg: CopilotMessage = {
      id: `USR-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: q,
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');

    // Generate AI response
    setTimeout(() => {
      const aiReply = AIComplianceService.generateCopilotResponse(q, selectedVendor.complianceChecks || []);
      setMessages(prev => [...prev, aiReply]);
    }, 450);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleSpeak = (id: string, text: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking === id) {
        window.speechSynthesis.cancel();
        setIsSpeaking(null);
      } else {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text.replace(/[*#_•]/g, ''));
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.onend = () => setIsSpeaking(null);
        window.speechSynthesis.speak(utterance);
        setIsSpeaking(id);
      }
    }
  };

  const promptChips = [
    'Why was TECH-04 flagged?',
    'Show missing documents.',
    'Compare technical specifications.',
    'Explain financial anomalies.',
    'Which tender clauses require manual review?',
    'Show high-risk compliance issues.',
  ];

  return (
    <div className="enterprise-card h-[calc(100vh-170px)] min-h-[580px] flex flex-col overflow-hidden">
      {/* Copilot Header */}
      <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-950/40">
            <Bot className="w-6 h-6 animate-pulse text-blue-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-tight">Compliance Copilot</h3>
              <span className="px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-200 text-[10px] font-mono font-bold">
                Neural Procurement Assistant
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Active Context: {selectedTender.gemBidNumber} • {selectedTender.department}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setMessages([
              {
                id: 'INIT-RESET',
                sender: 'assistant',
                timestamp: 'Just now',
                text: `Session reset. How can I assist your evaluation of tender ${selectedTender.gemBidNumber}?`,
                suggestedActions: promptChips,
              },
            ]);
          }}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Reset Conversation"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Suggested Chips Bar */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex items-center gap-2 overflow-x-auto scrollbar-none">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex-shrink-0">
          Suggested Queries:
        </span>
        {promptChips.map(chip => (
          <button
            key={chip}
            onClick={() => handleSend(chip)}
            className="px-2.5 py-1 rounded-full bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-900 text-xs font-medium whitespace-nowrap transition-colors shadow-2xs"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Message Chat Viewport */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/40">
        {messages.map(msg => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={cn(
                'flex gap-3 max-w-3xl',
                isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
              )}
            >
              {/* Avatar */}
              <div
                className={cn(
                  'w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold shadow-2xs',
                  isUser
                    ? 'bg-blue-900 text-white'
                    : 'bg-gradient-to-br from-blue-700 to-indigo-800 text-white'
                )}
              >
                {isUser ? 'YOU' : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={cn(
                  'rounded-2xl p-4 text-xs leading-relaxed transition-all shadow-card',
                  isUser
                    ? 'bg-blue-900 text-white rounded-tr-none'
                    : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-none space-y-3'
                )}
              >
                {/* Text Body */}
                <div className="whitespace-pre-wrap font-sans">
                  {msg.text}
                </div>

                {/* Citations Box */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Grounding Evidence & Citations:
                    </span>
                    {msg.citations.map((cite, cIdx) => (
                      <div
                        key={cIdx}
                        className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-700"
                      >
                        <div className="flex items-center justify-between font-bold text-blue-900 mb-1">
                          <span className="flex items-center gap-1">
                            <FileText className="w-3.5 h-3.5 text-blue-700" />
                            {cite.document} (Page {cite.page})
                          </span>
                          <span className="font-mono text-[10px] bg-blue-100 px-1.5 py-0.2 rounded">
                            {cite.clause}
                          </span>
                        </div>
                        <p className="font-mono text-slate-600 bg-white p-1.5 rounded border border-slate-100 text-[10px]">
                          "{cite.snippet}"
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Follow-up Quick Action Chips */}
                {msg.suggestedActions && (
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {msg.suggestedActions.map((action, aIdx) => (
                      <button
                        key={aIdx}
                        onClick={() => handleSend(action)}
                        className="inline-flex items-center gap-1 text-[11px] font-medium bg-blue-50 text-blue-800 hover:bg-blue-100 px-2.5 py-1 rounded-md transition-colors"
                      >
                        <span>{action}</span>
                        <ChevronRight className="w-3 h-3 opacity-60" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Bottom Message Actions */}
                {!isUser && (
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-slate-400 text-[10px]">
                    <span className="font-mono">{msg.timestamp}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSpeak(msg.id, msg.text)}
                        className={cn(
                          'p-1 rounded hover:bg-slate-100 transition-colors',
                          isSpeaking === msg.id ? 'text-blue-600 font-bold' : 'text-slate-400'
                        )}
                        title="Read aloud"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                        title="Copy text"
                      >
                        {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Chat Bar */}
      <div className="p-3.5 bg-white border-t border-slate-200">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={e => setInputQuery(e.target.value)}
            placeholder="Ask Copilot (e.g., 'Compare TECH-04 across all bidders' or 'Is GST valid?')..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim()}
            className="btn-primary py-2.5 px-4 text-xs font-bold disabled:opacity-40"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Ask</span>
          </button>
        </form>
      </div>
    </div>
  );
};
