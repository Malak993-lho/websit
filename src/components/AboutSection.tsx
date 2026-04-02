import aboutIllustration from "@/assets/about-illustration.png";

const AboutSection = () => {
  return (
    <section id="about" className="py-16 md:py-20 lg:py-28">
      <div className="container mx-auto px-5">
        <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-12 max-w-5xl mx-auto">
          <div className="w-full lg:flex-1 scroll-animate">
            <img
              src={aboutIllustration}
              alt="Child reading with TamTam companion"
              loading="lazy"
              width={500}
              height={500}
              className="w-full max-w-xs md:max-w-sm mx-auto drop-shadow-xl"
            />
          </div>
          <div className="lg:flex-1 scroll-animate space-y-5 md:space-y-6 text-center lg:text-left">
            <h2 className="text-[28px] md:text-4xl font-extrabold text-foreground">
              Our Mission 💛
            </h2>
            <blockquote className="text-xl md:text-2xl font-bold text-primary leading-snug">
              "Every child deserves to feel heard, safe, and never alone."
            </blockquote>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              TamTam was built for the little fighters — children facing illness, stress, or emotional hardship. Our mission is to give every child a companion that listens, a community that cares, and tools that help them heal.
            </p>
            <p className="text-muted-foreground leading-relaxed text-base">
              We combine AI-powered empathy with real human care to create something truly special.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
