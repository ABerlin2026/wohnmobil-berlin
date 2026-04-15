import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import TrustSection from "@/components/TrustSection";
import PricingSection from "@/components/PricingSection";
import TargetGroupSection from "@/components/TargetGroupSection";
import EquipmentSection from "@/components/EquipmentSection";
import GallerySection from "@/components/GallerySection";
import BeginnerSection from "@/components/BeginnerSection";
import VideoSection from "@/components/VideoSection";
import FAQSection from "@/components/FAQSection";
import ContactSection from "@/components/ContactSection";
import FinalCTASection from "@/components/FinalCTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <>
      <Navigation />
      <main>
        <HeroSection />
        <TrustSection />
        <PricingSection />
        <TargetGroupSection />
        <EquipmentSection />
        <GallerySection />
        <BeginnerSection />
        <VideoSection />
        <FAQSection />
        <ContactSection />
        <FinalCTASection />
      </main>
      <Footer />
    </>
  );
};

export default Index;
