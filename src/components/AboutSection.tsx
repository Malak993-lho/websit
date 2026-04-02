import aboutIllustration from "@/assets/about-illustration.png";

const AboutSection = () => {
  return (
    <section id="about" className="py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12 max-w-5xl mx-auto">
          <div className="flex-1 scroll-animate">
            <img
              src={aboutIllustration}
              alt="Child reading with TamTam companion"
              loading="lazy"
              width={500}
              height={500}
              className="w-full max-w-sm mx-auto drop-shadow-xl"
            />
          </div>
          <div className="flex-1 scroll-animate space-y-6 text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">
              Our Mission 💛
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              TamTam was built for the little fighters — children facing illness, stress, or emotional hardship. Our mission is to give every child a companion that listens, a community that cares, and tools that help them heal.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We believe every child deserves to feel heard, safe, and never alone — no matter what challenge they face. TamTam combines AI-powered empathy with real human care to create something truly special.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
