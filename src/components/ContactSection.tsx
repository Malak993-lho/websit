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

  return (
    <section id="contact" className="py-20 lg:py-28 bg-soft-green-light/20">
      <div className="container mx-auto px-4">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-10 scroll-animate">
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">
              Partner With Us
            </h2>
            <p className="text-muted-foreground text-lg">
              Whether you're an NGO, hospital, or someone who wants to help — we'd love to hear from you.
            </p>
          </div>

          {submitted ? (
            <div className="scroll-animate text-center py-12 bg-card rounded-2xl shadow-sm border border-border/50 space-y-4">
              <div className="text-5xl">💛</div>
              <h3 className="text-xl font-bold text-foreground">Message Sent!</h3>
              <p className="text-muted-foreground">We'll get back to you as soon as possible.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="scroll-animate bg-card rounded-2xl p-6 md:p-8 shadow-sm border border-border/50 space-y-4">
              <input
                required
                placeholder="Your Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-border bg-muted/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              />
              <input
                required
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-border bg-muted/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              />
              <input
                placeholder="Organization (optional)"
                value={form.organization}
                onChange={(e) => setForm({ ...form, organization: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-border bg-muted/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              />
              <textarea
                required
                placeholder="Your Message"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-border bg-muted/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm resize-none"
              />
              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground py-3 rounded-full font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
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
