import { useState, useEffect, useRef } from "react";
import { Heart, X } from "lucide-react";

const wishes = [
  { name: "Lara", age: 8, wish: "I wish I had a stuffed bunny to hug when I'm scared at the hospital.", color: "bg-soft-pink-light border-soft-pink" },
  { name: "Karim", age: 10, wish: "I wish I could have art supplies so I can draw during my treatments.", color: "bg-soft-blue-light border-soft-blue" },
  { name: "Maya", age: 7, wish: "I wish I could go to the zoo one day with my family.", color: "bg-soft-green-light border-soft-green" },
  { name: "Omar", age: 11, wish: "I wish I had a tablet so I can study and not fall behind in school.", color: "bg-soft-purple-light border-soft-purple" },
  { name: "Nour", age: 9, wish: "I wish I could have a birthday cake — I've never had one with candles.", color: "bg-warm-yellow-light border-warm-yellow" },
];

const WishesSection = () => {
  const [selectedWish, setSelectedWish] = useState<typeof wishes[0] | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ startY: 0, currentY: 0, isDragging: false });

  // Lock body scroll when sheet is open
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

  // Touch drag-to-dismiss for bottom sheet
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
    <section id="wishes" className="py-16 md:py-20 lg:py-28 bg-warm-yellow-light/30">
      <div className="container mx-auto px-5">
        <div className="text-center mb-10 md:mb-14 scroll-animate">
          <h2 className="text-[28px] md:text-4xl font-extrabold text-foreground mb-3 md:mb-4">
            Make a Wish Come True 🌟
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
            Every child deserves to dream. Browse wishes from our little fighters and help make their day brighter.
          </p>
        </div>

        <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
          {wishes.map((w, i) => (
            <div
              key={w.name}
              className={`scroll-animate ${w.color} border rounded-2xl p-5 md:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-full bg-card flex items-center justify-center font-bold text-primary text-base">
                  {w.name[0]}
                </div>
                <p className="font-bold text-foreground text-base">{w.name}, {w.age}</p>
              </div>
              <p className="text-foreground/80 text-base md:text-sm mb-5 leading-relaxed italic">"{w.wish}"</p>
              <button
                onClick={() => setSelectedWish(w)}
                className="w-full bg-card text-foreground border border-border rounded-full py-3 font-semibold text-base md:text-sm active:bg-primary active:text-primary-foreground hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center gap-2 min-h-[48px]"
              >
                <Heart size={18} /> Fulfill This Wish 💛
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Sheet (mobile) / Modal (desktop) */}
      {selectedWish && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-foreground/40 backdrop-blur-sm"
          onClick={closeSheet}
        >
          <div
            ref={sheetRef}
            className="bg-card w-full md:max-w-md md:rounded-2xl rounded-t-2xl shadow-2xl p-6 pb-8 relative animate-slide-up-sheet md:animate-scale-in transition-transform"
            style={{ maxHeight: "90vh", overflowY: "auto", paddingBottom: "calc(2rem + env(safe-area-inset-bottom, 0px))" }}
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Drag handle (mobile) */}
            <div className="md:hidden flex justify-center mb-4">
              <div className="w-10 h-1.5 rounded-full bg-border" />
            </div>

            <button onClick={closeSheet} className="absolute top-4 right-4 text-muted-foreground active:text-foreground min-w-[48px] min-h-[48px] flex items-center justify-center">
              <X size={20} />
            </button>

            {submitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="text-5xl">💛</div>
                <h3 className="text-xl font-bold text-foreground">Thank you!</h3>
                <p className="text-muted-foreground text-base">Our team will reach out to you soon 💛</p>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-foreground mb-1">Help {selectedWish.name}'s Wish</h3>
                <p className="text-muted-foreground text-base mb-5 italic">"{selectedWish.wish}"</p>
                <form onSubmit={handleSubmit} className="space-y-4">
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
                    placeholder="Optional message..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3.5 rounded-xl border border-border bg-muted/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-base resize-none"
                  />
                  <button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground py-4 rounded-full font-bold text-base active:opacity-80 transition-opacity min-h-[52px]"
                  >
                    I Want to Help 💛
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default WishesSection;
