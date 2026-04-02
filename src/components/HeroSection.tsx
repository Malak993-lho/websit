import heroIllustration from "@/assets/hero-illustration.png";

const FloatingShape = ({ className }: { className: string }) => (
  <div className={`absolute rounded-full opacity-20 ${className}`} />
);

const HeroSection = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Floating background shapes */}
      <FloatingShape className="w-32 h-32 bg-warm-yellow top-20 left-10 animate-float" />
      <FloatingShape className="w-24 h-24 bg-soft-blue top-40 right-20 animate-float-slow" />
      <FloatingShape className="w-16 h-16 bg-soft-green bottom-32 left-1/4 animate-float" />
      <FloatingShape className="w-20 h-20 bg-soft-pink top-1/3 right-1/3 animate-float-slow" />
      <FloatingShape className="w-12 h-12 bg-soft-purple bottom-20 right-10 animate-float" />

      {/* Stars */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-warm-yellow rounded-full animate-twinkle"
          style={{
            top: `${15 + Math.random() * 70}%`,
            left: `${5 + Math.random() * 90}%`,
            animationDelay: `${i * 0.4}s`,
          }}
        />
      ))}

      <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
        <div className="flex-1 text-center lg:text-left space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-foreground">
            A safe space where{" "}
            <span className="text-primary">little fighters</span> feel heard,
            supported, and{" "}
            <span className="text-warm-yellow">never alone.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0">
            TamTam is the emotional support companion designed for children facing health challenges — powered by empathy, built with love.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button className="bg-primary text-primary-foreground px-8 py-3.5 rounded-full font-bold text-lg hover:opacity-90 transition-all hover:scale-105 shadow-lg">
              Download the App
            </button>
            <button
              onClick={() => document.querySelector("#features")?.scrollIntoView({ behavior: "smooth" })}
              className="border-2 border-primary text-primary px-8 py-3.5 rounded-full font-bold text-lg hover:bg-primary hover:text-primary-foreground transition-all"
            >
              Learn More
            </button>
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <img
            src={heroIllustration}
            alt="Child with TamTam companion under starry sky"
            width={500}
            height={500}
            className="w-full max-w-md lg:max-w-lg drop-shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
