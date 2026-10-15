import React from 'react';

interface VorteqLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'badge';
  theme?: 'dark' | 'light' | 'auto';
  animated?: boolean;
}

export const VorteqLogo: React.FC<VorteqLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'full',
  theme = 'light',
  animated = false,
}) => {
  // Dimensions map
  const dimensions = {
    sm: { icon: 24, text: 'text-base', gap: 'gap-1.5' },
    md: { icon: 34, text: 'text-xl', gap: 'gap-2.5' },
    lg: { icon: 46, text: 'text-2xl', gap: 'gap-3' },
    xl: { icon: 68, text: 'text-4xl', gap: 'gap-4' },
  }[size];

  // Primary colors extracted from the official brand identity
  const navyColor = theme === 'dark' ? '#F8FAFC' : '#0B192C';
  const greenColor = '#00B074';
  const orbitRingColor = theme === 'dark' ? '#94A3B8' : '#0B192C';

  return (
    <div className={`inline-flex items-center ${dimensions.gap} select-none ${className}`}>
      {/* Precision Orbital Atom / Gyroscope Vector Icon */}
      <div className="relative flex items-center justify-center shrink-0">
        <svg
          width={dimensions.icon}
          height={dimensions.icon}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${animated ? 'hover:scale-105 transition-transform duration-300' : ''}`}
        >
          {/* Defs for gradients & filters */}
          <defs>
            <linearGradient id="vorteqNavyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={theme === 'dark' ? '#E2E8F0' : '#0A192F'} />
              <stop offset="100%" stopColor={theme === 'dark' ? '#94A3B8' : '#0B192C'} />
            </linearGradient>
            <linearGradient id="vorteqGreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#05D68E" />
              <stop offset="100%" stopColor="#00B074" />
            </linearGradient>
            <filter id="vorteqGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#00B074" floodOpacity="0.35" />
            </filter>
          </defs>

          {/* 3 Interlocking Orbital Ellipses rotated at 0°, 60°, and 120° */}
          <g transform="translate(50, 50)" className={animated ? 'animate-spin-very-slow' : ''}>
            {/* Ellipse 1 - Vertical / 0° */}
            <ellipse
              cx="0"
              cy="0"
              rx="18"
              ry="42"
              stroke={orbitRingColor}
              strokeWidth="5.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              opacity={theme === 'dark' ? 0.95 : 1}
            />

            {/* Ellipse 2 - Rotated 60° */}
            <ellipse
              cx="0"
              cy="0"
              rx="18"
              ry="42"
              transform="rotate(60)"
              stroke={orbitRingColor}
              strokeWidth="5.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              opacity={theme === 'dark' ? 0.95 : 1}
            />

            {/* Ellipse 3 - Rotated 120° (-60°) */}
            <ellipse
              cx="0"
              cy="0"
              rx="18"
              ry="42"
              transform="rotate(120)"
              stroke={orbitRingColor}
              strokeWidth="5.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              opacity={theme === 'dark' ? 0.95 : 1}
            />

            {/* 3 Strategic Green Orbital Nodes (Electrons / Liquidity Hubs) matching the logo */}
            {/* Top Right Node */}
            <circle
              cx="24"
              cy="-23"
              r="6.8"
              fill="url(#vorteqGreenGrad)"
              filter="url(#vorteqGlow)"
              className={animated ? 'animate-pulse' : ''}
            />

            {/* Bottom Left Node */}
            <circle
              cx="-27"
              cy="25"
              r="6.8"
              fill="url(#vorteqGreenGrad)"
              filter="url(#vorteqGlow)"
              className={animated ? 'animate-pulse' : ''}
              style={{ animationDelay: '300ms' }}
            />

            {/* Lower Right Node */}
            <circle
              cx="38"
              cy="10"
              r="6.8"
              fill="url(#vorteqGreenGrad)"
              filter="url(#vorteqGlow)"
              className={animated ? 'animate-pulse' : ''}
              style={{ animationDelay: '600ms' }}
            />
          </g>
        </svg>
      </div>

      {/* Typography: "Vorteq B2B" */}
      {variant === 'full' && (
        <div className={`font-black tracking-tight flex items-baseline leading-none ${dimensions.text}`}>
          <span style={{ color: navyColor }} className="tracking-tight">
            Vorteq
          </span>
          <span style={{ color: greenColor }} className="ml-1 tracking-tight font-extrabold">
            B2B
          </span>
        </div>
      )}

      {/* Badge mode */}
      {variant === 'badge' && (
        <div className="flex flex-col">
          <div className={`font-black tracking-tight flex items-baseline leading-none ${dimensions.text}`}>
            <span style={{ color: navyColor }}>Vorteq</span>
            <span style={{ color: greenColor }} className="ml-1 font-extrabold">B2B</span>
          </div>
          <span className="text-[9px] font-mono tracking-widest text-[#00B074] uppercase font-bold mt-0.5">
            Wholesale Network
          </span>
        </div>
      )}
    </div>
  );
};
