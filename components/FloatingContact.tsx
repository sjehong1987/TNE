import React from 'react';
import { MessageCircle } from 'lucide-react';

const FloatingContact: React.FC = () => {
  return (
    <a
      href="https://wa.me/64275007762"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 md:hidden bg-mh-green text-mh-dark p-4 rounded-full shadow-2xl flex items-center gap-2 font-bold animate-bounce hover:animate-none transition-transform active:scale-90 border-4 border-white"
      aria-label="Contact on WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
      <span>Chat Now</span>
    </a>
  );
};

export default FloatingContact;