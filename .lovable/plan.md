# Status-Check & Restumsetzung Vermieter-Backend

Kurzantwort: Nein, es ist noch nicht alles umgesetzt. Phase 1 steht größtenteils, Phase 2–4 fehlen.

## Was bereits existiert (geprüft)

- Mandantenmodell in der Datenbank: alle 17 gewünschten Tabellen sind angelegt (tenants, tenant_members, vehicles, customers, rentals, drivers, inventory_items, inventory_components, inspections, inspection_inventory, damage_markers, documents, payments, bank_accounts, invoices, invoice_items, audit_logs) mit RLS-Policies und Rollen (platform_admin, tenant_admin, employee, customer).
- Privater Storage-Bucket `rental-documents`.
- Admin-Bereich unter `/admin` mit Login, Mandantenkontext und Rollenprüfung.
- Seiten: Übersicht/Dashboard, Mietverträge, Neuer Mietvertrag (3 Schritte), Belegungskalender, Kunden, Fahrzeuge (inkl. Skizzen-Upload und Schadenshistorie), Inventarliste.
- Freikilometer-/Preis-/Kautionsberechnung als eigene Logikdatei.

## Was noch fehlt

Öffentliche Website bleibt in allen Punkten unverändert.

### Sofort-Korrekturen
- Der öffentliche Floating-Chatbot wird derzeit auch auf `/admin`-Seiten gerendert: auf Adminroute ausblenden.
- Inventar-Startliste ist unvollständig (20 statt der ~48 Positionen aus der PDF-Liste) und es sind noch keine Set-Bestandteile hinterlegt. Restliche Positionen ergänzen, Sets (z. B. Besteckset, Stühle mit Auflagen) mit Bestandteilen anlegen.
- Fahrzeugskizzen: die vier hochgeladenen Zeichnungen (vorn, hinten, Fahrerseite, Beifahrerseite) als Standardskizzen des Fahrzeugs einbinden, weiterhin pro Fahrzeug überschreibbar.

### Phase 2 – Mietvertragsassistent vervollständigen
- Schritt Mieter: vollständige Personen- und Ausweisfelder, Ausweis-Upload Vorder-/Rückseite, OCR-Prüfmaske als Oberfläche mit klarer Kennzeichnung „noch nicht verbunden“ (manuelle Eingabe als sichere Alternative), Format- und Ablaufdatumsprüfung, Wiederverwendung bestehender Kunden.
- Schritt Fahrer: Frage „Mieter ist auch Fahrer?“, beliebig viele weitere Fahrer, Ausweis- und Führerscheinuploads beidseitig, Klassen/Nummer/Daten, Warnung bei abgelaufenen Dokumenten mit dokumentierter Mitarbeiterfreigabe, Sperre für neue Fahrer nach unterschriebener Übergabe.
- Schritt Reise: Reiseziel, Route, erwartete Kilometer, Übergabe-/Rückgabezeit und -ort, 150 Freikilometer je Miettag, Mehrkilometer zu 0,35 EUR.
- Schritt Preise: Preispositionen aus Preisliste plus freie Positionen, Endpreise inkl. USt., Teilzahlungen, Kaution 1.500 EUR (pro Mandant/Fahrzeug einstellbar), Übergabesperre bei offenen Zahlungen mit begründeter Freigabe.
- Mietvertragsnummer: fortlaufender Vorschlag `WB-2026-001`, änderbar, eindeutig je Mandant.
- Kalender: Auswahl belegter/freier Zeiträume als Hotelbuchungs-Range mit Rückfrage „Mietvertrag anlegen?“, Übernahme nur von Start- und Enddatum.
- Übergabeworkflow: Fahrzeugwerte (Kilometer, Tank in fünf Stufen, Gas, Wasser, Schlüssel, Papiere, Sicherheitsausstattung), Inventarprüfung mit Sammelbestätigung und Einzelabweichungen, Schadensmarker X1…Xn je Fahrzeugseite mit Prozentkoordinaten, Fotos/Videos, Vorschadenübernahme je Seite, vier verpflichtende Übersichtsfotos, Einweisungsbestätigungen, digitale Unterschriften von Mieter und Mitarbeiter mit Zeitstempel und Dokumentversion.

### Phase 3 – Rücknahme und Abrechnung
- Aktion „Rückgabe“ direkt aus dem Vertrag, geführter Workflow mit Rückgabewerten, Verspätung, Reinigung.
- Kilometerabrechnung, Inventarprüfung mit fehlenden und beschädigten Stückzahlen, Pflichtfoto bei Schäden, Set-Regel (ein fehlender Bestandteil = voller Setpreis, je Set separat).
- Kautionsabrechnung mit Einzelabzügen, Restrückzahlung und offener Forderung über 1.500 EUR hinaus; dokumentierter Widerspruch des Mieters.
- Bankverbindung erst bei Rücknahme, IBAN-Formalprüfung blockiert den Abschluss, Doppelbestätigung.
- Rechnungen: Rechnung vor Übergabe, Schlussrechnung nach Rücknahme, fortlaufende änderbare Nummer, Versionierung mit Grund und Vorgängerversion.
- Dokumentenarchiv je Mietvorgang: Einzeldownload und Gesamtpaket über kurzlebige signierte Links, Versionierung statt Überschreiben.

### Phase 4 – Portal, Verwaltung, Absicherung
- Mieterportal: eigene Daten, Dokumentuploads, weitere Fahrer, Dokumente ansehen/herunterladen, digital unterschreiben, Übergabe-/Rückgabestatus, Kautionsabrechnung.
- Fehlende Adminseiten: Schäden, Zahlungen, Rechnungen, Dokumente, Mitarbeiter, Mandanteneinstellungen (Preise, Kaution, Zahlungsarten, AGB-Versionen).
- Registrierung neuer Vermieter mit Freigabe durch Plattform-Administrator.
- AGB-Versionierung mit PDF, Hash und Bestätigungsbezug am Vertrag.
- Audit-Log für sensible Zugriffe, Snapshots unveränderbar, PDF-Erzeugung und OCR serverseitig vorbereitet und als „noch nicht verbunden“ gekennzeichnet.
- Mobile-/Tablet-Optimierung, Zwischenspeichern, Warnung bei ungespeicherten Vorgängen, Status nicht nur farblich, EUR-/Datums-/Zeitformate.

## Technische Hinweise

- Weiterverwendung der bestehenden Supabase-Authentifizierung und des `TenantContext`; keine eigene localStorage-Lösung.
- Neue Tabellen sind nicht nötig; ergänzt werden einzelne Spalten (z. B. Übergabe-/Rückgabezeiten, Preislisten, AGB-Versionen, Zahlungsarten) sowie zusätzliche Policies und Indizes.
- Dateiuploads ausschließlich in den privaten Bucket mit signierten URLs; OCR und PDF-Erzeugung als Edge Functions vorbereitet.
- Umsetzung in der genannten Phasenreihenfolge, nach jeder Phase kurze Zusammenfassung von Funktionen, Tabellen/Policies, offenen externen Abhängigkeiten und Tests.
