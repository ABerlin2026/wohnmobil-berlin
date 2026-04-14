import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Send, Zap, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const WHATSAPP_URL = "https://wa.me/491234567890?text=Hallo%2C%20ich%20interessiere%20mich%20f%C3%BCr%20den%20Camper%20Berlin%20Brandenburg.%20Ist%20das%20Wohnmobil%20im%20gew%C3%BCnschten%20Zeitraum%20verf%C3%BCgbar%3F";

const ContactSection = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: "", email: "", phone: "", period: "", persons: "", pet: "nein", message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Anfrage gesendet! 🎉",
      description: "Vielen Dank – wir melden uns schnellstmöglich bei dir.",
    });
    setForm({ name: "", email: "", phone: "", period: "", persons: "", pet: "nein", message: "" });
  };

  return (
    <section id="kontakt" className="section-padding bg-background">
      <div className="container-narrow">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-amber">Kontakt</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold mt-3 mb-4">
            Jetzt Camper in Berlin anfragen
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Unverbindliche Anfrage – Antwort schnell und persönlich.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* WhatsApp */}
          <div className="bg-popover rounded-2xl p-8 border border-border/50 flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 bg-whatsapp/10 rounded-xl flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-whatsapp" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg">Per WhatsApp</h3>
                <p className="text-xs text-muted-foreground">Schnellster Weg</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Zap className="h-4 w-4 text-amber shrink-0" /> Direkt und unkompliziert
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 text-amber shrink-0" /> Schnelle Rückmeldung
              </div>
            </div>

            <div className="bg-card rounded-xl p-4 text-sm text-muted-foreground italic mb-6 border border-border/30">
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
          <div className="bg-popover rounded-2xl p-8 border border-border/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 gradient-amber rounded-xl flex items-center justify-center">
                <Send className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg">Anfrageformular</h3>
                <p className="text-xs text-muted-foreground">Unverbindlich anfragen</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <Input placeholder="Name *" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-xl h-11" />
              <Input type="email" placeholder="E-Mail *" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="rounded-xl h-11" />
              <Input type="tel" placeholder="Telefonnummer" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="rounded-xl h-11" />
              <Input placeholder="Reisezeitraum (z. B. 15.07. – 25.07.)" value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} className="rounded-xl h-11" />
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="Personen" value={form.persons} onChange={(e) => setForm({ ...form, persons: e.target.value })} className="rounded-xl h-11" />
                <select
                  className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={form.pet}
                  onChange={(e) => setForm({ ...form, pet: e.target.value })}
                >
                  <option value="nein">Haustier: Nein</option>
                  <option value="ja">Haustier: Ja</option>
                </select>
              </div>
              <Textarea placeholder="Nachricht (optional)" rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="rounded-xl" />
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
