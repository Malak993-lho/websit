import { SmilePlus, MessageCircleHeart, Users } from "lucide-react";

const steps = [
  {
    icon: SmilePlus,
    emoji: "🧒",
    title: "Child Logs In",
    description: "Completes a mood check-in — TamTam's avatar responds with a matching animation.",
    color: "bg-soft-blue-light text-soft-blue",
  },
  {
    icon: MessageCircleHeart,
    emoji: "💬",
    title: "Chat, Play & Connect",
    description: "Child chats, plays games, and connects with the community — activity is monitored safely by AI.",
    color: "bg-soft-green-light text-soft-green",
  },
  {
    icon: Users,
    emoji: "👨‍👩‍👧",
    title: "Parents & Pros Stay Informed",
    description: "Through real-time dashboards and AI-generated reports on emotional wellbeing.",
    color: "bg-warm-yellow-light text-warm-yellow",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14 scroll-animate">
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Three simple steps to a world of emotional support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((s, i) => (
            <div key={s.title} className="scroll-animate text-center space-y-4" style={{ transitionDelay: `${i * 100}ms` }}>
              <div className="relative mx-auto w-20 h-20">
                <div className={`w-20 h-20 rounded-2xl ${s.color} flex items-center justify-center`}>
                  <s.icon size={32} />
                </div>
                <span className="absolute -top-2 -right-2 text-2xl">{s.emoji}</span>
              </div>
              <h3 className="font-bold text-lg text-foreground">{s.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{s.description}</p>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 right-0 w-8 text-border">→</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
