export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string | null
          name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      surprises: {
        Row: {
          id: string
          user_id: string | null
          couple_name: string
          start_date: string
          message: string | null
          youtube_link: string | null
          plan: 'basic' | 'premium'
          status: 'draft' | 'pending_payment' | 'active' | 'expired'
          views: number
          created_at: string
          updated_at: string
          expires_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          couple_name: string
          start_date: string
          message?: string | null
          youtube_link?: string | null
          plan: 'basic' | 'premium'
          status?: 'draft' | 'pending_payment' | 'active' | 'expired'
          views?: number
          created_at?: string
          updated_at?: string
          expires_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          couple_name?: string
          start_date?: string
          message?: string | null
          youtube_link?: string | null
          plan?: 'basic' | 'premium'
          status?: 'draft' | 'pending_payment' | 'active' | 'expired'
          views?: number
          created_at?: string
          updated_at?: string
          expires_at?: string | null
        }
      }
      surprise_photos: {
        Row: {
          id: string
          surprise_id: string
          photo_url: string
          created_at: string
        }
        Insert: {
          id?: string
          surprise_id: string
          photo_url: string
          created_at?: string
        }
        Update: {
          id?: string
          surprise_id?: string
          photo_url?: string
          created_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          surprise_id: string
          user_id: string
          amount: number
          status: 'pending' | 'completed' | 'failed'
          payment_method: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          surprise_id: string
          user_id: string
          amount: number
          status: 'pending' | 'completed' | 'failed'
          payment_method: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          surprise_id?: string
          user_id?: string
          amount?: number
          status?: 'pending' | 'completed' | 'failed'
          payment_method?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Functions: {
      create_user_profile: {
        Args: {
          user_id: string
          user_email: string
          user_name: string
        }
        Returns: void
      }
    }
  }
}
