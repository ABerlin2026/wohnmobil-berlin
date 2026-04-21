/**
 * Knowledge base for the Camper Berlin chatbot.
 *
 * Contains:
 *  - Condensed summary of the public website (pricing, FAQ, services).
 *  - Equipment checklist from the handover PDF — ITEMS ONLY.
 *
 * IMPORTANT — explicitly EXCLUDED on the user's request:
 *  - All "bei Verlust / Defekt"-Preise (replacement / damage costs) from the PDF.
 *    The chatbot must NOT quote replacement prices. If a guest asks about loss
 *    or damage fees, it must defer to WhatsApp (+49 173 1980777).
 */
export const KNOWLEDGE_BASE = `
=== WEBSEITE: CAMPER BERLIN — WOHNMOBIL MIETEN BERLIN & BRANDENBURG ===

# Über uns
Wohnmobil-Vermietung mit Standort in Berlin (Pankow, PLZ 13127). Camper für 4 Personen,
Vollkasko inklusive, Haustiere willkommen. Übergabe in Berlin, Auslandsfahrten in
ausgewählten Ländern erlaubt.

# Preise (Klassische Miete)
- Nebensaison (April & Oktober): 119 € / Tag
- Hauptsaison (1. Mai – 30. September): 129 € / Tag
- 150 Freikilometer pro Tag inklusive
- Mehrkilometer: 0,35 € / km
- Vollkasko inklusive (Selbstbeteiligung im Schadensfall: 1.500 €)
- Mindestmietdauer: 5 Tage
- Kaution: 1.500 € (Überweisung oder bar)
- Reinigung: kostenlos bei sauberer Rückgabe, sonst 200 € Pauschale
- Anzahlung: 25 % bei Buchungsbestätigung, Rest 14 Tage vor Reiseantritt
- Vermietungszeitraum: April–Oktober (1. November – 31. März Winterpause)
- Mindestalter Fahrer: 30 Jahre, Führerschein Klasse B reicht aus

# Extras (zubuchbar)
- Bettwäsche: 10 € pro Person (max. 4)
- Handtücher: 20 €
- Gasgrill: 40 €
- E-Scooter: 75 € pro Stück (max. 3)
- Innen- & Außenreinigung Pauschale: 200 €

# Event-Übernachtung
- 80 € pro Tag bei Anfahrt unter 50 km von Berlin
- Mindestmietdauer: 3 Tage
- Wohnmobil bleibt vor dem Veranstaltungsort stehen, wird nicht gefahren
- Bis zu 4 Personen
- Ideal für Hochzeiten, Geburtstage, Firmenfeiern

# Ferienwohnung Berlin (PLZ 13127)
- Wohnmobil stationär auf einem Alt-Berliner Hof
- Preise pro Nacht: 1 P. 75 € · 2 P. 100 € · 3 P. 125 € · 4 P. 150 €
- Mindestaufenthalt: 3 Nächte
- 2 Doppelbetten an Bord
- Separate Toiletten & Duschen auf dem Gelände
- Kostenloser Parkplatz vorhanden
- Kein WLAN — eigenen Datentarif/Hotspot mitbringen
- Persönlicher Check-in, Check-out ohne Übergabe

# Fahrzeug-Steckbrief
- Modell: Citroën, Aufbau Ilusion 740 (teilintegriert)
- Maße: 7,40 m × 2,35 m × 2,73 m (L × B × H)
- Schaltgetriebe (manuell, kein Automatik)
- 130 PS, Diesel mit AdBlue, ca. 10 l / 100 km
- Zuladung: max. 500 kg (Frischwassertank 150 l zählt mit)
- Versorgerbatterie + Solaranlage: 1–5 Tage autark
- 4 Sitzplätze mit 3-Punkt-Gurten (KEIN ISOFIX)

# Auslandsfahrten — erlaubte Länder
Deutschland, Niederlande, Dänemark, Schweden, Norwegen, Finnland, Polen, Tschechien,
Österreich, Schweiz, Ungarn, Slowenien, Kroatien, Slowakei.

NICHT erlaubt (Versicherung deckt nicht ab):
Belgien, Luxemburg, Frankreich, Italien, Litauen, Lettland, Estland, Großbritannien,
Irland, Serbien, Bosnien-Herzegowina, Montenegro, Nordmazedonien, Albanien,
Rumänien, Bulgarien, Belarus, Ukraine, Moldau.

# Übergabe & Rückgabe
- Übergabe in Berlin Pankow (PLZ 13127), genaue Adresse nach Buchungsbestätigung
- Übergabe in der Regel ab 15:00 Uhr, Rückgabe bis 11:00 Uhr
- Persönliche Einweisung dauert ca. 45–60 Minuten
- Vollgetankt übergeben, vollgetankt zurückgeben (sonst Servicepauschale 25 €)
- Gefüllte Gasflasche im Mietpreis enthalten
- Grauwasser & Toilette bei Rückgabe entleeren

# Stornierung
- Bis 60 Tage vorher: 20 % des Mietpreises
- Bis 30 Tage vorher: 50 %
- Bis 7 Tage vorher: 80 %
- Ab 6 Tage vorher: 95 %
- Reiserücktrittsversicherung empfohlen (von uns selbst nicht angeboten)

# Sonstiges
- Festivals: NICHT erlaubt
- Rauchen im Fahrzeug: NICHT erlaubt (sonst 250 € Sonderreinigung)
- Kein Schutzbrief / keine Pannenhilfe inkludiert — eigenen Schutzbrief (z. B. ADAC) empfohlen
- Rabatt ab 14 Tagen Mietdauer auf Anfrage

=== AUSSTATTUNGSLISTE (KOMPLETT, AUS ÜBERGABE-CHECKLISTE) ===
Hinweis: Diese Liste zeigt, was an Bord ist. Verlust- oder Defektkosten werden hier
absichtlich NICHT genannt — bei solchen Fragen bitte direkt per WhatsApp anfragen.

# Grundausstattung (außen / technisch)
- 2× Gasflasche (11 kg)
- 50 m Anschlusskabel
- 4× Holzbretter für Stützen
- 2× Auffahrkeile
- Kehrschaufel + Besen
- Klapptisch
- 4× Campingstühle
- 4× Auflagen für Campingstühle
- Gasgrill
- Hammer + Heringe
- Markise
- Sturmband
- Standardwerkzeugkasten
- Fußabtreter / Gummimatte
- Trittstufe
- 1× Fahrzeugschlüssel
- Rückfahrkamera
- Fahrradhalterung
- 2× Bettgitter

# Küchenutensilien (für 4 Personen)
- 4× große flache Teller
- 4× kleine flache Teller
- 4× tiefe Teller (Suppenteller)
- 4× Tassen
- 4× Trinkgläser
- 4× Weingläser
- 4× Sektgläser
- 4× Gabeln
- 4× Messer
- 4× Esslöffel
- 4× Dessertlöffel
- 4× Dessertgabeln
- 1× Küchenmesser
- 1× Brotmesser
- 1× Schneidemesser
- 2× Scheren
- 1× Dosenöffner
- 1× Korkenzieher
- 1× Pfannenwender
- 1× Suppenkelle
- 1× Grillzange
- 1× Nudelkelle
- 1× Holzlöffel
- 1× Pfanne
- 1× Spülschüssel
- Spülschwamm + Geschirrtücher

# Was Gäste selbst mitbringen sollten (Empfehlung aus Checkliste)
Bad: 2–4× Badetücher, 2–4× kleine Handtücher, Seife, Zahnbürsten, Zahnpasta,
Shampoo, Duschgel, Badeschlappen, Toilettenpapier, Desinfektionsspray,
Waschmittel, Sonnencreme, Anti-Mücken-Spray, Reiseapotheke, Haarfön,
Kulturbeutel zum Aufhängen, ggf. Damen-/Kinder-Hygieneartikel.

Nützlich: Wandler 12V→230V, Mehrfachsteckdose, AUX-Kabel, Outdoor-Zubehör
(Kompass, Fernglas, Regenjacken, Picknickdecke), Reparaturzubehör (Panzerband,
Isolierband, Kabelbinder, Draht, Kriechöl), Kerzen / Teelichter, Schreibblock
& Kugelschreiber, Kühltasche, Batterien (6× AAA + 4× AA).

=== KONTAKT ===
- WhatsApp / Telefon: +49 173 1980777
- E-Mail: info@wohnmobil-berlin.de
`.trim();
