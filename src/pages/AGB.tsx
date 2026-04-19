import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageSEO from "@/components/PageSEO";

const Section = ({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: React.ReactNode;
}) => (
  <section id={id} className="space-y-3 scroll-mt-28">
    <h3 className="font-display font-semibold text-foreground text-base md:text-lg">{title}</h3>
    <div className="space-y-3 text-secondary-foreground">{children}</div>
  </section>
);

const Part = ({
  id,
  label,
  title,
  children,
}: {
  id: string;
  label: string;
  title: string;
  children: React.ReactNode;
}) => (
  <section id={id} className="space-y-6 scroll-mt-28 pt-4">
    <div className="border-l-4 border-primary pl-4">
      <p className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-1">{label}</p>
      <h2 className="text-xl md:text-2xl font-display font-bold text-foreground">{title}</h2>
    </div>
    {children}
  </section>
);

const AGB = () => {
  return (
    <>
      <PageSEO
        title="AGB | Camper Berlin Brandenburg"
        description="Allgemeine Geschäftsbedingungen für Wohnmobil-Vermietung, Ferienunterkunft und Event-Service von Camper Berlin Brandenburg."
        canonical="https://camper-berlin-brandenburg.de/agb"
        breadcrumbs={[
          { name: "Startseite", url: "https://camper-berlin-brandenburg.de/" },
          { name: "AGB", url: "https://camper-berlin-brandenburg.de/agb" },
        ]}
      />
      <Navigation />
      <main className="section-padding bg-background min-h-screen pt-32">
        <div className="container-narrow max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">
            Allgemeine Geschäftsbedingungen
          </h1>
          <p className="text-sm text-muted-foreground mb-2">
            Camper Berlin Brandenburg – Wohnmobilvermietung, Ferienunterkunft & Event-Service
          </p>
          <p className="text-sm text-muted-foreground mb-10">
            Stand: {new Date().toLocaleDateString("de-DE", { month: "long", year: "numeric" })}
          </p>

          {/* Inhaltsverzeichnis */}
          <nav
            aria-label="Inhaltsverzeichnis"
            className="mb-12 bg-surface-1 border border-border/30 rounded-xl p-5 sm:p-6"
          >
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground mb-4">
              Inhalt
            </p>
            <ol className="space-y-2 text-sm">
              <li>
                <a href="#teil-a" className="text-foreground hover:text-primary transition-colors">
                  <span className="text-primary font-semibold">A.</span> Allgemeine Bestimmungen
                </a>
              </li>
              <li>
                <a href="#teil-b" className="text-foreground hover:text-primary transition-colors">
                  <span className="text-primary font-semibold">B.</span> Besondere Bedingungen –
                  Wohnmobil-Vermietung
                </a>
              </li>
              <li>
                <a href="#teil-c" className="text-foreground hover:text-primary transition-colors">
                  <span className="text-primary font-semibold">C.</span> Besondere Bedingungen –
                  Ferienunterkunft (stationäre Nutzung)
                </a>
              </li>
              <li>
                <a href="#teil-d" className="text-foreground hover:text-primary transition-colors">
                  <span className="text-primary font-semibold">D.</span> Besondere Bedingungen –
                  Event-Service
                </a>
              </li>
            </ol>
          </nav>

          <div className="space-y-12 text-sm leading-relaxed">
            <p className="font-medium text-foreground bg-surface-1 border border-border/30 rounded-lg p-4">
              Mehrere Mieter bzw. Gäste bilden eine Mieter- bzw. Gästegemeinschaft. Jede Person hat
              identische Rechte und Pflichten und haftet gesamtschuldnerisch.
            </p>

            {/* ============================================================
                TEIL A – ALLGEMEINES
                ============================================================ */}
            <Part id="teil-a" label="Teil A" title="Allgemeine Bestimmungen">
              <Section id="a-1" title="1. Geltungsbereich">
                <p>
                  Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für sämtliche Verträge
                  zwischen Camper Berlin Brandenburg (nachfolgend „Vermieter") und dem Kunden
                  (nachfolgend „Mieter" bzw. „Gast") über die Vermietung des Wohnmobils zu
                  Reisezwecken (Teil B), die Nutzung des Wohnmobils als stationäre Ferienunterkunft
                  (Teil C) sowie die Nutzung im Rahmen von Event-Dienstleistungen (Teil D).
                </p>
                <p>
                  Abweichende, entgegenstehende oder ergänzende Bedingungen des Mieters werden nur
                  Vertragsbestandteil, wenn der Vermieter ihrer Geltung ausdrücklich schriftlich
                  zustimmt.
                </p>
              </Section>

              <Section id="a-2" title="2. Vertragsabschluss">
                <p>
                  Die Darstellung der Leistungen auf der Webseite stellt kein bindendes Angebot dar.
                  Eine Anfrage des Mieters ist eine Aufforderung zur Abgabe eines Angebots. Der
                  Vertrag kommt erst mit ausdrücklicher Buchungsbestätigung des Vermieters in
                  Textform (E-Mail) und – bei Wohnmobil-Vermietung – durch beiderseitige
                  Unterzeichnung des Mietvertrages zustande.
                </p>
                <p>
                  Mündliche Absprachen sind ohne schriftliche Bestätigung unwirksam. Eine
                  Übertragung der Vertragsrechte auf Dritte ist nur mit vorheriger schriftlicher
                  Zustimmung des Vermieters zulässig.
                </p>
              </Section>

              <Section id="a-3" title="3. Preise, Zahlung & Kaution">
                <p>
                  Es gelten die zum Zeitpunkt der Buchung auf der Webseite ausgewiesenen Preise.
                  Sofern nicht anders angegeben, verstehen sich alle Preise in Euro inklusive der
                  gesetzlichen Mehrwertsteuer.
                </p>
                <p>
                  Sofern nicht anders vereinbart, ist eine Anzahlung in Höhe von 30 % des
                  Gesamtpreises innerhalb von 7 Tagen nach Buchungsbestätigung fällig. Der
                  Restbetrag ist spätestens 14 Tage vor Mietbeginn bzw. Anreise zu zahlen. Bei
                  kurzfristigen Buchungen (weniger als 14 Tage vor Beginn) ist der Gesamtbetrag
                  sofort fällig.
                </p>
                <p>
                  Der Vermieter ist berechtigt, vor Übergabe eine Kaution zu verlangen. Diese
                  beträgt:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>Wohnmobil-Vermietung:</strong> 1.500 € (per Überweisung oder bar nach Absprache)</li>
                  <li><strong>Ferienunterkunft & Event-Service:</strong> 200–500 € je nach Buchungsumfang</li>
                </ul>
                <p>
                  Die Kaution wird nach mängelfreier Rückgabe innerhalb von 14 Tagen
                  zurückerstattet.
                </p>
              </Section>

              <Section id="a-3b" title="4. Saison & Verfügbarkeit">
                <p>
                  Die Vermietung des Wohnmobils erfolgt saisonal von <strong>April bis Oktober</strong>.
                  In den Monaten November bis März steht das Fahrzeug nicht zur Verfügung.
                </p>
                <p>Es gelten folgende Saisonpreise pro Tag für die Wohnmobil-Vermietung:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>Hauptsaison (1. Mai – 30. September):</strong> 129 €/Tag</li>
                  <li><strong>Nebensaison (April & Oktober):</strong> 119 €/Tag</li>
                </ul>
              </Section>

              <Section id="a-4" title="4. Widerrufsrecht">
                <p>
                  Bei Verträgen über die Vermietung von Wohnmobilen, Ferienunterkünften sowie
                  Dienstleistungen im Bereich Beherbergung und Freizeitveranstaltungen, die zu einem
                  bestimmten Zeitpunkt oder für einen bestimmten Zeitraum erbracht werden, besteht
                  gemäß § 312g Abs. 2 Nr. 9 BGB <strong>kein gesetzliches Widerrufsrecht</strong>.
                  Es gelten ausschließlich die in den jeweiligen Teilen B, C und D geregelten
                  Stornobedingungen.
                </p>
              </Section>

              <Section id="a-5" title="5. Haftung des Vermieters">
                <p>
                  Der Vermieter haftet uneingeschränkt für Vorsatz und grobe Fahrlässigkeit sowie
                  bei Verletzung von Leben, Körper oder Gesundheit. Bei leichter Fahrlässigkeit
                  haftet der Vermieter nur bei Verletzung wesentlicher Vertragspflichten
                  (Kardinalpflichten); die Haftung ist in diesem Fall auf den vertragstypischen,
                  vorhersehbaren Schaden begrenzt.
                </p>
                <p>
                  Eine verschuldensunabhängige Haftung sowie die Haftung für mittelbare Schäden,
                  entgangenen Gewinn oder ausgefallene Urlaubsfreuden ist – soweit gesetzlich
                  zulässig – ausgeschlossen.
                </p>
                <p>
                  Der Vermieter haftet nicht für vom Mieter eingebrachte Gegenstände (z. B. Gepäck,
                  Wertsachen, Foto- und Videoausrüstung, Fahrräder). Dem Mieter wird der Abschluss
                  einer eigenen Reise- bzw. Hausratversicherung empfohlen.
                </p>
              </Section>

              <Section id="a-6" title="6. Höhere Gewalt">
                <p>
                  Wird die Erfüllung des Vertrages durch höhere Gewalt (z. B. Naturereignisse,
                  Pandemie, behördliche Anordnungen, Krieg) unmöglich oder erheblich erschwert,
                  sind beide Parteien berechtigt, den Vertrag zu kündigen. Bereits geleistete
                  Zahlungen werden – abzüglich nachweisbar entstandener Aufwendungen des Vermieters
                  – zurückerstattet. Schadensersatzansprüche sind in diesem Fall ausgeschlossen.
                </p>
              </Section>

              <Section id="a-7" title="7. Datenschutz">
                <p>
                  Die Erhebung und Verarbeitung personenbezogener Daten erfolgt ausschließlich zur
                  Vertragsabwicklung gemäß DSGVO. Einzelheiten ergeben sich aus unserer{" "}
                  <a href="/datenschutz" className="text-primary hover:underline">
                    Datenschutzerklärung
                  </a>
                  .
                </p>
              </Section>

              <Section id="a-8" title="8. Rechtswahl, Gerichtsstand & Schlussbestimmungen">
                <p>
                  Es gilt ausschließlich das Recht der Bundesrepublik Deutschland unter Ausschluss
                  des UN-Kaufrechts. Gerichtsstand ist – soweit gesetzlich zulässig – der Sitz des
                  Vermieters.
                </p>
                <p>
                  Sollte eine Bestimmung dieser AGB unwirksam sein oder werden, bleibt die
                  Wirksamkeit der übrigen Bestimmungen unberührt. An Stelle der unwirksamen
                  Regelung tritt die entsprechende gesetzliche Vorschrift.
                </p>
                <p>
                  Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS)
                  bereit:{" "}
                  <a
                    href="https://ec.europa.eu/consumers/odr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    https://ec.europa.eu/consumers/odr
                  </a>
                  . Der Vermieter ist nicht verpflichtet und nicht bereit, an einem
                  Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
                </p>
              </Section>
            </Part>

            {/* ============================================================
                TEIL B – WOHNMOBIL-VERMIETUNG
                ============================================================ */}
            <Part id="teil-b" label="Teil B" title="Besondere Bedingungen – Wohnmobil-Vermietung">
              <Section id="b-1" title="1. Mietzeit, Mindestmietdauer, Übergabe & Rückgabe">
                <p>
                  Die <strong>Mindestmietdauer beträgt 5 Tage</strong> (Anreise- und Abreisetag
                  inklusive). Die Mietzeit beginnt und endet zu den im Mietvertrag vereinbarten
                  Terminen. Übergabe und Rückgabe erfolgen in der Regel am Standort des Vermieters
                  in Berlin/Brandenburg.
                </p>
                <p>
                  Sofern Abholung durch den Vermieter vereinbart ist, ist das Fahrzeug zum
                  vereinbarten Zeitpunkt am vereinbarten Ort vollgetankt und in vertragsgemäßem
                  Zustand bereitzustellen.
                </p>
                <p>
                  Das Mietverhältnis verlängert sich nicht automatisch. Bei verspäteter Rückgabe
                  kann der Vermieter eine Nutzungsentschädigung gemäß § 546a BGB sowie einen
                  Aufschlag von 50 € je angefangener Stunde verlangen, mindestens jedoch den
                  Tagesmietpreis je angefangenem Tag. Folgeschäden (z. B. ausgefallene
                  Anschlussvermietungen) trägt der Mieter zusätzlich.
                </p>
              </Section>

              <Section id="b-2" title="2. Personenanzahl">
                <p>
                  Das Wohnmobil verfügt über <strong>4 zugelassene Schlaf- und Sitzplätze</strong>
                  (alle gurtgesichert). Die Mitnahme weiterer Personen ist nicht gestattet.
                </p>
              </Section>

              <Section id="b-3" title="3. Stornierung Wohnmobil">
                <p>
                  Tritt der Mieter vom Vertrag zurück, gelten – sofern keine kostenfreie Umbuchung
                  oder Ersatzmiete möglich ist – folgende pauschale Stornogebühren auf den
                  Gesamtmietpreis:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>bis 60 Tage vor Mietbeginn: 20 %</li>
                  <li>59 bis 30 Tage vor Mietbeginn: 50 %</li>
                  <li>29 bis 7 Tage vor Mietbeginn: 80 %</li>
                  <li>weniger als 7 Tage vor Mietbeginn oder Nichtantritt: 95 %</li>
                </ul>
                <p>
                  Dem Mieter bleibt der Nachweis vorbehalten, dass dem Vermieter kein oder ein
                  geringerer Schaden entstanden ist. Der Abschluss einer Reiserücktrittsversicherung
                  wird ausdrücklich empfohlen.
                </p>
              </Section>

              <Section id="b-4" title="4. Auslandsfahrten & Nutzungsverbote">
                <p>
                  Auslandsfahrten sind ausschließlich in folgende Länder gestattet, da nur dort
                  Versicherungsschutz (insbesondere Vollkasko) besteht:
                </p>
                <p className="bg-surface-1 border border-border/30 rounded-md p-3 text-sm">
                  Deutschland, Niederlande, Dänemark, Schweden, Norwegen, Finnland, Polen,
                  Tschechien, Österreich, Schweiz, Ungarn, Slowenien, Kroatien und Slowakei.
                </p>
                <p>
                  Fahrten in andere Länder – insbesondere Belgien, Luxemburg, Frankreich, Italien,
                  die baltischen Staaten (Litauen, Lettland, Estland), das Vereinigte Königreich,
                  Irland, der Balkan (Serbien, Bosnien, Montenegro, Nordmazedonien, Albanien),
                  Rumänien, Bulgarien, Belarus, Ukraine und Moldau – sind <strong>nicht
                  versichert und nicht gestattet</strong>.
                </p>
                <p>Vom Vermieter generell nicht gestattet ist die Nutzung des Fahrzeugs zu folgenden Zwecken:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Teilnahme an Wettrennen, Fahrertraining, Geländefahrten und ähnlichen Nutzungen.</li>
                  <li>Beförderung von leicht entzündlichen, giftigen oder sonst gefährlichen Stoffen.</li>
                  <li>
                    Jegliche Verwendung im Zusammenhang mit der Begehung von Straftaten oder Zoll-
                    und Steuervergehen, insbesondere dem Transport von Stoffen, die unter das
                    Betäubungsmittelgesetz fallen.
                  </li>
                  <li>Gewerbliche Personenbeförderung.</li>
                </ul>
                <p>
                  Das Fahrzeug darf nur von den im Mietvertrag namentlich benannten Fahrern mit
                  gültiger, in Deutschland anerkannter Fahrerlaubnis geführt werden. Die Nutzung
                  unter Einfluss von Alkohol, Medikamenten oder anderen berauschenden Mitteln ist
                  untersagt.
                </p>
                <p>
                  <strong>Rauchen</strong> im Fahrzeug ist nicht gestattet. Bei Zuwiderhandlung
                  wird eine Reinigungspauschale von mindestens 200 € erhoben.
                </p>
                <p>
                  <strong>Haustiere (insbesondere Hunde) sind willkommen</strong> und ohne Aufpreis
                  erlaubt. Der Mieter ist verpflichtet, etwaige durch das Tier verursachte
                  Verschmutzungen oder Schäden vor Rückgabe zu beseitigen bzw. zu ersetzen.
                </p>
              </Section>

              <Section id="b-5" title="5. Freikilometer & Mehrkilometer">
                <p>
                  Im Mietpreis enthalten sind <strong>150 Freikilometer pro Mietttag</strong>.
                  Mehrkilometer werden mit <strong>0,35 € pro Kilometer</strong> berechnet und
                  bei Rückgabe abgerechnet.
                </p>
              </Section>

              <Section id="b-6" title="6. Endreinigung">
                <p>
                  Das Wohnmobil ist innen und außen <strong>gereinigt zurückzugeben</strong>.
                  Grauwasser- und Toilettentank müssen in jedem Fall entleert werden – dies ist
                  Bestandteil der regulären Rückgabe und wird bei der Übergabe erklärt.
                </p>
                <p>
                  Wer die Reinigung nicht selbst übernehmen möchte, kann die{" "}
                  <strong>Innen- und Außenreinigungs-Pauschale in Höhe von 200 €</strong> direkt
                  bei der Buchung hinzufügen. Wird das Fahrzeug ohne diese Pauschale ungereinigt
                  zurückgegeben, wird die Reinigung mit ebenfalls 200 € in Rechnung gestellt;
                  bei besonders starker Verschmutzung kann ein zusätzlicher Aufwand mit 45 € netto
                  je Stunde berechnet werden.
                </p>
              </Section>

              <Section id="b-7" title="7. Optionale Extras">
                <p>Folgende Extras können bei Buchung hinzugefügt werden:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Bettwäsche: 10 € pro Person (max. 4 Personen)</li>
                  <li>Handtuch-Set: 20 € pro Buchung</li>
                  <li>Gasgrill: 40 € pro Buchung</li>
                  <li>E-Scooter: 75 € pro Stück (max. 3)</li>
                  <li>Innen- und Außenreinigung: 200 € pro Buchung</li>
                </ul>
                <p>
                  Die jeweils gültigen Preise und Verfügbarkeiten ergeben sich aus dem
                  Buchungsformular auf der Webseite.
                </p>
              </Section>

              <Section id="b-8" title="8. Kraftstoffe, Öle, Kleinreparaturen">
                <p>
                  Der während der Mietdauer verbrauchte Kraftstoff, AdBlue, Motoröl, Gas und andere
                  Hilfs- und Betriebsstoffe sind vom Mieter auf eigene Kosten zu beschaffen. Das
                  Fahrzeug ist vollgetankt zurückzugeben; andernfalls wird der fehlende Kraftstoff
                  zuzüglich einer Servicepauschale von 25 € berechnet.
                </p>
                <p>
                  Kleine Instandsetzungen (z. B. Austausch von Glühbirnen) kann der Mieter bis zur
                  Höhe von 150 € je Einzelfall ohne vorherige Absprache durch eine Fachwerkstatt
                  ausführen lassen. Der Vermieter erstattet die Kosten gegen Vorlage des
                  Originalrechnungsbeleges und des ausgetauschten Teils. Eigenleistungen des
                  Mieters werden nicht vergütet.
                </p>
              </Section>

              <Section id="b-4" title="4. Kraftstoffe, Öle, Kleinreparaturen">
                <p>
                  Der während der Mietdauer verbrauchte Kraftstoff, AdBlue, Motoröl, Gas und andere
                  Hilfs- und Betriebsstoffe sind vom Mieter auf eigene Kosten zu beschaffen. Das
                  Fahrzeug ist vollgetankt zurückzugeben; andernfalls wird der fehlende Kraftstoff
                  zuzüglich einer Servicepauschale von 25 € berechnet.
                </p>
                <p>
                  Kleine Instandsetzungen (z. B. Austausch von Glühbirnen) kann der Mieter bis zur
                  Höhe von 150 € je Einzelfall ohne vorherige Absprache durch eine Fachwerkstatt
                  ausführen lassen. Der Vermieter erstattet die Kosten gegen Vorlage des
                  Originalrechnungsbeleges und des ausgetauschten Teils. Eigenleistungen des
                  Mieters werden nicht vergütet.
                </p>
              </Section>

              <Section id="b-5" title="5. Fürsorgepflichten & Haftung des Mieters">
                <p>
                  Der Mieter ist verpflichtet, das Fahrzeug vor der Übernahme zu prüfen und Mängel
                  in Textform anzuzeigen. Während der Mietzeit ist das Fahrzeug pfleglich zu
                  behandeln, vor extremen Wetterbedingungen (Hagel, Sturm, Überschwemmung) und vor
                  Vandalismus zu schützen. Kontrollleuchten ist gemäß Betriebsanleitung
                  nachzugehen; Ölstand und Reifendruck sind vor längeren Fahrten zu prüfen.
                </p>
                <p>
                  Der Mieter haftet auch für das Verschulden seiner Beifahrer und Mitreisenden im
                  gesetzlichen Umfang.
                </p>
                <p>
                  Bei Reparaturen oder Schadensbearbeitung durch den Vermieter wird ein Stundensatz
                  von 45,00 € netto je Person sowie ein Mindestbearbeitungsbetrag von 49 € zzgl.
                  USt. berechnet.
                </p>
              </Section>

              <Section id="b-6" title="6. Versicherung & Schäden">
                <p>
                  Das Fahrzeug ist haftpflicht- und vollkaskoversichert mit einer
                  Selbstbeteiligung, deren Höhe im Mietvertrag genannt ist. In Höhe der
                  Selbstbeteiligung haftet der Mieter im Schadensfall.
                </p>
                <p>
                  Bei Verkehrsunfällen (auch ohne Fremdbeteiligung), Brand, Wildschaden und
                  sonstigen Schäden ist unverzüglich die Polizei hinzuzuziehen, der Vermieter zu
                  benachrichtigen und ein ausführlicher Unfallbericht mit Skizze zu übermitteln.
                  Bei Verstößen gegen die Nutzungsverbote oder bei Obliegenheitsverletzungen, die
                  zur Leistungsfreiheit der Versicherung führen, haftet der Mieter im gesetzlichen
                  Umfang.
                </p>
              </Section>

              <Section id="b-7" title="7. Verlust von Schlüsseln, Papieren & Weitervermietung">
                <p>
                  Bei vom Mieter zu vertretendem Verlust von Schlüsseln oder Fahrzeugpapieren
                  trägt dieser die Kosten der Ersatzbeschaffung sowie den Zeitaufwand des
                  Vermieters (45,00 € netto/Stunde).
                </p>
                <p>
                  Sollten durch eine Beschädigung Folgevermietungen ausfallen, verpflichtet sich
                  der Mieter, die Kosten dieser Folgebuchungen bis zur erneuten
                  Betriebsbereitschaft des Fahrzeugs zu übernehmen.
                </p>
              </Section>

              <Section id="b-8" title="8. Technische & optische Veränderungen">
                <p>
                  Der Mieter darf am Fahrzeug keinerlei technische oder optische Veränderungen
                  vornehmen (insbesondere keine Lackierungen, Aufkleber, Klebefolien oder Eingriffe
                  in die Elektrik).
                </p>
              </Section>
            </Part>

            {/* ============================================================
                TEIL C – FERIENUNTERKUNFT (STATIONÄRE NUTZUNG)
                ============================================================ */}
            <Part
              id="teil-c"
              label="Teil C"
              title="Besondere Bedingungen – Ferienunterkunft (stationäre Nutzung)"
            >
              <Section id="c-1" title="1. Gegenstand & Standort">
                <p>
                  Gegenstand ist die Überlassung des Wohnmobils zur stationären Nutzung als
                  Ferienunterkunft an einem zwischen den Parteien vereinbarten Standort
                  (Grundstück des Vermieters, Stellplatz oder vereinbarter Aufstellort). Eine
                  Nutzung als Fahrzeug im öffentlichen Straßenverkehr ist im Rahmen dieses
                  Vertragsteils ausgeschlossen.
                </p>
              </Section>

              <Section id="c-2" title="2. Anreise (Check-in) & Abreise (Check-out)">
                <p>
                  Sofern nicht abweichend vereinbart, gelten folgende Zeiten:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    <strong>Check-in:</strong> ab 15:00 Uhr am Anreisetag
                  </li>
                  <li>
                    <strong>Check-out:</strong> bis 11:00 Uhr am Abreisetag
                  </li>
                </ul>
                <p>
                  Eine frühere Anreise oder spätere Abreise ist nur nach vorheriger Absprache und
                  Verfügbarkeit möglich. Bei verspätetem Check-out behält sich der Vermieter vor,
                  eine zusätzliche Übernachtung in Rechnung zu stellen.
                </p>
              </Section>

              <Section id="c-3" title="3. Personenzahl & Belegung">
                <p>
                  Die Unterkunft darf nur mit der bei Buchung angemeldeten Personenzahl belegt
                  werden, maximal jedoch mit der zulässigen Schlafplatzanzahl des Wohnmobils. Eine
                  Überbelegung berechtigt den Vermieter zur fristlosen Kündigung ohne
                  Erstattungsanspruch.
                </p>
                <p>
                  Die Aufnahme nicht angemeldeter Übernachtungsgäste ist nicht gestattet.
                </p>
              </Section>

              <Section id="c-4" title="4. Hausordnung">
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    <strong>Rauchen</strong> im Wohnmobil ist nicht gestattet (Reinigungspauschale
                    bei Verstoß: 250 €).
                  </li>
                  <li>
                    <strong>Haustiere</strong> nur nach vorheriger schriftlicher Zustimmung des
                    Vermieters; ggf. fällt ein Aufschlag an.
                  </li>
                  <li>
                    <strong>Nachtruhe</strong> ist von 22:00 bis 07:00 Uhr einzuhalten. Lärmende
                    Aktivitäten und laute Musik sind in dieser Zeit untersagt.
                  </li>
                  <li>
                    <strong>Besucher</strong> sind tagsüber willkommen, müssen aber dem Vermieter
                    angezeigt werden und das Gelände bis 22:00 Uhr verlassen.
                  </li>
                  <li>
                    <strong>Offenes Feuer</strong> innerhalb des Wohnmobils sowie Grillen direkt am
                    Fahrzeug ist untersagt. Grillen ist nur an dafür ausgewiesenen Plätzen
                    erlaubt.
                  </li>
                  <li>
                    Mit dem Inventar (Bettwäsche, Geschirr, technische Geräte) ist sorgsam
                    umzugehen. Schäden sind unverzüglich zu melden.
                  </li>
                </ul>
              </Section>

              <Section id="c-5" title="5. Endreinigung, Bettwäsche & Verbrauchskosten">
                <p>
                  Die <strong>Endreinigungspauschale</strong> wird gesondert ausgewiesen und ist
                  zusammen mit dem Mietpreis fällig (Richtwert: 60–90 €). Bei übermäßiger
                  Verschmutzung wird ein zusätzlicher Reinigungsaufwand mit 45 € netto je Stunde
                  berechnet.
                </p>
                <p>
                  <strong>Bettwäsche und Handtücher</strong> sind, sofern im Angebot enthalten,
                  inklusive. Andernfalls können sie gegen Aufpreis hinzugebucht werden.
                </p>
                <p>
                  Eine übliche Nutzung von <strong>Strom, Wasser und Gas</strong> ist im Mietpreis
                  enthalten. Bei langfristigen Aufenthalten (über 14 Tage) behält sich der
                  Vermieter eine verbrauchsabhängige Abrechnung vor; dies wird in diesem Fall
                  vorab schriftlich vereinbart.
                </p>
                <p>
                  Der Mieter ist verpflichtet, das Wohnmobil bei Abreise besenrein zu hinterlassen,
                  Müll zu entsorgen, Geschirr zu spülen und persönliche Gegenstände zu entfernen.
                </p>
              </Section>

              <Section id="c-6" title="6. Stornierung Ferienunterkunft">
                <p>
                  Sofern keine kostenfreie Umbuchung oder anderweitige Vermietung möglich ist,
                  gelten folgende Stornogebühren auf den Gesamtpreis:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>bis 30 Tage vor Anreise: 20 %</li>
                  <li>29 bis 14 Tage vor Anreise: 50 %</li>
                  <li>13 bis 3 Tage vor Anreise: 80 %</li>
                  <li>weniger als 3 Tage vor Anreise oder Nichtanreise: 95 %</li>
                </ul>
                <p>
                  Dem Gast bleibt der Nachweis vorbehalten, dass dem Vermieter kein oder ein
                  geringerer Schaden entstanden ist. Eine Reiserücktrittsversicherung wird
                  empfohlen.
                </p>
              </Section>

              <Section id="c-7" title="7. Meldepflicht & Kurtaxe">
                <p>
                  Der Mieter ist verpflichtet, sich auf Verlangen mit einem gültigen Lichtbildausweis
                  auszuweisen und ggf. einen Meldeschein auszufüllen. Eine etwaige Kurtaxe oder
                  Bettensteuer ist – soweit für den Standort gesetzlich vorgesehen – vor Ort vom
                  Gast zu entrichten.
                </p>
              </Section>

              <Section id="c-8" title="8. Haftung für eingebrachte Sachen">
                <p>
                  Für vom Gast eingebrachte Wertgegenstände übernimmt der Vermieter keine Haftung,
                  soweit kein Vorsatz oder grobe Fahrlässigkeit vorliegt. Der Abschluss einer
                  Reisegepäck- oder Hausratversicherung wird empfohlen.
                </p>
              </Section>
            </Part>

            {/* ============================================================
                TEIL D – EVENT-SERVICE
                ============================================================ */}
            <Part id="teil-d" label="Teil D" title="Besondere Bedingungen – Event-Service">
              <Section id="d-1" title="1. Leistungsumfang">
                <p>
                  Im Rahmen des Event-Services stellt der Vermieter das Wohnmobil tageweise als
                  mobile Lounge, Foto-Location, Umkleide-, Schlaf- oder Rückzugskabine bei
                  Veranstaltungen (z. B. Hochzeiten, Foto-/Filmproduktionen, Firmenevents,
                  Festivals) zur Verfügung.
                </p>
                <p>
                  Sofern Anlieferung, Aufbau oder Standzeit am Veranstaltungsort vereinbart sind,
                  werden Umfang, Zeitfenster und Anfahrtspauschale individuell im Angebot geregelt.
                </p>
              </Section>

              <Section id="d-2" title="2. Standort & Aufstellbedingungen">
                <p>
                  Der Mieter ist dafür verantwortlich, dass am Veranstaltungsort eine geeignete,
                  ebene, befahrbare und tragfähige Stellfläche zur Verfügung steht und sämtliche
                  erforderlichen <strong>Genehmigungen</strong> (z. B. Sondernutzung,
                  Standplatzgenehmigung, GEMA, Veranstaltungsanmeldung) eingeholt sind.
                </p>
                <p>
                  Wird das Fahrzeug aufgrund fehlender Zufahrt, ungeeigneter Stellfläche oder
                  fehlender Genehmigungen nicht oder nur eingeschränkt einsetzbar, bleibt der
                  vereinbarte Preis vollumfänglich geschuldet.
                </p>
                <p>
                  Ein <strong>Stromanschluss</strong> (230 V/16 A) ist nach Möglichkeit vom Mieter
                  bereitzustellen. Falls nicht verfügbar, kann gegen Aufpreis ein Generator
                  zugebucht werden.
                </p>
              </Section>

              <Section id="d-3" title="3. Veranstalterhaftung & Gäste Dritter">
                <p>
                  Der Mieter tritt dem Vermieter gegenüber als <strong>Veranstalter</strong> auf
                  und haftet für sämtliche Schäden, die durch ihn, seine Mitarbeiter, Dienstleister,
                  Eventgäste oder sonstige Dritte am Wohnmobil oder dessen Inventar verursacht
                  werden, im gesetzlichen Umfang.
                </p>
                <p>
                  Der Mieter stellt den Vermieter von sämtlichen Ansprüchen Dritter frei, die im
                  Zusammenhang mit der Veranstaltung gegen den Vermieter geltend gemacht werden,
                  soweit der Vermieter diese nicht selbst zu vertreten hat. Der Abschluss einer
                  <strong> Veranstalterhaftpflichtversicherung</strong> wird dringend empfohlen.
                </p>
                <p>
                  Die <strong>Aufsichtspflicht</strong> über das Wohnmobil und seine Nutzung
                  während der Veranstaltung liegt beim Mieter.
                </p>
              </Section>

              <Section id="d-4" title="4. Wetterklausel">
                <p>
                  Bei Outdoor-Veranstaltungen trägt der Mieter das Wetterrisiko. Eine Stornierung,
                  Verschiebung oder vorzeitige Beendigung der Veranstaltung wegen ungünstiger
                  Witterung berechtigt nicht zur Minderung oder Rückerstattung des Mietpreises.
                </p>
                <p>
                  Bei extremen Wetterereignissen (Sturmwarnung ab Windstärke 8, Hagel, Hochwasser)
                  ist der Vermieter berechtigt, das Fahrzeug aus Sicherheitsgründen vom
                  Veranstaltungsort zu entfernen oder die Anreise abzusagen. In diesem Fall werden
                  bereits geleistete Zahlungen anteilig erstattet, weitergehende Ansprüche sind
                  ausgeschlossen.
                </p>
              </Section>

              <Section id="d-5" title="5. Stornierung Event-Service">
                <p>
                  Aufgrund der hohen Vorbereitungs- und Reservierungsaufwände gelten für den
                  Event-Service folgende pauschale Stornogebühren auf den Gesamtpreis:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>bis 60 Tage vor Veranstaltung: 25 %</li>
                  <li>59 bis 30 Tage vor Veranstaltung: 60 %</li>
                  <li>29 bis 14 Tage vor Veranstaltung: 80 %</li>
                  <li>weniger als 14 Tage vor Veranstaltung oder Nichtinanspruchnahme: 100 %</li>
                </ul>
                <p>
                  Eine kostenfreie Verschiebung des Termins ist – soweit verfügbar – einmalig
                  zulässig, sofern sie spätestens 30 Tage vor dem ursprünglichen Termin in Textform
                  beantragt wird.
                </p>
              </Section>

              <Section id="d-6" title="6. Reinigung nach Eventnutzung">
                <p>
                  Das Wohnmobil ist nach Eventnutzung in besenreinem Zustand zurückzugeben.
                  Übermäßige Verschmutzungen (z. B. durch Konfetti, Glitter, verschüttete Getränke,
                  Make-up-Rückstände, Blütenblätter, Kerzenwachs) werden mit einer
                  Sonderreinigungspauschale von mindestens 150 € berechnet; weitergehende Schäden
                  bleiben hiervon unberührt.
                </p>
                <p>
                  Das Anbringen von Dekoration mit Klebeband, Nägeln, Schrauben oder ähnlichen
                  beschädigenden Mitteln am Innen- oder Außenbereich des Fahrzeugs ist untersagt.
                </p>
              </Section>

              <Section id="d-7" title="7. Bild- & Filmaufnahmen">
                <p>
                  Bild- und Filmaufnahmen des Wohnmobils zu privaten Zwecken sind gestattet. Eine
                  <strong> kommerzielle Nutzung</strong> der Aufnahmen (z. B. Werbung, redaktionelle
                  Veröffentlichung, Social-Media-Werbung gewerblicher Anbieter) bedarf der
                  vorherigen schriftlichen Zustimmung des Vermieters.
                </p>
              </Section>
            </Part>

            <p className="pt-6 text-muted-foreground border-t border-border/30">
              Mit der Buchungsbestätigung bzw. Unterzeichnung des jeweiligen Vertrages bestätigt
              der Mieter / Gast, die vorstehenden Allgemeinen Geschäftsbedingungen zur Kenntnis
              genommen und akzeptiert zu haben.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AGB;
