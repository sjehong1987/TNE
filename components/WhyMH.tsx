import React from 'react';
import { Leaf, Cpu, Settings2, ArrowRight, Target, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';

const WhyMH: React.FC = () => {
  return (
    <section className="py-24 bg-white text-mh-dark overflow-hidden">
      <div className="container mx-auto px-6">
        
        {/* Header Section */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <h4 className="text-mh-blue font-bold tracking-wider uppercase mb-4">Our Purpose</h4>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
            Nature Powered by <br />
            <span className="text-mh-green relative">
               Technology.
               <svg className="absolute w-full h-3 -bottom-1 left-0 text-mh-green/30 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
               </svg>
            </span>
          </h2>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto">
            Bridging the gap between New Zealand’s green potential and advanced agricultural innovation.
          </p>
        </div>

        {/* Core Values Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-24">
           {/* Card 1 */}
           <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 hover:shadow-xl transition-all hover:-translate-y-1 group">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-mh-green mb-6 shadow-sm group-hover:scale-110 transition-transform">
                 <Cpu className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-mh-dark">Smart Efficiency</h3>
              <p className="text-slate-600 leading-relaxed">
                 Solving labor shortages with agile machinery. Do more work in less time, with fewer people, using high-performance electric tech.
              </p>
           </div>

           {/* Card 2 */}
           <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 hover:shadow-xl transition-all hover:-translate-y-1 group">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-mh-blue mb-6 shadow-sm group-hover:scale-110 transition-transform">
                 <Settings2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-mh-dark">Kiwi Customization</h3>
              <p className="text-slate-600 leading-relaxed">
                 No "one size fits all." We customize every machine specifically for NZ orchard row widths and unique terrain conditions.
              </p>
           </div>

           {/* Card 3 */}
           <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 hover:shadow-xl transition-all hover:-translate-y-1 group">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-mh-green mb-6 shadow-sm group-hover:scale-110 transition-transform">
                 <Leaf className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-mh-dark">True Sustainability</h3>
              <p className="text-slate-600 leading-relaxed">
                 Championing LFP battery tech. Safer, cleaner, and longer-lasting than diesel or lead-acid. A truly green energy cycle.
              </p>
           </div>
        </div>

        {/* Mission & Vision Section - Redesigned without Photo */}
        <div className="bg-mh-dark rounded-[3rem] p-10 md:p-20 relative overflow-hidden text-white">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-mh-green/10 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-mh-blue/10 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

            <div className="relative z-10 max-w-5xl mx-auto">
               <div className="grid md:grid-cols-2 gap-16 items-start">
                  
                  {/* Mission Column */}
                  <div className="relative">
                      <div className="absolute -left-4 -top-4 w-20 h-20 bg-mh-green/10 rounded-full blur-2xl"></div>
                      <div className="relative">
                         <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-mh-green text-mh-dark flex items-center justify-center">
                               <Target className="w-6 h-6" />
                            </div>
                            <h3 className="text-3xl font-bold">Our Mission</h3>
                         </div>
                         <p className="text-slate-300 leading-relaxed text-lg">
                            We define ourselves as an Energy Solution Provider. Our goal is not merely to sell machines, but to solve the persistent challenges facing New Zealand agriculture: labor shortages, rising costs, and environmental concerns.
                         </p>
                         <p className="mt-4 text-slate-300 leading-relaxed text-lg">
                            We bring the world’s most advanced EV agricultural technology and optimize it for New Zealand’s unique terrain.
                         </p>
                      </div>
                  </div>

                  {/* Vision Column */}
                  <div className="relative">
                      <div className="absolute -right-4 -top-4 w-20 h-20 bg-mh-blue/10 rounded-full blur-2xl"></div>
                      <div className="relative">
                         <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-mh-blue text-white flex items-center justify-center">
                               <Lightbulb className="w-6 h-6" />
                            </div>
                            <h3 className="text-3xl font-bold">The Vision</h3>
                         </div>
                         <p className="text-slate-300 leading-relaxed text-lg">
                            We envision a future where the roar of diesel engines in orchards is replaced by the quiet hum of electric motors.
                         </p>
                         <p className="mt-4 text-slate-300 leading-relaxed text-lg">
                            TNE (Terra Nova Electromotive) is here to lead that transition, ensuring that the work we do on the land is as clean as the land itself.
                         </p>
                      </div>
                  </div>

               </div>

               <div className="mt-16 text-center">
                   <Link to="/machinery" className="inline-flex items-center gap-2 text-white font-bold text-lg hover:text-mh-green transition-colors border-b-2 border-mh-green pb-1">
                      Join the energy revolution <ArrowRight className="w-5 h-5" />
                   </Link>
               </div>
            </div>
        </div>

      </div>
    </section>
  );
};

export default WhyMH;