# Vermieter-Backend aus dem Archiv übernehmen und vollständig ausbauen

## Was im Archiv steckt

Das ZIP ist ein Snapshot der bestehenden Website plus ein neues Admin-Modul für die Mietverwaltung. Prüfung ergab:

- **Datenmodell vollständig durchdacht**: 17 neue Tabellen (Mandanten, Mitglieder, Fahrzeuge, Kunden, Mietverträge, Fahrer, Inventar + Sets, Übergabe-/Rückgabeprotokolle, Schadensmarkierungen, Dokumente, Zahlungen, Rechnungen + Positionen, Bankverbindungen, Audit-Log) samt Rollen `platform_admin`, `tenant_admin`, `employee`, `customer` und Dokumenten-Speicher.
- **Oberflächen sind bislang nur Attrappen**: Dashboard, Mietvertragsliste, Vertrags-Wizard, Rückgabe-Erfassung und Inventarliste arbeiten mit Beispieldaten im Browser – es gibt keine einzige Datenbankabfrage. Fahrzeuge, Kunden und Kalender sind reine Platzhalterseiten.
- **Öffentliche Website** im Archiv entspricht dem Live-Stand und bleibt unangetastet.

Ziel dieses Plans: Datenmodell echt anlegen, die Masken an die Datenbank anbinden und die drei Platzhalter-Module ausbauen.

## Etappe 1 – Datenbank und Speicher

- Migration in zwei Schritten anlegen (neue Rollenwerte müssen vor ihrer Verwendung eigenständig festgeschrieben werden).
- Alle 17 Tabellen inklusive Zugriffsrechten und Zeilenschutz; Zugriff strikt über Mandantenzugehörigkeit (`is_tenant_member` lesend, `is_tenant_staff` schreibend). Kein anonymer Zugriff.
- `updated_at`-Auslöser für alle Tabellen mit diesem Feld.
- Privater Dateispeicher `rental-documents` mit mandantengetrennten Ordnern (`<tenant>/<mietvertrag>/…`) für Ausweis-/Führerscheinfotos, Schadensfotos, Unterschriften und Vertrags-PDFs.
- Startdatensatz: Mandant „Wohnmobil Berlin", das eigene Fahrzeug, die vorhandene Standard-Inventarliste, bestehender Admin-Account als `tenant_admin`.

## Etappe 2 – Grundgerüst und Zugriffsschutz

- Admin-Rahmen (Seitenmenü, Mobil-Navigation, Abmelden) übernehmen, aber auf die Design-Tokens des Projekts umstellen statt fester Farbwerte.
- Zugriffsschutz für alle `/admin`-Routen: nicht angemeldet → Login, angemeldet ohne Mandantenrolle → Hinweis.
- Mandantenkontext (aktiver Mandant, Rolle, Rechte) zentral bereitstellen; Mandantenwechsel für `platform_admin`.
- Alle Admin-Seiten mit „nicht indexieren"-Kennzeichnung.

## Etappe 3 – Mietvertrag anlegen (Kernfluss)

Vertrags-Wizard an die Datenbank anbinden:
1. Zeitraum + Fahrzeug (Konflikte mit bestehenden Belegungen werden geprüft)
2. Mieter und weitere Fahrer inkl. Ausweis-/Führerscheindaten und Gültigkeitswarnungen (Übersteuern wird protokolliert)
3. Preis, Kaution, Freikilometer, Mehrkilometerpreis – Berechnung über die mitgelieferte Rechenlogik
4. Übergabeprotokoll: Kilometerstand, Tank, Wasser, Gas, Inventar-Durchgang, Schadensmarkierungen auf vier Fahrzeugansichten, Fotos
5. Unterschriften Mieter/Vermieter, Statuswechsel und Audit-Eintrag

Zwischenspeichern als Entwurf, Fortsetzen möglich.

## Etappe 4 – Rückgabe und Abrechnung

- Rückgabeprotokoll mit Vergleich zur Übergabe: Mehrkilometer, Tankdifferenz, fehlendes/beschädigtes Inventar, neue Schäden.
- Automatische Kautionsabrechnung (Rückzahlung bzw. offener Betrag) mit Bankverbindung des Mieters.
- Rechnung/Schlussrechnung mit Positionen, Versionierung und Änderungsgrund; Zahlungen erfassen.
- Vertrags- und Protokoll-PDFs serverseitig erzeugen, im Dokumentenspeicher ablegen und per E-Mail über die bestehende Versandstrecke an den Mieter senden.

## Etappe 5 – Die drei Module vollständig ausbauen

- **Fahrzeuge**: Stammdaten, vier Schaden-Ansichten (Bilder hochladbar), fahrzeugbezogenes Inventar, Aktiv/Inaktiv, Schadenshistorie.
- **Kunden**: Suche und Liste, Kundenakte mit Verträgen, Dokumenten, Zahlungen, Dokumentgültigkeiten, Bankverbindung, Zusammenführen von Doppeleinträgen.
- **Belegungskalender**: Monats-/Listenansicht mit eigenen Verträgen plus den bestehenden Portal-Belegungen (iCal), Klick auf freien Zeitraum startet einen neuen Vertrag, Blockierzeiten (Wartung) pflegbar.
- **Übersicht**: echte Kennzahlen – heutige Übergaben/Rückgaben, überfällige Verträge, offene Abrechnungen, ablaufende Dokumente.

## Etappe 6 – Absicherung und Abnahme

- Rechte-Test: Mitarbeiter vs. Mandanten-Admin vs. fremder Mandant.
- Sicherheitsscan und Datenbank-Linter nach der Migration; Findings direkt beheben.
- Tests für Rechenlogik (Tage, Freikilometer, Inventarabzug, Kautionsabrechnung) und ein Durchlauf des Kernflusses im Browser.
- Öffentliche Website bleibt unverändert; Reihenfolge der Routen so, dass `/admin/*` nicht auf die 404-Seite fällt.

## Technische Hinweise

- Die Archiv-Migration enthält **keine** `GRANT`-Anweisungen und legt den Speicher-Bucket per SQL an – beides wird angepasst: Rechte explizit vergeben, Bucket über das Storage-Werkzeug erzeugen, nur die Objekt-Richtlinien per Migration.
- `ALTER TYPE app_role ADD VALUE` kann nicht in derselben Transaktion verwendet werden wie die Richtlinien, die auf die neuen Werte zugreifen → getrennte Migrationen.
- Bestehende `admin`-Rolle bleibt gültig und wird in den Hilfsfunktionen mitgeführt.
- Dateien aus dem Archiv werden gezielt übernommen (Admin-Seiten, `AdminShell`, `rentalCalculations`, `defaultInventory`); Website-Dateien und `.git`/Lockfiles nicht.
- Ausweis-, Führerschein- und Bankdaten sind besonders sensibel: nur über den privaten Speicher, kein öffentlicher Link, Zugriff ausschließlich mandantengebunden, Zugriffe im Audit-Log.
- PDF-Erzeugung und E-Mail-Versand laufen serverseitig in Edge Functions, nicht im Browser.

## Reihenfolge

Etappe 1 und 2 zuerst (Datenbank plus geschützter Rahmen), danach Kernfluss (3, 4), anschließend die Module (5), abschließend Absicherung (6). Nach Etappe 2 und Etappe 4 bietet sich jeweils ein Zwischenblick von dir an.
