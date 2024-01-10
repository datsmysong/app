import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { Platform } from "react-native";
import { Database } from "../../commons/Database-types";


// https://github.com/supabase/supabase-js/issues/786
// Bug ith classical AsyncStorage
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
    // console.log("remove item", key);
    
    if (Platform.OS === "web") {
      return localStorage.removeItem(key);
    }
    return AsyncStorage.removeItem(key);
  }
  async setItem(key: string, value: string) {
    // console.log("set item", key, value);
    if (Platform.OS === "web") {
      document.cookie = `${key}=${value}`;
      return localStorage.setItem(key, value);
    }
    return AsyncStorage.setItem(key, value);
  }
}

const supabaseUrl = "https://ckalsdcwrofxvgxslwiv.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrYWxzZGN3cm9meHZneHNsd2l2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ1NzkzNjAsImV4cCI6MjAyMDE1NTM2MH0.m6yeTDM0cb04tn4tna2WcRKZ410gqv6K6KZ0E2GZ8Hs";

  export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: new SupabaseStorage(),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: "pkce",
  },
});
