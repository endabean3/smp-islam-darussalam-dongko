const fs = require('fs');
const path = require('path');

// Helper to calculate 5-point star path
function createStarPath(cx, cy, outerRadius, innerRadius = outerRadius * 0.4, rotateDeg = 0) {
  let points = [];
  const angle = Math.PI / 5;
  const startAngle = (rotateDeg - 90) * (Math.PI / 180);
  
  for (let i = 0; i < 10; i++) {
    const r = (i % 2 === 0) ? outerRadius : innerRadius;
    const currAngle = startAngle + i * angle;
    const x = cx + r * Math.cos(currAngle);
    const y = cy + r * Math.sin(currAngle);
    points.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`);
  }
  points.push('Z');
  return points.join(' ');
}

// 1. MASTER LOGO SVG (512x512)
const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <!-- Gradients -->
    <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#169B4B" />
      <stop offset="50%" stop-color="#128A43" />
      <stop offset="100%" stop-color="#0A632E" />
    </linearGradient>

    <linearGradient id="shieldBorder" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0A4D23" />
      <stop offset="100%" stop-color="#042912" />
    </linearGradient>

    <radialGradient id="globeGrad" cx="50%" cy="40%" r="50%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="70%" stop-color="#E8F4EC" />
      <stop offset="100%" stop-color="#C5E2CF" />
    </radialGradient>

    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF066" />
      <stop offset="40%" stop-color="#FFCD00" />
      <stop offset="100%" stop-color="#E6A800" />
    </linearGradient>

    <!-- Drop Shadows & Filters -->
    <filter id="dropShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#000000" flood-opacity="0.35" />
    </filter>
    
    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000000" flood-opacity="0.2" />
    </filter>

    <!-- Text Paths -->
    <path id="archSmpIslam" d="M 125 106 Q 256 72 387 106" fill="none" />
    <path id="archDarussalam" d="M 105 142 Q 256 112 407 142" fill="none" />
    <path id="archDongko" d="M 160 442 Q 256 462 352 442" fill="none" />
  </defs>

  <!-- Outer Shield Border -->
  <path d="M 256 22 
           C 325 38, 400 24, 444 26
           C 424 125, 434 215, 452 285
           C 462 360, 360 460, 256 496
           C 152 460, 50 360, 60 285
           C 78 215, 88 125, 68 26
           C 112 24, 187 38, 256 22 Z"
        fill="url(#shieldBorder)" filter="url(#dropShadow)" />

  <!-- Inner Shield Body -->
  <path d="M 256 30 
           C 322 45, 394 32, 436 34
           C 418 128, 427 212, 444 280
           C 454 350, 354 446, 256 484
           C 158 446, 58 350, 68 280
           C 85 212, 94 128, 76 34
           C 118 32, 190 45, 256 30 Z"
        fill="url(#shieldGrad)" stroke="#0E5E2C" stroke-width="2" />

  <!-- Top Text: SMP ISLAM -->
  <text font-family="'Times New Roman', Times, 'Playfair Display', Georgia, serif" 
        font-weight="bold" font-size="25" fill="#FFFFFF" letter-spacing="2" text-anchor="middle">
    <textPath href="#archSmpIslam" startOffset="50%">SMP ISLAM</textPath>
  </text>

  <!-- Top Text: "DARUSSALAM" -->
  <text font-family="'Times New Roman', Times, 'Playfair Display', Georgia, serif" 
        font-weight="bold" font-size="27" fill="#FFFFFF" letter-spacing="1.5" text-anchor="middle">
    <textPath href="#archDarussalam" startOffset="50%">“DARUSSALAM”</textPath>
  </text>

  <!-- Center Globe Group -->
  <g transform="translate(0, 10)">
    <!-- Globe Base Circle -->
    <circle cx="256" cy="245" r="98" fill="url(#globeGrad)" stroke="#0C6E33" stroke-width="4" filter="url(#softGlow)" />
    
    <!-- Globe Clip for Grids -->
    <g>
      <clipPath id="globeClip">
        <circle cx="256" cy="245" r="96" />
      </clipPath>
      <g clip-path="url(#globeClip)" stroke="#128A43" stroke-width="1.8" fill="none" opacity="0.85">
        <!-- Equator -->
        <ellipse cx="256" cy="245" rx="96" ry="24" stroke-width="2.2" />
        
        <!-- Latitude Lines -->
        <ellipse cx="256" cy="215" rx="90" ry="18" />
        <ellipse cx="256" cy="185" rx="72" ry="14" />
        <ellipse cx="256" cy="275" rx="90" ry="18" />
        <ellipse cx="256" cy="305" rx="72" ry="14" />
        
        <!-- Longitude Curves -->
        <path d="M 256 149 L 256 341" stroke-width="2.2" />
        <path d="M 256 149 C 220 180, 220 310, 256 341" />
        <path d="M 256 149 C 185 180, 185 310, 256 341" />
        <path d="M 256 149 C 292 180, 292 310, 256 341" />
        <path d="M 256 149 C 327 180, 327 310, 256 341" />
      </g>
    </g>

    <!-- Globe Crescent Base Accent -->
    <path d="M 162 265 C 190 325, 322 325, 350 265 C 320 338, 192 338, 162 265 Z" fill="#0D6B33" opacity="0.6" />

    <!-- Center Emblem: IIK Symbol / Pillars & Book -->
    <!-- Stylized Columns / IIK Emblem above book -->
    <g transform="translate(256, 228)" filter="url(#softGlow)">
      <!-- Pillar 1 -->
      <rect x="-34" y="-38" width="10" height="30" rx="2" fill="#FFFFFF" stroke="#0E5E2C" stroke-width="1.5" />
      <!-- Pillar 2 -->
      <rect x="-18" y="-42" width="10" height="34" rx="2" fill="#FFFFFF" stroke="#0E5E2C" stroke-width="1.5" />
      <!-- Pillar 3 -->
      <rect x="-2" y="-42" width="10" height="34" rx="2" fill="#FFFFFF" stroke="#0E5E2C" stroke-width="1.5" />
      <!-- Diagonal Slash / K motif -->
      <path d="M 14 -44 L 28 -44 L 38 -20 L 26 -10 Z" fill="#FFFFFF" stroke="#0E5E2C" stroke-width="1.5" />
      <path d="M 14 -20 L 36 -42" stroke="#0E5E2C" stroke-width="3" stroke-linecap="round" />
    </g>

    <!-- Open Book (Al-Qur'an / Kitab) -->
    <g filter="url(#softGlow)">
      <!-- Book Shadow / Spine Base -->
      <path d="M 256 298 C 220 282, 172 284, 138 296 L 140 336 C 176 322, 220 320, 256 338 C 292 320, 336 322, 372 336 L 374 296 C 340 284, 292 282, 256 298 Z" 
            fill="#1E293B" />

      <!-- Left Page Surface -->
      <path d="M 256 293 C 220 276, 172 278, 140 290 L 143 328 C 177 314, 222 312, 256 330 Z" 
            fill="#FFFFFF" stroke="#1E293B" stroke-width="2.5" stroke-linejoin="round" />
      
      <!-- Right Page Surface -->
      <path d="M 256 293 C 292 276, 340 278, 372 290 L 369 328 C 335 314, 290 312, 256 330 Z" 
            fill="#FFFFFF" stroke="#1E293B" stroke-width="2.5" stroke-linejoin="round" />

      <!-- Center Spine Fold Line -->
      <path d="M 256 293 L 256 330" stroke="#1E293B" stroke-width="3" stroke-linecap="round" />

      <!-- Page Lines (Left Page) -->
      <path d="M 160 300 C 190 290, 225 292, 246 302" stroke="#94A3B8" stroke-width="1.5" fill="none" />
      <path d="M 163 310 C 192 300, 226 302, 246 312" stroke="#94A3B8" stroke-width="1.5" fill="none" />

      <!-- Page Lines (Right Page) -->
      <path d="M 352 300 C 322 290, 287 292, 266 302" stroke="#94A3B8" stroke-width="1.5" fill="none" />
      <path d="M 349 310 C 320 300, 286 302, 266 312" stroke="#94A3B8" stroke-width="1.5" fill="none" />
    </g>
  </g>

  <!-- 9 Stars Group (NU Emblem Arrangement) -->
  <g fill="url(#goldGrad)" stroke="#B38600" stroke-width="1" filter="url(#softGlow)">
    <!-- 4 Left Stars -->
    <path d="${createStarPath(118, 192, 17, 7, -10)}" />
    <path d="${createStarPath(104, 252, 17, 7, -5)}" />
    <path d="${createStarPath(114, 312, 17, 7, 0)}" />
    <path d="${createStarPath(146, 368, 17, 7, 10)}" />

    <!-- 4 Right Stars -->
    <path d="${createStarPath(394, 192, 17, 7, 10)}" />
    <path d="${createStarPath(408, 252, 17, 7, 5)}" />
    <path d="${createStarPath(398, 312, 17, 7, 0)}" />
    <path d="${createStarPath(366, 368, 17, 7, -10)}" />

    <!-- 1 Main Center Bottom Star (Larger) -->
    <path d="${createStarPath(256, 396, 26, 11, 0)}" />
  </g>

  <!-- Bottom Text: DONGKO -->
  <text font-family="'Arial Black', 'Montserrat', 'Helvetica Neue', sans-serif" 
        font-weight="900" font-size="28" fill="#FFFFFF" letter-spacing="6" text-anchor="middle" filter="url(#softGlow)">
    <textPath href="#archDongko" startOffset="50%">DONGKO</textPath>
  </text>
</svg>`;

// 2. FAVICON SVG (Lightweight, simplified, crisp at 16x16 / 32x32)
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="100%" height="100%">
  <defs>
    <linearGradient id="favGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#169B4B" />
      <stop offset="100%" stop-color="#0A632E" />
    </linearGradient>
  </defs>

  <!-- Shield Shape -->
  <path d="M 32 3 
           C 41 5, 50 3, 56 3 
           C 53 16, 55 27, 57 36 
           C 58 46, 45 59, 32 63 
           C 19 59, 6 46, 7 36 
           C 9 27, 11 16, 8 3 
           C 14 3, 23 5, 32 3 Z" 
        fill="url(#favGrad)" stroke="#042912" stroke-width="2" />

  <!-- Simplified Inner Globe Circle -->
  <circle cx="32" cy="30" r="14" fill="#FFFFFF" stroke="#0E5E2C" stroke-width="1.5" />
  
  <!-- Globe Equator & Line -->
  <ellipse cx="32" cy="30" rx="14" ry="4" fill="none" stroke="#128A43" stroke-width="1.2" />
  <line x1="32" y1="16" x2="32" y2="44" stroke="#128A43" stroke-width="1.2" />

  <!-- Center Open Book -->
  <path d="M 32 34 C 27 31, 22 32, 19 33 L 19 40 C 22 38, 27 38, 32 41 C 37 38, 42 38, 45 40 L 45 33 C 42 32, 37 31, 32 34 Z" 
        fill="#FFFFFF" stroke="#1E293B" stroke-width="1.5" stroke-linejoin="round" />

  <!-- Main Gold Star at Bottom -->
  <path d="${createStarPath(32, 51, 6, 2.5, 0)}" fill="#FFCD00" stroke="#B38600" stroke-width="0.5" />
</svg>`;

// 3. ICON SVG (Square app icon 512x512 with subtle rounded background container or badge)
const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F2818" />
      <stop offset="50%" stop-color="#081C10" />
      <stop offset="100%" stop-color="#040F08" />
    </linearGradient>
    <radialGradient id="glowBg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#169B4B" stop-opacity="0.25" />
      <stop offset="100%" stop-color="#169B4B" stop-opacity="0" />
    </radialGradient>
  </defs>

  <!-- Rounded App Tile Background -->
  <rect x="0" y="0" width="512" height="512" rx="108" fill="url(#bgGrad)" />
  <rect x="0" y="0" width="512" height="512" rx="108" fill="url(#glowBg)" />
  <rect x="2" y="2" width="508" height="508" rx="106" fill="none" stroke="#1D4D2C" stroke-width="4" opacity="0.6" />

  <!-- Embedded Logo in Center -->
  <g transform="translate(32, 24) scale(0.875)">
    ${logoSvg.replace(/<\/?svg[^>]*>/g, '')}
  </g>
</svg>`;

// 4. BANNER SVG (1200x630 Social / Header Banner)
const bannerSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="100%" height="100%">
  <defs>
    <linearGradient id="bannerBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#062413" />
      <stop offset="40%" stop-color="#0A381E" />
      <stop offset="100%" stop-color="#04180C" />
    </linearGradient>

    <radialGradient id="bannerGlow" cx="25%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#169B4B" stop-opacity="0.35" />
      <stop offset="100%" stop-color="#169B4B" stop-opacity="0" />
    </radialGradient>

    <pattern id="islamicPattern" width="60" height="60" patternUnits="userSpaceOnUse">
      <path d="M 30 0 L 60 30 L 30 60 L 0 30 Z" fill="none" stroke="#FFFFFF" stroke-width="1" opacity="0.03" />
      <circle cx="30" cy="30" r="12" fill="none" stroke="#FFFFFF" stroke-width="1" opacity="0.03" />
    </pattern>

    <filter id="bannerShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.5" />
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bannerBg)" />
  <rect width="1200" height="630" fill="url(#bannerGlow)" />
  <rect width="1200" height="630" fill="url(#islamicPattern)" />

  <!-- Gold Decorative Border Lines -->
  <rect x="30" y="30" width="1140" height="570" rx="16" fill="none" stroke="#FFCD00" stroke-width="2" opacity="0.35" />
  <rect x="40" y="40" width="1120" height="550" rx="12" fill="none" stroke="#169B4B" stroke-width="1" opacity="0.5" />

  <!-- Corner Accents -->
  <g stroke="#FFCD00" stroke-width="3" fill="none" opacity="0.6">
    <path d="M 30 60 L 60 60 L 60 30" />
    <path d="M 1170 60 L 1140 60 L 1140 30" />
    <path d="M 30 570 L 60 570 L 60 600" />
    <path d="M 1170 570 L 1140 570 L 1140 600" />
  </g>

  <!-- Left: Logo Element -->
  <g transform="translate(80, 95) scale(0.88)" filter="url(#bannerShadow)">
    ${logoSvg.replace(/<\/?svg[^>]*>/g, '')}
  </g>

  <!-- Right: School Typography & Info -->
  <g transform="translate(560, 180)">
    <!-- Kicker Badge -->
    <rect x="0" y="0" width="340" height="36" rx="18" fill="#169B4B" opacity="0.25" stroke="#169B4B" stroke-width="1" />
    <text x="18" y="23" font-family="system-ui, -apple-system, sans-serif" font-weight="600" font-size="14" fill="#6EE7B7" letter-spacing="1.5">
      YAYASAN PP SALAFIYAH DARUSSALAM
    </text>

    <!-- Main Title -->
    <text x="0" y="100" font-family="'Times New Roman', Georgia, serif" font-weight="bold" font-size="52" fill="#FFFFFF" letter-spacing="1">
      SMP ISLAM
    </text>
    <text x="0" y="162" font-family="'Times New Roman', Georgia, serif" font-weight="bold" font-size="56" fill="#FFCD00" letter-spacing="2">
      DARUSSALAM
    </text>

    <!-- Subtitle Location -->
    <text x="0" y="215" font-family="system-ui, -apple-system, sans-serif" font-weight="500" font-size="24" fill="#A7F3D0" letter-spacing="2">
      DONGKO • TRENGGALEK
    </text>

    <!-- Divider Line -->
    <line x1="0" y1="245" x2="520" y2="245" stroke="#FFCD00" stroke-width="2" opacity="0.4" />

    <!-- Tagline & Metadata -->
    <text x="0" y="285" font-family="system-ui, -apple-system, sans-serif" font-style="italic" font-size="20" fill="#E2E8F0">
      “Tumbuh dalam ilmu, teguh dalam akhlak.”
    </text>
    <text x="0" y="325" font-family="system-ui, -apple-system, sans-serif" font-weight="600" font-size="16" fill="#94A3B8" letter-spacing="1">
      NPSN: 20574648 • STATUS: AKREDITASI B
    </text>
  </g>
</svg>`;

// Write output SVG files to packages/ui-components/src/brand/schools
const targetDirs = [
  path.resolve(__dirname)
];

targetDirs.forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'smp-islam-darussalam-dongko.svg'), logoSvg);
  fs.writeFileSync(path.join(dir, 'logo.svg'), logoSvg);
  fs.writeFileSync(path.join(dir, 'icon.svg'), iconSvg);
  fs.writeFileSync(path.join(dir, 'favicon.svg'), faviconSvg);
  fs.writeFileSync(path.join(dir, 'banner.svg'), bannerSvg);
});

console.log('Successfully generated clean SVG brand assets!');
