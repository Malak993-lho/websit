import { useState } from "react";
import { BarChart3, Brain, Building2, TrendingUp, Calendar, Heart, AlertCircle, Users, Activity, Star, Smile, BookOpen, MessageSquare, Clock, Zap } from "lucide-react";

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
    <div className="flex items-end gap-[3px] h-10">
      {data.map((v, i) => (
        <div
          key={i}
          className={`w-2 rounded-sm ${color} transition-all duration-300`}
          style={{ height: `${((v - min) / range) * 100 * 0.7 + 30}%`, opacity: i === data.length - 1 ? 1 : 0.5 + (i / data.length) * 0.5 }}
        />
      ))}
    </div>
  );
};

const DashboardsSection = () => {
  const [activeDashboard, setActiveDashboard] = useState(0);
  const [activeScreen, setActiveScreen] = useState(0);
  const current = dashboards[activeDashboard];
  const screen = current.screens[Math.min(activeScreen, current.screens.length - 1)];

  const handleDashboardChange = (i: number) => {
    setActiveDashboard(i);
    setActiveScreen(0);
  };

  const chartColor = activeDashboard === 0 ? "bg-blue-500" : activeDashboard === 1 ? "bg-purple-500" : "bg-amber-500";

  return (
    <section id="dashboards" className="py-16 md:py-20 lg:py-28 bg-soft-blue-light/20">
      <div className="container mx-auto px-5">
        <div className="text-center mb-10 md:mb-14 scroll-animate">
          <h2 className="text-[28px] md:text-4xl font-extrabold text-foreground mb-3 md:mb-4">
            Dashboards for Everyone 📊
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-base md:text-lg">
            Real-time insights and tools for parents, professionals, and organizations.
          </p>
        </div>

        {/* Dashboard selector */}
        <div className="flex justify-center gap-2 mb-8 scroll-animate">
          {dashboards.map((d, i) => (
            <button
              key={d.id}
              onClick={() => handleDashboardChange(i)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold transition-all min-h-[48px] ${
                activeDashboard === i
                  ? `bg-gradient-to-r ${d.gradient} text-white shadow-lg scale-105`
                  : "bg-card text-muted-foreground border border-border/50 hover:border-primary/30"
              }`}
            >
              <d.icon size={18} />
              <span className="hidden sm:inline">{d.title.split(" ")[0]}</span>
            </button>
          ))}
        </div>

        {/* Phone mockup */}
        <div className="max-w-md mx-auto scroll-animate">
          <div className="relative mx-auto w-full max-w-[340px]">
            <div className="bg-card rounded-[2.5rem] border-4 border-foreground/10 shadow-2xl overflow-hidden">
              {/* Status bar */}
              <div className="h-10 bg-muted/40 flex items-center justify-between px-6">
                <span className="text-[10px] font-semibold text-muted-foreground">9:41</span>
                <div className="w-20 h-1.5 rounded-full bg-border" />
                <div className="flex gap-1">
                  <div className="w-3.5 h-2 rounded-sm bg-muted-foreground/40" />
                </div>
              </div>

              {/* Header with gradient */}
              <div className={`bg-gradient-to-r ${current.gradient} px-5 py-4`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center text-white">
                    <current.icon size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white leading-tight">{current.title}</h3>
                    <p className="text-[11px] text-white/70">Last updated: Just now</p>
                  </div>
                </div>
              </div>

              {/* Screen tabs */}
              <div className="flex gap-1 px-3 pt-3">
                {current.screens.map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <button
                      key={s.label}
                      onClick={() => setActiveScreen(i)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all min-h-[40px] flex items-center justify-center gap-1.5 ${
                        activeScreen === i
                          ? `bg-gradient-to-r ${current.gradient} text-white shadow-md`
                          : "text-muted-foreground hover:bg-muted/50"
                      }`}
                    >
                      <Icon size={13} />
                      {s.label}
                    </button>
                  );
                })}
              </div>

              {/* Mini chart */}
              <div className="px-4 pt-4 pb-2">
                <div className="bg-muted/20 rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-muted-foreground font-medium">7-Day Trend</p>
                    <p className="text-xs font-bold text-foreground mt-0.5">
                      {screen.content[0].value}
                    </p>
                  </div>
                  <MiniChart data={screen.chart} color={chartColor} />
                </div>
              </div>

              {/* Content cards */}
              <div className="px-4 pb-3 space-y-2">
                {screen.content.map((item) => (
                  <div
                    key={item.label}
                    className="bg-muted/20 rounded-xl p-3.5 flex items-center justify-between animate-fade-in group hover:bg-muted/40 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="text-[10px] text-muted-foreground font-medium">{item.label}</p>
                      <p className="text-sm font-bold text-foreground mt-0.5">{item.value}</p>
                      <p className="text-[10px] text-muted-foreground/70 mt-0.5">{item.detail}</p>
                    </div>
                    {item.trend === "up" && (
                      <div className="w-7 h-7 rounded-full bg-accent/15 flex items-center justify-center">
                        <TrendingUp size={14} className="text-accent" />
                      </div>
                    )}
                    {item.trend === "alert" && (
                      <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center">
                        <AlertCircle size={14} className="text-red-500" />
                      </div>
                    )}
                    {item.trend === "neutral" && (
                      <div className="w-7 h-7 rounded-full bg-muted/50 flex items-center justify-center">
                        <Clock size={14} className="text-muted-foreground" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Bottom nav */}
              <div className="h-12 bg-muted/20 flex items-center justify-around px-6 border-t border-border/30">
                <Heart size={16} className="text-muted-foreground/50" />
                <BarChart3 size={16} className="text-primary" />
                <BookOpen size={16} className="text-muted-foreground/50" />
                <Users size={16} className="text-muted-foreground/50" />
              </div>

              {/* Home indicator */}
              <div className="h-6 flex items-center justify-center">
                <div className="w-28 h-1 rounded-full bg-border" />
              </div>
            </div>
          </div>

          <p className="text-center text-muted-foreground text-sm leading-relaxed mt-6 max-w-sm mx-auto">
            {current.description}
          </p>
        </div>
      </div>
    </section>
  );
};

export default DashboardsSection;
