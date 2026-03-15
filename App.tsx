import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import WhyMHPage from './pages/WhyMH';
import MachineryPage from './pages/Machinery';
import BatteryTechPage from './pages/BatteryTech';
import ServicePage from './pages/Service';
import GalleryPage from './pages/Gallery';
import AdminPage from './pages/Admin';
import BookDemoPage from './pages/BookDemo';
import Footer from './components/Footer';
import FloatingContact from './components/FloatingContact';
import ScrollToTop from './components/ScrollToTop';

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-slate-50 selection:bg-mh-green selection:text-mh-dark">
        <Navigation scrolled={scrolled} />
        
        <main className="flex flex-col gap-0">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/our-story" element={<WhyMHPage />} />
            <Route path="/machinery" element={<MachineryPage />} />
            <Route path="/battery-tech" element={<BatteryTechPage />} />
            <Route path="/service" element={<ServicePage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/book-demo" element={<BookDemoPage />} />
          </Routes>
        </main>

        <Footer />
        <FloatingContact />
      </div>
    </Router>
  );
};

export default App;
