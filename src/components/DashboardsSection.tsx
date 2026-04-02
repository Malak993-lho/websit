import { useRef } from "react";
import { BarChart3, Brain, Building2 } from "lucide-react";

const dashboards = [
  {
    icon: BarChart3,
    title: "Parent Dashboard",
    description: "Track your child's emotional trends, event participation, and wish activity.",
    color: "bg-soft-blue-light text-soft-blue",
    badge: null,
    mockItems: ["Mood: Happy 😊", "Events: 3 joined", "Wishes: 1 fulfilled"],
  },
  {
    icon: Brain,
    title: "Psychologist Dashboard",
    description: "Access AI-generated emotional reports, manage private sessions, and monitor assigned kids.",
    color: "bg-soft-green-light text-soft-green",
    badge: null,
    mockItems: ["Reports: 5 new", "Sessions: 2 today", "Alerts: 0"],
  },
  {
    icon: Building2,
    title: "NGO / Hospital Dashboard",
    description: "Partner with TamTam to support children in your care.",
    color: "bg-warm-yellow-light text-warm-yellow",
    badge: "Coming Soon",
    mockItems: ["Children: --", "Programs: --", "Impact: --"],
  },
];

const DashboardsSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section id="dashboards" className="py-16 md:py-20 lg:py-28 bg-soft-blue-light/20">
      <div className="container mx-auto px-5">
        <div className="text-center mb-10 md:mb-14 scroll-animate">
          <h2 className="text-[28px] md:text-4xl font-extrabold text-foreground mb-3 md:mb-4">
            Dashboards for Everyone
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-base md:text-lg">
            Real-time insights and tools for parents, professionals, and organizations.
          </p>
        </div>

        {/* Mobile: swipeable phone mockups */}
        <div
          ref={scrollRef}
          className="md:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-4 -mx-5 px-5"
        >
          {dashboards.map((d) => (
            <div
              key={d.title}
              className="snap-center shrink-0 w-[80vw] max-w-[300px] flex flex-col items-center"
            >
              {/* Phone frame mockup */}
              <div className="relative w-[220px] h-[380px] bg-card rounded-[2rem] border-4 border-foreground/10 shadow-xl overflow-hidden">
                {/* Status bar */}
                <div className="h-8 bg-muted/50 flex items-center justify-center">
                  <div className="w-16 h-1.5 rounded-full bg-border" />
                </div>
                {/* Content */}
                <div className="p-4 flex flex-col items-center text-center gap-3">
                  {d.badge && (
                    <span className="bg-warm-yellow text-secondary-foreground text-xs font-bold px-3 py-1 rounded-full">
                      {d.badge}
                    </span>
                  )}
                  <div className={`w-12 h-12 rounded-xl ${d.color} flex items-center justify-center`}>
                    <d.icon size={24} />
                  </div>
                  <h3 className="font-bold text-base text-foreground">{d.title}</h3>
                  <div className="w-full space-y-2 mt-2">
                    {d.mockItems.map((item) => (
                      <div key={item} className="bg-muted/40 rounded-lg py-2.5 px-3 text-sm text-foreground/70 text-left">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mt-4 text-center px-2">{d.description}</p>
            </div>
          ))}
        </div>

        {/* Scroll indicator dots (mobile) */}
        <div className="md:hidden flex justify-center gap-1.5 mt-3">
          {dashboards.map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-border" />
          ))}
        </div>

        {/* Desktop: grid cards */}
        <div className="hidden md:grid grid-cols-3 gap-6 max-w-4xl mx-auto">
          {dashboards.map((d, i) => (
            <div
              key={d.title}
              className="scroll-animate bg-card rounded-2xl p-6 shadow-sm border border-border/50 text-center space-y-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              {d.badge && (
                <span className="absolute top-4 right-4 bg-warm-yellow text-secondary-foreground text-xs font-bold px-3 py-1 rounded-full">
                  {d.badge}
                </span>
              )}
              <div className={`w-14 h-14 rounded-xl ${d.color} flex items-center justify-center mx-auto`}>
                <d.icon size={28} />
              </div>
              <h3 className="font-bold text-lg text-foreground">{d.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{d.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DashboardsSection;
