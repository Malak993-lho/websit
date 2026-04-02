import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/1234567890"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 group"
      aria-label="Chat with us on WhatsApp"
    >
      <div className="relative">
        <div className="w-14 h-14 rounded-full bg-[hsl(142,70%,45%)] text-primary-foreground flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
          <MessageCircle size={28} fill="currentColor" />
        </div>
        <span className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-card text-foreground text-xs font-medium rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-border">
          Chat with us on WhatsApp
        </span>
      </div>
    </a>
  );
};

export default WhatsAppButton;
