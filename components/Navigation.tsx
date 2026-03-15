import React, { useState } from 'react';
import { Menu, X, Zap, ChevronDown, Leaf } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { IMAGES } from '../images';
import Logo from './Logo';

interface NavigationProps {
  scrolled: boolean;
}

const navItems = [
  { label: 'Why TNE?', href: '/our-story' },
  { 
    label: 'Machinery', 
    href: '/machinery',
    subItems: [
      { label: 'Electric Lifting Platform', href: '/machinery#lifting-platforms' },
      { label: 'Electric Transport Vehicles', href: '/machinery#transport-vehicles' },
      { label: 'Autonomous Driving Sprayer', href: '/machinery#autonomous-sprayers' },
    ]
  },
  { 
    label: 'Battery Tech', 
    href: '/battery-tech',
    subItems: [
      { label: 'Golf Cart LFP Battery', href: '/battery-tech#golf-cart-battery' },
      { label: 'Forklift LFP Battery', href: '/battery-tech#forklift-battery' },
      { label: 'Solar Panel', href: '/battery-tech#solar-panel' },
      { label: 'Wind Turbine', href: '/battery-tech#wind-turbine' },
      { label: 'Battery Package', href: '/battery-tech#battery-package' },
      { label: 'Customized LFP Battery', href: '/battery-tech#customized-battery' },
    ]
  },
  { label: 'Service', href: '/service' },
  { label: 'Gallery', href: '/gallery' },
];

const Navigation: React.FC<NavigationProps> = ({ scrolled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || isOpen ? 'bg-mh-dark/95 backdrop-blur-md py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 flex flex-nowrap justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          {IMAGES.logo ? (
            <img 
              src={IMAGES.logo} 
              alt="TNE (Terra Nova Electromotive)" 
              className="h-10 w-auto object-contain max-w-[150px]"
            />
          ) : (
            <Logo dark={false} />
          )}
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-3 lg:gap-8 shrink-0">
          {navItems.map((item) => (
            <div key={item.label} className="relative group">
              <Link
                to={item.href}
                className={`text-xs lg:text-sm font-semibold transition-colors uppercase tracking-wide flex items-center gap-1 py-2 whitespace-nowrap ${
                  isActive(item.href) ? 'text-mh-green' : 'text-slate-300 hover:text-mh-green'
                }`}
              >
                {item.label}
                {item.subItems && <ChevronDown className="w-3 h-3 lg:w-4 lg:h-4" />}
              </Link>
              
              {/* Dropdown Menu */}
              {item.subItems && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <div className="bg-mh-dark border border-slate-700 rounded-xl shadow-2xl overflow-hidden min-w-[200px] lg:min-w-[260px] p-2">
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.label}
                        to={subItem.href}
                        className="block px-4 py-2 lg:py-3 text-xs lg:text-sm font-medium text-slate-300 hover:text-mh-dark hover:bg-mh-green rounded-lg transition-colors whitespace-nowrap"
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          <Link
            to="/book-demo"
            className="bg-mh-green text-mh-dark px-4 py-2 lg:px-6 lg:py-2.5 rounded-full font-bold hover:bg-mh-accent transition-all transform hover:scale-105 flex items-center gap-2 text-xs lg:text-sm whitespace-nowrap"
          >
            Book Demo
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-mh-dark border-t border-slate-800 p-6 flex flex-col gap-4 shadow-2xl h-screen overflow-y-auto">
          {navItems.map((item) => (
            <div key={item.label} className="flex flex-col">
              <Link
                to={item.href}
                className={`text-xl font-medium py-2 ${
                  isActive(item.href) ? 'text-mh-green' : 'text-white hover:text-mh-green'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
              {/* Mobile Sub-items */}
              {item.subItems && (
                <div className="pl-4 flex flex-col gap-3 mt-2 border-l-2 border-slate-700 ml-1">
                  {item.subItems.map((subItem) => (
                     <Link
                      key={subItem.label}
                      to={subItem.href}
                      className="text-slate-400 hover:text-mh-green text-lg"
                      onClick={() => setIsOpen(false)}
                     >
                       {subItem.label}
                     </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="pt-4 pb-20">
             <Link
               to="/book-demo"
               className="block bg-mh-green text-mh-dark text-center py-4 rounded-xl font-bold text-lg"
               onClick={() => setIsOpen(false)}
             >
               Book a Free Demo
             </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
