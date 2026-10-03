'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Stethoscope,
  RotateCcw,
  ArrowRight,
  Calendar,
  AlertTriangle,
  PhoneCall,
  User,
  HeartPulse,
  Baby,
  Headphones,
  Eye,
  Smile,
  Activity,
  Award,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

interface DoctorSuggestion {
  id: string;
  name: string;
  degree: string;
  experienceYears: number;
  consultationFee: number;
  avatarUrl?: string | null;
}

interface SpecialtySuggestion {
  id: string;
  name: string;
  description: string;
  iconUrl?: string | null;
}

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  suggestedSpecialty?: SpecialtySuggestion | null;
  suggestedDoctors?: DoctorSuggestion[];
  quickReplies?: string[];
  isEmergency?: boolean;
  action?: 'BOOK_APPOINTMENT' | 'VIEW_DOCTORS' | 'GENERAL';
  timestamp: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'welcome-1',
    sender: 'bot',
    text: `Xin chào! Tôi là **CareBot** — Trợ lý Bác sĩ Ảo của Phòng Khám Đa Khoa CarePlus+ 🩺✨\n\nTôi có thể giúp bạn:\n• 🔍 **Tư vấn sơ bộ theo triệu chứng** bạn đang gặp phải.\n• 🏥 **Gợi ý Chuyên khoa khám phù hợp nhất**.\n• 👨‍⚕️ **Giới thiệu Bác sĩ chuyên khoa giỏi & hướng dẫn đặt lịch khám nhanh chóng**.\n\nHãy nhập triệu chứng của bạn hoặc chọn các gợi ý nhanh bên dưới nhé!`,
    timestamp: 'Vừa xong',
    quickReplies: [
      'Đau thắt ngực, khó thở',
      'Bé bị sốt và biếng ăn',
      'Nổi mẩn ngứa, dị ứng da',
      'Đau nhức răng buốt',
      'Đau khớp gối khi đi lại',
      'Đau dạ dày, trào ngược ợ chua',
      'Hướng dẫn đặt lịch khám',
    ],
  },
];

export function AIChatBot() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to latest message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, loading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setShowTooltip(false);
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || loading) return;

    setHasInteracted(true);
    const userMsgId = `user-${Date.now()}`;
    const newMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputValue('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: data.reply || 'Xin lỗi, tôi chưa hiểu rõ triệu chứng của bạn. Vui lòng mô tả chi tiết hơn nhé!',
        suggestedSpecialty: data.suggestedSpecialty,
        suggestedDoctors: data.suggestedDoctors || [],
        quickReplies: data.quickReplies || [],
        isEmergency: data.isEmergency,
        action: data.action,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: 'bot',
          text: 'Xin lỗi, kết nối tới hệ thống y tế bị gián đoạn. Bạn vui lòng thử lại hoặc gọi tổng đài **090-123-4567** để được hỗ trợ!',
          timestamp: 'Vừa xong',
          quickReplies: ['Thử lại', 'Gọi hotline 090-123-4567'],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages(INITIAL_MESSAGES);
    setInputValue('');
  };

  const getSpecialtyIcon = (iconName?: string | null) => {
    switch (iconName) {
      case 'HeartPulse':
        return <HeartPulse className="w-5 h-5 text-emerald-600" />;
      case 'Baby':
        return <Baby className="w-5 h-5 text-emerald-600" />;
      case 'Headphones':
        return <Headphones className="w-5 h-5 text-emerald-600" />;
      case 'Eye':
        return <Eye className="w-5 h-5 text-emerald-600" />;
      case 'Smile':
        return <Smile className="w-5 h-5 text-emerald-600" />;
      case 'Bone':
      case 'Activity':
        return <Activity className="w-5 h-5 text-emerald-600" />;
      default:
        return <Stethoscope className="w-5 h-5 text-emerald-600" />;
    }
  };

  // Helper to format bot markdown-like text (bold, list items)
  const renderFormattedText = (content: string) => {
    const lines = content.split('\n');
    return (
      <div className="space-y-1.5 leading-relaxed text-sm">
        {lines.map((line, idx) => {
          if (!line.trim()) return <div key={idx} className="h-1" />;

          // Process bold markers: **text**
          const parts = line.split(/(\*\*.*?\*\*)/g);
          const renderedLine = parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={pIdx} className="font-bold text-slate-900">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return part;
          });

          // Check if bullet point
          if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
            return (
              <div key={idx} className="flex items-start gap-1.5 pl-1 text-slate-700">
                <span className="text-emerald-600 font-bold shrink-0">•</span>
                <span>{renderedLine.slice(1)}</span>
              </div>
            );
          }

          return (
            <p key={idx} className="text-slate-800">
              {renderedLine}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {/* FLOATING TRIGGER BUBBLE (BOTTOM-RIGHT) */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {/* WELCOME / PROMPT POPUP TOOLTIP */}
        {showTooltip && !isOpen && (
          <div className="mb-3 max-w-[280px] bg-white rounded-2xl p-3.5 shadow-2xl border-2 border-emerald-300 text-slate-800 text-xs animate-bounce relative">
            <button
              onClick={() => setShowTooltip(false)}
              className="absolute -top-2 -right-2 w-5 h-5 bg-slate-200 hover:bg-slate-300 rounded-full flex items-center justify-center text-slate-600 text-[10px]"
              aria-label="Đóng gợi ý"
            >
              ✕
            </button>
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-slate-900 text-xs flex items-center gap-1">
                  Bác Sĩ Tư Vấn AI CareBot
                </p>
                <p className="text-[11px] text-slate-600 leading-tight">
                  Bạn có triệu chứng mệt mỏi hay đau nhức? Nhấn để tôi gợi ý khoa khám phù hợp nhé!
                </p>
              </div>
            </div>
            {/* Tooltip triangle */}
            <div className="absolute -bottom-2 right-6 w-3 h-3 bg-white border-b-2 border-r-2 border-emerald-300 rotate-45" />
          </div>
        )}

        {/* FLOATING BUTTON */}
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className={`relative group flex items-center justify-center rounded-full transition-all duration-300 shadow-2xl ${
            isOpen
              ? 'w-14 h-14 bg-slate-800 hover:bg-slate-900 text-white'
              : 'w-16 h-16 bg-gradient-to-tr from-emerald-600 via-[#10b981] to-teal-500 hover:scale-105 hover:shadow-emerald-500/50 text-white'
          }`}
          aria-label={isOpen ? 'Thu nhỏ chatbot' : 'Mở tư vấn Bác sĩ AI'}
        >
          {/* Subtle Ambient Pulse Ring when closed */}
          {!isOpen && (
            <span className="absolute -inset-1 rounded-full bg-emerald-400 opacity-40 animate-ping pointer-events-none" />
          )}

          {isOpen ? (
            <X className="w-6 h-6 transition-transform group-hover:rotate-90 duration-200" />
          ) : (
            <div className="flex flex-col items-center justify-center">
              <Stethoscope className="w-7 h-7 drop-shadow-sm" />
              <span className="text-[9px] font-extrabold uppercase tracking-tight mt-0.5">AI Khám</span>
            </div>
          )}

          {/* ONLINE BADGE INDICATOR */}
          <span className="absolute top-0 right-0 w-4 h-4 bg-emerald-400 border-2 border-white rounded-full shadow-sm" />
        </button>
      </div>

      {/* CHATBOT DIALOG MODAL / WINDOW */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-[430px] h-[610px] max-h-[82vh] bg-white rounded-3xl shadow-2xl shadow-emerald-950/25 border-2 border-emerald-200/90 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* HEADER */}
          <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white p-4 shrink-0 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white shadow-inner">
                  <Stethoscope className="w-5 h-5 text-emerald-200" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-emerald-800 rounded-full animate-pulse" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-sm sm:text-base leading-tight">CareBot — Bác Sĩ AI</h3>
                  <span className="bg-emerald-400/20 text-emerald-200 border border-emerald-300/30 text-[10px] font-bold px-1.5 py-0.2 rounded-md">
                    24/7
                  </span>
                </div>
                <p className="text-[11px] text-emerald-100 font-medium">Tư vấn triệu chứng & Phân luồng khoa khám</p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-emerald-100">
              <button
                onClick={handleResetChat}
                title="Làm mới cuộc trò chuyện"
                className="p-1.5 hover:bg-white/15 rounded-xl transition-colors text-emerald-100 hover:text-white"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Thu nhỏ cửa sổ"
                className="p-1.5 hover:bg-white/15 rounded-xl transition-colors text-emerald-100 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* MEDICAL DISCLAIMER TOP BAR */}
          <div className="bg-emerald-50/90 px-3.5 py-1.5 border-b border-emerald-100/90 text-[11px] text-emerald-800 font-medium flex items-center gap-1.5 shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Tư vấn định hướng ban đầu, giúp bạn chọn đúng chuyên khoa và bác sĩ.</span>
          </div>

          {/* MESSAGES LIST AREA */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/60 text-slate-800">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-start gap-2 max-w-[92%] sm:max-w-[88%]">
                  {msg.sender === 'bot' && (
                    <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
                      <Stethoscope className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`rounded-2xl p-3.5 shadow-sm text-sm ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tr-none font-medium'
                        : 'bg-white text-slate-800 rounded-tl-none border border-emerald-100/80 shadow-slate-100'
                    }`}
                  >
                    {msg.sender === 'user' ? (
                      <p className="leading-relaxed">{msg.text}</p>
                    ) : (
                      renderFormattedText(msg.text)
                    )}

                    {/* EMERGENCY WARNING BOX */}
                    {msg.isEmergency && (
                      <div className="mt-3 p-3 bg-red-50 border-2 border-red-300 rounded-xl space-y-2 text-red-900">
                        <div className="flex items-center gap-2 font-extrabold text-xs text-red-700">
                          <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
                          HÀNH ĐỘNG KHẨN CẤP
                        </div>
                        <p className="text-[11px] text-red-800 leading-tight">
                          Nếu người bệnh có dấu hiệu ngất xỉu, co giật hoặc khó thở tím tái, hãy gọi ngay cấp cứu!
                        </p>
                        <div className="flex gap-2 pt-1">
                          <a
                            href="tel:115"
                            className="flex-1 text-center py-2 px-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs shadow-md transition-colors"
                          >
                            🚨 Gọi 115 Cấp Cứu
                          </a>
                          <a
                            href="tel:0901234567"
                            className="flex-1 text-center py-2 px-3 bg-white hover:bg-slate-50 text-red-700 border border-red-300 font-bold rounded-lg text-xs transition-colors"
                          >
                            📞 Hotline Phòng Khám
                          </a>
                        </div>
                      </div>
                    )}

                    {/* SUGGESTED SPECIALTY CARD */}
                    {msg.suggestedSpecialty && (
                      <div className="mt-3 p-3.5 bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white border-2 border-emerald-300/80 rounded-2xl shadow-sm space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 uppercase tracking-wider bg-emerald-100/80 px-2 py-0.5 rounded-md">
                            🏥 Chuyên Khoa Phù Hợp
                          </span>
                          <span className="text-[11px] text-slate-500 font-semibold">Được đề xuất</span>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0 border border-emerald-200">
                            {getSpecialtyIcon(msg.suggestedSpecialty.iconUrl)}
                          </div>
                          <div>
                            <h4 className="font-extrabold text-slate-900 text-sm">
                              {msg.suggestedSpecialty.name}
                            </h4>
                            <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">
                              {msg.suggestedSpecialty.description}
                            </p>
                          </div>
                        </div>

                        {/* DIRECT BOOKING BUTTON */}
                        <Link
                          href={`/book?specialtyId=${msg.suggestedSpecialty.id}`}
                          onClick={() => setIsOpen(false)}
                          className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 bg-[#10b981] hover:bg-[#059669] text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02]"
                        >
                          <Calendar className="w-4 h-4" />
                          Đặt Lịch Khám {msg.suggestedSpecialty.name} Ngay
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    )}

                    {/* SUGGESTED DOCTORS CHIPS */}
                    {msg.suggestedDoctors && msg.suggestedDoctors.length > 0 && (
                      <div className="mt-3 space-y-1.5">
                        <p className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                          <Award className="w-3.5 h-3.5 text-amber-500" /> Bác sĩ chuyên khoa tiêu biểu:
                        </p>
                        <div className="space-y-1.5">
                          {msg.suggestedDoctors.map((doc) => (
                            <Link
                              key={doc.id}
                              href={`/book?doctorId=${doc.id}${
                                msg.suggestedSpecialty ? `&specialtyId=${msg.suggestedSpecialty.id}` : ''
                              }`}
                              onClick={() => setIsOpen(false)}
                              className="group flex items-center justify-between p-2 bg-slate-50 hover:bg-emerald-50/80 rounded-xl border border-slate-200 hover:border-emerald-300 transition-all"
                            >
                              <div className="flex items-center gap-2">
                                <img
                                  src={doc.avatarUrl || '/images/default-avatar.svg'}
                                  alt={doc.name}
                                  className="w-7 h-7 rounded-full object-cover border border-emerald-200"
                                />
                                <div>
                                  <p className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                                    {doc.name}
                                  </p>
                                  <p className="text-[10px] text-slate-500 font-medium">
                                    {doc.degree} • {doc.experienceYears} năm KN
                                  </p>
                                </div>
                              </div>
                              <span className="text-[10px] font-bold text-emerald-700 bg-white border border-emerald-200 group-hover:bg-emerald-600 group-hover:text-white px-2 py-1 rounded-lg transition-colors">
                                Đặt Bác Sĩ
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* BOOKING GENERAL ACTION BUTTON */}
                    {msg.action === 'BOOK_APPOINTMENT' && !msg.suggestedSpecialty && (
                      <div className="mt-3 pt-2 border-t border-slate-100">
                        <Link
                          href="/book"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center justify-center gap-1.5 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md transition-all"
                        >
                          <Calendar className="w-4 h-4" />
                          Đi Tới Trang Đặt Lịch Khám (3 Bước)
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

                <span className="text-[10px] text-slate-500 mt-1 px-1">
                  {msg.timestamp}
                </span>

                {/* QUICK REPLIES PILLS (AFTER BOT MESSAGE) */}
                {msg.sender === 'bot' && msg.quickReplies && msg.quickReplies.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5 pl-9 max-w-full">
                    {msg.quickReplies.map((reply, rIdx) => (
                      <button
                        key={rIdx}
                        onClick={() => handleSendMessage(reply)}
                        className="text-[11px] font-semibold text-emerald-800 bg-emerald-50/90 hover:bg-emerald-600 hover:text-white border border-emerald-300/80 px-2.5 py-1 rounded-full shadow-2xs transition-all active:scale-95"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* TYPING INDICATOR */}
            {loading && (
              <div className="flex items-start gap-2 max-w-[85%]">
                <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-1">
                  <Stethoscope className="w-4 h-4 animate-spin" />
                </div>
                <div className="bg-white rounded-2xl rounded-tl-none p-3.5 border border-emerald-100 shadow-xs space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
                    <span className="text-xs font-semibold text-emerald-700 ml-1.5">
                      CareBot đang phân tích triệu chứng...
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* INPUT BAR */}
          <div className="p-3 bg-white border-t border-slate-200 shrink-0 space-y-1.5">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Mô tả triệu chứng (vd: đau ngực, sốt ho, nổi mẩn...)..."
                disabled={loading}
                className="flex-1 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 bg-slate-50 placeholder:text-slate-500 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || loading}
                className="w-10 h-10 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white flex items-center justify-center shrink-0 disabled:opacity-40 disabled:cursor-not-allowed shadow-md transition-all active:scale-95"
                aria-label="Gửi tin nhắn"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="flex items-center justify-between text-[10px] text-slate-500 px-1">
              <span>⚡ Phân luồng 10 Chuyên Khoa Y Tế</span>
              <a href="tel:0901234567" className="text-emerald-700 font-bold hover:underline">
                Hotline: 090-123-4567
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
