/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface ReauthenticationEmailProps {
  token: string
}

export const ReauthenticationEmail = ({ token }: ReauthenticationEmailProps) => (
  <Html lang="de" dir="ltr">
    <Head />
    <Preview>Dein Bestätigungscode</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={brand}>Wohnmobil Berlin</Heading>
        </Section>
        <Heading style={h1}>Identität bestätigen</Heading>
        <Text style={text}>Verwende den folgenden Code, um deine Identität zu bestätigen:</Text>
        <Text style={codeStyle}>{token}</Text>
        <Text style={footer}>
          Der Code ist nur kurze Zeit gültig. Falls du das nicht angefordert hast,
          kannst du diese E-Mail ignorieren.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default ReauthenticationEmail

const main = { backgroundColor: '#ffffff', fontFamily: '"Plus Jakarta Sans", Arial, sans-serif' }
const container = { padding: '24px 28px', maxWidth: '560px', margin: '0 auto' }
const header = { borderBottom: '3px solid hsl(105, 50%, 45%)', paddingBottom: '12px', marginBottom: '24px' }
const brand = { fontSize: '20px', fontWeight: 'bold' as const, color: 'hsl(105, 50%, 35%)', margin: 0, letterSpacing: '0.5px' }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: '#0d0d0d', margin: '0 0 20px' }
const text = { fontSize: '15px', color: '#3d3d3d', lineHeight: '1.6', margin: '0 0 18px' }
const codeStyle = {
  fontFamily: 'Courier, monospace',
  fontSize: '26px',
  fontWeight: 'bold' as const,
  color: 'hsl(105, 50%, 35%)',
  letterSpacing: '4px',
  backgroundColor: '#f4faf3',
  borderRadius: '12px',
  padding: '16px 20px',
  textAlign: 'center' as const,
  margin: '0 0 24px',
}
const footer = { fontSize: '13px', color: '#8c8c8c', lineHeight: '1.6', margin: '24px 0 0', borderTop: '1px solid #eaeaea', paddingTop: '16px' }
