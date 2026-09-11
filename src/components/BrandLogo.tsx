import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Nike-Inspired Athletic Kinetic Swoosh Badge */}
      <div className={`relative ${iconSizes[size]} rounded-full bg-[#111111] dark:bg-[#FFFFFF] flex items-center justify-center flex-shrink-0 shadow-md overflow-hidden group`}>
        <svg
          viewBox="0 0 36 24"
          fill="none"
          className="w-full h-full p-1.5 transition-transform group-hover:scale-110"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Dynamic Athletic Kinetic Curve */}
          <path
            d="M32 4C22 13 14 20 6 20C4 20 3 19 3 17C3 13 8 7 19 6C13 8 10 11 10 13C10 14.5 11.5 15.5 14 15.5C18 15.5 24 11 32 4Z"
            className="fill-[#FFFFFF] dark:fill-[#111111]"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex items-baseline select-none">
          <span className="font-['Barlow_Condensed'] text-xl lg:text-2xl font-black uppercase tracking-tight text-[#111111] dark:text-[#FFFFFF]">
            LIFE
          </span>
          <span className="font-['Barlow_Condensed'] text-xl lg:text-2xl font-black uppercase tracking-tight text-[#C5FF00] ml-0.5">
            OS
          </span>
        </div>
      )}
    </div>
  );
};
