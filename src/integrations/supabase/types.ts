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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      box_attempts: {
        Row: {
          answers: Json | null
          box_type: Database["public"]["Enums"]["box_type"]
          current_question_index: number | null
          ended_at: string | null
          id: string
          player_id: string
          quiz_start_time: string | null
          score: number | null
          session_id: string
          started_at: string
          success: boolean | null
        }
        Insert: {
          answers?: Json | null
          box_type: Database["public"]["Enums"]["box_type"]
          current_question_index?: number | null
          ended_at?: string | null
          id?: string
          player_id: string
          quiz_start_time?: string | null
          score?: number | null
          session_id: string
          started_at?: string
          success?: boolean | null
        }
        Update: {
          answers?: Json | null
          box_type?: Database["public"]["Enums"]["box_type"]
          current_question_index?: number | null
          ended_at?: string | null
          id?: string
          player_id?: string
          quiz_start_time?: string | null
          score?: number | null
          session_id?: string
          started_at?: string
          success?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "box_attempts_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "session_players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "box_attempts_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "game_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      box_unlocks: {
        Row: {
          box_type: Database["public"]["Enums"]["box_type"]
          code_validated: boolean
          id: string
          session_id: string
          unlocked_at: string
        }
        Insert: {
          box_type: Database["public"]["Enums"]["box_type"]
          code_validated?: boolean
          id?: string
          session_id: string
          unlocked_at?: string
        }
        Update: {
          box_type?: Database["public"]["Enums"]["box_type"]
          code_validated?: boolean
          id?: string
          session_id?: string
          unlocked_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "box_unlocks_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "game_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      game_sessions: {
        Row: {
          created_at: string
          end_time: string | null
          id: string
          session_code: string
          start_time: string
          status: Database["public"]["Enums"]["session_status"]
        }
        Insert: {
          created_at?: string
          end_time?: string | null
          id?: string
          session_code: string
          start_time?: string
          status?: Database["public"]["Enums"]["session_status"]
        }
        Update: {
          created_at?: string
          end_time?: string | null
          id?: string
          session_code?: string
          start_time?: string
          status?: Database["public"]["Enums"]["session_status"]
        }
        Relationships: []
      }
      player_answers: {
        Row: {
          answered_at: string
          id: string
          is_correct: boolean
          player_id: string
          question_id: string
        }
        Insert: {
          answered_at?: string
          id?: string
          is_correct: boolean
          player_id: string
          question_id: string
        }
        Update: {
          answered_at?: string
          id?: string
          is_correct?: boolean
          player_id?: string
          question_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "player_answers_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "session_players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          box_type: Database["public"]["Enums"]["box_type"]
          correct_answer: number
          created_at: string
          explanation: string | null
          id: string
          image_url: string | null
          options: Json
          question_text: string
        }
        Insert: {
          box_type: Database["public"]["Enums"]["box_type"]
          correct_answer: number
          created_at?: string
          explanation?: string | null
          id: string
          image_url?: string | null
          options: Json
          question_text: string
        }
        Update: {
          box_type?: Database["public"]["Enums"]["box_type"]
          correct_answer?: number
          created_at?: string
          explanation?: string | null
          id?: string
          image_url?: string | null
          options?: Json
          question_text?: string
        }
        Relationships: []
      }
      session_players: {
        Row: {
          assigned_box: Database["public"]["Enums"]["box_type"] | null
          avatar_url: string
          id: string
          joined_at: string
          pseudo: string
          session_id: string
        }
        Insert: {
          assigned_box?: Database["public"]["Enums"]["box_type"] | null
          avatar_url: string
          id?: string
          joined_at?: string
          pseudo: string
          session_id: string
        }
        Update: {
          assigned_box?: Database["public"]["Enums"]["box_type"] | null
          avatar_url?: string
          id?: string
          joined_at?: string
          pseudo?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_players_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "game_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      box_type: "A" | "B" | "C" | "D"
      session_status: "active" | "completed"
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
      box_type: ["A", "B", "C", "D"],
      session_status: ["active", "completed"],
    },
  },
} as const
