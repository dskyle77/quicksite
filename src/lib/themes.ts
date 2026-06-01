// lib/theme.ts

/**
 * UPGRADED GOOGLE FONTS REQUIRED
 * * Add this link to your <head> or import it in your layout/root:
 * * ```html
 * <link href="[https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=Urbanist:wght@400;500;600;700&family=Syne:wght@700;800&family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,400&family=JetBrains+Mono:wght@400;500;700&family=Fira+Code:wght@400;500&family=Archivo+Black&display=swap](https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=Urbanist:wght@400;500;600;700&family=Syne:wght@700;800&family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,400&family=JetBrains+Mono:wght@400;500;700&family=Fira+Code:wght@400;500&family=Archivo+Black&display=swap)" rel="stylesheet">
 * ```
 * * Or using @import in your global CSS:
 * ```css
 * @import url('[https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=Urbanist:wght@400;500;600;700&family=Syne:wght@700;800&family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,400&family=JetBrains+Mono:wght@400;500;700&family=Fira+Code:wght@400;500&family=Archivo+Black&display=swap](https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=Urbanist:wght@400;500;600;700&family=Syne:wght@700;800&family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,400&family=JetBrains+Mono:wght@400;500;700&family=Fira+Code:wght@400;500&family=Archivo+Black&display=swap)');
 * ```
 */

export type Theme = {
  className: string;
  css: string;
  font: string;
  name: string;
  description: string;
  preview?: {
    bg: string;
    primary: string;
    text: string;
  };
};

type ThemeParams = {
  name: string;
  description: string;
  font: string;
  colors: string;
  preview?: {
    bg: string;
    primary: string;
    text: string;
  };
};

function makeTheme(params: ThemeParams): Theme {
  return {
    className: "qs-theme",
    name: params.name,
    description: params.description,
    font: params.font,
    preview: params.preview,
    css: `
      .qs-theme {
        ${params.colors}
        --qs-font: ${params.font};
        font-family: var(--qs-font);
      }
    `,
  };
}

/* =========================
   VIBRANT & MODERN THEMES
   ========================= */

// 1. Light Modern (Clean, crisp iOS/Stripe style aesthetic)
export const lightTheme = makeTheme({
  name: "Light",
  description: "Ultra-crisp neo-minimalist light interface",
  font: "'Plus Jakarta Sans', system-ui, sans-serif",
  preview: { bg: "#ffffff", primary: "#4f46e5", text: "#09090b" },
  colors: `
    --qs-bg: #ffffff;
    --qs-bg-alt: #f4f4f5;
    --qs-card-bg: #ffffff;
    --qs-card-bg-alt: #fafafa;
    --qs-primary: #4f46e5;
    --qs-primary-fg: #ffffff;
    --qs-secondary: #06b6d4;
    --qs-secondary-fg: #ffffff;
    --qs-text: #09090b;
    --qs-text-muted: #71717a;
    --qs-border: #e4e4e7;
    --qs-shadow: rgba(79, 70, 229, 0.05);
  `,
});

// 2. Dark Modern (Deep obsidian background, punchy electric accents)
export const darkTheme = makeTheme({
  name: "Dark",
  description: "Deep obsidian dark mode with electric accents",
  font: "'Plus Jakarta Sans', system-ui, sans-serif",
  preview: { bg: "#09090b", primary: "#3b82f6", text: "#f4f4f5" },
  colors: `
    --qs-bg: #09090b;
    --qs-bg-alt: #18181b;
    --qs-card-bg: #18181b;
    --qs-card-bg-alt: #27272a;
    --qs-primary: #3b82f6;
    --qs-primary-fg: #ffffff;
    --qs-secondary: #a855f7;
    --qs-secondary-fg: #ffffff;
    --qs-text: #f4f4f5;
    --qs-text-muted: #a1a1aa;
    --qs-border: #27272a;
    --qs-shadow: rgba(0, 0, 0, 0.5);
  `,
});

// 3. Warm Terracotta (Rich organic luxury cream and baked clay)
export const warmTheme = makeTheme({
  name: "Warm Beige",
  description: "Rich organic luxury cream and baked earth tones",
  font: "'Urbanist', sans-serif",
  preview: { bg: "#fdfbf7", primary: "#c2410c", text: "#291e1a" },
  colors: `
    --qs-bg: #fdfbf7;
    --qs-bg-alt: #f7f2ea;
    --qs-card-bg: #ffffff;
    --qs-card-bg-alt: #fbf9f3;
    --qs-primary: #c2410c;
    --qs-primary-fg: #ffffff;
    --qs-secondary: #b45309;
    --qs-secondary-fg: #ffffff;
    --qs-text: #291e1a;
    --qs-text-muted: #7c6e65;
    --qs-border: #ebdccb;
    --qs-shadow: rgba(194, 65, 12, 0.04);
  `,
});

// 4. Ocean (Bright and fresh oceanic theme)
export const oceanTheme = makeTheme({
  name: "Ocean Blue",
  description: "Bright turquoise over crisp white with vivid tropical highlights",
  font: "'Plus Jakarta Sans', sans-serif",
  preview: { bg: "#f0faff", primary: "#06b6d4", text: "#075985" },
  colors: `
    --qs-bg: #f0faff;
    --qs-bg-alt: #e0f2fe;
    --qs-card-bg: #ffffff;
    --qs-card-bg-alt: #e0f2fe;
    --qs-primary: #06b6d4;
    --qs-primary-fg: #ffffff;
    --qs-secondary: #38bdf8;
    --qs-secondary-fg: #075985;
    --qs-text: #075985;
    --qs-text-muted: #38bdf8;
    --qs-border: #bae6fd;
    --qs-shadow: rgba(6, 182, 214, 0.10);
  `,
});

// 5. Emerald Forest (Moody, premium dark botanical styling)
export const forestTheme = makeTheme({
  name: "Forest Green",
  description: "Deep luxury botanical shades and active mint pops",
  font: "'Urbanist', sans-serif",
  preview: { bg: "#041c16", primary: "#10b981", text: "#e6f4f1" },
  colors: `
    --qs-bg: #041c16;
    --qs-bg-alt: #082d24;
    --qs-card-bg: #0b3a2e;
    --qs-card-bg-alt: #0f4d3e;
    --qs-primary: #10b981;
    --qs-primary-fg: #041c16;
    --qs-secondary: #34d399;
    --qs-secondary-fg: #041c16;
    --qs-text: #e6f4f1;
    --qs-text-muted: #a7f3d0;
    --qs-border: #125847;
    --qs-shadow: rgba(16, 185, 129, 0.12);
  `,
});

// 6. Royal Amethyst (Premium, velvet dark purple look)
export const luxuryTheme = makeTheme({
  name: "Luxury Purple",
  description: "Deep amethyst velvet paired with vibrant magenta",
  font: "'Plus Jakarta Sans', sans-serif",
  preview: { bg: "#0f051d", primary: "#d946ef", text: "#fdf4ff" },
  colors: `
    --qs-bg: #0f051d;
    --qs-bg-alt: #1a0b32;
    --qs-card-bg: #220f43;
    --qs-card-bg-alt: #30165c;
    --qs-primary: #d946ef;
    --qs-primary-fg: #ffffff;
    --qs-secondary: #a855f7;
    --qs-secondary-fg: #ffffff;
    --qs-text: #fdf4ff;
    --qs-text-muted: #e879f9;
    --qs-border: #3c1a73;
    --qs-shadow: rgba(217, 70, 239, 0.15);
  `,
});

// 7. Midnight Neon (High-octane tech startup aesthetic)
export const midnightTheme = makeTheme({
  name: "Midnight Tech",
  description: "Deep space backdrops with glowing neon infrastructure",
  font: "'Space Grotesk', sans-serif",
  preview: { bg: "#020205", primary: "#6366f1", text: "#f8fafc" },
  colors: `
    --qs-bg: #020205;
    --qs-bg-alt: #0a0a16;
    --qs-card-bg: #111126;
    --qs-card-bg-alt: #191938;
    --qs-primary: #6366f1;
    --qs-primary-fg: #ffffff;
    --qs-secondary: #38bdf8;
    --qs-secondary-fg: #020205;
    --qs-text: #f8fafc;
    --qs-text-muted: #94a3b8;
    --qs-border: #222244;
    --qs-shadow: rgba(99, 102, 241, 0.25);
  `,
});

// 8. Sunset Coral (High-fashion vibrant energetic coral)
export const coralTheme = makeTheme({
  name: "Coral Pink",
  description: "High-contrast dynamic peach and vivid hyper-coral",
  font: "'Urbanist', sans-serif",
  preview: { bg: "#fffaf8", primary: "#ff4e3a", text: "#4a120b" },
  colors: `
    --qs-bg: #fffaf8;
    --qs-bg-alt: #ffebe5;
    --qs-card-bg: #ffffff;
    --qs-card-bg-alt: #fff5f2;
    --qs-primary: #ff4e3a;
    --qs-primary-fg: #ffffff;
    --qs-secondary: #f43f5e;
    --qs-secondary-fg: #ffffff;
    --qs-text: #4a120b;
    --qs-text-muted: #b93c2a;
    --qs-border: #ffd0c4;
    --qs-shadow: rgba(255, 78, 58, 0.08);
  `,
});

// 9. Neo-Monochrome (High fashion, avant-garde editorial look)
export const monoTheme = makeTheme({
  name: "Monochrome",
  description: "High-fashion geometric minimalism and raw contrast",
  font: "'Space Grotesk', sans-serif",
  preview: { bg: "#f8f9fa", primary: "#000000", text: "#000000" },
  colors: `
    --qs-bg: #f8f9fa;
    --qs-bg-alt: #e9ecef;
    --qs-card-bg: #ffffff;
    --qs-card-bg-alt: #f1f3f5;
    --qs-primary: #000000;
    --qs-primary-fg: #ffffff;
    --qs-secondary: #343a40;
    --qs-secondary-fg: #ffffff;
    --qs-text: #000000;
    --qs-text-muted: #6c757d;
    --qs-border: #ced4da;
    --qs-shadow: rgba(0, 0, 0, 0.15);
  `,
});

// 10. Cosmic Sunset (Psychedelic solar gradients and violet hues)
export const sunsetTheme = makeTheme({
  name: "Sunset",
  description: "Vivid solar flare gradients flashing into dark violet",
  font: "'Space Grotesk', sans-serif",
  preview: { bg: "#120516", primary: "#f97316", text: "#fdf2f8" },
  colors: `
    --qs-bg: #120516;
    --qs-bg-alt: #22092c;
    --qs-card-bg: #2d0b3b;
    --qs-card-bg-alt: #3d0f50;
    --qs-primary: #f97316;
    --qs-primary-fg: #ffffff;
    --qs-secondary: #ec4899;
    --qs-secondary-fg: #ffffff;
    --qs-text: #fdf2f8;
    --qs-text-muted: #f472b6;
    --qs-border: #4d1466;
    --qs-shadow: rgba(249, 115, 22, 0.2);
  `,
});

// 11. Steel Slate (Refined industrial tech architecture)
export const slateTheme = makeTheme({
  name: "Slate Aluminum",
  description: "Anodized aluminum surfaces with heavy structural contrast",
  font: "'Plus Jakarta Sans', sans-serif",
  preview: { bg: "#f1f5f9", primary: "#0f172a", text: "#0f172a" },
  colors: `
    --qs-bg: #f1f5f9;
    --qs-bg-alt: #e2e8f0;
    --qs-card-bg: #ffffff;
    --qs-card-bg-alt: #f8fafc;
    --qs-primary: #0f172a;
    --qs-primary-fg: #ffffff;
    --qs-secondary: #475569;
    --qs-secondary-fg: #ffffff;
    --qs-text: #0f172a;
    --qs-text-muted: #64748b;
    --qs-border: #cbd5e1;
    --qs-shadow: rgba(15, 23, 42, 0.05);
  `,
});

// 12. Hyper Mint (High energy electric health/fintech design)
export const mintTheme = makeTheme({
  name: "Mint Refresh",
  description: "Vivid radioactive matcha and deep clean pine text",
  font: "'Urbanist', sans-serif",
  preview: { bg: "#f0fdf4", primary: "#059669", text: "#064e3b" },
  colors: `
    --qs-bg: #f0fdf4;
    --qs-bg-alt: #dcfce7;
    --qs-card-bg: #ffffff;
    --qs-card-bg-alt: #f6fdf9;
    --qs-primary: #059669;
    --qs-primary-fg: #ffffff;
    --qs-secondary: #10b981;
    --qs-secondary-fg: #ffffff;
    --qs-text: #064e3b;
    --qs-text-muted: #16a34a;
    --qs-border: #bbf7d0;
    --qs-shadow: rgba(5, 150, 105, 0.08);
  `,
});

/* =========================
   SPECIALIST / THEMATIC THEMES
   ========================= */

// 13. Cyberpunk (Your Favorite — Optimized for explosive neon illumination)
export const cyberpunkTheme = makeTheme({
  name: "Cyberpunk",
  description: "High-contrast neon for the future",
  font: "'JetBrains Mono', monospace",
  preview: { bg: "#000000", primary: "#fdf500", text: "#00fff9" },
  colors: `
    --qs-bg: #000000;
    --qs-bg-alt: #111111;
    --qs-card-bg: #151515;
    --qs-card-bg-alt: #222222;
    --qs-primary: #fdf500;
    --qs-primary-fg: #000000;
    --qs-secondary: #00fff9;
    --qs-secondary-fg: #000000;
    --qs-text: #ff00ff;
    --qs-text-muted: #00fff9;
    --qs-border: #ff00ff;
    --qs-shadow: 0px 0px 15px rgba(253, 245, 0, 0.4);
  `,
});

// 14. Terminal (True radioactive fallout console setup)
export const terminalTheme = makeTheme({
  name: "Terminal",
  description: "Hyper-bright glowing phosphorus matrix interface",
  font: "'Fira Code', monospace",
  preview: { bg: "#030503", primary: "#39ff14", text: "#39ff14" },
  colors: `
    --qs-bg: #030503;
    --qs-bg-alt: #0a0f0a;
    --qs-card-bg: #0d140d;
    --qs-card-bg-alt: #142114;
    --qs-primary: #39ff14;
    --qs-primary-fg: #000000;
    --qs-secondary: #00ff66;
    --qs-secondary-fg: #000000;
    --qs-text: #39ff14;
    --qs-text-muted: #1f990d;
    --qs-border: #1f5c15;
    --qs-shadow: 0px 0px 10px rgba(57, 255, 20, 0.25);
  `,
});

// 15. Nord Arctic (Premium calibrated Scandinavian frost colors)
export const nordTheme = makeTheme({
  name: "Nord Frost",
  description: "Deep premium arctic slate balanced with bright north-lights",
  font: "'Plus Jakarta Sans', sans-serif",
  preview: { bg: "#2e3440", primary: "#88c0d0", text: "#eceff4" },
  colors: `
    --qs-bg: #2e3440;
    --qs-bg-alt: #3b4252;
    --qs-card-bg: #3b4252;
    --qs-card-bg-alt: #434c5e;
    --qs-primary: #88c0d0;
    --qs-primary-fg: #2e3440;
    --qs-secondary: #8fbcbb;
    --qs-secondary-fg: #2e3440;
    --qs-text: #eceff4;
    --qs-text-muted: #d8dee9;
    --qs-border: #4c566a;
    --qs-shadow: rgba(0, 0, 0, 0.25);
  `,
});

// 16. Vampire Dracula (Rich, dark gothic programming palette)
export const draculaTheme = makeTheme({
  name: "Dracula",
  description: "Vibrant high-contrast dark theme for night owls",
  font: "'Fira Code', monospace",
  preview: { bg: "#1e1f29", primary: "#ff79c6", text: "#f8f8f2" },
  colors: `
    --qs-bg: #1e1f29;
    --qs-bg-alt: #282a36;
    --qs-card-bg: #282a36;
    --qs-card-bg-alt: #343746;
    --qs-primary: #ff79c6;
    --qs-primary-fg: #282a36;
    --qs-secondary: #bd93f9;
    --qs-secondary-fg: #282a36;
    --qs-text: #f8f8f2;
    --qs-text-muted: #6272a4;
    --qs-border: #44475a;
    --qs-shadow: rgba(255, 121, 198, 0.15);
  `,
});

// 17. Hard Brutalist (Sharp high-impact comic layouts)
export const brutalistTheme = makeTheme({
  name: "Neo-Brutalist",
  description: "Unpolished, raw structural panels and intensive ink drops",
  font: "'Archivo Black', sans-serif",
  preview: { bg: "#ffffff", primary: "#facc15", text: "#000000" },
  colors: `
    --qs-bg: #ffffff;
    --qs-bg-alt: #f4f4f5;
    --qs-card-bg: #ffffff;
    --qs-card-bg-alt: #facc15;
    --qs-primary: #facc15;
    --qs-primary-fg: #000000;
    --qs-secondary: #3b82f6;
    --qs-secondary-fg: #ffffff;
    --qs-text: #000000;
    --qs-text-muted: #27272a;
    --qs-border: #000000;
    --qs-shadow: 6px 6px 0px #000000;
  `,
});

// 18. Retro Vaporwave (80s digital neon nostalgia)
export const vaporwaveTheme = makeTheme({
  name: "Vaporwave",
  description: "Synthesizer dream sequences, hot pinks and rad cyans",
  font: "'Syne', sans-serif",
  preview: { bg: "#18002c", primary: "#ff71ce", text: "#01cdfe" },
  colors: `
    --qs-bg: #18002c;
    --qs-bg-alt: #2b004f;
    --qs-card-bg: #2b004f;
    --qs-card-bg-alt: #410077;
    --qs-primary: #ff71ce;
    --qs-primary-fg: #ffffff;
    --qs-secondary: #01cdfe;
    --qs-secondary-fg: #ffffff;
    --qs-text: #fffb96;
    --qs-text-muted: #b967ff;
    --qs-border: #ff71ce;
    --qs-shadow: 0px 0px 12px rgba(255, 113, 206, 0.4);
  `,
});

// 19. Espresso Roast (Warm luxurious dark academic coffee shop)
export const espressoTheme = makeTheme({
  name: "Espresso",
  description: "Deep dark roasted coffee surfaces with warm cream typography",
  font: "'JetBrains Mono', monospace",
  preview: { bg: "#100b08", primary: "#e7bc91", text: "#fefae0" },
  colors: `
    --qs-bg: #100b08;
    --qs-bg-alt: #1c140e;
    --qs-card-bg: #1c140e;
    --qs-card-bg-alt: #2b1f16;
    --qs-primary: #e7bc91;
    --qs-primary-fg: #100b08;
    --qs-secondary: #bd8a5f;
    --qs-secondary-fg: #100b08;
    --qs-text: #fefae0;
    --qs-text-muted: #d4a373;
    --qs-border: #38291d;
    --qs-shadow: rgba(0, 0, 0, 0.6);
  `,
});

// 20. Luxury Paper (Editorial high-end publishing aesthetic)
export const paperTheme = makeTheme({
  name: "Editorial Paper",
  description: "Premium editorial setup crafted for deep long-form reading",
  font: "'Fraunces', serif",
  preview: { bg: "#fcfaf6", primary: "#1c1917", text: "#1c1917" },
  colors: `
    --qs-bg: #fcfaf6;
    --qs-bg-alt: #f4eee1;
    --qs-card-bg: #fdfdfc;
    --qs-card-bg-alt: #f7f3e9;
    --qs-primary: #1c1917;
    --qs-primary-fg: #fcfaf6;
    --qs-secondary: #44403c;
    --qs-secondary-fg: #ffffff;
    --qs-text: #1c1917;
    --qs-text-muted: #6b6661;
    --qs-border: #e6dfd1;
    --qs-shadow: rgba(28, 25, 23, 0.04);
  `,
});

/* =========================
   REGISTRY
   ========================= */

export const themeRegistry: Record<string, Theme> = {
  light: lightTheme,
  dark: darkTheme,
  warm: warmTheme,
  ocean: oceanTheme,
  forest: forestTheme,
  luxury: luxuryTheme,
  midnight: midnightTheme,
  coral: coralTheme,
  mono: monoTheme,
  sunset: sunsetTheme,
  slate: slateTheme,
  mint: mintTheme,
  cyberpunk: cyberpunkTheme,
  terminal: terminalTheme,
  nord: nordTheme,
  dracula: draculaTheme,
  brutalist: brutalistTheme,
  vaporwave: vaporwaveTheme,
  espresso: espressoTheme,
  paper: paperTheme,
};

export const getAllThemes = () =>
  Object.entries(themeRegistry).map(([key, theme]) => ({
    id: key,
    ...theme,
  }));

/** Compact theme list for AI site generation prompts */
export const getThemeOptionsForAI = () =>
  Object.entries(themeRegistry).map(([id, theme]) => ({
    id,
    name: theme.name,
    description: theme.description,
  }));

export const isValidThemeId = (id: string): boolean =>
  Object.hasOwn(themeRegistry, id);

export const getTheme = (id: string): Theme => {
  return themeRegistry[id] || lightTheme;
};
