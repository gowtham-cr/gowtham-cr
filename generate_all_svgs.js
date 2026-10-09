// generate_all_svgs.js
const fs = require('fs');
const path = require('path');
const icons = require('./svg_icons');

const idBase64 = fs.readFileSync('id.png').toString('base64');
const rightPointingBase64 = fs.readFileSync('right_pointing.png').toString('base64');

console.log('Read base64 pngs successfully.');

// Common shared CSS animation block
const sharedAnimationStyles = `
    /* Deep Futuristic Keyframes */
    @keyframes pulseGlow {
      0%, 100% { opacity: 0.45; filter: drop-shadow(0 0 10px rgba(36,123,255,0.4)); }
      50% { opacity: 0.95; filter: drop-shadow(0 0 24px rgba(36,123,255,0.85)); }
    }
    @keyframes crimsonPulse {
      0%, 100% { opacity: 0.4; }
      50% { opacity: 0.85; filter: drop-shadow(0 0 16px rgba(255,53,79,0.8)); }
    }
    @keyframes subtleFloat {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-6px); }
    }
    @keyframes scanline {
      0% { transform: translateY(0px); opacity: 0; }
      15% { opacity: 0.7; }
      85% { opacity: 0.7; }
      100% { transform: translateY(460px); opacity: 0; }
    }
    @keyframes ringSpinCW {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes ringSpinCCW {
      from { transform: rotate(360deg); }
      to { transform: rotate(0deg); }
    }
    @keyframes orbitSpin1 {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes orbitCounterSpin1 {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(-360deg); }
    }
    @keyframes orbitSpin2 {
      0% { transform: rotate(360deg); }
      100% { transform: rotate(0deg); }
    }
    @keyframes orbitCounterSpin2 {
      0% { transform: rotate(-360deg); }
      100% { transform: rotate(0deg); }
    }
    @keyframes orbitSpin3 {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes orbitCounterSpin3 {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(-360deg); }
    }
    @keyframes idSwing {
      0% { transform: rotate(-6deg); }
      15% { transform: rotate(5deg); }
      30% { transform: rotate(-3.5deg); }
      45% { transform: rotate(2.2deg); }
      60% { transform: rotate(-1.7deg); }
      75% { transform: rotate(1.7deg); }
      90% { transform: rotate(-1.7deg); }
      100% { transform: rotate(1.7deg); }
    }
    @keyframes foilSweep {
      0% { transform: translateX(-180%) skewX(-20deg); opacity: 0; }
      20% { opacity: 0.45; }
      40% { transform: translateX(250%) skewX(-20deg); opacity: 0; }
      100% { transform: translateX(250%) skewX(-20deg); opacity: 0; }
    }
    @keyframes pointPulse {
      0%, 100% { transform: translateX(0px); }
      50% { transform: translateX(8px); }
    }
    @keyframes radarSweep {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @media (prefers-reduced-motion: reduce) {
      *, ::before, ::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
      }
    }
`;

// Helper: Grid & Background Filter Definitions
const sharedDefs = `
    <!-- Gradients -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#050811"/>
      <stop offset="50%" stop-color="#070b16"/>
      <stop offset="100%" stop-color="#0b1329"/>
    </linearGradient>

    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#101935" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="#090e1f" stop-opacity="0.9"/>
    </linearGradient>

    <linearGradient id="glassBorder" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#247bff" stop-opacity="0.6"/>
      <stop offset="50%" stop-color="#ffffff" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#ff354f" stop-opacity="0.5"/>
    </linearGradient>

    <linearGradient id="blueGlowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#247bff"/>
      <stop offset="100%" stop-color="#60a5fa"/>
    </linearGradient>

    <linearGradient id="crimsonGlowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ff354f"/>
      <stop offset="100%" stop-color="#ff7b91"/>
    </linearGradient>

    <!-- Filters -->
    <filter id="glowBlue" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>

    <filter id="glowCrimson" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="7" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>

    <filter id="cardShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000000" flood-opacity="0.6"/>
    </filter>

    <!-- Grid Pattern -->
    <pattern id="futuristicGrid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#247bff" stroke-width="0.75" stroke-opacity="0.12"/>
      <circle cx="40" cy="0" r="1.2" fill="#247bff" fill-opacity="0.25"/>
    </pattern>

    <pattern id="dotPattern" width="20" height="20" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1" fill="#f5f7ff" fill-opacity="0.08"/>
    </pattern>
`;

// Helper: Common Card Component
function hudCard(x, y, w, h, rx = 16, stroke = "url(#glassBorder)") {
  return `
    <g class="hud-panel">
      <!-- Glow Underlay -->
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="#0d1630" fill-opacity="0.5" filter="url(#cardShadow)"/>
      <!-- Main Glass Body -->
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="url(#cardGrad)" stroke="${stroke}" stroke-width="1.2"/>
      <!-- HUD Corner Accents -->
      <path d="M ${x} ${y + 16} L ${x} ${y} L ${x + 16} ${y}" fill="none" stroke="#247bff" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M ${x + w - 16} ${y} L ${x + w} ${y} L ${x + w} ${y + 16}" fill="none" stroke="#247bff" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M ${x} ${y + h - 16} L ${x} ${y + h} L ${x + 16} ${y + h}" fill="none" stroke="#ff354f" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M ${x + w - 16} ${y + h} L ${x + w} ${y + h} L ${x + w} ${y + h - 16}" fill="none" stroke="#247bff" stroke-width="2.5" stroke-linecap="round"/>
    </g>
  `;
}

// Helper: Section Header
function sectionHeader(eyebrow, title, subtitle) {
  const clean = (s) => (s ? s.replace(/&amp;AMP;/g, '&amp;').replace(/&AMP;/g, '&amp;').replace(/&amp;/g, '&').replace(/&/g, '&amp;').replace(/'/g, '&apos;') : '');
  const eyebrowClean = clean((eyebrow || '').toUpperCase()).replace(/&AMP;/gi, '&amp;');
  const titleClean = clean(title || '').replace(/&AMP;/gi, '&amp;');
  const subtitleClean = clean(subtitle || '').replace(/&AMP;/gi, '&amp;');
  return `
    <g transform="translate(60, 50)">
      <rect x="0" y="0" width="8" height="38" rx="4" fill="#ff354f"/>
      <rect x="0" y="0" width="8" height="38" rx="4" fill="#247bff" opacity="0.6" filter="url(#glowBlue)"/>
      <text x="24" y="14" fill="#247bff" font-size="12" font-weight="700" letter-spacing="3" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">${eyebrowClean}</text>
      <text x="24" y="38" fill="#f5f7ff" font-size="28" font-weight="800" letter-spacing="1" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">${titleClean}</text>
      ${subtitleClean ? `<text x="24" y="60" fill="#8c9dbd" font-size="13" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">${subtitleClean}</text>` : ''}
    </g>
  `;
}

// ==========================================
// 1. HERO SVG (Enhanced Bold Display Typography & Rotating Portrait Orbits)
// ==========================================
function buildHero() {
  const width = 1000;
  const height = 540;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="100%">
  <defs>
    ${sharedDefs}
    <style>
      ${sharedAnimationStyles}
      @keyframes heroRole1 {
        0%, 20% { opacity: 1; transform: translateY(0); }
        25%, 95% { opacity: 0; transform: translateY(-16px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      @keyframes heroRole2 {
        0%, 20% { opacity: 0; transform: translateY(16px); }
        25%, 45% { opacity: 1; transform: translateY(0); }
        50%, 100% { opacity: 0; transform: translateY(-16px); }
      }
      @keyframes heroRole3 {
        0%, 45% { opacity: 0; transform: translateY(16px); }
        50%, 70% { opacity: 1; transform: translateY(0); }
        75%, 100% { opacity: 0; transform: translateY(-16px); }
      }
      @keyframes heroRole4 {
        0%, 70% { opacity: 0; transform: translateY(16px); }
        75%, 95% { opacity: 1; transform: translateY(0); }
        100% { opacity: 0; transform: translateY(-16px); }
      }
      .role-text-1 { animation: heroRole1 12s infinite; }
      .role-text-2 { animation: heroRole2 12s infinite; }
      .role-text-3 { animation: heroRole3 12s infinite; }
      .role-text-4 { animation: heroRole4 12s infinite; }
      .pulse-radar { animation: pulseGlow 3s infinite ease-in-out; }
      .hero-portrait-frame { animation: subtleFloat 6s infinite ease-in-out; }
      .portrait-orbit-cw {
        transform-origin: 785px 275px;
        animation: ringSpinCW 20s infinite linear;
      }
      .portrait-orbit-ccw {
        transform-origin: 785px 275px;
        animation: ringSpinCCW 28s infinite linear;
      }
    </style>
    <linearGradient id="portraitBorder" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#247bff"/>
      <stop offset="50%" stop-color="#ff354f"/>
      <stop offset="100%" stop-color="#247bff"/>
    </linearGradient>
    <clipPath id="heroPortraitClip">
      <rect x="630" y="80" width="310" height="390" rx="28"/>
    </clipPath>
  </defs>

  <!-- Background Base & Depth Grid -->
  <rect width="${width}" height="${height}" fill="url(#bgGrad)"/>
  <rect width="${width}" height="${height}" fill="url(#futuristicGrid)"/>

  <!-- Perspective 3D Grid Plane at Bottom -->
  <g opacity="0.45">
    <line x1="0" y1="460" x2="1000" y2="460" stroke="#247bff" stroke-width="1.5"/>
    <line x1="0" y1="485" x2="1000" y2="485" stroke="#247bff" stroke-width="1"/>
    <line x1="0" y1="515" x2="1000" y2="515" stroke="#247bff" stroke-width="0.8"/>
    <!-- Perspective convergence lines -->
    <line x1="500" y1="420" x2="0" y2="540" stroke="#247bff" stroke-width="0.8" stroke-dasharray="4,4"/>
    <line x1="500" y1="420" x2="200" y2="540" stroke="#247bff" stroke-width="0.8" stroke-dasharray="4,4"/>
    <line x1="500" y1="420" x2="400" y2="540" stroke="#247bff" stroke-width="0.8" stroke-dasharray="4,4"/>
    <line x1="500" y1="420" x2="600" y2="540" stroke="#247bff" stroke-width="0.8" stroke-dasharray="4,4"/>
    <line x1="500" y1="420" x2="800" y2="540" stroke="#247bff" stroke-width="0.8" stroke-dasharray="4,4"/>
    <line x1="500" y1="420" x2="1000" y2="540" stroke="#247bff" stroke-width="0.8" stroke-dasharray="4,4"/>
  </g>

  <!-- Ambient Cinematic Spotlights -->
  <circle cx="220" cy="180" r="180" fill="#247bff" opacity="0.12" filter="url(#glowBlue)"/>
  <circle cx="780" cy="270" r="220" fill="#ff354f" opacity="0.12" filter="url(#glowCrimson)"/>

  <!-- Top Status Bar HUD -->
  <g transform="translate(60, 40)">
    <rect x="0" y="0" width="160" height="28" rx="14" fill="#101935" stroke="#247bff" stroke-width="1" opacity="0.9"/>
    <circle cx="16" cy="14" r="5" fill="#00e676" class="pulse-radar"/>
    <text x="30" y="19" fill="#00e676" font-size="11" font-weight="700" letter-spacing="1.5" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">SYSTEM ACTIVE</text>

    <!-- Node status -->
    <rect x="175" y="0" width="140" height="28" rx="14" fill="#101935" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
    <text x="190" y="18" fill="#8c9dbd" font-size="11" font-weight="600" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">LOC // BENGALURU, IN</text>
  </g>

  <!-- Left Main Content Area -->
  <g transform="translate(60, 115)">
    <!-- Subtitle Greeting -->
    <g transform="translate(0, 0)">
      <rect x="0" y="0" width="115" height="24" rx="4" fill="#247bff" opacity="0.18"/>
      <text x="10" y="16" fill="#247bff" font-size="12" font-weight="800" letter-spacing="3" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">HELLO, I&apos;M</text>
    </g>

    <!-- Hero Bold Display Name with 3D Depth & Glow -->
    <text x="0" y="66" fill="#f5f7ff" font-size="54" font-weight="900" letter-spacing="3" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
      GOWTHAM <tspan fill="#247bff" filter="url(#glowBlue)">R</tspan>
    </text>

    <!-- Ambient name glow underline -->
    <rect x="0" y="82" width="340" height="3.5" rx="1.75" fill="url(#blueGlowGrad)"/>
    <rect x="345" y="82" width="20" height="3.5" rx="1.75" fill="#ff354f"/>

    <!-- Dynamic Animated Cycling Role HUD Box -->
    <g transform="translate(0, 105)">
      <rect x="0" y="0" width="510" height="48" rx="12" fill="#0c142b" stroke="#247bff" stroke-width="1.2" opacity="0.95"/>
      <path d="M 0 14 L 0 0 L 14 0" fill="none" stroke="#ff354f" stroke-width="2.5"/>
      <path d="M 496 48 L 510 48 L 510 34" fill="none" stroke="#247bff" stroke-width="2.5"/>
      
      <!-- Role Label Prefix -->
      <text x="18" y="30" fill="#ff354f" font-size="14" font-weight="900" letter-spacing="1.5" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">&gt;</text>
      
      <!-- 4 Cycling Roles -->
      <g transform="translate(42, 30)">
        <text class="role-text-1" x="0" y="0" fill="#f5f7ff" font-size="16" font-weight="700" letter-spacing="1" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
          Java Full Stack Developer
        </text>
        <text class="role-text-2" x="0" y="0" fill="#60a5fa" font-size="16" font-weight="700" letter-spacing="1" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
          AI/ML Enthusiast
        </text>
        <text class="role-text-3" x="0" y="0" fill="#ff7b91" font-size="16" font-weight="700" letter-spacing="1" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
          Computer Vision Developer
        </text>
        <text class="role-text-4" x="0" y="0" fill="#f5f7ff" font-size="16" font-weight="700" letter-spacing="1" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
          Hackathon Builder
        </text>
      </g>
    </g>

    <!-- Professional Pitch -->
    <g transform="translate(0, 185)">
      <rect x="0" y="0" width="510" height="68" rx="12" fill="#101935" fill-opacity="0.6" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
      <text x="20" y="28" fill="#c4d1eb" font-size="13.5" font-weight="500" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
        &quot;I build practical full-stack applications and AI-powered solutions
      </text>
      <text x="20" y="49" fill="#c4d1eb" font-size="13.5" font-weight="500" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
        while continuously improving my software engineering and problem-solving skills.&quot;
      </text>
    </g>

    <!-- Info Matrix Badges (Education, Sem, Focus) -->
    <g transform="translate(0, 275)">
      <!-- Badge 1: Education -->
      <rect x="0" y="0" width="248" height="65" rx="12" fill="#0d152d" stroke="rgba(36,123,255,0.3)" stroke-width="1"/>
      <circle cx="24" cy="24" r="10" fill="#247bff" opacity="0.2"/>
      <text x="20" y="28" fill="#247bff" font-size="12" font-weight="800">🎓</text>
      <text x="44" y="24" fill="#8c9dbd" font-size="11" font-weight="600" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">B.E. ISE • 5TH SEMESTER</text>
      <text x="18" y="48" fill="#f5f7ff" font-size="12" font-weight="700" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">AMC Engineering College</text>

      <!-- Badge 2: GitHub Identity -->
      <rect x="262" y="0" width="248" height="65" rx="12" fill="#0d152d" stroke="rgba(255,53,79,0.3)" stroke-width="1"/>
      <circle cx="286" cy="24" r="10" fill="#ff354f" opacity="0.2"/>
      <text x="281" y="28" fill="#ff354f" font-size="12" font-weight="800">⚡</text>
      <text x="306" y="24" fill="#8c9dbd" font-size="11" font-weight="600" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">GITHUB REPOSITORY</text>
      <text x="280" y="48" fill="#f5f7ff" font-size="12" font-weight="700" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">github.com/gowtham-cr</text>
    </g>
  </g>

  <!-- Right Character Portrait (Using id.png) with Rotating Orbit Rings & Electric/Crimson Rim -->
  <g class="hero-portrait-frame">
    <!-- Rotating Ambient Orbit Rings around Portrait -->
    <g class="portrait-orbit-cw">
      <ellipse cx="785" cy="275" rx="215" ry="215" fill="none" stroke="#247bff" stroke-width="1.2" stroke-dasharray="14,10,4,10" opacity="0.55"/>
      <circle cx="1000" cy="275" r="4" fill="#247bff" filter="url(#glowBlue)"/>
      <circle cx="570" cy="275" r="3" fill="#60a5fa"/>
    </g>
    <g class="portrait-orbit-ccw">
      <ellipse cx="785" cy="275" rx="232" ry="232" fill="none" stroke="#ff354f" stroke-width="1" stroke-dasharray="8,12" opacity="0.45"/>
      <circle cx="785" cy="43" r="3.5" fill="#ff354f" filter="url(#glowCrimson)"/>
      <circle cx="785" cy="507" r="3" fill="#ff7b91"/>
    </g>

    <!-- Backing 3D Frame Outer Glow -->
    <rect x="625" y="75" width="320" height="400" rx="30" fill="none" stroke="url(#portraitBorder)" stroke-width="2.5" opacity="0.9" filter="url(#glowBlue)"/>
    <rect x="628" y="78" width="314" height="394" rx="28" fill="#091024" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>

    <!-- HUD Brackets on Portrait -->
    <path d="M 615 105 L 615 65 L 655 65" fill="none" stroke="#247bff" stroke-width="3" stroke-linecap="round"/>
    <path d="M 955 105 L 955 65 L 915 65" fill="none" stroke="#247bff" stroke-width="3" stroke-linecap="round"/>
    <path d="M 615 445 L 615 485 L 655 485" fill="none" stroke="#ff354f" stroke-width="3" stroke-linecap="round"/>
    <path d="M 955 445 L 955 485 L 915 485" fill="none" stroke="#247bff" stroke-width="3" stroke-linecap="round"/>

    <!-- Embedded Character Image -->
    <g clip-path="url(#heroPortraitClip)">
      <image href="data:image/png;base64,${idBase64}" x="620" y="70" width="330" height="405" preserveAspectRatio="xMidYMid slice"/>
      <!-- Soft bottom gradient overlay for cinematic integration -->
      <rect x="630" y="380" width="310" height="90" fill="url(#bgGrad)" opacity="0.75"/>
    </g>

    <!-- Scanline Hologram Effect overlay -->
    <line x1="630" y1="80" x2="940" y2="80" stroke="#247bff" stroke-width="2" opacity="0.6" style="animation: scanline 4s infinite linear;"/>

    <!-- Floating HUD Tag on Portrait Bottom -->
    <g transform="translate(645, 435)">
      <rect x="0" y="0" width="280" height="30" rx="8" fill="#070b16" fill-opacity="0.9" stroke="#247bff" stroke-width="1"/>
      <circle cx="16" cy="15" r="4" fill="#247bff" class="pulse-radar"/>
      <text x="28" y="20" fill="#f5f7ff" font-size="11" font-weight="700" letter-spacing="1" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">VERIFIED DEVELOPER ID // CR-2026</text>
    </g>
  </g>
</svg>`;
}

// ==========================================
// 2. ABOUT & LIFE SVG
// ==========================================
function buildAboutLife() {
  const width = 1000;
  const height = 580;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="100%">
  <defs>
    ${sharedDefs}
    <style>
      ${sharedAnimationStyles}
      @keyframes cSlide1 {
        0%, 30% { opacity: 1; transform: scale(1); visibility: visible; }
        33.3%, 96.6% { opacity: 0; transform: scale(0.97); visibility: hidden; }
        100% { opacity: 1; transform: scale(1); visibility: visible; }
      }
      @keyframes cSlide2 {
        0%, 30% { opacity: 0; transform: scale(0.97); visibility: hidden; }
        33.3%, 63.3% { opacity: 1; transform: scale(1); visibility: visible; }
        66.6%, 100% { opacity: 0; transform: scale(0.97); visibility: hidden; }
      }
      @keyframes cSlide3 {
        0%, 63.3% { opacity: 0; transform: scale(0.97); visibility: hidden; }
        66.6%, 96.6% { opacity: 1; transform: scale(1); visibility: visible; }
        100% { opacity: 0; transform: scale(0.97); visibility: hidden; }
      }
      @keyframes pBar1 {
        0% { width: 0px; }
        30% { width: 92px; }
        33.3%, 100% { width: 0px; }
      }
      @keyframes pBar2 {
        0%, 33.3% { width: 0px; }
        63.3% { width: 92px; }
        66.6%, 100% { width: 0px; }
      }
      @keyframes pBar3 {
        0%, 66.6% { width: 0px; }
        96.6% { width: 92px; }
        100% { width: 0px; }
      }
      .slide-1 { animation: cSlide1 12s infinite ease-in-out; }
      .slide-2 { animation: cSlide2 12s infinite ease-in-out; }
      .slide-3 { animation: cSlide3 12s infinite ease-in-out; }
      .pbar-1 { animation: pBar1 12s infinite linear; }
      .pbar-2 { animation: pBar2 12s infinite linear; }
      .pbar-3 { animation: pBar3 12s infinite linear; }
    </style>
  </defs>

  <rect width="${width}" height="${height}" fill="url(#bgGrad)"/>
  <rect width="${width}" height="${height}" fill="url(#futuristicGrid)"/>

  ${sectionHeader("Intelligence &amp; Profile", "ABOUT ME &amp; FOCUS", "Information Science &amp; Engineering • AMC Engineering College, Bengaluru")}

  <!-- Content Split Layout -->
  <!-- Left Side: Core Areas & Engineering Capabilities (480px width) -->
  <g transform="translate(60, 130)">
    ${hudCard(0, 0, 480, 410, 18)}
    
    <g transform="translate(30, 36)">
      <text x="0" y="0" fill="#247bff" font-size="12" font-weight="800" letter-spacing="2" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">CORE PILLARS</text>
      <text x="0" y="24" fill="#f5f7ff" font-size="20" font-weight="800" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">Engineering Capabilities</text>
      <text x="0" y="52" fill="#9cb0cf" font-size="13" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">Specialized domains engineered through coursework, hackathons &amp; projects:</text>

      <!-- Pill Grid -->
      <g transform="translate(0, 75)">
        <!-- Row 1 -->
        <g transform="translate(0, 0)">
          <rect x="0" y="0" width="200" height="34" rx="8" fill="#141f3d" stroke="#247bff" stroke-width="1"/>
          <text x="14" y="22" fill="#f5f7ff" font-size="12" font-weight="600" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">Java Full Stack Dev</text>
        </g>
        <g transform="translate(210, 0)">
          <rect x="0" y="0" width="200" height="34" rx="8" fill="#141f3d" stroke="#247bff" stroke-width="1"/>
          <text x="14" y="22" fill="#f5f7ff" font-size="12" font-weight="600" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">Spring Boot &amp; React</text>
        </g>

        <!-- Row 2 -->
        <g transform="translate(0, 44)">
          <rect x="0" y="0" width="200" height="34" rx="8" fill="#141f3d" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
          <text x="14" y="22" fill="#f5f7ff" font-size="12" font-weight="600" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">Node.js &amp; Express.js</text>
        </g>
        <g transform="translate(210, 44)">
          <rect x="0" y="0" width="200" height="34" rx="8" fill="#141f3d" stroke="#ff354f" stroke-width="1"/>
          <text x="14" y="22" fill="#ff7b91" font-size="12" font-weight="600" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">AI/ML &amp; Deep Learning</text>
        </g>

        <!-- Row 3 -->
        <g transform="translate(0, 88)">
          <rect x="0" y="0" width="200" height="34" rx="8" fill="#141f3d" stroke="#ff354f" stroke-width="1"/>
          <text x="14" y="22" fill="#ff7b91" font-size="12" font-weight="600" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">Computer Vision / YOLO</text>
        </g>
        <g transform="translate(210, 88)">
          <rect x="0" y="0" width="200" height="34" rx="8" fill="#141f3d" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
          <text x="14" y="22" fill="#f5f7ff" font-size="12" font-weight="600" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">OpenCV &amp; FastAPI</text>
        </g>

        <!-- Row 4 -->
        <g transform="translate(0, 132)">
          <rect x="0" y="0" width="200" height="34" rx="8" fill="#141f3d" stroke="#247bff" stroke-width="1"/>
          <text x="14" y="22" fill="#60a5fa" font-size="12" font-weight="600" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">DSA &amp; Problem Solving</text>
        </g>
        <g transform="translate(210, 132)">
          <rect x="0" y="0" width="200" height="34" rx="8" fill="#141f3d" stroke="#247bff" stroke-width="1"/>
          <text x="14" y="22" fill="#60a5fa" font-size="12" font-weight="600" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">Hackathon Prototyping</text>
        </g>
      </g>

      <!-- Mini Telemetry footer inside card -->
      <g transform="translate(0, 275)">
        <rect x="0" y="0" width="418" height="42" rx="10" fill="#080e21" stroke="rgba(36,123,255,0.2)" stroke-width="1"/>
        <text x="16" y="26" fill="#8c9dbd" font-size="12" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">ACADEMIC // <tspan fill="#f5f7ff" font-weight="700">5th Semester B.E. (ISE)</tspan></text>
        <text x="280" y="26" fill="#8c9dbd" font-size="12" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">STATUS // <tspan fill="#00e676" font-weight="700">ACTIVE</tspan></text>
      </g>
    </g>
  </g>

  <!-- Right Side: 3-Slide Interests Carousel (380px width) -->
  <g transform="translate(560, 130)">
    ${hudCard(0, 0, 380, 410, 18, "url(#glassBorder)")}

    <g transform="translate(25, 28)">
      <!-- Carousel Title & Header -->
      <text x="0" y="0" fill="#ff354f" font-size="12" font-weight="800" letter-spacing="2" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">DYNAMIC RADAR</text>
      <text x="0" y="24" fill="#f5f7ff" font-size="19" font-weight="800" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">Interests &amp; Drive</text>

      <!-- Progress Indicators (3 Bars) -->
      <g transform="translate(0, 42)">
        <!-- Bar 1 -->
        <g transform="translate(0, 0)">
          <rect x="0" y="0" width="102" height="5" rx="2.5" fill="#1b284e"/>
          <rect class="pbar-1" x="0" y="0" width="0" height="5" rx="2.5" fill="#247bff"/>
          <text x="0" y="18" fill="#8c9dbd" font-size="10" font-weight="700">01 BUILD</text>
        </g>
        <!-- Bar 2 -->
        <g transform="translate(112, 0)">
          <rect x="0" y="0" width="102" height="5" rx="2.5" fill="#1b284e"/>
          <rect class="pbar-2" x="0" y="0" width="0" height="5" rx="2.5" fill="#247bff"/>
          <text x="0" y="18" fill="#8c9dbd" font-size="10" font-weight="700">02 LEARN</text>
        </g>
        <!-- Bar 3 -->
        <g transform="translate(224, 0)">
          <rect x="0" y="0" width="102" height="5" rx="2.5" fill="#1b284e"/>
          <rect class="pbar-3" x="0" y="0" width="0" height="5" rx="2.5" fill="#ff354f"/>
          <text x="0" y="18" fill="#8c9dbd" font-size="10" font-weight="700">03 CREATE</text>
        </g>
      </g>

      <!-- Slides Container -->
      <g transform="translate(0, 85)">
        <!-- SLIDE 1: BUILD -->
        <g class="slide-1">
          <rect x="0" y="0" width="330" height="235" rx="14" fill="#0b1329" stroke="#247bff" stroke-width="1.2"/>
          <circle cx="45" cy="45" r="24" fill="#247bff" opacity="0.15"/>
          <text x="35" y="52" fill="#247bff" font-size="22">⚡</text>
          
          <text x="82" y="42" fill="#247bff" font-size="12" font-weight="800" letter-spacing="1.5">SLIDE 01 // FOCUS</text>
          <text x="82" y="62" fill="#f5f7ff" font-size="22" font-weight="800">BUILD</text>

          <g transform="translate(25, 100)">
            <text x="0" y="0" fill="#60a5fa" font-size="14" font-weight="700">● Full Stack Development</text>
            <text x="0" y="20" fill="#8c9dbd" font-size="12">Production-ready architectures with Java &amp; Node.</text>

            <text x="0" y="52" fill="#60a5fa" font-size="14" font-weight="700">● AI / Machine Learning</text>
            <text x="0" y="72" fill="#8c9dbd" font-size="12">Intelligent prediction engines &amp; analytics.</text>

            <text x="0" y="104" fill="#60a5fa" font-size="14" font-weight="700">● Computer Vision</text>
            <text x="0" y="124" fill="#8c9dbd" font-size="12">Real-time object detection using YOLO &amp; OpenCV.</text>
          </g>
        </g>

        <!-- SLIDE 2: LEARN -->
        <g class="slide-2">
          <rect x="0" y="0" width="330" height="235" rx="14" fill="#0b1329" stroke="#247bff" stroke-width="1.2"/>
          <circle cx="45" cy="45" r="24" fill="#247bff" opacity="0.15"/>
          <text x="35" y="52" fill="#247bff" font-size="22">🧠</text>
          
          <text x="82" y="42" fill="#247bff" font-size="12" font-weight="800" letter-spacing="1.5">SLIDE 02 // GROWTH</text>
          <text x="82" y="62" fill="#f5f7ff" font-size="22" font-weight="800">LEARN</text>

          <g transform="translate(25, 100)">
            <text x="0" y="0" fill="#60a5fa" font-size="14" font-weight="700">● Data Structures &amp; Algorithms</text>
            <text x="0" y="20" fill="#8c9dbd" font-size="12">Active problem solving on LeetCode &amp; Java.</text>

            <text x="0" y="52" fill="#60a5fa" font-size="14" font-weight="700">● New Technologies</text>
            <text x="0" y="72" fill="#8c9dbd" font-size="12">Fast adoption of modern frameworks &amp; tools.</text>

            <text x="0" y="104" fill="#60a5fa" font-size="14" font-weight="700">● System Building</text>
            <text x="0" y="124" fill="#8c9dbd" font-size="12">Scalable backend microservices and database design.</text>
          </g>
        </g>

        <!-- SLIDE 3: CREATE -->
        <g class="slide-3">
          <rect x="0" y="0" width="330" height="235" rx="14" fill="#0b1329" stroke="#ff354f" stroke-width="1.2"/>
          <circle cx="45" cy="45" r="24" fill="#ff354f" opacity="0.15"/>
          <text x="35" y="52" fill="#ff354f" font-size="22">🚀</text>
          
          <text x="82" y="42" fill="#ff354f" font-size="12" font-weight="800" letter-spacing="1.5">SLIDE 03 // ACTION</text>
          <text x="82" y="62" fill="#f5f7ff" font-size="22" font-weight="800">CREATE</text>

          <g transform="translate(25, 100)">
            <text x="0" y="0" fill="#ff7b91" font-size="14" font-weight="700">● Hackathons</text>
            <text x="0" y="20" fill="#8c9dbd" font-size="12">High-intensity 24h sprinting &amp; prototype delivery.</text>

            <text x="0" y="52" fill="#ff7b91" font-size="14" font-weight="700">● Real-World Projects</text>
            <text x="0" y="72" fill="#8c9dbd" font-size="12">Deploying practical applications for users.</text>

            <text x="0" y="104" fill="#ff7b91" font-size="14" font-weight="700">● AI-Powered Solutions</text>
            <text x="0" y="124" fill="#8c9dbd" font-size="12">Empowering automation through intelligent models.</text>
          </g>
        </g>
      </g>
    </g>
  </g>
</svg>`;
}

// ==========================================
// 3. TECH STACK (ACTIVELY ROTATING 3D ORBIT SYSTEM)
// ==========================================
function buildStack() {
  const width = 1000;
  const height = 640;

  // Orbit node builder with counter-rotation to keep icons & text upright while orbiting
  function rotatingOrbitNode(name, iconSvg, x, y, counterAnimClass, color = "#247bff") {
    return `
      <g transform="translate(${x}, ${y})">
        <g class="${counterAnimClass}">
          <rect x="-60" y="-18" width="120" height="36" rx="10" fill="#0c142b" stroke="${color}" stroke-width="1.2" opacity="0.95" filter="url(#cardShadow)"/>
          <g transform="translate(-48, -11) scale(0.92)">
            <svg width="24" height="24" viewBox="0 0 24 24">
              ${iconSvg}
            </svg>
          </g>
          <text x="4" y="5" fill="#f5f7ff" font-size="11.5" font-weight="700" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">${name}</text>
        </g>
      </g>
    `;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="100%">
  <defs>
    ${sharedDefs}
    <style>
      ${sharedAnimationStyles}
      /* Continuous 3D Orbital Rotations */
      .orbit-ring-1 {
        transform-origin: 500px 340px;
        animation: orbitSpin1 42s infinite linear;
      }
      .node-counter-1 {
        animation: orbitCounterSpin1 42s infinite linear;
      }

      .orbit-ring-2 {
        transform-origin: 500px 340px;
        animation: orbitSpin2 55s infinite linear;
      }
      .node-counter-2 {
        animation: orbitCounterSpin2 55s infinite linear;
      }

      .orbit-ring-3 {
        transform-origin: 500px 340px;
        animation: orbitSpin3 68s infinite linear;
      }
      .node-counter-3 {
        animation: orbitCounterSpin3 68s infinite linear;
      }

      .core-pulse {
        animation: pulseGlow 4s infinite ease-in-out;
      }
      .radar-sweep-beam {
        transform-origin: 500px 340px;
        animation: radarSweep 10s infinite linear;
      }
    </style>
  </defs>

  <rect width="${width}" height="${height}" fill="url(#bgGrad)"/>
  <rect width="${width}" height="${height}" fill="url(#futuristicGrid)"/>

  ${sectionHeader("Continuous Dynamic Engine", "3D ROTATING ORBIT SYSTEM", "Multi-tier orbital architecture across Core Engines, AI/Vision &amp; Modern Frameworks")}

  <!-- Radar Scanning HUD Sweep -->
  <g class="radar-sweep-beam" opacity="0.15">
    <path d="M 500 340 L 920 340 A 420 420 0 0 0 880 200 Z" fill="url(#blueGlowGrad)"/>
  </g>

  <!-- Central Holographic Core Hub -->
  <g transform="translate(500, 340)" class="core-pulse">
    <circle cx="0" cy="0" r="76" fill="#0b142d" stroke="#247bff" stroke-width="2.5" filter="url(#glowBlue)"/>
    <circle cx="0" cy="0" r="58" fill="#101935" stroke="#ff354f" stroke-width="1.5" stroke-dasharray="6,4"/>
    <circle cx="0" cy="0" r="42" fill="#070b16"/>
    <text x="0" y="-8" text-anchor="middle" fill="#247bff" font-size="11" font-weight="800" letter-spacing="2" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">CORE</text>
    <text x="0" y="14" text-anchor="middle" fill="#f5f7ff" font-size="16" font-weight="900" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">DEV HUB</text>
    <text x="0" y="30" text-anchor="middle" fill="#ff354f" font-size="10" font-weight="700" letter-spacing="1">ORBITAL</text>
  </g>

  <!-- ================= ORBIT 1: INNER TILTED ELLIPSE (-20deg) ================= -->
  <!-- Static Orbit Track Guide -->
  <g transform="translate(500, 340) rotate(-20)">
    <ellipse cx="0" cy="0" rx="200" ry="115" fill="none" stroke="#247bff" stroke-width="1.8" stroke-dasharray="10,6" opacity="0.55"/>
  </g>
  <!-- Actively Rotating Group with Nodes (Rx=200, Ry=115) -->
  <g class="orbit-ring-1">
    <!-- Java (0 deg) -->
    ${rotatingOrbitNode("Java", icons.java, 700, 340, "node-counter-1", "#247bff")}
    <!-- Spring Boot (90 deg) -->
    ${rotatingOrbitNode("Spring Boot", icons.springboot, 500, 455, "node-counter-1", "#6db33f")}
    <!-- Python (180 deg) -->
    ${rotatingOrbitNode("Python", icons.python, 300, 340, "node-counter-1", "#247bff")}
    <!-- FastAPI (270 deg) -->
    ${rotatingOrbitNode("FastAPI", icons.fastapi, 500, 225, "node-counter-1", "#05998b")}
  </g>

  <!-- ================= ORBIT 2: MIDDLE TILTED ELLIPSE (+22deg) ================= -->
  <!-- Static Orbit Track Guide -->
  <g transform="translate(500, 340) rotate(22)">
    <ellipse cx="0" cy="0" rx="310" ry="165" fill="none" stroke="#ff354f" stroke-width="1.8" stroke-dasharray="12,8" opacity="0.5"/>
  </g>
  <!-- Actively Rotating Group with Nodes (Rx=310, Ry=165) -->
  <g class="orbit-ring-2">
    <!-- React (0 deg) -->
    ${rotatingOrbitNode("React", icons.react, 810, 340, "node-counter-2", "#00d8ff")}
    <!-- Node.js (60 deg) -->
    ${rotatingOrbitNode("Node.js", icons.nodejs, 655, 482, "node-counter-2", "#339933")}
    <!-- Express (120 deg) -->
    ${rotatingOrbitNode("Express.js", icons.express, 345, 482, "node-counter-2", "#f5f7ff")}
    <!-- YOLO (180 deg) -->
    ${rotatingOrbitNode("YOLO", icons.yolo, 190, 340, "node-counter-2", "#ffb703")}
    <!-- OpenCV (240 deg) -->
    ${rotatingOrbitNode("OpenCV", icons.opencv, 345, 198, "node-counter-2", "#ff354f")}
    <!-- AI / ML (300 deg) -->
    ${rotatingOrbitNode("AI / ML", icons.aiml, 655, 198, "node-counter-2", "#ff354f")}
  </g>

  <!-- ================= ORBIT 3: OUTER TILTED ELLIPSE (-10deg) ================= -->
  <!-- Static Orbit Track Guide -->
  <g transform="translate(500, 340) rotate(-10)">
    <ellipse cx="0" cy="0" rx="415" ry="215" fill="none" stroke="#00e676" stroke-width="1.4" stroke-dasharray="14,10" opacity="0.45"/>
  </g>
  <!-- Actively Rotating Group with Nodes (Rx=415, Ry=215) -->
  <g class="orbit-ring-3">
    <!-- JavaScript (0 deg) -->
    ${rotatingOrbitNode("JavaScript", icons.javascript, 915, 340, "node-counter-3", "#f7df1e")}
    <!-- Vite (51 deg) -->
    ${rotatingOrbitNode("Vite", icons.vite, 760, 507, "node-counter-3", "#646cff")}
    <!-- MySQL (102 deg) -->
    ${rotatingOrbitNode("MySQL", icons.mysql, 413, 550, "node-counter-3", "#00758f")}
    <!-- Supabase (154 deg) -->
    ${rotatingOrbitNode("Supabase", icons.supabase, 126, 434, "node-counter-3", "#3ecf8e")}
    <!-- HTML5 (205 deg) -->
    ${rotatingOrbitNode("HTML5", icons.html5, 126, 246, "node-counter-3", "#e34f26")}
    <!-- CSS3 (257 deg) -->
    ${rotatingOrbitNode("CSS3", icons.css3, 413, 130, "node-counter-3", "#1572b6")}
    <!-- Git (308 deg) -->
    ${rotatingOrbitNode("Git", icons.git, 760, 173, "node-counter-3", "#f05032")}
  </g>

  <!-- Footer Orbit Telemetry Legend -->
  <g transform="translate(60, 600)">
    <circle cx="6" cy="6" r="4" fill="#247bff" filter="url(#glowBlue)"/>
    <text x="18" y="10" fill="#8c9dbd" font-size="11" font-weight="600" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">ORBIT 1 [CW 42s] // Java • Spring Boot • Python • FastAPI</text>
    
    <circle cx="370" cy="6" r="4" fill="#ff354f" filter="url(#glowCrimson)"/>
    <text x="382" y="10" fill="#8c9dbd" font-size="11" font-weight="600" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">ORBIT 2 [CCW 55s] // React • Node • Express • YOLO • OpenCV • AI/ML</text>

    <circle cx="780" cy="6" r="4" fill="#00e676"/>
    <text x="792" y="10" fill="#8c9dbd" font-size="11" font-weight="600" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">ORBIT 3 [CW 68s] // JS • Vite • SQL • Tools</text>
  </g>
</svg>`;
}

// ==========================================
// 4. 3D ID DASHBOARD SVG (Hanging Credential)
// ==========================================
function buildIdDashboard() {
  const width = 1000;
  const height = 660;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="100%">
  <defs>
    ${sharedDefs}
    <style>
      ${sharedAnimationStyles}
      .lanyard-anchor {
        transform-origin: 500px 0px;
        animation: idSwing 8s ease-in-out infinite alternate;
      }
      .shimmer-foil {
        animation: foilSweep 7s infinite ease-in-out;
      }
      .scan-beam {
        animation: scanline 4s infinite linear;
      }
    </style>
    <clipPath id="badgeCardClip">
      <rect x="330" y="140" width="340" height="490" rx="24"/>
    </clipPath>
    <clipPath id="badgePortraitClip">
      <rect x="355" y="240" width="130" height="155" rx="14"/>
    </clipPath>
    <linearGradient id="lanyardStrap" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0a1226"/>
      <stop offset="30%" stop-color="#247bff"/>
      <stop offset="70%" stop-color="#ff354f"/>
      <stop offset="100%" stop-color="#0a1226"/>
    </linearGradient>
  </defs>

  <rect width="${width}" height="${height}" fill="url(#bgGrad)"/>
  <rect width="${width}" height="${height}" fill="url(#futuristicGrid)"/>

  ${sectionHeader("Security &amp; Clearance", "3D ID DASHBOARD", "Physical developer credential // AMC Engineering College ISE")}

  <!-- Background Ambient Depth Lights -->
  <circle cx="500" cy="380" r="260" fill="#247bff" opacity="0.08" filter="url(#glowBlue)"/>

  <!-- Left Telemetry Panel -->
  <g transform="translate(60, 170)">
    ${hudCard(0, 0, 220, 420, 16)}
    <g transform="translate(20, 30)">
      <text x="0" y="0" fill="#247bff" font-size="11" font-weight="800" letter-spacing="2">TELEMETRY</text>
      <text x="0" y="22" fill="#f5f7ff" font-size="16" font-weight="800">Clearance</text>
      
      <g transform="translate(0, 45)">
        <text x="0" y="0" fill="#8c9dbd" font-size="10" font-weight="700">STATUS</text>
        <text x="0" y="18" fill="#00e676" font-size="13" font-weight="800">● VERIFIED</text>

        <text x="0" y="50" fill="#8c9dbd" font-size="10" font-weight="700">ISSUER</text>
        <text x="0" y="68" fill="#f5f7ff" font-size="12" font-weight="700">AMC Dept. ISE</text>

        <text x="0" y="100" fill="#8c9dbd" font-size="10" font-weight="700">LOCATION</text>
        <text x="0" y="118" fill="#f5f7ff" font-size="12" font-weight="700">Bengaluru, IN</text>

        <text x="0" y="150" fill="#8c9dbd" font-size="10" font-weight="700">SEMESTER</text>
        <text x="0" y="168" fill="#f5f7ff" font-size="12" font-weight="700">5th Sem B.E.</text>

        <text x="0" y="200" fill="#8c9dbd" font-size="10" font-weight="700">SYS_ENCRYPTION</text>
        <text x="0" y="218" fill="#247bff" font-size="12" font-weight="700">SHA-256 SECURED</text>

        <text x="0" y="250" fill="#8c9dbd" font-size="10" font-weight="700">ROLE_SPEC</text>
        <text x="0" y="268" fill="#ff7b91" font-size="12" font-weight="700">Full Stack / AI</text>
      </g>
    </g>
  </g>

  <!-- Right Telemetry Panel -->
  <g transform="translate(720, 170)">
    ${hudCard(0, 0, 220, 420, 16)}
    <g transform="translate(20, 30)">
      <text x="0" y="0" fill="#ff354f" font-size="11" font-weight="800" letter-spacing="2">HARDWARE</text>
      <text x="0" y="22" fill="#f5f7ff" font-size="16" font-weight="800">Pass Protocols</text>
      
      <g transform="translate(0, 45)">
        <text x="0" y="0" fill="#8c9dbd" font-size="10" font-weight="700">BADGE ID</text>
        <text x="0" y="18" fill="#247bff" font-size="13" font-weight="800">CR-ISE-2026</text>

        <text x="0" y="50" fill="#8c9dbd" font-size="10" font-weight="700">RFID SCAN</text>
        <text x="0" y="68" fill="#00e676" font-size="12" font-weight="700">PASSED // 13.56 MHz</text>

        <text x="0" y="100" fill="#8c9dbd" font-size="10" font-weight="700">BIOMETRIC MATCH</text>
        <text x="0" y="118" fill="#f5f7ff" font-size="12" font-weight="700">CONFIRMED (id.png)</text>

        <text x="0" y="150" fill="#8c9dbd" font-size="10" font-weight="700">GITHUB IDENTITY</text>
        <text x="0" y="168" fill="#f5f7ff" font-size="12" font-weight="700">@gowtham-cr</text>

        <text x="0" y="200" fill="#8c9dbd" font-size="10" font-weight="700">ACCESS LEVEL</text>
        <text x="0" y="218" fill="#ff354f" font-size="12" font-weight="700">TIER-1 ARCHITECT</text>

        <text x="0" y="250" fill="#8c9dbd" font-size="10" font-weight="700">PHYSICAL MOTION</text>
        <text x="0" y="268" fill="#60a5fa" font-size="12" font-weight="700">+/- 1.7° DAMPED</text>
      </g>
    </g>
  </g>

  <!-- Hanging 3D Animated Developer ID Badge -->
  <g class="lanyard-anchor">
    <!-- Lanyard Strap (Top Origin to Clip) -->
    <path d="M 482 0 L 492 110 L 508 110 L 518 0" fill="url(#lanyardStrap)" stroke="#247bff" stroke-width="0.5"/>
    <text x="500" y="60" text-anchor="middle" fill="#ffffff" font-size="8" font-weight="800" letter-spacing="2" transform="rotate(90 500 60)">DEVELOPER</text>

    <!-- Metal Clasp & Ring -->
    <rect x="491" y="108" width="18" height="16" rx="4" fill="#718096" stroke="#e2e8f0" stroke-width="1.5"/>
    <circle cx="500" cy="128" r="9" fill="none" stroke="#cbd5e1" stroke-width="3"/>
    <rect x="493" y="133" width="14" height="12" rx="3" fill="#475569" stroke="#94a3b8" stroke-width="1"/>

    <!-- ID Card Main Shell (with Glass, Shadow & Holographic Foil) -->
    <g filter="url(#cardShadow)">
      <!-- Outer Card Rim -->
      <rect x="330" y="140" width="340" height="490" rx="24" fill="#080e21" stroke="url(#glassBorder)" stroke-width="2"/>
      <!-- Inner Card Body -->
      <rect x="334" y="144" width="332" height="482" rx="20" fill="url(#cardGrad)"/>
    </g>

    <!-- Lanyard Slot at top of badge -->
    <rect x="480" y="152" width="40" height="7" rx="3.5" fill="#000000" stroke="#247bff" stroke-width="1"/>

    <!-- Foil Shimmer Layer (Clipped to Card) -->
    <g clip-path="url(#badgeCardClip)">
      <rect class="shimmer-foil" x="250" y="140" width="160" height="500" fill="url(#blueGlowGrad)" opacity="0.35"/>
    </g>

    <!-- Card Header / Org Info -->
    <g transform="translate(355, 180)">
      <text x="0" y="0" fill="#247bff" font-size="11" font-weight="800" letter-spacing="2" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">AMC ENGINEERING COLLEGE</text>
      <text x="0" y="18" fill="#f5f7ff" font-size="15" font-weight="800" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">INFORMATION SCIENCE &amp; ENG.</text>
      <line x1="0" y1="28" x2="290" y2="28" stroke="#247bff" stroke-width="1.5" opacity="0.6"/>
    </g>

    <!-- Portrait Area (Embedded id.png with holographic frame) -->
    <g transform="translate(0, 0)">
      <!-- Frame border -->
      <rect x="353" y="238" width="134" height="159" rx="16" fill="none" stroke="url(#portraitBorder)" stroke-width="2"/>
      <g clip-path="url(#badgePortraitClip)">
        <image href="data:image/png;base64,${idBase64}" x="345" y="230" width="150" height="175" preserveAspectRatio="xMidYMid slice"/>
        <line class="scan-beam" x1="355" y1="240" x2="485" y2="240" stroke="#247bff" stroke-width="2"/>
      </g>
    </g>

    <!-- Right Side Details inside Card -->
    <g transform="translate(502, 252)">
      <text x="0" y="0" fill="#8c9dbd" font-size="9" font-weight="700" letter-spacing="1">NAME</text>
      <text x="0" y="17" fill="#f5f7ff" font-size="16" font-weight="800">Gowtham R</text>

      <text x="0" y="42" fill="#8c9dbd" font-size="9" font-weight="700" letter-spacing="1">PRIMARY ROLE</text>
      <text x="0" y="58" fill="#247bff" font-size="12" font-weight="700">Java Full Stack</text>

      <text x="0" y="82" fill="#8c9dbd" font-size="9" font-weight="700" letter-spacing="1">GITHUB</text>
      <text x="0" y="98" fill="#ff7b91" font-size="12" font-weight="700">@gowtham-cr</text>

      <text x="0" y="122" fill="#8c9dbd" font-size="9" font-weight="700" letter-spacing="1">LOCATION</text>
      <text x="0" y="138" fill="#c4d1eb" font-size="11" font-weight="600">Bengaluru, IN</text>
    </g>

    <!-- Badge Specialties Chips -->
    <g transform="translate(355, 420)">
      <rect x="0" y="0" width="88" height="24" rx="6" fill="#141f3d" stroke="#247bff" stroke-width="0.8"/>
      <text x="10" y="16" fill="#60a5fa" font-size="10" font-weight="700">AI / ML</text>

      <rect x="96" y="0" width="102" height="24" rx="6" fill="#141f3d" stroke="#247bff" stroke-width="0.8"/>
      <text x="10" y="16" transform="translate(96, 0)" fill="#60a5fa" font-size="10" font-weight="700">Computer Vision</text>

      <rect x="206" y="0" width="84" height="24" rx="6" fill="#141f3d" stroke="#ff354f" stroke-width="0.8"/>
      <text x="8" y="16" transform="translate(206, 0)" fill="#ff7b91" font-size="10" font-weight="700">Hackathons</text>
    </g>

    <!-- Holographic Barcode & Security Microchip -->
    <g transform="translate(355, 465)">
      <!-- Microchip -->
      <rect x="0" y="0" width="46" height="34" rx="6" fill="#d97706" stroke="#f59e0b" stroke-width="1"/>
      <line x1="0" y1="11" x2="46" y2="11" stroke="#92400e" stroke-width="1"/>
      <line x1="0" y1="23" x2="46" y2="23" stroke="#92400e" stroke-width="1"/>
      <line x1="23" y1="0" x2="23" y2="34" stroke="#92400e" stroke-width="1"/>

      <!-- Vector Barcode -->
      <g transform="translate(62, 0)">
        <rect x="0" y="0" width="3" height="34" fill="#f5f7ff"/>
        <rect x="6" y="0" width="1.5" height="34" fill="#f5f7ff"/>
        <rect x="11" y="0" width="4" height="34" fill="#f5f7ff"/>
        <rect x="18" y="0" width="2" height="34" fill="#f5f7ff"/>
        <rect x="23" y="0" width="1" height="34" fill="#f5f7ff"/>
        <rect x="27" y="0" width="3.5" height="34" fill="#f5f7ff"/>
        <rect x="33" y="0" width="1.5" height="34" fill="#f5f7ff"/>
        <rect x="38" y="0" width="5" height="34" fill="#f5f7ff"/>
        <rect x="46" y="0" width="2" height="34" fill="#f5f7ff"/>
        <rect x="51" y="0" width="4" height="34" fill="#f5f7ff"/>
        <rect x="58" y="0" width="1" height="34" fill="#f5f7ff"/>
        <rect x="62" y="0" width="3" height="34" fill="#f5f7ff"/>
        <rect x="68" y="0" width="2" height="34" fill="#f5f7ff"/>
        <rect x="73" y="0" width="4" height="34" fill="#f5f7ff"/>
        <rect x="80" y="0" width="1.5" height="34" fill="#f5f7ff"/>
        <rect x="85" y="0" width="3" height="34" fill="#f5f7ff"/>
        <rect x="91" y="0" width="2" height="34" fill="#f5f7ff"/>
        <rect x="96" y="0" width="4" height="34" fill="#f5f7ff"/>
        <rect x="103" y="0" width="1" height="34" fill="#f5f7ff"/>
        <rect x="107" y="0" width="5" height="34" fill="#f5f7ff"/>
        <rect x="115" y="0" width="2" height="34" fill="#f5f7ff"/>
        <rect x="120" y="0" width="3" height="34" fill="#f5f7ff"/>
        <rect x="126" y="0" width="1.5" height="34" fill="#f5f7ff"/>
        <rect x="131" y="0" width="4" height="34" fill="#f5f7ff"/>
        <rect x="138" y="0" width="2" height="34" fill="#f5f7ff"/>
        <rect x="143" y="0" width="4" height="34" fill="#f5f7ff"/>
        <rect x="150" y="0" width="1.5" height="34" fill="#f5f7ff"/>
        <rect x="154" y="0" width="3" height="34" fill="#f5f7ff"/>
        <rect x="160" y="0" width="2" height="34" fill="#f5f7ff"/>
        <rect x="165" y="0" width="5" height="34" fill="#f5f7ff"/>
        <rect x="173" y="0" width="1.5" height="34" fill="#f5f7ff"/>
        <rect x="177" y="0" width="3" height="34" fill="#f5f7ff"/>
        <rect x="183" y="0" width="2" height="34" fill="#f5f7ff"/>
        <rect x="188" y="0" width="4" height="34" fill="#f5f7ff"/>
        <rect x="195" y="0" width="1.5" height="34" fill="#f5f7ff"/>
        <rect x="200" y="0" width="5" height="34" fill="#f5f7ff"/>
        <rect x="208" y="0" width="2" height="34" fill="#f5f7ff"/>
        <rect x="213" y="0" width="4" height="34" fill="#f5f7ff"/>
        <rect x="220" y="0" width="2" height="34" fill="#f5f7ff"/>
      </g>
    </g>

    <!-- Bottom Verification Stamp -->
    <g transform="translate(355, 520)">
      <rect x="0" y="0" width="290" height="28" rx="6" fill="#0c142b" stroke="#247bff" stroke-width="1"/>
      <circle cx="14" cy="14" r="4" fill="#00e676" class="pulse-radar"/>
      <text x="26" y="18" fill="#8c9dbd" font-size="10" font-weight="700" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">SECURE BADGE // AUTHENTICATED 2026</text>
      <text x="245" y="18" fill="#247bff" font-size="10" font-weight="800">ISO/IEC</text>
    </g>
  </g>
</svg>`;
}

// ==========================================
// 5. DEVELOPER TELEMETRY SVG (Verified Information Only)
// ==========================================
function buildTelemetry() {
  const width = 1000;
  const height = 480;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="100%">
  <defs>
    ${sharedDefs}
    <style>
      ${sharedAnimationStyles}
      .node-pulse-blue { animation: pulseGlow 3s infinite ease-in-out; }
      .node-pulse-crimson { animation: crimsonPulse 3s infinite ease-in-out; }
    </style>
  </defs>

  <rect width="${width}" height="${height}" fill="url(#bgGrad)"/>
  <rect width="${width}" height="${height}" fill="url(#futuristicGrid)"/>

  ${sectionHeader("Verified Telemetry &amp; Intelligence", "DEVELOPER TELEMETRY DASHBOARD", "Engineering benchmarks across GitHub, DSA, Architecture &amp; Hackathons")}

  <!-- 5 Column Telemetry Matrix -->
  <!-- Col 1: GitHub -->
  <g transform="translate(60, 130)">
    ${hudCard(0, 0, 164, 275, 14, "#247bff")}
    <g transform="translate(18, 24)">
      <circle cx="16" cy="16" r="14" fill="#247bff" opacity="0.15"/>
      <g transform="translate(4, 4) scale(1)">
        <svg width="24" height="24" viewBox="0 0 24 24">${icons.github}</svg>
      </g>
      <text x="36" y="21" fill="#f5f7ff" font-size="14" font-weight="800">GitHub</text>
      <line x1="0" y1="42" x2="128" y2="42" stroke="rgba(36,123,255,0.3)" stroke-width="1"/>

      <text x="0" y="65" fill="#8c9dbd" font-size="10" font-weight="700">IDENTITY</text>
      <text x="0" y="82" fill="#60a5fa" font-size="12" font-weight="700">@gowtham-cr</text>

      <text x="0" y="112" fill="#8c9dbd" font-size="10" font-weight="700">PIPELINE</text>
      <text x="0" y="129" fill="#f5f7ff" font-size="11.5" font-weight="600">Active CI/CD</text>

      <text x="0" y="159" fill="#8c9dbd" font-size="10" font-weight="700">REPOSITORY</text>
      <text x="0" y="176" fill="#f5f7ff" font-size="11.5" font-weight="600">Open Source</text>

      <rect x="0" y="200" width="128" height="26" rx="6" fill="#0d1838" stroke="#247bff" stroke-width="0.8"/>
      <text x="64" y="217" text-anchor="middle" fill="#00e676" font-size="10" font-weight="800">● LIVE REPO</text>
    </g>
  </g>

  <!-- Col 2: LeetCode -->
  <g transform="translate(239, 130)">
    ${hudCard(0, 0, 164, 275, 14, "#ffa116")}
    <g transform="translate(18, 24)">
      <circle cx="16" cy="16" r="14" fill="#ffa116" opacity="0.15"/>
      <g transform="translate(4, 4) scale(1)">
        <svg width="24" height="24" viewBox="0 0 24 24">${icons.leetcode}</svg>
      </g>
      <text x="36" y="21" fill="#f5f7ff" font-size="14" font-weight="800">LeetCode</text>
      <line x1="0" y1="42" x2="128" y2="42" stroke="rgba(255,161,22,0.3)" stroke-width="1"/>

      <text x="0" y="65" fill="#8c9dbd" font-size="10" font-weight="700">IDENTITY</text>
      <text x="0" y="82" fill="#ffa116" font-size="12" font-weight="700">@gowtham-cr</text>

      <text x="0" y="112" fill="#8c9dbd" font-size="10" font-weight="700">FOCUS</text>
      <text x="0" y="129" fill="#f5f7ff" font-size="11.5" font-weight="600">DSA &amp; Logic</text>

      <text x="0" y="159" fill="#8c9dbd" font-size="10" font-weight="700">LANGUAGE</text>
      <text x="0" y="176" fill="#f5f7ff" font-size="11.5" font-weight="600">Java / C++</text>

      <rect x="0" y="200" width="128" height="26" rx="6" fill="#0d1838" stroke="#ffa116" stroke-width="0.8"/>
      <text x="64" y="217" text-anchor="middle" fill="#ffa116" font-size="10" font-weight="800">PROBLEM SOLVING</text>
    </g>
  </g>

  <!-- Col 3: Projects -->
  <g transform="translate(418, 130)">
    ${hudCard(0, 0, 164, 275, 14, "#ff354f")}
    <g transform="translate(18, 24)">
      <circle cx="16" cy="16" r="14" fill="#ff354f" opacity="0.15"/>
      <text x="9" y="22" fill="#ff354f" font-size="16">⚡</text>
      <text x="36" y="21" fill="#f5f7ff" font-size="14" font-weight="800">Projects</text>
      <line x1="0" y1="42" x2="128" y2="42" stroke="rgba(255,53,79,0.3)" stroke-width="1"/>

      <text x="0" y="65" fill="#8c9dbd" font-size="10" font-weight="700">FEATURED</text>
      <text x="0" y="82" fill="#ff7b91" font-size="12" font-weight="700">TowerLens AI</text>

      <text x="0" y="112" fill="#8c9dbd" font-size="10" font-weight="700">AI / ML SUITE</text>
      <text x="0" y="129" fill="#f5f7ff" font-size="11.5" font-weight="600">NextStep AI</text>

      <text x="0" y="159" fill="#8c9dbd" font-size="10" font-weight="700">ENTERPRISE</text>
      <text x="0" y="176" fill="#f5f7ff" font-size="11.5" font-weight="600">Inventory Sys</text>

      <rect x="0" y="200" width="128" height="26" rx="6" fill="#0d1838" stroke="#ff354f" stroke-width="0.8"/>
      <text x="64" y="217" text-anchor="middle" fill="#ff7b91" font-size="10" font-weight="800">FULL-STACK</text>
    </g>
  </g>

  <!-- Col 4: Skills -->
  <g transform="translate(597, 130)">
    ${hudCard(0, 0, 164, 275, 14, "#247bff")}
    <g transform="translate(18, 24)">
      <circle cx="16" cy="16" r="14" fill="#247bff" opacity="0.15"/>
      <text x="9" y="22" fill="#247bff" font-size="16">🧠</text>
      <text x="36" y="21" fill="#f5f7ff" font-size="14" font-weight="800">Skills</text>
      <line x1="0" y1="42" x2="128" y2="42" stroke="rgba(36,123,255,0.3)" stroke-width="1"/>

      <text x="0" y="65" fill="#8c9dbd" font-size="10" font-weight="700">CORE</text>
      <text x="0" y="82" fill="#60a5fa" font-size="12" font-weight="700">Java Full Stack</text>

      <text x="0" y="112" fill="#8c9dbd" font-size="10" font-weight="700">AI &amp; VISION</text>
      <text x="0" y="129" fill="#f5f7ff" font-size="11.5" font-weight="600">YOLO • OpenCV</text>

      <text x="0" y="159" fill="#8c9dbd" font-size="10" font-weight="700">FRAMEWORKS</text>
      <text x="0" y="176" fill="#f5f7ff" font-size="11.5" font-weight="600">Spring • React</text>

      <rect x="0" y="200" width="128" height="26" rx="6" fill="#0d1838" stroke="#247bff" stroke-width="0.8"/>
      <text x="64" y="217" text-anchor="middle" fill="#247bff" font-size="10" font-weight="800">VERIFIED STACK</text>
    </g>
  </g>

  <!-- Col 5: Hackathons -->
  <g transform="translate(776, 130)">
    ${hudCard(0, 0, 164, 275, 14, "#00e676")}
    <g transform="translate(18, 24)">
      <circle cx="16" cy="16" r="14" fill="#00e676" opacity="0.15"/>
      <text x="9" y="22" fill="#00e676" font-size="16">🚀</text>
      <text x="36" y="21" fill="#f5f7ff" font-size="14" font-weight="800">Hackathons</text>
      <line x1="0" y1="42" x2="128" y2="42" stroke="rgba(0,230,118,0.3)" stroke-width="1"/>

      <text x="0" y="65" fill="#8c9dbd" font-size="10" font-weight="700">NATIONAL SPRINT</text>
      <text x="0" y="82" fill="#00e676" font-size="12" font-weight="700">DECIPHER-X</text>

      <text x="0" y="112" fill="#8c9dbd" font-size="10" font-weight="700">RAPID BUILD</text>
      <text x="0" y="129" fill="#f5f7ff" font-size="11.5" font-weight="600">Blaze • HACKTOPUS</text>

      <text x="0" y="159" fill="#8c9dbd" font-size="10" font-weight="700">EXHIBITIONS</text>
      <text x="0" y="176" fill="#f5f7ff" font-size="11.5" font-weight="600">PHYSIKA-2025</text>

      <rect x="0" y="200" width="128" height="26" rx="6" fill="#0d1838" stroke="#00e676" stroke-width="0.8"/>
      <text x="64" y="217" text-anchor="middle" fill="#00e676" font-size="10" font-weight="800">24H SPRINT READY</text>
    </g>
  </g>

  <!-- Bottom Notice -->
  <g transform="translate(60, 425)">
    <rect x="0" y="0" width="880" height="30" rx="8" fill="#080e21" stroke="rgba(36,123,255,0.2)" stroke-width="1"/>
    <text x="20" y="19" fill="#8c9dbd" font-size="11" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
      VERIFIED TELEMETRY PROTOCOL // Pre-native GitHub telemetry layer displaying verified engineering disciplines without fabricated statistics.
    </text>
  </g>
</svg>`;
}

// ==========================================
// 6. LEETCODE SECTION SVG (DSA & Problem-Solving Focus)
// ==========================================
function buildLeetcode() {
  const width = 1000;
  const height = 460;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="100%">
  <defs>
    ${sharedDefs}
    <style>
      ${sharedAnimationStyles}
      .leetcode-orbit {
        transform-origin: 260px 240px;
        animation: ringSpinCW 30s infinite linear;
      }
      .leetcode-pulse {
        animation: pulseGlow 3s infinite ease-in-out;
      }
    </style>
  </defs>

  <rect width="${width}" height="${height}" fill="url(#bgGrad)"/>
  <rect width="${width}" height="${height}" fill="url(#futuristicGrid)"/>

  ${sectionHeader("Algorithmic Intelligence", "LEETCODE // DSA &amp; PROBLEM SOLVING", "Structured problem solving, complexity optimization &amp; competitive programming")}

  <!-- Left Side: Algorithmic Orbit Telemetry (x=60, w=400) -->
  <g transform="translate(60, 130)">
    ${hudCard(0, 0, 400, 290, 16, "#ffa116")}
    
    <!-- Central LeetCode Hologram Orb -->
    <g transform="translate(200, 145)">
      <!-- Rotating outer ring -->
      <g class="leetcode-orbit">
        <circle cx="0" cy="0" r="95" fill="none" stroke="#ffa116" stroke-width="1.2" stroke-dasharray="10,6" opacity="0.6"/>
        <circle cx="95" cy="0" r="4.5" fill="#ffa116" filter="url(#glowBlue)"/>
        <circle cx="-95" cy="0" r="3.5" fill="#f5f7ff"/>
      </g>
      <circle cx="0" cy="0" r="65" fill="#0d1838" stroke="#ffa116" stroke-width="2" filter="url(#cardShadow)"/>
      <g transform="translate(-24, -24) scale(2)">
        <svg width="24" height="24" viewBox="0 0 24 24">${icons.leetcode}</svg>
      </g>
    </g>

    <!-- Corner Tag -->
    <text x="24" y="32" fill="#ffa116" font-size="11" font-weight="800" letter-spacing="2">DSA ENGINE</text>
    <text x="24" y="265" fill="#8c9dbd" font-size="11" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">ORBITAL RESOLVER // LOGIC MATRIX</text>
  </g>

  <!-- Right Side: Focus Pillars & Profile Identity (x=480, w=460) -->
  <g transform="translate(480, 130)">
    ${hudCard(0, 0, 460, 290, 16, "url(#glassBorder)")}

    <g transform="translate(28, 28)">
      <text x="0" y="0" fill="#ffa116" font-size="11" font-weight="800" letter-spacing="2">PROFILE IDENTITY</text>
      <text x="0" y="24" fill="#f5f7ff" font-size="22" font-weight="900">gowtham-cr</text>
      <text x="0" y="46" fill="#8c9dbd" font-size="12">leetcode.com/u/gowtham-cr</text>
      
      <line x1="0" y1="62" x2="404" y2="62" stroke="rgba(255,161,22,0.3)" stroke-width="1"/>

      <!-- DSA Problem-Solving Pillars -->
      <g transform="translate(0, 80)">
        <!-- Pillar 1 -->
        <g transform="translate(0, 0)">
          <rect x="0" y="0" width="195" height="58" rx="10" fill="#0d1736" stroke="#247bff" stroke-width="0.8"/>
          <text x="14" y="22" fill="#60a5fa" font-size="12" font-weight="700">● Data Structures</text>
          <text x="14" y="42" fill="#8c9dbd" font-size="10.5">Arrays, Trees, Graphs, Heaps</text>
        </g>
        <!-- Pillar 2 -->
        <g transform="translate(208, 0)">
          <rect x="0" y="0" width="195" height="58" rx="10" fill="#0d1736" stroke="#ff354f" stroke-width="0.8"/>
          <text x="14" y="22" fill="#ff7b91" font-size="12" font-weight="700">● Algorithms</text>
          <text x="14" y="42" fill="#8c9dbd" font-size="10.5">DP, Two Pointers, BFS/DFS</text>
        </g>
        <!-- Pillar 3 -->
        <g transform="translate(0, 68)">
          <rect x="0" y="0" width="195" height="58" rx="10" fill="#0d1736" stroke="#ffa116" stroke-width="0.8"/>
          <text x="14" y="22" fill="#ffa116" font-size="12" font-weight="700">● Language Mastery</text>
          <text x="14" y="42" fill="#8c9dbd" font-size="10.5">Java Core &amp; C++ STL</text>
        </g>
        <!-- Pillar 4 -->
        <g transform="translate(208, 68)">
          <rect x="0" y="0" width="195" height="58" rx="10" fill="#0d1736" stroke="#00e676" stroke-width="0.8"/>
          <text x="14" y="22" fill="#00e676" font-size="12" font-weight="700">● Optimization</text>
          <text x="14" y="42" fill="#8c9dbd" font-size="10.5">Time &amp; Space Complexity</text>
        </g>
      </g>
    </g>
  </g>
</svg>`;
}

// ==========================================
// 7. PROJECTS SECTION SVG (3D Depth, Glowing Borders & Perspective Cards)
// ==========================================
function buildProjects() {
  const width = 1000;
  const height = 980;

  function projectCard(num, title, desc1, desc2, techList, x, y, w, h, accentColor = "#247bff") {
    const techChips = techList.map((t, idx) => `
      <g transform="translate(${idx * 78}, 0)">
        <rect x="0" y="0" width="70" height="24" rx="6" fill="#0e1733" stroke="${accentColor}" stroke-width="0.8"/>
        <text x="35" y="16" text-anchor="middle" fill="#c4d1eb" font-size="10.5" font-weight="600" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">${t}</text>
      </g>
    `).join('');

    return `
      <g transform="translate(${x}, ${y})">
        ${hudCard(0, 0, w, h, 16, accentColor === "#ff354f" ? "url(#glassBorder)" : "url(#glassBorder)")}
        
        <g transform="translate(26, 26)">
          <!-- Number and Tag -->
          <rect x="0" y="0" width="80" height="22" rx="4" fill="${accentColor}" fill-opacity="0.15"/>
          <text x="10" y="15" fill="${accentColor}" font-size="11" font-weight="800" letter-spacing="1.5" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">PROJECT ${num}</text>
          
          <text x="0" y="48" fill="#f5f7ff" font-size="20" font-weight="800" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">${title}</text>
          
          <text x="0" y="78" fill="#9cb0cf" font-size="13" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">${desc1}</text>
          <text x="0" y="98" fill="#9cb0cf" font-size="13" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">${desc2}</text>

          <!-- Tech Chips -->
          <g transform="translate(0, 126)">
            ${techChips}
          </g>
        </g>
      </g>
    `;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="100%">
  <defs>
    ${sharedDefs}
    <style>
      ${sharedAnimationStyles}
    </style>
  </defs>

  <rect width="${width}" height="${height}" fill="url(#bgGrad)"/>
  <rect width="${width}" height="${height}" fill="url(#futuristicGrid)"/>

  ${sectionHeader("Production Systems", "FEATURED PROJECTS", "High-impact AI, Computer Vision and Enterprise Full-Stack Applications")}

  <!-- Project 01: TowerLens AI (Large Featured Top Card) -->
  ${projectCard(
    "01",
    "TowerLens AI",
    "AI-powered transmission tower component detection and inspection platform.",
    "Engineered with YOLO, OpenCV, FastAPI and modern React frontend.",
    ["YOLO", "OpenCV", "FastAPI", "React"],
    60, 130, 880, 210, "#ff354f"
  )}

  <!-- Project 02: NextStep AI (Row 2, Left) -->
  ${projectCard(
    "02",
    "NextStep AI",
    "AI Placement Readiness Copilot for resume improvement,",
    "job matching, skill-gap analysis, study planning and interviews.",
    ["AI/ML", "Python", "React", "NLP"],
    60, 370, 425, 230, "#247bff"
  )}

  <!-- Project 03: AMC College AI Chatbot (Row 2, Right) -->
  ${projectCard(
    "03",
    "AMC College AI Chatbot",
    "AI-powered campus and student assistance system for",
    "AMC Engineering College streamlining academic guidance.",
    ["AI / NLP", "Python", "REST APIs"],
    515, 370, 425, 230, "#247bff"
  )}

  <!-- Project 04: Inventory Management System (Row 3, Left) -->
  ${projectCard(
    "04",
    "Inventory Management System",
    "Full-stack enterprise employee inventory and asset",
    "tracking application with relational database persistence.",
    ["React", "Node.js", "Express", "MySQL"],
    60, 630, 425, 230, "#247bff"
  )}

  <!-- Project 05: AI Disease Prediction System (Row 3, Right) -->
  ${projectCard(
    "05",
    "AI Disease Prediction System",
    "Machine-learning based clinical disease prediction",
    "and assistive healthcare diagnostics engine.",
    ["Python", "ML Models", "Predictive"],
    515, 630, 425, 230, "#ff354f"
  )}

  <!-- Bottom Accessibility Notice -->
  <g transform="translate(60, 890)">
    <rect x="0" y="0" width="880" height="42" rx="10" fill="#080e21" stroke="rgba(36,123,255,0.25)" stroke-width="1"/>
    <text x="24" y="26" fill="#8c9dbd" font-size="12" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
      REPOSITORY VERIFICATION // All listed projects are self-built architectures without unverified external repositories.
    </text>
  </g>
</svg>`;
}

// ==========================================
// 8. CERTIFICATES SECTION SVG
// ==========================================
function buildCertificates() {
  const width = 1000;
  const height = 860;

  const certData = [
    { num: "01", title: "Core and Advanced Java", issuer: "IIHT", grade: "Grade: A+", type: "Certificate of Accomplishment", date: "20 Jun–1 Oct 2024", accent: "#247bff" },
    { num: "02", title: "C and C++", issuer: "IIHT", grade: "Grade: A+", type: "Certificate of Accomplishment", date: "20 Apr–7 Jun 2022", accent: "#247bff" },
    { num: "03", title: "NetApp Data Explorer", issuer: "NetApp", grade: "Status: Verified", type: "Completion Certificate", date: "Verified Completion", accent: "#00d8ff" },
    { num: "04", title: "Blaze Hackathon 2026", issuer: "Dept. of ISE, AMC Engineering College", grade: "Status: Active", type: "Participation", date: "18 May 2026", accent: "#ff354f" },
    { num: "05", title: "DECIPHER-X 2026", issuer: "National Level 24-Hour Hackathon", grade: "Status: 24h Sprint", type: "Participation", date: "8–9 Sep 2026", accent: "#ff354f" },
    { num: "06", title: "HACKTOPUS", issuer: "AMC Engineering College", grade: "Status: Team Builder", type: "Hackathon Participation", date: "10 May 2025", accent: "#ff354f" },
    { num: "07", title: "CODESTORM", issuer: "6 Hours Sprint Hackathon", grade: "Status: Rapid Build", type: "Participation", date: "7 Nov 2025", accent: "#247bff" },
    { num: "08", title: "PHYSIKA-2025", issuer: "Intercollegiate Project Exhibition", grade: "Status: Exhibition", type: "Participation", date: "5–6 Jun 2025", accent: "#247bff" }
  ];

  const cardsSvg = certData.map((c, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 60 + col * 455;
    const y = 130 + row * 165;

    return `
      <g transform="translate(${x}, ${y})">
        ${hudCard(0, 0, 425, 145, 14)}
        
        <g transform="translate(22, 22)">
          <!-- Top Row: Num & Badge -->
          <rect x="0" y="0" width="30" height="20" rx="4" fill="${c.accent}" fill-opacity="0.15"/>
          <text x="15" y="14" text-anchor="middle" fill="${c.accent}" font-size="11" font-weight="800">${c.num}</text>

          <rect x="38" y="0" width="130" height="20" rx="4" fill="#0d1838" stroke="rgba(255,255,255,0.1)" stroke-width="0.8"/>
          <text x="46" y="14" fill="#8c9dbd" font-size="9.5" font-weight="700">${c.type.toUpperCase()}</text>

          <text x="380" y="14" text-anchor="end" fill="${c.accent}" font-size="10.5" font-weight="700">${c.grade}</text>

          <!-- Title -->
          <text x="0" y="44" fill="#f5f7ff" font-size="15" font-weight="800" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">${c.title}</text>

          <!-- Issuer -->
          <text x="0" y="66" fill="#60a5fa" font-size="12" font-weight="600" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">${c.issuer}</text>

          <!-- Date -->
          <text x="0" y="88" fill="#8c9dbd" font-size="11" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">🗓 ${c.date}</text>
        </g>
      </g>
    `;
  }).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="100%">
  <defs>
    ${sharedDefs}
    <style>
      ${sharedAnimationStyles}
    </style>
  </defs>

  <rect width="${width}" height="${height}" fill="url(#bgGrad)"/>
  <rect width="${width}" height="${height}" fill="url(#futuristicGrid)"/>

  ${sectionHeader("Verified Credentials", "CERTIFICATIONS &amp; RECOGNITIONS", "Verified technical certifications, hackathon accomplishments &amp; exhibitions")}

  ${cardsSvg}

  <!-- Footer Micro Telemetry -->
  <g transform="translate(60, 810)">
    <rect x="0" y="0" width="880" height="30" rx="8" fill="#080e21" stroke="rgba(36,123,255,0.2)" stroke-width="1"/>
    <text x="20" y="19" fill="#8c9dbd" font-size="11" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
      CERTIFICATION REPOSITORY // All certificates officially registered under Gowtham R (AMC Engineering College / IIHT / NetApp).
    </text>
  </g>
</svg>`;
}

// ==========================================
// 9. HACKATHONS & ACHIEVEMENTS SVG
// ==========================================
function buildHackathons() {
  const width = 1000;
  const height = 760;

  const timelineEvents = [
    { title: "Blaze Hackathon 2026", org: "Dept. of ISE, AMC Engineering College", date: "May 2026", tag: "RAPID BUILD", accent: "#ff354f" },
    { title: "DECIPHER-X 2026", org: "National Level 24-Hour Hackathon", date: "September 2026", tag: "PROBLEM SOLVE", accent: "#247bff" },
    { title: "HACKTOPUS 2025", org: "AMC Engineering College", date: "May 2025", tag: "MODERN STACK", accent: "#ff354f" },
    { title: "CODESTORM 2025", org: "6-Hour Hackathon Sprint", date: "November 2025", tag: "RAPID BUILD", accent: "#247bff" },
    { title: "PHYSIKA-2025", org: "Intercollegiate Project Exhibition", date: "June 2025", tag: "CAREER GOAL", accent: "#00d8ff" }
  ];

  const timelineSvg = timelineEvents.map((e, idx) => {
    const y = 140 + idx * 95;
    return `
      <g transform="translate(60, ${y})">
        <!-- Node & Line Point -->
        <circle cx="20" cy="35" r="12" fill="#09122c" stroke="${e.accent}" stroke-width="2" filter="url(#glowBlue)"/>
        <circle cx="20" cy="35" r="5" fill="${e.accent}"/>
        ${idx < timelineEvents.length - 1 ? `<line x1="20" y1="47" x2="20" y2="130" stroke="#247bff" stroke-width="2" stroke-dasharray="4,4" opacity="0.4"/>` : ''}

        <!-- Card Body -->
        <g transform="translate(55, 0)">
          ${hudCard(0, 0, 825, 72, 12)}
          <g transform="translate(24, 24)">
            <text x="0" y="0" fill="#f5f7ff" font-size="16" font-weight="800" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">${e.title}</text>
            <text x="0" y="24" fill="#8c9dbd" font-size="12" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">${e.org}</text>
            
            <rect x="520" y="-12" width="120" height="24" rx="6" fill="#0d1838" stroke="${e.accent}" stroke-width="0.8"/>
            <text x="580" y="4" text-anchor="middle" fill="${e.accent}" font-size="10.5" font-weight="800" letter-spacing="1">${e.tag}</text>

            <text x="760" y="5" text-anchor="end" fill="#60a5fa" font-size="13" font-weight="700">🗓 ${e.date}</text>
          </g>
        </g>
      </g>
    `;
  }).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="100%">
  <defs>
    ${sharedDefs}
    <style>
      ${sharedAnimationStyles}
    </style>
  </defs>

  <rect width="${width}" height="${height}" fill="url(#bgGrad)"/>
  <rect width="${width}" height="${height}" fill="url(#futuristicGrid)"/>

  ${sectionHeader("Sprint Engineering", "HACKATHONS &amp; EXPEDITIONS", "High-pressure 24-hour sprints, prototyping &amp; technical exhibitions")}

  <!-- 4 Strategic Pillars Top Bar -->
  <g transform="translate(60, 115)">
    <!-- Pillar 1 -->
    <rect x="0" y="0" width="205" height="34" rx="8" fill="#0e1736" stroke="#ff354f" stroke-width="1"/>
    <text x="102" y="21" text-anchor="middle" fill="#ff7b91" font-size="11" font-weight="800" letter-spacing="1">⚡ RAPID BUILD</text>

    <!-- Pillar 2 -->
    <rect x="225" y="0" width="205" height="34" rx="8" fill="#0e1736" stroke="#247bff" stroke-width="1"/>
    <text x="327" y="21" text-anchor="middle" fill="#60a5fa" font-size="11" font-weight="800" letter-spacing="1">🧠 PROBLEM SOLVE</text>

    <!-- Pillar 3 -->
    <rect x="450" y="0" width="205" height="34" rx="8" fill="#0e1736" stroke="#247bff" stroke-width="1"/>
    <text x="552" y="21" text-anchor="middle" fill="#60a5fa" font-size="11" font-weight="800" letter-spacing="1">🚀 MODERN STACK</text>

    <!-- Pillar 4 -->
    <rect x="675" y="0" width="205" height="34" rx="8" fill="#0e1736" stroke="#00e676" stroke-width="1"/>
    <text x="777" y="21" text-anchor="middle" fill="#00e676" font-size="11" font-weight="800" letter-spacing="1">🎯 CAREER GOAL</text>
  </g>

  <!-- Timeline Events -->
  <g transform="translate(0, 35)">
    ${timelineSvg}
  </g>

  <!-- Bottom Telemetry Status -->
  <g transform="translate(60, 680)">
    <rect x="0" y="0" width="880" height="42" rx="10" fill="#080e21" stroke="rgba(36,123,255,0.25)" stroke-width="1"/>
    <text x="24" y="26" fill="#8c9dbd" font-size="12" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
      HACKATHON PROTOCOL // Proven ability to conceptualize, architect, and deploy production-grade prototypes under sprint constraints.
    </text>
  </g>
</svg>`;
}

// ==========================================
// 10. CONNECT SECTION SVG
// ==========================================
function buildConnect() {
  const width = 1000;
  const height = 580;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="100%">
  <defs>
    ${sharedDefs}
    <style>
      ${sharedAnimationStyles}
      .pointer-nudge {
        animation: pointPulse 2.5s infinite ease-in-out;
      }
      .arrow-nudge {
        animation: arrowNudge 1.8s infinite ease-in-out;
      }
    </style>
    <clipPath id="connectPortraitClip">
      <rect x="40" y="90" width="410" height="460" rx="24"/>
    </clipPath>
  </defs>

  <rect width="${width}" height="${height}" fill="url(#bgGrad)"/>
  <rect width="${width}" height="${height}" fill="url(#futuristicGrid)"/>

  ${sectionHeader("Global Transmission", "LET&apos;S CONNECT &amp; COLLABORATE", "Open for Full-Stack, AI/ML engineering, and Hackathon opportunities")}

  <!-- Left Side: Character Asset right_pointing.png (Pointing to the RIGHT towards the links) -->
  <g class="pointer-nudge">
    <!-- Ambient back glow for character -->
    <circle cx="220" cy="340" r="180" fill="#247bff" opacity="0.15" filter="url(#glowBlue)"/>
    <circle cx="280" cy="360" r="140" fill="#ff354f" opacity="0.1" filter="url(#glowCrimson)"/>

    <g clip-path="url(#connectPortraitClip)">
      <image href="data:image/png;base64,${rightPointingBase64}" x="15" y="70" width="440" height="490" preserveAspectRatio="xMidYMid meet"/>
      <!-- Soft fade at bottom -->
      <rect x="40" y="470" width="410" height="80" fill="url(#bgGrad)" opacity="0.6"/>
    </g>

    <!-- Pointing Vector Energy Particle Lines -->
    <g transform="translate(420, 290)">
      <line x1="0" y1="0" x2="35" y2="0" stroke="#247bff" stroke-width="3" stroke-linecap="round" class="arrow-nudge"/>
      <polygon points="35,-5 45,0 35,5" fill="#247bff" class="arrow-nudge"/>
    </g>
  </g>

  <!-- Right Side: Spacious Futuristic Social Channel Cards (x=480, w=460) -->
  <g transform="translate(480, 115)">
    <!-- Channel 1: GitHub -->
    <g transform="translate(0, 0)">
      ${hudCard(0, 0, 460, 80, 14, "#247bff")}
      <g transform="translate(24, 20)">
        <g transform="translate(0, 4) scale(1.3)">
          <svg width="24" height="24" viewBox="0 0 24 24">
            ${icons.github}
          </svg>
        </g>
        <text x="45" y="16" fill="#f5f7ff" font-size="16" font-weight="800" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">GitHub</text>
        <text x="45" y="34" fill="#8c9dbd" font-size="12" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">github.com/gowtham-cr</text>
        <path class="arrow-nudge" d="M 400 20 L 415 20 M 410 15 L 415 20 L 410 25" fill="none" stroke="#247bff" stroke-width="2.5" stroke-linecap="round"/>
      </g>
    </g>

    <!-- Channel 2: LinkedIn -->
    <g transform="translate(0, 95)">
      ${hudCard(0, 0, 460, 80, 14, "#0a66c2")}
      <g transform="translate(24, 20)">
        <g transform="translate(0, 4) scale(1.3)">
          <svg width="24" height="24" viewBox="0 0 24 24">
            ${icons.linkedin}
          </svg>
        </g>
        <text x="45" y="16" fill="#f5f7ff" font-size="16" font-weight="800" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">LinkedIn</text>
        <text x="45" y="34" fill="#8c9dbd" font-size="12" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">linkedin.com/in/gowtham-r-1b8367315</text>
        <path class="arrow-nudge" d="M 400 20 L 415 20 M 410 15 L 415 20 L 410 25" fill="none" stroke="#0a66c2" stroke-width="2.5" stroke-linecap="round"/>
      </g>
    </g>

    <!-- Channel 3: LeetCode -->
    <g transform="translate(0, 190)">
      ${hudCard(0, 0, 460, 80, 14, "#ffa116")}
      <g transform="translate(24, 20)">
        <g transform="translate(0, 4) scale(1.3)">
          <svg width="24" height="24" viewBox="0 0 24 24">
            ${icons.leetcode}
          </svg>
        </g>
        <text x="45" y="16" fill="#f5f7ff" font-size="16" font-weight="800" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">LeetCode</text>
        <text x="45" y="34" fill="#8c9dbd" font-size="12" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">leetcode.com/u/gowtham-cr</text>
        <path class="arrow-nudge" d="M 400 20 L 415 20 M 410 15 L 415 20 L 410 25" fill="none" stroke="#ffa116" stroke-width="2.5" stroke-linecap="round"/>
      </g>
    </g>

    <!-- Channel 4: Email -->
    <g transform="translate(0, 285)">
      ${hudCard(0, 0, 460, 80, 14, "#ff354f")}
      <g transform="translate(24, 20)">
        <g transform="translate(0, 4) scale(1.3)">
          <svg width="24" height="24" viewBox="0 0 24 24">
            ${icons.email}
          </svg>
        </g>
        <text x="45" y="16" fill="#f5f7ff" font-size="16" font-weight="800" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">Direct Email</text>
        <text x="45" y="34" fill="#8c9dbd" font-size="12" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">rg3212703@gmail.com</text>
        <path class="arrow-nudge" d="M 400 20 L 415 20 M 410 15 L 415 20 L 410 25" fill="none" stroke="#ff354f" stroke-width="2.5" stroke-linecap="round"/>
      </g>
    </g>

    <!-- Bottom Click Hint -->
    <g transform="translate(0, 385)">
      <rect x="0" y="0" width="460" height="34" rx="8" fill="#080e21" stroke="rgba(36,123,255,0.2)" stroke-width="1"/>
      <text x="20" y="21" fill="#8c9dbd" font-size="11" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
        CONNECT PROTOCOL // Real clickable markdown links listed immediately below.
      </text>
    </g>
  </g>
</svg>`;
}

// Generate and write all 10 SVG files
const svgs = [
  { name: 'hero.svg', content: buildHero() },
  { name: 'about-life.svg', content: buildAboutLife() },
  { name: 'stack.svg', content: buildStack() },
  { name: 'id-dashboard.svg', content: buildIdDashboard() },
  { name: 'telemetry.svg', content: buildTelemetry() },
  { name: 'leetcode.svg', content: buildLeetcode() },
  { name: 'projects.svg', content: buildProjects() },
  { name: 'certificates.svg', content: buildCertificates() },
  { name: 'hackathons.svg', content: buildHackathons() },
  { name: 'connect.svg', content: buildConnect() }
];

svgs.forEach(s => {
  const targetPath = path.join('assets', s.name);
  fs.writeFileSync(targetPath, s.content, 'utf8');
  console.log(`Successfully generated ${targetPath} (${s.content.length} bytes)`);
});

console.log('ALL 10 SVGs GENERATED SUCCESSFULLY.');
