import * as React from 'npm:react@18.3.1'
import {
  Body,
  Button,
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

interface RentalContractProps {
  documentLabel?: string
  customerName?: string
  rentalNumber?: string
  vehicleName?: string
  startDate?: string
  endDate?: string
  priceLabel?: string
  depositLabel?: string
  downloadUrl?: string
  companyName?: string
  contactLine?: string
}

const Row = ({ label, value }: { label: string; value?: string }) => {
  if (!value) return null
  return (
    <Text style={row}>
      <strong style={rowLabel}>{label}:</strong> <span style={rowValue}>{value}</span>
    </Text>
  )
}

const RentalContractEmail = ({
  documentLabel = 'Mietvertrag',
  customerName,
  rentalNumber,
  vehicleName,
  startDate,
  endDate,
  priceLabel,
  depositLabel,
  downloadUrl,
  companyName = 'Wohnmobil Berlin',
  contactLine,
}: RentalContractProps) => (
  <Html lang="de" dir="ltr">
    <Head>
      <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
    </Head>
    <Preview>Dein {documentLabel} {rentalNumber ?? ''} zum Download</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>
          {customerName ? `Hallo ${customerName},` : 'Hallo,'}
        </Heading>
        <Text style={subtitle}>
          hier ist dein {documentLabel} {rentalNumber ? `zum Mietvertrag ${rentalNumber} ` : ''}als PDF. Bitte
          prüfe die Angaben und melde dich, wenn etwas nicht passt.
        </Text>

        <Section style={card}>
          <Heading as="h2" style={h2}>Übersicht</Heading>
          <Row label="Vertragsnummer" value={rentalNumber} />
          <Row label="Fahrzeug" value={vehicleName} />
          <Row label="Mietbeginn" value={startDate} />
          <Row label="Mietende" value={endDate} />
          <Row label="Mietpreis" value={priceLabel} />
          <Row label="Kaution" value={depositLabel} />
        </Section>

        {downloadUrl && (
          <Section style={{ textAlign: 'center' as const, margin: '24px 0' }}>
            <Button href={downloadUrl} style={button}>
              {documentLabel} als PDF öffnen
            </Button>
            <Text style={hint}>
              Der Download-Link ist aus Sicherheitsgründen 14 Tage gültig. Bitte speichere
              das PDF direkt auf deinem Gerät.
            </Text>
          </Section>
        )}

        <Text style={closing}>
          Für Rückfragen antworte einfach auf diese E-Mail.
        </Text>

        <Hr style={hr} />
        <Text style={footer}>
          {companyName}
          {contactLine ? ` · ${contactLine}` : ''}
        </Text>
      </Container>
    </Body>
  </Html>
)

const main = { backgroundColor: '#f5f5f4', fontFamily: 'Helvetica, Arial, sans-serif' }
const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '32px 28px',
  maxWidth: '560px',
  borderRadius: '14px',
}
const h1 = { fontSize: '20px', color: '#1c1917', margin: '0 0 12px' }
const h2 = { fontSize: '14px', color: '#1c1917', margin: '0 0 10px' }
const subtitle = { fontSize: '14px', lineHeight: '22px', color: '#44403c' }
const card = {
  backgroundColor: '#fafaf9',
  borderRadius: '10px',
  padding: '16px 18px',
  margin: '16px 0',
}
const row = { fontSize: '13px', lineHeight: '20px', margin: '0 0 4px', color: '#44403c' }
const rowLabel = { color: '#78716c' }
const rowValue = { color: '#1c1917' }
const button = {
  backgroundColor: '#166534',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: 600,
  padding: '12px 22px',
  borderRadius: '8px',
  textDecoration: 'none',
}
const hint = { fontSize: '11px', color: '#78716c', marginTop: '12px' }
const closing = { fontSize: '13px', color: '#44403c' }
const hr = { borderColor: '#e7e5e4', margin: '20px 0 12px' }
const footer = { fontSize: '11px', color: '#78716c' }

export const template: TemplateEntry = {
  component: RentalContractEmail,
  subject: (data: Record<string, any>) =>
    `Dein ${data?.documentLabel || 'Mietvertrag'}${data?.rentalNumber ? ` ${data.rentalNumber}` : ''}`,
  displayName: 'Mietvertrag (PDF-Link)',
  // Kein allowDynamicRecipient: Versand erfolgt ausschließlich serverseitig
  // durch generate-rental-pdf mit Service-Role.
  previewData: {
    documentLabel: 'Mietvertrag',
    customerName: 'Max Mustermann',
    rentalNumber: 'MV-20260424-101500',
    vehicleName: 'Wohnmobil Berlin 1',
    startDate: '12.05.2026',
    endDate: '17.05.2026',
    priceLabel: '980,00 EUR',
    depositLabel: '500,00 EUR',
    downloadUrl: 'https://example.com/mietvertrag.pdf',
    companyName: 'Wohnmobil Berlin',
    contactLine: '+49 170 1234567 · wohnmobil.berlin@gmx.de',
  },
}
