import 'server-only';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export type SupabaseDatabase = {
  public: {
    Tables: {
      views: {
        Row: {
          slug: string;
          count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          slug: string;
          count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          slug?: string;
          count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      increment_view: {
        Args: {
          slug_input: string;
        };
        Returns: number;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

let cachedClient: SupabaseClient<SupabaseDatabase> | null = null;

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return null;
  }

  return { url, key };
}

export function getSupabaseServerClient(): SupabaseClient<SupabaseDatabase> | null {
  if (cachedClient) {
    return cachedClient;
  }

  const config = getSupabaseConfig();
  if (!config) {
    return null;
  }

  cachedClient = createClient<SupabaseDatabase>(config.url, config.key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return cachedClient;
}
