import React from 'react';

interface AfriPathLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'white';
  className?: string;
  showTagline?: boolean;
}

export const AfriPathLogo: React.FC<AfriPathLogoProps> = ({
  size = 'md',
  variant = 'full',
  className = '',
  showTagline = false,
}) => {
  const sizeMap = {
    sm: { icon: 24, text: 'text-base', tag: 'text-[9px]' },
    md: { icon: 32, text: 'text-lg', tag: 'text-[10px]' },
    lg: { icon: 40, text: 'text-2xl', tag: 'text-xs' },
    xl: { icon: 52, text: 'text-3xl', tag: 'text-sm' },
  };

  const currentSize = sizeMap[size];

  const IconGraphic = (
    <svg
      width={currentSize.icon}
      height={currentSize.icon}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-300 group-hover:scale-105"
    >
      {/* Background Rounded Shield / Tile */}
      <rect width="48" height="48" rx="12" fill="#047857" fillOpacity="0.16" />
      <rect x="0.5" y="0.5" width="47" height="47" rx="11.5" stroke="#10B981" strokeOpacity="0.3" />
      
      {/* Dynamic Converging Ascending Pathway forming an abstract "A" & continent silhouette */}
      <path
        d="M12 37L24 11L36 37"
        stroke="#10B981"
        strokeWidth="3.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Golden Pathway Connection Bridge */}
      <path
        d="M17 28H31"
        stroke="#F59E0B"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      {/* Guiding North-Star Milestone Node */}
      <circle cx="24" cy="11" r="3.2" fill="#F59E0B" />
      <circle cx="24" cy="11" r="5" stroke="#F59E0B" strokeOpacity="0.35" strokeWidth="1.5" />
    </svg>
  );

  if (variant === 'icon') {
    return <div className={`inline-flex items-center ${className}`}>{IconGraphic}</div>;
  }

  return (
    <div className={`group inline-flex items-center gap-2.5 ${className}`}>
      {IconGraphic}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-extrabold tracking-tight text-white ${currentSize.text}`}>
            Afri<span className="text-emerald-400">Path</span>
          </span>
          <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold tracking-wider uppercase">
            AI
          </span>
        </div>
        {showTagline && (
          <span className={`text-slate-400 font-medium tracking-normal mt-0.5 ${currentSize.tag}`}>
            Your Career. Your Skills. Your Future.
          </span>
        )}
      </div>
    </div>
  );
};
