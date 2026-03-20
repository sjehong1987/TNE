import { supabase, isSupabaseConnected } from './supabase';

const LOCAL_STORAGE_KEY = 'customLogo';

export const SettingsService = {
  getLogo: async (): Promise<string | null> => {
    if (!isSupabaseConnected) {
      return localStorage.getItem(LOCAL_STORAGE_KEY);
    }
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'customLogo')
        .single();
        
      if (error) {
        // If table doesn't exist or row doesn't exist, fallback to local
        return localStorage.getItem(LOCAL_STORAGE_KEY);
      }
      return data?.value || null;
    } catch (e) {
      console.error("Failed to fetch logo from Supabase", e);
      return localStorage.getItem(LOCAL_STORAGE_KEY);
    }
  },

  saveLogo: async (base64String: string | null): Promise<void> => {
    if (base64String) {
      localStorage.setItem(LOCAL_STORAGE_KEY, base64String);
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }

    if (!isSupabaseConnected) return;

    try {
      if (base64String) {
        // Upsert the logo
        const { error } = await supabase
          .from('settings')
          .upsert({ key: 'customLogo', value: base64String }, { onConflict: 'key' });
        if (error) throw error;
      } else {
        // Delete the logo
        const { error } = await supabase
          .from('settings')
          .delete()
          .eq('key', 'customLogo');
        if (error) throw error;
      }
    } catch (e) {
      console.error("Failed to save logo to Supabase", e);
    }
  }
};
