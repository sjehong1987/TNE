import React, { useState, useEffect } from 'react';
import { ArrowUp, Truck, Scan, Check, MousePointerClick, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MachineItem } from '../types';
import { ProductService, Product } from '../services/productService';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

// --- Product Card Component ---
const ProductCard = ({ product, onClick, icon: Icon }: { key?: React.Key, product: Product, onClick: (p: Product) => void, icon: React.ElementType }) => {
  return (
    <div 
      onClick={() => onClick(product)}
      className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 cursor-pointer overflow-hidden flex flex-col group h-full"
    >
      <div className="relative h-48 sm:h-64 bg-slate-50 p-4 sm:p-8 flex items-center justify-center border-b border-slate-100">
        <img 
          src={product.image} 
          alt={product.title} 
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
        />
        {product.badge && (
          <div className="absolute top-4 right-4 z-10">
            <span className="bg-mh-green text-mh-dark px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wide shadow-sm">
              {product.badge}
            </span>
          </div>
        )}
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
            <Icon className="w-4 h-4" />
          </div>
          <span className="text-slate-500 font-bold uppercase tracking-wider text-xs">{product.subTitle}</span>
        </div>
        <h3 className="text-xl font-extrabold text-mh-dark mb-2">{product.title}</h3>
        <p className="text-slate-600 text-sm line-clamp-2 mb-6 flex-1">{product.description}</p>
        <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
          <span className="text-mh-green font-bold text-sm">View Details</span>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-mh-green transition-colors" />
        </div>
      </div>
    </div>
  );
};

// --- Product Modal Component ---
const ProductModal = ({ product, isOpen, onClose, icon: Icon }: { product: Product | null, isOpen: boolean, onClose: () => void, icon: React.ElementType }) => {
  const [imgIndex, setImgIndex] = useState(0);

  // Reset image index when modal opens with a new product
  useEffect(() => {
    if (isOpen) {
      setImgIndex(0);
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const allImages = [product.image, ...(product.images || [])];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-mh-dark/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-y-auto flex flex-col lg:flex-row animate-in fade-in zoom-in-95 duration-200">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-mh-dark hover:bg-slate-100 transition-colors shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image Gallery Side */}
        <div className="lg:w-1/2 bg-slate-50 relative h-[55vh] lg:h-auto lg:min-h-[500px] flex flex-col items-center justify-center p-4 sm:p-8 border-b lg:border-b-0 lg:border-r border-slate-100 shrink-0">
          {product.youtubeId && imgIndex === 0 ? (
            <div className="w-full h-full relative flex-1">
              <iframe 
                key={product.youtubeId}
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${product.youtubeId}?rel=0&modestbranding=1&playsinline=1&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`}
                title={`${product.title} Video`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                style={{ border: 0 }}
              ></iframe>
            </div>
          ) : (
            <div className="w-full relative flex-1 min-h-0 flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing">
              <TransformWrapper
                key={imgIndex}
                initialScale={1}
                minScale={1}
                maxScale={5}
                centerOnInit={true}
                wheel={{ step: 0.1 }}
              >
                <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }} contentStyle={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <img 
                    src={allImages[imgIndex]} 
                    alt={`${product.title} - Image ${imgIndex + 1}`} 
                    className="w-full h-full object-contain"
                  />
                </TransformComponent>
              </TransformWrapper>
            </div>
          )}
          
          {product.badge && (
            <div className="absolute top-6 left-6 z-20">
              <span className="bg-mh-green text-mh-dark px-4 py-2 rounded-full font-bold text-sm uppercase tracking-wide shadow-md">
                {product.badge}
              </span>
            </div>
          )}

          {/* Thumbnail Navigation */}
          {allImages.length > 1 && (
            <div className="flex gap-2 mt-4 sm:mt-6 overflow-x-auto pb-2 w-full justify-start md:justify-center px-1 snap-x shrink-0">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setImgIndex(idx)}
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all bg-white snap-center ${
                    imgIndex === idx ? 'border-mh-green' : 'border-transparent hover:border-slate-300'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-contain p-1" />
                  {idx === 0 && product.youtubeId && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white">
                        <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[6px] border-l-white border-b-[4px] border-b-transparent ml-0.5"></div>
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content Side */}
        <div className="lg:w-1/2 p-6 sm:p-8 lg:p-12 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
              <Icon className="w-5 h-5" />
            </div>
            <span className="font-bold uppercase tracking-wider text-sm text-slate-500">{product.subTitle}</span>
          </div>
          
          <h3 className="text-3xl font-extrabold text-mh-dark mb-4">{product.title}</h3>
          <p className="text-lg text-slate-600 mb-8 leading-relaxed">{product.description}</p>
          
          {product.specs && product.specs.length > 0 && (
            <div className="grid grid-cols-2 gap-4 mb-8">
              {product.specs.map((spec, idx) => (
                <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-xs font-bold uppercase text-slate-500 mb-1">{spec.label}</p>
                  <p className="font-extrabold text-lg text-mh-dark">{spec.value}</p>
                </div>
              ))}
            </div>
          )}

          {product.features && product.features.length > 0 && (
            <ul className="space-y-3 mb-10">
              {product.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3 font-medium text-slate-700">
                  <Check className="w-5 h-5 shrink-0 text-mh-green mt-0.5" /> 
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-auto pt-6">
            <Link 
              to="/book-demo" 
              onClick={onClose}
              className="w-full flex justify-center items-center px-8 py-4 bg-mh-dark text-white rounded-xl font-bold hover:bg-mh-green hover:text-mh-dark transition-colors"
            >
              {product.ctaText || "Book Demo"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---
const Machinery: React.FC = () => {
  const [liftingPlatforms, setLiftingPlatforms] = useState<Product[]>([]);
  const [transportVehicles, setTransportVehicles] = useState<Product[]>([]);
  const [sprayer, setSprayer] = useState<Product | null>(null);
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalIcon, setModalIcon] = useState<React.ElementType>(ArrowUp);

  useEffect(() => {
    const loadProducts = async () => {
      // Initialize data from service
      await ProductService.getAllProducts();
      
      const platforms = await ProductService.getProductsByCategory('Lifting Platform');
      setLiftingPlatforms(platforms);
      
      const vehicles = await ProductService.getProductsByCategory('Transport Vehicle');
      setTransportVehicles(vehicles);
      
      const sprayers = await ProductService.getProductsByCategory('Autonomous Sprayer');
      if (sprayers.length > 0) setSprayer(sprayers[0]);
    };
    loadProducts();
  }, []);

  const handleOpenModal = (product: Product, icon: React.ElementType) => {
    setSelectedProduct(product);
    setModalIcon(() => icon);
    setIsModalOpen(true);
  };

  return (
    <section className="py-24 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-6">
        
        {/* Main Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h4 className="text-mh-green font-bold tracking-wider uppercase mb-4">Our Fleet</h4>
          <h2 className="text-4xl md:text-5xl font-extrabold text-mh-dark mb-6">
             Machinery Built for Agility.
          </h2>
          <p className="text-lg text-slate-600">
            Customized by a leading Korean manufacturer specifically for NZ terrain. 
            Discover our specialized electric solutions designed to transform your harvest.
          </p>
        </div>

        {/* 1. Electric Lifting Platforms */}
        {liftingPlatforms.length > 0 && (
          <div className="mb-24 scroll-mt-28" id="lifting-platforms">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-mh-green/20 rounded-xl flex items-center justify-center text-mh-green">
                <ArrowUp className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-mh-dark">Electric Lifting Platforms</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {liftingPlatforms.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onClick={(p) => handleOpenModal(p, ArrowUp)} 
                  icon={ArrowUp} 
                />
              ))}
            </div>
          </div>
        )}

        {/* 2. Electric Transport Vehicles */}
        {transportVehicles.length > 0 && (
          <div className="mb-24 scroll-mt-28" id="transport-vehicles">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-mh-blue">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-mh-dark">Electric Transport Vehicles</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {transportVehicles.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onClick={(p) => handleOpenModal(p, Truck)} 
                  icon={Truck} 
                />
              ))}
            </div>
          </div>
        )}

        {/* 3. Autonomous Driving Sprayer */}
        {sprayer && (
          <div className="mb-24 scroll-mt-28" id="autonomous-sprayers">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-mh-blue/10 rounded-xl flex items-center justify-center text-mh-blue">
                <Scan className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-mh-dark">Autonomous Solutions</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <ProductCard 
                product={sprayer} 
                onClick={(p) => handleOpenModal(p, Scan)} 
                icon={Scan} 
              />
            </div>
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      <ProductModal 
        product={selectedProduct} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        icon={modalIcon}
      />
    </section>
  );
};

export default Machinery;
