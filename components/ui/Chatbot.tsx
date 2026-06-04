"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot } from "lucide-react";

export default function Chatbot() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ text: string; sender: "user" | "bot" }>>([
    { text: "Hello! How can I help you find your perfect Japanese vehicle?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");

  const quickReplies: { label: string; href: string }[] = [
    { label: "Browse Inventory", href: "/inventory" },
    { label: "Shipping Info", href: "/shipping" },
    { label: "Get Quote", href: "/contact" },
  ];

  const handleQuickReply = (item: { label: string; href: string }) => {
    setIsOpen(false);
    router.push(item.href);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((m) => [...m, { text: input, sender: "user" }]);
    setInput("");
    setTimeout(() => {
      setMessages((m) => [...m, {
        text: "Thank you! Our team will respond shortly. Browse our inventory or check FAQ for instant answers.",
        sender: "bot",
      }]);
    }, 1000);
  };

  return (
    <>
      <button
        type="button"
        data-chatbot
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-50 w-12 h-12 rounded-full bg-teal-600 flex items-center justify-center text-white transition-all duration-300 hover:scale-105 hover:bg-teal-700 active:scale-95 cursor-pointer shadow-lg shadow-teal-600/25 touch-manipulation"
        aria-label="Open chat"
      >
        <MessageCircle className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] cursor-pointer"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.96 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-4 right-4 left-4 sm:left-auto sm:bottom-5 sm:right-5 z-[101] w-[calc(100vw-2rem)] sm:w-80 max-h-[85vh] sm:max-h-[420px] h-[420px] rounded-2xl border border-white/[0.08] bg-[#0c0c0f]/95 backdrop-blur-xl flex flex-col overflow-hidden shadow-xl"
            >
              <div className="flex items-center justify-between p-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-teal-500" />
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm">Support</div>
                    <div className="text-[10px] text-zinc-500 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Online
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg text-zinc-500 hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-xl px-3 py-2 text-xs ${msg.sender === "user"
                          ? "bg-cyan-500 text-black"
                          : "bg-white/5 border border-white/[0.06] text-zinc-200"
                        }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 border-t border-white/[0.06] flex gap-2 overflow-x-auto">
                {quickReplies.map((r) => (
                  <button
                    key={r.label}
                    type="button"
                    onClick={() => handleQuickReply(r)}
                    className="px-3 py-1.5 text-[11px] rounded-full bg-white/5 text-zinc-400 hover:bg-teal-500/10 hover:text-red-400 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    {r.label}
                  </button>
                ))}
              </div>

              <div className="p-4 border-t border-white/[0.06] flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Type a message..."
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500/50"
                />
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center text-black disabled:opacity-40 disabled:cursor-not-allowed transition-opacity cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
