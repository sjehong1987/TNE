import React from 'react';

interface LogoProps {
  className?: string;
  dark?: boolean; // If true, text is dark (for light backgrounds), else white (for dark backgrounds)
}

const Logo: React.FC<LogoProps> = ({ className = '', dark = false }) => {
  const textColor = dark ? 'text-mh-dark' : 'text-white';
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Icon Part */}
      <div className="relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12 shrink-0">
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Hexagon Base */}
          <path d="M50 2.5 L93.3 27.5 V72.5 L50 97.5 L6.7 72.5 V27.5 Z" className="fill-mh-green" />
          {/* Inner Hexagon */}
          <path d="M50 12 L82 30.5 V69.5 L50 88 L18 69.5 V30.5 Z" className="fill-mh-dark" />
          {/* Lightning Bolt inside */}
          <path d="M58 25 L32 58 H52 L44 81 L72 45 H52 L58 25 Z" className="fill-mh-green" />
        </svg>
      </div>
      
      {/* Text Part */}
      <div className="flex flex-col justify-center">
        <span className={`text-2xl md:text-3xl font-black tracking-widest leading-none ${textColor}`}>
          TNE
        </span>
        <span className="text-[0.55rem] md:text-[0.65rem] font-bold tracking-[0.2em] text-mh-green uppercase mt-1">
          Terra Nova Electromotive
        </span>
      </div>
    </div>
  );
};

export default Logo;
