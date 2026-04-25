/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface BookingNotificationProps {
  name?: string
  email?: string
  phone?: string
  bookingType?: string
  startDate?: string
  endDate?: string
  adults?: string | number
  children?: string | number
  pet?: string
  destination?: string
  kilometers?: string | number
  country?: string
  birthdate?: string
  driverAge?: number | null
  extras?: string
  message?: string
  totalPrice?: string | number
}

const bookingTypeLabel = (type?: string) => {
  switch (type) {
    case 'rental': return 'Wohnmobil-Vermietung'
    case 'event': return 'Event-Übernachtung'
    case 'holiday': return 'Ferienwohnung am Wohnmobil'
    default: return type || '–'
  }
}

const Row = ({ label, value }: { label: string; value?: string | number | null }) => {
  if (value === undefined || value === null || value === '') return null
  return (
    <Text style={rowStyle}>
      <strong style={labelStyle}>{label}:</strong> {String(value)}
    </Text>
  )
}

const BookingNotificationEmail = (props: BookingNotificationProps) => {
  const {
    name, email, phone, bookingType, startDate, endDate, adults, children, pet,
    destination, kilometers, country, birthdate, driverAge, extras, message, totalPrice,
  } = props
  return (
    <Html lang="de" dir="ltr">
      <Head />
      <Preview>Neue Anfrage von {name || 'Gast'}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>📩 Neue Buchungsanfrage</Heading>
          </Section>

          <Section style={card}>
            <Heading style={h2}>Buchung</Heading>
            <Row label="Art" value={bookingTypeLabel(bookingType)} />
            <Row label="Anreise" value={startDate} />
            <Row label="Abreise" value={endDate} />
            <Row label="Erwachsene" value={adults} />
            <Row label="Kinder" value={children} />
            <Row label="Haustier" value={pet} />
            <Row label="Reiseziel" value={destination} />
            <Row label="Kilometer" value={kilometers} />
            <Row label="Extras" value={extras} />
            <Row label="Geschätzter Preis" value={totalPrice ? `${totalPrice} €` : undefined} />
          </Section>

          <Section style={card}>
            <Heading style={h2}>Kontaktdaten</Heading>
            <Row label="Name" value={name} />
            <Row label="E-Mail" value={email} />
            <Row label="Telefon" value={phone} />
            <Row label="Land" value={country} />
            <Row label="Geburtsdatum" value={birthdate} />
            <Row label="Fahreralter" value={driverAge ?? undefined} />
          </Section>

          {message && (
            <Section style={card}>
              <Heading style={h2}>Nachricht</Heading>
              <Text style={messageText}>{message}</Text>
            </Section>
          )}

          <Text style={footer}>
            Diese E-Mail wurde automatisch über das Anfrage-Formular auf
            wohnmobil-berlin.de gesendet.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: BookingNotificationEmail,
  subject: (data: Record<string, any>) =>
    `Neue Anfrage: ${bookingTypeLabel(data?.bookingType)}${data?.name ? ` – ${data.name}` : ''}`,
  displayName: 'Anfrage-Benachrichtigung (Vermieter)',
  to: 'anfrage@wohnmobil-berlin.de',
  previewData: {
    name: 'Anna Müller',
    email: 'anna@example.com',
    phone: '+49 170 1234567',
    bookingType: 'rental',
    startDate: '15.06.2025',
    endDate: '22.06.2025',
    adults: 2,
    children: 1,
    pet: 'nein',
    country: 'DE',
    birthdate: '1985-04-12',
    driverAge: 39,
    extras: '2× Bettwäsche, Handtücher, Grill',
    message: 'Wir freuen uns auf einen Familienurlaub an der Ostsee.',
    totalPrice: 1290,
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: '"Plus Jakarta Sans", Arial, sans-serif' }
const container = { padding: '24px 28px', maxWidth: '600px', margin: '0 auto' }
const header = { borderBottom: '3px solid hsl(105, 50%, 45%)', paddingBottom: '12px', marginBottom: '20px' }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: '#0d0d0d', margin: 0 }
const h2 = { fontSize: '15px', fontWeight: 'bold' as const, color: 'hsl(105, 50%, 35%)', margin: '0 0 10px', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }
const card = { backgroundColor: '#f7f7f7', borderRadius: '12px', padding: '16px 20px', margin: '0 0 16px' }
const rowStyle = { fontSize: '14px', color: '#0d0d0d', lineHeight: '1.6', margin: '4px 0' }
const labelStyle = { color: '#5d5d5d', fontWeight: '600' as const }
const messageText = { fontSize: '14px', color: '#0d0d0d', lineHeight: '1.6', margin: 0, whiteSpace: 'pre-wrap' as const }
const footer = { fontSize: '12px', color: '#8c8c8c', lineHeight: '1.5', margin: '20px 0 0', textAlign: 'center' as const }
