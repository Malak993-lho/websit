import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import tamtamAvatar from "@/assets/tamtam-avatar.png";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Wishes", href: "#wishes" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Dashboards", href: "#dashboards" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleClick = (href: string) => {
    setMobileOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || mobileOpen
          ? "bg-card/90 backdrop-blur-md shadow-md"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between py-3 px-5">
        <button onClick={() => handleClick("#hero")} className="flex items-center gap-2 min-h-[48px]">
          <img src={tamtamAvatar} alt="TamTam" width={40} height={40} />
          <span className="font-heading font-extrabold text-xl text-primary">TamTam</span>
        </button>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((l) => (
            <button
              key={l.href}
              onClick={() => handleClick(l.href)}
              className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors min-h-[48px] px-1"
            >
              {l.label}
            </button>
          ))}
          <button
            onClick={() => handleClick("#contact")}
            className="bg-primary text-primary-foreground px-5 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity min-h-[48px]"
          >
            Get in Touch
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground min-w-[48px] min-h-[48px] flex items-center justify-center"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile slide-down drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-card/95 backdrop-blur-md border-t border-border animate-slide-down overflow-hidden">
          <div className="flex flex-col p-5 gap-1">
            {navLinks.map((l) => (
              <button
                key={l.href}
                onClick={() => handleClick(l.href)}
                className="text-left py-3 px-4 rounded-xl text-foreground/80 active:bg-muted transition-colors font-semibold text-base min-h-[48px]"
              >
                {l.label}
              </button>
            ))}
            <button
              onClick={() => handleClick("#contact")}
              className="mt-2 bg-primary text-primary-foreground py-3.5 rounded-full font-bold text-base min-h-[48px] active:opacity-80 transition-opacity"
            >
              Get in Touch
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
