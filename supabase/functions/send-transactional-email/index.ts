import * as React from 'npm:react@18.3.1'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { TEMPLATES } from '../_shared/transactional-email-templates/registry.ts'

// Configuration baked in at scaffold time — do NOT change these manually.
// To update, re-run the email domain setup flow.
const SITE_NAME = "wohnmobil-berlin"
// SENDER_DOMAIN is the verified sender subdomain FQDN (e.g., "notify.example.com").
// It MUST match the subdomain delegated to Lovable's nameservers — never the root domain.
// The email API looks up this exact domain; a mismatch causes "No email domain record found".
const SENDER_DOMAIN = "notify.wohnmobil-berlin.de"
// FROM_DOMAIN is the domain shown in the From: header (e.g., "example.com").
// When display_from_root is enabled, this can be the root domain for cleaner branding,
// even though actual sending uses the subdomain above.
const FROM_DOMAIN = "wohnmobil-berlin.de"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
}

// ─── In-memory IP rate limit ─────────────────────────────────────────────────
// Caveat: resets on cold-start; pro Edge-Function-Instanz separat.
// Stoppt trotzdem den Großteil opportunistischer Bursts von einer einzelnen IP.
const RATE_LIMIT_PER_MINUTE = 5
const RATE_LIMIT_PER_HOUR = 20
type IpEntry = {
  minuteBucketStart: number
  minuteCount: number
  hourBucketStart: number
  hourCount: number
}
const ipBuckets = new Map<string, IpEntry>()

function getClientIp(req: Request): string {
  return (
    req.headers.get('cf-connecting-ip') ||
    req.headers.get('x-real-ip') ||
    (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() ||
    'unknown'
  )
}

function checkRateLimit(ip: string): { allowed: boolean; reason?: string } {
  const now = Date.now()
  const entry = ipBuckets.get(ip) ?? {
    minuteBucketStart: now,
    minuteCount: 0,
    hourBucketStart: now,
    hourCount: 0,
  }
  if (now - entry.minuteBucketStart > 60_000) {
    entry.minuteBucketStart = now
    entry.minuteCount = 0
  }
  if (now - entry.hourBucketStart > 3_600_000) {
    entry.hourBucketStart = now
    entry.hourCount = 0
  }
  entry.minuteCount += 1
  entry.hourCount += 1
  ipBuckets.set(ip, entry)

  // Soft GC to avoid unbounded growth
  if (ipBuckets.size > 5000) {
    for (const [k, v] of ipBuckets) {
      if (now - v.hourBucketStart > 3_600_000) ipBuckets.delete(k)
    }
  }

  if (entry.minuteCount > RATE_LIMIT_PER_MINUTE) return { allowed: false, reason: 'minute' }
  if (entry.hourCount > RATE_LIMIT_PER_HOUR) return { allowed: false, reason: 'hour' }
  return { allowed: true }
}

// Generate a cryptographically random 32-byte hex token
function generateToken(): string {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

// Auth note: this function uses verify_jwt = true in config.toml, so Supabase's
// gateway validates the caller's JWT (anon or service_role) before the request
// reaches this code. No in-function auth check is needed.

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  // Rate limit per IP (in-memory; resets on cold start, per instance).
  // Service-role calls (server-to-server) skip the limit.
  const authHeader = req.headers.get('authorization') || ''
  const isServiceRole = authHeader.includes(Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '___never___')
  if (!isServiceRole) {
    const ip = getClientIp(req)
    const rl = checkRateLimit(ip)
    if (!rl.allowed) {
      console.warn(`[send-transactional-email-block] reason=ratelimit-${rl.reason} ip=${ip}`)
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please wait a moment and try again.' }),
        {
          status: 429,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
            'Retry-After': rl.reason === 'minute' ? '60' : '3600',
          },
        },
      )
    }
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing required environment variables')
    return new Response(
      JSON.stringify({ error: 'Server configuration error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }

  // Parse request body
  let templateName: string
  let recipientEmail: string
  let idempotencyKey: string
  let messageId: string
  let templateData: Record<string, any> = {}
  try {
    const body = await req.json()
    templateName = body.templateName || body.template_name
    recipientEmail = body.recipientEmail || body.recipient_email
    messageId = crypto.randomUUID()
    idempotencyKey = body.idempotencyKey || body.idempotency_key || messageId
    if (body.templateData && typeof body.templateData === 'object') {
      templateData = body.templateData
    }
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid JSON in request body' }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }

  if (!templateName) {
    return new Response(
      JSON.stringify({ error: 'templateName is required' }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }

  // 1. Look up template from registry (early — needed to resolve recipient)
  const template = TEMPLATES[templateName]

  if (!template) {
    console.error('Template not found in registry', { templateName })
    return new Response(
      JSON.stringify({
        error: `Template '${templateName}' not found. Available: ${Object.keys(TEMPLATES).join(', ')}`,
      }),
      {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }

  // Resolve effective recipient: template-level `to` takes precedence over
  // the caller-provided recipientEmail. This allows notification templates
  // to always send to a fixed address (e.g., site owner from env var).
  const effectiveRecipient = template.to || recipientEmail

  if (!effectiveRecipient) {
    return new Response(
      JSON.stringify({
        error: 'recipientEmail is required (unless the template defines a fixed recipient)',
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }

  // Open-relay protection: templates without a hardcoded `to` may only be
  // invoked when explicitly opted in via `allowDynamicRecipient`. This
  // prevents anonymous callers from using the function as a generic mailer
  // to arbitrary addresses from our verified sending domain.
  if (!template.to && !template.allowDynamicRecipient && !isServiceRole) {
    console.warn('[send-transactional-email-block] reason=dynamic-recipient-not-allowed', { templateName })
    return new Response(
      JSON.stringify({ error: 'This template does not allow dynamic recipients' }),
      { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }

  // Validate recipient email format and length to limit relay abuse.
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (
    typeof effectiveRecipient !== 'string' ||
    effectiveRecipient.length > 254 ||
    !emailRegex.test(effectiveRecipient)
  ) {
    return new Response(
      JSON.stringify({ error: 'Invalid recipientEmail' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }

  // For dynamic-recipient templates invoked by non-service-role callers,
  // require that templateData.email matches the recipient. This ensures the
  // confirmation email's body content corresponds to the recipient and
  // prevents using the template to deliver crafted content to third parties.
  if (
    !template.to &&
    template.allowDynamicRecipient &&
    !isServiceRole
  ) {
    const dataEmail = typeof templateData?.email === 'string' ? templateData.email.toLowerCase() : ''
    if (dataEmail !== effectiveRecipient.toLowerCase()) {
      return new Response(
        JSON.stringify({ error: 'recipientEmail must match templateData.email' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }
  }

  // Create Supabase client with service role (bypasses RLS)
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  // 2. Check suppression list (fail-closed: if we can't verify, don't send)
  const { data: suppressed, error: suppressionError } = await supabase
    .from('suppressed_emails')
    .select('id')
    .eq('email', effectiveRecipient.toLowerCase())
    .maybeSingle()

  if (suppressionError) {
    console.error('Suppression check failed — refusing to send', {
      error: suppressionError,
      effectiveRecipient,
    })
    return new Response(
      JSON.stringify({ error: 'Failed to verify suppression status' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }

  if (suppressed) {
    // Log the suppressed attempt
    await supabase.from('email_send_log').insert({
      message_id: messageId,
      template_name: templateName,
      recipient_email: effectiveRecipient,
      status: 'suppressed',
    })

    console.log('Email suppressed', { effectiveRecipient, templateName })
    return new Response(
      JSON.stringify({ success: false, reason: 'email_suppressed' }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }

  // 3. Get or create unsubscribe token (one token per email address)
  const normalizedEmail = effectiveRecipient.toLowerCase()
  let unsubscribeToken: string

  // Check for existing token for this email
  const { data: existingToken, error: tokenLookupError } = await supabase
    .from('email_unsubscribe_tokens')
    .select('token, used_at')
    .eq('email', normalizedEmail)
    .maybeSingle()

  if (tokenLookupError) {
    console.error('Token lookup failed', {
      error: tokenLookupError,
      email: normalizedEmail,
    })
    await supabase.from('email_send_log').insert({
      message_id: messageId,
      template_name: templateName,
      recipient_email: effectiveRecipient,
      status: 'failed',
      error_message: 'Failed to look up unsubscribe token',
    })
    return new Response(
      JSON.stringify({ error: 'Failed to prepare email' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }

  if (existingToken && !existingToken.used_at) {
    // Reuse existing unused token
    unsubscribeToken = existingToken.token
  } else if (!existingToken) {
    // Create new token — upsert handles concurrent inserts gracefully
    unsubscribeToken = generateToken()
    const { error: tokenError } = await supabase
      .from('email_unsubscribe_tokens')
      .upsert(
        { token: unsubscribeToken, email: normalizedEmail },
        { onConflict: 'email', ignoreDuplicates: true }
      )

    if (tokenError) {
      console.error('Failed to create unsubscribe token', {
        error: tokenError,
      })
      await supabase.from('email_send_log').insert({
        message_id: messageId,
        template_name: templateName,
        recipient_email: effectiveRecipient,
        status: 'failed',
        error_message: 'Failed to create unsubscribe token',
      })
      return new Response(
        JSON.stringify({ error: 'Failed to prepare email' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // If another request raced us, our upsert was silently ignored.
    // Re-read to get the actual stored token.
    const { data: storedToken, error: reReadError } = await supabase
      .from('email_unsubscribe_tokens')
      .select('token')
      .eq('email', normalizedEmail)
      .maybeSingle()

    if (reReadError || !storedToken) {
      console.error('Failed to read back unsubscribe token after upsert', {
        error: reReadError,
        email: normalizedEmail,
      })
      await supabase.from('email_send_log').insert({
        message_id: messageId,
        template_name: templateName,
        recipient_email: effectiveRecipient,
        status: 'failed',
        error_message: 'Failed to confirm unsubscribe token storage',
      })
      return new Response(
        JSON.stringify({ error: 'Failed to prepare email' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }
    unsubscribeToken = storedToken.token
  } else {
    // Token exists but is already used — email should have been caught by suppression check above.
    // This is a safety fallback; log and skip sending.
    console.warn('Unsubscribe token already used but email not suppressed', {
      email: normalizedEmail,
    })
    await supabase.from('email_send_log').insert({
      message_id: messageId,
      template_name: templateName,
      recipient_email: effectiveRecipient,
      status: 'suppressed',
      error_message:
        'Unsubscribe token used but email missing from suppressed list',
    })
    return new Response(
      JSON.stringify({ success: false, reason: 'email_suppressed' }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }

  // 4. Render React Email template to HTML and plain text
  const html = await renderAsync(
    React.createElement(template.component, templateData)
  )
  const plainText = await renderAsync(
    React.createElement(template.component, templateData),
    { plainText: true }
  )

  // Resolve subject — supports static string or dynamic function
  const resolvedSubject =
    typeof template.subject === 'function'
      ? template.subject(templateData)
      : template.subject

  // 5. Enqueue the pre-rendered email for async processing by the dispatcher.
  // The dispatcher (process-email-queue) handles sending, retries, and rate-limit backoff.

  // Log pending BEFORE enqueue so we have a record even if enqueue crashes
  await supabase.from('email_send_log').insert({
    message_id: messageId,
    template_name: templateName,
    recipient_email: effectiveRecipient,
    status: 'pending',
  })

  const { error: enqueueError } = await supabase.rpc('enqueue_email', {
    queue_name: 'transactional_emails',
    payload: {
      message_id: messageId,
      to: effectiveRecipient,
      from: `${SITE_NAME} <noreply@${FROM_DOMAIN}>`,
      sender_domain: SENDER_DOMAIN,
      subject: resolvedSubject,
      html,
      text: plainText,
      purpose: 'transactional',
      label: templateName,
      idempotency_key: idempotencyKey,
      unsubscribe_token: unsubscribeToken,
      queued_at: new Date().toISOString(),
    },
  })

  if (enqueueError) {
    console.error('Failed to enqueue email', {
      error: enqueueError,
      templateName,
      effectiveRecipient,
    })

    await supabase.from('email_send_log').insert({
      message_id: messageId,
      template_name: templateName,
      recipient_email: effectiveRecipient,
      status: 'failed',
      error_message: 'Failed to enqueue email',
    })

    return new Response(JSON.stringify({ error: 'Failed to enqueue email' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  console.log('Transactional email enqueued', { templateName, effectiveRecipient })

  // Side-effect: when an inquiry-notification is sent to the site owner,
  // automatically dispatch a guest confirmation copy to templateData.email
  // server-side. This avoids exposing inquiry-confirmation as a dynamic-
  // recipient template that anon callers could abuse as an open relay.
  let guestQueued = false
  const guestEmailRaw = typeof templateData?.email === 'string' ? templateData.email : ''
  if (
    templateName === 'inquiry-notification' &&
    guestEmailRaw &&
    emailRegex.test(guestEmailRaw) &&
    guestEmailRaw.length <= 254
  ) {
    const guestTemplate = TEMPLATES['inquiry-confirmation']
    if (guestTemplate) {
      try {
        const guestRecipient = guestEmailRaw
        const guestNormalized = guestRecipient.toLowerCase()

        const { data: guestSuppressed } = await supabase
          .from('suppressed_emails')
          .select('id')
          .eq('email', guestNormalized)
          .maybeSingle()

        if (!guestSuppressed) {
          // Get/create unsubscribe token for the guest address
          let guestToken: string | null = null
          const { data: existingGuestToken } = await supabase
            .from('email_unsubscribe_tokens')
            .select('token, used_at')
            .eq('email', guestNormalized)
            .maybeSingle()
          if (existingGuestToken && !existingGuestToken.used_at) {
            guestToken = existingGuestToken.token
          } else if (!existingGuestToken) {
            const newToken = generateToken()
            await supabase
              .from('email_unsubscribe_tokens')
              .upsert(
                { token: newToken, email: guestNormalized },
                { onConflict: 'email', ignoreDuplicates: true },
              )
            const { data: storedGuestToken } = await supabase
              .from('email_unsubscribe_tokens')
              .select('token')
              .eq('email', guestNormalized)
              .maybeSingle()
            guestToken = storedGuestToken?.token ?? null
          }

          if (guestToken) {
            const guestHtml = await renderAsync(
              React.createElement(guestTemplate.component, templateData),
            )
            const guestPlain = await renderAsync(
              React.createElement(guestTemplate.component, templateData),
              { plainText: true },
            )
            const guestSubject =
              typeof guestTemplate.subject === 'function'
                ? guestTemplate.subject(templateData)
                : guestTemplate.subject
            const guestMessageId = crypto.randomUUID()

            await supabase.from('email_send_log').insert({
              message_id: guestMessageId,
              template_name: 'inquiry-confirmation',
              recipient_email: guestRecipient,
              status: 'pending',
            })

            const { error: guestEnqueueError } = await supabase.rpc('enqueue_email', {
              queue_name: 'transactional_emails',
              payload: {
                message_id: guestMessageId,
                to: guestRecipient,
                from: `${SITE_NAME} <noreply@${FROM_DOMAIN}>`,
                sender_domain: SENDER_DOMAIN,
                subject: guestSubject,
                html: guestHtml,
                text: guestPlain,
                purpose: 'transactional',
                label: 'inquiry-confirmation',
                idempotency_key: `${idempotencyKey}-guest`,
                unsubscribe_token: guestToken,
                queued_at: new Date().toISOString(),
              },
            })

            if (guestEnqueueError) {
              console.error('Failed to enqueue guest confirmation', { error: guestEnqueueError })
            } else {
              guestQueued = true
            }
          }
        }
      } catch (e) {
        console.error('Guest confirmation side-effect failed', e)
      }
    }
  }

  // Side-effect: WhatsApp notification to the site owner for inquiry-notification.
  // Moved server-side so the public notify-whatsapp endpoint can be removed.
  if (templateName === 'inquiry-notification') {
    try {
      const phone = Deno.env.get('CALLMEBOT_PHONE')
      const apikey = Deno.env.get('CALLMEBOT_APIKEY')
      if (phone && apikey) {
        const td = templateData as Record<string, unknown>
        const lines = [
          `🚐 Neue Anfrage (${td.bookingType ?? ''})`,
          `Name: ${td.name ?? ''}`,
          `E-Mail: ${td.email ?? ''}`,
          `Telefon: ${td.phone ?? '—'}`,
          `Zeitraum: ${td.startDate ?? ''} – ${td.endDate ?? ''}${td.rentalDays ? ` (${td.rentalDays} Tage)` : ''}`,
          `Summe: ${td.totalGross ?? ''}`,
        ]
        const waMessage = lines.join('\n').slice(0, 1000)
        const waUrl = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(phone)}&text=${encodeURIComponent(waMessage)}&apikey=${encodeURIComponent(apikey)}`
        const waRes = await fetch(waUrl, { method: 'GET' })
        const waText = await waRes.text().catch(() => '')
        console.log('CallMeBot Antwort', waRes.status, waText.slice(0, 200))
      } else {
        console.warn('CALLMEBOT_PHONE oder CALLMEBOT_APIKEY fehlt — WhatsApp übersprungen')
      }
    } catch (e) {
      console.error('WhatsApp side-effect failed', e)
    }
  }

  return new Response(
    JSON.stringify({ success: true, queued: true, guestQueued }),
    {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  )
})
