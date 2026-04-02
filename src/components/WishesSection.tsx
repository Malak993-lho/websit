import { useState, useEffect, useRef } from "react";
import { Heart, X, Sparkles, Gift } from "lucide-react";
import tamtamPeeking from "@/assets/tamtam-peeking.png";

const wishes = [
  { name: "Lara", age: 8, wish: "I wish I had a stuffed bunny to hug when I'm scared at the hospital.", emoji: "🐰", color: "from-pink-100 to-rose-50 border-pink-200" },
  { name: "Karim", age: 10, wish: "I wish I could have art supplies so I can draw during my treatments.", emoji: "🎨", color: "from-blue-100 to-sky-50 border-blue-200" },
  { name: "Maya", age: 7, wish: "I wish I could go to the zoo one day with my family.", emoji: "🦁", color: "from-green-100 to-emerald-50 border-green-200" },
  { name: "Omar", age: 11, wish: "I wish I had a tablet so I can study and not fall behind in school.", emoji: "📚", color: "from-purple-100 to-violet-50 border-purple-200" },
  { name: "Nour", age: 9, wish: "I wish I could have a birthday cake — I've never had one with candles.", emoji: "🎂", color: "from-amber-100 to-yellow-50 border-amber-200" },
];

const WishesSection = () => {
  const [selectedWish, setSelectedWish] = useState<typeof wishes[0] | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ startY: 0, currentY: 0, isDragging: false });

  useEffect(() => {
    document.body.style.overflow = selectedWish ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selectedWish]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSelectedWish(null);
      setSubmitted(false);
      setForm({ name: "", email: "", phone: "", message: "" });
    }, 3000);
  };

  const closeSheet = () => {
    setSelectedWish(null);
    setSubmitted(false);
    setForm({ name: "", email: "", phone: "", message: "" });
  };

  const onTouchStart = (e: React.TouchEvent) => {
    dragRef.current.startY = e.touches[0].clientY;
    dragRef.current.isDragging = true;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!dragRef.current.isDragging || !sheetRef.current) return;
    const diff = e.touches[0].clientY - dragRef.current.startY;
    if (diff > 0) {
      sheetRef.current.style.transform = `translateY(${diff}px)`;
    }
  };

  const onTouchEnd = () => {
    if (!sheetRef.current) return;
    const diff = parseInt(sheetRef.current.style.transform.replace(/[^0-9-]/g, "") || "0");
    if (diff > 120) {
      closeSheet();
    } else {
      sheetRef.current.style.transform = "translateY(0)";
    }
    dragRef.current.isDragging = false;
  };

  return (
    <section id="wishes" className="py-16 md:py-24 lg:py-32 relative overflow-hidden">
      {/* Warm gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-50/80 via-orange-50/40 to-pink-50/60" />
      <div className="absolute top-0 left-0 w-72 h-72 bg-warm-yellow/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-soft-pink/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

      <div className="container mx-auto px-5 relative">
        {/* Header with character */}
        <div className="text-center mb-12 md:mb-16 scroll-animate">
          <div className="inline-flex items-center gap-2 bg-warm-yellow/20 border border-warm-yellow/30 rounded-full px-5 py-2 mb-5">
            <Sparkles size={16} className="text-warm-yellow" />
            <span className="text-sm font-semibold text-foreground/70">Real wishes from real children</span>
          </div>
          <h2 className="text-[32px] md:text-5xl font-extrabold text-foreground mb-4 leading-tight">
            Make a Wish Come True
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-base md:text-lg leading-relaxed">
            These are real wishes from children facing health challenges. 
            <span className="font-semibold text-foreground"> You can make one come true today.</span>
          </p>
        </div>

        {/* Impact counter */}
        <div className="flex justify-center gap-6 md:gap-10 mb-10 md:mb-14 scroll-animate">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-extrabold text-primary">127</div>
            <div className="text-xs md:text-sm text-muted-foreground font-medium">Wishes Fulfilled</div>
          </div>
          <div className="w-px bg-border" />
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-extrabold text-warm-yellow">89</div>
            <div className="text-xs md:text-sm text-muted-foreground font-medium">Happy Children</div>
          </div>
          <div className="w-px bg-border" />
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-extrabold text-soft-green">5</div>
            <div className="text-xs md:text-sm text-muted-foreground font-medium">Wishes Waiting</div>
          </div>
        </div>

        {/* Wish cards */}
        <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 max-w-5xl mx-auto">
          {wishes.map((w, i) => (
            <div
              key={w.name}
              className={`scroll-animate group bg-gradient-to-br ${w.color} border rounded-3xl p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl relative overflow-hidden`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              {/* Large emoji background */}
              <div className="absolute -top-2 -right-2 text-7xl opacity-10 group-hover:opacity-20 transition-opacity select-none pointer-events-none">
                {w.emoji}
              </div>

              <div className="relative">
                {/* Child info */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/80 backdrop-blur flex items-center justify-center text-2xl shadow-sm">
                    {w.emoji}
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-lg leading-tight">{w.name}, {w.age}</p>
                    <p className="text-xs text-foreground/50 font-medium">Little fighter</p>
                  </div>
                </div>

                {/* Wish text */}
                <blockquote className="text-foreground/80 text-[17px] mb-6 leading-relaxed italic border-l-3 border-foreground/15 pl-4">
                  "{w.wish}"
                </blockquote>

                {/* CTA button */}
                <button
                  onClick={() => setSelectedWish(w)}
                  className="w-full bg-white/90 backdrop-blur-sm text-foreground border-2 border-foreground/10 rounded-2xl py-3.5 font-bold text-base active:scale-[0.97] hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all flex items-center justify-center gap-2.5 min-h-[52px] shadow-sm group-hover:border-primary/30"
                >
                  <Gift size={18} />
                  <span>Fulfill This Wish</span>
                  <span className="text-lg">💛</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* TamTam peeking + encouragement */}
        <div className="flex flex-col items-center mt-10 md:mt-14 scroll-animate">
          <img
            src={tamtamPeeking}
            alt="TamTam peeking"
            className="w-20 h-20 md:w-24 md:h-24 object-contain mb-3 animate-bob"
            loading="lazy"
          />
          <p className="text-center text-muted-foreground text-sm md:text-base font-medium max-w-md">
            Every wish fulfilled brings a smile to a child's face. <br className="hidden md:block" />
            <span className="text-foreground font-semibold">Even the smallest gesture matters.</span>
          </p>
        </div>
      </div>

      {/* Bottom Sheet / Modal */}
      {selectedWish && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-foreground/50 backdrop-blur-sm"
          onClick={closeSheet}
        >
          <div
            ref={sheetRef}
            className="bg-card w-full md:max-w-md md:rounded-3xl rounded-t-3xl shadow-2xl relative animate-slide-up-sheet md:animate-scale-in transition-transform"
            style={{ maxHeight: "90vh", overflowY: "auto", paddingBottom: "calc(2rem + env(safe-area-inset-bottom, 0px))" }}
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Drag handle */}
            <div className="md:hidden flex justify-center pt-3 pb-1">
              <div className="w-10 h-1.5 rounded-full bg-border" />
            </div>

            <div className="p-6">
              <button onClick={closeSheet} className="absolute top-4 right-4 text-muted-foreground active:text-foreground min-w-[48px] min-h-[48px] flex items-center justify-center">
                <X size={20} />
              </button>

              {submitted ? (
                <div className="text-center py-10 space-y-4">
                  <div className="text-6xl animate-bounce">💛</div>
                  <h3 className="text-2xl font-bold text-foreground">Thank you so much!</h3>
                  <p className="text-muted-foreground text-base max-w-xs mx-auto">
                    You're making {selectedWish.name}'s dream closer to reality. Our team will reach out to you soon.
                  </p>
                </div>
              ) : (
                <>
                  {/* Wish recap in sheet */}
                  <div className={`bg-gradient-to-br ${selectedWish.color} rounded-2xl p-4 mb-6 border`}>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{selectedWish.emoji}</span>
                      <span className="font-bold text-foreground">{selectedWish.name}, {selectedWish.age}</span>
                    </div>
                    <p className="text-foreground/80 text-sm italic">"{selectedWish.wish}"</p>
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-1">
                    Help make this wish come true
                  </h3>
                  <p className="text-muted-foreground text-sm mb-5">
                    Fill in your details and we'll connect you with {selectedWish.name}'s care team.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-3.5">
                    <input
                      required
                      placeholder="Full Name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-xl border border-border bg-muted/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-base min-h-[52px]"
                    />
                    <input
                      required
                      type="email"
                      placeholder="Email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-xl border border-border bg-muted/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-base min-h-[52px]"
                    />
                    <input
                      placeholder="Phone Number"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-xl border border-border bg-muted/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-base min-h-[52px]"
                    />
                    <textarea
                      placeholder="Leave a message for the child (optional) 💛"
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3.5 rounded-xl border border-border bg-muted/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-base resize-none"
                    />
                    <button
                      type="submit"
                      className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-bold text-lg active:scale-[0.97] transition-all min-h-[56px] shadow-lg shadow-primary/25 flex items-center justify-center gap-2"
                    >
                      <Heart size={20} fill="currentColor" />
                      I Want to Help
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default WishesSection;
