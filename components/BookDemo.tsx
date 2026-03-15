import React, { useState } from 'react';
import { Send, Phone } from 'lucide-react';
import { IMAGES } from '../images';

const BookDemo: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    interest: 'EV Orchard Platform (Lifter)'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const recipients = "eric.h@greendrivenz.co.nz,ismael.m@greendrivenz.co.nz,noah.s@greendrivenz.co.nz";
    const subject = `New Inquiry: ${formData.interest} - ${formData.name}`;
    
    const body = `Name: ${formData.name}
Email: ${formData.email}
Company: ${formData.company}
Phone: ${formData.phone}
Machine Interest: ${formData.interest}

--------------------------------
Sent from TNE (Terra Nova Electromotive) Website`;

    // Construct mailto link
    window.location.href = `mailto:${recipients}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="bg-mh-dark rounded-[3rem] overflow-hidden relative">
           {/* Background Overlay */}
           <div 
              className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay"
              style={{ backgroundImage: `url(${IMAGES.bookDemo.background})` }}
           ></div>
           
           <div className="relative z-10 flex flex-col lg:flex-row">
              
              {/* Text Side */}
              <div className="lg:w-1/2 p-10 md:p-16 flex flex-col justify-center">
                 <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
                    See It on <br/><span className="text-mh-green">Your Land.</span>
                 </h2>
                 <p className="text-slate-300 text-lg mb-8 max-w-md">
                    We bring the machine to you. Test its agility in your own rows, with your own crew. No cost, no obligation.
                 </p>
                 <div className="flex items-center gap-4 text-white">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                       <Phone className="w-6 h-6" />
                    </div>
                    <div>
                       <p className="text-sm text-slate-400">Call for instant inquiry</p>
                       <p className="text-xl font-bold tracking-wide">+64 27 500 7762</p>
                    </div>
                 </div>
              </div>

              {/* Form Side */}
              <div className="lg:w-1/2 bg-white p-10 md:p-16 lg:rounded-l-[3rem]">
                 <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                       <label className="block text-sm font-bold text-mh-dark mb-2 uppercase tracking-wide">Name</label>
                       <input 
                          type="text" 
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="First name Last name" 
                          required
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-mh-green transition-all" 
                       />
                    </div>

                    <div>
                       <label className="block text-sm font-bold text-mh-dark mb-2 uppercase tracking-wide">Email Address</label>
                       <input 
                          type="email" 
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="email@example.com" 
                          required
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-mh-green transition-all" 
                       />
                    </div>

                    <div>
                       <label className="block text-sm font-bold text-mh-dark mb-2 uppercase tracking-wide">Orchard / Company</label>
                       <input 
                          type="text" 
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          placeholder="ex) TNE (Terra Nova Electromotive)" 
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-mh-green transition-all" 
                       />
                    </div>

                    <div>
                       <label className="block text-sm font-bold text-mh-dark mb-2 uppercase tracking-wide">Phone Number</label>
                       <input 
                          type="tel" 
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="021 123 4567" 
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-mh-green transition-all" 
                       />
                    </div>

                    <div>
                       <label className="block text-sm font-bold text-mh-dark mb-2 uppercase tracking-wide">Machine Interest</label>
                       <select 
                          name="interest"
                          value={formData.interest}
                          onChange={handleChange}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-mh-green transition-all appearance-none"
                       >
                          <option>EV Orchard Platform (Lifter)</option>
                          <option>Electric Forklift</option>
                          <option>LFP Battery Solutions</option>
                          <option>Solar/Wind Systems</option>
                          <option>Other Inquiry</option>
                       </select>
                    </div>

                    <button type="submit" className="w-full bg-mh-green text-mh-dark font-bold text-lg py-4 rounded-xl hover:bg-mh-accent transition-colors flex items-center justify-center gap-2 mt-4 shadow-lg hover:shadow-xl transform active:scale-95">
                       Contact us
                       <Send className="w-5 h-5" />
                    </button>
                 </form>
              </div>

           </div>
        </div>
      </div>
    </section>
  );
};

export default BookDemo;