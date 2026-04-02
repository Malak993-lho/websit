import { useState } from "react";
import { Send } from "lucide-react";

const ContactSection = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", organization: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ name: "", email: "", organization: "", message: "" });
    }, 3000);
  };

  const inputClass =
    "w-full px-4 py-3.5 rounded-xl border border-border bg-muted/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-base min-h-[52px]";

  return (
    <section id="contact" className="py-16 md:py-20 lg:py-28 bg-soft-green-light/20">
      <div className="container mx-auto px-5">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-8 md:mb-10 scroll-animate">
            <h2 className="text-[28px] md:text-4xl font-extrabold text-foreground mb-3 md:mb-4">
              Partner With Us
            </h2>
            <p className="text-muted-foreground text-base md:text-lg">
              Whether you're an NGO, hospital, or someone who wants to help — we'd love to hear from you.
            </p>
          </div>

          {submitted ? (
            <div className="scroll-animate text-center py-12 bg-card rounded-2xl shadow-sm border border-border/50 space-y-4">
              <div className="text-5xl">💛</div>
              <h3 className="text-xl font-bold text-foreground">Message Sent!</h3>
              <p className="text-muted-foreground text-base">We'll get back to you as soon as possible.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="scroll-animate bg-card rounded-2xl p-5 md:p-8 shadow-sm border border-border/50 space-y-4">
              <input
                required
                placeholder="Your Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputClass}
              />
              <input
                required
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={inputClass}
              />
              <input
                placeholder="Organization (optional)"
                value={form.organization}
                onChange={(e) => setForm({ ...form, organization: e.target.value })}
                className={inputClass}
              />
              <textarea
                required
                placeholder="Your Message"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={4}
                className={`${inputClass} resize-none min-h-[120px]`}
              />
              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground py-4 rounded-full font-bold text-base active:opacity-80 transition-opacity flex items-center justify-center gap-2 min-h-[52px]"
              >
                <Send size={18} /> Get in Touch
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
