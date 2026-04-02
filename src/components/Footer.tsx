import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import tamtamAvatar from "@/assets/tamtam-avatar.png";

const links = [
  { label: "Features", href: "#features" },
  { label: "Wishes", href: "#wishes" },
  { label: "Events", href: "#features" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const socials = [
  { icon: Facebook, href: "#" },
  { icon: Instagram, href: "#" },
  { icon: Twitter, href: "#" },
  { icon: Youtube, href: "#" },
];

const Footer = () => {
  const handleClick = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-foreground/[0.03] border-t border-border py-10 md:py-12 pb-safe">
      <div className="container mx-auto px-5">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between md:gap-8">
          <div className="flex items-center gap-3">
            <img src={tamtamAvatar} alt="TamTam" width={36} height={36} loading="lazy" />
            <div>
              <p className="font-heading font-extrabold text-lg text-primary">TamTam</p>
              <p className="text-xs text-muted-foreground">Where little fighters feel heard.</p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {links.map((l) => (
              <button
                key={l.label}
                onClick={() => handleClick(l.href)}
                className="text-sm text-muted-foreground active:text-primary hover:text-primary transition-colors min-h-[48px] flex items-center"
              >
                {l.label}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            {socials.map(({ icon: Icon, href }) => (
              <a
                key={href + Icon.displayName}
                href={href}
                className="w-11 h-11 md:w-9 md:h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground active:bg-primary active:text-primary-foreground hover:bg-primary hover:text-primary-foreground transition-all"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-6 md:mt-8 pt-6 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">© 2025 TamTam. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
