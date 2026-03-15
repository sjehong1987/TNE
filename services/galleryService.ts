import { IMAGES } from '../images';
import { supabase, isSupabaseConnected } from './supabase';

export interface GalleryItem {
  id: number;
  image: string;
  title: string;
  location: string;
  description: string;
  author: string;
  date: string;
  tags: string[];
  status: 'approved' | 'pending';
}

const initialGalleryItems: GalleryItem[] = [
  {
    id: 1,
    image: IMAGES.hero.slide1,
    title: "Orchard Efficiency Boost",
    location: "Hawke's Bay, NZ",
    description: "Using the Agile EV Platform for apple picking. The narrow design fits perfectly between the rows.",
    author: "John Smith",
    date: "2023-11-15",
    tags: ["Agile EV", "Orchard"],
    status: 'approved'
  },
  {
    id: 2,
    image: IMAGES.fleet.sb7500,
    title: "Heavy Lifting Made Easy",
    location: "Auckland Construction Site",
    description: "The SB7500 handling heavy loads with ease. Zero emissions is a huge plus for our indoor work.",
    author: "Sarah Williams",
    date: "2023-12-02",
    tags: ["Lifting Platform", "Construction"],
    status: 'approved'
  },
  {
    id: 3,
    image: IMAGES.hero.slide3,
    title: "Solar Integration Setup",
    location: "Waikato Farm",
    description: "Just installed the new solar panels. Powering our entire irrigation system now.",
    author: "Mike Johnson",
    date: "2024-01-10",
    tags: ["Solar", "Farm"],
    status: 'approved'
  },
  {
    id: 4,
    image: IMAGES.fleet.autonomousSprayer,
    title: "Autonomous Spraying Run",
    location: "Marlborough Vineyard",
    description: "Set it and forget it. The autonomous sprayer covers the whole vineyard overnight.",
    author: "Emily Chen",
    date: "2024-02-20",
    tags: ["Autonomous", "Vineyard"],
    status: 'approved'
  },
  {
    id: 5,
    image: IMAGES.fleet.sev500,
    title: "Transporting Harvest",
    location: "Bay of Plenty",
    description: "Moving kiwi fruit bins efficiently. The battery life lasts the whole shift.",
    author: "David Brown",
    date: "2024-03-05",
    tags: ["Transport", "Harvest"],
    status: 'approved'
  },
  {
    id: 6,
    image: IMAGES.hero.slide4,
    title: "Wind Power Backup",
    location: "Wellington Hills",
    description: "Reliable power even on windy days. Great backup for our off-grid setup.",
    author: "Jessica Taylor",
    date: "2024-03-15",
    tags: ["Wind Turbine", "Off-Grid"],
    status: 'approved'
  }
];

// LocalStorage fallback helpers
const LOCAL_STORAGE_KEY = 'tne_gallery_items';

const getLocalItems = (): GalleryItem[] => {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return initialGalleryItems;
    }
  }
  return initialGalleryItems;
};

const saveLocalItems = (items: GalleryItem[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
};

export const GalleryService = {
  getAllItems: async (): Promise<GalleryItem[]> => {
    if (!isSupabaseConnected) return getLocalItems();
    try {
      const { data, error } = await supabase.from('gallery').select('*').order('id', { ascending: false });
      if (error) throw error;
      if (!data || data.length === 0) {
        const itemsToInsert = initialGalleryItems.map(({ id, ...rest }) => rest);
        const { data: insertedData, error: insertError } = await supabase.from('gallery').insert(itemsToInsert).select();
        if (insertError) throw insertError;
        return insertedData as GalleryItem[];
      }
      return data as GalleryItem[];
    } catch (e) {
      console.error("Failed to fetch gallery items", e);
      return getLocalItems();
    }
  },

  getApprovedItems: async (): Promise<GalleryItem[]> => {
    if (!isSupabaseConnected) return getLocalItems().filter(i => i.status === 'approved');
    try {
      const { data, error } = await supabase.from('gallery').select('*').eq('status', 'approved').order('id', { ascending: false });
      if (error) throw error;
      if (!data || data.length === 0) return initialGalleryItems.filter(i => i.status === 'approved');
      return data as GalleryItem[];
    } catch (e) {
      console.error("Failed to fetch approved gallery items", e);
      return getLocalItems().filter(i => i.status === 'approved');
    }
  },

  getPendingItems: async (): Promise<GalleryItem[]> => {
    if (!isSupabaseConnected) return getLocalItems().filter(i => i.status === 'pending');
    try {
      const { data, error } = await supabase.from('gallery').select('*').eq('status', 'pending').order('id', { ascending: false });
      if (error) throw error;
      return data as GalleryItem[] || [];
    } catch (e) {
      console.error("Failed to fetch pending gallery items", e);
      return getLocalItems().filter(i => i.status === 'pending');
    }
  },

  addItem: async (item: Omit<GalleryItem, 'id' | 'status'>): Promise<GalleryItem> => {
    const newItem: GalleryItem = { ...item, id: Date.now(), status: 'pending' };
    
    if (!isSupabaseConnected) {
      const items = getLocalItems();
      saveLocalItems([newItem, ...items]);
      return newItem;
    }

    const { data, error } = await supabase
      .from('gallery')
      .insert([{ ...item, status: 'pending' }])
      .select()
      .single();
    
    if (error) throw error;
    return data as GalleryItem;
  },

  approveItem: async (id: number) => {
    if (!isSupabaseConnected) {
      const items = getLocalItems().map(item => item.id === id ? { ...item, status: 'approved' as const } : item);
      saveLocalItems(items);
      return;
    }
    const { error } = await supabase.from('gallery').update({ status: 'approved' }).eq('id', id);
    if (error) throw error;
  },

  deleteItem: async (id: number) => {
    if (!isSupabaseConnected) {
      const items = getLocalItems().filter(item => item.id !== id);
      saveLocalItems(items);
      return;
    }
    const { error } = await supabase.from('gallery').delete().eq('id', id);
    if (error) throw error;
  },

  reset: async (customData?: GalleryItem[]) => {
    const dataToInsert = customData || initialGalleryItems;
    if (!isSupabaseConnected) {
      saveLocalItems(dataToInsert);
      return;
    }
    await supabase.from('gallery').delete().neq('id', 0);
    const itemsToInsert = dataToInsert.map(({ id, ...rest }) => rest);
    await supabase.from('gallery').insert(itemsToInsert);
  }
};
