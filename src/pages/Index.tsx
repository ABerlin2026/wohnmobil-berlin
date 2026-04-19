import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import TrustSection from "@/components/TrustSection";
import PricingSection from "@/components/PricingSection";
import TargetGroupSection from "@/components/TargetGroupSection";
import EventServiceSection from "@/components/EventServiceSection";
import HolidayHomeSection from "@/components/HolidayHomeSection";
import EquipmentSection from "@/components/EquipmentSection";
import VehicleSpecsSection from "@/components/VehicleSpecsSection";
import GallerySection from "@/components/GallerySection";
import BeginnerSection from "@/components/BeginnerSection";
import VideoSection from "@/components/VideoSection";
import FAQSection from "@/components/FAQSection";
import ContactSection from "@/components/ContactSection";
import FinalCTASection from "@/components/FinalCTASection";
import SunsetSection from "@/components/SunsetSection";
import ReviewsSection from "@/components/ReviewsSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <>
      <Navigation />
      <main>
        <HeroSection />
        <TrustSection />
        <PricingSection />
        <EventServiceSection />
        <HolidayHomeSection />
        <TargetGroupSection />
        <EquipmentSection />
        <VehicleSpecsSection />
        <GallerySection />
        <BeginnerSection />
        <VideoSection />
        <SunsetSection />
        <ReviewsSection />
        <ContactSection />
        <FAQSection />
        <FinalCTASection />
      </main>
      <Footer />
    </>
  );
};

export default Index;
