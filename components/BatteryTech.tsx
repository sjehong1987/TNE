import React from 'react';
import { BatteryCharging, ShieldCheck, Sun, Wind, Box, Settings, Zap, ArrowRight, Gauge, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';
import { IMAGES } from '../images';

const BatteryTech: React.FC = () => {
  return (
    <section className="py-24 bg-mh-dark text-white relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-mh-green/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-mh-blue/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-20">
           <div className="inline-block px-3 py-1 bg-mh-blue/20 text-mh-blue rounded-full text-xs font-bold uppercase tracking-widest mb-4">Core Technology</div>
           <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
              Advanced Energy Solutions.
           </h2>
           <p className="text-slate-400 text-lg">
              From replacing lead-acid in your fleet to generating off-grid power, we provide the complete energy ecosystem.
           </p>
        </div>

        {/* --- Motive Power Section --- */}
        <div className="mb-20">
           <h3 className="text-2xl font-bold text-white mb-8 border-l-4 border-mh-green pl-4 flex items-center gap-2">
              <Zap className="w-6 h-6 text-mh-green" /> Motive Power
           </h3>
           <div className="grid md:grid-cols-2 gap-8">
              
              {/* Golf Cart Battery */}
              <div id="golf-cart-battery" className="relative overflow-hidden rounded-3xl border border-white/10 p-8 scroll-mt-28 group h-full">
                 {/* Background Image Layer */}
                 <div className="absolute inset-0 z-0">
                    <img 
                      src={IMAGES.battery.golfCart}
                      alt="Golf Cart on Course" 
                      className="w-full h-full object-cover opacity-50 transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Blur & Darken Overlay for Readability */}
                    <div className="absolute inset-0 bg-mh-dark/80 backdrop-blur-[2px] transition-opacity group-hover:bg-mh-dark/70"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-mh-dark via-transparent to-transparent"></div>
                 </div>

                 {/* Content Layer */}
                 <div className="relative z-10 flex flex-col h-full">
                     <div className="w-14 h-14 bg-mh-green rounded-2xl flex items-center justify-center text-mh-dark mb-6 shadow-[0_0_20px_rgba(132,204,22,0.3)] group-hover:scale-110 transition-transform origin-left">
                        <Gauge className="w-7 h-7" />
                     </div>
                     <h4 className="text-2xl font-bold mb-4">Golf Cart LFP Battery</h4>
                     <p className="text-slate-200 mb-6 leading-relaxed flex-grow">
                        Drop-in replacement for standard 36V and 48V golf carts. Weighs 70% less than lead-acid, increasing range and speed while eliminating water maintenance.
                     </p>
                     <ul className="space-y-2 mb-8 text-sm text-slate-300">
                        <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-mh-green"/> 5-Year Warranty</li>
                        <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-mh-green"/> 3000+ Cycle Life</li>
                     </ul>
                     <Link to="/book-demo" className="text-mh-green font-bold flex items-center hover:text-white transition-colors">Request Quote <ArrowRight className="w-4 h-4 ml-2"/></Link>
                 </div>
              </div>

              {/* Forklift Battery */}
              <div id="forklift-battery" className="relative overflow-hidden rounded-3xl border border-white/10 p-8 scroll-mt-28 group h-full">
                 {/* Background Image Layer */}
                 <div className="absolute inset-0 z-0">
                    <img 
                      src={IMAGES.battery.forklift}
                      alt="Forklift in Warehouse" 
                      className="w-full h-full object-cover opacity-50 transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Blur & Darken Overlay for Readability */}
                    <div className="absolute inset-0 bg-mh-dark/80 backdrop-blur-[2px] transition-opacity group-hover:bg-mh-dark/70"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-mh-dark via-transparent to-transparent"></div>
                 </div>

                 {/* Content Layer */}
                 <div className="relative z-10 flex flex-col h-full">
                     <div className="w-14 h-14 bg-mh-blue rounded-2xl flex items-center justify-center text-white mb-6 shadow-[0_0_20px_rgba(2,132,199,0.3)] group-hover:scale-110 transition-transform origin-left">
                        <BatteryCharging className="w-7 h-7" />
                     </div>
                     <h4 className="text-2xl font-bold mb-4">Forklift LFP Battery</h4>
                     <p className="text-slate-200 mb-6 leading-relaxed flex-grow">
                        Industrial-grade packs for Class I, II, and III forklifts. Supports opportunity charging during breaks—no cool-down required. Keep your warehouse running 24/7.
                     </p>
                     <ul className="space-y-2 mb-8 text-sm text-slate-300">
                        <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-mh-blue"/> Fast Charging (1hr)</li>
                        <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-mh-blue"/> Zero Emissions</li>
                     </ul>
                     <Link to="/book-demo" className="text-mh-blue font-bold flex items-center hover:text-white transition-colors">Request Quote <ArrowRight className="w-4 h-4 ml-2"/></Link>
                 </div>
              </div>

           </div>
        </div>

        {/* --- Generation Section --- */}
        <div className="mb-20">
           <h3 className="text-2xl font-bold text-white mb-8 border-l-4 border-mh-blue pl-4 flex items-center gap-2">
              <Leaf className="w-6 h-6 text-mh-blue" /> Renewable Generation
           </h3>
           <div className="grid md:grid-cols-2 gap-8">
              
              {/* Solar Panel */}
              <div id="solar-panel" className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors scroll-mt-28 group">
                 <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-mh-dark mb-6 group-hover:scale-110 transition-transform">
                    <Sun className="w-7 h-7" />
                 </div>
                 <h4 className="text-2xl font-bold mb-4">Solar Panels</h4>
                 <p className="text-slate-400 mb-6 leading-relaxed">
                    High-efficiency monocrystalline panels designed for New Zealand conditions. Perfect for orchard shed roofs or agri-voltaic ground mounts to power your EV fleet.
                 </p>
                 <Link to="/book-demo" className="text-white font-bold flex items-center hover:text-mh-green transition-colors">Explore Solar <ArrowRight className="w-4 h-4 ml-2"/></Link>
              </div>

              {/* Wind Turbine */}
              <div id="wind-turbine" className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors scroll-mt-28 group">
                 <div className="w-14 h-14 bg-slate-200 rounded-2xl flex items-center justify-center text-slate-800 mb-6 group-hover:scale-110 transition-transform">
                    <Wind className="w-7 h-7" />
                 </div>
                 <h4 className="text-2xl font-bold mb-4">Wind Turbine</h4>
                 <p className="text-slate-400 mb-6 leading-relaxed">
                    Compact, low-start-speed turbines for consistent off-grid power. Ideal for remote pump sheds or frost protection power where grid connection is costly.
                 </p>
                 <Link to="/book-demo" className="text-white font-bold flex items-center hover:text-mh-green transition-colors">Wind Solutions <ArrowRight className="w-4 h-4 ml-2"/></Link>
              </div>

           </div>
        </div>

        {/* --- Custom Engineering Section --- */}
        <div>
           <h3 className="text-2xl font-bold text-white mb-8 border-l-4 border-purple-500 pl-4 flex items-center gap-2">
              <Settings className="w-6 h-6 text-purple-500" /> Custom Engineering
           </h3>
           <div className="grid md:grid-cols-2 gap-8">
              
              {/* Battery Package */}
              <div id="battery-package" className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all scroll-mt-28 group">
                 <div className="w-14 h-14 bg-purple-500 rounded-2xl flex items-center justify-center text-white mb-6 shadow-[0_0_20px_rgba(168,85,247,0.3)] group-hover:scale-110 transition-transform">
                    <Box className="w-7 h-7" />
                 </div>
                 <h4 className="text-2xl font-bold mb-4">Battery Package</h4>
                 <p className="text-slate-400 mb-6 leading-relaxed">
                    Complete energy storage systems (ESS) including inverter, BMS, and racking. Pre-wired and tested for rapid deployment in residential or commercial settings.
                 </p>
                 <Link to="/book-demo" className="text-purple-400 font-bold flex items-center hover:text-white transition-colors">View Packages <ArrowRight className="w-4 h-4 ml-2"/></Link>
              </div>

              {/* Customized LFP Battery */}
              <div id="customized-battery" className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all scroll-mt-28 group">
                 <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center text-white mb-6 shadow-[0_0_20px_rgba(249,115,22,0.3)] group-hover:scale-110 transition-transform">
                    <Settings className="w-7 h-7" />
                 </div>
                 <h4 className="text-2xl font-bold mb-4">Customized LFP Battery</h4>
                 <p className="text-slate-400 mb-6 leading-relaxed">
                    Have a unique voltage or form-factor requirement? We design and build custom LFP packs for specialized machinery, marine, or robotics applications.
                 </p>
                 <Link to="/book-demo" className="text-orange-400 font-bold flex items-center hover:text-white transition-colors">Consult Engineering <ArrowRight className="w-4 h-4 ml-2"/></Link>
              </div>

           </div>
        </div>

      </div>
    </section>
  );
};

export default BatteryTech;
