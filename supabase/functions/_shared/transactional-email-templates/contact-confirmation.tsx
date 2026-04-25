/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Html, Link, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Wohnmobil Berlin'
const SITE_URL = 'https://wohnmobil-berlin.de'

interface ContactConfirmationProps {
  name?: string
  bookingType?: string
  startDate?: string
  endDate?: string
}

const bookingTypeLabel = (type?: string) => {
  switch (type) {
    case 'rental': return 'Wohnmobil-Vermietung'
    case 'event': return 'Event-Übernachtung'
    case 'holiday': return 'Ferienwohnung am Wohnmobil'
    default: return null
  }
}

const ContactConfirmationEmail = ({ name, bookingType, startDate, endDate }: ContactConfirmationProps) => {
  const typeLabel = bookingTypeLabel(bookingType)
  return (
    <Html lang="de" dir="ltr">
      <Head />
      <Preview>Wir haben deine Anfrage erhalten – {SITE_NAME}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>Wohnmobil Berlin</Heading>
          </Section>

          <Heading style={h2}>
            {name ? `Hallo ${name},` : 'Hallo,'}
          </Heading>
          <Text style={text}>
            vielen Dank für deine Anfrage! Wir haben sie erhalten und melden uns
            so schnell wie möglich – in der Regel innerhalb weniger Stunden.
          </Text>

          {typeLabel && (
            <Section style={summaryBox}>
              <Text style={summaryLine}><strong>Buchungsart:</strong> {typeLabel}</Text>
              {startDate && endDate && (
                <Text style={summaryLine}>
                  <strong>Zeitraum:</strong> {startDate} – {endDate}
                </Text>
              )}
            </Section>
          )}

          <Text style={text}>
            Solltest du eine schnelle Antwort benötigen, erreichst du uns auch
            direkt per WhatsApp oder Telefon.
          </Text>

          <Button style={button} href={SITE_URL}>
            Zur Website
          </Button>

          <Text style={footer}>
            Liebe Grüße<br />
            Dein Team von {SITE_NAME}<br />
            <Link href={SITE_URL} style={link}>wohnmobil-berlin.de</Link>
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: ContactConfirmationEmail,
  subject: 'Wir haben deine Anfrage erhalten – Wohnmobil Berlin',
  displayName: 'Anfrage-Bestätigung (Gast)',
  previewData: {
    name: 'Anna',
    bookingType: 'rental',
    startDate: '15.06.2025',
    endDate: '22.06.2025',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: '"Plus Jakarta Sans", Arial, sans-serif' }
const container = { padding: '24px 28px', maxWidth: '560px', margin: '0 auto' }
const header = { borderBottom: '3px solid hsl(105, 50%, 45%)', paddingBottom: '12px', marginBottom: '24px' }
const h1 = { fontSize: '20px', fontWeight: 'bold' as const, color: 'hsl(105, 50%, 35%)', margin: 0, letterSpacing: '0.5px' }
const h2 = { fontSize: '20px', fontWeight: 'bold' as const, color: '#0d0d0d', margin: '0 0 16px' }
const text = { fontSize: '15px', color: '#3d3d3d', lineHeight: '1.6', margin: '0 0 16px' }
const summaryBox = { backgroundColor: '#f4faf3', borderLeft: '4px solid hsl(105, 50%, 45%)', borderRadius: '8px', padding: '14px 18px', margin: '8px 0 20px' }
const summaryLine = { fontSize: '14px', color: '#0d0d0d', lineHeight: '1.6', margin: '4px 0' }
const button = { backgroundColor: 'hsl(105, 50%, 45%)', color: '#ffffff', fontSize: '15px', fontWeight: '600' as const, borderRadius: '12px', padding: '13px 24px', textDecoration: 'none', display: 'inline-block', margin: '8px 0 24px' }
const footer = { fontSize: '13px', color: '#8c8c8c', lineHeight: '1.6', margin: '24px 0 0', borderTop: '1px solid #eaeaea', paddingTop: '16px' }
const link = { color: 'hsl(105, 50%, 35%)', textDecoration: 'underline' }
