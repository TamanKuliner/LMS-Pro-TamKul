import React, { useState, useRef, useEffect } from "react";
import { 
  BrainCircuit, 
  Send, 
  Sparkles, 
  User, 
  Bot, 
  RotateCcw, 
  ShieldCheck, 
  HelpCircle 
} from "lucide-react";
import { Language } from "../types";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  source?: string;
  timestamp: string;
}

interface ShariaAdvisorChatProps {
  language: Language;
  businessName: string;
}

export const ShariaAdvisorChat: React.FC<ShariaAdvisorChatProps> = ({
  language,
  businessName,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg-0",
      sender: "ai",
      text: `Assalamu'alaikum Warahmatullahi Wabarakatuh. Selamat datang di **Konsultan AI Syariah TamanKuliner.com**!
      
Saya siap membantu Anda dalam:
1. Menilai kesiapan usaha **${businessName}** menjadi bankable (Kriteria 5C).
2. Memilih akad muamalah yang tepat (Murabahah, Mudharabah, Musyarakah, Ijarah).
3. Konsultasi persiapan dokumen Sistem Jaminan Produk Halal (SJPH) & portal SIHALAL BPJPH.
4. Meninjau etika promosi media sosial kuliner agar bebas dari riba, overclaim, dan testimoni palsu.

Silakan ajukan pertanyaan Anda atau pilih salah satu topik cepat di bawah ini.`,
      source: "ai-advisor-engine",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendPrompt = async (promptToSend?: string) => {
    const query = promptToSend || inputPrompt;
    if (!query.trim() || isLoading) return;

    const userMsgId = `usr-${Date.now()}`;
    const newMessages: Message[] = [
      ...messages,
      {
        id: userMsgId,
        sender: "user",
        text: query,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ];

    setMessages(newMessages);
    setInputPrompt("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/advisor-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: query,
          businessName,
          language,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages([
          ...newMessages,
          {
            id: `ai-${Date.now()}`,
            sender: "ai",
            text: data.reply,
            source: data.model || "gemini-ai",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      } else {
        throw new Error("Failed response");
      }
    } catch (err) {
      // Offline fallback rule-based response
      let fallback = `Terkait pertanyaan Anda seputar "${query}": Dalam fiqih muamalah F&B, penting memprioritaskan kejelasan akad (bebas dari gharar), kepastian margin laba jual beli (Murabahah), dan audit bahan baku hewani bersertifikat halal BPJPH.`;
      
      if (query.toLowerCase().includes("bankable") || query.toLowerCase().includes("5c")) {
        fallback = `Untuk meningkatkan Bankable 5C ${businessName}: Pastikan membuka rekening bank syariah terpisah, gunakan mesin kasir digital/QRIS, dan jaga agar margin kotor berada di rentang 30-45%.`;
      } else if (query.toLowerCase().includes("halal") || query.toLowerCase().includes("sjph")) {
        fallback = `Untuk pendaftaran SIHALAL BPJPH: Siapkan NIB berbasis risiko, tunjuk Penyelia Halal Muslim ber-SK, dan susun Manual SJPH dengan bahan-bahan bersertifikat resmi.`;
      }

      setMessages([
        ...newMessages,
        {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: fallback,
          source: "knowledge-base",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    "Bagaimana cara memisahkan kas pribadi dan kas usaha kuliner?",
    "Apa perbedaan akad Murabahah dan Mudharabah untuk beli chiller dapur?",
    "Syarat dokumen wajib untuk daftar sertifikasi halal gratis (SEHATI)?",
    "Berapa nisab zakat perdagangan makanan dan cara menghitungnya?",
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-slate-300">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#16191F] p-5 rounded-xl border border-slate-800 shadow-xl">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>AI Advisor • Berdaya Model Gemini 2.5 Flash</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            Konsultan AI Syariah TamanKuliner.com
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Tanyakan langsung seputar akad perbankan syariah, kalkulasi bagi hasil, dan prosedur sertifikasi halal BPJPH.
          </p>
        </div>

        <button
          onClick={() =>
            setMessages([
              {
                id: "msg-reset",
                sender: "ai",
                text: `Sesi konsultasi baru telah dimulai. Apa yang ingin Anda diskusikan mengenai ${businessName}?`,
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              },
            ])
          }
          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 hover:bg-slate-800 flex items-center space-x-1.5 self-start sm:self-auto shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Mulai Sesi Baru</span>
        </button>
      </div>

      {/* Chat Conversation Box */}
      <div className="bg-[#16191F] rounded-xl border border-slate-800 shadow-xl flex flex-col h-[520px] overflow-hidden">
        {/* Messages Scroll Area */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-3.5">
          {messages.map((msg) => {
            const isAI = msg.sender === "ai";
            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-3 ${isAI ? "justify-start" : "justify-end"}`}
              >
                {isAI && (
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-xl rounded-xl p-3.5 text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                    isAI
                      ? "bg-slate-900 text-slate-200 border border-slate-800"
                      : "bg-emerald-600 text-white shadow-sm"
                  }`}
                >
                  <p>{msg.text}</p>
                  <div
                    className={`mt-2 flex items-center justify-between text-[10px] ${
                      isAI ? "text-slate-500" : "text-emerald-100"
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {msg.source && (
                      <span className="font-semibold uppercase tracking-wider font-mono">
                        {msg.source === "gemini-ai" ? "Gemini Flash" : "Knowledge Base"}
                      </span>
                    )}
                  </div>
                </div>

                {!isAI && (
                  <div className="w-7 h-7 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center space-x-3 text-slate-400 text-xs">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center animate-pulse">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <span>Konsultan Syariah sedang menganalisis fatwa & panduan...</span>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-2.5 bg-slate-900 border-t border-slate-800 overflow-x-auto flex space-x-2">
          {quickPrompts.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSendPrompt(chip)}
              className="px-2.5 py-1 rounded-md text-[11px] bg-[#16191F] border border-slate-800 hover:border-emerald-500 text-slate-300 font-medium whitespace-nowrap transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-[#16191F] border-t border-slate-800 flex items-center space-x-2">
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendPrompt()}
            placeholder={`Tanyakan fiqih muamalah, akad, 5C, atau SJPH halal untuk ${businessName}...`}
            className="flex-1 bg-slate-900 text-white px-3.5 py-2 rounded-lg border border-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <button
            onClick={() => handleSendPrompt()}
            disabled={!inputPrompt.trim() || isLoading}
            className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white shadow-md transition-all shrink-0"
            aria-label="Send query"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
