import React from 'react';
import { Clock, Wrench, MapPin, Users } from 'lucide-react';

const Service: React.FC = () => {
  return (
    <section className="py-24 bg-mh-green/5">
      <div className="container mx-auto px-6">
        
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-mh-dark mb-4">
            We Keep You Running. <span className="text-mh-blue">Guaranteed.</span>
          </h2>
          <p className="text-lg text-slate-600">
             Imported machines usually mean long wait times for repairs. Not with us.
             We built a local support network to ensure harvest never stops.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all hover:-translate-y-2 border border-slate-100">
               <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-6">
                  <Clock className="w-8 h-8" />
               </div>
               <h3 className="text-xl font-bold text-mh-dark mb-3">72-Hour Promise</h3>
               <p className="text-slate-500">Rapid response time. If you stop, we move fast to get you going again.</p>
            </div>

            <div className="bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all hover:-translate-y-2 border border-slate-100">
               <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-mh-blue mb-6">
                  <Users className="w-8 h-8" />
               </div>
               <h3 className="text-xl font-bold text-mh-dark mb-3">Local Experts</h3>
               <p className="text-slate-500">Noah & Stefan are your dedicated technical experts on standby in Hawke's Bay.</p>
            </div>

            <div className="bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all hover:-translate-y-2 border border-slate-100">
               <div className="w-16 h-16 bg-mh-green/20 rounded-full flex items-center justify-center text-mh-green mb-6">
                  <Wrench className="w-8 h-8" />
               </div>
               <h3 className="text-xl font-bold text-mh-dark mb-3">Modular Repairs</h3>
               <p className="text-slate-500">Our EV design is modular. We swap parts quickly without complex engine tear-downs.</p>
            </div>

            <div className="bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all hover:-translate-y-2 border border-slate-100">
               <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-700 mb-6">
                  <MapPin className="w-8 h-8" />
               </div>
               <h3 className="text-xl font-bold text-mh-dark mb-3">HB Specialists</h3>
               <p className="text-slate-500">Partnered with Hawke's Bay forklift specialists for comprehensive coverage.</p>
            </div>

        </div>
      </div>
    </section>
  );
};

export default Service;
