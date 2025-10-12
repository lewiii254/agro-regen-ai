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
      climate_alerts: {
        Row: {
          alert_type: string
          created_at: string | null
          description: string
          farm_id: string
          forecast_date: string
          id: string
          is_read: boolean | null
          severity: string
        }
        Insert: {
          alert_type: string
          created_at?: string | null
          description: string
          farm_id: string
          forecast_date: string
          id?: string
          is_read?: boolean | null
          severity: string
        }
        Update: {
          alert_type?: string
          created_at?: string | null
          description?: string
          farm_id?: string
          forecast_date?: string
          id?: string
          is_read?: boolean | null
          severity?: string
        }
        Relationships: [
          {
            foreignKeyName: "climate_alerts_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          category: string | null
          content: string
          created_at: string | null
          id: string
          likes: number | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string | null
          id?: string
          likes?: number | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string | null
          id?: string
          likes?: number | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      crop_yield_predictions: {
        Row: {
          confidence_score: number
          created_at: string
          crop_type: string
          expected_harvest_date: string
          farm_id: string
          id: string
          planting_date: string
          predicted_yield: number
        }
        Insert: {
          confidence_score: number
          created_at?: string
          crop_type: string
          expected_harvest_date: string
          farm_id: string
          id?: string
          planting_date: string
          predicted_yield: number
        }
        Update: {
          confidence_score?: number
          created_at?: string
          crop_type?: string
          expected_harvest_date?: string
          farm_id?: string
          id?: string
          planting_date?: string
          predicted_yield?: number
        }
        Relationships: [
          {
            foreignKeyName: "crop_yield_predictions_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
        ]
      }
      farms: {
        Row: {
          created_at: string | null
          id: string
          latitude: number | null
          location: string
          longitude: number | null
          name: string
          size_hectares: number | null
          soil_type: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          latitude?: number | null
          location: string
          longitude?: number | null
          name: string
          size_hectares?: number | null
          soil_type?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          latitude?: number | null
          location?: string
          longitude?: number | null
          name?: string
          size_hectares?: number | null
          soil_type?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      irrigation_schedules: {
        Row: {
          created_at: string
          farm_id: string
          frequency: string
          id: string
          next_irrigation_date: string
          schedule_name: string
          status: string
          updated_at: string
          water_amount_liters: number
        }
        Insert: {
          created_at?: string
          farm_id: string
          frequency: string
          id?: string
          next_irrigation_date: string
          schedule_name: string
          status?: string
          updated_at?: string
          water_amount_liters: number
        }
        Update: {
          created_at?: string
          farm_id?: string
          frequency?: string
          id?: string
          next_irrigation_date?: string
          schedule_name?: string
          status?: string
          updated_at?: string
          water_amount_liters?: number
        }
        Relationships: [
          {
            foreignKeyName: "irrigation_schedules_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_resources: {
        Row: {
          category: string
          content_type: string
          content_url: string
          created_at: string
          description: string
          difficulty_level: string
          duration_minutes: number
          id: string
          likes: number
          title: string
          updated_at: string
          views: number
        }
        Insert: {
          category: string
          content_type: string
          content_url: string
          created_at?: string
          description: string
          difficulty_level: string
          duration_minutes: number
          id?: string
          likes?: number
          title: string
          updated_at?: string
          views?: number
        }
        Update: {
          category?: string
          content_type?: string
          content_url?: string
          created_at?: string
          description?: string
          difficulty_level?: string
          duration_minutes?: number
          id?: string
          likes?: number
          title?: string
          updated_at?: string
          views?: number
        }
        Relationships: []
      }
      market_prices: {
        Row: {
          created_at: string
          crop_type: string
          currency: string
          id: string
          market_trend: string
          price_per_kg: number
          recorded_date: string
          region: string
        }
        Insert: {
          created_at?: string
          crop_type: string
          currency?: string
          id?: string
          market_trend: string
          price_per_kg: number
          recorded_date: string
          region: string
        }
        Update: {
          created_at?: string
          crop_type?: string
          currency?: string
          id?: string
          market_trend?: string
          price_per_kg?: number
          recorded_date?: string
          region?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          link: string | null
          message: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          message: string
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          message?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      pest_disease_alerts: {
        Row: {
          affected_area: string
          alert_type: string
          created_at: string
          detected_date: string
          farm_id: string
          id: string
          is_resolved: boolean
          pest_disease_name: string
          severity: string
          symptoms: string
          treatment_recommendations: string
        }
        Insert: {
          affected_area: string
          alert_type: string
          created_at?: string
          detected_date: string
          farm_id: string
          id?: string
          is_resolved?: boolean
          pest_disease_name: string
          severity: string
          symptoms: string
          treatment_recommendations: string
        }
        Update: {
          affected_area?: string
          alert_type?: string
          created_at?: string
          detected_date?: string
          farm_id?: string
          id?: string
          is_resolved?: boolean
          pest_disease_name?: string
          severity?: string
          symptoms?: string
          treatment_recommendations?: string
        }
        Relationships: [
          {
            foreignKeyName: "pest_disease_alerts_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
        ]
      }
      post_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          post_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          post_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      soil_health_reports: {
        Row: {
          created_at: string | null
          farm_id: string
          health_score: number | null
          id: string
          moisture_content: number | null
          nitrogen_level: number | null
          organic_matter: number | null
          ph_level: number | null
          phosphorus_level: number | null
          potassium_level: number | null
          recommendations: string | null
        }
        Insert: {
          created_at?: string | null
          farm_id: string
          health_score?: number | null
          id?: string
          moisture_content?: number | null
          nitrogen_level?: number | null
          organic_matter?: number | null
          ph_level?: number | null
          phosphorus_level?: number | null
          potassium_level?: number | null
          recommendations?: string | null
        }
        Update: {
          created_at?: string | null
          farm_id?: string
          health_score?: number | null
          id?: string
          moisture_content?: number | null
          nitrogen_level?: number | null
          organic_matter?: number | null
          ph_level?: number | null
          phosphorus_level?: number | null
          potassium_level?: number | null
          recommendations?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "soil_health_reports_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          created_at: string | null
          experience_years: number | null
          farm_location: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          experience_years?: number | null
          farm_location?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          experience_years?: number | null
          farm_location?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
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
