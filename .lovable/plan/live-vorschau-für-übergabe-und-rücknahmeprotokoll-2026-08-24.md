# Live-Vorschau für Übergabe- und Rücknahmeprotokoll

## Ziel

Im Übergabe-/Rücknahmeformular gibt es einen Button „Vorschau aktualisieren“. Er erzeugt aus den **aktuell im Formular eingetragenen Werten** (auch noch nicht gespeicherten) ein PDF und öffnet es in einem neuen Tab. Die Vorschau ist deutlich als Entwurf gekennzeichnet und wird **nicht** im Dokumentenarchiv gespeichert.

## Verhalten

- Neuer Button im Kopfbereich neben „Protokoll als PDF“, beschriftet „Vorschau aktualisieren“.
- Enthält alle Formulareingaben: Füllstände, Kilometerstand, Schlüssel, Ausstattungs-Häkchen, Inventarprüfung mit Abzügen, Schadensliste inkl. Skizzen-Marker, Notizen, Bestätigungen und – falls schon gezeichnet – die Unterschriften.
- Jede PDF-Seite trägt einen diagonalen Wasserzeichen-Hinweis „VORSCHAU – nicht unterschrieben“ sowie Zeitstempel, damit ein Entwurf nie mit dem Endprotokoll verwechselt wird.
- Kein Eintrag in `documents`, keine Versionszählung, kein E-Mail-Versand. Die Datei wird nur als temporärer Download bereitgestellt und öffnet sich im neuen Tab.
- Der Button ist auch bei abgeschlossenen Protokollen nutzbar (dann ohne Wasserzeichen-Sinn: dort bleibt der bestehende „Protokoll als PDF“-Weg unverändert).
- Fehler und Ladezustand werden wie beim bestehenden PDF-Button über Toast und deaktivierten Button angezeigt.

## Technische Umsetzung

**Edge Function `generate-rental-pdf`**
- Neue Body-Felder: `preview: boolean` und `draft: { ... }` mit den Formularwerten (Inspektionsfelder, Inventarzeilen, Schadensmarker).
- Bei `preview: true`: Inspektions- und Inventardaten werden aus `draft` gelesen statt aus der Datenbank; Stammdaten (Mietvertrag, Kunde, Fahrzeug, Mandant) kommen weiterhin aus der Datenbank. Auth- und Mandantenprüfung bleiben unverändert.
- Bei `preview: true` wird der Speicher-/Archiv-/E-Mail-Block übersprungen. Das PDF wird stattdessen als Base64 im Response zurückgegeben (kein Storage-Objekt, damit nichts aufräumbedürftig zurückbleibt).
- `pdf.ts` erhält eine Wasserzeichen-Option, die pro Seite gezeichnet wird.

**Client**
- `src/admin/rentalPdf.ts`: neue Funktion `previewRentalPdf({ rentalId, kind, vehicle, draft })`, die das Base64-PDF in einen Blob umwandelt, eine Object-URL erzeugt und diese zurückgibt; alte Object-URLs werden freigegeben.
- `src/pages/admin/AdminInspection.tsx`: Sammelt den aktuellen Formularstand (bestehende State-Objekte, Inventarzeilen, Marker, Unterschriften-Data-URLs) in ein `draft`-Objekt, ruft `previewRentalPdf` auf und öffnet die Object-URL per `window.open` im neuen Tab. Eigener Busy-State getrennt vom Speichern.

## Nicht Teil dieser Änderung

- Vertrags-PDF-Vorschau in der Mietvertragsansicht (dort gibt es keine unbestätigten Formulareingaben; kann später ergänzt werden).
- Automatische Aktualisierung bei jeder Eingabe.
