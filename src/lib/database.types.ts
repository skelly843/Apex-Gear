export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      service_types: {
        Row: {
          id: number
          name: string
          description: string | null
          duration_minutes: number
          price_cents: number
          deposit_cents: number | null
          active: boolean
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          description?: string | null
          duration_minutes: number
          price_cents: number
          deposit_cents?: number | null
          active?: boolean
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          description?: string | null
          duration_minutes?: number
          price_cents?: number
          deposit_cents?: number | null
          active?: boolean
          created_at?: string
        }
      }
      zones: {
        Row: {
          id: number
          name: string
          type: string
          zip_codes: string[] | null
          center_lat: number | null
          center_lng: number | null
          radius_miles: number | null
          active: boolean
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          type: string
          zip_codes?: string[] | null
          center_lat?: number | null
          center_lng?: number | null
          radius_miles?: number | null
          active?: boolean
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          type?: string
          zip_codes?: string[] | null
          center_lat?: number | null
          center_lng?: number | null
          radius_miles?: number | null
          active?: boolean
          created_at?: string
        }
      }
      zone_day_assignments: {
        Row: {
          id: number
          date: string
          zone_id: number | null
          working_start_time: string | null
          working_end_time: string | null
          is_closed: boolean
          allow_mixed: boolean
          created_at: string
        }
        Insert: {
          id?: number
          date: string
          zone_id?: number | null
          working_start_time?: string | null
          working_end_time?: string | null
          is_closed?: boolean
          allow_mixed?: boolean
          created_at?: string
        }
        Update: {
          id?: number
          date?: string
          zone_id?: number | null
          working_start_time?: string | null
          working_end_time?: string | null
          is_closed?: boolean
          allow_mixed?: boolean
          created_at?: string
        }
      }
      bookings: {
        Row: {
          id: number
          customer_name: string
          customer_email: string
          customer_phone: string | null
          service_type_id: number
          zone_id: number | null
          address: string
          lat: number | null
          lng: number | null
          start_time: string
          end_time: string
          status: "HOLD" | "CONFIRMED" | "CANCELLED" | "EXPIRED"
          stripe_session_id: string | null
          created_at: string
        }
        Insert: {
          id?: number
          customer_name: string
          customer_email: string
          customer_phone?: string | null
          service_type_id: number
          zone_id?: number | null
          address: string
          lat?: number | null
          lng?: number | null
          start_time: string
          end_time: string
          status: "HOLD" | "CONFIRMED" | "CANCELLED" | "EXPIRED"
          stripe_session_id?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          customer_name?: string
          customer_email?: string
          customer_phone?: string | null
          service_type_id?: number
          zone_id?: number | null
          address?: string
          lat?: number | null
          lng?: number | null
          start_time?: string
          end_time?: string
          status?: "HOLD" | "CONFIRMED" | "CANCELLED" | "EXPIRED"
          stripe_session_id?: string | null
          created_at?: string
        }
      }
      blocks: {
        Row: {
          id: number
          start_time: string
          end_time: string
          reason: string | null
          created_at: string
        }
        Insert: {
          id?: number
          start_time: string
          end_time: string
          reason?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          start_time?: string
          end_time?: string
          reason?: string | null
          created_at?: string
        }
      }
      booking_requests: {
        Row: {
          id: number
          name: string
          email: string
          phone: string | null
          address: string
          service_details: string | null
          status: string
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          email: string
          phone?: string | null
          address: string
          service_details?: string | null
          status?: string
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          email?: string
          phone?: string | null
          address?: string
          service_details?: string | null
          status?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
