import { useState, useEffect } from 'react';

export const useCustomLogo = () => {
  const [customLogo, setCustomLogo] = useState<string | null>(null);

  useEffect(() => {
    const savedLogo = localStorage.getItem('customLogo');
    if (savedLogo) {
      setCustomLogo(savedLogo);
    }

    const handleLogoUpdate = () => {
      setCustomLogo(localStorage.getItem('customLogo'));
    };

    window.addEventListener('logo-updated', handleLogoUpdate);
    return () => window.removeEventListener('logo-updated', handleLogoUpdate);
  }, []);

  const updateLogo = (base64String: string | null) => {
    if (base64String) {
      localStorage.setItem('customLogo', base64String);
    } else {
      localStorage.removeItem('customLogo');
    }
    window.dispatchEvent(new Event('logo-updated'));
  };

  return { customLogo, updateLogo };
};
