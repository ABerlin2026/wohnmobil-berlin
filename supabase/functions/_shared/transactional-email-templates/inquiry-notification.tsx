import * as React from 'npm:react@18.3.1'
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Wohnmobil Berlin'

interface CostLine {
  label: string
  amount: string
}

interface InquiryNotificationProps {
  bookingType?: string
  name?: string
  email?: string
  phone?: string
  birthdate?: string
  startDate?: string
  endDate?: string
  rentalDays?: number | string
  destination?: string
  country?: string
  kilometers?: string
  adults?: string
  children?: string
  pet?: string
  message?: string
  extras?: string
  totalGross?: string
  costBreakdown?: CostLine[]
  submittedAt?: string
}

const Row = ({ label, value }: { label: string; value?: string | number }) => {
  if (value === undefined || value === null || value === '') return null
  return (
    <Text style={row}>
      <strong style={rowLabel}>{label}:</strong>{' '}
      <span style={rowValue}>{String(value)}</span>
    </Text>
  )
}

const InquiryNotificationEmail = ({
  bookingType,
  name,
  email,
  phone,
  birthdate,
  startDate,
  endDate,
  rentalDays,
  destination,
  country,
  kilometers,
  adults,
  children,
  pet,
  message,
  extras,
  totalGross,
  costBreakdown,
  submittedAt,
}: InquiryNotificationProps) => (
  <Html lang="de" dir="ltr">
    <Head />
    <Preview>
      Neue Anfrage von {name || 'Gast'}
      {bookingType ? ` (${bookingType})` : ''}
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Neue Anfrage über {SITE_NAME}</Heading>
        <Text style={subtitle}>
          Über das Anfrageformular auf wohnmobil-berlin.de wurde gerade eine
          unverbindliche Anfrage gesendet.
        </Text>

        <Section style={card}>
          <Heading as="h2" style={h2}>Buchung</Heading>
          <Row label="Buchungstyp" value={bookingType} />
          <Row label="Anreise" value={startDate} />
          <Row label="Abreise" value={endDate} />
          <Row label="Tage" value={rentalDays} />
          <Row label="Reiseziel" value={destination} />
          <Row label="Land der Nutzung" value={country} />
          <Row label="Geplante Kilometer" value={kilometers} />
        </Section>

        {(costBreakdown && costBreakdown.length > 0) || totalGross ? (
          <Section style={card}>
            <Heading as="h2" style={h2}>Kostenaufstellung (brutto)</Heading>
            {costBreakdown?.map((line, i) => (
              <Text key={i} style={costRow}>
                <span style={rowValue}>{line.label}</span>
                <span style={costAmount}>{line.amount}</span>
              </Text>
            ))}
            {totalGross && (
              <>
                <Hr style={costHr} />
                <Text style={costRow}>
                  <strong style={rowLabel}>Gesamt</strong>
                  <strong style={costTotal}>{totalGross}</strong>
                </Text>
              </>
            )}
          </Section>
        ) : null}

        <Section style={card}>
          <Heading as="h2" style={h2}>Personen</Heading>
          <Row label="Erwachsene" value={adults} />
          <Row label="Kinder" value={children} />
          <Row label="Haustier" value={pet} />
        </Section>

        <Section style={card}>
          <Heading as="h2" style={h2}>Extras</Heading>
          <Text style={row}>{extras || '—'}</Text>
        </Section>

        <Section style={card}>
          <Heading as="h2" style={h2}>Kontaktdaten</Heading>
          <Row label="Name" value={name} />
          <Row label="E-Mail" value={email} />
          <Row label="Telefon" value={phone} />
          <Row label="Geburtsdatum" value={birthdate} />
        </Section>

        {message && (
          <Section style={card}>
            <Heading as="h2" style={h2}>Nachricht</Heading>
            <Text style={messageText}>{message}</Text>
          </Section>
        )}

        <Hr style={hr} />
        <Text style={footer}>
          Eingegangen am {submittedAt || new Date().toLocaleString('de-DE')} ·
          {' '}{SITE_NAME}
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: InquiryNotificationEmail,
  subject: (data: Record<string, any>) =>
    `Neue Anfrage: ${data?.name ?? 'Gast'}${data?.bookingType ? ` (${data.bookingType})` : ''}`,
  to: 'anfrage@wohnmobil-berlin.de',
  displayName: 'Anfrage-Benachrichtigung',
  previewData: {
    bookingType: 'Wohnmobil-Miete',
    name: 'Max Mustermann',
    email: 'max@example.com',
    phone: '+49 170 1234567',
    birthdate: '1985-06-15',
    startDate: 'Mo, 12.05.2025',
    endDate: 'Sa, 17.05.2025',
    rentalDays: 6,
    destination: 'Ostsee',
    country: 'Deutschland',
    kilometers: '1200',
    adults: '2',
    children: '1',
    pet: 'nein',
    message: 'Wir freuen uns auf den Trip!',
    extras: 'Bettwäsche (2), Grill, Endreinigung',
    costBreakdown: [
      { label: '2 Nächte Hauptsaison × 129,00 €', amount: '258,00 €' },
      { label: '3 Nächte Nebensaison × 119,00 €', amount: '357,00 €' },
      { label: 'Extras (Bettwäsche, Grill, Endreinigung)', amount: '260,00 €' },
      { label: 'Mehrkilometer (300 km × 0,35 €)', amount: '105,00 €' },
    ],
    totalGross: '980,00 €',
    submittedAt: '24.04.2026, 14:32',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif', margin: 0, padding: 0 }
const container = { padding: '24px', maxWidth: '600px', margin: '0 auto' }
const h1 = { fontSize: '22px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 8px' }
const h2 = { fontSize: '14px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 8px', textTransform: 'uppercase' as const, letterSpacing: '0.05em' }
const subtitle = { fontSize: '14px', color: '#55575d', margin: '0 0 24px', lineHeight: '1.5' }
const card = { backgroundColor: '#f8fafc', borderRadius: '8px', padding: '16px', margin: '0 0 16px', border: '1px solid #e2e8f0' }
const row = { fontSize: '14px', color: '#0f172a', margin: '0 0 6px', lineHeight: '1.5' }
const rowLabel = { color: '#475569', fontWeight: 600 }
const rowValue = { color: '#0f172a' }
const messageText = { fontSize: '14px', color: '#0f172a', margin: 0, lineHeight: '1.6', whiteSpace: 'pre-wrap' as const }
const hr = { borderColor: '#e2e8f0', margin: '24px 0 12px' }
const footer = { fontSize: '12px', color: '#999999', margin: 0, textAlign: 'center' as const }
