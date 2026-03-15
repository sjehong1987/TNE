import { MachineItem } from '../types';
import { liftingPlatforms, transportVehicles, autonomousSprayerData } from '../components/machineryData';
import { supabase } from './supabase';

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

export const ProductService = {
  getAllProducts: async (): Promise<Product[]> => {
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
      return initialProducts;
    }
  },

  getProductsByCategory: async (category: Product['category']): Promise<Product[]> => {
    try {
      const { data, error } = await supabase.from('products').select('*').eq('category', category).order('id', { ascending: true });
      if (error) throw error;
      if (!data || data.length === 0) return initialProducts.filter(p => p.category === category);
      return data as Product[];
    } catch (e) {
      console.error("Failed to fetch products by category", e);
      return initialProducts.filter(p => p.category === category);
    }
  },

  addProduct: async (product: Omit<Product, 'id'>): Promise<Product> => {
    // Ensure specs, features, and images are arrays, even if empty
    const productToInsert = {
      ...product,
      specs: product.specs || [],
      features: product.features || [],
      images: product.images || []
    };

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
    const { error } = await supabase.from('products').update(productToUpdate).eq('id', id);
    if (error) throw error;
  },

  deleteProduct: async (id: number) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
  },

  reset: async (customData?: Product[]) => {
    const dataToInsert = customData || initialProducts;
    await supabase.from('products').delete().neq('id', 0);
    await supabase.from('products').insert(dataToInsert);
  }
};
