import { MachineItem } from '../types';
import { liftingPlatforms, transportVehicles, autonomousSprayerData } from '../components/machineryData';
import { supabase, isSupabaseConnected } from './supabase';

export interface Product extends MachineItem {
  category: 'Lifting Platform' | 'Transport Vehicle' | 'Autonomous Sprayer';
  youtubeId?: string; // For the sprayer
}

// Helper to convert initial data to Product format
const initialProducts: Product[] = [
  ...liftingPlatforms.map(item => ({ ...item, category: 'Lifting Platform' as const })),
  ...transportVehicles.map(item => ({ ...item, category: 'Transport Vehicle' as const })),
  {
    id: 99, // Unique ID for the sprayer
    image: autonomousSprayerData.image,
    badge: "RTK GNSS",
    subTitle: "Future Tech",
    title: autonomousSprayerData.title,
    description: autonomousSprayerData.description,
    specs: [
      { label: "Navigation", value: "RTK GNSS" },
      { label: "Capacity", value: "1000L" },
      { label: "Power", value: "Hybrid" },
      { label: "Daily Cap", value: "23,000L" }
    ],
    features: ["RTK GNSS Navigation", "Hybrid Power System", "Auto-Return", "34HP Diesel Engine"],
    ctaText: "Book Demo",
    category: 'Autonomous Sprayer',
    youtubeId: autonomousSprayerData.youtubeId
  }
];

const LOCAL_STORAGE_KEY = 'tne_products';

const getLocalProducts = (): Product[] => {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return initialProducts;
    }
  }
  return initialProducts;
};

const saveLocalProducts = (products: Product[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(products));
};

export const ProductService = {
  getAllProducts: async (): Promise<Product[]> => {
    if (!isSupabaseConnected) return getLocalProducts();
    try {
      const { data, error } = await supabase.from('products').select('*').order('id', { ascending: true });
      if (error) throw error;
      
      if (!data || data.length === 0) {
        const { data: insertedData, error: insertError } = await supabase
          .from('products')
          .insert(initialProducts)
          .select();
        if (insertError) throw insertError;
        return insertedData as Product[];
      }
      return data as Product[];
    } catch (e) {
      console.error("Failed to fetch products", e);
      return getLocalProducts();
    }
  },

  getProductsByCategory: async (category: Product['category']): Promise<Product[]> => {
    if (!isSupabaseConnected) return getLocalProducts().filter(p => p.category === category);
    try {
      const { data, error } = await supabase.from('products').select('*').eq('category', category).order('id', { ascending: true });
      if (error) throw error;
      if (!data || data.length === 0) return initialProducts.filter(p => p.category === category);
      return data as Product[];
    } catch (e) {
      console.error("Failed to fetch products by category", e);
      return getLocalProducts().filter(p => p.category === category);
    }
  },

  addProduct: async (product: Omit<Product, 'id'>): Promise<Product> => {
    const productToInsert = {
      ...product,
      specs: product.specs || [],
      features: product.features || [],
      images: product.images || []
    };

    if (!isSupabaseConnected) {
      const newProduct = { ...productToInsert, id: Date.now() } as Product;
      const products = getLocalProducts();
      saveLocalProducts([...products, newProduct]);
      return newProduct;
    }

    const { data, error } = await supabase
      .from('products')
      .insert([productToInsert])
      .select()
      .single();
    if (error) {
      console.error("Supabase insert error:", error);
      throw error;
    }
    return data as Product;
  },

  updateProduct: async (updatedProduct: Product) => {
    const { id, ...rest } = updatedProduct;
    const productToUpdate = {
      ...rest,
      images: rest.images || []
    };

    if (!isSupabaseConnected) {
      const products = getLocalProducts().map(p => p.id === id ? { ...p, ...productToUpdate } as Product : p);
      saveLocalProducts(products);
      return;
    }

    const { error } = await supabase.from('products').update(productToUpdate).eq('id', id);
    if (error) throw error;
  },

  deleteProduct: async (id: number) => {
    if (!isSupabaseConnected) {
      const products = getLocalProducts().filter(p => p.id !== id);
      saveLocalProducts(products);
      return;
    }
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
  },

  reset: async (customData?: Product[]) => {
    const dataToInsert = customData || initialProducts;
    if (!isSupabaseConnected) {
      saveLocalProducts(dataToInsert);
      return;
    }
    await supabase.from('products').delete().neq('id', 0);
    await supabase.from('products').insert(dataToInsert);
  }
};
