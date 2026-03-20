import { useState, useEffect } from 'react';
import { SettingsService } from '../services/settingsService';

export const useCustomLogo = () => {
  const [customLogo, setCustomLogo] = useState<string | null>(null);

  useEffect(() => {
    // Initial fetch from Supabase (or localStorage fallback)
    const fetchLogo = async () => {
      const logo = await SettingsService.getLogo();
      if (logo) {
        setCustomLogo(logo);
      }
    };
    fetchLogo();

    const handleLogoUpdate = async () => {
      const logo = await SettingsService.getLogo();
      setCustomLogo(logo);
    };

    window.addEventListener('logo-updated', handleLogoUpdate);
    return () => window.removeEventListener('logo-updated', handleLogoUpdate);
  }, []);

  const updateLogo = async (base64String: string | null) => {
    // Optimistic update
    setCustomLogo(base64String);
    
    // Save to backend
    await SettingsService.saveLogo(base64String);
    
    // Notify other components
    window.dispatchEvent(new Event('logo-updated'));
  };

  return { customLogo, updateLogo };
};
