import React, { useState, useEffect, useRef } from 'react';
import { GalleryService, GalleryItem } from '../services/galleryService';
import { ProductService, Product } from '../services/productService';
import { HeroService, HeroSlide, HeroProduct } from '../services/heroService';
import { Check, Trash2, RefreshCw, AlertCircle, Lock, LogIn, Plus, Edit2, X, Upload, Camera } from 'lucide-react';
import { useCustomLogo } from '../hooks/useCustomLogo';
import { IMAGES } from '../images';
import Logo from '../components/Logo';

const AdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // Gallery State
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved'>('pending');

  // Product State
  const [activeSection, setActiveSection] = useState<'gallery' | 'products' | 'hero' | 'settings'>('gallery');
  const [products, setProducts] = useState<Product[]>([]);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Hero State
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [heroProducts, setHeroProducts] = useState<HeroProduct[]>([]);
  const [isHeroModalOpen, setIsHeroModalOpen] = useState(false);
  const [isHeroProductModalOpen, setIsHeroProductModalOpen] = useState(false);
  const [editingHero, setEditingHero] = useState<HeroSlide | null>(null);
  const [editingHeroProduct, setEditingHeroProduct] = useState<HeroProduct | null>(null);
  const [heroForm, setHeroForm] = useState<Partial<HeroSlide>>({
    title: '',
    environment: '',
    subtitle: '',
    image: '',
    iconName: 'Zap'
  });
  const [heroProductForm, setHeroProductForm] = useState<Partial<HeroProduct>>({
    title: '',
    desc: '',
    image: '',
    iconName: 'Zap',
    link: ''
  });

  // Product Form State
  const [productForm, setProductForm] = useState<Partial<Product>>({
    title: '',
    subTitle: '',
    description: '',
    category: 'Lifting Platform',
    specs: [],
    features: [],
    images: [],
    badge: '',
    ctaText: 'Book Demo',
    image: '',
    youtubeId: ''
  });

  // Settings State
  const { customLogo, updateLogo } = useCustomLogo();
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 400;
          const MAX_HEIGHT = 200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          try {
            const resizedBase64 = canvas.toDataURL('image/png');
            updateLogo(resizedBase64).catch(err => {
              console.error('Failed to save logo to backend:', err);
            });
          } catch (err) {
            console.error('Failed to save logo:', err);
            alert('Failed to save logo. The image might be too large even after resizing.');
          }
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin112233') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  const loadData = async () => {
    const gallery = await GalleryService.getAllItems();
    setGalleryItems(gallery);
    const products = await ProductService.getAllProducts();
    setProducts(products);
    const slides = await HeroService.getAllSlides();
    setHeroSlides(slides);
    const heroProds = await HeroService.getAllProducts();
    setHeroProducts(heroProds);
  };

  // --- Gallery Handlers ---
  const handleApprove = async (id: number) => {
    await GalleryService.approveItem(id);
    loadData();
  };

  const handleDeleteGalleryItem = async (id: number) => {
    await GalleryService.deleteItem(id);
    loadData();
  };

  const handleResetGallery = async () => {
    await GalleryService.reset();
    loadData();
  };

  // --- Product Handlers ---
  const handleDeleteProduct = async (id: number) => {
    await ProductService.deleteProduct(id);
    loadData();
  };

  const handleResetProducts = async () => {
    await ProductService.reset();
    loadData();
  };

  const openProductModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setProductForm(product);
    } else {
      setEditingProduct(null);
      setProductForm({
        title: '',
        subTitle: '',
        description: '',
        category: 'Lifting Platform',
        specs: [],
        features: [],
        images: [],
        badge: '',
        ctaText: 'Book Demo',
        image: '',
        youtubeId: ''
      });
    }
    setIsProductModalOpen(true);
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!productForm.title || !productForm.description || !productForm.category) {
      alert('Please fill in all required fields');
      return;
    }

    // Ensure image is present (use placeholder if empty for demo)
    const finalImage = productForm.image || 'https://picsum.photos/seed/machinery/800/600';
      
    const finalProduct = {
      ...productForm,
      image: finalImage,
      specs: productForm.specs || [],
      features: productForm.features || [],
      images: productForm.images || []
    } as Product;

    try {
      if (editingProduct) {
        await ProductService.updateProduct({ ...finalProduct, id: editingProduct.id });
      } else {
        await ProductService.addProduct(finalProduct);
      }
      setIsProductModalOpen(false);
      loadData();
    } catch (err: any) {
      console.error(err);
      alert(`Failed to save product. Error: ${err.message || 'Unknown error'}. If you are in the preview environment, this is expected because the database is not connected.`);
    }
  };

  // --- Hero Handlers ---
  const handleResetHero = async () => {
    await HeroService.reset();
    loadData();
  };

  const openHeroModal = (slide: HeroSlide) => {
    setEditingHero(slide);
    setHeroForm(slide);
    setIsHeroModalOpen(true);
  };

  const openHeroProductModal = (product: HeroProduct) => {
    setEditingHeroProduct(product);
    setHeroProductForm(product);
    setIsHeroProductModalOpen(true);
  };

  const handleHeroSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroForm.title || !heroForm.environment || !heroForm.subtitle) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      if (editingHero) {
        await HeroService.updateSlide({ ...heroForm, id: editingHero.id } as HeroSlide);
      }
      setIsHeroModalOpen(false);
      loadData();
    } catch (err) {
      console.error(err);
      alert('Failed to save slide. The image might be too large.');
    }
  };

  const handleHeroProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroProductForm.title || !heroProductForm.desc || !heroProductForm.link) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      if (editingHeroProduct) {
        await HeroService.updateProduct({ ...heroProductForm, id: editingHeroProduct.id } as HeroProduct);
      }
      setIsHeroProductModalOpen(false);
      loadData();
    } catch (err) {
      console.error(err);
      alert('Failed to save product. The image might be too large.');
    }
  };

  // --- Image Upload with Resize ---
  const resizeImage = (file: File, callback: (dataUrl: string) => void) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        callback(canvas.toDataURL('image/jpeg', 0.6));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      resizeImage(e.target.files[0], (newImage) => {
        setProductForm(prev => ({ ...prev, image: newImage }));
      });
    }
  };

  const handleAdditionalImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      resizeImage(e.target.files[0], (newImage) => {
        setProductForm(prev => ({ 
          ...prev, 
          images: [...(prev.images || []), newImage] 
        }));
      });
    }
  };

  const removeAdditionalImage = (index: number) => {
    setProductForm(prev => {
      const newImages = [...(prev.images || [])];
      newImages.splice(index, 1);
      return { ...prev, images: newImages };
    });
  };

  const handleHeroImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      resizeImage(e.target.files[0], (newImage) => {
        setHeroForm(prev => ({ ...prev, image: newImage }));
      });
    }
  };

  const handleHeroProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      resizeImage(e.target.files[0], (newImage) => {
        setHeroProductForm(prev => ({ ...prev, image: newImage }));
      });
    }
  };

  // Helper to manage specs array in form
  const addSpec = () => {
    setProductForm(prev => ({ ...prev, specs: [...(prev.specs || []), { label: '', value: '' }] }));
  };

  const updateSpec = (index: number, field: 'label' | 'value', value: string) => {
    setProductForm(prev => {
      const newSpecs = [...(prev.specs || [])];
      newSpecs[index] = { ...newSpecs[index], [field]: value };
      return { ...prev, specs: newSpecs };
    });
  };

  const removeSpec = (index: number) => {
    setProductForm(prev => {
      const newSpecs = [...(prev.specs || [])];
      newSpecs.splice(index, 1);
      return { ...prev, specs: newSpecs };
    });
  };

  // Helper to manage features array in form
  const addFeature = () => {
    setProductForm(prev => ({ ...prev, features: [...(prev.features || []), ''] }));
  };

  const updateFeature = (index: number, value: string) => {
    setProductForm(prev => {
      const newFeatures = [...(prev.features || [])];
      newFeatures[index] = value;
      return { ...prev, features: newFeatures };
    });
  };

  const removeFeature = (index: number) => {
    setProductForm(prev => {
      const newFeatures = [...(prev.features || [])];
      newFeatures.splice(index, 1);
      return { ...prev, features: newFeatures };
    });
  };

  // --- Data Export / Import ---
  const handleExportData = async () => {
    const data = {
      gallery: await GalleryService.getAllItems(),
      products: await ProductService.getAllProducts(),
      hero: await HeroService.getAllSlides(),
      heroProducts: await HeroService.getAllProducts()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `green-fleet-nz-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          if (data.gallery) {
            await GalleryService.reset(data.gallery);
          }
          if (data.products) {
            await ProductService.reset(data.products);
          }
          if (data.hero && data.heroProducts) {
            await HeroService.reset(data.hero, data.heroProducts);
          }
          loadData();
          alert('Data imported successfully!');
        } catch (err) {
          alert('Invalid backup file format or database error.');
        }
      };
      reader.readAsText(file);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-slate-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-mh-green/10 rounded-full flex items-center justify-center mx-auto mb-4 text-mh-green">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-mh-dark">Admin Access</h1>
            <p className="text-slate-500 mt-2">Please enter the password to access the dashboard.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-mh-dark mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-mh-green focus:ring-2 focus:ring-mh-green/20 outline-none transition-all"
                placeholder="Enter password"
                autoFocus
              />
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>
            
            <button
              type="submit"
              className="w-full bg-mh-dark text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              Login
            </button>
          </form>
          
          <p className="text-center text-xs text-slate-400 mt-6">
            Please enter your administrator password to continue.
          </p>
        </div>
      </div>
    );
  }

  const filteredGalleryItems = Array.isArray(galleryItems) ? galleryItems.filter(item => item.status === activeTab) : [];

  return (
    <div className="pt-24 pb-20 min-h-screen bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-mh-dark">Admin Dashboard</h1>
            <p className="text-slate-500">Manage your website content</p>
          </div>
          <div className="flex flex-wrap gap-2">
             <button 
               onClick={handleExportData}
               className="flex items-center gap-2 text-sm bg-white border border-slate-200 text-slate-600 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
             >
               Export Backup
             </button>
             <label className="flex items-center gap-2 text-sm bg-white border border-slate-200 text-slate-600 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors shadow-sm cursor-pointer">
               Import Backup
               <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
             </label>
             <button 
              onClick={activeSection === 'gallery' ? handleResetGallery : activeSection === 'products' ? handleResetProducts : handleResetHero}
              className="flex items-center gap-2 text-sm text-slate-500 hover:text-red-500 transition-colors px-3 py-2 rounded-lg hover:bg-red-50"
            >
              <RefreshCw className="w-4 h-4" />
              Reset {activeSection === 'gallery' ? 'Gallery' : activeSection === 'products' ? 'Products' : 'Hero Slides'}
            </button>
          </div>
        </div>

        {/* Main Section Tabs */}
        <div className="flex p-1 bg-slate-200 rounded-xl w-fit mb-8 overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveSection('gallery')}
            className={`px-6 py-2 rounded-lg font-bold text-sm transition-all whitespace-nowrap ${
              activeSection === 'gallery' ? 'bg-white text-mh-dark shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Gallery Management
          </button>
          <button
            onClick={() => setActiveSection('products')}
            className={`px-6 py-2 rounded-lg font-bold text-sm transition-all whitespace-nowrap ${
              activeSection === 'products' ? 'bg-white text-mh-dark shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Product Management
          </button>
          <button
            onClick={() => setActiveSection('hero')}
            className={`px-6 py-2 rounded-lg font-bold text-sm transition-all whitespace-nowrap ${
              activeSection === 'hero' ? 'bg-white text-mh-dark shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Hero Content
          </button>
          <button
            onClick={() => setActiveSection('settings')}
            className={`px-6 py-2 rounded-lg font-bold text-sm transition-all whitespace-nowrap ${
              activeSection === 'settings' ? 'bg-white text-mh-dark shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Site Settings
          </button>
        </div>

        {/* --- SETTINGS SECTION --- */}
        {activeSection === 'settings' && (
          <>
            <div className="flex justify-between items-center mb-6">
               <h2 className="text-xl font-bold text-mh-dark">Site Settings</h2>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm max-w-2xl">
              <h3 className="font-bold text-lg text-mh-dark mb-4">Website Logo</h3>
              <p className="text-slate-500 text-sm mb-6">
                Upload a custom logo to replace the default one. This will update the logo in the navigation bar and footer.
              </p>
              
              <div className="flex items-center gap-6">
                <div className="w-48 h-24 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center p-4 relative group">
                  {customLogo || IMAGES.logo ? (
                    <img 
                      src={customLogo || IMAGES.logo} 
                      alt="Current Logo" 
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <Logo dark={true} />
                  )}
                  
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                    <button 
                      onClick={() => logoInputRef.current?.click()}
                      className="bg-white text-mh-dark p-2 rounded-full hover:bg-mh-green transition-colors"
                      title="Upload new logo"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                    {customLogo && (
                      <button 
                        onClick={() => updateLogo(null)}
                        className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                        title="Remove custom logo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="flex-1">
                  <button 
                    onClick={() => logoInputRef.current?.click()}
                    className="bg-mh-dark text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-slate-800 transition-colors flex items-center gap-2 mb-2"
                  >
                    <Upload className="w-4 h-4" /> Upload Logo
                  </button>
                  <p className="text-xs text-slate-400">
                    Recommended format: PNG with transparent background. Max height: 64px.
                  </p>
                  <input 
                    type="file" 
                    ref={logoInputRef} 
                    onChange={handleLogoUpload} 
                    accept="image/*" 
                    className="hidden" 
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {/* --- HERO SECTION --- */}
        {activeSection === 'hero' && (
          <>
            <div className="flex justify-between items-center mb-6">
               <h2 className="text-xl font-bold text-mh-dark">Homepage Hero Slides</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {Array.isArray(heroSlides) && heroSlides.map((slide) => (
                <div key={slide.id} className="bg-white rounded-xl overflow-hidden border border-slate-100 shadow-sm flex flex-col">
                   <div className="relative h-48 bg-slate-100">
                      <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                   </div>
                   <div className="p-4 flex-1">
                      <div className="flex items-center gap-2 mb-2">
                         <span className="text-xs font-bold uppercase bg-slate-100 text-slate-500 px-2 py-0.5 rounded">Slide {slide.id}</span>
                         <span className="text-xs font-bold uppercase bg-mh-green/20 text-mh-dark px-2 py-0.5 rounded">{slide.environment}</span>
                      </div>
                      <h3 className="font-bold text-lg text-mh-dark">{slide.title}</h3>
                      <p className="text-sm text-slate-500">{slide.subtitle}</p>
                   </div>
                   <div className="p-4 border-t border-slate-100 bg-slate-50">
                      <button 
                        onClick={() => openHeroModal(slide)}
                        className="w-full bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                      >
                        <Edit2 className="w-4 h-4" /> Edit Slide
                      </button>
                   </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mb-6">
               <h2 className="text-xl font-bold text-mh-dark">Homepage Hero Products</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.isArray(heroProducts) && heroProducts.map((product) => {
                if (!product) return null;
                return (
                  <div key={product.id} className="bg-white rounded-xl overflow-hidden border border-slate-100 shadow-sm flex flex-col">
                     <div className="relative h-40 bg-slate-100">
                        <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                     </div>
                     <div className="p-4 flex-1">
                        <div className="flex items-center gap-2 mb-2">
                           <span className="text-xs font-bold uppercase bg-slate-100 text-slate-500 px-2 py-0.5 rounded">Product {product.id}</span>
                           <span className="text-xs font-bold uppercase bg-mh-green/20 text-mh-dark px-2 py-0.5 rounded">{product.iconName}</span>
                        </div>
                        <h3 className="font-bold text-lg text-mh-dark">{product.title}</h3>
                        <p className="text-sm text-slate-500">{product.desc}</p>
                        <p className="text-xs text-mh-green mt-2 truncate">{product.link}</p>
                     </div>
                     <div className="p-4 border-t border-slate-100 bg-slate-50">
                        <button 
                          onClick={() => openHeroProductModal(product)}
                          className="w-full bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                        >
                          <Edit2 className="w-4 h-4" /> Edit Product
                        </button>
                     </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* --- GALLERY SECTION --- */}
        {activeSection === 'gallery' && (
          <>
            {/* Gallery Status Tabs */}
            <div className="flex gap-4 mb-8 border-b border-slate-200">
              <button
                onClick={() => setActiveTab('pending')}
                className={`pb-4 px-4 font-bold text-lg transition-colors relative ${
                  activeTab === 'pending' ? 'text-mh-green' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Pending Review
                {galleryItems.filter(i => i.status === 'pending').length > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full align-middle">
                    {galleryItems.filter(i => i.status === 'pending').length}
                  </span>
                )}
                {activeTab === 'pending' && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-mh-green rounded-t-full" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('approved')}
                className={`pb-4 px-4 font-bold text-lg transition-colors relative ${
                  activeTab === 'approved' ? 'text-mh-green' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Published Gallery
                {activeTab === 'approved' && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-mh-green rounded-t-full" />
                )}
              </button>
            </div>

            {/* Gallery Content */}
            {filteredGalleryItems.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-100">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-700 mb-2">No items found</h3>
                <p className="text-slate-500">
                  {activeTab === 'pending' 
                    ? "There are no pending submissions to review." 
                    : "The gallery is currently empty."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.isArray(filteredGalleryItems) && filteredGalleryItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 flex flex-col">
                    <div className="relative h-48 bg-slate-100">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                        {item.date}
                      </div>
                    </div>
                    
                    <div className="p-4 flex-1">
                      <h3 className="font-bold text-mh-dark mb-1">{item.title}</h3>
                      <p className="text-xs text-slate-500 mb-2">by {item.author} • {item.location}</p>
                      <p className="text-sm text-slate-600 line-clamp-2 mb-3">{item.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {item.tags?.map((tag, idx) => (
                          <span key={idx} className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-2 justify-end">
                      {activeTab === 'pending' && (
                        <button
                          onClick={() => handleApprove(item.id)}
                          className="flex-1 bg-mh-green text-mh-dark py-2 rounded-lg font-bold text-sm hover:bg-mh-accent transition-colors flex items-center justify-center gap-1"
                        >
                          <Check className="w-4 h-4" /> Approve
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteGalleryItem(item.id)}
                        className={`bg-white border border-slate-200 text-slate-500 py-2 rounded-lg font-bold text-sm hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors flex items-center justify-center gap-1 ${activeTab === 'pending' ? 'px-3' : 'flex-1'}`}
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" /> {activeTab === 'approved' && 'Delete'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* --- PRODUCTS SECTION --- */}
        {activeSection === 'products' && (
          <>
            <div className="flex justify-between items-center mb-6">
               <h2 className="text-xl font-bold text-mh-dark">All Products</h2>
               <button 
                 onClick={() => openProductModal()}
                 className="bg-mh-green text-mh-dark px-4 py-2 rounded-lg font-bold text-sm hover:bg-mh-accent transition-colors flex items-center gap-2"
               >
                 <Plus className="w-4 h-4" /> Add Product
               </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {Array.isArray(products) && products.map((product) => (
                <div key={product.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                   <div className="w-full md:w-32 h-24 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                      <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                   </div>
                   <div className="flex-1 text-center md:text-left">
                      <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                         <span className="text-xs font-bold uppercase bg-slate-100 text-slate-500 px-2 py-0.5 rounded">{product.category}</span>
                         {product.badge && <span className="text-xs font-bold uppercase bg-mh-green/20 text-mh-dark px-2 py-0.5 rounded">{product.badge}</span>}
                      </div>
                      <h3 className="font-bold text-lg text-mh-dark">{product.title}</h3>
                      <p className="text-sm text-slate-500">{product.subTitle}</p>
                   </div>
                   <div className="flex gap-2 w-full md:w-auto">
                      <button 
                        onClick={() => openProductModal(product)}
                        className="flex-1 md:flex-none bg-slate-100 text-slate-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                      >
                        <Edit2 className="w-4 h-4" /> Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(product.id)}
                        className="flex-1 md:flex-none bg-white border border-slate-200 text-red-500 px-4 py-2 rounded-lg font-bold text-sm hover:bg-red-50 hover:border-red-200 transition-colors flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                   </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* --- HERO MODAL --- */}
      {isHeroModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-bold text-mh-dark">Edit Hero Slide</h2>
              <button 
                onClick={() => setIsHeroModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>
            
            <form onSubmit={handleHeroSubmit} className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-mh-dark">Background Image</label>
                <div className="flex items-center gap-4">
                   {heroForm.image && (
                     <img src={heroForm.image} alt="Preview" className="w-32 h-20 object-cover rounded-lg border border-slate-200" />
                   )}
                   <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-lg font-bold text-sm transition-colors flex items-center gap-2">
                     <Upload className="w-4 h-4" /> Upload Image
                     <input type="file" accept="image/*" onChange={handleHeroImageUpload} className="hidden" />
                   </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="block text-sm font-bold text-mh-dark">Title</label>
                    <input 
                      type="text" 
                      value={heroForm.title || ''}
                      onChange={(e) => setHeroForm({...heroForm, title: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-mh-green outline-none"
                      required
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="block text-sm font-bold text-mh-dark">Environment (e.g., Orchard)</label>
                    <input 
                      type="text" 
                      value={heroForm.environment || ''}
                      onChange={(e) => setHeroForm({...heroForm, environment: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-mh-green outline-none"
                      required
                    />
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="block text-sm font-bold text-mh-dark">Subtitle</label>
                 <textarea 
                   value={heroForm.subtitle || ''}
                   onChange={(e) => setHeroForm({...heroForm, subtitle: e.target.value})}
                   rows={2}
                   className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-mh-green outline-none resize-none"
                   required
                 />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                 <button 
                   type="button"
                   onClick={() => setIsHeroModalOpen(false)}
                   className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors"
                 >
                   Cancel
                 </button>
                 <button 
                   type="submit"
                   className="px-6 py-3 rounded-xl font-bold bg-mh-green text-mh-dark hover:bg-mh-accent transition-colors shadow-lg"
                 >
                   Save Changes
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- HERO PRODUCT MODAL --- */}
      {isHeroProductModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-bold text-mh-dark">Edit Hero Product</h2>
              <button 
                onClick={() => setIsHeroProductModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>
            
            <form onSubmit={handleHeroProductSubmit} className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-mh-dark">Background Image</label>
                <div className="flex items-center gap-4">
                   {heroProductForm.image && (
                     <img src={heroProductForm.image} alt="Preview" className="w-32 h-20 object-cover rounded-lg border border-slate-200" />
                   )}
                   <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-lg font-bold text-sm transition-colors flex items-center gap-2">
                     <Upload className="w-4 h-4" /> Upload Image
                     <input type="file" accept="image/*" onChange={handleHeroProductImageUpload} className="hidden" />
                   </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="block text-sm font-bold text-mh-dark">Title</label>
                    <input 
                      type="text" 
                      value={heroProductForm.title || ''}
                      onChange={(e) => setHeroProductForm({...heroProductForm, title: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-mh-green outline-none"
                      required
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="block text-sm font-bold text-mh-dark">Icon Name</label>
                    <select 
                      value={heroProductForm.iconName || 'Zap'}
                      onChange={(e) => setHeroProductForm({...heroProductForm, iconName: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-mh-green outline-none"
                    >
                      <option value="Zap">Zap (Lightning)</option>
                      <option value="Battery">Battery</option>
                      <option value="Sun">Sun</option>
                      <option value="Wind">Wind</option>
                      <option value="Leaf">Leaf</option>
                      <option value="Clock">Clock</option>
                      <option value="CheckCircle2">Check Circle</option>
                    </select>
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="block text-sm font-bold text-mh-dark">Description</label>
                 <textarea 
                   value={heroProductForm.desc || ''}
                   onChange={(e) => setHeroProductForm({...heroProductForm, desc: e.target.value})}
                   rows={2}
                   className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-mh-green outline-none resize-none"
                   required
                 />
              </div>

              <div className="space-y-2">
                 <label className="block text-sm font-bold text-mh-dark">Link URL</label>
                 <input 
                   type="text" 
                   value={heroProductForm.link || ''}
                   onChange={(e) => setHeroProductForm({...heroProductForm, link: e.target.value})}
                   className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-mh-green outline-none"
                   placeholder="/machinery"
                   required
                 />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                 <button 
                   type="button"
                   onClick={() => setIsHeroProductModalOpen(false)}
                   className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors"
                 >
                   Cancel
                 </button>
                 <button 
                   type="submit"
                   className="px-6 py-3 rounded-xl font-bold bg-mh-green text-mh-dark hover:bg-mh-accent transition-colors shadow-lg"
                 >
                   Save Changes
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- PRODUCT MODAL --- */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-bold text-mh-dark">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button 
                onClick={() => setIsProductModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>
            
            <form onSubmit={handleProductSubmit} className="p-6 space-y-6">
              
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="block text-sm font-bold text-mh-dark">Category</label>
                    <select 
                      value={productForm.category}
                      onChange={(e) => setProductForm({...productForm, category: e.target.value as any})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-mh-green outline-none"
                    >
                      <option value="Lifting Platform">Lifting Platform</option>
                      <option value="Transport Vehicle">Transport Vehicle</option>
                      <option value="Autonomous Sprayer">Autonomous Sprayer</option>
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="block text-sm font-bold text-mh-dark">Badge (Optional)</label>
                    <input 
                      type="text" 
                      value={productForm.badge || ''}
                      onChange={(e) => setProductForm({...productForm, badge: e.target.value})}
                      placeholder="e.g., Best Seller"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-mh-green outline-none"
                    />
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="block text-sm font-bold text-mh-dark">Title</label>
                    <input 
                      type="text" 
                      value={productForm.title || ''}
                      onChange={(e) => setProductForm({...productForm, title: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-mh-green outline-none"
                      required
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="block text-sm font-bold text-mh-dark">Subtitle</label>
                    <input 
                      type="text" 
                      value={productForm.subTitle || ''}
                      onChange={(e) => setProductForm({...productForm, subTitle: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-mh-green outline-none"
                    />
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="block text-sm font-bold text-mh-dark">Description</label>
                 <textarea 
                   value={productForm.description || ''}
                   onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                   rows={3}
                   className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-mh-green outline-none resize-none"
                   required
                 />
              </div>

              {/* Image Upload */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-mh-dark">Main Product Image</label>
                  <div className="flex items-center gap-4">
                     {productForm.image && (
                       <img src={productForm.image} alt="Preview" className="w-32 h-20 object-cover rounded-lg border border-slate-200" />
                     )}
                     <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-lg font-bold text-sm transition-colors flex items-center gap-2">
                       <Upload className="w-4 h-4" /> Upload Main Image
                       <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                     </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-mh-dark">Additional Images (Gallery)</label>
                  <div className="flex flex-wrap items-center gap-4">
                     {productForm.images?.map((img, idx) => (
                       <div key={idx} className="relative group">
                         <img src={img} alt={`Preview ${idx}`} className="w-24 h-24 object-cover rounded-lg border border-slate-200" />
                         <button 
                           type="button" 
                           onClick={() => removeAdditionalImage(idx)}
                           className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                         >
                           <X className="w-3 h-3" />
                         </button>
                       </div>
                     ))}
                     <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-600 w-24 h-24 rounded-lg flex flex-col items-center justify-center gap-1 transition-colors border border-dashed border-slate-300">
                       <Upload className="w-5 h-5" />
                       <span className="text-xs font-bold">Add Image</span>
                       <input type="file" accept="image/*" onChange={handleAdditionalImageUpload} className="hidden" />
                     </label>
                  </div>
                  <p className="text-xs text-slate-400">Images are automatically resized to prevent storage issues.</p>
                </div>
              </div>

              {/* Specs */}
              <div className="space-y-2">
                 <div className="flex justify-between items-center">
                    <label className="block text-sm font-bold text-mh-dark">Specifications</label>
                    <button type="button" onClick={addSpec} className="text-xs text-mh-green font-bold hover:underline">+ Add Spec</button>
                 </div>
                 <div className="space-y-2">
                    {productForm.specs?.map((spec, idx) => (
                      <div key={idx} className="flex gap-2">
                         <input 
                           placeholder="Label (e.g., Max Load)"
                           value={spec.label}
                           onChange={(e) => updateSpec(idx, 'label', e.target.value)}
                           className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-mh-green"
                         />
                         <input 
                           placeholder="Value (e.g., 800kg)"
                           value={spec.value}
                           onChange={(e) => updateSpec(idx, 'value', e.target.value)}
                           className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-mh-green"
                         />
                         <button type="button" onClick={() => removeSpec(idx)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg">
                           <X className="w-4 h-4" />
                         </button>
                      </div>
                    ))}
                 </div>
              </div>

              {/* Features */}
              <div className="space-y-2">
                 <div className="flex justify-between items-center">
                    <label className="block text-sm font-bold text-mh-dark">Key Features</label>
                    <button type="button" onClick={addFeature} className="text-xs text-mh-green font-bold hover:underline">+ Add Feature</button>
                 </div>
                 <div className="space-y-2">
                    {productForm.features?.map((feature, idx) => (
                      <div key={idx} className="flex gap-2">
                         <input 
                           placeholder="Feature description"
                           value={feature}
                           onChange={(e) => updateFeature(idx, e.target.value)}
                           className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-mh-green"
                         />
                         <button type="button" onClick={() => removeFeature(idx)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg">
                           <X className="w-4 h-4" />
                         </button>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                 <button 
                   type="button"
                   onClick={() => setIsProductModalOpen(false)}
                   className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors"
                 >
                   Cancel
                 </button>
                 <button 
                   type="submit"
                   className="px-6 py-3 rounded-xl font-bold bg-mh-green text-mh-dark hover:bg-mh-accent transition-colors shadow-lg"
                 >
                   {editingProduct ? 'Save Changes' : 'Create Product'}
                 </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
