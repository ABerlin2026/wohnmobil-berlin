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

interface ReferralNotificationProps {
  referrerName?: string
  referrerEmail?: string
  referredName?: string
  referredEmail?: string
  referredPhone?: string
  language?: string
  submittedAt?: string
}

const Row = ({ label, value }: { label: string; value?: string }) => {
  if (!value) return null
  return (
    <Text style={row}>
      <strong style={rowLabel}>{label}:</strong>{' '}
      <span style={rowValue}>{value}</span>
    </Text>
  )
}

const ReferralNotificationEmail = ({
  referrerName,
  referrerEmail,
  referredName,
  referredEmail,
  referredPhone,
  language,
  submittedAt,
}: ReferralNotificationProps) => (
  <Html lang="de" dir="ltr">
    <Head />
    <Preview>Neue Empfehlung über das Empfehlungsprogramm</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>🎉 Neue Empfehlung eingegangen</Heading>
        <Text style={lead}>
          Über das Empfehlungsprogramm wurde eine neue Person empfohlen. Bitte
          zeitnah Kontakt aufnehmen – nach erfolgreicher Buchung sind 50&nbsp;€
          Provision an den Empfehlenden auszuzahlen.
        </Text>

        <Section style={card}>
          <Heading as="h2" style={h2}>👤 Empfehlende Person</Heading>
          <Row label="Name" value={referrerName} />
          <Row label="E-Mail" value={referrerEmail} />
        </Section>

        <Section style={cardHighlight}>
          <Heading as="h2" style={h2}>📞 Empfohlene Person (jetzt kontaktieren)</Heading>
          <Row label="Name" value={referredName} />
          <Row label="E-Mail" value={referredEmail} />
          <Row label="Telefon" value={referredPhone} />
        </Section>

        <Hr style={hr} />

        <Section>
          <Row label="Sprache" value={language} />
          <Row label="Eingegangen am" value={submittedAt} />
        </Section>

        <Text style={footer}>
          Diese Nachricht wurde automatisch von {SITE_NAME} versendet.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: ReferralNotificationEmail,
  subject: '🎉 Neue Empfehlung – jetzt kontaktieren',
  to: 'anfrage@wohnmobil-berlin.de',
  displayName: 'Empfehlung – interne Benachrichtigung',
  previewData: {
    referrerName: 'Max Mustermann',
    referrerEmail: 'max@example.com',
    referredName: 'Lisa Beispiel',
    referredEmail: 'lisa@example.com',
    referredPhone: '+49 170 1234567',
    language: 'DE',
    submittedAt: '26.04.2026, 14:30:00',
  },
} satisfies TemplateEntry

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
}
const container = { padding: '24px 28px', maxWidth: '600px', margin: '0 auto' }
const h1 = {
  fontSize: '22px',
  fontWeight: 700,
  color: '#0f172a',
  margin: '0 0 12px',
}
const h2 = {
  fontSize: '15px',
  fontWeight: 700,
  color: '#0f172a',
  margin: '0 0 10px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.04em',
}
const lead = {
  fontSize: '14px',
  color: '#475569',
  lineHeight: '1.6',
  margin: '0 0 20px',
}
const card = {
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  padding: '16px 18px',
  margin: '0 0 14px',
}
const cardHighlight = {
  backgroundColor: '#ecfdf5',
  border: '1px solid #34a85333',
  borderLeft: '4px solid #34a853',
  borderRadius: '8px',
  padding: '16px 18px',
  margin: '0 0 14px',
}
const row = {
  fontSize: '14px',
  color: '#0f172a',
  margin: '0 0 6px',
  lineHeight: '1.5',
}
const rowLabel = { color: '#475569', fontWeight: 600 }
const rowValue = { color: '#0f172a' }
const hr = { borderColor: '#e2e8f0', margin: '20px 0' }
const footer = {
  fontSize: '12px',
  color: '#94a3b8',
  margin: '20px 0 0',
  textAlign: 'center' as const,
}
