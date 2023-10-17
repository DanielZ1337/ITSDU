import PlatformsSection from "@/src/components/front-page/platforms-section";
import FeaturesSection from "../components/front-page/features-section";
import HeroSection from "@/src/components/front-page/hero-section";
import PicturesSection from "../components/front-page/pictures-section";
import ImageUnderHero from "../components/front-page/image-under-hero";

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8 mt-32 md:mt-0">
      <HeroSection />
      <ImageUnderHero />
      <FeaturesSection />
      <PlatformsSection />
      <PicturesSection />
    </div>
  )
}
