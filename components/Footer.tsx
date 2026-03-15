import React from 'react';
import { Leaf, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { IMAGES } from '../images';
import Logo from './Logo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-mh-dark text-white pt-20 pb-10 border-t border-slate-800">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6">
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
            <p className="text-slate-400 max-w-sm mb-6">
              The smart fit for any orchard environment. Bringing agility, sustainability, and reliability to New Zealand horticulture.
            </p>
            <div className="flex gap-4">
               <a href="https://www.facebook.com/greendrivenz" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-mh-green hover:text-mh-dark transition-all"><Facebook className="w-5 h-5" /></a>
               <a href="https://www.instagram.com/greendrivenz" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-mh-green hover:text-mh-dark transition-all"><Instagram className="w-5 h-5" /></a>
               <a href="https://www.linkedin.com/company/greendrivenz" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-mh-green hover:text-mh-dark transition-all"><Linkedin className="w-5 h-5" /></a>
               <a href="https://twitter.com/greendrivenz" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-mh-green hover:text-mh-dark transition-all"><Twitter className="w-5 h-5" /></a>
            </div>
          </div>

          <div>
             <h5 className="font-bold text-lg mb-6 text-white">Quick Links</h5>
             <ul className="space-y-4 text-slate-400">
                <li><Link to="/our-story" className="hover:text-mh-green transition-colors">Our Story</Link></li>
                <li><Link to="/machinery" className="hover:text-mh-green transition-colors">Machinery</Link></li>
                <li><Link to="/battery-tech" className="hover:text-mh-green transition-colors">Battery Tech</Link></li>
                <li><Link to="/gallery" className="hover:text-mh-green transition-colors">Gallery</Link></li>
                <li><Link to="/admin" className="hover:text-mh-green transition-colors">Admin Dashboard</Link></li>
                <li><Link to="/service" className="hover:text-mh-green transition-colors">Service Guarantee</Link></li>
             </ul>
          </div>

          <div>
             <h5 className="font-bold text-lg mb-6 text-white">Contact</h5>
             <ul className="space-y-4 text-slate-400">
                <li>Hawke's Bay, New Zealand</li>
                <li>eric.h@mhenergysolutions.co.nz</li>
                <li>+64 27 500 7762</li>
                <li className="pt-4">
                   <span className="inline-block w-3 h-3 bg-mh-green rounded-full mr-2 animate-pulse"></span>
                   24/7 Service Available
                </li>
             </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm">
           <p>&copy; {new Date().getFullYear()} TNE (Terra Nova Electromotive). All rights reserved.</p>
           <p>Designed for NZ Orchards.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
