import { useState } from "react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MessageCircle, Send, Zap, Clock, CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const WHATSAPP_URL = "https://wa.me/491234567890?text=Hallo%2C%20ich%20interessiere%20mich%20f%C3%BCr%20den%20Camper%20Berlin%20Brandenburg.%20Ist%20das%20Wohnmobil%20im%20gew%C3%BCnschten%20Zeitraum%20verf%C3%BCgbar%3F";

const ContactSection = () => {
  const { toast } = useToast();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [form, setForm] = useState({
    name: "", email: "", phone: "", persons: "", pet: "nein", message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Anfrage gesendet!", description: "Wir melden uns schnellstmöglich bei dir." });
    setForm({ name: "", email: "", phone: "", persons: "", pet: "nein", message: "" });
    setStartDate(undefined);
    setEndDate(undefined);
  };

  return (
    <section id="kontakt" className="section-padding bg-background">
      <div className="container-narrow">
        <div className="text-center mb-16">
          <p className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-3">Kontakt</p>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            Jetzt Camper anfragen
          </h2>
          <p className="text-muted-foreground">Unverbindlich – Antwort schnell und persönlich.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* WhatsApp */}
          <div className="bg-surface-1 rounded-xl p-8 border border-border/20 flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 bg-whatsapp/10 rounded-lg flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-whatsapp" />
              </div>
              <div>
                <h3 className="font-display font-bold text-sm">Per WhatsApp</h3>
                <p className="text-xs text-muted-foreground">Schnellster Weg</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Zap className="h-4 w-4 text-primary shrink-0" /> Direkt und unkompliziert
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 text-primary shrink-0" /> Schnelle Rückmeldung
              </div>
            </div>

            <div className="bg-surface-2 rounded-lg p-4 text-sm text-muted-foreground italic mb-6 border border-border/10">
              „Hallo, ich interessiere mich für den Camper Berlin Brandenburg. Ist das Wohnmobil im gewünschten Zeitraum verfügbar?"
            </div>

            <Button variant="whatsapp" size="lg" className="mt-auto py-5" asChild>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-5 w-5" />
                Jetzt per WhatsApp anfragen
              </a>
            </Button>
          </div>

          {/* Formular */}
          <div className="bg-surface-1 rounded-xl p-8 border border-border/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Send className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-bold text-sm">Anfrageformular</h3>
                <p className="text-xs text-muted-foreground">Unverbindlich anfragen</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <Input placeholder="Name *" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-surface-2 border-border/20 rounded-lg h-11" />
              <Input type="email" placeholder="E-Mail *" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="bg-surface-2 border-border/20 rounded-lg h-11" />
              <Input type="tel" placeholder="Telefonnummer" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="bg-surface-2 border-border/20 rounded-lg h-11" />
              <div className="grid grid-cols-2 gap-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("bg-surface-2 border-border/20 rounded-lg h-11 justify-start text-left font-normal", !startDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "dd.MM.yyyy", { locale: de }) : "Startdatum"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={startDate} onSelect={setStartDate} disabled={(date) => date < new Date()} initialFocus className="p-3 pointer-events-auto" />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("bg-surface-2 border-border/20 rounded-lg h-11 justify-start text-left font-normal", !endDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "dd.MM.yyyy", { locale: de }) : "Enddatum"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={endDate} onSelect={setEndDate} disabled={(date) => date < (startDate || new Date())} initialFocus className="p-3 pointer-events-auto" />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="Personenanzahl" value={form.persons} onChange={(e) => setForm({ ...form, persons: e.target.value })} className="bg-surface-2 border-border/20 rounded-lg h-11" />
                <select
                  className="flex h-11 w-full rounded-lg border border-border/20 bg-surface-2 px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={form.pet}
                  onChange={(e) => setForm({ ...form, pet: e.target.value })}
                >
                  <option value="nein">Haustier: Nein</option>
                  <option value="ja">Haustier: Ja</option>
                </select>
              </div>
              <Textarea placeholder="Nachricht (optional)" rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="bg-surface-2 border-border/20 rounded-lg" />
              <Button variant="hero" size="lg" type="submit" className="w-full py-5">
                Unverbindlich anfragen
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
