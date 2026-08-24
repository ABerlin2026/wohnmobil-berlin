import { createClient } from 'npm:@supabase/supabase-js@2'
import { PdfBuilder } from './pdf.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })

const BUCKET = 'rental-documents'

const KIND_LABEL: Record<string, string> = {
  contract: 'Mietvertrag',
  handover: 'Übergabeprotokoll',
  return: 'Rückgabeprotokoll',
}

const SIDE_LABEL: Record<string, string> = {
  front: 'Front',
  rear: 'Heck',
  driver: 'Fahrerseite',
  passenger: 'Beifahrerseite',
  interior: 'Innenbereich',
}

const LEVEL_LABEL: Record<string, string> = {
  empty: 'Leer',
  quarter: '1/4',
  half: '1/2',
  three_quarter: '3/4',
  full: 'Voll',
}

const SEVERITY_LABEL: Record<string, string> = {
  note: 'Notiz',
  light: 'Leicht',
  medium: 'Mittel',
  severe: 'Schwer',
}

const STATUS_LABEL: Record<string, string> = {
  existing: 'Vorschaden',
  new: 'Neu',
  repaired: 'Behoben',
}

const INVENTORY_STATUS_LABEL: Record<string, string> = {
  complete: 'Vollständig',
  partial: 'Teilweise',
  missing: 'Fehlt',
  damaged: 'Beschädigt',
}

const euro = (cents: number | null | undefined) =>
  `${((cents ?? 0) / 100).toLocaleString('de-DE', { minimumFractionDigits: 2 })} EUR`

const day = (value?: string | null) =>
  value ? new Date(value).toLocaleDateString('de-DE') : '-'

const dateTime = (value?: string | null) =>
  value
    ? new Date(value).toLocaleString('de-DE', { dateStyle: 'short', timeStyle: 'short' })
    : '-'

const yesNo = (value: boolean | null | undefined) => (value ? 'Ja' : 'Nein')

const rentalDays = (start: string, end: string) => {
  const ms = new Date(end).getTime() - new Date(start).getTime()
  return Math.max(1, Math.round(ms / 86_400_000) + 1)
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!

  const authHeader = req.headers.get('Authorization') ?? ''
  if (!authHeader.startsWith('Bearer ')) return json({ error: 'Unauthorized' }, 401)

  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
  })
  const { data: userData, error: userError } = await userClient.auth.getUser()
  if (userError || !userData?.user) return json({ error: 'Unauthorized' }, 401)
  const userId = userData.user.id

  let body: {
    rentalId?: string
    kind?: string
    inspectionId?: string
    diagrams?: Record<string, string>
    send?: boolean
    preview?: boolean
    draft?: {
      inspection?: Record<string, any>
      inventory?: Record<string, any>[]
      markers?: Record<string, any>[]
      customerSignature?: string | null
      lessorSignature?: string | null
    }
  }
  try {
    body = await req.json()
  } catch {
    return json({ error: 'Invalid JSON' }, 400)
  }

  const rentalId = body.rentalId
  const kind = body.kind ?? 'contract'
  const preview = body.preview === true
  const draft = body.draft ?? {}
  if (!rentalId || typeof rentalId !== 'string') return json({ error: 'rentalId fehlt' }, 400)
  if (!KIND_LABEL[kind]) return json({ error: 'kind ungültig' }, 400)


  const admin = createClient(supabaseUrl, serviceKey)

  const { data: rental, error: rentalError } = await admin
    .from('rentals')
    .select(
      '*, customers(*), vehicles(*), tenants(name, company_name, street, postal_code, city, phone, email, website)',
    )
    .eq('id', rentalId)
    .maybeSingle()
  if (rentalError) return json({ error: rentalError.message }, 500)
  if (!rental) return json({ error: 'Mietvertrag nicht gefunden' }, 404)

  // Zugriff nur für Mitarbeitende des Mandanten
  const { data: membership } = await admin
    .from('tenant_members')
    .select('role')
    .eq('tenant_id', rental.tenant_id)
    .eq('user_id', userId)
    .maybeSingle()
  const allowedRoles = ['tenant_admin', 'employee', 'admin', 'platform_admin']
  if (!membership || !allowedRoles.includes(membership.role as string)) {
    return json({ error: 'Kein Zugriff auf diesen Mandanten' }, 403)
  }

  const tenant = (rental as Record<string, any>).tenants ?? {}
  const customer = (rental as Record<string, any>).customers ?? null
  const vehicle = (rental as Record<string, any>).vehicles ?? null

  const [{ data: drivers }, { data: payments }] = await Promise.all([
    admin.from('drivers').select('*').eq('rental_id', rentalId).order('is_primary', { ascending: false }),
    admin.from('payments').select('*').eq('rental_id', rentalId).order('payment_date'),
  ])

  const footerLines = [
    tenant.company_name || tenant.name || 'Vermieter',
    [tenant.street, [tenant.postal_code, tenant.city].filter(Boolean).join(' ')]
      .filter(Boolean)
      .join(' · '),
    [tenant.phone ? `Tel. ${tenant.phone}` : null, tenant.email, tenant.website]
      .filter(Boolean)
      .join(' · '),
  ].filter((line) => line && line.length > 0)

  const documentType = KIND_LABEL[kind]
  const pdf = await PdfBuilder.create(
    `${documentType} ${rental.rental_number}${preview ? ' (Vorschau)' : ''}`,
    { lines: footerLines },
    preview ? 'VORSCHAU - nicht unterschrieben' : null,
  )


  const customerName = customer ? `${customer.first_name} ${customer.last_name}` : 'Mieter offen'
  const days = rentalDays(rental.start_date, rental.end_date)
  const includedKm = days * (rental.free_km_per_day ?? 0)

  pdf.heading(`${documentType} ${rental.rental_number}${preview ? ' - VORSCHAU' : ''}`)
  pdf.text(
    `${tenant.company_name || tenant.name || 'Vermieter'} · Erstellt am ${dateTime(
      new Date().toISOString(),
    )}`,
    { size: 9 },
  )
  if (preview) {
    pdf.text(
      'Vorschau auf Basis der aktuellen Formulareingaben. Nicht rechtsverbindlich, nicht archiviert.',
      { size: 9, bold: true },
    )
  }
  pdf.gap(10)


  pdf.subheading('Vertragsparteien')
  pdf.keyValues([
    ['Vermieter', tenant.company_name || tenant.name || '-'],
    ['Mieter', customerName],
    [
      'Anschrift Vermieter',
      [tenant.street, [tenant.postal_code, tenant.city].filter(Boolean).join(' ')]
        .filter(Boolean)
        .join(', ') || '-',
    ],
    [
      'Anschrift Mieter',
      customer
        ? [customer.street, [customer.postal_code, customer.city].filter(Boolean).join(' ')]
            .filter(Boolean)
            .join(', ') || '-'
        : '-',
    ],
    ['Kontakt Vermieter', [tenant.phone, tenant.email].filter(Boolean).join(' · ') || '-'],
    ['Kontakt Mieter', customer ? [customer.phone, customer.email].filter(Boolean).join(' · ') || '-' : '-'],
  ])

  pdf.subheading('Fahrzeug und Mietzeitraum')
  pdf.keyValues([
    ['Fahrzeug', vehicle ? `${vehicle.name}${vehicle.make ? ` (${vehicle.make} ${vehicle.model ?? ''})` : ''}` : '-'],
    ['Kennzeichen', vehicle?.registration_number ?? '-'],
    ['Mietbeginn', `${day(rental.start_date)} ${rental.handover_time ?? ''}`.trim()],
    ['Mietende', `${day(rental.end_date)} ${rental.return_time ?? ''}`.trim()],
    ['Übergabeort', rental.handover_location ?? '-'],
    ['Rückgabeort', rental.return_location ?? '-'],
    ['Miettage', `${days}`],
    ['Reiseziel', rental.destination ?? '-'],
  ])

  if (kind === 'contract') {
    pdf.subheading('Preise, Kilometer und Kaution')
    pdf.keyValues([
      ['Mietpreis', euro(rental.rental_price_cents)],
      ['Kaution', euro(rental.deposit_cents)],
      ['Freikilometer', `${includedKm} km (${rental.free_km_per_day} km je Miettag)`],
      ['Mehrkilometer', `${euro(rental.extra_km_price_cents)} je km`],
      ['Erwartete Kilometer', rental.expected_km ? `${rental.expected_km} km` : '-'],
      ['Tankfüllung bei Übergabe', LEVEL_LABEL[rental.tank_handover ?? ''] ?? rental.tank_handover ?? 'Voll'],
    ])

    pdf.subheading('Fahrer')
    pdf.table(
      ['Name', 'Rolle', 'Führerschein', 'Gültig bis'],
      (drivers ?? []).map((driver) => [
        `${driver.first_name} ${driver.last_name}`,
        driver.is_primary ? 'Hauptfahrer' : 'Zusatzfahrer',
        driver.license_number ?? '-',
        day(driver.license_expires_at),
      ]),
      [34, 20, 26, 20],
    )

    if ((payments ?? []).length > 0) {
      pdf.subheading('Bisherige Zahlungen')
      pdf.table(
        ['Datum', 'Art', 'Zahlungsweg', 'Betrag'],
        (payments ?? []).map((entry) => [
          day(entry.payment_date),
          entry.payment_type,
          entry.payment_method,
          euro(entry.amount_cents),
        ]),
        [20, 26, 30, 24],
      )
    }

    pdf.subheading('Wichtige Vertragsbedingungen')
    for (const line of [
      `Die Kaution in Höhe von ${euro(rental.deposit_cents)} ist vor der Übergabe zu leisten und wird nach mängelfreier Rückgabe erstattet.`,
      `Enthalten sind ${includedKm} Freikilometer. Jeder darüber hinaus gefahrene Kilometer wird mit ${euro(
        rental.extra_km_price_cents,
      )} berechnet.`,
      'Das Fahrzeug ist vollgetankt, mit entleerten Abwassertanks sowie in gereinigtem Zustand zurückzugeben. Andernfalls werden die tatsächlichen Kosten von der Kaution einbehalten.',
      'Es dürfen ausschließlich die im Vertrag eingetragenen Fahrer das Fahrzeug führen. Führerschein und Ausweis sind bei der Übergabe im Original vorzulegen.',
      'Zustand, Kilometerstand, Füllstände und Inventar werden im Übergabe- und im Rückgabeprotokoll dokumentiert. Diese Protokolle sind Bestandteil dieses Vertrags.',
      'Es gelten ergänzend die Allgemeinen Geschäftsbedingungen des Vermieters in der zum Buchungszeitpunkt gültigen Fassung.',
    ]) {
      pdf.text(`- ${line}`)
      pdf.gap(2)
    }

    pdf.gap(14)
    pdf.signatures([
      { label: 'Ort, Datum, Unterschrift Mieter', image: null },
      { label: 'Ort, Datum, Unterschrift Vermieter', image: null },
    ])
  } else {
    // ── Übergabe- / Rückgabeprotokoll ────────────────────────────────────
    let inspection: Record<string, any> | null = null
    if (body.inspectionId) {
      const { data } = await admin
        .from('inspections')
        .select('*')
        .eq('id', body.inspectionId)
        .eq('rental_id', rentalId)
        .maybeSingle()
      inspection = data
    }
    if (!inspection) {
      const { data } = await admin
        .from('inspections')
        .select('*')
        .eq('rental_id', rentalId)
        .eq('inspection_type', kind === 'handover' ? 'handover' : 'return')
        .maybeSingle()
      inspection = data
    }
    if (preview) {
      // Formularwerte haben Vorrang, Stammdaten bleiben aus der Datenbank
      inspection = { ...(inspection ?? {}), ...(draft.inspection ?? {}), status: 'draft' }
    }

    pdf.subheading('Fahrzeugzustand')
    pdf.keyValues([
      [
        'Status',
        preview
          ? 'Vorschau (ungespeichert)'
          : inspection?.status === 'completed'
            ? 'Abgeschlossen'
            : 'Zwischenstand',
      ],

      ['Kilometerstand', inspection?.odometer ? `${inspection.odometer} km` : '-'],
      ['Tankfüllung', LEVEL_LABEL[inspection?.tank_level ?? ''] ?? inspection?.tank_level ?? '-'],
      ['Frischwasser', LEVEL_LABEL[inspection?.fresh_water ?? ''] ?? inspection?.fresh_water ?? '-'],
      ['Abwasser', LEVEL_LABEL[inspection?.waste_water ?? ''] ?? inspection?.waste_water ?? '-'],
      ['Gasflaschen', inspection?.gas_bottles != null ? `${inspection.gas_bottles}` : '-'],
      ['Reifenprofil', inspection?.tire_tread ?? '-'],
      ['Reinigungszustand', inspection?.cleaning_status ?? '-'],
      [
        'Fahrzeugschlüssel',
        inspection?.keys_count != null
          ? `${inspection.keys_count} (Motorschlüssel inkl. Heckgarage und Seitentür)`
          : '-',
      ],
      ['Warnwesten', inspection?.safety_vests != null ? `${inspection.safety_vests}` : '-'],
    ])

    if (kind === 'return') {
      pdf.keyValues([
        ['Tatsächliche Rückgabe', dateTime(inspection?.actual_return_at)],
        ['Verspätung', inspection?.delay_minutes != null ? `${inspection.delay_minutes} Minuten` : '-'],
      ])
    }

    pdf.subheading('Ausstattung')
    pdf.table(
      ['Position', 'Vorhanden'],
      [
        ['Fahrzeugpapiere', yesNo(inspection?.vehicle_papers)],
        ['Bordwerkzeug', yesNo(inspection?.onboard_tools)],
        ['Warndreieck', yesNo(inspection?.warning_triangle)],
        ['Verbandskasten', yesNo(inspection?.first_aid_kit)],
        ['Wagenheber', yesNo(inspection?.car_jack)],
      ],
      [70, 30],
    )

    const { data: inventoryRows } = inspection
      ? await admin
          .from('inspection_inventory')
          .select('*')
          .eq('inspection_id', inspection.id)
      : { data: [] as any[] }

    if ((inventoryRows ?? []).length > 0) {
      pdf.subheading('Inventar')
      pdf.table(
        ['Artikel', 'Status', 'Fehlt', 'Beschädigt', 'Abzug'],
        (inventoryRows ?? []).map((row: Record<string, any>) => [
          row.item_snapshot?.name ?? '-',
          INVENTORY_STATUS_LABEL[row.status] ?? row.status,
          `${row.missing_quantity ?? 0}`,
          `${row.damaged_quantity ?? 0}`,
          euro(row.deduction_cents),
        ]),
        [36, 18, 12, 16, 18],
      )
      const deductionTotal = (inventoryRows ?? []).reduce(
        (sum: number, row: Record<string, any>) => sum + (row.deduction_cents ?? 0),
        0,
      )
      pdf.text(`Summe Abzüge Inventar: ${euro(deductionTotal)}`, { bold: true })
      pdf.gap(6)
    }

    const { data: markers } = await admin
      .from('damage_markers')
      .select('*')
      .eq('vehicle_id', rental.vehicle_id ?? '')
      .neq('status', 'repaired')
      .order('created_at')

    pdf.subheading('Schäden')
    if ((markers ?? []).length === 0) {
      pdf.text('Keine Schäden dokumentiert.')
      pdf.gap(6)
    } else {
      pdf.table(
        ['Nr.', 'Bereich', 'Art', 'Schwere', 'Status', 'Beschreibung'],
        (markers ?? []).map((marker) => [
          marker.marker_label,
          SIDE_LABEL[marker.vehicle_side] ?? marker.vehicle_side,
          marker.damage_type ?? '-',
          SEVERITY_LABEL[marker.severity ?? ''] ?? marker.severity ?? '-',
          STATUS_LABEL[marker.status] ?? marker.status,
          marker.description,
        ]),
        [8, 16, 14, 12, 12, 38],
      )
    }

    // Skizzen mit Markern (Bilder kommen vom Client als Data-URL)
    const diagrams = body.diagrams ?? {}
    const sideOrder = ['front', 'rear', 'driver', 'passenger']
    const diagramEntries = sideOrder.filter((side) => typeof diagrams[side] === 'string')
    if (diagramEntries.length > 0) {
      pdf.subheading('Fahrzeugskizzen mit Schadensmarkierungen')
      for (const side of diagramEntries) {
        const parsed = parseDataUrl(diagrams[side])
        if (!parsed) continue
        const image = await pdf.embedImage(parsed.bytes, parsed.mime)
        if (!image) continue
        pdf.drawDiagram(
          image,
          (markers ?? [])
            .filter((marker) => marker.vehicle_side === side)
            .map((marker) => ({
              label: marker.marker_label,
              x: Number(marker.x_percent),
              y: Number(marker.y_percent),
            })),
          SIDE_LABEL[side],
        )
      }
    }

    // Fotos aus dem Dokumentenarchiv einbetten
    const { data: mediaDocs } = await admin
      .from('documents')
      .select('id, document_type, file_name, file_path, mime_type, damage_marker_id')
      .eq('rental_id', rentalId)
      .order('created_at')

    const photos = (mediaDocs ?? []).filter((doc) =>
      (doc.mime_type ?? '').startsWith('image/') && !doc.document_type.startsWith('Unterschrift'),
    )
    const videos = (mediaDocs ?? []).filter((doc) => (doc.mime_type ?? '').startsWith('video/'))

    if (photos.length > 0) {
      pdf.subheading('Fotodokumentation')
      for (const doc of photos.slice(0, 24)) {
        const bytes = await downloadBytes(admin, doc.file_path)
        if (!bytes) continue
        const image = await pdf.embedImage(bytes, doc.mime_type ?? 'image/jpeg')
        if (!image) continue
        pdf.drawPhoto(image, `${doc.document_type} · ${doc.file_name}`)
      }
    }

    if (videos.length > 0) {
      pdf.subheading('Videodokumentation (im Archiv hinterlegt)')
      for (const doc of videos) {
        pdf.text(`- ${doc.document_type} · ${doc.file_name}`)
      }
      pdf.gap(6)
    }

    if (inspection?.notes) {
      pdf.subheading('Bemerkungen')
      pdf.text(inspection.notes)
      pdf.gap(6)
    }

    pdf.subheading('Bestätigungen')
    pdf.table(
      ['Punkt', 'Bestätigt'],
      [
        ['Einweisung vollständig erfolgt', yesNo(inspection?.instruction_complete)],
        ['Keine offenen Fragen', yesNo(inspection?.no_open_questions)],
        ['Keine neuen Schäden festgestellt', yesNo(inspection?.no_new_damage_confirmed)],
      ],
      [70, 30],
    )

    const customerSignature = inspection?.customer_signature_url
      ? await loadImage(admin, pdf, inspection.customer_signature_url)
      : null
    const lessorSignature = inspection?.lessor_signature_url
      ? await loadImage(admin, pdf, inspection.lessor_signature_url)
      : null

    pdf.gap(10)
    pdf.signatures([
      {
        label: `Unterschrift Mieter (${customerName})`,
        image: customerSignature,
        note: inspection?.signed_at ? dateTime(inspection.signed_at) : undefined,
      },
      {
        label: 'Unterschrift Vermieter',
        image: lessorSignature,
        note: inspection?.signed_at ? dateTime(inspection.signed_at) : undefined,
      },
    ])
  }

  const bytes = await pdf.save()

  // Version bestimmen
  const { data: existing } = await admin
    .from('documents')
    .select('version')
    .eq('rental_id', rentalId)
    .eq('document_type', documentType)
    .order('version', { ascending: false })
    .limit(1)
  const version = ((existing?.[0]?.version as number | undefined) ?? 0) + 1

  const slug = kind === 'contract' ? 'mietvertrag' : kind === 'handover' ? 'uebergabeprotokoll' : 'rueckgabeprotokoll'
  const fileName = `${slug}-${rental.rental_number}-v${version}.pdf`
  const path = `${rental.tenant_id}/rentals/${rentalId}/pdf/${fileName}`

  const { error: uploadError } = await admin.storage
    .from(BUCKET)
    .upload(path, new Blob([bytes], { type: 'application/pdf' }), {
      contentType: 'application/pdf',
      upsert: true,
    })
  if (uploadError) return json({ error: `Upload fehlgeschlagen: ${uploadError.message}` }, 500)

  const { data: docRow, error: docError } = await admin
    .from('documents')
    .insert({
      tenant_id: rental.tenant_id,
      rental_id: rentalId,
      customer_id: rental.customer_id,
      document_type: documentType,
      file_path: path,
      file_name: fileName,
      mime_type: 'application/pdf',
      version,
      is_final: kind === 'contract' ? false : true,
      created_by: userId,
    })
    .select('id')
    .single()
  if (docError) return json({ error: docError.message }, 500)

  const { data: signed } = await admin.storage.from(BUCKET).createSignedUrl(path, 60 * 30)

  let emailQueued = false
  let emailError: string | null = null
  if (body.send) {
    const recipient = customer?.email
    if (!recipient) {
      emailError = 'Für den Mieter ist keine E-Mail-Adresse hinterlegt.'
    } else {
      const { data: link } = await admin.storage
        .from(BUCKET)
        .createSignedUrl(path, 60 * 60 * 24 * 14)
      const response = await fetch(`${supabaseUrl}/functions/v1/send-transactional-email`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${serviceKey}`,
          apikey: serviceKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateName: 'rental-contract',
          recipientEmail: recipient,
          templateData: {
            email: recipient,
            customerName,
            rentalNumber: rental.rental_number,
            vehicleName: vehicle?.name ?? '',
            startDate: day(rental.start_date),
            endDate: day(rental.end_date),
            priceLabel: euro(rental.rental_price_cents),
            depositLabel: euro(rental.deposit_cents),
            downloadUrl: link?.signedUrl ?? '',
            companyName: tenant.company_name || tenant.name || 'Wohnmobil Berlin',
            contactLine: [tenant.phone, tenant.email].filter(Boolean).join(' · '),
          },
        }),
      })
      if (response.ok) {
        emailQueued = true
      } else {
        emailError = await response.text()
      }
    }
  }

  await admin.from('audit_logs').insert({
    tenant_id: rental.tenant_id,
    actor_id: userId,
    action: `document.${kind}.pdf_created`,
    entity_type: 'document',
    entity_id: docRow.id,
    after_data: { path, version, emailQueued },
  })

  return json({
    documentId: docRow.id,
    documentType,
    fileName,
    path,
    version,
    signedUrl: signed?.signedUrl ?? null,
    emailQueued,
    emailError,
  })
})

function parseDataUrl(value: string): { bytes: Uint8Array; mime: string } | null {
  const match = /^data:([^;]+);base64,(.*)$/s.exec(value)
  if (!match) return null
  try {
    const binary = atob(match[2])
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i)
    return { bytes, mime: match[1] }
  } catch {
    return null
  }
}

async function downloadBytes(
  admin: ReturnType<typeof createClient>,
  path: string,
): Promise<Uint8Array | null> {
  const { data, error } = await admin.storage.from(BUCKET).download(path)
  if (error || !data) return null
  return new Uint8Array(await data.arrayBuffer())
}

async function loadImage(
  admin: ReturnType<typeof createClient>,
  pdf: PdfBuilder,
  path: string,
) {
  const bytes = await downloadBytes(admin, path)
  if (!bytes) return null
  return await pdf.embedImage(bytes, path.endsWith('.png') ? 'image/png' : 'image/jpeg')
}
