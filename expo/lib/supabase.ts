import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { Database } from "commons/database-types";
import { Platform } from "react-native";
import "react-native-url-polyfill/auto";
// import * as SecureStore from 'expo-secure-store';
// var aesjs = require('aes-js');

const production = process.env.NODE_ENV === "production";
// https://github.com/supabase/supabase-js/issues/786
// Bug with classical AsyncStorage, so I use this one

class SupabaseStorage {
  async getItem(key: string) {
    if (Platform.OS === "web") {
      if (typeof localStorage === "undefined") {
        return null;
      }
      return localStorage.getItem(key);
    }
    return AsyncStorage.getItem(key);
  }
  async removeItem(key: string) {
    if (Platform.OS === "web") {
      return localStorage.removeItem(key);
    }
    return AsyncStorage.removeItem(key);
  }
  async setItem(key: string, value: string) {
    if (Platform.OS === "web") {
      console.log("[SupabaseStorage] Setting item", key, value);

      const cookiesParam = production ? ";domain=.datsmysong.app;secure" : "";
      document.cookie = `${key}=${value}${cookiesParam}`;
      console.log("[SupabaseStorage] document.cookie = ", document.cookie);

      return localStorage.setItem(key, value);
    }
    return AsyncStorage.setItem(key, value);
  }
}

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing env variables for Supabase");
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    // storage: new LargeSecureStore(),
    storage: new SupabaseStorage(),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: "pkce",
  },
});
