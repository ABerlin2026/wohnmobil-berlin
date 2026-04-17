import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageSEO from "@/components/PageSEO";

const Datenschutz = () => {
  return (
    <>
      <PageSEO
        title="Datenschutzerklärung | Camper Berlin Brandenburg"
        description="Datenschutzerklärung gemäß DSGVO für die Website von Camper Berlin Brandenburg – Wohnmobil mieten in Berlin und Brandenburg."
        canonical="https://camper-berlin-brandenburg.de/datenschutz"
        noindex
        breadcrumbs={[
          { name: "Startseite", url: "https://camper-berlin-brandenburg.de/" },
          { name: "Datenschutz", url: "https://camper-berlin-brandenburg.de/datenschutz" },
        ]}
      />
      <Navigation />
      <main className="section-padding bg-background min-h-screen pt-32">
        <div className="container-narrow max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-10">Datenschutzerklärung</h1>

          <div className="space-y-8 text-sm leading-relaxed text-secondary-foreground">
            <section>
              <h2 className="font-display font-semibold text-foreground text-base mb-2">1. Verantwortlicher</h2>
              <p>Verantwortlich für die Datenverarbeitung auf dieser Website ist:</p>
              <p className="mt-2">[Firmenname / Name]<br />[Straße + Hausnummer]<br />[PLZ, Ort]<br />Telefon: [Telefonnummer]<br />E-Mail: [E-Mail-Adresse]</p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-foreground text-base mb-2">2. Allgemeine Hinweise zur Datenverarbeitung</h2>
              <p>Wir verarbeiten personenbezogene Daten ausschließlich im Rahmen der gesetzlichen Bestimmungen der Datenschutz-Grundverordnung (DSGVO).</p>
              <p className="mt-2">Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.</p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-foreground text-base mb-2">3. Datenerfassung auf dieser Website</h2>
              <h3 className="font-display font-semibold text-foreground text-sm mb-2 mt-4">3.1 Server-Log-Dateien</h3>
              <p>Beim Aufruf unserer Website werden automatisch Informationen durch den Hosting-Anbieter erfasst und in sogenannten Server-Log-Dateien gespeichert. Dies sind insbesondere:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Browsertyp und Browserversion</li>
                <li>verwendetes Betriebssystem</li>
                <li>Referrer URL</li>
                <li>Hostname des zugreifenden Rechners</li>
                <li>Uhrzeit der Serveranfrage</li>
                <li>IP-Adresse</li>
              </ul>
              <p className="mt-2">Diese Daten werden nicht mit anderen Datenquellen zusammengeführt.</p>
              <p className="mt-2">Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an stabiler und sicherer Bereitstellung der Website)</p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-foreground text-base mb-2">4. Kontaktformular</h2>
              <p>Wenn Sie uns über das Kontaktformular Anfragen zur Anmietung eines Wohnmobils senden, werden Ihre Angaben aus dem Formular inklusive der von Ihnen dort angegebenen Kontaktdaten gespeichert und verarbeitet.</p>
              <p className="mt-3 font-medium text-foreground">Verarbeitete Daten:</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Name</li>
                <li>E-Mail-Adresse</li>
                <li>Telefonnummer (optional)</li>
                <li>gewünschter Mietzeitraum</li>
                <li>Nachrichteninhalt</li>
              </ul>
              <p className="mt-3 font-medium text-foreground">Zweck der Verarbeitung:</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Bearbeitung Ihrer Anfrage</li>
                <li>Erstellung eines Angebots</li>
                <li>Vorbereitung eines Mietvertrags</li>
                <li>Kommunikation im Rahmen der Vermietung</li>
              </ul>
              <p className="mt-3">Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche Maßnahmen)</p>
              <p className="mt-2">Speicherdauer: Ihre Daten werden gelöscht, sobald Ihre Anfrage abschließend bearbeitet wurde, sofern keine gesetzlichen Aufbewahrungspflichten bestehen.</p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-foreground text-base mb-2">5. Kontaktaufnahme über WhatsApp</h2>
              <p>Wir bieten Ihnen die Möglichkeit, über den Dienst WhatsApp Kontakt mit uns aufzunehmen.</p>
              <p className="mt-2">Anbieter ist die Meta Platforms Ireland Limited.</p>
              <p className="mt-2">Wenn Sie WhatsApp nutzen, werden Daten (insbesondere Ihre Telefonnummer und Kommunikationsinhalte) an WhatsApp übermittelt.</p>
              <p className="mt-2">Wir weisen darauf hin, dass WhatsApp Zugriff auf Metadaten (z.&nbsp;B. Kommunikationszeitpunkte) erhält.</p>
              <p className="mt-2">Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung durch Nutzung)</p>
              <p className="mt-2">Weitere Informationen: <a href="https://www.whatsapp.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">whatsapp.com/legal/privacy-policy</a></p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-foreground text-base mb-2">6. Kontaktaufnahme über Telegram</h2>
              <p>Wir bieten Ihnen die Möglichkeit, über den Messenger-Dienst Telegram Kontakt mit uns aufzunehmen.</p>
              <p className="mt-2">Anbieter ist die Telegram FZ-LLC.</p>
              <p className="mt-2">Bei Nutzung von Telegram werden personenbezogene Daten (z.&nbsp;B. Benutzername, Nachrichteninhalte) an Telegram übermittelt.</p>
              <p className="mt-2">Wir haben keinen Einfluss auf die Datenverarbeitung durch Telegram.</p>
              <p className="mt-2">Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung durch Nutzung)</p>
              <p className="mt-2">Weitere Informationen: <a href="https://telegram.org/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">telegram.org/privacy</a></p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-foreground text-base mb-2">7. Hosting</h2>
              <p>Diese Website wird bei einem externen Dienstleister gehostet.</p>
              <p className="mt-2">Der Hosting-Anbieter verarbeitet personenbezogene Daten (z.&nbsp;B. IP-Adressen) zum Zweck der Bereitstellung der Website.</p>
              <p className="mt-2">Mit dem Anbieter besteht ein Vertrag zur Auftragsverarbeitung gemäß Art. 28 DSGVO.</p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-foreground text-base mb-2">8. SSL- bzw. TLS-Verschlüsselung</h2>
              <p>Diese Seite nutzt aus Sicherheitsgründen eine SSL- bzw. TLS-Verschlüsselung.</p>
              <p className="mt-2">Eine verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile des Browsers mit „https://" beginnt.</p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-foreground text-base mb-2">9. Ihre Rechte</h2>
              <p>Sie haben jederzeit folgende Rechte:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Auskunft (Art. 15 DSGVO)</li>
                <li>Berichtigung (Art. 16 DSGVO)</li>
                <li>Löschung (Art. 17 DSGVO)</li>
                <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
                <li>Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
                <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display font-semibold text-foreground text-base mb-2">10. Widerruf Ihrer Einwilligung</h2>
              <p>Sie können eine bereits erteilte Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen.</p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-foreground text-base mb-2">11. Beschwerderecht</h2>
              <p>Sie haben das Recht, sich bei einer Datenschutzaufsichtsbehörde zu beschweren.</p>
              <p className="mt-2">Zuständig ist z.&nbsp;B.:</p>
              <p className="mt-2">Berliner Beauftragte für Datenschutz und Informationsfreiheit<br />Alt-Moabit 59–61<br />10555 Berlin</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Datenschutz;
