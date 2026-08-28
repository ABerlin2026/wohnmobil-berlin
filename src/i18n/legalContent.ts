/**
 * Localized legal content (AGB / Imprint / Privacy).
 * Each entry is a flat list of nodes that can be rendered as headings,
 * paragraphs, lists, raw HTML or callouts. The actual rendering happens
 * in `LegalRenderer`. Kept as data so that adding a language only requires
 * an additional record entry.
 */
import type { Language } from "./LanguageContext";

export type LegalNode =
  | { type: "callout"; html: string }
  | { type: "part"; id: string; label: string; title: string }
  | { type: "section"; id: string; title: string }
  | { type: "p"; html: string }
  | { type: "ul"; items: string[] }
  | { type: "footer"; html: string };

export type LegalDoc = {
  pageTitle: string;
  pageSubtitle?: string;
  metaTitle: string;
  metaDescription: string;
  asOf?: string; // pre-formatted "Stand: …" line
  toc?: { label: string; entries: { href: string; html: string }[] };
  nodes: LegalNode[];
};

// =====================================================================
// AGB
// =====================================================================
const agbDe: LegalDoc = {
  pageTitle: "Allgemeine Geschäftsbedingungen",
  pageSubtitle: "Wohnmobil Berlin Brandenburg – Wohnmobilvermietung, Ferienunterkunft & Event-Service",
  metaTitle: "AGB | Wohnmobil Berlin Brandenburg",
  metaDescription:
    "Allgemeine Geschäftsbedingungen für Wohnmobil-Vermietung, Ferienunterkunft und Event-Service von Wohnmobil Berlin Brandenburg.",
  toc: {
    label: "Inhalt",
    entries: [
      { href: "#teil-a", html: '<span class="text-primary font-semibold">A.</span> Allgemeine Bestimmungen' },
      { href: "#teil-b", html: '<span class="text-primary font-semibold">B.</span> Besondere Bedingungen – Wohnmobil-Vermietung' },
      { href: "#teil-c", html: '<span class="text-primary font-semibold">C.</span> Besondere Bedingungen – Ferienunterkunft (stationäre Nutzung)' },
      { href: "#teil-d", html: '<span class="text-primary font-semibold">D.</span> Besondere Bedingungen – Event-Service' },
    ],
  },
  nodes: [
    { type: "callout", html: "Mehrere Mieter bzw. Gäste bilden eine Mieter- bzw. Gästegemeinschaft. Jede Person hat identische Rechte und Pflichten und haftet gesamtschuldnerisch." },

    { type: "part", id: "teil-a", label: "Teil A", title: "Allgemeine Bestimmungen" },
    { type: "section", id: "a-1", title: "1. Geltungsbereich" },
    { type: "p", html: "Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für sämtliche Verträge zwischen Wohnmobil Berlin Brandenburg (nachfolgend „Vermieter\") und dem Kunden (nachfolgend „Mieter\" bzw. „Gast\") über die Vermietung des Wohnmobils zu Reisezwecken (Teil B), die Nutzung des Wohnmobils als stationäre Ferienunterkunft (Teil C) sowie die Nutzung im Rahmen von Event-Dienstleistungen (Teil D)." },
    { type: "p", html: "Abweichende, entgegenstehende oder ergänzende Bedingungen des Mieters werden nur Vertragsbestandteil, wenn der Vermieter ihrer Geltung ausdrücklich schriftlich zustimmt." },

    { type: "section", id: "a-2", title: "2. Vertragsabschluss" },
    { type: "p", html: "Die Darstellung der Leistungen auf der Webseite stellt kein bindendes Angebot dar. Eine Anfrage des Mieters ist eine Aufforderung zur Abgabe eines Angebots. Der Vertrag kommt erst mit ausdrücklicher Buchungsbestätigung des Vermieters in Textform (E-Mail) und – bei Wohnmobil-Vermietung – durch beiderseitige Unterzeichnung des Mietvertrages zustande." },
    { type: "p", html: "Mündliche Absprachen sind ohne schriftliche Bestätigung unwirksam. Eine Übertragung der Vertragsrechte auf Dritte ist nur mit vorheriger schriftlicher Zustimmung des Vermieters zulässig." },

    { type: "section", id: "a-3", title: "3. Preise, Zahlung & Kaution" },
    { type: "p", html: "Es gelten die zum Zeitpunkt der Buchung auf der Webseite ausgewiesenen Preise. Sofern nicht anders angegeben, verstehen sich alle Preise in Euro inklusive der gesetzlichen Mehrwertsteuer." },
    { type: "p", html: "Sofern nicht anders vereinbart, ist eine <strong>Anzahlung in Höhe von 25 %</strong> des Gesamtpreises sofort bei Buchungsbestätigung fällig. Der <strong>Restbetrag von 75 %</strong> ist spätestens 14 Tage vor Mietbeginn bzw. Anreise zu zahlen. Bei kurzfristigen Buchungen (weniger als 14 Tage vor Beginn) ist der Gesamtbetrag sofort fällig. Der Mietvertrag wird dem Mieter nach Buchungsanfrage per E-Mail zugesandt und wird mit Eingang der Anzahlung (per Überweisung oder bar) verbindlich." },
    { type: "p", html: "Der Vermieter ist berechtigt, vor Übergabe eine Kaution zu verlangen. Diese beträgt:" },
    { type: "ul", items: [
      "<strong>Wohnmobil-Vermietung:</strong> 1.500 € (per Überweisung oder bar nach Absprache)",
      "<strong>Ferienunterkunft & Event-Service:</strong> 200–500 € je nach Buchungsumfang",
    ]},
    { type: "p", html: "Die Kaution wird nach mängelfreier Rückgabe innerhalb von 14 Tagen zurückerstattet." },

    { type: "section", id: "a-3b", title: "4. Saison & Verfügbarkeit" },
    { type: "p", html: "Die Vermietung des Wohnmobils erfolgt saisonal von <strong>April bis Oktober</strong>. In den Monaten November bis März steht das Fahrzeug nicht zur Verfügung." },
    { type: "p", html: "Es gelten folgende Saisonpreise pro Tag für die Wohnmobil-Vermietung:" },
    { type: "ul", items: [
      "<strong>Hauptsaison (1. Mai – 30. September):</strong> 129 €/Tag",
      "<strong>Nebensaison (April & Oktober):</strong> 119 €/Tag",
    ]},

    { type: "section", id: "a-4", title: "5. Widerrufsrecht" },
    { type: "p", html: "Bei Verträgen über die Vermietung von Wohnmobilen, Ferienunterkünften sowie Dienstleistungen im Bereich Beherbergung und Freizeitveranstaltungen, die zu einem bestimmten Zeitpunkt oder für einen bestimmten Zeitraum erbracht werden, besteht gemäß § 312g Abs. 2 Nr. 9 BGB <strong>kein gesetzliches Widerrufsrecht</strong>. Es gelten ausschließlich die in den jeweiligen Teilen B, C und D geregelten Stornobedingungen." },

    { type: "section", id: "a-5", title: "6. Haftung des Vermieters" },
    { type: "p", html: "Der Vermieter haftet uneingeschränkt für Vorsatz und grobe Fahrlässigkeit sowie bei Verletzung von Leben, Körper oder Gesundheit. Bei leichter Fahrlässigkeit haftet der Vermieter nur bei Verletzung wesentlicher Vertragspflichten (Kardinalpflichten); die Haftung ist in diesem Fall auf den vertragstypischen, vorhersehbaren Schaden begrenzt." },
    { type: "p", html: "Eine verschuldensunabhängige Haftung sowie die Haftung für mittelbare Schäden, entgangenen Gewinn oder ausgefallene Urlaubsfreuden ist – soweit gesetzlich zulässig – ausgeschlossen." },
    { type: "p", html: "Der Vermieter haftet nicht für vom Mieter eingebrachte Gegenstände (z. B. Gepäck, Wertsachen, Foto- und Videoausrüstung, Fahrräder). Dem Mieter wird der Abschluss einer eigenen Reise- bzw. Hausratversicherung empfohlen." },

    { type: "section", id: "a-6", title: "7. Höhere Gewalt" },
    { type: "p", html: "Wird die Erfüllung des Vertrages durch höhere Gewalt (z. B. Naturereignisse, Pandemie, behördliche Anordnungen, Krieg) unmöglich oder erheblich erschwert, sind beide Parteien berechtigt, den Vertrag zu kündigen. Bereits geleistete Zahlungen werden – abzüglich nachweisbar entstandener Aufwendungen des Vermieters – zurückerstattet. Schadensersatzansprüche sind in diesem Fall ausgeschlossen." },

    { type: "section", id: "a-7", title: "8. Datenschutz" },
    { type: "p", html: "Die Erhebung und Verarbeitung personenbezogener Daten erfolgt ausschließlich zur Vertragsabwicklung gemäß DSGVO. Einzelheiten ergeben sich aus unserer <a href=\"/datenschutz\" class=\"text-primary hover:underline\">Datenschutzerklärung</a>." },

    { type: "section", id: "a-8", title: "9. Rechtswahl, Gerichtsstand & Schlussbestimmungen" },
    { type: "p", html: "Es gilt ausschließlich das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts. Gerichtsstand ist – soweit gesetzlich zulässig – der Sitz des Vermieters." },
    { type: "p", html: "Sollte eine Bestimmung dieser AGB unwirksam sein oder werden, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt. An Stelle der unwirksamen Regelung tritt die entsprechende gesetzliche Vorschrift." },
    { type: "p", html: "Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: <a href=\"https://ec.europa.eu/consumers/odr\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"text-primary hover:underline\">https://ec.europa.eu/consumers/odr</a>. Der Vermieter ist nicht verpflichtet und nicht bereit, an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen." },

    { type: "part", id: "teil-b", label: "Teil B", title: "Besondere Bedingungen – Wohnmobil-Vermietung" },
    { type: "section", id: "b-1", title: "1. Mietzeit, Mindestmietdauer, Übergabe & Rückgabe" },
    { type: "p", html: "Die <strong>Mindestmietdauer beträgt 5 Tage</strong> (Anreise- und Abreisetag inklusive). Die Mietzeit beginnt und endet zu den im Mietvertrag vereinbarten Terminen. Übergabe und Rückgabe erfolgen in der Regel am Standort des Vermieters in Berlin/Brandenburg." },
    { type: "p", html: "Sofern Abholung durch den Vermieter vereinbart ist, ist das Fahrzeug zum vereinbarten Zeitpunkt am vereinbarten Ort vollgetankt und in vertragsgemäßem Zustand bereitzustellen." },
    { type: "p", html: "Das Mietverhältnis verlängert sich nicht automatisch. Bei verspäteter Rückgabe kann der Vermieter eine Nutzungsentschädigung gemäß § 546a BGB sowie einen Aufschlag von 50 € je angefangener Stunde verlangen, mindestens jedoch den Tagesmietpreis je angefangenem Tag. Folgeschäden (z. B. ausgefallene Anschlussvermietungen) trägt der Mieter zusätzlich." },

    { type: "section", id: "b-2", title: "2. Personenanzahl" },
    { type: "p", html: "Das Wohnmobil verfügt über <strong>4 zugelassene Schlaf- und Sitzplätze</strong> (alle gurtgesichert). Die Mitnahme weiterer Personen ist nicht gestattet." },

    { type: "section", id: "b-3", title: "3. Stornierung Wohnmobil" },
    { type: "p", html: "Tritt der Mieter vom Vertrag zurück, gelten – sofern keine kostenfreie Umbuchung oder Ersatzmiete möglich ist – folgende pauschale Stornogebühren auf den Gesamtmietpreis:" },
    { type: "ul", items: [
      "bis 60 Tage vor Mietbeginn: 20 %",
      "59 bis 30 Tage vor Mietbeginn: 50 %",
      "29 bis 7 Tage vor Mietbeginn: 80 %",
      "weniger als 7 Tage vor Mietbeginn oder Nichtantritt: 95 %",
    ]},
    { type: "p", html: "Dem Mieter bleibt der Nachweis vorbehalten, dass dem Vermieter kein oder ein geringerer Schaden entstanden ist. Der Abschluss einer Reiserücktrittsversicherung wird ausdrücklich empfohlen." },

    { type: "section", id: "b-4", title: "4. Auslandsfahrten & Nutzungsverbote" },
    { type: "p", html: "Auslandsfahrten sind ausschließlich in folgende Länder gestattet, da nur dort Versicherungsschutz (insbesondere Vollkasko) besteht:" },
    { type: "callout", html: "Deutschland, Niederlande, Dänemark, Schweden, Norwegen, Finnland, Polen, Tschechien, Österreich, Schweiz, Ungarn, Slowenien, Kroatien und Slowakei." },
    { type: "p", html: "Fahrten in andere Länder – insbesondere Belgien, Luxemburg, Frankreich, Italien, die baltischen Staaten (Litauen, Lettland, Estland), das Vereinigte Königreich, Irland, der Balkan (Serbien, Bosnien, Montenegro, Nordmazedonien, Albanien), Rumänien, Bulgarien, Belarus, Ukraine und Moldau – sind <strong>nicht versichert und nicht gestattet</strong>." },
    { type: "p", html: "Vom Vermieter generell nicht gestattet ist die Nutzung des Fahrzeugs zu folgenden Zwecken:" },
    { type: "ul", items: [
      "Teilnahme an Wettrennen, Fahrertraining, Geländefahrten und ähnlichen Nutzungen.",
      "Beförderung von leicht entzündlichen, giftigen oder sonst gefährlichen Stoffen.",
      "Jegliche Verwendung im Zusammenhang mit der Begehung von Straftaten oder Zoll- und Steuervergehen, insbesondere dem Transport von Stoffen, die unter das Betäubungsmittelgesetz fallen.",
      "Gewerbliche Personenbeförderung.",
    ]},
    { type: "p", html: "Das Fahrzeug darf nur von den im Mietvertrag namentlich benannten Fahrern mit gültiger, in Deutschland anerkannter Fahrerlaubnis geführt werden. Die Nutzung unter Einfluss von Alkohol, Medikamenten oder anderen berauschenden Mitteln ist untersagt." },
    { type: "p", html: "<strong>Rauchen</strong> im Fahrzeug ist nicht gestattet. Bei Zuwiderhandlung wird eine Reinigungspauschale von mindestens 200 € erhoben." },
    { type: "p", html: "<strong>Haustiere (insbesondere Hunde) sind willkommen</strong> und ohne Aufpreis erlaubt. Der Mieter ist verpflichtet, etwaige durch das Tier verursachte Verschmutzungen oder Schäden vor Rückgabe zu beseitigen bzw. zu ersetzen." },

    { type: "section", id: "b-5", title: "5. Freikilometer & Mehrkilometer" },
    { type: "p", html: "Im Mietpreis enthalten sind <strong>150 Freikilometer pro Mietttag</strong>. Mehrkilometer werden mit <strong>0,35 € pro Kilometer</strong> berechnet und bei Rückgabe abgerechnet." },

    { type: "section", id: "b-6", title: "6. Endreinigung" },
    { type: "p", html: "Das Wohnmobil ist innen und außen <strong>gereinigt zurückzugeben</strong>. Grauwasser- und Toilettentank müssen in jedem Fall entleert werden – dies ist Bestandteil der regulären Rückgabe und wird bei der Übergabe erklärt." },
    { type: "p", html: "Wer die Reinigung nicht selbst übernehmen möchte, kann die <strong>Innen- und Außenreinigungs-Pauschale in Höhe von 200 €</strong> direkt bei der Buchung hinzufügen. Wird das Fahrzeug ohne diese Pauschale ungereinigt zurückgegeben, wird die Reinigung mit ebenfalls 200 € in Rechnung gestellt; bei besonders starker Verschmutzung kann ein zusätzlicher Aufwand mit 45 € netto je Stunde berechnet werden." },

    { type: "section", id: "b-7", title: "7. Optionale Extras" },
    { type: "p", html: "Folgende Extras können bei Buchung hinzugefügt werden:" },
    { type: "ul", items: [
      "Bettwäsche: 10 € pro Person (max. 4 Personen)",
      "Handtuch-Set: 20 € pro Buchung",
      "Gasgrill: 40 € pro Buchung",
      "E-Scooter: 75 € pro Stück (max. 3)",
      "Innen- und Außenreinigung: 200 € pro Buchung",
    ]},
    { type: "p", html: "Die jeweils gültigen Preise und Verfügbarkeiten ergeben sich aus dem Buchungsformular auf der Webseite." },

    { type: "section", id: "b-8", title: "8. Kraftstoffe, Öle, Kleinreparaturen" },
    { type: "p", html: "Der während der Mietdauer verbrauchte Kraftstoff, AdBlue, Motoröl, Gas und andere Hilfs- und Betriebsstoffe sind vom Mieter auf eigene Kosten zu beschaffen. Das Fahrzeug ist vollgetankt zurückzugeben; andernfalls wird der fehlende Kraftstoff zuzüglich einer Servicepauschale von 25 € berechnet." },
    { type: "p", html: "Kleine Instandsetzungen (z. B. Austausch von Glühbirnen) kann der Mieter bis zur Höhe von 150 € je Einzelfall ohne vorherige Absprache durch eine Fachwerkstatt ausführen lassen. Der Vermieter erstattet die Kosten gegen Vorlage des Originalrechnungsbeleges und des ausgetauschten Teils. Eigenleistungen des Mieters werden nicht vergütet." },

    { type: "section", id: "b-9", title: "9. Pannen, Reifenpannen & Eigenverantwortung unterwegs" },
    { type: "p", html: "Ein <strong>Schutzbrief ist nicht inkludiert</strong>. Bei einer Panne, einer Reifenpanne oder vergleichbaren Vorfällen während der Mietzeit hat der Mieter sich selbst um Bergung, Reparatur und Weiterfahrt zu kümmern und trägt die hierfür anfallenden Kosten. Dem Mieter wird ausdrücklich empfohlen, vor Reiseantritt einen eigenen Schutzbrief (z. B. ADAC, ACE) abzuschließen." },
    { type: "p", html: "Der Vermieter ist im Pannenfall unverzüglich zu informieren. Reparaturen über 150 € je Einzelfall bedürfen der vorherigen Zustimmung des Vermieters." },

    { type: "section", id: "b-10", title: "10. Nichtbereitstellung durch Vorschaden" },
    { type: "p", html: "Sollte der Vermieter das Wohnmobil aufgrund eines vom vorherigen Mieter verursachten Schadens oder eines anderen, vom Vermieter nicht zu vertretenden Umstands zum vereinbarten Termin nicht bereitstellen können, werden bereits geleistete Zahlungen vollständig erstattet." },
    { type: "p", html: "<strong>Ein darüber hinausgehender Anspruch des Mieters auf Schadensersatz</strong> (z. B. für gebuchte Hotels, Anreisekosten, Aktivitäten oder entgangene Urlaubsfreuden) <strong>besteht nicht</strong>, soweit den Vermieter nicht Vorsatz oder grobe Fahrlässigkeit trifft." },

    { type: "section", id: "b-11", title: "11. Fürsorgepflichten & Haftung des Mieters" },
    { type: "p", html: "Der Mieter ist verpflichtet, das Fahrzeug vor der Übernahme zu prüfen und Mängel in Textform anzuzeigen. Während der Mietzeit ist das Fahrzeug pfleglich zu behandeln, vor extremen Wetterbedingungen (Hagel, Sturm, Überschwemmung) und vor Vandalismus zu schützen. Kontrollleuchten ist gemäß Betriebsanleitung nachzugehen; Ölstand und Reifendruck sind vor längeren Fahrten zu prüfen." },
    { type: "p", html: "Der Mieter haftet auch für das Verschulden seiner Beifahrer und Mitreisenden im gesetzlichen Umfang." },
    { type: "p", html: "Bei Reparaturen oder Schadensbearbeitung durch den Vermieter wird ein Stundensatz von 45,00 € netto je Person sowie ein Mindestbearbeitungsbetrag von 49 € zzgl. USt. berechnet." },

    { type: "section", id: "b-12", title: "12. Versicherung & Schäden" },
    { type: "p", html: "Das Fahrzeug ist haftpflicht- und vollkaskoversichert mit einer Selbstbeteiligung, deren Höhe im Mietvertrag genannt ist. In Höhe der Selbstbeteiligung haftet der Mieter im Schadensfall." },
    { type: "p", html: "Bei Verkehrsunfällen (auch ohne Fremdbeteiligung), Brand, Wildschaden und sonstigen Schäden ist unverzüglich die Polizei hinzuzuziehen, der Vermieter zu benachrichtigen und ein ausführlicher Unfallbericht mit Skizze zu übermitteln. Bei Verstößen gegen die Nutzungsverbote oder bei Obliegenheitsverletzungen, die zur Leistungsfreiheit der Versicherung führen, haftet der Mieter im gesetzlichen Umfang." },

    { type: "section", id: "b-13", title: "13. Verlust von Schlüsseln, Papieren & Weitervermietung" },
    { type: "p", html: "Bei vom Mieter zu vertretendem Verlust von Schlüsseln oder Fahrzeugpapieren trägt dieser die Kosten der Ersatzbeschaffung sowie den Zeitaufwand des Vermieters (45,00 € netto/Stunde)." },
    { type: "p", html: "Sollten durch eine Beschädigung Folgevermietungen ausfallen, verpflichtet sich der Mieter, die Kosten dieser Folgebuchungen bis zur erneuten Betriebsbereitschaft des Fahrzeugs zu übernehmen." },

    { type: "section", id: "b-14", title: "14. Technische & optische Veränderungen" },
    { type: "p", html: "Der Mieter darf am Fahrzeug keinerlei technische oder optische Veränderungen vornehmen (insbesondere keine Lackierungen, Aufkleber, Klebefolien oder Eingriffe in die Elektrik)." },

    { type: "part", id: "teil-c", label: "Teil C", title: "Besondere Bedingungen – Ferienunterkunft (stationäre Nutzung)" },
    { type: "section", id: "c-1", title: "1. Gegenstand & Standort" },
    { type: "p", html: "Gegenstand ist die Überlassung des Wohnmobils zur stationären Nutzung als Ferienunterkunft an einem zwischen den Parteien vereinbarten Standort (Grundstück des Vermieters, Stellplatz oder vereinbarter Aufstellort). Eine Nutzung als Fahrzeug im öffentlichen Straßenverkehr ist im Rahmen dieses Vertragsteils ausgeschlossen." },

    { type: "section", id: "c-2", title: "2. Anreise (Check-in) & Abreise (Check-out)" },
    { type: "p", html: "Sofern nicht abweichend vereinbart, gelten folgende Zeiten:" },
    { type: "ul", items: [
      "<strong>Check-in:</strong> ab 15:00 Uhr am Anreisetag",
      "<strong>Check-out:</strong> bis 11:00 Uhr am Abreisetag",
    ]},
    { type: "p", html: "Eine frühere Anreise oder spätere Abreise ist nur nach vorheriger Absprache und Verfügbarkeit möglich. Bei verspätetem Check-out behält sich der Vermieter vor, eine zusätzliche Übernachtung in Rechnung zu stellen." },

    { type: "section", id: "c-3", title: "3. Mindestaufenthalt, Personenzahl & Preise" },
    { type: "p", html: "Der <strong>Mindestaufenthalt beträgt 3 Nächte</strong>. Die Unterkunft darf nur mit der bei Buchung angemeldeten Personenzahl belegt werden, maximal jedoch mit <strong>4 Personen</strong> (entspricht der zulässigen Schlafplatzanzahl des Wohnmobils). Eine Überbelegung berechtigt den Vermieter zur fristlosen Kündigung ohne Erstattungsanspruch. Die Aufnahme nicht angemeldeter Übernachtungsgäste ist nicht gestattet." },
    { type: "p", html: "Es gelten folgende Preise pro Nacht (gestaffelt nach Personenzahl):" },
    { type: "ul", items: [
      "1 Person: 75 €/Nacht",
      "2 Personen: 100 €/Nacht",
      "3 Personen: 125 €/Nacht",
      "4 Personen: 150 €/Nacht",
    ]},

    { type: "section", id: "c-4", title: "4. Hausordnung" },
    { type: "ul", items: [
      "<strong>Rauchen</strong> im Wohnmobil ist nicht gestattet (Reinigungspauschale bei Verstoß: 200 €).",
      "<strong>Haustiere (insbesondere Hunde) sind willkommen</strong> und ohne Aufpreis erlaubt. Etwaige Verschmutzungen oder Schäden durch das Tier sind vor Abreise zu beseitigen bzw. zu ersetzen.",
      "<strong>Nachtruhe</strong> ist von 22:00 bis 07:00 Uhr einzuhalten. Lärmende Aktivitäten und laute Musik sind in dieser Zeit untersagt.",
      "<strong>Besucher</strong> sind tagsüber willkommen, müssen aber dem Vermieter angezeigt werden und das Gelände bis 22:00 Uhr verlassen.",
      "<strong>Offenes Feuer</strong> innerhalb des Wohnmobils sowie Grillen direkt am Fahrzeug ist untersagt. Grillen ist nur an dafür ausgewiesenen Plätzen erlaubt.",
      "Mit dem Inventar (Bettwäsche, Geschirr, technische Geräte) ist sorgsam umzugehen. Schäden sind unverzüglich zu melden.",
    ]},

    { type: "section", id: "c-5", title: "5. Endreinigung, Bettwäsche & Verbrauchskosten" },
    { type: "p", html: "Eine <strong>Innen- und Außenreinigung</strong> kann optional bei Buchung mit <strong>200 €</strong> pauschal hinzugefügt werden. Andernfalls ist das Wohnmobil bei Abreise gereinigt zu übergeben (besenrein, Müll entsorgt, Geschirr gespült, persönliche Gegenstände entfernt). Bei übermäßiger Verschmutzung oder ungereinigter Rückgabe ohne gebuchte Pauschale wird die Reinigung mit ebenfalls 200 € berechnet; zusätzlicher Aufwand mit 45 € netto je Stunde." },
    { type: "p", html: "<strong>Bettwäsche</strong> kann gegen einen Aufpreis von 10 € pro Person (max. 4 Personen) hinzugebucht werden. Ein <strong>Handtuch-Set</strong> ist optional für 20 € pro Buchung verfügbar." },
    { type: "p", html: "Eine übliche Nutzung von <strong>Strom, Wasser und Gas</strong> ist im Mietpreis enthalten. Bei langfristigen Aufenthalten (über 14 Tage) behält sich der Vermieter eine verbrauchsabhängige Abrechnung vor; dies wird in diesem Fall vorab schriftlich vereinbart." },

    { type: "section", id: "c-6", title: "6. Stornierung Ferienunterkunft" },
    { type: "p", html: "Sofern keine kostenfreie Umbuchung oder anderweitige Vermietung möglich ist, gelten folgende Stornogebühren auf den Gesamtpreis:" },
    { type: "ul", items: [
      "bis 30 Tage vor Anreise: 20 %",
      "29 bis 14 Tage vor Anreise: 50 %",
      "13 bis 3 Tage vor Anreise: 80 %",
      "weniger als 3 Tage vor Anreise oder Nichtanreise: 95 %",
    ]},
    { type: "p", html: "Dem Gast bleibt der Nachweis vorbehalten, dass dem Vermieter kein oder ein geringerer Schaden entstanden ist. Eine Reiserücktrittsversicherung wird empfohlen." },

    { type: "section", id: "c-7", title: "7. Meldepflicht & Kurtaxe" },
    { type: "p", html: "Der Mieter ist verpflichtet, sich auf Verlangen mit einem gültigen Lichtbildausweis auszuweisen und ggf. einen Meldeschein auszufüllen. Eine etwaige Kurtaxe oder Bettensteuer ist – soweit für den Standort gesetzlich vorgesehen – vor Ort vom Gast zu entrichten." },

    { type: "section", id: "c-8", title: "8. Haftung für eingebrachte Sachen" },
    { type: "p", html: "Für vom Gast eingebrachte Wertgegenstände übernimmt der Vermieter keine Haftung, soweit kein Vorsatz oder grobe Fahrlässigkeit vorliegt. Der Abschluss einer Reisegepäck- oder Hausratversicherung wird empfohlen." },

    { type: "part", id: "teil-d", label: "Teil D", title: "Besondere Bedingungen – Event-Service" },
    { type: "section", id: "d-1", title: "1. Leistungsumfang, Mindestdauer & Preis" },
    { type: "p", html: "Im Rahmen des Event-Services stellt der Vermieter das Wohnmobil als mobile Lounge, Foto-Location, Umkleide-, Schlaf- oder Rückzugskabine bei Veranstaltungen (z. B. Hochzeiten, Foto-/Filmproduktionen, Firmenevents, Festivals) zur Verfügung." },
    { type: "p", html: "Der <strong>Mindestbuchungszeitraum beträgt 3 Tage</strong>. Der Preis beträgt <strong>80 € pro Tag</strong> bei einer Anfahrt bis zu <strong>50 km</strong> ab Standort des Vermieters in Berlin/Brandenburg. Für weitere Anfahrtswege wird eine individuelle Anfahrtspauschale gemäß Angebot berechnet." },
    { type: "p", html: "Sofern Anlieferung, Aufbau oder Standzeit am Veranstaltungsort vereinbart sind, werden Umfang und Zeitfenster individuell im Angebot geregelt." },

    { type: "section", id: "d-2", title: "2. Standort & Aufstellbedingungen" },
    { type: "p", html: "Der Mieter ist dafür verantwortlich, dass am Veranstaltungsort eine geeignete, ebene, befahrbare und tragfähige Stellfläche zur Verfügung steht und sämtliche erforderlichen <strong>Genehmigungen</strong> (z. B. Sondernutzung, Standplatzgenehmigung, GEMA, Veranstaltungsanmeldung) eingeholt sind." },
    { type: "p", html: "Wird das Fahrzeug aufgrund fehlender Zufahrt, ungeeigneter Stellfläche oder fehlender Genehmigungen nicht oder nur eingeschränkt einsetzbar, bleibt der vereinbarte Preis vollumfänglich geschuldet." },
    { type: "p", html: "Ein <strong>Stromanschluss</strong> (230 V/16 A) ist nach Möglichkeit vom Mieter bereitzustellen. Falls nicht verfügbar, kann gegen Aufpreis ein Generator zugebucht werden." },

    { type: "section", id: "d-3", title: "3. Veranstalterhaftung & Gäste Dritter" },
    { type: "p", html: "Der Mieter tritt dem Vermieter gegenüber als <strong>Veranstalter</strong> auf und haftet für sämtliche Schäden, die durch ihn, seine Mitarbeiter, Dienstleister, Eventgäste oder sonstige Dritte am Wohnmobil oder dessen Inventar verursacht werden, im gesetzlichen Umfang." },
    { type: "p", html: "Der Mieter stellt den Vermieter von sämtlichen Ansprüchen Dritter frei, die im Zusammenhang mit der Veranstaltung gegen den Vermieter geltend gemacht werden, soweit der Vermieter diese nicht selbst zu vertreten hat. Der Abschluss einer <strong>Veranstalterhaftpflichtversicherung</strong> wird dringend empfohlen." },
    { type: "p", html: "Die <strong>Aufsichtspflicht</strong> über das Wohnmobil und seine Nutzung während der Veranstaltung liegt beim Mieter." },

    { type: "section", id: "d-4", title: "4. Wetterklausel" },
    { type: "p", html: "Bei Outdoor-Veranstaltungen trägt der Mieter das Wetterrisiko. Eine Stornierung, Verschiebung oder vorzeitige Beendigung der Veranstaltung wegen ungünstiger Witterung berechtigt nicht zur Minderung oder Rückerstattung des Mietpreises." },
    { type: "p", html: "Bei extremen Wetterereignissen (Sturmwarnung ab Windstärke 8, Hagel, Hochwasser) ist der Vermieter berechtigt, das Fahrzeug aus Sicherheitsgründen vom Veranstaltungsort zu entfernen oder die Anreise abzusagen. In diesem Fall werden bereits geleistete Zahlungen anteilig erstattet, weitergehende Ansprüche sind ausgeschlossen." },

    { type: "section", id: "d-5", title: "5. Stornierung Event-Service" },
    { type: "p", html: "Aufgrund der hohen Vorbereitungs- und Reservierungsaufwände gelten für den Event-Service folgende pauschale Stornogebühren auf den Gesamtpreis:" },
    { type: "ul", items: [
      "bis 60 Tage vor Veranstaltung: 25 %",
      "59 bis 30 Tage vor Veranstaltung: 60 %",
      "29 bis 14 Tage vor Veranstaltung: 80 %",
      "weniger als 14 Tage vor Veranstaltung oder Nichtinanspruchnahme: 100 %",
    ]},
    { type: "p", html: "Eine kostenfreie Verschiebung des Termins ist – soweit verfügbar – einmalig zulässig, sofern sie spätestens 30 Tage vor dem ursprünglichen Termin in Textform beantragt wird." },

    { type: "section", id: "d-6", title: "6. Reinigung nach Eventnutzung" },
    { type: "p", html: "Das Wohnmobil ist nach Eventnutzung in besenreinem Zustand zurückzugeben. Übermäßige Verschmutzungen (z. B. durch Konfetti, Glitter, verschüttete Getränke, Make-up-Rückstände, Blütenblätter, Kerzenwachs) werden mit einer Sonderreinigungspauschale von mindestens 150 € berechnet; weitergehende Schäden bleiben hiervon unberührt." },
    { type: "p", html: "Das Anbringen von Dekoration mit Klebeband, Nägeln, Schrauben oder ähnlichen beschädigenden Mitteln am Innen- oder Außenbereich des Fahrzeugs ist untersagt." },

    { type: "section", id: "d-7", title: "7. Bild- & Filmaufnahmen" },
    { type: "p", html: "Bild- und Filmaufnahmen des Wohnmobils zu privaten Zwecken sind gestattet. Eine <strong>kommerzielle Nutzung</strong> der Aufnahmen (z. B. Werbung, redaktionelle Veröffentlichung, Social-Media-Werbung gewerblicher Anbieter) bedarf der vorherigen schriftlichen Zustimmung des Vermieters." },

    { type: "footer", html: "Mit der Buchungsbestätigung bzw. Unterzeichnung des jeweiligen Vertrages bestätigt der Mieter / Gast, die vorstehenden Allgemeinen Geschäftsbedingungen zur Kenntnis genommen und akzeptiert zu haben." },
  ],
};

const agbEn: LegalDoc = {
  pageTitle: "General Terms and Conditions",
  pageSubtitle: "Wohnmobil Berlin Brandenburg – Motorhome rental, holiday accommodation & event service",
  metaTitle: "Terms & Conditions | Wohnmobil Berlin Brandenburg",
  metaDescription:
    "General Terms and Conditions for motorhome rental, holiday accommodation and event service of Wohnmobil Berlin Brandenburg.",
  toc: {
    label: "Contents",
    entries: [
      { href: "#teil-a", html: '<span class="text-primary font-semibold">A.</span> General Provisions' },
      { href: "#teil-b", html: '<span class="text-primary font-semibold">B.</span> Specific Conditions – Motorhome Rental' },
      { href: "#teil-c", html: '<span class="text-primary font-semibold">C.</span> Specific Conditions – Holiday Accommodation (stationary use)' },
      { href: "#teil-d", html: '<span class="text-primary font-semibold">D.</span> Specific Conditions – Event Service' },
    ],
  },
  nodes: [
    { type: "callout", html: "<strong>Note:</strong> This is a non-binding English convenience translation. In case of any conflict, the German version is legally authoritative." },
    { type: "callout", html: "Multiple renters or guests form a community of renters/guests. Each person has identical rights and obligations and is jointly and severally liable." },

    { type: "part", id: "teil-a", label: "Part A", title: "General Provisions" },
    { type: "section", id: "a-1", title: "1. Scope" },
    { type: "p", html: "These General Terms and Conditions (GTC) apply to all contracts between Wohnmobil Berlin Brandenburg (hereinafter \"Lessor\") and the customer (hereinafter \"Renter\" or \"Guest\") concerning the rental of the motorhome for travel purposes (Part B), the use of the motorhome as stationary holiday accommodation (Part C) and the use within the framework of event services (Part D)." },
    { type: "p", html: "Deviating, conflicting or supplementary terms of the Renter shall only become part of the contract if the Lessor expressly agrees to their validity in writing." },

    { type: "section", id: "a-2", title: "2. Conclusion of contract" },
    { type: "p", html: "The presentation of services on the website does not constitute a binding offer. An inquiry by the Renter is an invitation to submit an offer. The contract is concluded only upon the express booking confirmation of the Lessor in text form (e-mail) and – in the case of motorhome rental – by mutual signature of the rental agreement." },
    { type: "p", html: "Verbal agreements are invalid without written confirmation. The transfer of contractual rights to third parties is only permitted with the prior written consent of the Lessor." },

    { type: "section", id: "a-3", title: "3. Prices, payment & deposit" },
    { type: "p", html: "The prices listed on the website at the time of booking apply. Unless stated otherwise, all prices are in Euros including statutory VAT." },
    { type: "p", html: "Unless otherwise agreed, a <strong>down payment of 25 %</strong> of the total price is due immediately upon booking confirmation. The <strong>remaining 75 %</strong> is to be paid no later than 14 days before the start of the rental or arrival. For short-term bookings (less than 14 days before start), the full amount is due immediately. The rental contract is sent to the Renter by e-mail after the booking inquiry and becomes binding upon receipt of the down payment (by bank transfer or in cash)." },
    { type: "p", html: "The Lessor is entitled to demand a security deposit before handover. This amounts to:" },
    { type: "ul", items: [
      "<strong>Motorhome rental:</strong> €1,500 (by bank transfer or cash by arrangement)",
      "<strong>Holiday accommodation & event service:</strong> €200–500 depending on booking scope",
    ]},
    { type: "p", html: "The deposit will be refunded within 14 days after a defect-free return." },

    { type: "section", id: "a-3b", title: "4. Season & availability" },
    { type: "p", html: "The motorhome is rented out seasonally from <strong>April to October</strong>. From November to March, the vehicle is not available." },
    { type: "p", html: "The following seasonal day rates apply for motorhome rental:" },
    { type: "ul", items: [
      "<strong>Peak season (May 1 – September 30):</strong> €129/day",
      "<strong>Off season (April & October):</strong> €119/day",
    ]},

    { type: "section", id: "a-4", title: "5. Right of withdrawal" },
    { type: "p", html: "For contracts concerning the rental of motorhomes, holiday accommodations and services in the area of accommodation and leisure events that are provided at a specific date or for a specific period, there is <strong>no statutory right of withdrawal</strong> pursuant to § 312g (2) no. 9 of the German Civil Code (BGB). Only the cancellation conditions set out in Parts B, C and D apply." },

    { type: "section", id: "a-5", title: "6. Liability of the Lessor" },
    { type: "p", html: "The Lessor is liable without limitation for intent and gross negligence as well as for injury to life, body or health. In the case of slight negligence, the Lessor is only liable for breach of essential contractual obligations (cardinal duties); liability is in this case limited to the foreseeable damage typical of the contract." },
    { type: "p", html: "Strict liability and liability for indirect damages, lost profits or lost holiday enjoyment are excluded to the extent permitted by law." },
    { type: "p", html: "The Lessor is not liable for items brought in by the Renter (e.g. luggage, valuables, photo and video equipment, bicycles). The Renter is recommended to take out their own travel or household insurance." },

    { type: "section", id: "a-6", title: "7. Force majeure" },
    { type: "p", html: "If the performance of the contract becomes impossible or significantly more difficult due to force majeure (e.g. natural events, pandemic, official orders, war), both parties are entitled to terminate the contract. Payments already made will be refunded – less verifiable expenses incurred by the Lessor. Claims for damages are excluded in this case." },

    { type: "section", id: "a-7", title: "8. Data protection" },
    { type: "p", html: "Personal data is collected and processed exclusively for the execution of the contract in accordance with the GDPR. Details can be found in our <a href=\"/datenschutz\" class=\"text-primary hover:underline\">privacy policy</a>." },

    { type: "section", id: "a-8", title: "9. Choice of law, jurisdiction & final provisions" },
    { type: "p", html: "The law of the Federal Republic of Germany shall apply exclusively, to the exclusion of the UN Convention on Contracts for the International Sale of Goods. Place of jurisdiction is – as far as legally permissible – the registered office of the Lessor." },
    { type: "p", html: "Should any provision of these GTC be or become invalid, the validity of the remaining provisions shall remain unaffected. The corresponding statutory provision shall replace the invalid provision." },
    { type: "p", html: "The European Commission provides a platform for online dispute resolution (ODR): <a href=\"https://ec.europa.eu/consumers/odr\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"text-primary hover:underline\">https://ec.europa.eu/consumers/odr</a>. The Lessor is not obliged and not willing to participate in dispute resolution proceedings before a consumer arbitration board." },

    { type: "part", id: "teil-b", label: "Part B", title: "Specific Conditions – Motorhome Rental" },
    { type: "section", id: "b-1", title: "1. Rental period, minimum duration, handover & return" },
    { type: "p", html: "The <strong>minimum rental period is 5 days</strong> (arrival and departure day inclusive). The rental period begins and ends at the dates agreed in the rental contract. Handover and return generally take place at the Lessor's location in Berlin/Brandenburg." },
    { type: "p", html: "If pickup by the Lessor is agreed, the vehicle must be provided fully fueled and in contractual condition at the agreed time and place." },
    { type: "p", html: "The rental relationship does not extend automatically. In case of late return, the Lessor may demand compensation for use pursuant to § 546a BGB as well as a surcharge of €50 per started hour, but at least the daily rental price per started day. Consequential damages (e.g. lost subsequent rentals) shall additionally be borne by the Renter." },

    { type: "section", id: "b-2", title: "2. Number of persons" },
    { type: "p", html: "The motorhome has <strong>4 approved sleeping and seating places</strong> (all with seatbelts). Carrying additional persons is not permitted." },

    { type: "section", id: "b-3", title: "3. Cancellation – motorhome" },
    { type: "p", html: "If the Renter withdraws from the contract, the following flat-rate cancellation fees on the total rental price apply – unless a free rebooking or replacement rental is possible:" },
    { type: "ul", items: [
      "up to 60 days before rental start: 20 %",
      "59 to 30 days before rental start: 50 %",
      "29 to 7 days before rental start: 80 %",
      "less than 7 days before rental start or no-show: 95 %",
    ]},
    { type: "p", html: "The Renter reserves the right to prove that the Lessor has incurred no damage or less damage. Taking out travel cancellation insurance is expressly recommended." },

    { type: "section", id: "b-4", title: "4. Trips abroad & prohibited uses" },
    { type: "p", html: "Trips abroad are only permitted to the following countries, as insurance coverage (in particular comprehensive insurance) only exists there:" },
    { type: "callout", html: "Germany, Netherlands, Denmark, Sweden, Norway, Finland, Poland, Czech Republic, Austria, Switzerland, Hungary, Slovenia, Croatia and Slovakia." },
    { type: "p", html: "Trips to other countries – in particular Belgium, Luxembourg, France, Italy, the Baltic states (Lithuania, Latvia, Estonia), the United Kingdom, Ireland, the Balkans (Serbia, Bosnia, Montenegro, North Macedonia, Albania), Romania, Bulgaria, Belarus, Ukraine and Moldova – are <strong>not insured and not permitted</strong>." },
    { type: "p", html: "The Lessor generally does not permit the use of the vehicle for the following purposes:" },
    { type: "ul", items: [
      "Participation in races, driver training, off-road driving and similar uses.",
      "Transport of highly flammable, toxic or otherwise dangerous substances.",
      "Any use in connection with criminal offences or customs and tax violations, in particular the transport of substances covered by narcotics legislation.",
      "Commercial passenger transport.",
    ]},
    { type: "p", html: "The vehicle may only be driven by drivers named in the rental contract who hold a valid driving licence recognised in Germany. Use under the influence of alcohol, medication or other intoxicating substances is prohibited." },
    { type: "p", html: "<strong>Smoking</strong> in the vehicle is not permitted. In case of violation, a cleaning fee of at least €200 will be charged." },
    { type: "p", html: "<strong>Pets (in particular dogs) are welcome</strong> and allowed at no extra charge. The Renter is obliged to remove or replace any contamination or damage caused by the animal before return." },

    { type: "section", id: "b-5", title: "5. Free kilometres & extra kilometres" },
    { type: "p", html: "<strong>150 free kilometres per rental day</strong> are included in the rental price. Additional kilometres will be charged at <strong>€0.35 per kilometre</strong> and settled upon return." },

    { type: "section", id: "b-6", title: "6. Final cleaning" },
    { type: "p", html: "The motorhome must be <strong>returned cleaned</strong> inside and out. Grey water and toilet tanks must be emptied in any case – this is part of the regular return and is explained at handover." },
    { type: "p", html: "Anyone who does not wish to do the cleaning themselves can add the <strong>interior and exterior cleaning flat fee of €200</strong> directly during booking. If the vehicle is returned uncleaned without this flat fee, cleaning will likewise be charged at €200; in case of particularly heavy soiling, additional effort may be charged at €45 net per hour." },

    { type: "section", id: "b-7", title: "7. Optional extras" },
    { type: "p", html: "The following extras can be added during booking:" },
    { type: "ul", items: [
      "Bed linen: €10 per person (max. 4 persons)",
      "Towel set: €20 per booking",
      "Gas grill: €40 per booking",
      "E-scooter: €75 each (max. 3)",
      "Interior and exterior cleaning: €200 per booking",
    ]},
    { type: "p", html: "The applicable prices and availability result from the booking form on the website." },

    { type: "section", id: "b-8", title: "8. Fuel, oils, minor repairs" },
    { type: "p", html: "The fuel, AdBlue, motor oil, gas and other auxiliary materials consumed during the rental period must be procured by the Renter at their own expense. The vehicle must be returned with a full tank; otherwise the missing fuel plus a service flat fee of €25 will be charged." },
    { type: "p", html: "Minor repairs (e.g. replacement of light bulbs) may be carried out by the Renter via a specialist workshop without prior consultation up to an amount of €150 per individual case. The Lessor reimburses the costs upon presentation of the original invoice and the replaced part. The Renter's own work will not be reimbursed." },

    { type: "section", id: "b-9", title: "9. Breakdowns, flat tyres & responsibility on the road" },
    { type: "p", html: "<strong>A breakdown protection plan is not included.</strong> In the event of a breakdown, a flat tyre or comparable incidents during the rental period, the Renter must arrange for recovery, repair and onward travel themselves and bear the resulting costs. The Renter is expressly recommended to take out their own breakdown protection (e.g. ADAC, ACE) before starting the trip." },
    { type: "p", html: "The Lessor must be informed immediately in case of breakdown. Repairs above €150 per individual case require the prior consent of the Lessor." },

    { type: "section", id: "b-10", title: "10. Non-provision due to prior damage" },
    { type: "p", html: "If the Lessor is unable to provide the motorhome on the agreed date due to damage caused by the previous renter or any other circumstance for which the Lessor is not responsible, payments already made will be refunded in full." },
    { type: "p", html: "<strong>Any further claim for damages by the Renter</strong> (e.g. for booked hotels, travel costs, activities or lost holiday enjoyment) <strong>is excluded</strong>, unless the Lessor is guilty of intent or gross negligence." },

    { type: "section", id: "b-11", title: "11. Duty of care & liability of the Renter" },
    { type: "p", html: "The Renter is obliged to inspect the vehicle before takeover and to report defects in text form. During the rental period, the vehicle must be treated with care, protected from extreme weather conditions (hail, storm, flood) and from vandalism. Warning lights must be addressed in accordance with the operating instructions; oil level and tyre pressure must be checked before longer journeys." },
    { type: "p", html: "The Renter is also liable for the fault of their passengers and fellow travellers within the legal framework." },
    { type: "p", html: "For repairs or damage processing by the Lessor, an hourly rate of €45.00 net per person and a minimum processing fee of €49 plus VAT will be charged." },

    { type: "section", id: "b-12", title: "12. Insurance & damage" },
    { type: "p", html: "The vehicle has third-party liability and comprehensive insurance with a deductible, the amount of which is stated in the rental contract. The Renter is liable up to the amount of the deductible in the event of damage." },
    { type: "p", html: "In case of traffic accidents (also without third-party involvement), fire, wildlife damage and other damage, the police must be called immediately, the Lessor must be notified and a detailed accident report with sketch must be submitted. In case of violations of the prohibited uses or of obligations leading to forfeiture of insurance benefits, the Renter is liable within the legal framework." },

    { type: "section", id: "b-13", title: "13. Loss of keys, papers & subsequent rental" },
    { type: "p", html: "In case of loss of keys or vehicle papers for which the Renter is responsible, they shall bear the costs of replacement and the Lessor's time effort (€45.00 net/hour)." },
    { type: "p", html: "If subsequent rentals fail due to damage, the Renter undertakes to bear the costs of these subsequent bookings until the vehicle is operational again." },

    { type: "section", id: "b-14", title: "14. Technical & visual modifications" },
    { type: "p", html: "The Renter may not make any technical or visual modifications to the vehicle (in particular no paintwork, stickers, adhesive films or interventions in the electrics)." },

    { type: "part", id: "teil-c", label: "Part C", title: "Specific Conditions – Holiday Accommodation (stationary use)" },
    { type: "section", id: "c-1", title: "1. Subject & location" },
    { type: "p", html: "The subject is the provision of the motorhome for stationary use as holiday accommodation at a location agreed between the parties (Lessor's property, pitch or agreed standing location). Use as a vehicle in public road traffic is excluded under this part of the contract." },

    { type: "section", id: "c-2", title: "2. Arrival (check-in) & departure (check-out)" },
    { type: "p", html: "Unless otherwise agreed, the following times apply:" },
    { type: "ul", items: [
      "<strong>Check-in:</strong> from 3:00 pm on the day of arrival",
      "<strong>Check-out:</strong> by 11:00 am on the day of departure",
    ]},
    { type: "p", html: "Earlier arrival or later departure is only possible by prior arrangement and subject to availability. In case of late check-out, the Lessor reserves the right to charge an additional night." },

    { type: "section", id: "c-3", title: "3. Minimum stay, number of persons & prices" },
    { type: "p", html: "The <strong>minimum stay is 3 nights</strong>. The accommodation may only be occupied with the number of persons registered at booking, but no more than <strong>4 persons</strong> (corresponding to the permissible number of sleeping places of the motorhome). Overcrowding entitles the Lessor to terminate the contract without notice and without claim to refund. Accommodating unregistered overnight guests is not permitted." },
    { type: "p", html: "The following prices per night apply (tiered by number of persons):" },
    { type: "ul", items: [
      "1 person: €75/night",
      "2 persons: €100/night",
      "3 persons: €125/night",
      "4 persons: €150/night",
    ]},

    { type: "section", id: "c-4", title: "4. House rules" },
    { type: "ul", items: [
      "<strong>Smoking</strong> in the motorhome is not permitted (cleaning fee in case of violation: €200).",
      "<strong>Pets (in particular dogs) are welcome</strong> and allowed at no extra charge. Any contamination or damage caused by the animal must be removed or replaced before departure.",
      "<strong>Quiet hours</strong> apply from 10:00 pm to 7:00 am. Noisy activities and loud music are prohibited during this time.",
      "<strong>Visitors</strong> are welcome during the day but must be reported to the Lessor and must leave the premises by 10:00 pm.",
      "<strong>Open fire</strong> inside the motorhome and grilling directly at the vehicle are prohibited. Grilling is only permitted at designated places.",
      "Inventory (bed linen, dishes, technical devices) must be handled with care. Damage must be reported immediately.",
    ]},

    { type: "section", id: "c-5", title: "5. Final cleaning, bed linen & utility costs" },
    { type: "p", html: "An <strong>interior and exterior cleaning</strong> can optionally be added during booking for a flat fee of <strong>€200</strong>. Otherwise, the motorhome must be returned cleaned upon departure (broom-clean, rubbish disposed of, dishes washed, personal items removed). In case of excessive soiling or uncleaned return without booked flat fee, cleaning will likewise be charged at €200; additional effort at €45 net per hour." },
    { type: "p", html: "<strong>Bed linen</strong> can be added for a surcharge of €10 per person (max. 4 persons). A <strong>towel set</strong> is optionally available for €20 per booking." },
    { type: "p", html: "Normal use of <strong>electricity, water and gas</strong> is included in the rental price. For long-term stays (over 14 days), the Lessor reserves the right to consumption-based billing; in this case this will be agreed in writing in advance." },

    { type: "section", id: "c-6", title: "6. Cancellation – holiday accommodation" },
    { type: "p", html: "Unless free rebooking or alternative rental is possible, the following cancellation fees on the total price apply:" },
    { type: "ul", items: [
      "up to 30 days before arrival: 20 %",
      "29 to 14 days before arrival: 50 %",
      "13 to 3 days before arrival: 80 %",
      "less than 3 days before arrival or no-show: 95 %",
    ]},
    { type: "p", html: "The Guest reserves the right to prove that the Lessor has incurred no damage or less damage. Travel cancellation insurance is recommended." },

    { type: "section", id: "c-7", title: "7. Registration obligation & visitor's tax" },
    { type: "p", html: "The Renter is obliged to identify themselves with a valid photo ID upon request and, if necessary, to fill in a registration form. Any visitor's tax or bed tax is – as far as legally provided for the location – to be paid on site by the Guest." },

    { type: "section", id: "c-8", title: "8. Liability for items brought in" },
    { type: "p", html: "The Lessor accepts no liability for valuables brought in by the Guest, unless intent or gross negligence is involved. Taking out luggage or household insurance is recommended." },

    { type: "part", id: "teil-d", label: "Part D", title: "Specific Conditions – Event Service" },
    { type: "section", id: "d-1", title: "1. Scope of services, minimum duration & price" },
    { type: "p", html: "Within the framework of the event service, the Lessor provides the motorhome as a mobile lounge, photo location, changing, sleeping or retreat cabin at events (e.g. weddings, photo/film productions, company events, festivals)." },
    { type: "p", html: "The <strong>minimum booking period is 3 days</strong>. The price is <strong>€80 per day</strong> for travel up to <strong>50 km</strong> from the Lessor's location in Berlin/Brandenburg. For greater distances, an individual travel flat fee will be charged according to offer." },
    { type: "p", html: "If delivery, setup or standing time at the event location is agreed, scope and time slots are regulated individually in the offer." },

    { type: "section", id: "d-2", title: "2. Location & setup conditions" },
    { type: "p", html: "The Renter is responsible for ensuring that a suitable, level, drivable and load-bearing pitch is available at the event location and that all necessary <strong>permits</strong> (e.g. special use, pitch permit, GEMA, event registration) have been obtained." },
    { type: "p", html: "If the vehicle cannot be used or can only be used to a limited extent due to lack of access, unsuitable pitch or missing permits, the agreed price remains owed in full." },
    { type: "p", html: "A <strong>power connection</strong> (230 V/16 A) should be provided by the Renter where possible. If not available, a generator can be added for a surcharge." },

    { type: "section", id: "d-3", title: "3. Organiser liability & third-party guests" },
    { type: "p", html: "Vis-à-vis the Lessor, the Renter acts as <strong>organiser</strong> and is liable for all damage caused by them, their employees, service providers, event guests or other third parties to the motorhome or its inventory, within the legal framework." },
    { type: "p", html: "The Renter shall indemnify the Lessor against all third-party claims asserted against the Lessor in connection with the event, unless the Lessor is responsible for them themselves. Taking out <strong>organiser liability insurance</strong> is strongly recommended." },
    { type: "p", html: "The <strong>duty of supervision</strong> over the motorhome and its use during the event lies with the Renter." },

    { type: "section", id: "d-4", title: "4. Weather clause" },
    { type: "p", html: "For outdoor events, the Renter bears the weather risk. Cancellation, postponement or early termination of the event due to unfavourable weather does not entitle to reduction or refund of the rental price." },
    { type: "p", html: "In case of extreme weather events (storm warning from wind force 8, hail, flooding), the Lessor is entitled to remove the vehicle from the event location for safety reasons or to cancel the trip. In this case, payments already made will be partially refunded; further claims are excluded." },

    { type: "section", id: "d-5", title: "5. Cancellation – event service" },
    { type: "p", html: "Due to the high preparation and reservation effort, the following flat-rate cancellation fees on the total price apply for the event service:" },
    { type: "ul", items: [
      "up to 60 days before event: 25 %",
      "59 to 30 days before event: 60 %",
      "29 to 14 days before event: 80 %",
      "less than 14 days before event or non-use: 100 %",
    ]},
    { type: "p", html: "A free rescheduling of the date is – subject to availability – permitted once, provided it is requested in text form at least 30 days before the original date." },

    { type: "section", id: "d-6", title: "6. Cleaning after event use" },
    { type: "p", html: "After event use, the motorhome must be returned in broom-clean condition. Excessive soiling (e.g. confetti, glitter, spilled drinks, make-up residues, petals, candle wax) will be charged with a special cleaning flat fee of at least €150; further damage remains unaffected." },
    { type: "p", html: "Attaching decorations using adhesive tape, nails, screws or similar damaging means to the interior or exterior of the vehicle is prohibited." },

    { type: "section", id: "d-7", title: "7. Photo & film recordings" },
    { type: "p", html: "Photo and film recordings of the motorhome for private purposes are permitted. <strong>Commercial use</strong> of the recordings (e.g. advertising, editorial publication, social media advertising of commercial providers) requires the prior written consent of the Lessor." },

    { type: "footer", html: "By confirming the booking or signing the respective contract, the Renter / Guest confirms that they have read and accepted the above General Terms and Conditions." },
  ],
};

// =====================================================================
// IMPRESSUM
// =====================================================================
const impressumDe: LegalDoc = {
  pageTitle: "Impressum",
  metaTitle: "Impressum | Wohnmobil Berlin Brandenburg",
  metaDescription: "Impressum und Anbieterkennzeichnung gemäß § 5 TMG für Wohnmobil Berlin Brandenburg – Wohnmobilvermietung in Berlin.",
  nodes: [
    { type: "section", id: "i-1", title: "Angaben gemäß § 5 TMG" },
    { type: "p", html: "<img src=\"/contact/adresse.png\" alt=\"Wohnmobilvermietung Nicole Thomas, Clementweg 23, 13127 Berlin\" loading=\"lazy\" class=\"max-w-full h-auto\" />" },
    { type: "section", id: "i-2", title: "Kontakt" },
    { type: "p", html: "<span class=\"block mb-1\">Telefon:</span><img src=\"/contact/telefon.png\" alt=\"Telefonnummer\" loading=\"lazy\" class=\"max-w-full h-auto mb-3\" /><span class=\"block mb-1\">E-Mail:</span><img src=\"/contact/email.png\" alt=\"E-Mail-Adresse\" loading=\"lazy\" class=\"max-w-full h-auto\" />" },
    { type: "section", id: "i-4", title: "Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV" },
    { type: "p", html: "<img src=\"/contact/verantwortlich.png\" alt=\"Nicole Thomas, Clementweg 23, 13127 Berlin\" loading=\"lazy\" class=\"max-w-full h-auto\" />" },
  ],
};

const impressumEn: LegalDoc = {
  pageTitle: "Legal Notice",
  metaTitle: "Legal Notice | Wohnmobil Berlin Brandenburg",
  metaDescription: "Legal notice and provider identification pursuant to § 5 TMG for Wohnmobil Berlin Brandenburg – motorhome rental in Berlin.",
  nodes: [
    { type: "callout", html: "<strong>Note:</strong> This is a non-binding English convenience translation. The German version is legally authoritative." },
    { type: "section", id: "i-1", title: "Information pursuant to § 5 TMG" },
    { type: "p", html: "<img src=\"/contact/adresse.png\" alt=\"Wohnmobilvermietung Nicole Thomas, Clementweg 23, 13127 Berlin, Germany\" loading=\"lazy\" class=\"max-w-full h-auto\" />" },
    { type: "section", id: "i-2", title: "Contact" },
    { type: "p", html: "<span class=\"block mb-1\">Phone:</span><img src=\"/contact/telefon.png\" alt=\"Phone number\" loading=\"lazy\" class=\"max-w-full h-auto mb-3\" /><span class=\"block mb-1\">E-mail:</span><img src=\"/contact/email.png\" alt=\"E-mail address\" loading=\"lazy\" class=\"max-w-full h-auto\" />" },
    { type: "section", id: "i-4", title: "Responsible for content pursuant to § 55 (2) RStV" },
    { type: "p", html: "<img src=\"/contact/verantwortlich.png\" alt=\"Nicole Thomas, Clementweg 23, 13127 Berlin, Germany\" loading=\"lazy\" class=\"max-w-full h-auto\" />" },
  ],
};

// =====================================================================
// DATENSCHUTZ
// =====================================================================
const datenschutzDe: LegalDoc = {
  pageTitle: "Datenschutzerklärung",
  metaTitle: "Datenschutzerklärung | Wohnmobil Berlin Brandenburg",
  metaDescription: "Datenschutzerklärung gemäß DSGVO für die Website von Wohnmobil Berlin Brandenburg – Wohnmobil mieten in Berlin und Brandenburg.",
  nodes: [
    { type: "section", id: "d-1", title: "1. Verantwortlicher" },
    { type: "p", html: "Verantwortlich für die Datenverarbeitung auf dieser Website ist:" },
    { type: "p", html: "<img src=\"/contact/adresse.png\" alt=\"Wohnmobilvermietung Nicole Thomas, Clementweg 23, 13127 Berlin\" loading=\"lazy\" class=\"max-w-full h-auto mb-3\" /><span class=\"block mb-1\">Telefon:</span><img src=\"/contact/telefon.png\" alt=\"Telefonnummer\" loading=\"lazy\" class=\"max-w-full h-auto mb-3\" /><span class=\"block mb-1\">E-Mail:</span><img src=\"/contact/email.png\" alt=\"E-Mail-Adresse\" loading=\"lazy\" class=\"max-w-full h-auto\" />" },

    { type: "section", id: "d-2", title: "2. Allgemeine Hinweise zur Datenverarbeitung" },
    { type: "p", html: "Wir verarbeiten personenbezogene Daten ausschließlich im Rahmen der gesetzlichen Bestimmungen der Datenschutz-Grundverordnung (DSGVO)." },
    { type: "p", html: "Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können." },

    { type: "section", id: "d-3", title: "3. Datenerfassung auf dieser Website – Server-Log-Dateien" },
    { type: "p", html: "Beim Aufruf unserer Website werden automatisch Informationen durch den Hosting-Anbieter erfasst und in sogenannten Server-Log-Dateien gespeichert. Dies sind insbesondere:" },
    { type: "ul", items: [
      "Browsertyp und Browserversion",
      "verwendetes Betriebssystem",
      "Referrer URL",
      "Hostname des zugreifenden Rechners",
      "Uhrzeit der Serveranfrage",
      "IP-Adresse",
    ]},
    { type: "p", html: "Diese Daten werden nicht mit anderen Datenquellen zusammengeführt." },
    { type: "p", html: "Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an stabiler und sicherer Bereitstellung der Website)" },

    { type: "section", id: "d-4", title: "4. Kontaktformular" },
    { type: "p", html: "Wenn Sie uns über das Kontaktformular Anfragen zur Anmietung eines Wohnmobils senden, werden Ihre Angaben aus dem Formular inklusive der von Ihnen dort angegebenen Kontaktdaten gespeichert und verarbeitet." },
    { type: "p", html: "<strong>Verarbeitete Daten:</strong>" },
    { type: "ul", items: ["Name", "E-Mail-Adresse", "Telefonnummer (optional)", "gewünschter Mietzeitraum", "Nachrichteninhalt"] },
    { type: "p", html: "<strong>Zweck der Verarbeitung:</strong>" },
    { type: "ul", items: ["Bearbeitung Ihrer Anfrage", "Erstellung eines Angebots", "Vorbereitung eines Mietvertrags", "Kommunikation im Rahmen der Vermietung"] },
    { type: "p", html: "Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche Maßnahmen)" },
    { type: "p", html: "Speicherdauer: Ihre Daten werden gelöscht, sobald Ihre Anfrage abschließend bearbeitet wurde, sofern keine gesetzlichen Aufbewahrungspflichten bestehen." },

    { type: "section", id: "d-5", title: "5. Kontaktaufnahme über WhatsApp" },
    { type: "p", html: "Wir bieten Ihnen die Möglichkeit, über den Dienst WhatsApp Kontakt mit uns aufzunehmen." },
    { type: "p", html: "Anbieter ist die Meta Platforms Ireland Limited." },
    { type: "p", html: "Wenn Sie WhatsApp nutzen, werden Daten (insbesondere Ihre Telefonnummer und Kommunikationsinhalte) an WhatsApp übermittelt." },
    { type: "p", html: "Wir weisen darauf hin, dass WhatsApp Zugriff auf Metadaten (z.&nbsp;B. Kommunikationszeitpunkte) erhält." },
    { type: "p", html: "Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung durch Nutzung)" },
    { type: "p", html: "Weitere Informationen: <a href=\"https://www.whatsapp.com/legal/privacy-policy\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"text-primary hover:underline\">whatsapp.com/legal/privacy-policy</a>" },

    { type: "section", id: "d-6", title: "6. Kontaktaufnahme über Telegram" },
    { type: "p", html: "Wir bieten Ihnen die Möglichkeit, über den Messenger-Dienst Telegram Kontakt mit uns aufzunehmen." },
    { type: "p", html: "Anbieter ist die Telegram FZ-LLC." },
    { type: "p", html: "Bei Nutzung von Telegram werden personenbezogene Daten (z.&nbsp;B. Benutzername, Nachrichteninhalte) an Telegram übermittelt." },
    { type: "p", html: "Wir haben keinen Einfluss auf die Datenverarbeitung durch Telegram." },
    { type: "p", html: "Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung durch Nutzung)" },
    { type: "p", html: "Weitere Informationen: <a href=\"https://telegram.org/privacy\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"text-primary hover:underline\">telegram.org/privacy</a>" },

    { type: "section", id: "d-7", title: "7. Hosting" },
    { type: "p", html: "Diese Website wird bei einem externen Dienstleister gehostet." },
    { type: "p", html: "Der Hosting-Anbieter verarbeitet personenbezogene Daten (z.&nbsp;B. IP-Adressen) zum Zweck der Bereitstellung der Website." },
    { type: "p", html: "Mit dem Anbieter besteht ein Vertrag zur Auftragsverarbeitung gemäß Art. 28 DSGVO." },

    { type: "section", id: "d-8", title: "8. SSL- bzw. TLS-Verschlüsselung" },
    { type: "p", html: "Diese Seite nutzt aus Sicherheitsgründen eine SSL- bzw. TLS-Verschlüsselung." },
    { type: "p", html: "Eine verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile des Browsers mit „https://\" beginnt." },

    { type: "section", id: "d-9", title: "9. Ihre Rechte" },
    { type: "p", html: "Sie haben jederzeit folgende Rechte:" },
    { type: "ul", items: [
      "Auskunft (Art. 15 DSGVO)",
      "Berichtigung (Art. 16 DSGVO)",
      "Löschung (Art. 17 DSGVO)",
      "Einschränkung der Verarbeitung (Art. 18 DSGVO)",
      "Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)",
      "Datenübertragbarkeit (Art. 20 DSGVO)",
    ]},

    { type: "section", id: "d-10", title: "10. Widerruf Ihrer Einwilligung" },
    { type: "p", html: "Sie können eine bereits erteilte Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen." },

    { type: "section", id: "d-11", title: "11. Beschwerderecht" },
    { type: "p", html: "Sie haben das Recht, sich bei einer Datenschutzaufsichtsbehörde zu beschweren." },
    { type: "p", html: "Zuständig ist z.&nbsp;B.:" },
    { type: "p", html: "Berliner Beauftragte für Datenschutz und Informationsfreiheit<br />Alt-Moabit 59–61<br />10555 Berlin" },
  ],
};

const datenschutzEn: LegalDoc = {
  pageTitle: "Privacy Policy",
  metaTitle: "Privacy Policy | Wohnmobil Berlin Brandenburg",
  metaDescription: "Privacy policy in accordance with the GDPR for the website of Wohnmobil Berlin Brandenburg – rent a motorhome in Berlin and Brandenburg.",
  nodes: [
    { type: "callout", html: "<strong>Note:</strong> This is a non-binding English convenience translation. The German version is legally authoritative." },
    { type: "section", id: "d-1", title: "1. Controller" },
    { type: "p", html: "The controller responsible for data processing on this website is:" },
    { type: "p", html: "<img src=\"/contact/adresse.png\" alt=\"Wohnmobilvermietung Nicole Thomas, Clementweg 23, 13127 Berlin, Germany\" loading=\"lazy\" class=\"max-w-full h-auto mb-3\" /><span class=\"block mb-1\">Phone:</span><img src=\"/contact/telefon.png\" alt=\"Phone number\" loading=\"lazy\" class=\"max-w-full h-auto mb-3\" /><span class=\"block mb-1\">E-mail:</span><img src=\"/contact/email.png\" alt=\"E-mail address\" loading=\"lazy\" class=\"max-w-full h-auto\" />" },

    { type: "section", id: "d-2", title: "2. General notes on data processing" },
    { type: "p", html: "We process personal data exclusively within the framework of the legal provisions of the General Data Protection Regulation (GDPR)." },
    { type: "p", html: "Personal data are all data with which you can be personally identified." },

    { type: "section", id: "d-3", title: "3. Data collection on this website – Server log files" },
    { type: "p", html: "When you access our website, information is automatically collected by the hosting provider and stored in so-called server log files. These are in particular:" },
    { type: "ul", items: [
      "Browser type and version",
      "Operating system used",
      "Referrer URL",
      "Hostname of the accessing computer",
      "Time of the server request",
      "IP address",
    ]},
    { type: "p", html: "This data is not merged with other data sources." },
    { type: "p", html: "Legal basis: Art. 6 (1) lit. f GDPR (legitimate interest in stable and secure provision of the website)" },

    { type: "section", id: "d-4", title: "4. Contact form" },
    { type: "p", html: "If you send us inquiries via the contact form regarding the rental of a motorhome, your information from the form, including the contact details you provide there, will be stored and processed." },
    { type: "p", html: "<strong>Processed data:</strong>" },
    { type: "ul", items: ["Name", "E-mail address", "Phone number (optional)", "Desired rental period", "Message content"] },
    { type: "p", html: "<strong>Purpose of processing:</strong>" },
    { type: "ul", items: ["Processing your inquiry", "Preparing an offer", "Preparing a rental contract", "Communication in the context of the rental"] },
    { type: "p", html: "Legal basis: Art. 6 (1) lit. b GDPR (pre-contractual measures)" },
    { type: "p", html: "Storage period: Your data will be deleted as soon as your inquiry has been finally processed, unless statutory retention obligations apply." },

    { type: "section", id: "d-5", title: "5. Contact via WhatsApp" },
    { type: "p", html: "We offer you the option of contacting us via the WhatsApp service." },
    { type: "p", html: "The provider is Meta Platforms Ireland Limited." },
    { type: "p", html: "When you use WhatsApp, data (in particular your phone number and communication content) will be transmitted to WhatsApp." },
    { type: "p", html: "We point out that WhatsApp has access to metadata (e.g. communication times)." },
    { type: "p", html: "Legal basis: Art. 6 (1) lit. a GDPR (consent through use)" },
    { type: "p", html: "More information: <a href=\"https://www.whatsapp.com/legal/privacy-policy\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"text-primary hover:underline\">whatsapp.com/legal/privacy-policy</a>" },

    { type: "section", id: "d-6", title: "6. Contact via Telegram" },
    { type: "p", html: "We offer you the option of contacting us via the Telegram messenger service." },
    { type: "p", html: "The provider is Telegram FZ-LLC." },
    { type: "p", html: "When using Telegram, personal data (e.g. username, message content) will be transmitted to Telegram." },
    { type: "p", html: "We have no influence on the data processing by Telegram." },
    { type: "p", html: "Legal basis: Art. 6 (1) lit. a GDPR (consent through use)" },
    { type: "p", html: "More information: <a href=\"https://telegram.org/privacy\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"text-primary hover:underline\">telegram.org/privacy</a>" },

    { type: "section", id: "d-7", title: "7. Hosting" },
    { type: "p", html: "This website is hosted by an external service provider." },
    { type: "p", html: "The hosting provider processes personal data (e.g. IP addresses) for the purpose of providing the website." },
    { type: "p", html: "There is a data processing agreement with the provider in accordance with Art. 28 GDPR." },

    { type: "section", id: "d-8", title: "8. SSL/TLS encryption" },
    { type: "p", html: "For security reasons, this site uses SSL or TLS encryption." },
    { type: "p", html: "You can recognize an encrypted connection by the fact that the browser address bar starts with \"https://\"." },

    { type: "section", id: "d-9", title: "9. Your rights" },
    { type: "p", html: "You have the following rights at any time:" },
    { type: "ul", items: [
      "Right of access (Art. 15 GDPR)",
      "Right to rectification (Art. 16 GDPR)",
      "Right to erasure (Art. 17 GDPR)",
      "Restriction of processing (Art. 18 GDPR)",
      "Objection to processing (Art. 21 GDPR)",
      "Data portability (Art. 20 GDPR)",
    ]},

    { type: "section", id: "d-10", title: "10. Withdrawal of your consent" },
    { type: "p", html: "You can withdraw consent already granted at any time with effect for the future." },

    { type: "section", id: "d-11", title: "11. Right to lodge a complaint" },
    { type: "p", html: "You have the right to lodge a complaint with a data protection supervisory authority." },
    { type: "p", html: "Responsible is, for example:" },
    { type: "p", html: "Berlin Commissioner for Data Protection and Freedom of Information<br />Alt-Moabit 59–61<br />10555 Berlin" },
  ],
};

// =====================================================================
// EXPORTS
// =====================================================================
export const legalContent: Record<Language, { agb: LegalDoc; impressum: LegalDoc; datenschutz: LegalDoc }> = {
  de: { agb: agbDe, impressum: impressumDe, datenschutz: datenschutzDe },
  en: { agb: agbEn, impressum: impressumEn, datenschutz: datenschutzEn },
};

/** Localized "as of {month year}" stand line for the AGB header. */
export const formatAsOf = (lang: Language): string => {
  const d = new Date();
  const locale = lang === "de" ? "de-DE" : "en-US";
  const formatted = d.toLocaleDateString(locale, { month: "long", year: "numeric" });
  return lang === "de" ? `Stand: ${formatted}` : `As of: ${formatted}`;
};
