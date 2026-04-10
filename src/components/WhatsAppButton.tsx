import { MessageCircle, X, Send, Bot, ArrowLeft } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { io, type Socket } from "socket.io-client";
import { makeId } from "@/lib/utils";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

type ChatHistoryPayload = {
  conversation_id: string;
  messages: Array<{
    id: string;
    text: string;
    time: string;
    is_admin: boolean;
  }>;
};

type NewMessagePayload = {
  conversation_id: string;
  message: {
    id: string;
    text: string;
    time: string;
    is_admin: boolean;
  };
};

const LS_CONVERSATION_ID = "tamtam_live_chat_conversation_id";
/** Optional: set from elsewhere on the site via localStorage when visitor name is known */
const LS_VISITOR_NAME = "tamtam_live_chat_visitor_name";

const DEFAULT_SOCKETIO_URL =
  "http://Admin-backend-env.eba-9pw38gcy.us-west-2.elasticbeanstalk.com";

const WELCOME_ID = "welcome";

function createWelcomeMessage(): Message {
  return {
    id: WELCOME_ID,
    role: "assistant",
    content: "Hi there! 👋 Welcome to TamTam. How can I help you today?",
    timestamp: new Date(),
  };
}

function getOrCreateConversationId(): string {
  try {
    let id = localStorage.getItem(LS_CONVERSATION_ID);
    if (!id) {
      id = `conv_${makeId()}`;
      localStorage.setItem(LS_CONVERSATION_ID, id);
    }
    return id;
  } catch {
    return `conv_${makeId()}`;
  }
}

function getVisitorName(): string | undefined {
  try {
    const n = localStorage.getItem(LS_VISITOR_NAME)?.trim();
    return n || undefined;
  } catch {
    return undefined;
  }
}

function mapServerMessage(m: {
  id: string;
  text: string;
  time: string;
  is_admin: boolean;
}): Message {
  return {
    id: m.id,
    role: m.is_admin ? "assistant" : "user",
    content: m.text,
    timestamp: new Date(),
  };
}

const ChatButton = () => {
  const [view, setView] = useState<"closed" | "menu" | "chat">("closed");
  const [messages, setMessages] = useState<Message[]>(() => [createWelcomeMessage()]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const conversationIdRef = useRef<string>(getOrCreateConversationId());
  const awaitingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearAwaitingTimeout = useCallback(() => {
    if (awaitingTimeoutRef.current) {
      clearTimeout(awaitingTimeoutRef.current);
      awaitingTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (view === "chat") inputRef.current?.focus();
  }, [view]);

  useEffect(() => {
    const url = import.meta.env.VITE_SOCKETIO_URL?.replace(/\/+$/, "") || DEFAULT_SOCKETIO_URL;
    const convId = conversationIdRef.current;

    const socket = io(url, {
      transports: ["websocket", "polling"],
      autoConnect: true,
    });
    socketRef.current = socket;

    const joinRoom = () => {
      socket.emit("join_conversation", { conversation_id: convId });
    };

    const onConnect = () => {
      joinRoom();
    };

    const onChatHistory = (data: ChatHistoryPayload) => {
      if (data.conversation_id !== convId) return;
      const rest = (data.messages || []).map(mapServerMessage);
      setMessages([createWelcomeMessage(), ...rest]);
    };

    const onNewMessage = (data: NewMessagePayload) => {
      if (data.conversation_id !== convId || !data.message) return;
      const incoming = mapServerMessage(data.message);
      setMessages((prev) => {
        if (prev.some((m) => m.id === incoming.id)) return prev;
        return [...prev, incoming];
      });
      if (data.message.is_admin) {
        clearAwaitingTimeout();
        setIsTyping(false);
      }
    };

    socket.on("connect", onConnect);
    socket.on("chat_history", onChatHistory);
    socket.on("new_message", onNewMessage);

    if (socket.connected) {
      joinRoom();
    }

    return () => {
      clearAwaitingTimeout();
      socket.off("connect", onConnect);
      socket.off("chat_history", onChatHistory);
      socket.off("new_message", onNewMessage);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [clearAwaitingTimeout]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;

    const socket = socketRef.current;
    const convId = conversationIdRef.current;

    const userMsg: Message = {
      id: `local_${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    if (socket?.connected) {
      setIsTyping(true);
      clearAwaitingTimeout();
      awaitingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        awaitingTimeoutRef.current = null;
      }, 45000);

      const name = getVisitorName();
      socket.emit("user_send_message", {
        conversation_id: convId,
        text,
        ...(name ? { name } : {}),
      });
    }
  };

  const toggleMain = () => {
    if (view === "closed") setView("menu");
    else setView("closed");
  };

  return (
    <div
      className="fixed z-40 bottom-4 right-4"
      style={{
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      {/* Chat Window */}
      {view === "chat" && (
        <div
          className="absolute bottom-[calc(100%+8px)] right-0 w-[320px] max-w-[calc(100vw-2rem)] rounded-2xl shadow-2xl overflow-hidden animate-fade-in flex flex-col"
          style={{
            height: "min(440px, calc(100vh - 120px))",
            background: "linear-gradient(180deg, #f3e8ff 0%, #ffffff 30%)",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-3 px-4 py-3 text-white shrink-0"
            style={{ background: "linear-gradient(135deg, #9b59b6, #8e44ad)" }}
          >
            <button
              onClick={() => setView("menu")}
              className="p-1 rounded-full hover:bg-white/20 transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
              aria-label="Back"
            >
              <ArrowLeft size={18} />
            </button>
            <Bot size={20} />
            <div className="flex-1">
              <p className="font-bold text-sm leading-tight">TamTam Assistant</p>
              <p className="text-[11px] opacity-80">Typically replies instantly</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2.5">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[#9b59b6] text-white rounded-br-md"
                      : "bg-white text-foreground shadow-sm border border-border/50 rounded-bl-md"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white shadow-sm border border-border/50 px-4 py-3 rounded-2xl rounded-bl-md">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-2.5 border-t border-border/50 bg-white shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-3.5 py-2.5 rounded-full bg-muted text-sm text-foreground placeholder:text-muted-foreground outline-none min-h-[40px]"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="w-9 h-9 rounded-full flex items-center justify-center text-white disabled:opacity-40 transition-all active:scale-90 shrink-0"
                style={{ background: "linear-gradient(135deg, #9b59b6, #8e44ad)" }}
                aria-label="Send message"
              >
                <Send size={14} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Menu Options */}
      {view === "menu" && (
        <div className="absolute bottom-[calc(100%+8px)] right-0 flex flex-col gap-2 animate-fade-in">
          <a
            href="https://wa.me/1234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#25D366] text-white font-semibold text-sm shadow-lg hover:scale-105 active:scale-95 transition-transform whitespace-nowrap min-h-[44px]"
          >
            <MessageCircle size={18} fill="currentColor" />
            WhatsApp
          </a>
          <button
            onClick={() => setView("chat")}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-full text-white font-semibold text-sm shadow-lg hover:scale-105 active:scale-95 transition-transform whitespace-nowrap min-h-[44px]"
            style={{ background: "linear-gradient(135deg, #9b59b6, #8e44ad)" }}
          >
            <Bot size={18} />
            Live Chat
          </button>
        </div>
      )}

      {/* Main Button — compact, tucked into corner */}
      <button
        onClick={toggleMain}
        aria-label="Chat with us"
        className="w-14 h-14 rounded-full text-white shadow-xl hover:scale-110 active:scale-95 transition-transform flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, #9b59b6, #8e44ad)",
          boxShadow: "0 4px 16px rgba(155, 89, 182, 0.4)",
        }}
      >
        {view !== "closed" ? <X size={22} /> : <MessageCircle size={22} fill="currentColor" />}
      </button>
    </div>
  );
};

export default ChatButton;
