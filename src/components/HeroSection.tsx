import tamtamFriends from "@/assets/tamtam-friends.png";

const FloatingShape = ({ className }: { className: string }) => (
  <div className={`absolute rounded-full opacity-20 ${className}`} />
);

const HeroSection = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Floating background shapes - smaller on mobile */}
      <FloatingShape className="w-16 md:w-32 h-16 md:h-32 bg-warm-yellow top-20 left-4 md:left-10 animate-float" />
      <FloatingShape className="w-12 md:w-24 h-12 md:h-24 bg-soft-blue top-40 right-8 md:right-20 animate-float-slow" />
      <FloatingShape className="w-10 md:w-16 h-10 md:h-16 bg-soft-green bottom-32 left-1/4 animate-float" />
      <FloatingShape className="w-12 md:w-20 h-12 md:h-20 bg-soft-pink top-1/3 right-1/3 animate-float-slow" />

      {/* Stars - fewer on mobile */}
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1.5 h-1.5 md:w-2 md:h-2 bg-warm-yellow rounded-full animate-twinkle"
          style={{
            top: `${15 + Math.random() * 70}%`,
            left: `${5 + Math.random() * 90}%`,
            animationDelay: `${i * 0.4}s`,
          }}
        />
      ))}

      <div className="container mx-auto px-5 flex flex-col lg:flex-row items-center gap-6 lg:gap-12">
        {/* Illustration first on mobile */}
        <div className="flex-1 flex justify-center order-first lg:order-last w-full">
          <img
            src={tamtamFriends}
            alt="Child with TamTam companion under starry sky"
            width={500}
            height={500}
            className="w-full max-w-[280px] md:max-w-md lg:max-w-lg drop-shadow-2xl animate-bob"
            style={{ maxHeight: "40vh" }}
            loading="eager"
          />
        </div>

        <div className="flex-1 text-center lg:text-left space-y-5 md:space-y-6">
          <h1 className="text-[28px] md:text-5xl lg:text-6xl font-extrabold leading-tight text-foreground">
            A safe space where{" "}
            <span className="text-primary">little fighters</span> feel heard,
            supported, and{" "}
            <span className="text-warm-yellow">never alone.</span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0">
            TamTam is the emotional support companion designed for children facing health challenges — powered by empathy, built with love.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
            <button className="w-full sm:w-auto bg-primary text-primary-foreground px-8 py-4 rounded-full font-bold text-lg active:scale-95 hover:opacity-90 transition-all shadow-lg min-h-[52px]">
              Download the App
            </button>
            <button
              onClick={() => document.querySelector("#features")?.scrollIntoView({ behavior: "smooth" })}
              className="w-full sm:w-auto border-2 border-primary text-primary px-8 py-4 rounded-full font-bold text-lg active:bg-primary active:text-primary-foreground hover:bg-primary hover:text-primary-foreground transition-all min-h-[52px]"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
