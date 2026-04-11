import { useState, useRef } from "react";
import {
  Bot, Users, Star, CalendarDays, Gamepad2, Lock, BookOpen, Wind,
  MessageCircleHeart, Shield, Sparkles, ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "AI Avatar Companion",
    description: "Kids chat with TamTam, a friendly AI avatar that listens, responds with empathy, and alerts professionals when needed.",
    color: "bg-soft-blue-light text-soft-blue",
    gradient: "from-[hsl(210,80%,92%)] to-[hsl(210,70%,96%)]",
    highlight: "24/7 emotional support",
    emoji: "🤖",
  },
  {
    icon: Users,
    title: "Safe Community",
    description: "A moderated space where kids connect, share experiences, and feel part of something bigger — never alone.",
    color: "bg-soft-green-light text-soft-green",
    gradient: "from-[hsl(150,60%,92%)] to-[hsl(150,50%,96%)]",
    highlight: "100% moderated",
    emoji: "👫",
  },
  {
    icon: Star,
    title: "Wishes Page",
    description: "Kids post wishes — a toy, a book, or a video call with their hero. Visitors choose wishes to fulfill and bring real smiles.",
    color: "bg-warm-yellow-light text-warm-yellow",
    gradient: "from-[hsl(45,100%,92%)] to-[hsl(45,95%,96%)]",
    highlight: "127+ fulfilled",
    emoji: "⭐",
  },
  {
    icon: CalendarDays,
    title: "Events & Activities",
    description: "Physical and online events kids can join — art therapy, game nights, storytelling sessions. Activity shows on parent dashboards.",
    color: "bg-soft-pink-light text-soft-pink",
    gradient: "from-[hsl(340,70%,94%)] to-[hsl(340,60%,97%)]",
    highlight: "Weekly events",
    emoji: "🎉",
  },
  {
    icon: Gamepad2,
    title: "Therapeutic Games",
    description: "Fun, age-appropriate mini-games designed by child psychologists to engage, relax, and build resilience.",
    color: "bg-soft-purple-light text-soft-purple",
    gradient: "from-[hsl(270,60%,94%)] to-[hsl(270,50%,97%)]",
    highlight: "Psychologist-approved",
    emoji: "🎮",
  },
  {
    icon: Lock,
    title: "Private Therapy Rooms",
    description: "Secure, encrypted one-on-one chat rooms where licensed psychologists connect with their assigned kids in complete privacy.",
    color: "bg-soft-blue-light text-soft-blue",
    gradient: "from-[hsl(210,80%,92%)] to-[hsl(210,70%,96%)]",
    highlight: "End-to-end encrypted",
    emoji: "🔒",
  },
  {
    icon: BookOpen,
    title: "Story Time",
    description: "Meaningful stories narrated in TamTam's warm voice with interactive playback — helping kids process emotions through narrative.",
    color: "bg-soft-green-light text-soft-green",
    gradient: "from-[hsl(150,60%,92%)] to-[hsl(150,50%,96%)]",
    highlight: "50+ stories",
    emoji: "📖",
  },
  {
    icon: Wind,
    title: "Calm Zone",
    description: "Guided breathing exercises, nature sounds, and mindfulness activities to help kids decompress during stressful moments.",
    color: "bg-warm-yellow-light text-warm-yellow",
    gradient: "from-[hsl(45,100%,92%)] to-[hsl(45,95%,96%)]",
    highlight: "Instant relief",
    emoji: "🌿",
  },
];

const FeaturesSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  return (
    <section id="features" className="py-16 md:py-20 lg:py-28 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-warm-yellow/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-5 relative z-10">
        <div className="text-center mb-10 md:mb-14 scroll-animate">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-bold mb-4">
            <Sparkles size={16} /> Built for Little Fighters
          </div>
          <h2 className="text-[28px] md:text-4xl font-extrabold text-foreground mb-3 md:mb-4">
            Everything a Child Needs 💛
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
            TamTam brings together companionship, play, and professional support in one safe, magical place.
          </p>
          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {[
              { icon: Shield, text: "Safe & Moderated" },
              { icon: MessageCircleHeart, text: "AI-Powered Empathy" },
              { icon: Users, text: "Professional Oversight" },
            ].map((t) => (
              <span key={t.text} className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground bg-muted/60 px-3 py-1.5 rounded-full">
                <t.icon size={13} /> {t.text}
              </span>
            ))}
          </div>
        </div>

        {/* Mobile: vertical stack with expandable cards */}
        <div className="md:hidden flex flex-col gap-3">
          {features.map((f, i) => {
            const isExpanded = expandedCard === i;
            return (
              <button
                key={f.title}
                onClick={() => setExpandedCard(isExpanded ? null : i)}
                className={`w-full text-left bg-gradient-to-br ${f.gradient} rounded-2xl p-5 border border-border/30 transition-all duration-300 ${isExpanded ? "shadow-lg" : "shadow-sm"}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center shrink-0`}>
                    <f.icon size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-base text-foreground">{f.title}</h3>
                    <span className="text-xs font-semibold text-primary">{f.highlight}</span>
                  </div>
                  <span className="text-2xl">{f.emoji}</span>
                </div>
                {isExpanded && (
                  <p className="text-muted-foreground text-sm leading-relaxed mt-3 pl-16 animate-fade-in">
                    {f.description}
                  </p>
                )}
              </button>
            );
          })}
        </div>

        {/* Desktop: grid */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`scroll-animate bg-gradient-to-br ${f.gradient} rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-border/30 group relative overflow-hidden`}
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              {/* Background emoji */}
              <span className="absolute -bottom-2 -right-2 text-6xl opacity-10 group-hover:opacity-20 transition-opacity select-none pointer-events-none">
                {f.emoji}
              </span>
              <div className="relative z-10">
                <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <f.icon size={24} />
                </div>
                <span className="inline-block text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full mb-2">
                  {f.highlight}
                </span>
                <h3 className="font-bold text-lg text-foreground mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
