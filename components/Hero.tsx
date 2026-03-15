import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle2, Leaf, Clock, Zap, Sun, Wind, Battery } from 'lucide-react';
import { Link } from 'react-router-dom';
import { IMAGES } from '../images';
import { HeroService, HeroSlide, HeroProduct } from '../services/heroService';

const iconMap: Record<string, React.ElementType> = {
  Zap, Battery, Sun, Wind, Leaf, Clock, CheckCircle2
};

const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [products, setProducts] = useState<HeroProduct[]>([]);

  useEffect(() => {
    const loadHeroData = async () => {
      const loadedSlides = await HeroService.getAllSlides();
      setSlides(loadedSlides);
      const loadedProducts = await HeroService.getAllProducts();
      setProducts(loadedProducts);
    };
    loadHeroData();
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setIsAnimating(false);
      }, 500); // Wait for fade out
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (!Array.isArray(slides) || slides.length === 0) return null;

  const currentSlideData = slides[currentSlide] || slides[0];

  return (
    <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden bg-mh-dark">
      {/* Background Slider */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-40' : 'opacity-0'
          }`}
        >
          <img 
            src={slide.image} 
            alt={slide.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-mh-dark via-mh-dark/60 to-transparent" />
        </div>
      ))}

      <div className="container mx-auto px-6 relative z-10 pt-24 pb-12">
        <div className="max-w-4xl mx-auto text-center">
            
          {/* Animated Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-8 border border-white/20 transition-all duration-300 hover:bg-white/20">
            {React.createElement(iconMap[currentSlideData?.iconName] || Zap, { className: "w-4 h-4 text-mh-green animate-pulse" })}
            <span className="text-white text-sm font-semibold tracking-wide uppercase">
              {currentSlideData?.title}
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white leading-tight mb-8 tracking-tight">
            The Smart Fit <br />
            {/* Stable Grid Container for Title */}
            <span className="grid place-items-center">
              {/* Invisible Spacer - Uses longest possible text to set height */}
              <span className="col-start-1 row-start-1 opacity-0 invisible pointer-events-none" aria-hidden="true">
                For Any Construction Site.
              </span>
              
              {/* Animated Text */}
              <span 
                className={`col-start-1 row-start-1 block text-transparent bg-clip-text bg-gradient-to-r from-mh-green to-mh-accent transition-all duration-500 transform ${
                  isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
                }`}
              >
                For Any {currentSlideData?.environment}.
              </span>
            </span>
          </h1>

          {/* Stable Grid Container for Subtitles */}
          <div className="grid place-items-center mb-10">
            {/* Spacers - Render all subtitles invisibly to reserve space for the largest one */}
            {slides.map(s => (
               <p key={`spacer-${s.id}`} className="col-start-1 row-start-1 opacity-0 invisible pointer-events-none text-xl md:text-2xl font-medium max-w-2xl mx-auto leading-relaxed">
                 {s.subtitle}
               </p>
            ))}

            {/* Active Subtitle */}
            {slides.map((slide, index) => (
              <p 
                key={slide.id}
                className={`col-start-1 row-start-1 text-xl md:text-2xl text-slate-200 font-medium max-w-2xl mx-auto leading-relaxed transition-all duration-700 transform ${
                  index === currentSlide 
                    ? 'opacity-100 translate-y-0 scale-100 blur-none' 
                    : 'opacity-0 translate-y-4 scale-95 blur-sm pointer-events-none'
                }`}
              >
                {slide.subtitle}
              </p>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              to="/book-demo"
              className="w-full sm:w-auto px-8 py-4 bg-mh-green text-mh-dark rounded-full font-bold text-lg hover:bg-mh-accent transition-all transform hover:scale-105 flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(132,204,22,0.3)]"
            >
              Book a Free Demo
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Slide Indicators */}
          <div className="flex justify-center gap-3 mb-16">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'w-8 bg-mh-green' : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Key Products - Visual Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {Array.isArray(products) && products.map((product, index) => {
              if (!product) return null;
              return (
                <Link to={product.link || '#'} key={index} className="group relative overflow-hidden rounded-3xl h-48 border border-white/10 hover:border-mh-green/50 transition-all duration-300 block">
                  {/* Background Image */}
                  <img 
                    src={product.image} 
                    alt={product.title} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-mh-dark via-mh-dark/80 to-transparent opacity-90 group-hover:opacity-80 transition-opacity" />
                  
                  {/* Content */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end z-10">
                     <div className="mb-auto">
                        <div className="w-10 h-10 bg-mh-green/20 rounded-xl flex items-center justify-center text-mh-green backdrop-blur-sm">
                          {React.createElement(iconMap[product.iconName] || Zap, { className: "w-5 h-5" })}
                        </div>
                     </div>
                     <div>
                        <h3 className="text-white font-bold text-lg mb-1 group-hover:text-mh-green transition-colors">{product.title}</h3>
                        <p className="text-slate-300 text-sm font-medium leading-snug">{product.desc}</p>
                     </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;