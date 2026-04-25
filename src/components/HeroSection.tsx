import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, ChevronDown } from "lucide-react";
import heroCamper from "@/assets/hero-camper.jpg";
import camperVideoMp4 from "@/assets/camper-hero-video-optimized.mp4";
import camperVideoHdMp4 from "@/assets/camper-hero-video-hd.mp4";
import camperVideoHdWebm from "@/assets/camper-hero-video-hd.webm";
import { useLanguage } from "@/i18n/LanguageContext";
import { WHATSAPP_URL } from "@/lib/contact";

const HeroSection = () => {
  const { t } = useLanguage();
  const [showPhoto, setShowPhoto] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const scrollToContact = () => {
    document.getElementById("kontakt")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleVideoEnded = useCallback(() => {
    setShowPhoto(true);
  }, []);

  // Force autoplay on mobile browsers that otherwise show a native play-button overlay.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.defaultMuted = true;
    video.play().catch(() => setShowPhoto(true));
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroCamper}
          alt={t.hero.imgAlt}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[2000ms] ease-in-out"
          style={{ opacity: showPhoto ? 1 : 0 }}
          width={1920}
          height={1080}
          fetchPriority="high"
        />
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          disablePictureInPicture
          disableRemotePlayback
          controls={false}
          preload="auto"
          poster={heroCamper}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[2000ms] ease-in-out pointer-events-none"
          style={{ opacity: showPhoto ? 0 : 1 }}
          onEnded={handleVideoEnded}
          width={1920}
          height={1080}
        >
          {/* HD WebM zuerst (kleinste Datei bei bester Qualität, moderne Browser) */}
          <source src={camperVideoHdWebm} type="video/webm" />
          {/* HD MP4 für Desktop & Safari */}
          <source src={camperVideoHdMp4} type="video/mp4" />
          {/* Fallback: stark komprimierte Mobile-Version */}
          <source src={camperVideoMp4} type="video/mp4" />
        </video>
        {/* Mehrschichtiges Overlay: dunkler Gradient + radialer Vignette-Effekt für maximalen Textkontrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/75" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.45)_0%,_rgba(0,0,0,0.7)_100%)]" />
      </div>

      <div className="relative z-10 container-narrow w-full section-padding pt-28 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <h1 className="text-3xl [@media(min-width:360px)]:text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white leading-[1.05] [text-shadow:_0_2px_12px_rgba(0,0,0,0.7)]">
            {t.hero.title}
          </h1>
          <p className="text-base [@media(min-width:360px)]:text-lg md:text-xl text-white/95 leading-relaxed max-w-2xl mx-auto [text-shadow:_0_2px_8px_rgba(0,0,0,0.8)]">
            {t.hero.subtitle}
          </p>

          <div className="flex flex-wrap justify-center gap-2 [@media(min-width:360px)]:gap-3 sm:gap-4 text-xs [@media(min-width:360px)]:text-sm">
            {t.hero.badges.map((item) => (
              <span key={item} className="border border-white/40 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1 [@media(min-width:360px)]:px-4 [@media(min-width:360px)]:py-1.5 text-white whitespace-nowrap [text-shadow:_0_1px_4px_rgba(0,0,0,0.6)]">
                {item}
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Button variant="hero" size="lg" onClick={scrollToContact} className="px-10 py-6">
              {t.hero.cta}
            </Button>
            <Button variant="whatsapp" size="lg" asChild className="px-10 py-6">
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-5 w-5" />
                WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </div>

      <button
        onClick={() => document.getElementById("vorteile")?.scrollIntoView({ behavior: "smooth" })}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-float text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronDown className="h-6 w-6" />
      </button>
    </section>
  );
};

export default HeroSection;
