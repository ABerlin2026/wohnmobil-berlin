/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'

export interface TemplateEntry {
  component: React.ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  to?: string
  // When true, the template is allowed to send to a caller-supplied recipientEmail.
  // Required for templates without a fixed `to` so that the send function does not
  // become an open relay for arbitrary emails.
  allowDynamicRecipient?: boolean
  displayName?: string
  previewData?: Record<string, any>
}

import { template as inquiryNotification } from './inquiry-notification.tsx'
import { template as inquiryConfirmation } from './inquiry-confirmation.tsx'
import { template as referralNotification } from './referral-notification.tsx'
import { template as rentalContract } from './rental-contract.tsx'

export const TEMPLATES: Record<string, TemplateEntry> = {
  'inquiry-notification': inquiryNotification,
  'inquiry-confirmation': inquiryConfirmation,
  'referral-notification': referralNotification,
  'rental-contract': rentalContract,
}
