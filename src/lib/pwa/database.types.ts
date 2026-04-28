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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      cycle_settings: {
        Row: {
          average_cycle_length_days: number
          average_period_length_days: number
          created_at: string
          deleted_at: string | null
          id: string
          luteal_phase_length_days: number
          sync_status: string
          tracking_enabled: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          average_cycle_length_days?: number
          average_period_length_days?: number
          created_at: string
          deleted_at?: string | null
          id: string
          luteal_phase_length_days?: number
          sync_status?: string
          tracking_enabled?: boolean
          updated_at: string
          user_id: string
        }
        Update: {
          average_cycle_length_days?: number
          average_period_length_days?: number
          created_at?: string
          deleted_at?: string | null
          id?: string
          luteal_phase_length_days?: number
          sync_status?: string
          tracking_enabled?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      donations: {
        Row: {
          amount_cents: number
          created_at: string
          currency: string
          email: string | null
          id: string
          mode: string
          status: string
          stripe_checkout_session_id: string | null
          stripe_payment_intent_id: string | null
          user_id: string | null
        }
        Insert: {
          amount_cents: number
          created_at?: string
          currency?: string
          email?: string | null
          id: string
          mode: string
          status: string
          stripe_checkout_session_id?: string | null
          stripe_payment_intent_id?: string | null
          user_id?: string | null
        }
        Update: {
          amount_cents?: number
          created_at?: string
          currency?: string
          email?: string | null
          id?: string
          mode?: string
          status?: string
          stripe_checkout_session_id?: string | null
          stripe_payment_intent_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      exercises: {
        Row: {
          category: string
          created_at: string
          deleted_at: string | null
          id: string
          is_custom: boolean
          name: string
          primary_muscles: string[]
          sync_status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string
          created_at: string
          deleted_at?: string | null
          id: string
          is_custom?: boolean
          name: string
          primary_muscles?: string[]
          sync_status?: string
          updated_at: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_custom?: boolean
          name?: string
          primary_muscles?: string[]
          sync_status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      injuries: {
        Row: {
          active: boolean
          body_location: string
          created_at: string
          deleted_at: string | null
          id: string
          notes: string | null
          severity: number
          sync_status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          active?: boolean
          body_location: string
          created_at: string
          deleted_at?: string | null
          id: string
          notes?: string | null
          severity: number
          sync_status?: string
          updated_at: string
          user_id: string
        }
        Update: {
          active?: boolean
          body_location?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          notes?: string | null
          severity?: number
          sync_status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      lifts: {
        Row: {
          best_estimated_one_rep_max: number | null
          created_at: string
          deleted_at: string | null
          exercise_id: string
          id: string
          sync_status: string
          unit: string
          updated_at: string
          user_id: string
        }
        Insert: {
          best_estimated_one_rep_max?: number | null
          created_at: string
          deleted_at?: string | null
          exercise_id: string
          id: string
          sync_status?: string
          unit?: string
          updated_at: string
          user_id: string
        }
        Update: {
          best_estimated_one_rep_max?: number | null
          created_at?: string
          deleted_at?: string | null
          exercise_id?: string
          id?: string
          sync_status?: string
          unit?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lifts_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
        ]
      }
      period_logs: {
        Row: {
          created_at: string
          deleted_at: string | null
          ended_on: string | null
          flow: string | null
          id: string
          started_on: string
          sync_status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at: string
          deleted_at?: string | null
          ended_on?: string | null
          flow?: string | null
          id: string
          started_on: string
          sync_status?: string
          updated_at: string
          user_id: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          ended_on?: string | null
          flow?: string | null
          id?: string
          started_on?: string
          sync_status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          data_mode: string
          display_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_mode?: string
          display_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_mode?: string
          display_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      program_enrollments: {
        Row: {
          created_at: string
          current_session_index: number
          current_week: number
          deleted_at: string | null
          id: string
          program_id: string
          started_on: string
          status: string
          sync_status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at: string
          current_session_index?: number
          current_week?: number
          deleted_at?: string | null
          id: string
          program_id: string
          started_on: string
          status?: string
          sync_status?: string
          updated_at: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_session_index?: number
          current_week?: number
          deleted_at?: string | null
          id?: string
          program_id?: string
          started_on?: string
          status?: string
          sync_status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "program_enrollments_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      programs: {
        Row: {
          category: string | null
          created_at: string
          deleted_at: string | null
          description: string | null
          difficulty: string | null
          id: string
          sessions_per_week: number
          source: string
          sync_status: string
          template_id: string | null
          title: string
          updated_at: string
          user_id: string
          weeks: number
        }
        Insert: {
          category?: string | null
          created_at: string
          deleted_at?: string | null
          description?: string | null
          difficulty?: string | null
          id: string
          sessions_per_week?: number
          source?: string
          sync_status?: string
          template_id?: string | null
          title: string
          updated_at: string
          user_id: string
          weeks?: number
        }
        Update: {
          category?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          difficulty?: string | null
          id?: string
          sessions_per_week?: number
          source?: string
          sync_status?: string
          template_id?: string | null
          title?: string
          updated_at?: string
          user_id?: string
          weeks?: number
        }
        Relationships: []
      }
      recovery_scores: {
        Row: {
          created_at: string
          deleted_at: string | null
          id: string
          notes: string | null
          recorded_on: string
          score: number
          sleep_quality: number | null
          soreness: number | null
          stress: number | null
          sync_status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at: string
          deleted_at?: string | null
          id: string
          notes?: string | null
          recorded_on: string
          score: number
          sleep_quality?: number | null
          soreness?: number | null
          stress?: number | null
          sync_status?: string
          updated_at: string
          user_id: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          notes?: string | null
          recorded_on?: string
          score?: number
          sleep_quality?: number | null
          soreness?: number | null
          stress?: number | null
          sync_status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      stripe_events: {
        Row: {
          id: string
          processed_at: string
          type: string
        }
        Insert: {
          id: string
          processed_at?: string
          type: string
        }
        Update: {
          id?: string
          processed_at?: string
          type?: string
        }
        Relationships: []
      }
      sync_events: {
        Row: {
          created_at: string
          entity: string
          entity_id: string
          id: string
          last_error: string | null
          operation: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          entity: string
          entity_id: string
          id: string
          last_error?: string | null
          operation: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          entity?: string
          entity_id?: string
          id?: string
          last_error?: string | null
          operation?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      workout_sets: {
        Row: {
          created_at: string
          deleted_at: string | null
          exercise_id: string
          id: string
          reps: number
          rpe: number | null
          set_index: number
          sync_status: string
          unit: string
          updated_at: string
          user_id: string
          weight: number
          workout_id: string
        }
        Insert: {
          created_at: string
          deleted_at?: string | null
          exercise_id: string
          id: string
          reps: number
          rpe?: number | null
          set_index: number
          sync_status?: string
          unit?: string
          updated_at: string
          user_id: string
          weight: number
          workout_id: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          exercise_id?: string
          id?: string
          reps?: number
          rpe?: number | null
          set_index?: number
          sync_status?: string
          unit?: string
          updated_at?: string
          user_id?: string
          weight?: number
          workout_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workout_sets_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_sets_workout_id_fkey"
            columns: ["workout_id"]
            isOneToOne: false
            referencedRelation: "workouts"
            referencedColumns: ["id"]
          },
        ]
      }
      workouts: {
        Row: {
          completed_at: string | null
          created_at: string
          deleted_at: string | null
          id: string
          notes: string | null
          source: string
          started_at: string
          status: string
          sync_status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at: string
          deleted_at?: string | null
          id: string
          notes?: string | null
          source?: string
          started_at: string
          status: string
          sync_status?: string
          title: string
          updated_at: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          deleted_at?: string | null
          id?: string
          notes?: string | null
          source?: string
          started_at?: string
          status?: string
          sync_status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
    Enums: {},
  },
} as const
