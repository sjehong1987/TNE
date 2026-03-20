import React from 'react';

interface LogoProps {
  className?: string;
  dark?: boolean; // If true, text is dark (for light backgrounds), else white (for dark backgrounds)
}

const Logo: React.FC<LogoProps> = ({ className = '', dark = false }) => {
  const textColor = dark ? 'text-mh-dark' : 'text-white';
  const leafColor = '#84CC16'; // mh-green
  const bgColor = dark ? '#F8FAFC' : '#334155'; // Background color for cutouts
  
  return (
    <div className={`flex items-center gap-2 md:gap-3 ${className}`}>
      {/* Icon Part: Gear with Circuit and Leaf */}
      <div className="relative flex items-center justify-center w-12 h-12 md:w-16 md:h-16 shrink-0">
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <mask id="gear-mask">
              <rect width="100" height="100" fill="white" />
              <circle cx="45" cy="45" r="20" fill="black" />
            </mask>
          </defs>
          
          {/* Gear */}
          <g mask="url(#gear-mask)">
            <path d="M50 5C53 5 55 7 56 10L58 15C62 16 65 18 68 20L73 17C75 16 78 17 80 19L85 24C87 26 87 29 86 31L83 36C85 39 87 42 88 46L93 48C96 49 98 51 98 54V61C98 64 96 66 93 67L88 69C87 73 85 76 83 79L86 84C87 86 87 89 85 91L80 96C78 98 75 99 73 98L68 95C65 97 62 99 58 100L56 105C55 108 53 110 50 110H43C40 110 38 108 37 105L35 100C31 99 28 97 25 95L20 98C18 99 15 98 13 96L8 91C6 89 6 86 7 84L10 79C8 76 6 73 5 69L0 67C-3 66 -5 64 -5 61V54C-5 51 -3 49 0 48L5 46C6 42 8 39 10 36L7 31C6 29 6 26 8 24L13 19C15 17 18 16 20 17L25 20C28 18 31 16 35 15L37 10C38 7 40 5 43 5H50Z" 
                  fill={leafColor} transform="scale(0.75) translate(10, 10)" />
          </g>

          {/* Circuit lines */}
          <path d="M45 25 A 20 20 0 0 1 65 45" stroke={dark ? '#334155' : 'white'} strokeWidth="2" fill="none" strokeDasharray="4 2" />
          <circle cx="59" cy="31" r="2" fill={dark ? '#334155' : 'white'} />
          <circle cx="51" cy="27" r="2" fill={dark ? '#334155' : 'white'} />

          {/* Leaf overlapping gear */}
          <path d="M35 55 C 55 55, 85 75, 95 95 C 70 95, 35 85, 35 55 Z" fill={leafColor} />
          <path d="M35 55 C 55 70, 75 85, 95 95" stroke={bgColor} strokeWidth="2" fill="none" />
        </svg>
      </div>
      
      {/* Text Part */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center">
          <span className={`text-3xl md:text-4xl font-black tracking-wide leading-none ${textColor}`}>
            C
          </span>
          {/* The 'O' with a leaf */}
          <div className="relative w-7 h-7 md:w-9 md:h-9 mx-0.5 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="36" stroke={dark ? '#334155' : 'white'} strokeWidth="16" fill="none" />
              {/* Leaf inside O */}
              <path d="M20 80 C 20 40, 50 20, 80 20 C 80 60, 50 80, 20 80 Z" fill={leafColor} />
              <path d="M20 80 C 40 70, 60 50, 80 20" stroke={bgColor} strokeWidth="3" fill="none" />
            </svg>
          </div>
          <span className={`text-3xl md:text-4xl font-black tracking-wide leading-none ${textColor}`}>
            REQ
          </span>
        </div>
        <span className={`text-[0.7rem] md:text-[0.85rem] font-bold tracking-[0.15em] uppercase mt-1 ${textColor}`}>
          SYSTEMS NZ
        </span>
      </div>
    </div>
  );
};

export default Logo;
