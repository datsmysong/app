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
      bound_services: {
        Row: {
          access_token: string | null
          expires_in: string | null
          refresh_token: string | null
          service_id: string
          user_profile_id: string
        }
        Insert: {
          access_token?: string | null
          expires_in?: string | null
          refresh_token?: string | null
          service_id: string
          user_profile_id: string
        }
        Update: {
          access_token?: string | null
          expires_in?: string | null
          refresh_token?: string | null
          service_id?: string
          user_profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bound_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "streaming_services"
            referencedColumns: ["service_id"]
          },
          {
            foreignKeyName: "bound_services_user_profile_id_fkey"
            columns: ["user_profile_id"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["user_profile_id"]
          },
        ]
      }
      friends_list: {
        Row: {
          friends_since: string
          user_profile_id_1: string
          user_profile_id_2: string
        }
        Insert: {
          friends_since: string
          user_profile_id_1: string
          user_profile_id_2: string
        }
        Update: {
          friends_since?: string
          user_profile_id_1?: string
          user_profile_id_2?: string
        }
        Relationships: [
          {
            foreignKeyName: "friends_list_user_profile_id_1_fkey"
            columns: ["user_profile_id_1"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["user_profile_id"]
          },
          {
            foreignKeyName: "friends_list_user_profile_id_2_fkey"
            columns: ["user_profile_id_2"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["user_profile_id"]
          },
        ]
      }
      friends_request: {
        Row: {
          asker_user_profile_id: string
          expires_at: string
          receiver_user_profile_id: string
          sent_at: string
        }
        Insert: {
          asker_user_profile_id: string
          expires_at?: string
          receiver_user_profile_id: string
          sent_at?: string
        }
        Update: {
          asker_user_profile_id?: string
          expires_at?: string
          receiver_user_profile_id?: string
          sent_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "friends_request_asker_user_profile_id_fkey"
            columns: ["asker_user_profile_id"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["user_profile_id"]
          },
          {
            foreignKeyName: "friends_request_receiver_user_profile_id_fkey"
            columns: ["receiver_user_profile_id"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["user_profile_id"]
          },
        ]
      }
      profile: {
        Row: {
          created_at: string
          id: string
          nickname: string
        }
        Insert: {
          created_at?: string
          id?: string
          nickname: string
        }
        Update: {
          created_at?: string
          id?: string
          nickname?: string
        }
        Relationships: []
      }
      room_configurations: {
        Row: {
          id: string
          max_music_count_in_queue_per_participant: number
          max_music_duration: number
          vote_skipping: boolean
          vote_skipping_needed_percentage: number
        }
        Insert: {
          id?: string
          max_music_count_in_queue_per_participant: number
          max_music_duration: number
          vote_skipping: boolean
          vote_skipping_needed_percentage: number
        }
        Update: {
          id?: string
          max_music_count_in_queue_per_participant?: number
          max_music_duration?: number
          vote_skipping?: boolean
          vote_skipping_needed_percentage?: number
        }
        Relationships: []
      }
      room_history: {
        Row: {
          added_at: string
          music_id: string
          position: number
          profile_id: string | null
          room_id: string
        }
        Insert: {
          added_at?: string
          music_id: string
          position: number
          profile_id?: string | null
          room_id: string
        }
        Update: {
          added_at?: string
          music_id?: string
          position?: number
          profile_id?: string | null
          room_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "room_history_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_history_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      room_users: {
        Row: {
          banned: boolean
          has_left: boolean
          joined_at: string
          profile_id: string
          room_id: string
        }
        Insert: {
          banned?: boolean
          has_left?: boolean
          joined_at?: string
          profile_id: string
          room_id: string
        }
        Update: {
          banned?: boolean
          has_left?: boolean
          joined_at?: string
          profile_id?: string
          room_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "room_users_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_users_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      rooms: {
        Row: {
          code: string | null
          configuration_id: string | null
          created_at: string
          ended_at: string | null
          host_user_profile_id: string | null
          id: string
          is_active: boolean
          name: string
          service_id: string | null
        }
        Insert: {
          code?: string | null
          configuration_id?: string | null
          created_at?: string
          ended_at?: string | null
          host_user_profile_id?: string | null
          id?: string
          is_active?: boolean
          name: string
          service_id?: string | null
        }
        Update: {
          code?: string | null
          configuration_id?: string | null
          created_at?: string
          ended_at?: string | null
          host_user_profile_id?: string | null
          id?: string
          is_active?: boolean
          name?: string
          service_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rooms_configuration_id_fkey"
            columns: ["configuration_id"]
            isOneToOne: false
            referencedRelation: "room_configurations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rooms_host_user_profile_id_fkey"
            columns: ["host_user_profile_id"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["user_profile_id"]
          },
          {
            foreignKeyName: "rooms_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "streaming_services"
            referencedColumns: ["service_id"]
          },
        ]
      }
      streaming_services: {
        Row: {
          description: string
          image_url: string
          likes_available: boolean
          need_account: boolean
          playback_available: boolean
          playlists_available: boolean
          service_id: string
          service_name: string
        }
        Insert: {
          description: string
          image_url: string
          likes_available?: boolean
          need_account?: boolean
          playback_available?: boolean
          playlists_available?: boolean
          service_id?: string
          service_name: string
        }
        Update: {
          description?: string
          image_url?: string
          likes_available?: boolean
          need_account?: boolean
          playback_available?: boolean
          playlists_available?: boolean
          service_id?: string
          service_name?: string
        }
        Relationships: []
      }
      user_profile: {
        Row: {
          account_id: string
          avatar: string | null
          user_profile_id: string
          username: string | null
        }
        Insert: {
          account_id: string
          avatar?: string | null
          user_profile_id: string
          username?: string | null
        }
        Update: {
          account_id?: string
          avatar?: string | null
          user_profile_id?: string
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profile_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_profile_avatar_fkey"
            columns: ["avatar"]
            isOneToOne: false
            referencedRelation: "objects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_profile_user_profile_id_fkey"
            columns: ["user_profile_id"]
            isOneToOne: true
            referencedRelation: "profile"
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
