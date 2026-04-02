import {
  Bot, Users, Star, CalendarDays, Gamepad2, Lock, BookOpen, Wind,
} from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "AI Avatar Companion",
    description: "Kids chat with TamTam, a friendly AI avatar that listens, responds with empathy, and alerts professionals when needed.",
    color: "bg-soft-blue-light text-soft-blue",
  },
  {
    icon: Users,
    title: "Community",
    description: "A safe space where kids can connect, share, and feel part of something bigger.",
    color: "bg-soft-green-light text-soft-green",
  },
  {
    icon: Star,
    title: "Wishes Page",
    description: "Kids post wishes; visitors can choose to fulfill them and bring smiles.",
    color: "bg-warm-yellow-light text-warm-yellow",
  },
  {
    icon: CalendarDays,
    title: "Events",
    description: "Physical and online events kids can join. Activity shows on parent dashboards.",
    color: "bg-soft-pink-light text-soft-pink",
  },
  {
    icon: Gamepad2,
    title: "Games",
    description: "Fun, age-appropriate mini-games designed to engage and relax.",
    color: "bg-soft-purple-light text-soft-purple",
  },
  {
    icon: Lock,
    title: "Private Rooms",
    description: "Secure one-on-one chat rooms where psychologists connect with their assigned kids.",
    color: "bg-soft-blue-light text-soft-blue",
  },
  {
    icon: BookOpen,
    title: "Story Time",
    description: "Meaningful stories narrated in TamTam's voice with interactive playback.",
    color: "bg-soft-green-light text-soft-green",
  },
  {
    icon: Wind,
    title: "Calm Zone",
    description: "Breathing exercises and nature sounds to help kids decompress during stressful moments.",
    color: "bg-warm-yellow-light text-warm-yellow",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14 scroll-animate">
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">
            Everything a Child Needs 💛
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            TamTam brings together companionship, play, and professional support in one safe, magical place.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="scroll-animate bg-card rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-border/50 group"
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <f.icon size={24} />
              </div>
              <h3 className="font-bold text-lg text-foreground mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
