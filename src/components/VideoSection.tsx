import { useState } from "react";
import { Play } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const VideoSection = () => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <section className="section-padding bg-surface-1">
      <div className="container-narrow">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <p className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-3">{t.video.label}</p>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-5">{t.video.title}</h2>
          <p className="text-muted-foreground leading-relaxed">{t.video.subtitle}</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 max-w-4xl mx-auto">
          {t.video.topics.map((topic) => (
            <button
              key={topic}
              type="button"
              onClick={() => setOpen(true)}
              className="group bg-surface-2 hover:bg-surface-3 rounded-lg p-5 border border-border/20 transition-all duration-300 text-left"
            >
              <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Play className="h-3.5 w-3.5 text-primary ml-0.5" />
              </div>
              <p className="text-sm font-medium text-foreground">{topic}</p>
            </button>
          ))}
        </div>

        <div className="mt-10 text-center bg-primary/10 border border-primary/20 rounded-xl px-6 py-5 max-w-2xl mx-auto">
          <p className="text-base md:text-lg font-display font-bold text-foreground">{t.video.notice}</p>
          <p className="text-sm text-muted-foreground mt-1">{t.video.noticeSubtitle}</p>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">{t.video.notice}</DialogTitle>
            <DialogDescription className="text-base leading-relaxed pt-2">
              {t.video.noticeSubtitle}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default VideoSection;
