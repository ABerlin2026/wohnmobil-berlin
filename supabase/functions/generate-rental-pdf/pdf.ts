import {
  PDFDocument,
  StandardFonts,
  rgb,
  type PDFFont,
  type PDFImage,
  type PDFPage,
} from 'npm:pdf-lib@1.17.1'

const A4: [number, number] = [595.28, 841.89]
const MARGIN = 48
const BOTTOM = 92

/** Ersetzt Zeichen, die WinAnsi (Helvetica) nicht kennt. */
const sanitize = (value: string) =>
  value
    .replace(/[\u2018\u2019\u201A]/g, "'")
    .replace(/[\u201C\u201D\u201E]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/\u00a0/g, ' ')
    .replace(/[^\x00-\xff]/g, '')

export interface FooterInfo {
  lines: string[]
}

export class PdfBuilder {
  private doc!: PDFDocument
  private page!: PDFPage
  private font!: PDFFont
  private bold!: PDFFont
  private y = 0
  private footer: FooterInfo = { lines: [] }
  private title = ''
  private watermark: string | null = null

  static async create(title: string, footer: FooterInfo, watermark?: string | null) {
    const builder = new PdfBuilder()
    builder.doc = await PDFDocument.create()
    builder.font = await builder.doc.embedFont(StandardFonts.Helvetica)
    builder.bold = await builder.doc.embedFont(StandardFonts.HelveticaBold)
    builder.footer = footer
    builder.title = title
    builder.watermark = watermark ?? null
    builder.addPage()
    return builder
  }


  get width() {
    return A4[0]
  }

  get contentWidth() {
    return A4[0] - MARGIN * 2
  }

  addPage() {
    this.page = this.doc.addPage(A4)
    this.y = A4[1] - MARGIN
    this.drawFooter()
  }

  private drawFooter() {
    const size = 7.5
    let fy = 46
    this.page.drawLine({
      start: { x: MARGIN, y: 60 },
      end: { x: A4[0] - MARGIN, y: 60 },
      thickness: 0.5,
      color: rgb(0.8, 0.8, 0.8),
    })
    for (const line of this.footer.lines) {
      this.page.drawText(sanitize(line), {
        x: MARGIN,
        y: fy,
        size,
        font: this.font,
        color: rgb(0.42, 0.42, 0.42),
      })
      fy -= size + 2
    }
  }

  ensure(space: number) {
    if (this.y - space < BOTTOM) this.addPage()
  }

  gap(space = 8) {
    this.y -= space
  }

  heading(text: string, size = 16) {
    this.ensure(size + 14)
    this.page.drawText(sanitize(text), {
      x: MARGIN,
      y: this.y - size,
      size,
      font: this.bold,
      color: rgb(0.09, 0.11, 0.13),
    })
    this.y -= size + 10
  }

  subheading(text: string) {
    this.y -= 6
    this.ensure(46)
    this.page.drawText(sanitize(text), {
      x: MARGIN,
      y: this.y - 11,
      size: 11,
      font: this.bold,
      color: rgb(0.13, 0.16, 0.19),
    })
    this.y -= 20
    this.page.drawLine({
      start: { x: MARGIN, y: this.y + 6 },
      end: { x: A4[0] - MARGIN, y: this.y + 6 },
      thickness: 0.5,
      color: rgb(0.85, 0.85, 0.85),
    })
    this.y -= 4
  }

  text(value: string, options: { size?: number; bold?: boolean; indent?: number } = {}) {
    const size = options.size ?? 9.5
    const font = options.bold ? this.bold : this.font
    const indent = options.indent ?? 0
    const maxWidth = this.contentWidth - indent
    for (const line of wrap(sanitize(value), font, size, maxWidth)) {
      this.ensure(size + 4)
      this.page.drawText(line, {
        x: MARGIN + indent,
        y: this.y - size,
        size,
        font,
        color: rgb(0.15, 0.17, 0.2),
      })
      this.y -= size + 3.5
    }
  }

  /** Zweispaltige Label/Wert-Liste. */
  keyValues(rows: [string, string][], columns = 2) {
    const colWidth = this.contentWidth / columns
    for (let i = 0; i < rows.length; i += columns) {
      const chunk = rows.slice(i, i + columns)
      this.ensure(24)
      const top = this.y
      let used = 0
      chunk.forEach(([label, value], index) => {
        const x = MARGIN + index * colWidth
        this.page.drawText(sanitize(label), {
          x,
          y: top - 9,
          size: 8,
          font: this.font,
          color: rgb(0.45, 0.47, 0.5),
        })
        const lines = wrap(sanitize(value || '-'), this.bold, 10, colWidth - 12)
        lines.forEach((line, lineIndex) => {
          this.page.drawText(line, {
            x,
            y: top - 22 - lineIndex * 12,
            size: 10,
            font: this.bold,
            color: rgb(0.1, 0.12, 0.15),
          })
        })
        used = Math.max(used, 22 + lines.length * 12)
      })
      this.y = top - used - 6
    }
  }

  table(headers: string[], rows: string[][], widths: number[]) {
    const total = widths.reduce((a, b) => a + b, 0)
    const cols = widths.map((w) => (w / total) * this.contentWidth)
    this.ensure(28)
    let x = MARGIN
    headers.forEach((header, index) => {
      this.page.drawText(sanitize(header), {
        x,
        y: this.y - 9,
        size: 8.5,
        font: this.bold,
        color: rgb(0.3, 0.32, 0.36),
      })
      x += cols[index]
    })
    this.y -= 14
    this.page.drawLine({
      start: { x: MARGIN, y: this.y + 3 },
      end: { x: A4[0] - MARGIN, y: this.y + 3 },
      thickness: 0.5,
      color: rgb(0.85, 0.85, 0.85),
    })
    this.y -= 4

    for (const row of rows) {
      const cellLines = row.map((cell, index) =>
        wrap(sanitize(cell || '-'), this.font, 9, cols[index] - 8),
      )
      const height = Math.max(...cellLines.map((lines) => lines.length)) * 12 + 4
      this.ensure(height)
      const top = this.y
      let cx = MARGIN
      cellLines.forEach((lines, index) => {
        lines.forEach((line, lineIndex) => {
          this.page.drawText(line, {
            x: cx,
            y: top - 9 - lineIndex * 12,
            size: 9,
            font: this.font,
            color: rgb(0.15, 0.17, 0.2),
          })
        })
        cx += cols[index]
      })
      this.y = top - height
    }
    this.y -= 4
  }

  async embedImage(bytes: Uint8Array, mime: string): Promise<PDFImage | null> {
    try {
      if (mime.includes('png')) return await this.doc.embedPng(bytes)
      return await this.doc.embedJpg(bytes)
    } catch (_error) {
      return null
    }
  }

  /** Skizze inkl. Markerpunkte zeichnen. */
  drawDiagram(
    image: PDFImage,
    markers: { label: string; x: number; y: number }[],
    caption: string,
    maxWidth = this.contentWidth / 2 - 10,
  ) {
    const scale = maxWidth / image.width
    const width = maxWidth
    const height = image.height * scale
    this.ensure(height + 30)
    const top = this.y
    this.page.drawText(sanitize(caption), {
      x: MARGIN,
      y: top - 10,
      size: 9.5,
      font: this.bold,
      color: rgb(0.15, 0.17, 0.2),
    })
    const imageTop = top - 18
    this.page.drawImage(image, { x: MARGIN, y: imageTop - height, width, height })
    for (const marker of markers) {
      const cx = MARGIN + (marker.x / 100) * width
      const cy = imageTop - (marker.y / 100) * height
      this.page.drawCircle({
        x: cx,
        y: cy,
        size: 6,
        color: rgb(0.85, 0.16, 0.16),
        opacity: 0.85,
      })
      this.page.drawText(sanitize(marker.label), {
        x: cx + 8,
        y: cy - 3,
        size: 7.5,
        font: this.bold,
        color: rgb(0.6, 0.08, 0.08),
      })
    }
    this.y = imageTop - height - 12
  }

  drawPhoto(image: PDFImage, caption: string) {
    const maxWidth = this.contentWidth / 2 - 8
    const scale = Math.min(maxWidth / image.width, 190 / image.height)
    const width = image.width * scale
    const height = image.height * scale
    this.ensure(height + 26)
    const top = this.y
    this.page.drawImage(image, { x: MARGIN, y: top - height, width, height })
    this.page.drawText(sanitize(caption), {
      x: MARGIN,
      y: top - height - 11,
      size: 8,
      font: this.font,
      color: rgb(0.4, 0.42, 0.45),
    })
    this.y = top - height - 22
  }

  signatures(entries: { label: string; image: PDFImage | null; note?: string }[]) {
    this.ensure(120)
    const top = this.y
    const boxWidth = this.contentWidth / 2 - 12
    entries.slice(0, 2).forEach((entry, index) => {
      const x = MARGIN + index * (boxWidth + 24)
      if (entry.image) {
        const scale = Math.min(boxWidth / entry.image.width, 60 / entry.image.height)
        this.page.drawImage(entry.image, {
          x,
          y: top - 70,
          width: entry.image.width * scale,
          height: entry.image.height * scale,
        })
      }
      this.page.drawLine({
        start: { x, y: top - 78 },
        end: { x: x + boxWidth, y: top - 78 },
        thickness: 0.6,
        color: rgb(0.6, 0.62, 0.65),
      })
      this.page.drawText(sanitize(entry.label), {
        x,
        y: top - 92,
        size: 8.5,
        font: this.font,
        color: rgb(0.35, 0.37, 0.4),
      })
      if (entry.note) {
        this.page.drawText(sanitize(entry.note), {
          x,
          y: top - 104,
          size: 8,
          font: this.font,
          color: rgb(0.5, 0.52, 0.55),
        })
      }
    })
    this.y = top - 116
  }

  async save() {
    // Seitenzahlen ergänzen
    const pages = this.doc.getPages()
    pages.forEach((page, index) => {
      page.drawText(sanitize(`${this.title} · Seite ${index + 1} von ${pages.length}`), {
        x: A4[0] - MARGIN - 190,
        y: 46,
        size: 7.5,
        font: this.font,
        color: rgb(0.5, 0.52, 0.55),
      })
    })
    return await this.doc.save()
  }
}

function wrap(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const paragraphs = String(text ?? '').split('\n')
  const lines: string[] = []
  for (const paragraph of paragraphs) {
    const words = paragraph.split(/\s+/).filter(Boolean)
    if (words.length === 0) {
      lines.push('')
      continue
    }
    let current = ''
    for (const word of words) {
      const candidate = current ? `${current} ${word}` : word
      if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
        current = candidate
      } else {
        if (current) lines.push(current)
        current = word
      }
    }
    if (current) lines.push(current)
  }
  return lines
}
