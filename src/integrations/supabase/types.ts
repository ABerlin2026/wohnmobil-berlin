export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.17"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          after_data: Json | null
          before_data: Json | null
          created_at: string
          entity_id: string | null
          entity_type: string
          id: number
          tenant_id: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          after_data?: Json | null
          before_data?: Json | null
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: never
          tenant_id?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          after_data?: Json | null
          before_data?: Json | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: never
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      bank_accounts: {
        Row: {
          account_holder: string
          bic: string | null
          confirmed_by_customer: boolean
          confirmed_by_employee: boolean
          created_at: string
          customer_id: string
          iban: string
          id: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          account_holder: string
          bic?: string | null
          confirmed_by_customer?: boolean
          confirmed_by_employee?: boolean
          created_at?: string
          customer_id: string
          iban: string
          id?: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          account_holder?: string
          bic?: string | null
          confirmed_by_customer?: boolean
          confirmed_by_employee?: boolean
          created_at?: string
          customer_id?: string
          iban?: string
          id?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bank_accounts_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bank_accounts_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_usage_daily: {
        Row: {
          completion_tokens: number
          created_at: string
          prompt_tokens: number
          request_count: number
          total_tokens: number
          updated_at: string
          usage_date: string
        }
        Insert: {
          completion_tokens?: number
          created_at?: string
          prompt_tokens?: number
          request_count?: number
          total_tokens?: number
          updated_at?: string
          usage_date?: string
        }
        Update: {
          completion_tokens?: number
          created_at?: string
          prompt_tokens?: number
          request_count?: number
          total_tokens?: number
          updated_at?: string
          usage_date?: string
        }
        Relationships: []
      }
      chatbot_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          page_path: string | null
          session_id: string | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          page_path?: string | null
          session_id?: string | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          page_path?: string | null
          session_id?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      customers: {
        Row: {
          birth_date: string | null
          birth_place: string | null
          city: string | null
          country: string
          created_at: string
          email: string | null
          first_name: string
          id: string
          identity_authority: string | null
          identity_expires_at: string | null
          identity_issued_at: string | null
          identity_number: string | null
          last_name: string
          nationality: string | null
          phone: string | null
          portal_user_id: string | null
          postal_code: string | null
          street: string | null
          tenant_id: string
          updated_at: string
        }
        Insert: {
          birth_date?: string | null
          birth_place?: string | null
          city?: string | null
          country?: string
          created_at?: string
          email?: string | null
          first_name: string
          id?: string
          identity_authority?: string | null
          identity_expires_at?: string | null
          identity_issued_at?: string | null
          identity_number?: string | null
          last_name: string
          nationality?: string | null
          phone?: string | null
          portal_user_id?: string | null
          postal_code?: string | null
          street?: string | null
          tenant_id: string
          updated_at?: string
        }
        Update: {
          birth_date?: string | null
          birth_place?: string | null
          city?: string | null
          country?: string
          created_at?: string
          email?: string | null
          first_name?: string
          id?: string
          identity_authority?: string | null
          identity_expires_at?: string | null
          identity_issued_at?: string | null
          identity_number?: string | null
          last_name?: string
          nationality?: string | null
          phone?: string | null
          portal_user_id?: string | null
          postal_code?: string | null
          street?: string | null
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customers_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      damage_markers: {
        Row: {
          created_at: string
          damage_type: string | null
          description: string
          id: string
          inspection_id: string | null
          marker_label: string
          severity: string | null
          status: string
          tenant_id: string
          updated_at: string
          vehicle_id: string
          vehicle_side: string
          x_percent: number
          y_percent: number
        }
        Insert: {
          created_at?: string
          damage_type?: string | null
          description: string
          id?: string
          inspection_id?: string | null
          marker_label: string
          severity?: string | null
          status?: string
          tenant_id: string
          updated_at?: string
          vehicle_id: string
          vehicle_side: string
          x_percent: number
          y_percent: number
        }
        Update: {
          created_at?: string
          damage_type?: string | null
          description?: string
          id?: string
          inspection_id?: string | null
          marker_label?: string
          severity?: string | null
          status?: string
          tenant_id?: string
          updated_at?: string
          vehicle_id?: string
          vehicle_side?: string
          x_percent?: number
          y_percent?: number
        }
        Relationships: [
          {
            foreignKeyName: "damage_markers_inspection_id_fkey"
            columns: ["inspection_id"]
            isOneToOne: false
            referencedRelation: "inspections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "damage_markers_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "damage_markers_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          created_at: string
          created_by: string | null
          customer_id: string | null
          damage_marker_id: string | null
          document_type: string
          driver_id: string | null
          file_hash: string | null
          file_name: string
          file_path: string
          id: string
          is_final: boolean
          mime_type: string | null
          rental_id: string | null
          tenant_id: string
          version: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          customer_id?: string | null
          damage_marker_id?: string | null
          document_type: string
          driver_id?: string | null
          file_hash?: string | null
          file_name: string
          file_path: string
          id?: string
          is_final?: boolean
          mime_type?: string | null
          rental_id?: string | null
          tenant_id: string
          version?: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          customer_id?: string | null
          damage_marker_id?: string | null
          document_type?: string
          driver_id?: string | null
          file_hash?: string | null
          file_name?: string
          file_path?: string
          id?: string
          is_final?: boolean
          mime_type?: string | null
          rental_id?: string | null
          tenant_id?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "documents_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_damage_marker_id_fkey"
            columns: ["damage_marker_id"]
            isOneToOne: false
            referencedRelation: "damage_markers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_rental_id_fkey"
            columns: ["rental_id"]
            isOneToOne: false
            referencedRelation: "rentals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      drivers: {
        Row: {
          created_at: string
          customer_id: string | null
          document_warning_overridden: boolean
          document_warning_overridden_by: string | null
          first_name: string
          id: string
          identity_expires_at: string | null
          identity_number: string | null
          is_primary: boolean
          last_name: string
          license_classes: string[] | null
          license_expires_at: string | null
          license_issued_at: string | null
          license_number: string | null
          rental_id: string
          tenant_id: string
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          document_warning_overridden?: boolean
          document_warning_overridden_by?: string | null
          first_name: string
          id?: string
          identity_expires_at?: string | null
          identity_number?: string | null
          is_primary?: boolean
          last_name: string
          license_classes?: string[] | null
          license_expires_at?: string | null
          license_issued_at?: string | null
          license_number?: string | null
          rental_id: string
          tenant_id: string
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          document_warning_overridden?: boolean
          document_warning_overridden_by?: string | null
          first_name?: string
          id?: string
          identity_expires_at?: string | null
          identity_number?: string | null
          is_primary?: boolean
          last_name?: string
          license_classes?: string[] | null
          license_expires_at?: string | null
          license_issued_at?: string | null
          license_number?: string | null
          rental_id?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "drivers_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "drivers_rental_id_fkey"
            columns: ["rental_id"]
            isOneToOne: false
            referencedRelation: "rentals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "drivers_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      inquiry_confirmation_tickets: {
        Row: {
          confirmation_sent_at: string | null
          created_at: string
          email: string
          id: string
          ip_hash: string | null
        }
        Insert: {
          confirmation_sent_at?: string | null
          created_at?: string
          email: string
          id?: string
          ip_hash?: string | null
        }
        Update: {
          confirmation_sent_at?: string | null
          created_at?: string
          email?: string
          id?: string
          ip_hash?: string | null
        }
        Relationships: []
      }
      inspection_inventory: {
        Row: {
          damaged_quantity: number
          deduction_cents: number
          id: string
          inspection_id: string
          inventory_item_id: string | null
          item_snapshot: Json
          missing_quantity: number
          notes: string | null
          status: string
          tenant_id: string
        }
        Insert: {
          damaged_quantity?: number
          deduction_cents?: number
          id?: string
          inspection_id: string
          inventory_item_id?: string | null
          item_snapshot: Json
          missing_quantity?: number
          notes?: string | null
          status: string
          tenant_id: string
        }
        Update: {
          damaged_quantity?: number
          deduction_cents?: number
          id?: string
          inspection_id?: string
          inventory_item_id?: string | null
          item_snapshot?: Json
          missing_quantity?: number
          notes?: string | null
          status?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inspection_inventory_inspection_id_fkey"
            columns: ["inspection_id"]
            isOneToOne: false
            referencedRelation: "inspections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inspection_inventory_inventory_item_id_fkey"
            columns: ["inventory_item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inspection_inventory_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      inspections: {
        Row: {
          actual_return_at: string | null
          car_jack: boolean
          cleaning_status: string | null
          completed_at: string | null
          completed_by: string | null
          created_at: string
          customer_signature_url: string | null
          delay_minutes: number | null
          first_aid_kit: boolean
          fresh_water: string | null
          gas_bottles: number | null
          gas_status: string | null
          id: string
          inspection_type: string
          instruction_complete: boolean
          keys_count: number | null
          lessor_signature_url: string | null
          motor_oil: string | null
          no_new_damage_confirmed: boolean
          no_open_questions: boolean
          notes: string | null
          odometer: number | null
          onboard_tools: boolean
          payment_override_by: string | null
          payment_override_reason: string | null
          rental_id: string
          safety_vests: number | null
          signed_at: string | null
          status: string
          tank_level: string | null
          tenant_id: string
          tire_tread: string | null
          updated_at: string
          vehicle_papers: boolean
          warning_triangle: boolean
          waste_water: string | null
        }
        Insert: {
          actual_return_at?: string | null
          car_jack?: boolean
          cleaning_status?: string | null
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          customer_signature_url?: string | null
          delay_minutes?: number | null
          first_aid_kit?: boolean
          fresh_water?: string | null
          gas_bottles?: number | null
          gas_status?: string | null
          id?: string
          inspection_type: string
          instruction_complete?: boolean
          keys_count?: number | null
          lessor_signature_url?: string | null
          motor_oil?: string | null
          no_new_damage_confirmed?: boolean
          no_open_questions?: boolean
          notes?: string | null
          odometer?: number | null
          onboard_tools?: boolean
          payment_override_by?: string | null
          payment_override_reason?: string | null
          rental_id: string
          safety_vests?: number | null
          signed_at?: string | null
          status?: string
          tank_level?: string | null
          tenant_id: string
          tire_tread?: string | null
          updated_at?: string
          vehicle_papers?: boolean
          warning_triangle?: boolean
          waste_water?: string | null
        }
        Update: {
          actual_return_at?: string | null
          car_jack?: boolean
          cleaning_status?: string | null
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          customer_signature_url?: string | null
          delay_minutes?: number | null
          first_aid_kit?: boolean
          fresh_water?: string | null
          gas_bottles?: number | null
          gas_status?: string | null
          id?: string
          inspection_type?: string
          instruction_complete?: boolean
          keys_count?: number | null
          lessor_signature_url?: string | null
          motor_oil?: string | null
          no_new_damage_confirmed?: boolean
          no_open_questions?: boolean
          notes?: string | null
          odometer?: number | null
          onboard_tools?: boolean
          payment_override_by?: string | null
          payment_override_reason?: string | null
          rental_id?: string
          safety_vests?: number | null
          signed_at?: string | null
          status?: string
          tank_level?: string | null
          tenant_id?: string
          tire_tread?: string | null
          updated_at?: string
          vehicle_papers?: boolean
          warning_triangle?: boolean
          waste_water?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inspections_rental_id_fkey"
            columns: ["rental_id"]
            isOneToOne: false
            referencedRelation: "rentals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inspections_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_components: {
        Row: {
          id: string
          inventory_item_id: string
          name: string
          quantity: number
          sort_order: number
          tenant_id: string
        }
        Insert: {
          id?: string
          inventory_item_id: string
          name: string
          quantity?: number
          sort_order?: number
          tenant_id: string
        }
        Update: {
          id?: string
          inventory_item_id?: string
          name?: string
          quantity?: number
          sort_order?: number
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_components_inventory_item_id_fkey"
            columns: ["inventory_item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_components_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_items: {
        Row: {
          active: boolean
          created_at: string
          id: string
          item_type: string
          name: string
          quantity: number
          replacement_price_cents: number
          sort_order: number
          tenant_id: string
          updated_at: string
          vehicle_id: string | null
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          item_type?: string
          name: string
          quantity?: number
          replacement_price_cents?: number
          sort_order?: number
          tenant_id: string
          updated_at?: string
          vehicle_id?: string | null
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          item_type?: string
          name?: string
          quantity?: number
          replacement_price_cents?: number
          sort_order?: number
          tenant_id?: string
          updated_at?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_items_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_items_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_items: {
        Row: {
          description: string
          gross_unit_price_cents: number
          id: string
          invoice_id: string
          quantity: number
          sort_order: number
          tenant_id: string
        }
        Insert: {
          description: string
          gross_unit_price_cents: number
          id?: string
          invoice_id: string
          quantity?: number
          sort_order?: number
          tenant_id: string
        }
        Update: {
          description?: string
          gross_unit_price_cents?: number
          id?: string
          invoice_id?: string
          quantity?: number
          sort_order?: number
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_items_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          change_reason: string | null
          created_at: string
          created_by: string | null
          gross_total_cents: number
          id: string
          invoice_number: string
          invoice_type: string
          issued_at: string | null
          predecessor_id: string | null
          rental_id: string
          status: string
          tenant_id: string
          updated_at: string
          version: number
        }
        Insert: {
          change_reason?: string | null
          created_at?: string
          created_by?: string | null
          gross_total_cents?: number
          id?: string
          invoice_number: string
          invoice_type?: string
          issued_at?: string | null
          predecessor_id?: string | null
          rental_id: string
          status?: string
          tenant_id: string
          updated_at?: string
          version?: number
        }
        Update: {
          change_reason?: string | null
          created_at?: string
          created_by?: string | null
          gross_total_cents?: number
          id?: string
          invoice_number?: string
          invoice_type?: string
          issued_at?: string | null
          predecessor_id?: string | null
          rental_id?: string
          status?: string
          tenant_id?: string
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoices_predecessor_id_fkey"
            columns: ["predecessor_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_rental_id_fkey"
            columns: ["rental_id"]
            isOneToOne: false
            referencedRelation: "rentals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount_cents: number
          created_at: string
          id: string
          notes: string | null
          payment_date: string
          payment_method: string
          payment_type: string
          rental_id: string
          tenant_id: string
        }
        Insert: {
          amount_cents: number
          created_at?: string
          id?: string
          notes?: string | null
          payment_date: string
          payment_method: string
          payment_type: string
          rental_id: string
          tenant_id: string
        }
        Update: {
          amount_cents?: number
          created_at?: string
          id?: string
          notes?: string | null
          payment_date?: string
          payment_method?: string
          payment_type?: string
          rental_id?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_rental_id_fkey"
            columns: ["rental_id"]
            isOneToOne: false
            referencedRelation: "rentals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          consent_confirmed: boolean
          created_at: string
          id: string
          internal_notes: string | null
          metadata: Json | null
          referred_email: string
          referred_name: string
          referred_phone: string
          referrer_email: string
          referrer_name: string
          status: string
          updated_at: string
        }
        Insert: {
          consent_confirmed?: boolean
          created_at?: string
          id?: string
          internal_notes?: string | null
          metadata?: Json | null
          referred_email: string
          referred_name: string
          referred_phone: string
          referrer_email: string
          referrer_name: string
          status?: string
          updated_at?: string
        }
        Update: {
          consent_confirmed?: boolean
          created_at?: string
          id?: string
          internal_notes?: string | null
          metadata?: Json | null
          referred_email?: string
          referred_name?: string
          referred_phone?: string
          referrer_email?: string
          referrer_name?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      rentals: {
        Row: {
          created_at: string
          created_by: string | null
          customer_id: string | null
          deposit_cents: number
          deposit_paid_cents: number
          destination: string | null
          end_date: string
          expected_km: number | null
          extra_km_price_cents: number
          free_km_per_day: number
          handover_location: string | null
          handover_time: string | null
          id: string
          planned_route: string | null
          rental_number: string
          rental_price_cents: number
          return_location: string | null
          return_time: string | null
          start_date: string
          status: string
          tank_handover: string | null
          tenant_id: string
          terms_version: string | null
          updated_at: string
          vehicle_id: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          customer_id?: string | null
          deposit_cents?: number
          deposit_paid_cents?: number
          destination?: string | null
          end_date: string
          expected_km?: number | null
          extra_km_price_cents?: number
          free_km_per_day?: number
          handover_location?: string | null
          handover_time?: string | null
          id?: string
          planned_route?: string | null
          rental_number: string
          rental_price_cents?: number
          return_location?: string | null
          return_time?: string | null
          start_date: string
          status?: string
          tank_handover?: string | null
          tenant_id: string
          terms_version?: string | null
          updated_at?: string
          vehicle_id?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          customer_id?: string | null
          deposit_cents?: number
          deposit_paid_cents?: number
          destination?: string | null
          end_date?: string
          expected_km?: number | null
          extra_km_price_cents?: number
          free_km_per_day?: number
          handover_location?: string | null
          handover_time?: string | null
          id?: string
          planned_route?: string | null
          rental_number?: string
          rental_price_cents?: number
          return_location?: string | null
          return_time?: string | null
          start_date?: string
          status?: string
          tank_handover?: string | null
          tenant_id?: string
          terms_version?: string | null
          updated_at?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rentals_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rentals_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rentals_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
      tenant_members: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          tenant_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          tenant_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          tenant_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenant_members_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          city: string | null
          company_name: string | null
          created_at: string
          default_deposit_cents: number
          email: string | null
          extra_km_price_cents: number
          free_km_per_day: number
          id: string
          logo_url: string | null
          name: string
          payment_methods: Json
          phone: string | null
          postal_code: string | null
          price_list: Json
          primary_color: string | null
          slug: string
          status: string
          street: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          city?: string | null
          company_name?: string | null
          created_at?: string
          default_deposit_cents?: number
          email?: string | null
          extra_km_price_cents?: number
          free_km_per_day?: number
          id?: string
          logo_url?: string | null
          name: string
          payment_methods?: Json
          phone?: string | null
          postal_code?: string | null
          price_list?: Json
          primary_color?: string | null
          slug: string
          status?: string
          street?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          city?: string | null
          company_name?: string | null
          created_at?: string
          default_deposit_cents?: number
          email?: string | null
          extra_km_price_cents?: number
          free_km_per_day?: number
          id?: string
          logo_url?: string | null
          name?: string
          payment_methods?: Json
          phone?: string | null
          postal_code?: string | null
          price_list?: Json
          primary_color?: string | null
          slug?: string
          status?: string
          street?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          active: boolean
          created_at: string
          diagram_driver_url: string | null
          diagram_front_url: string | null
          diagram_passenger_url: string | null
          diagram_rear_url: string | null
          id: string
          make: string | null
          model: string | null
          name: string
          registration_number: string | null
          tenant_id: string
          updated_at: string
          vin: string | null
        }
        Insert: {
          active?: boolean
          created_at?: string
          diagram_driver_url?: string | null
          diagram_front_url?: string | null
          diagram_passenger_url?: string | null
          diagram_rear_url?: string | null
          id?: string
          make?: string | null
          model?: string | null
          name: string
          registration_number?: string | null
          tenant_id: string
          updated_at?: string
          vin?: string | null
        }
        Update: {
          active?: boolean
          created_at?: string
          diagram_driver_url?: string | null
          diagram_front_url?: string | null
          diagram_passenger_url?: string | null
          diagram_rear_url?: string | null
          id?: string
          make?: string | null
          model?: string | null
          name?: string
          registration_number?: string | null
          tenant_id?: string
          updated_at?: string
          vin?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claim_tenant_bootstrap: { Args: { _slug: string }; Returns: string }
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      email_queue_dispatch: { Args: never; Returns: undefined }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      get_today_chat_tokens: { Args: never; Returns: number }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_chat_usage: {
        Args: {
          p_completion_tokens: number
          p_prompt_tokens: number
          p_total_tokens: number
        }
        Returns: number
      }
      is_tenant_member: { Args: { _tenant_id: string }; Returns: boolean }
      is_tenant_staff: { Args: { _tenant_id: string }; Returns: boolean }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
    }
    Enums: {
      app_role:
        | "admin"
        | "platform_admin"
        | "tenant_admin"
        | "employee"
        | "customer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "admin",
        "platform_admin",
        "tenant_admin",
        "employee",
        "customer",
      ],
    },
  },
} as const
