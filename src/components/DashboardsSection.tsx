import { BarChart3, Brain, Building2 } from "lucide-react";

const dashboards = [
  {
    icon: BarChart3,
    title: "Parent Dashboard",
    description: "Track your child's emotional trends, event participation, and wish activity.",
    color: "bg-soft-blue-light text-soft-blue",
    badge: null,
  },
  {
    icon: Brain,
    title: "Psychologist Dashboard",
    description: "Access AI-generated emotional reports, manage private sessions, and monitor assigned kids.",
    color: "bg-soft-green-light text-soft-green",
    badge: null,
  },
  {
    icon: Building2,
    title: "NGO / Hospital Dashboard",
    description: "Partner with TamTam to support children in your care.",
    color: "bg-warm-yellow-light text-warm-yellow",
    badge: "Coming Soon",
  },
];

const DashboardsSection = () => {
  return (
    <section id="dashboards" className="py-20 lg:py-28 bg-soft-blue-light/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14 scroll-animate">
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">
            Dashboards for Everyone
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Real-time insights and tools for parents, professionals, and organizations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
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
