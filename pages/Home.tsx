import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Battery, Leaf } from 'lucide-react';
import Hero from '../components/Hero';

const Home: React.FC = () => {
  return (
    <>
      <Hero />
      
      {/* Quick Navigation Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-mh-dark mb-4">
              Explore Our Solutions
            </h2>
            <p className="text-slate-600 text-lg">
              Discover how TNE (Terra Nova Electromotive) is revolutionizing orchard management with sustainable technology.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Machinery Card */}
            <Link to="/machinery" className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all border border-slate-100 hover:-translate-y-1">
              <div className="w-14 h-14 bg-mh-green/10 rounded-2xl flex items-center justify-center text-mh-green mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-mh-dark mb-3 group-hover:text-mh-green transition-colors">
                Electric Machinery
              </h3>
              <p className="text-slate-600 mb-6">
                Agile lifting platforms and transport vehicles designed for narrow orchard rows.
              </p>
              <div className="flex items-center text-mh-green font-bold group-hover:gap-2 transition-all">
                View Fleet <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </Link>

            {/* Battery Tech Card */}
            <Link to="/battery-tech" className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all border border-slate-100 hover:-translate-y-1">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
                <Battery className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-mh-dark mb-3 group-hover:text-blue-500 transition-colors">
                LFP Battery Tech
              </h3>
              <p className="text-slate-600 mb-6">
                Long-lasting, safe, and efficient power solutions for all your equipment.
              </p>
              <div className="flex items-center text-blue-500 font-bold group-hover:gap-2 transition-all">
                Learn More <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </Link>

            {/* Our Story Card */}
            <Link to="/our-story" className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all border border-slate-100 hover:-translate-y-1">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform">
                <Leaf className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-mh-dark mb-3 group-hover:text-emerald-600 transition-colors">
                Our Story
              </h3>
              <p className="text-slate-600 mb-6">
                Learn about our mission to bring sustainable energy to New Zealand horticulture.
              </p>
              <div className="flex items-center text-emerald-600 font-bold group-hover:gap-2 transition-all">
                Read More <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
