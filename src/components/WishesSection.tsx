import { useState } from "react";
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSelectedWish(null);
      setSubmitted(false);
      setForm({ name: "", email: "", phone: "", message: "" });
    }, 3000);
  };

  return (
    <section id="wishes" className="py-20 lg:py-28 bg-warm-yellow-light/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14 scroll-animate">
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">
            Make a Wish Come True 🌟
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Every child deserves to dream. Browse wishes from our little fighters and help make their day brighter.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {wishes.map((w, i) => (
            <div
              key={w.name}
              className={`scroll-animate ${w.color} border rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-full bg-card flex items-center justify-center font-bold text-primary text-sm">
                  {w.name[0]}
                </div>
                <div>
                  <p className="font-bold text-foreground">{w.name}, {w.age}</p>
                </div>
              </div>
              <p className="text-foreground/80 text-sm mb-5 leading-relaxed italic">"{w.wish}"</p>
              <button
                onClick={() => setSelectedWish(w)}
                className="w-full bg-card text-foreground border border-border rounded-full py-2.5 font-semibold text-sm hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center gap-2"
              >
                <Heart size={16} /> Fulfill This Wish 💛
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedWish && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4" onClick={() => { setSelectedWish(null); setSubmitted(false); }}>
          <div
            className="bg-card rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => { setSelectedWish(null); setSubmitted(false); }} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X size={20} />
            </button>

            {submitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="text-5xl">💛</div>
                <h3 className="text-xl font-bold text-foreground">Thank you!</h3>
                <p className="text-muted-foreground">Our team will reach out to you soon 💛</p>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-foreground mb-1">Help {selectedWish.name}'s Wish</h3>
                <p className="text-muted-foreground text-sm mb-5 italic">"{selectedWish.wish}"</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    required
                    placeholder="Full Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-muted/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                  />
                  <input
                    required
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-muted/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                  />
                  <input
                    placeholder="Phone Number"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-muted/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                  />
                  <textarea
                    placeholder="Optional message..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-muted/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm resize-none"
                  />
                  <button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground py-3 rounded-full font-bold hover:opacity-90 transition-opacity"
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
