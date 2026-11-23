import React from 'react';
import mgSelectLogo from '../assets/mg-select-final-logo-light.webp';

interface MGLogoProps {
  className?: string;
  glow?: boolean;
  alt?: string;
}

export const MGLogo: React.FC<MGLogoProps> = ({
  className = 'h-7 sm:h-8 w-auto',
  glow = false,
  alt = 'MG Select Official Logo',
}) => {
  return (
    <div className="relative inline-flex items-center justify-center select-none">
      {glow && (
        <div className="absolute inset-0 bg-red-600/20 blur-lg rounded-full pointer-events-none scale-125" />
      )}
      <img
        src={mgSelectLogo}
        alt={alt}
        className={`relative z-10 object-contain transition-all duration-300 ${className}`}
        loading="eager"
      />
    </div>
  );
};

export default MGLogo;
