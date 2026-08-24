import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatEuro } from "@/lib/rentalCalculations";

export interface TenantExportData {
  name: string;
  company_name?: string | null;
  street?: string | null;
  postal_code?: string | null;
  city?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  logoDataUrl?: string | null;
}

export interface InventoryExportItem {
  name: string;
  item_type: string;
  quantity: number;
  replacement_price_cents: number;
  active: boolean;
  components?: { name: string; quantity: number }[];
}

const MARGIN = 16;
const dateStamp = () =>
  new Intl.DateTimeFormat("de-DE", { dateStyle: "medium", timeStyle: "short" }).format(new Date());

const fileStamp = () => new Date().toISOString().slice(0, 10);

const slug = (value: string) =>
  value
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "export";

/** Lädt ein Bild (z. B. Mandantenlogo) als Data-URL für die PDF-Einbettung. */
export const loadImageAsDataUrl = async (url: string): Promise<string | null> => {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const blob = await response.blob();
    if (!/^image\/(png|jpeg|jpg|webp)$/.test(blob.type)) return null;
    return await new Promise<string | null>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : null);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
};

const header = (doc: jsPDF, title: string, subtitle: string, logoDataUrl?: string | null) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  let logoBottom = MARGIN;
  if (logoDataUrl) {
    try {
      const props = doc.getImageProperties(logoDataUrl);
      const maxWidth = 40;
      const maxHeight = 18;
      const ratio = Math.min(maxWidth / props.width, maxHeight / props.height);
      const width = props.width * ratio;
      const height = props.height * ratio;
      doc.addImage(logoDataUrl, MARGIN, MARGIN, width, height);
      logoBottom = MARGIN + height + 4;
    } catch {
      /* Logo optional */
    }
  }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(title, MARGIN, logoBottom + 8);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(110);
  doc.text(subtitle, MARGIN, logoBottom + 15);
  doc.text(`Stand: ${dateStamp()}`, pageWidth - MARGIN, logoBottom + 15, { align: "right" });
  doc.setTextColor(0);
  doc.setDrawColor(210);
  doc.line(MARGIN, logoBottom + 19, pageWidth - MARGIN, logoBottom + 19);
  return logoBottom + 27;
};

const footer = (doc: jsPDF, note: string) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const pages = doc.getNumberOfPages();
  for (let page = 1; page <= pages; page += 1) {
    doc.setPage(page);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(130);
    doc.text(note, MARGIN, pageHeight - 10);
    doc.text(`Seite ${page} von ${pages}`, pageWidth - MARGIN, pageHeight - 10, { align: "right" });
    doc.setTextColor(0);
  }
};

/** Exportiert die Stammdaten des Mandanten als PDF-Datenblatt. */
export const exportTenantPdf = (tenant: TenantExportData) => {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const startY = header(
    doc,
    "Mandantendaten",
    tenant.company_name?.trim() || tenant.name,
    tenant.logoDataUrl,
  );

  const rows: [string, string][] = [
    ["Anzeigename (intern)", tenant.name || "—"],
    ["Firmenname", tenant.company_name?.trim() || "—"],
    ["Straße und Hausnummer", tenant.street?.trim() || "—"],
    [
      "PLZ / Ort",
      [tenant.postal_code?.trim(), tenant.city?.trim()].filter(Boolean).join(" ") || "—",
    ],
    ["Telefon", tenant.phone?.trim() || "—"],
    ["E-Mail", tenant.email?.trim() || "—"],
    ["Webseite", tenant.website?.trim() || "—"],
  ];

  autoTable(doc, {
    startY,
    theme: "grid",
    styles: { font: "helvetica", fontSize: 10, cellPadding: 3, overflow: "linebreak" },
    headStyles: { fillColor: [32, 45, 40], textColor: 255 },
    head: [["Feld", "Wert"]],
    body: rows,
    columnStyles: { 0: { cellWidth: 60, fontStyle: "bold" } },
    margin: { left: MARGIN, right: MARGIN },
  });

  footer(doc, "Mandantendaten – interner Export");
  doc.save(`mandantendaten-${slug(tenant.company_name || tenant.name)}-${fileStamp()}.pdf`);
};

/** Exportiert die aktuell gefilterte Inventarliste als PDF-Tabelle. */
export const exportInventoryPdf = (options: {
  items: InventoryExportItem[];
  vehicleName: string;
  tenant: TenantExportData;
  searchTerm?: string;
}) => {
  const { items, vehicleName, tenant, searchTerm } = options;
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const subtitleParts = [tenant.company_name?.trim() || tenant.name, vehicleName].filter(Boolean);
  const startY = header(doc, "Inventarliste", subtitleParts.join(" · "), tenant.logoDataUrl);

  const totalCents = items.reduce(
    (sum, item) => sum + item.replacement_price_cents * (item.item_type === "set" ? 1 : item.quantity),
    0,
  );

  let infoY = startY;
  doc.setFontSize(9);
  doc.setTextColor(110);
  doc.text(
    `${items.length} Positionen · Gesamtwert ${formatEuro(totalCents)}${
      searchTerm?.trim() ? ` · Filter: "${searchTerm.trim()}"` : ""
    }`,
    MARGIN,
    infoY,
  );
  doc.setTextColor(0);
  infoY += 6;

  autoTable(doc, {
    startY: infoY,
    theme: "striped",
    styles: { font: "helvetica", fontSize: 9, cellPadding: 2.5, overflow: "linebreak" },
    headStyles: { fillColor: [32, 45, 40], textColor: 255 },
    head: [["Menge", "Position", "Art", "Ersatzpreis", "Bestandteile", "Status"]],
    body: items.map((item) => [
      String(item.quantity),
      item.name,
      item.item_type === "set" ? "Set" : "Einzelartikel",
      formatEuro(item.replacement_price_cents),
      (item.components ?? []).map((c) => `${c.quantity}× ${c.name}`).join(", ") || "—",
      item.active ? "aktiv" : "inaktiv",
    ]),
    columnStyles: {
      0: { cellWidth: 14, halign: "right" },
      2: { cellWidth: 24 },
      3: { cellWidth: 24, halign: "right" },
      5: { cellWidth: 18 },
    },
    margin: { left: MARGIN, right: MARGIN },
  });

  footer(doc, "Inventarliste – interner Export");
  doc.save(`inventarliste-${slug(vehicleName)}-${fileStamp()}.pdf`);
};
