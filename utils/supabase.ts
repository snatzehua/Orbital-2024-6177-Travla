import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://zdpjafeamewywmyhfnox.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkcGphZmVhbWV3eXdteWhmbm94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjIxMDU1MjIsImV4cCI6MjAzNzY4MTUyMn0.Dlh6s-YgYZWc5NpLSik9vGr9pwXY8bhcdLK95RiO6jo";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});