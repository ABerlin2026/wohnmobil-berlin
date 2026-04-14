import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Was kostet es, ein Wohnmobil in Berlin Brandenburg zu mieten?",
    a: "In der Nebensaison (Oktober – April) kostet der Camper 119 € pro Tag, in der Hauptsaison (1. Mai – 30. September) 129 € pro Tag. Im Preis sind 150 Freikilometer pro Tag und eine Vollkasko-Versicherung bereits enthalten. Es gibt keine versteckten Zusatzkosten für die Versicherung.",
  },
  {
    q: "Wie viele Kilometer sind pro Tag inklusive?",
    a: "Pro Miettag sind 150 Kilometer inklusive. Damit kannst du entspannt Tagesausflüge planen, ohne dir Gedanken über Zusatzkosten machen zu müssen.",
  },
  {
    q: "Was kostet jeder weitere Kilometer?",
    a: "Jeder Kilometer über das Freikilometer-Kontingent hinaus wird mit 0,35 € berechnet.",
  },
  {
    q: "Ist eine Vollkasko-Versicherung enthalten?",
    a: "Ja, eine Vollkasko-Versicherung ist im Mietpreis enthalten. Du musst keine zusätzliche Versicherung abschließen.",
  },
  {
    q: "Wer darf das Wohnmobil fahren?",
    a: "Das Wohnmobil darf von Personen ab 30 Jahren mit einem gültigen Führerschein der Klasse B gefahren werden.",
  },
  {
    q: "Reicht ein PKW-Führerschein?",
    a: "Ja, ein Führerschein der Klasse B ist ausreichend. Das Fahrzeug wiegt unter 3,5 Tonnen und darf damit mit dem regulären PKW-Führerschein gefahren werden.",
  },
  {
    q: "Wie viele Personen können mitfahren und schlafen?",
    a: "Das Wohnmobil bietet 4 Sitzplätze mit Gurt und 4 Schlafplätze. Es ist ideal für Paare, kleine Familien oder Freundesgruppen.",
  },
  {
    q: "Sind Haustiere erlaubt?",
    a: "Ja, Haustiere sind willkommen. Dein Hund darf dich auf deiner Reise begleiten.",
  },
  {
    q: "Wo erfolgt die Abholung?",
    a: "Die Abholung erfolgt in 13127 Berlin Buchholz. Du startest deinen Roadtrip direkt aus dem Berliner Norden.",
  },
  {
    q: "Darf ich mit dem Wohnmobil ins Ausland fahren?",
    a: "Ja, Auslandsfahrten sind erlaubt. Du kannst mit dem Camper ganz Europa erkunden.",
  },
  {
    q: "Gibt es Zusatzkosten?",
    a: "Der Mietpreis enthält bereits die Vollkasko-Versicherung und 150 Freikilometer pro Tag. Zusätzliche Kosten können für Mehrkilometer (0,35 €/km), nicht gereinigte Rückgabe (200 €) oder optionale Extras wie den Gasgrill (40 €) oder E-Scooter (75 €) anfallen.",
  },
  {
    q: "Was passiert, wenn das Fahrzeug nicht gereinigt zurückgegeben wird?",
    a: "Wird das Fahrzeug nicht innen und außen gereinigt zurückgegeben, fällt eine Reinigungsgebühr von 200 € an. Bei sauberer Rückgabe entstehen keine zusätzlichen Kosten. Grauwasser und Toilette müssen ebenfalls entleert werden.",
  },
  {
    q: "Muss Grauwasser und Toilette entleert werden?",
    a: "Ja, Grauwasser und Toilette müssen bei der Rückgabe entleert sein. Das gehört zur regulären Rückgabe dazu und wird bei der Einweisung erklärt.",
  },
  {
    q: "Welche Extras kann ich hinzubuchen?",
    a: "Du kannst einen Gasgrill (einmalig 40 €) und einen E-Scooter (einmalig 75 €) hinzubuchen – ideal für noch mehr Flexibilität am Stellplatz.",
  },
  {
    q: "Ist Bettwäsche enthalten?",
    a: "Nein, Bettwäsche ist nicht im Mietpreis enthalten. Bitte bring eigene Bettwäsche oder Schlafsäcke mit.",
  },
  {
    q: "Ist das Fahrzeug für Einsteiger geeignet?",
    a: "Absolut. Viele unserer Mieter fahren zum ersten Mal ein Wohnmobil. Du erhältst eine persönliche Einweisung und Erklärvideos zu allen wichtigen Funktionen – damit du entspannt losfahren kannst.",
  },
  {
    q: "Gibt es Hilfe bei der Nutzung des Fahrzeugs?",
    a: "Ja, bei der Übergabe bekommst du eine ausführliche Einweisung. Zusätzlich stehen dir Erklärvideos zur Verfügung, die du jederzeit unterwegs abrufen kannst.",
  },
  {
    q: "Gibt es Videos zur Erklärung der einzelnen Funktionen?",
    a: "Ja, wir stellen dir Erklärvideos zu allen wichtigen Themen bereit – von der Markise über den Herd bis zur Grauwasser-Entsorgung. So kannst du alles in Ruhe nachschauen.",
  },
  {
    q: "Sind Festivals erlaubt?",
    a: "Nein, Fahrten zu Festivals sind leider nicht gestattet.",
  },
  {
    q: "Ist Rauchen im Fahrzeug erlaubt?",
    a: "Nein, Rauchen im Fahrzeug ist nicht gestattet.",
  },
];

const FAQSection = () => {
  return (
    <section id="faq" className="section-padding bg-background">
      <div className="container-narrow max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-serif text-center mb-4">
          Häufige Fragen zum Wohnmobil mieten in Berlin
        </h2>
        <p className="text-center text-muted-foreground mb-12">
          Hier findest du Antworten auf die wichtigsten Fragen rund um unsere Wohnmobilvermietung in Berlin Brandenburg.
        </p>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="bg-card rounded-lg border border-border px-6"
            >
              <AccordionTrigger className="text-left text-sm font-medium py-5 hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
