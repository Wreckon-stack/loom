"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Hash, Loader2 } from "lucide-react";

interface ChatMsg {
  id: string;
  author: string;
  content: string;
  isAI: boolean;
  timestamp: Date;
}

const ROOMS = [
  { name: "general", label: "General", color: "#a78bfa" },
  { name: "trading", label: "Trading", color: "#34d399" },
  { name: "memes", label: "Memes", color: "#fbbf24" },
  { name: "newbies", label: "Beginners", color: "#60a5fa" },
  { name: "ai-chat", label: "Ask AI", color: "#f472b6" },
];

const INITIAL_MESSAGES: ChatMsg[] = [
  {
    id: "1",
    author: "Loom AI",
    content: "Welcome to Loom chat. Type @AI to summon me for help.",
    isAI: true,
    timestamp: new Date(Date.now() - 300000),
  },
  {
    id: "2",
    author: "whale_watcher",
    content: "Spotted a massive BTC transfer on-chain. 5000 BTC moved to an exchange.",
    isAI: false,
    timestamp: new Date(Date.now() - 240000),
  },
  {
    id: "3",
    author: "defi_sarah",
    content: "Anyone farming the new pool on Uniswap? APY looks insane but could be a rug.",
    isAI: false,
    timestamp: new Date(Date.now() - 180000),
  },
  {
    id: "4",
    author: "crypto_mike",
    content: "DYOR always. That pool looks sus — smart contract isn't verified.",
    isAI: false,
    timestamp: new Date(Date.now() - 120000),
  },
];

export default function ChatPage() {
  const [activeRoom, setActiveRoom] = useState("general");
  const [messages, setMessages] = useState<ChatMsg[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMsg = {
      id: Date.now().toString(),
      author: "you",
      content: input.trim(),
      isAI: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentInput = input;
    setInput("");

    if (currentInput.toLowerCase().includes("@ai") || activeRoom === "ai-chat") {
      setLoading(true);
      try {
        const res = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: currentInput.replace(/@ai/gi, "").trim(),
            communityContext: activeRoom,
          }),
        });
        const data = await res.json();
        const aiMsg: ChatMsg = {
          id: (Date.now() + 1).toString(),
          author: "Loom AI",
          content: data.reply || "Sorry, I couldn't process that.",
          isAI: true,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMsg]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            author: "Loom AI",
            content: "Having trouble connecting. Try again in a moment.",
            isAI: true,
            timestamp: new Date(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex h-[calc(100vh-57px)]">
      {/* Room list */}
      <div className="w-52 bg-card border-r border-border p-3 hidden md:flex flex-col">
        <p className="text-[10px] text-muted uppercase tracking-wider font-medium mb-3 px-2">Rooms</p>
        <div className="space-y-0.5">
          {ROOMS.map((room) => (
            <button
              key={room.name}
              onClick={() => setActiveRoom(room.name)}
              className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs transition-all ${
                activeRoom === room.name
                  ? "bg-surface-glass text-foreground"
                  : "text-muted hover:text-muted-light hover:bg-surface-glass"
              }`}
            >
              <Hash className="w-3 h-3" style={{ color: room.color }} />
              {room.label}
            </button>
          ))}
        </div>

        <div className="mt-auto glass-card-sm p-3">
          <p className="text-[10px] text-muted leading-relaxed">
            Type <code className="bg-surface-glass px-1 py-0.5 rounded text-muted-light text-[9px]">@AI</code> in any room to summon the assistant.
          </p>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {/* Room header */}
        <div className="px-4 py-2.5 border-b border-border flex items-center gap-2">
          <Hash className="w-3.5 h-3.5" style={{ color: ROOMS.find((r) => r.name === activeRoom)?.color }} />
          <h2 className="text-xs font-semibold text-foreground">
            {ROOMS.find((r) => r.name === activeRoom)?.label}
          </h2>
          <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse-soft" />
          <span className="text-[10px] text-muted">142 online</span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className="flex items-start gap-2.5 group">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-[10px] ${
                  msg.isAI
                    ? "bg-primary-dim text-primary"
                    : msg.author === "you"
                    ? "bg-secondary-dim text-secondary"
                    : "bg-surface-glass text-muted"
                }`}
              >
                {msg.isAI ? <Bot className="w-3 h-3" /> : <User className="w-3 h-3" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span
                    className={`text-[11px] font-medium ${
                      msg.isAI ? "text-primary" : msg.author === "you" ? "text-secondary" : "text-muted-light"
                    }`}
                  >
                    {msg.author}
                  </span>
                  <span className="text-[9px] text-muted opacity-0 group-hover:opacity-100 transition-opacity">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
                <p className="text-xs text-foreground/70 mt-0.5 leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-primary-dim flex items-center justify-center">
                <Bot className="w-3 h-3 text-primary" />
              </div>
              <div className="flex items-center gap-2 mt-1.5">
                <Loader2 className="w-3 h-3 text-primary animate-spin" />
                <span className="text-[10px] text-muted">thinking...</span>
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
              placeholder={`Message #${ROOMS.find((r) => r.name === activeRoom)?.label?.toLowerCase() || activeRoom}...`}
              className="flex-1 bg-background border border-border rounded-lg px-3 py-2.5 text-xs text-foreground placeholder:text-muted focus:outline-none focus:border-border-hover transition-all"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="bg-foreground/10 hover:bg-foreground/15 disabled:opacity-30 text-foreground rounded-lg px-3 py-2.5 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
