/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'

export interface TemplateEntry {
  component: React.ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  to?: string
  displayName?: string
  previewData?: Record<string, any>
}

import { template as inquiryNotification } from './inquiry-notification.tsx'
import { template as inquiryConfirmation } from './inquiry-confirmation.tsx'
import { template as referralNotification } from './referral-notification.tsx'

export const TEMPLATES: Record<string, TemplateEntry> = {
  'inquiry-notification': inquiryNotification,
  'inquiry-confirmation': inquiryConfirmation,
  'referral-notification': referralNotification,
}
