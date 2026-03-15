import { IMAGES } from '../images';
import { LucideIcon, Zap, Battery, Sun, Wind } from 'lucide-react';
import { supabase, isSupabaseConnected } from './supabase';

export interface HeroSlide {
  id: number;
  image: string;
  title: string;
  environment: string;
  subtitle: string;
  iconName: string;
}

export interface HeroProduct {
  id: number;
  title: string;
  desc: string;
  image: string;
  iconName: string;
  link: string;
}

const initialSlides: HeroSlide[] = [
  {
    id: 1,
    image: IMAGES.hero.slide1,
    title: "Agile EV Platform",
    environment: "Orchard",
    subtitle: "1.4m ultra-narrow design. Maximize efficiency without damaging your trees.",
    iconName: "Zap"
  },
  {
    id: 2,
    image: IMAGES.hero.slide2,
    title: "LFP Battery Tech",
    environment: "Industry",
    subtitle: "Advanced LFP Tech. 3x lifespan, zero maintenance, 100% safe.",
    iconName: "Battery"
  },
  {
    id: 3,
    image: IMAGES.hero.slide3,
    title: "Solar Integration",
    environment: "Home",
    subtitle: "Seamless Solar. Reduce grid reliance with smart home integration.",
    iconName: "Sun"
  },
  {
    id: 4,
    image: IMAGES.hero.slide4,
    title: "WIND TURBINE SYSTEM",
    environment: "Construction Site",
    subtitle: "Robust Off-Grid Power. Wind systems built for NZ's toughest sites.",
    iconName: "Wind"
  }
];

const initialProducts: HeroProduct[] = [
  {
    id: 1,
    title: "Electric Platforms",
    desc: "Agile, zero-emission lifting and transport vehicles.",
    image: IMAGES.fleet.sb7500,
    iconName: "Zap",
    link: "/machinery"
  },
  {
    id: 2,
    title: "LFP Battery Tech",
    desc: "Advanced, long-lasting batteries for your entire fleet.",
    image: IMAGES.battery.forklift,
    iconName: "Battery",
    link: "/battery-tech"
  },
  {
    id: 3,
    title: "Solar & Wind Systems",
    desc: "Sustainable off-grid power generation solutions.",
    image: IMAGES.hero.slide3,
    iconName: "Sun",
    link: "/battery-tech#solar-panel"
  }
];

const LOCAL_STORAGE_SLIDES_KEY = 'tne_hero_slides';
const LOCAL_STORAGE_PRODUCTS_KEY = 'tne_hero_products';

const getLocalSlides = (): HeroSlide[] => {
  const stored = localStorage.getItem(LOCAL_STORAGE_SLIDES_KEY);
  if (stored) {
    try { return JSON.parse(stored); } catch (e) { return initialSlides; }
  }
  return initialSlides;
};

const saveLocalSlides = (slides: HeroSlide[]) => {
  localStorage.setItem(LOCAL_STORAGE_SLIDES_KEY, JSON.stringify(slides));
};

const getLocalProducts = (): HeroProduct[] => {
  const stored = localStorage.getItem(LOCAL_STORAGE_PRODUCTS_KEY);
  if (stored) {
    try { return JSON.parse(stored); } catch (e) { return initialProducts; }
  }
  return initialProducts;
};

const saveLocalProducts = (products: HeroProduct[]) => {
  localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(products));
};

export const HeroService = {
  getAllSlides: async (): Promise<HeroSlide[]> => {
    if (!isSupabaseConnected) return getLocalSlides();
    try {
      const { data, error } = await supabase.from('hero_slides').select('*').order('id', { ascending: true });
      if (error) throw error;
      
      if (!data || data.length === 0) {
        const { data: insertedData, error: insertError } = await supabase
          .from('hero_slides')
          .insert(initialSlides)
          .select();
        if (insertError) throw insertError;
        return insertedData as HeroSlide[];
      }
      return data as HeroSlide[];
    } catch (e) {
      console.error("Failed to fetch hero slides", e);
      return getLocalSlides();
    }
  },

  updateSlide: async (updatedSlide: HeroSlide) => {
    const { id, ...rest } = updatedSlide;
    if (!isSupabaseConnected) {
      const slides = getLocalSlides().map(s => s.id === id ? { ...s, ...rest } as HeroSlide : s);
      saveLocalSlides(slides);
      return;
    }
    const { error } = await supabase.from('hero_slides').update(rest).eq('id', id);
    if (error) throw error;
  },

  getAllProducts: async (): Promise<HeroProduct[]> => {
    if (!isSupabaseConnected) return getLocalProducts();
    try {
      const { data, error } = await supabase.from('hero_products').select('*').order('id', { ascending: true });
      if (error) throw error;
      
      if (!data || data.length === 0) {
        const { data: insertedData, error: insertError } = await supabase
          .from('hero_products')
          .insert(initialProducts)
          .select();
        if (insertError) throw insertError;
        return insertedData as HeroProduct[];
      }
      return data as HeroProduct[];
    } catch (e) {
      console.error("Failed to fetch hero products", e);
      return getLocalProducts();
    }
  },

  updateProduct: async (updatedProduct: HeroProduct) => {
    const { id, ...rest } = updatedProduct;
    if (!isSupabaseConnected) {
      const products = getLocalProducts().map(p => p.id === id ? { ...p, ...rest } as HeroProduct : p);
      saveLocalProducts(products);
      return;
    }
    const { error } = await supabase.from('hero_products').update(rest).eq('id', id);
    if (error) throw error;
  },

  reset: async (customSlides?: HeroSlide[], customProducts?: HeroProduct[]) => {
    const slidesToInsert = customSlides || initialSlides;
    const productsToInsert = customProducts || initialProducts;
    
    if (!isSupabaseConnected) {
      saveLocalSlides(slidesToInsert);
      saveLocalProducts(productsToInsert);
      return;
    }

    await supabase.from('hero_slides').delete().neq('id', 0);
    await supabase.from('hero_products').delete().neq('id', 0);
    
    await supabase.from('hero_slides').insert(slidesToInsert);
    await supabase.from('hero_products').insert(productsToInsert);
  }
};
