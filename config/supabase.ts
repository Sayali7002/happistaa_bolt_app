import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Custom storage implementation
const createSecureStorage = () => {
  if (Platform.OS === 'web') {
    // For web, use localStorage
    return {
      getItem: async (key: string) => {
        return localStorage.getItem(key);
      },
      setItem: async (key: string, value: string) => {
        localStorage.setItem(key, value);
      },
      removeItem: async (key: string) => {
        localStorage.removeItem(key);
      },
    };
  } else {
    // For native platforms, use SecureStore
    return {
      getItem: (key: string) => {
        return SecureStore.getItemAsync(key);
      },
      setItem: (key: string, value: string) => {
        return SecureStore.setItemAsync(key, value);
      },
      removeItem: (key: string) => {
        return SecureStore.deleteItemAsync(key);
      },
    };
  }
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: createSecureStorage(),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          name: string | null;
          dob: string | null;
          location: string | null;
          gender: string | null;
          workplace: string | null;
          job_title: string | null;
          education: string | null;
          religious_beliefs: string | null;
          availability: string | null;
          communication_style: string | null;
          support_type: string | null;
          completed_setup: boolean;
          support_preferences: string[] | null;
          journey_note: string | null;
        };
        Insert: {
          id: string;
          created_at?: string;
          updated_at?: string;
          name?: string | null;
          dob?: string | null;
          location?: string | null;
          gender?: string | null;
          workplace?: string | null;
          job_title?: string | null;
          education?: string | null;
          religious_beliefs?: string | null;
          availability?: string | null;
          communication_style?: string | null;
          support_type?: string | null;
          completed_setup?: boolean;
          support_preferences?: string[] | null;
          journey_note?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          name?: string | null;
          dob?: string | null;
          location?: string | null;
          gender?: string | null;
          workplace?: string | null;
          job_title?: string | null;
          education?: string | null;
          religious_beliefs?: string | null;
          availability?: string | null;
          communication_style?: string | null;
          support_type?: string | null;
          completed_setup?: boolean;
          support_preferences?: string[] | null;
          journey_note?: string | null;
        };
      };
      mindfulness_entries: {
        Row: {
          id: string;
          user_id: string;
          created_at: string;
          updated_at: string;
          type: string;
          content: string;
          mood?: string | null;
          category?: string | null;
          is_private: boolean;
          tags?: string[] | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          created_at?: string;
          updated_at?: string;
          type: string;
          content: string;
          mood?: string | null;
          category?: string | null;
          is_private?: boolean;
          tags?: string[] | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
          type?: string;
          content?: string;
          mood?: string | null;
          category?: string | null;
          is_private?: boolean;
          tags?: string[] | null;
        };
      };
    };
  };
};