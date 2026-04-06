import { useState } from "react";
import { BarChart3, Brain, Building2, TrendingUp, Calendar, Heart, AlertCircle, Users, Activity, Star, Smile, BookOpen, MessageSquare, Clock, Zap, ChevronLeft, ChevronRight } from "lucide-react";

const dashboards = [
  {
    id: "parent",
    icon: BarChart3,
    title: "Parent Dashboard",
    description: "Stay connected with your child's emotional journey. Track moods, events, and wishes — all in real time.",
    gradient: "from-blue-500 to-indigo-600",
    lightBg: "bg-blue-50",
    screens: [
      {
        label: "Mood",
        icon: Smile,
        content: [
          { label: "Today's Mood", value: "Happy 😊", trend: "up", detail: "Feeling great after story time" },
          { label: "Weekly Average", value: "8.2/10", trend: "up", detail: "+0.6 from last week" },
          { label: "Mood Streak", value: "5 days", trend: "up", detail: "5 consecutive positive days" },
        ],
        chart: [65, 70, 60, 82, 78, 85, 90],
      },
      {
        label: "Activity",
        icon: Calendar,
        content: [
          { label: "Events Joined", value: "3 this week", trend: "up", detail: "Art class, story time, games" },
          { label: "Games Played", value: "12 sessions", trend: "up", detail: "Puzzle & memory games" },
          { label: "Stories Listened", value: "4 stories", trend: "up", detail: "New bedtime story unlocked" },
        ],
        chart: [3, 5, 4, 6, 3, 7, 5],
      },
      {
        label: "Wishes",
        icon: Star,
        content: [
          { label: "Active Wishes", value: "2 posted", trend: "neutral", detail: "Stuffed bunny & art supplies" },
          { label: "Fulfilled", value: "1 this month", trend: "up", detail: "Birthday cake wish 🎂" },
          { label: "Community Rank", value: "Top 15%", trend: "up", detail: "Most engaged family" },
        ],
        chart: [1, 1, 2, 1, 3, 2, 2],
      },
    ],
  },
  {
    id: "psychologist",
    icon: Brain,
    title: "Psychologist Dashboard",
    description: "AI-assisted emotional reports, session management, and real-time alerts for children in your care.",
    gradient: "from-purple-500 to-violet-600",
    lightBg: "bg-purple-50",
    screens: [
      {
        label: "Reports",
        icon: Activity,
        content: [
          { label: "New AI Reports", value: "5 pending", trend: "neutral", detail: "3 high priority" },
          { label: "Flagged Keywords", value: "2 alerts", trend: "alert", detail: '"scared" & "alone" detected' },
          { label: "Sentiment Score", value: "7.4/10", trend: "up", detail: "Improving steadily" },
        ],
        chart: [72, 68, 74, 71, 75, 78, 74],
      },
      {
        label: "Sessions",
        icon: MessageSquare,
        content: [
          { label: "Today's Sessions", value: "2 scheduled", trend: "neutral", detail: "Lara 2:30 PM, Omar 4:00 PM" },
          { label: "Completed", value: "8 this week", trend: "up", detail: "All notes submitted" },
          { label: "Avg Duration", value: "35 min", trend: "neutral", detail: "Within target range" },
        ],
        chart: [2, 3, 1, 2, 3, 2, 1],
      },
      {
        label: "Alerts",
        icon: AlertCircle,
        content: [
          { label: "Critical Alerts", value: "0 active", trend: "up", detail: "All clear ✓" },
          { label: "Monitoring", value: "12 children", trend: "neutral", detail: "3 new this week" },
          { label: "Response Time", value: "< 15 min", trend: "up", detail: "Fastest in network" },
        ],
        chart: [1, 0, 2, 0, 1, 0, 0],
      },
    ],
  },
  {
    id: "ngo",
    icon: Building2,
    title: "NGO / Hospital",
    description: "Partner with TamTam to support children in your care. Measure impact and coordinate programs.",
    gradient: "from-amber-500 to-orange-600",
    lightBg: "bg-amber-50",
    screens: [
      {
        label: "Overview",
        icon: TrendingUp,
        content: [
          { label: "Children Enrolled", value: "248", trend: "up", detail: "+18 this month" },
          { label: "Active Programs", value: "6 running", trend: "up", detail: "2 new launched" },
          { label: "Impact Score", value: "92/100", trend: "up", detail: "Top-performing partner" },
        ],
        chart: [180, 195, 210, 220, 230, 240, 248],
      },
      {
        label: "Teams",
        icon: Users,
        content: [
          { label: "Staff Members", value: "14 active", trend: "neutral", detail: "3 psychologists, 11 support" },
          { label: "Training", value: "98% complete", trend: "up", detail: "Annual certification" },
          { label: "Satisfaction", value: "4.8/5", trend: "up", detail: "Staff survey results" },
        ],
        chart: [10, 11, 12, 12, 13, 14, 14],
      },
      {
        label: "Impact",
        icon: Zap,
        content: [
          { label: "Wishes Fulfilled", value: "64 total", trend: "up", detail: "12 this month" },
          { label: "Sessions Held", value: "340+", trend: "up", detail: "Across all programs" },
          { label: "Families Reached", value: "180+", trend: "up", detail: "Growing community" },
        ],
        chart: [30, 38, 42, 48, 52, 58, 64],
      },
    ],
  },
];

const MiniChart = ({ data, color }: { data: number[]; color: string }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  return (
    <div className="flex items-end gap-[3px] h-8">
      {data.map((v, i) => (
        <div
          key={i}
          className={`w-1.5 rounded-sm ${color} transition-all duration-300`}
          style={{ height: `${((v - min) / range) * 100 * 0.7 + 30}%`, opacity: i === data.length - 1 ? 1 : 0.5 + (i / data.length) * 0.5 }}
        />
      ))}
    </div>
  );
};

const PhoneMockup = ({
  dashboard,
  activeScreen,
  onScreenChange,
  scale = 1,
  interactive = true,
}: {
  dashboard: typeof dashboards[0];
  activeScreen: number;
  onScreenChange?: (i: number) => void;
  scale?: number;
  interactive?: boolean;
}) => {
  const screen = dashboard.screens[Math.min(activeScreen, dashboard.screens.length - 1)];
  const chartColor = dashboard.id === "parent" ? "bg-blue-500" : dashboard.id === "psychologist" ? "bg-purple-500" : "bg-amber-500";

  return (
    <div style={{ transform: `scale(${scale})`, transformOrigin: "center center" }} className="transition-transform duration-500">
      <div className="bg-card rounded-[2rem] border-[3px] border-foreground/10 shadow-2xl overflow-hidden w-[260px]">
        {/* Status bar */}
        <div className="h-7 bg-muted/40 flex items-center justify-between px-4">
          <span className="text-[8px] font-semibold text-muted-foreground">9:41</span>
          <div className="w-14 h-1 rounded-full bg-border" />
          <div className="w-3 h-1.5 rounded-sm bg-muted-foreground/40" />
        </div>

        {/* Header */}
        <div className={`bg-gradient-to-r ${dashboard.gradient} px-4 py-3`}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center text-white">
              <dashboard.icon size={15} />
            </div>
            <div>
              <h3 className="font-bold text-[11px] text-white leading-tight">{dashboard.title}</h3>
              <p className="text-[9px] text-white/70">Last updated: Just now</p>
            </div>
          </div>
        </div>

        {/* Screen tabs */}
        <div className="flex gap-0.5 px-2 pt-2">
          {dashboard.screens.map((s, i) => {
            const Icon = s.icon;
            return (
              <button
                key={s.label}
                onClick={() => interactive && onScreenChange?.(i)}
                className={`flex-1 py-1.5 rounded-lg text-[9px] font-bold transition-all flex items-center justify-center gap-1 ${
                  activeScreen === i
                    ? `bg-gradient-to-r ${dashboard.gradient} text-white shadow-sm`
                    : "text-muted-foreground hover:bg-muted/50"
                } ${!interactive ? 'pointer-events-none' : ''}`}
              >
                <Icon size={10} />
                {s.label}
              </button>
            );
          })}
        </div>

        {/* Mini chart */}
        <div className="px-3 pt-2.5 pb-1.5">
          <div className="bg-muted/20 rounded-lg p-2.5 flex items-center justify-between">
            <div>
              <p className="text-[8px] text-muted-foreground font-medium">7-Day Trend</p>
              <p className="text-[10px] font-bold text-foreground mt-0.5">{screen.content[0].value}</p>
            </div>
            <MiniChart data={screen.chart} color={chartColor} />
          </div>
        </div>

        {/* Content cards */}
        <div className="px-3 pb-2 space-y-1.5">
          {screen.content.map((item) => (
            <div
              key={item.label}
              className="bg-muted/20 rounded-lg p-2.5 flex items-center justify-between group hover:bg-muted/40 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-[8px] text-muted-foreground font-medium">{item.label}</p>
                <p className="text-[11px] font-bold text-foreground mt-0.5">{item.value}</p>
                <p className="text-[8px] text-muted-foreground/70 mt-0.5 truncate">{item.detail}</p>
              </div>
              {item.trend === "up" && (
                <div className="w-5 h-5 rounded-full bg-accent/15 flex items-center justify-center flex-shrink-0 ml-2">
                  <TrendingUp size={10} className="text-accent" />
                </div>
              )}
              {item.trend === "alert" && (
                <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 ml-2">
                  <AlertCircle size={10} className="text-red-500" />
                </div>
              )}
              {item.trend === "neutral" && (
                <div className="w-5 h-5 rounded-full bg-muted/50 flex items-center justify-center flex-shrink-0 ml-2">
                  <Clock size={10} className="text-muted-foreground" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom nav */}
        <div className="h-9 bg-muted/20 flex items-center justify-around px-4 border-t border-border/30">
          <Heart size={12} className="text-muted-foreground/50" />
          <BarChart3 size={12} className="text-primary" />
          <BookOpen size={12} className="text-muted-foreground/50" />
          <Users size={12} className="text-muted-foreground/50" />
        </div>

        {/* Home indicator */}
        <div className="h-4 flex items-center justify-center">
          <div className="w-20 h-1 rounded-full bg-border" />
        </div>
      </div>
    </div>
  );
};

const DashboardsSection = () => {
  const [activeDashboard, setActiveDashboard] = useState(0);
  const [activeScreens, setActiveScreens] = useState([0, 0, 0]);

  const goTo = (index: number) => {
    setActiveDashboard(index);
  };

  const prev = () => setActiveDashboard((p) => (p - 1 + 3) % 3);
  const next = () => setActiveDashboard((p) => (p + 1) % 3);

  const setScreenForDashboard = (di: number, si: number) => {
    setActiveScreens((prev) => {
      const copy = [...prev];
      copy[di] = si;
      return copy;
    });
  };

  const leftIndex = (activeDashboard - 1 + 3) % 3;
  const rightIndex = (activeDashboard + 1) % 3;
  const current = dashboards[activeDashboard];

  return (
    <section id="dashboards" className="py-16 md:py-20 lg:py-28 bg-soft-blue-light/20 overflow-hidden">
      <div className="container mx-auto px-5">
        <div className="text-center mb-10 md:mb-14 scroll-animate">
          <h2 className="text-[28px] md:text-4xl font-extrabold text-foreground mb-3 md:mb-4">
            Dashboards for Everyone 📊
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-base md:text-lg">
            Real-time insights and tools for parents, professionals, and organizations.
          </p>
        </div>

        {/* 3D Card Stack */}
        <div className="relative scroll-animate">
          {/* Navigation arrows */}
          <button
            onClick={prev}
            className="absolute left-0 md:left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-card border border-border/50 shadow-lg flex items-center justify-center text-foreground/70 hover:text-primary hover:border-primary/30 transition-all"
            aria-label="Previous dashboard"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={next}
            className="absolute right-0 md:right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-card border border-border/50 shadow-lg flex items-center justify-center text-foreground/70 hover:text-primary hover:border-primary/30 transition-all"
            aria-label="Next dashboard"
          >
            <ChevronRight size={20} />
          </button>

          <div className="flex items-center justify-center relative h-[480px] md:h-[500px]" style={{ perspective: "1200px" }}>
            {dashboards.map((dashboard, i) => {
              const offset = ((i - activeDashboard + 3) % 3);
              // 0 = center, 1 = right, 2 = left
              const isCenter = offset === 0;
              const isLeft = offset === 2;
              const isRight = offset === 1;

              return (
                <div
                  key={dashboard.id}
                  className="absolute transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
                  style={{
                    zIndex: isCenter ? 20 : 5,
                    transform: isCenter
                      ? "translateX(0) scale(1) rotateY(0deg)"
                      : isLeft
                        ? "translateX(-55%) scale(0.85) rotateY(25deg)"
                        : "translateX(55%) scale(0.85) rotateY(-25deg)",
                    opacity: isCenter ? 1 : 0.5,
                    filter: isCenter ? "none" : "brightness(0.85)",
                    cursor: isCenter ? "default" : "pointer",
                    transformStyle: "preserve-3d",
                  }}
                  onClick={() => !isCenter && goTo(i)}
                >
                  <div
                    style={{
                      clipPath: isCenter
                        ? "none"
                        : isLeft
                          ? "inset(0 0 0 0)"
                          : "inset(0 0 0 0)",
                      overflow: "hidden",
                    }}
                  >
                    <PhoneMockup
                      dashboard={dashboard}
                      activeScreen={activeScreens[i]}
                      onScreenChange={isCenter ? (si) => setScreenForDashboard(i, si) : undefined}
                      scale={1}
                      interactive={isCenter}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-4">
            {dashboards.map((d, i) => (
              <button
                key={d.id}
                onClick={() => goTo(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  activeDashboard === i
                    ? "bg-primary scale-125"
                    : "bg-border hover:bg-primary/40"
                }`}
                aria-label={`Go to ${d.title}`}
              />
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="text-center mt-6">
          <div className="inline-flex items-center gap-2 mb-2">
            <current.icon size={18} className="text-primary" />
            <span className="font-bold text-foreground text-lg">{current.title}</span>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto">
            {current.description}
          </p>
        </div>
      </div>
    </section>
  );
};

export default DashboardsSection;
