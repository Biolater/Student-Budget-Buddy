import HeroSection from "../components/HeroSection/HeroSection";
import AboutSection from "../components/AboutSection/AboutSection";
import FeaturesSection from "../components/FeaturesSection/FeaturesSection";
import BenefitsSection from "../components/BenefitsSection/BenefitsSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <FeaturesSection />
      <BenefitsSection />
    </main>
  );
}
