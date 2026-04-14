import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Send, Phone, Mail } from "lucide-react";
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
      title: "Anfrage gesendet!",
      description: "Vielen Dank – wir melden uns schnellstmöglich bei dir.",
    });
    setForm({ name: "", email: "", phone: "", period: "", persons: "", pet: "nein", message: "" });
  };

  return (
    <section id="kontakt" className="section-padding bg-card">
      <div className="container-narrow">
        <h2 className="text-3xl md:text-4xl font-serif text-center mb-4">
          Jetzt Camper in Berlin anfragen
        </h2>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
          Unverbindliche Anfrage – Antwort schnell und persönlich. Wähle deinen bevorzugten Kontaktweg.
        </p>

        <div className="grid lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {/* WhatsApp */}
          <div className="bg-background rounded-xl p-8 border border-border flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 bg-whatsapp/10 rounded-full flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-whatsapp" />
              </div>
              <h3 className="font-serif text-xl">Per WhatsApp anfragen</h3>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              Der schnellste Weg: Schreib uns direkt per WhatsApp. Ideal für kurze Fragen zur Verfügbarkeit – unkompliziert und persönlich.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground mb-6">
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-petrol" /> Schnelle Antwort</li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-petrol" /> Unverbindlich</li>
            </ul>
            <div className="bg-secondary/50 rounded-lg p-4 text-sm text-muted-foreground italic mb-6">
              „Hallo, ich interessiere mich für den Camper Berlin Brandenburg. Ist das Wohnmobil im gewünschten Zeitraum verfügbar?"
            </div>
            <Button variant="whatsapp" size="lg" className="mt-auto py-5" asChild>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-5 w-5" />
                Jetzt direkt per WhatsApp anfragen
              </a>
            </Button>
          </div>

          {/* Formular */}
          <div className="bg-background rounded-xl p-8 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Send className="h-6 w-6 text-petrol" />
              </div>
              <h3 className="font-serif text-xl">Anfrageformular</h3>
            </div>
            <p className="text-muted-foreground text-sm mb-6">
              Füll das kurze Formular aus – wir melden uns persönlich bei dir.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Name *"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <Input
                type="email"
                placeholder="E-Mail *"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <Input
                type="tel"
                placeholder="Telefonnummer"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <Input
                placeholder="Reisezeitraum (z. B. 15.07. – 25.07.)"
                value={form.period}
                onChange={(e) => setForm({ ...form, period: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Anzahl Personen"
                  value={form.persons}
                  onChange={(e) => setForm({ ...form, persons: e.target.value })}
                />
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={form.pet}
                  onChange={(e) => setForm({ ...form, pet: e.target.value })}
                >
                  <option value="nein">Haustier: Nein</option>
                  <option value="ja">Haustier: Ja</option>
                </select>
              </div>
              <Textarea
                placeholder="Deine Nachricht (optional)"
                rows={3}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
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
