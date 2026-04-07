"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Send, X, Sparkles, Loader2 } from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface AIChatWidgetProps {
  communityName?: string;
}

export default function AIChatWidget({ communityName }: AIChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: `Hey! I'm Loom AI. ${communityName ? `Welcome to ${communityName}. ` : ""}Ask me anything about crypto, blockchain, or this community.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, communityContext: communityName }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply || data.error || "Something went wrong." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Having trouble connecting. Try again in a moment." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 z-50 w-11 h-11 bg-card border border-border hover:border-border-hover rounded-2xl flex items-center justify-center transition-all hover:scale-105 shadow-2xl shadow-black/50"
        >
          <Sparkles className="w-4 h-4 text-primary" />
        </button>
      )}

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-5 right-5 z-50 w-[360px] h-[480px] bg-card border border-border rounded-2xl shadow-2xl shadow-black/50 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold text-foreground">Loom AI</span>
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse-soft" />
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-muted hover:text-foreground transition-colors p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                    msg.role === "user"
                      ? "bg-foreground/10 text-foreground rounded-br-sm"
                      : "bg-primary-dim text-muted-light rounded-bl-sm"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-primary-dim rounded-xl rounded-bl-sm px-3 py-2">
                  <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-border">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask anything..."
                className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted focus:outline-none focus:border-border-hover transition-colors"
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="bg-foreground/10 hover:bg-foreground/15 disabled:opacity-30 text-foreground rounded-lg px-3 py-2 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
