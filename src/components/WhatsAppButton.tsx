import { MessageCircle, X } from "lucide-react";
import { useState } from "react";

const ChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="fixed z-40"
      style={{
        bottom: "calc(1.5rem + env(safe-area-inset-bottom, 0px))",
        right: "1.25rem",
      }}
    >
      {/* Options popup */}
      {isOpen && (
        <div className="absolute bottom-[calc(100%+12px)] right-0 flex flex-col gap-2 animate-fade-in">
          <a
            href="https://wa.me/1234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-5 py-3 rounded-full bg-[#25D366] text-white font-semibold text-sm shadow-lg hover:scale-105 active:scale-95 transition-transform whitespace-nowrap min-h-[48px]"
          >
            <MessageCircle size={20} fill="currentColor" />
            WhatsApp
          </a>
          <button
            onClick={() => {
              // TODO: integrate live chat provider
              window.open("https://wa.me/1234567890", "_blank");
            }}
            className="flex items-center gap-3 px-5 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm shadow-lg hover:scale-105 active:scale-95 transition-transform whitespace-nowrap min-h-[48px]"
          >
            <MessageCircle size={20} />
            Live Chat
          </button>
        </div>
      )}

      {/* Main button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Chat with us"
        className="flex items-center gap-2.5 px-5 py-3 rounded-full bg-[hsl(var(--tamtam-purple,270_50%_60%))] text-white font-bold text-base shadow-xl hover:scale-105 active:scale-95 transition-transform min-h-[56px]"
        style={{
          background: "linear-gradient(135deg, #9b59b6, #8e44ad)",
          boxShadow: "0 4px 20px rgba(155, 89, 182, 0.4)",
        }}
      >
        {isOpen ? (
          <X size={22} />
        ) : (
          <MessageCircle size={22} fill="currentColor" />
        )}
        Chat with us!
      </button>
    </div>
  );
};

export default ChatButton;
