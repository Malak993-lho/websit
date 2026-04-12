import { MessageCircle, X, Send, Bot, ArrowLeft } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { io, type Socket } from "socket.io-client";
import { getSocketUrl } from "@/lib/apiConfig";
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

/** Drop duplicate ids from history so the same server row never renders twice. */
function dedupeHistoryById(
  rows: ChatHistoryPayload["messages"] | undefined,
): NonNullable<ChatHistoryPayload["messages"]> {
  const seen = new Set<string>();
  const out: NonNullable<ChatHistoryPayload["messages"]> = [];
  for (const m of rows || []) {
    const id = String(m?.id ?? "");
    if (!id || seen.has(id)) continue;
    seen.add(id);
    out.push(m);
  }
  return out;
}

const ChatButton = () => {
  const [view, setView] = useState<"closed" | "menu" | "chat">("closed");
  const [messages, setMessages] = useState<Message[]>(() => [createWelcomeMessage()]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const socketRef = useRef<Socket | null>(null);
  /** Stable for this tab: persisted in localStorage via getOrCreateConversationId (survives socket reconnect). */
  const conversationIdRef = useRef<string>(getOrCreateConversationId());
  const awaitingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const manualReconnectRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** Pairs optimistic rows with server echo (same text may be sent twice; order is FIFO). */
  const pendingOutboundRef = useRef<{ localId: string; text: string }[]>([]);
  /** Server-issued message ids already merged into UI (guards duplicate events / races). */
  const seenServerMessageIdsRef = useRef<Set<string>>(new Set());

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
    const url = getSocketUrl();
    const convId = conversationIdRef.current;
    const socketIoUrl = `${url.replace(/\/+$/, "")}/socket.io/`;
    console.info("[TamTam live chat] resolved live chat base URL", {
      liveChatSocketOrigin: url,
      socketIoUrl,
    });

    const socket = io(url, {
      // Polling first: stable through Vite’s HTTP proxy; then upgrade to WebSocket when supported.
      transports: ["polling", "websocket"],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 8000,
    });
    socketRef.current = socket;

    const joinRoom = () => {
      const joinPayload = { conversation_id: conversationIdRef.current };
      console.info("[TamTam live chat] emit join_conversation", joinPayload);
      socket.emit("join_conversation", joinPayload);
    };

    const clearManualReconnect = () => {
      if (manualReconnectRef.current) {
        clearTimeout(manualReconnectRef.current);
        manualReconnectRef.current = null;
      }
    };

    const scheduleManualReconnect = () => {
      if (manualReconnectRef.current) return;
      manualReconnectRef.current = setTimeout(() => {
        manualReconnectRef.current = null;
        if (!socket.connected) {
          console.info("[TamTam live chat] manual reconnect attempt");
          socket.connect();
        }
      }, 2500);
    };

    const onConnect = () => {
      clearManualReconnect();
      const transport = socket.io.engine?.transport?.name;
      console.info("[TamTam live chat] socket connect", {
        id: socket.id,
        transport,
        liveChatSocketOrigin: url,
        socketIoUrl,
      });
      joinRoom();
    };

    const onDisconnect = (reason: string) => {
      console.info("[TamTam live chat] disconnected", reason);
      // Server closed the socket; client will not auto-reconnect unless we open again.
      if (reason === "io server disconnect") {
        scheduleManualReconnect();
      }
    };

    const onReconnectFailed = () => {
      console.warn("[TamTam live chat] reconnect_failed, scheduling retry");
      scheduleManualReconnect();
    };

    const onConnectError = (err: Error) => {
      console.warn("[TamTam live chat] connect_error", {
        message: err?.message ?? String(err),
        liveChatSocketOrigin: url,
        socketIoUrl,
      });
    };

    const onChatHistory = (data: ChatHistoryPayload) => {
      console.info("[TamTam live chat] chat_history", {
        conversation_id: data.conversation_id,
        count: data.messages?.length ?? 0,
      });
      if (data.conversation_id !== convId) return;
      pendingOutboundRef.current = [];
      const rows = dedupeHistoryById(data.messages);
      seenServerMessageIdsRef.current = new Set(rows.map((m) => String(m.id)));
      const rest = rows.map(mapServerMessage);
      setMessages([createWelcomeMessage(), ...rest]);
    };

    const onConversationsList = (data: unknown) => {
      console.info("[TamTam live chat] conversations_list (visitor; usually unused)", {
        wireType: typeof data,
      });
    };

    const onNewMessage = (data: NewMessagePayload) => {
      const mid = data.message?.id;
      console.info("[TamTam live chat] new_message", {
        conversation_id: data.conversation_id,
        msg_id: mid,
        is_admin: data.message?.is_admin,
      });
      if (data.conversation_id !== convId || !data.message) return;
      const sid = String(data.message.id ?? "");
      if (!sid || seenServerMessageIdsRef.current.has(sid)) return;
      seenServerMessageIdsRef.current.add(sid);

      const incoming = mapServerMessage(data.message);
      setMessages((prev) => {
        if (prev.some((m) => m.id === incoming.id)) return prev;
        // Drop optimistic local row when server echoes the same user message (IDs differ).
        if (!data.message.is_admin) {
          const t = incoming.content.trim();
          const pending = pendingOutboundRef.current;
          const pIdx = pending.findIndex((p) => p.text.trim() === t);
          if (pIdx !== -1) {
            const { localId } = pending[pIdx];
            pending.splice(pIdx, 1);
            const byId = prev.findIndex((m) => m.id === localId);
            if (byId !== -1) {
              const next = [...prev];
              next.splice(byId, 1);
              return [...next, incoming];
            }
          }
          const localIdx = prev.findIndex(
            (m) =>
              m.role === "user" &&
              m.id.startsWith("local_") &&
              m.content.trim() === t,
          );
          if (localIdx !== -1) {
            const next = [...prev];
            next.splice(localIdx, 1);
            return [...next, incoming];
          }
        }
        return [...prev, incoming];
      });
      if (data.message.is_admin) {
        clearAwaitingTimeout();
        setIsTyping(false);
      }
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);
    socket.io.on("reconnect_failed", onReconnectFailed);
    socket.on("chat_history", onChatHistory);
    socket.on("conversations_list", onConversationsList);
    socket.on("new_message", onNewMessage);

    if (socket.connected) {
      joinRoom();
    }

    return () => {
      clearAwaitingTimeout();
      clearManualReconnect();
      socket.io.off("reconnect_failed", onReconnectFailed);
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.off("chat_history", onChatHistory);
      socket.off("conversations_list", onConversationsList);
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
      id: `local_${makeId()}`,
      role: "user",
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    if (socket?.connected) {
      pendingOutboundRef.current.push({ localId: userMsg.id, text });
      setIsTyping(true);
      clearAwaitingTimeout();
      awaitingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        awaitingTimeoutRef.current = null;
      }, 45000);

      const name = getVisitorName();
      const payload = {
        conversation_id: convId,
        text,
        ...(name ? { name } : {}),
      };
      console.info("[TamTam live chat] emit user_send_message", payload);
      socket.emit("user_send_message", payload);
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
