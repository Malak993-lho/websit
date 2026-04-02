import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/1234567890"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed z-40 group"
      style={{
        bottom: "calc(1.5rem + env(safe-area-inset-bottom, 0px))",
        right: "1.25rem",
      }}
      aria-label="Chat with us on WhatsApp"
    >
      <div className="relative">
        {/* Pulse ring */}
        <div className="absolute inset-0 w-[60px] h-[60px] md:w-14 md:h-14 rounded-full bg-whatsapp animate-pulse-ring" />
        <div className="w-[60px] h-[60px] md:w-14 md:h-14 rounded-full bg-whatsapp text-primary-foreground flex items-center justify-center shadow-lg active:scale-95 hover:scale-110 transition-transform relative z-10">
          <MessageCircle size={28} fill="currentColor" />
        </div>
        <span className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-card text-foreground text-xs font-medium rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-border pointer-events-none">
          Chat with us on WhatsApp
        </span>
      </div>
    </a>
  );
};

export default WhatsAppButton;
