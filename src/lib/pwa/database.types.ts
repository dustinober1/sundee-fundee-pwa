export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type Row<T> = T;
type Insert<T> = T;
type Update<T> = Partial<T>;

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Row<{
          id: string;
          display_name: string | null;
          data_mode: "local-only" | "cloud-sync";
          created_at: string;
          updated_at: string;
        }>;
        Insert: Insert<{
          id: string;
          display_name?: string | null;
          data_mode?: "local-only" | "cloud-sync";
          created_at?: string;
          updated_at?: string;
        }>;
        Update: Update<{
          id: string;
          display_name: string | null;
          data_mode: "local-only" | "cloud-sync";
          created_at: string;
          updated_at: string;
        }>;
        Relationships: [];
      };
      exercises: {
        Row: Row<{
          id: string;
          user_id: string;
          name: string;
          category: string;
          primary_muscles: string[];
          is_custom: boolean;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
          sync_status: string;
        }>;
        Insert: Insert<Database["public"]["Tables"]["exercises"]["Row"]>;
        Update: Update<Database["public"]["Tables"]["exercises"]["Row"]>;
        Relationships: [];
      };
      lifts: {
        Row: Row<{
          id: string;
          user_id: string;
          exercise_id: string;
          best_estimated_one_rep_max: number | null;
          unit: "lb" | "kg";
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
          sync_status: string;
        }>;
        Insert: Insert<Database["public"]["Tables"]["lifts"]["Row"]>;
        Update: Update<Database["public"]["Tables"]["lifts"]["Row"]>;
        Relationships: [];
      };
      workouts: {
        Row: Row<{
          id: string;
          user_id: string;
          title: string;
          started_at: string;
          completed_at: string | null;
          status: "planned" | "active" | "completed";
          source: "manual" | "program" | "ai";
          notes: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
          sync_status: string;
        }>;
        Insert: Insert<Database["public"]["Tables"]["workouts"]["Row"]>;
        Update: Update<Database["public"]["Tables"]["workouts"]["Row"]>;
        Relationships: [];
      };
      workout_sets: {
        Row: Row<{
          id: string;
          user_id: string;
          workout_id: string;
          exercise_id: string;
          set_index: number;
          reps: number;
          weight: number;
          unit: "lb" | "kg";
          rpe: number | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
          sync_status: string;
        }>;
        Insert: Insert<Database["public"]["Tables"]["workout_sets"]["Row"]>;
        Update: Update<Database["public"]["Tables"]["workout_sets"]["Row"]>;
        Relationships: [];
      };
      cycle_settings: {
        Row: Row<{
          id: string;
          user_id: string;
          average_cycle_length_days: number;
          average_period_length_days: number;
          luteal_phase_length_days: number;
          tracking_enabled: boolean;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
          sync_status: string;
        }>;
        Insert: Insert<Database["public"]["Tables"]["cycle_settings"]["Row"]>;
        Update: Update<Database["public"]["Tables"]["cycle_settings"]["Row"]>;
        Relationships: [];
      };
      period_logs: {
        Row: Row<{
          id: string;
          user_id: string;
          started_on: string;
          ended_on: string | null;
          flow: "light" | "medium" | "heavy" | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
          sync_status: string;
        }>;
        Insert: Insert<Database["public"]["Tables"]["period_logs"]["Row"]>;
        Update: Update<Database["public"]["Tables"]["period_logs"]["Row"]>;
        Relationships: [];
      };
      recovery_scores: {
        Row: Row<{
          id: string;
          user_id: string;
          recorded_on: string;
          score: number;
          sleep_quality: number | null;
          soreness: number | null;
          stress: number | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
          sync_status: string;
        }>;
        Insert: Insert<Database["public"]["Tables"]["recovery_scores"]["Row"]>;
        Update: Update<Database["public"]["Tables"]["recovery_scores"]["Row"]>;
        Relationships: [];
      };
      programs: {
        Row: Row<{
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          template_id: string | null;
          category: string | null;
          difficulty: string | null;
          weeks: number;
          sessions_per_week: number;
          source: "bundled" | "custom";
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
          sync_status: string;
        }>;
        Insert: Insert<Database["public"]["Tables"]["programs"]["Row"]>;
        Update: Update<Database["public"]["Tables"]["programs"]["Row"]>;
        Relationships: [];
      };
      program_enrollments: {
        Row: Row<{
          id: string;
          user_id: string;
          program_id: string;
          started_on: string;
          current_week: number;
          current_session_index: number;
          status: "active" | "paused" | "completed";
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
          sync_status: string;
        }>;
        Insert: Insert<Database["public"]["Tables"]["program_enrollments"]["Row"]>;
        Update: Update<Database["public"]["Tables"]["program_enrollments"]["Row"]>;
        Relationships: [];
      };
      injuries: {
        Row: Row<{
          id: string;
          user_id: string;
          body_location: string;
          severity: number;
          notes: string | null;
          active: boolean;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
          sync_status: string;
        }>;
        Insert: Insert<Database["public"]["Tables"]["injuries"]["Row"]>;
        Update: Update<Database["public"]["Tables"]["injuries"]["Row"]>;
        Relationships: [];
      };
      sync_events: {
        Row: Row<{
          id: string;
          user_id: string;
          entity: string;
          entity_id: string;
          operation: "upsert" | "delete";
          status: string;
          last_error: string | null;
          created_at: string;
          updated_at: string;
        }>;
        Insert: Insert<Database["public"]["Tables"]["sync_events"]["Row"]>;
        Update: Update<Database["public"]["Tables"]["sync_events"]["Row"]>;
        Relationships: [];
      };
      donations: {
        Row: Row<{
          id: string;
          user_id: string | null;
          email: string | null;
          stripe_checkout_session_id: string | null;
          stripe_payment_intent_id: string | null;
          amount_cents: number;
          currency: string;
          mode: "payment" | "subscription";
          status: string;
          created_at: string;
        }>;
        Insert: Insert<{
          id: string;
          user_id?: string | null;
          email?: string | null;
          stripe_checkout_session_id?: string | null;
          stripe_payment_intent_id?: string | null;
          amount_cents: number;
          currency?: string;
          mode: "payment" | "subscription";
          status: string;
          created_at?: string;
        }>;
        Update: Update<Database["public"]["Tables"]["donations"]["Row"]>;
        Relationships: [];
      };
      stripe_events: {
        Row: Row<{
          id: string;
          type: string;
          processed_at: string;
        }>;
        Insert: Insert<{
          id: string;
          type: string;
          processed_at?: string;
        }>;
        Update: Update<Database["public"]["Tables"]["stripe_events"]["Row"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
