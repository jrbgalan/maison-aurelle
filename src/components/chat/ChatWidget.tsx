"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { MessageCircle, X, Send, Sparkles, RotateCcw, ArrowRight } from "lucide-react";
import { chatbotConfig } from "@/data/chatbot";
import { cn } from "@/lib/utils";
import { ChatMessage } from "@/types";

function nowStamp() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [quickReplies, setQuickReplies] = useState(chatbotConfig.quickReplies);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const reduce = useReducedMotion();

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          from: "bot",
          text: "Welcome to Maison Aurelle. I am your personal AI Concierge — here to guide your consultations, explain treatments, or answer any quiet questions you may have. How may I care for your visit today? ✦",
          time: nowStamp(),
        },
      ]);
    }
  }, [open, messages.length]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  const handleSendMessage = async (userText?: string) => {
    const textToSend = (userText || input).trim();
    if (!textToSend || typing) return;

    const userMessage: ChatMessage = { id: "msg_" + Date.now(), from: "user", text: textToSend, time: nowStamp() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          userMessage: textToSend,
        }),
      });

      const data = await res.json();
      const botText = data.reply || "Our concierge is at your service. Please let us know how we may assist you.";

      setMessages((m) => [
        ...m,
        {
          id: "bot_" + Date.now(),
          from: "bot",
          text: botText,
          time: nowStamp(),
          action: data.action || null,
        },
      ]);
    } catch (err) {
      console.error("Chatbot request error:", err);
      setMessages((m) => [
        ...m,
        {
          id: "bot_err_" + Date.now(),
          from: "bot",
          text: "I am temporarily attending to a consultation. Please feel free to explore our treatments or book directly online. ✦",
          time: nowStamp(),
        },
      ]);
    } finally {
      setTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickReply = (label: string) => {
    handleSendMessage(label);
  };

  const handleReset = () => {
    setMessages([
      {
        from: "bot",
        text: "Conversation refreshed. How may I assist your journey with Maison Aurelle today? ✦",
        time: nowStamp(),
      },
    ]);
    setQuickReplies(chatbotConfig.quickReplies);
  };

  const executeAction = (action) => {
    if (action.type === "route") {
      router.push(action.href);
      setOpen(false);
    } else if (action.type === "link") {
      window.location.href = action.href;
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-pill bg-brass text-ricepaper shadow-glow transition-all duration-500 hover:scale-105 hover:bg-rose focus-ring",
          open && "rotate-90 bg-espresso"
        )}
        aria-label={open ? "Close concierge" : "Open the L'Aurelle AI Concierge"}
        aria-expanded={open}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {/* Concierge Dialog Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 flex h-[75vh] max-h-[600px] w-[min(94vw,400px)] flex-col overflow-hidden rounded-[2rem] border border-brass/35 bg-ricepaper/95 shadow-glow backdrop-blur-2xl"
            role="dialog"
            aria-label="Maison Aurelle AI Concierge"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-brass/20 bg-oatlinen/60 px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-pill bg-brass text-ricepaper shadow-soft">
                  <Sparkles className="h-4 w-4" />
                </span>
                <div>
                  <p className="display text-lg leading-none text-mocha">Maison Aurelle Concierge</p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-[0.72rem] font-light text-mocha/65">AI Specialist Online</p>
                  </div>
                </div>
              </div>
              <button
                onClick={handleReset}
                title="Restart conversation"
                className="flex h-8 w-8 items-center justify-center rounded-full text-mocha/55 hover:bg-brass/10 hover:text-mocha transition-colors focus-ring"
                aria-label="Restart chat"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>

            {/* Messages Scroll Area */}
            <div ref={scrollRef} className="flex-1 space-y-3.5 overflow-y-auto px-5 py-5 no-scrollbar">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={cn("flex flex-col", m.from === "user" ? "items-end" : "items-start")}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-3 text-sm font-light leading-relaxed",
                      m.from === "user"
                        ? "bg-mocha text-ricepaper rounded-br-sm shadow-sm"
                        : "bg-sakura/45 text-mocha rounded-bl-sm border border-brass/15"
                    )}
                  >
                    <p className="whitespace-pre-wrap">{m.text}</p>
                    {m.action && (
                      <button
                        onClick={() => executeAction(m.action)}
                        className="mt-3 inline-flex items-center gap-1.5 rounded-pill bg-brass px-3.5 py-1 text-xs font-medium text-ricepaper hover:bg-rose transition-colors"
                      >
                        Proceed <ArrowRight className="h-3 w-3" />
                      </button>
                    )}
                    <p className={cn("mt-1.5 text-[0.65rem]", m.from === "user" ? "text-ricepaper/55 text-right" : "text-mocha/45")}>
                      {m.time}
                    </p>
                  </div>
                </div>
              ))}

              {typing && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-sm bg-sakura/45 px-4 py-3 border border-brass/15">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-mocha/60 mr-1">Concierge typing</span>
                      {[0, 1, 2].map((d) => (
                        <span
                          key={d}
                          className="h-1.5 w-1.5 animate-bounce rounded-full bg-brass"
                          style={{ animationDelay: `${d * 0.15}s` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Suggestions */}
            {messages.length <= 3 && (
              <div className="border-t border-brass/15 bg-ricepaper/80 px-4 py-2.5">
                <p className="mb-2 text-[0.68rem] uppercase tracking-wider text-mocha/50">Suggested inquiries</p>
                <div className="flex flex-wrap gap-1.5">
                  {quickReplies.slice(0, 4).map((r, i) => (
                    <button
                      key={i}
                      onClick={() => handleQuickReply(r.label)}
                      className="rounded-pill border border-brass/30 bg-oatlinen/40 px-3 py-1 text-[0.75rem] font-light text-mocha transition-all hover:border-brass hover:bg-sakura/40 focus-ring"
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Bar */}
            <div className="border-t border-brass/20 bg-ricepaper/90 p-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2 rounded-pill border border-brass/35 bg-white/80 p-1.5 pl-4 shadow-sm focus-within:border-brass focus-within:ring-2 focus-within:ring-sakura/50"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask our AI concierge anything…"
                  className="flex-1 bg-transparent text-sm font-light text-mocha placeholder:text-mocha/45 focus:outline-none"
                  disabled={typing}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || typing}
                  aria-label="Send message"
                  className="flex h-9 w-9 items-center justify-center rounded-pill bg-brass text-ricepaper transition-all hover:bg-rose disabled:opacity-35 disabled:hover:bg-brass focus-ring"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}