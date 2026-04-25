/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface RecoveryEmailProps {
  siteName: string
  confirmationUrl: string
}

export const RecoveryEmail = ({
  siteName,
  confirmationUrl,
}: RecoveryEmailProps) => (
  <Html lang="de" dir="ltr">
    <Head />
    <Preview>Passwort zurücksetzen für {siteName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={brand}>Wohnmobil Berlin</Heading>
        </Section>
        <Heading style={h1}>Passwort zurücksetzen</Heading>
        <Text style={text}>
          Wir haben eine Anfrage erhalten, dein Passwort für {siteName} zurückzusetzen.
          Klicke auf den Button unten, um ein neues Passwort zu wählen.
        </Text>
        <Button style={button} href={confirmationUrl}>
          Passwort zurücksetzen
        </Button>
        <Text style={footer}>
          Falls du keine Passwort-Zurücksetzung angefordert hast, kannst du diese
          E-Mail ignorieren – dein Passwort bleibt unverändert.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default RecoveryEmail

const main = { backgroundColor: '#ffffff', fontFamily: '"Plus Jakarta Sans", Arial, sans-serif' }
const container = { padding: '24px 28px', maxWidth: '560px', margin: '0 auto' }
const header = { borderBottom: '3px solid hsl(105, 50%, 45%)', paddingBottom: '12px', marginBottom: '24px' }
const brand = { fontSize: '20px', fontWeight: 'bold' as const, color: 'hsl(105, 50%, 35%)', margin: 0, letterSpacing: '0.5px' }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: '#0d0d0d', margin: '0 0 20px' }
const text = { fontSize: '15px', color: '#3d3d3d', lineHeight: '1.6', margin: '0 0 18px' }
const button = {
  backgroundColor: 'hsl(105, 50%, 45%)',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: '600' as const,
  borderRadius: '12px',
  padding: '13px 24px',
  textDecoration: 'none',
  display: 'inline-block',
  margin: '8px 0 24px',
}
const footer = { fontSize: '13px', color: '#8c8c8c', lineHeight: '1.6', margin: '24px 0 0', borderTop: '1px solid #eaeaea', paddingTop: '16px' }
