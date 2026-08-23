# PDF-Dokumente für Mietvertrag, Übergabe und Rückgabe

Ziel: Für jeden Mietvertrag sowie für Übergabe- und Rückgabeprotokolle serverseitig eine PDF erzeugen, dauerhaft im Dokumentenspeicher ablegen und auf Knopfdruck per E-Mail an den Mieter senden.

## Was der Nutzer bekommt

**Im Mietvertrag (`/admin/mietvertrag/:id`)**
- Button „Mietvertrag als PDF erstellen“ — erzeugt die PDF, speichert sie und zeigt sie in der Dokumentenliste.
- Button „An Mieter senden“ — sendet die zuletzt erzeugte Vertrags-PDF als E-Mail-Anhang an die Mieter-E-Mail (mit Bestätigungs-Toast; deaktiviert, wenn keine E-Mail hinterlegt ist).
- Jede Neuerstellung legt eine neue Version an (Version 1, 2, 3 …), alte Fassungen bleiben nachvollziehbar erhalten.

**In der Übergabe/Rückgabe (`/admin/uebergabe/...`)**
- Button „Protokoll als PDF erstellen“ — jederzeit möglich, auch für Zwischenstände. Titel richtet sich nach Art: „Übergabeprotokoll“ bzw. „Rückgabeprotokoll“.
- Protokoll-PDF enthält: Fahrzeug- und Mietdaten, Kilometerstand, Tank/Frisch-/Abwasser/Gas, Reifen, Reinigung, Ausstattungs-Checkliste, Schlüsselanzahl, Inventarliste mit Abzügen, Schadensliste, die vier Fahrzeugskizzen mit eingezeichneten Markern, Innenbereich-Schäden, Schadensfotos und die beiden Unterschriften.
- Fußzeile mit Mandantendaten (Firma, Adresse, Telefon, E-Mail, Webseite) auf allen PDFs.

## Umsetzung (technisch)

1. **Neue Edge Function `generate-rental-pdf`**
   - Input: `{ rentalId, kind: "contract" | "handover" | "return", inspectionId? }`, JWT-Validierung im Code, Zugriff nur für Mitglieder des Mandanten (`is_tenant_staff`).
   - Lädt alle Daten per Service-Role (rental, customer, drivers, vehicle, tenant, inspection, inspection_inventory, damage_markers, payments, documents mit Medien).
   - PDF-Erzeugung mit `pdf-lib` (npm-Specifier), Unicode-Font für Umlaute eingebettet; Skizzen als Hintergrundbild plus gezeichnete Marker-Punkte mit Nummern, Fotos verkleinert auf Folgeseiten.
   - Speichert nach `rental-documents/<tenantId>/<rentalId>/<typ>-v<version>.pdf` und legt einen Eintrag in `documents` an (`document_type` z. B. „Mietvertrag“, „Übergabeprotokoll“, `version` = höchste bestehende + 1, `is_final` bei abgeschlossener Inspektion).
   - Antwort: Dokument-ID, Pfad, Version.

2. **Neue Edge Function-Ergänzung für den Versand**
   - Neues Template `rental-contract` in `_shared/transactional-email-templates` (deutsch, `allowDynamicRecipient`), Anhang der PDF über den Resend-Attachment-Pfad in `send-transactional-email`; Anhang-Support wird dort ergänzt (Base64 aus Storage).
   - Protokolliert in `email_send_log` wie bisher.
   - Kein Migrationsbedarf für den Versand; falls das Anhang-Handling in der Queue-Verarbeitung nötig ist, wird `process-email-queue` entsprechend erweitert.

3. **Frontend**
   - `src/pages/admin/AdminRentalDetail.tsx`: zwei Buttons (Erstellen, An Mieter senden), Ladezustände, Invalidieren der Dokumentenliste.
   - `src/pages/admin/AdminInspection.tsx`: Button „Protokoll als PDF erstellen“ im Kopfbereich; nach Erzeugung Hinweis mit Downloadlink (signierte URL).
   - Gemeinsamer Helper `src/admin/pdfDocuments.ts` für den Funktionsaufruf und das Öffnen der signierten URL.

4. **Datenbank**
   - Keine Schemaänderung nötig — `documents` deckt Typ, Version, Pfad und `is_final` bereits ab. Ergänzt wird nur ein Index-freier Zählschritt für die Versionierung in der Function.

## Offene Annahmen
- Vertrags-PDF nutzt die bestehenden AGB-/Vertragstexte aus dem Mietvertragsbereich; kein neues juristisches Textwerk.
- Der E-Mail-Versand läuft über die bestehende Absenderdomain notify.wohnmobil-berlin.de.
