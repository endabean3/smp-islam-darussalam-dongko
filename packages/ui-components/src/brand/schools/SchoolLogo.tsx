import React from "react";

export interface SchoolLogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  variant?: "full" | "icon" | "favicon";
}

export const SchoolLogo: React.FC<SchoolLogoProps> = ({
  size = 512,
  variant = "full",
  className = "",
  style,
  ...props
}) => {
  if (variant === "favicon") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
        width={size}
        height={size}
        className={className}
        style={style}
        {...props}
      >
        <defs>
          <linearGradient id="favGradComp" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#169B4B" />
            <stop offset="100%" stopColor="#0A632E" />
          </linearGradient>
        </defs>

        <path
          d="M 32 3 C 41 5, 50 3, 56 3 C 53 16, 55 27, 57 36 C 58 46, 45 59, 32 63 C 19 59, 6 46, 7 36 C 9 27, 11 16, 8 3 C 14 3, 23 5, 32 3 Z"
          fill="url(#favGradComp)"
          stroke="#042912"
          strokeWidth="2"
        />
        <circle cx="32" cy="30" r="14" fill="#FFFFFF" stroke="#0E5E2C" strokeWidth="1.5" />
        <ellipse cx="32" cy="30" rx="14" ry="4" fill="none" stroke="#128A43" strokeWidth="1.2" />
        <line x1="32" y1="16" x2="32" y2="44" stroke="#128A43" strokeWidth="1.2" />
        <path
          d="M 32 34 C 27 31, 22 32, 19 33 L 19 40 C 22 38, 27 38, 32 41 C 37 38, 42 38, 45 40 L 45 33 C 42 32, 37 31, 32 34 Z"
          fill="#FFFFFF"
          stroke="#1E293B"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M 32.00 45.00 L 33.47 48.88 L 37.61 49.08 L 34.37 51.67 L 35.46 55.67 L 32.00 53.40 L 28.54 55.67 L 29.63 51.67 L 26.39 49.08 L 30.53 48.88 Z"
          fill="#FFCD00"
          stroke="#B38600"
          strokeWidth="0.5"
        />
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width={size}
      height={size}
      className={className}
      style={style}
      {...props}
    >
      <defs>
        <linearGradient id="shieldGradComp" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#169B4B" />
          <stop offset="50%" stopColor="#128A43" />
          <stop offset="100%" stopColor="#0A632E" />
        </linearGradient>

        <linearGradient id="shieldBorderComp" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0A4D23" />
          <stop offset="100%" stopColor="#042912" />
        </linearGradient>

        <radialGradient id="globeGradComp" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="70%" stopColor="#E8F4EC" />
          <stop offset="100%" stopColor="#C5E2CF" />
        </radialGradient>

        <linearGradient id="goldGradComp" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF066" />
          <stop offset="40%" stopColor="#FFCD00" />
          <stop offset="100%" stopColor="#E6A800" />
        </linearGradient>

        <filter id="dropShadowComp" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.35" />
        </filter>

        <filter id="softGlowComp" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.2" />
        </filter>

        <path id="archSmpIslamComp" d="M 125 106 Q 256 72 387 106" fill="none" />
        <path id="archDarussalamComp" d="M 105 142 Q 256 112 407 142" fill="none" />
        <path id="archDongkoComp" d="M 160 442 Q 256 462 352 442" fill="none" />
      </defs>

      <path
        d="M 256 22 C 325 38, 400 24, 444 26 C 424 125, 434 215, 452 285 C 462 360, 360 460, 256 496 C 152 460, 50 360, 60 285 C 78 215, 88 125, 68 26 C 112 24, 187 38, 256 22 Z"
        fill="url(#shieldBorderComp)"
        filter="url(#dropShadowComp)"
      />

      <path
        d="M 256 30 C 322 45, 394 32, 436 34 C 418 128, 427 212, 444 280 C 454 350, 354 446, 256 484 C 158 446, 58 350, 68 280 C 85 212, 94 128, 76 34 C 118 32, 190 45, 256 30 Z"
        fill="url(#shieldGradComp)"
        stroke="#0E5E2C"
        strokeWidth="2"
      />

      <text
        fontFamily="'Times New Roman', Times, 'Playfair Display', Georgia, serif"
        fontWeight="bold"
        fontSize="25"
        fill="#FFFFFF"
        letterSpacing="2"
        textAnchor="middle"
      >
        <textPath href="#archSmpIslamComp" startOffset="50%">
          SMP ISLAM
        </textPath>
      </text>

      <text
        fontFamily="'Times New Roman', Times, 'Playfair Display', Georgia, serif"
        fontWeight="bold"
        fontSize="27"
        fill="#FFFFFF"
        letterSpacing="1.5"
        textAnchor="middle"
      >
        <textPath href="#archDarussalamComp" startOffset="50%">
          “DARUSSALAM”
        </textPath>
      </text>

      <g transform="translate(0, 10)">
        <circle cx="256" cy="245" r="98" fill="url(#globeGradComp)" stroke="#0C6E33" strokeWidth="4" filter="url(#softGlowComp)" />
        <g>
          <clipPath id="globeClipComp">
            <circle cx="256" cy="245" r="96" />
          </clipPath>
          <g clipPath="url(#globeClipComp)" stroke="#128A43" strokeWidth="1.8" fill="none" opacity="0.85">
            <ellipse cx="256" cy="245" rx="96" ry="24" strokeWidth="2.2" />
            <ellipse cx="256" cy="215" rx="90" ry="18" />
            <ellipse cx="256" cy="185" rx="72" ry="14" />
            <ellipse cx="256" cy="275" rx="90" ry="18" />
            <ellipse cx="256" cy="305" rx="72" ry="14" />
            <path d="M 256 149 L 256 341" strokeWidth="2.2" />
            <path d="M 256 149 C 220 180, 220 310, 256 341" />
            <path d="M 256 149 C 185 180, 185 310, 256 341" />
            <path d="M 256 149 C 292 180, 292 310, 256 341" />
            <path d="M 256 149 C 327 180, 327 310, 256 341" />
          </g>
        </g>

        <path d="M 162 265 C 190 325, 322 325, 350 265 C 320 338, 192 338, 162 265 Z" fill="#0D6B33" opacity="0.6" />

        <g transform="translate(256, 228)" filter="url(#softGlowComp)">
          <rect x="-34" y="-38" width="10" height="30" rx="2" fill="#FFFFFF" stroke="#0E5E2C" strokeWidth="1.5" />
          <rect x="-18" y="-42" width="10" height="34" rx="2" fill="#FFFFFF" stroke="#0E5E2C" strokeWidth="1.5" />
          <rect x="-2" y="-42" width="10" height="34" rx="2" fill="#FFFFFF" stroke="#0E5E2C" strokeWidth="1.5" />
          <path d="M 14 -44 L 28 -44 L 38 -20 L 26 -10 Z" fill="#FFFFFF" stroke="#0E5E2C" strokeWidth="1.5" />
          <path d="M 14 -20 L 36 -42" stroke="#0E5E2C" strokeWidth="3" strokeLinecap="round" />
        </g>

        <g filter="url(#softGlowComp)">
          <path
            d="M 256 298 C 220 282, 172 284, 138 296 L 140 336 C 176 322, 220 320, 256 338 C 292 320, 336 322, 372 336 L 374 296 C 340 284, 292 282, 256 298 Z"
            fill="#1E293B"
          />
          <path
            d="M 256 293 C 220 276, 172 278, 140 290 L 143 328 C 177 314, 222 312, 256 330 Z"
            fill="#FFFFFF"
            stroke="#1E293B"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path
            d="M 256 293 C 292 276, 340 278, 372 290 L 369 328 C 335 314, 290 312, 256 330 Z"
            fill="#FFFFFF"
            stroke="#1E293B"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path d="M 256 293 L 256 330" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
          <path d="M 160 300 C 190 290, 225 292, 246 302" stroke="#94A3B8" strokeWidth="1.5" fill="none" />
          <path d="M 163 310 C 192 300, 226 302, 246 312" stroke="#94A3B8" strokeWidth="1.5" fill="none" />
          <path d="M 352 300 C 322 290, 287 292, 266 302" stroke="#94A3B8" strokeWidth="1.5" fill="none" />
          <path d="M 349 310 C 320 300, 286 302, 266 312" stroke="#94A3B8" strokeWidth="1.5" fill="none" />
        </g>
      </g>

      <g fill="url(#goldGradComp)" stroke="#B38600" strokeWidth="1" filter="url(#softGlowComp)">
        <path d="M 115.05 175.26 L 121.07 185.71 L 133.01 184.02 L 124.93 192.97 L 130.23 203.81 L 119.22 198.89 L 110.55 207.28 L 111.82 195.29 L 101.17 189.63 L 112.96 187.14 Z" />
        <path d="M 102.52 235.06 L 107.61 246.00 L 119.65 245.36 L 110.82 253.57 L 115.15 264.83 L 104.61 258.97 L 95.24 266.57 L 97.56 254.74 L 87.44 248.18 L 99.41 246.72 Z" />
        <path d="M 114.00 295.00 L 118.11 306.34 L 130.17 306.75 L 120.66 314.16 L 123.99 325.75 L 114.00 319.00 L 104.01 325.75 L 107.34 314.16 L 97.83 306.75 L 109.89 306.34 Z" />
        <path d="M 148.95 351.26 L 151.04 363.14 L 162.83 365.63 L 152.18 371.29 L 153.45 383.28 L 144.78 374.89 L 133.77 379.81 L 139.07 368.97 L 130.99 360.02 L 142.93 361.71 Z" />
        <path d="M 396.95 175.26 L 399.04 187.14 L 410.83 189.63 L 400.18 195.29 L 401.45 207.28 L 392.78 198.89 L 381.77 203.81 L 387.07 192.97 L 378.99 184.02 L 390.93 185.71 Z" />
        <path d="M 409.48 235.06 L 412.59 246.72 L 424.56 248.18 L 414.44 254.74 L 416.76 266.57 L 407.39 258.97 L 396.85 264.83 L 401.18 253.57 L 392.35 245.36 L 404.39 246.00 Z" />
        <path d="M 398.00 295.00 L 402.11 306.34 L 414.17 306.75 L 404.66 314.16 L 407.99 325.75 L 398.00 319.00 L 388.01 325.75 L 391.34 314.16 L 381.83 306.75 L 393.89 306.34 Z" />
        <path d="M 363.05 351.26 L 369.07 361.71 L 381.01 360.02 L 372.93 368.97 L 378.23 379.81 L 367.22 374.89 L 358.55 383.28 L 359.82 371.29 L 349.17 365.63 L 360.96 363.14 Z" />
        <path d="M 256.00 370.00 L 262.47 387.10 L 280.73 387.97 L 266.46 399.40 L 271.28 417.03 L 256.00 407.00 L 240.72 417.03 L 245.54 399.40 L 231.27 387.97 L 249.53 387.10 Z" />
      </g>

      <text
        fontFamily="'Arial Black', 'Montserrat', 'Helvetica Neue', sans-serif"
        fontWeight="900"
        fontSize="28"
        fill="#FFFFFF"
        letterSpacing="6"
        textAnchor="middle"
        filter="url(#softGlowComp)"
      >
        <textPath href="#archDongkoComp" startOffset="50%">
          DONGKO
        </textPath>
      </text>
    </svg>
  );
};
