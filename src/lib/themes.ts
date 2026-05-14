// lib/theme.ts

/**
 * GOOGLE FONTS REQUIRED
 * 
 * Add these links to your <head> or import them in your layout/root:
 * 
 * ```html
 * <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500&family=Fira+Code:wght@400;500&family=Archivo+Black&display=swap" rel="stylesheet">
 * ```
 * 
 * Or using @import in your global CSS:
 * ```css
 * @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500&family=Fira+Code:wght@400;500&family=Archivo+Black&display=swap');
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
   RESTYLED THEMES
   ========================= */

// 1. Light Modern
export const lightTheme = makeTheme({
  name: "Light",
  description: "Clean and minimal light theme",
  font: "'Inter', system-ui, sans-serif",
  preview: { bg: "#ffffff", primary: "#2563eb", text: "#0f172a" },
  colors: `
    --qs-bg: #ffffff;
    --qs-bg-alt: #f8fafc;
    --qs-card-bg: #ffffff;
    --qs-card-bg-alt: #f8fafc;
    --qs-primary: #2563eb;
    --qs-primary-fg: #ffffff;
    --qs-secondary: #0ea5e9;
    --qs-secondary-fg: #ffffff;
    --qs-text: #0f172a;
    --qs-text-muted: #64748b;
    --qs-border: #e2e8f0;
    --qs-shadow: rgba(0, 0, 0, 0.06);
  `,
});

// 2. Dark Modern
export const darkTheme = makeTheme({
  name: "Dark",
  description: "Sleek dark theme for modern brands",
  font: "'Inter', system-ui, sans-serif",
  preview: { bg: "#0f172a", primary: "#3b82f6", text: "#f1f5f9" },
  colors: `
    --qs-bg: #0f172a;
    --qs-bg-alt: #1e293b;
    --qs-card-bg: #1e293b;
    --qs-card-bg-alt: #334155;
    --qs-primary: #3b82f6;
    --qs-primary-fg: #ffffff;
    --qs-secondary: #8b5cf6;
    --qs-secondary-fg: #ffffff;
    --qs-text: #f1f5f9;
    --qs-text-muted: #94a3b8;
    --qs-border: #334155;
    --qs-shadow: rgba(0, 0, 0, 0.35);
  `,
});

// 3. Warm Beige
export const warmTheme = makeTheme({
  name: "Warm",
  description: "Cozy beige tones for lifestyle brands",
  font: "'DM Sans', sans-serif",
  preview: { bg: "#faf8f5", primary: "#d97706", text: "#292524" },
  colors: `
    --qs-bg: #faf8f5;
    --qs-bg-alt: #f5f0e8;
    --qs-card-bg: #ffffff;
    --qs-card-bg-alt: #f8f4ed;
    --qs-primary: #d97706;
    --qs-primary-fg: #ffffff;
    --qs-secondary: #ea580c;
    --qs-secondary-fg: #ffffff;
    --qs-text: #292524;
    --qs-text-muted: #78716c;
    --qs-border: #e7e5e4;
    --qs-shadow: rgba(0, 0, 0, 0.05);
  `,
});

// 4. Ocean Blue
export const oceanTheme = makeTheme({
  name: "Ocean",
  description: "Calming blue palette for professional sites",
  font: "'Inter', sans-serif",
  preview: { bg: "#f0f9ff", primary: "#0369a1", text: "#0c4a6e" },
  colors: `
    --qs-bg: #f0f9ff;
    --qs-bg-alt: #e0f2fe;
    --qs-card-bg: #ffffff;
    --qs-card-bg-alt: #f0f9ff;
    --qs-primary: #0369a1;
    --qs-primary-fg: #ffffff;
    --qs-secondary: #0891b2;
    --qs-secondary-fg: #ffffff;
    --qs-text: #0c4a6e;
    --qs-text-muted: #0284c7;
    --qs-border: #bae6fd;
    --qs-shadow: rgba(14, 165, 233, 0.1);
  `,
});

// 5. Forest Green
export const forestTheme = makeTheme({
  name: "Forest",
  description: "Natural green for eco and wellness brands",
  font: "'DM Sans', sans-serif",
  preview: { bg: "#f0fdf4", primary: "#15803d", text: "#14532d" },
  colors: `
    --qs-bg: #f0fdf4;
    --qs-bg-alt: #e6f4eb;
    --qs-card-bg: #ffffff;
    --qs-card-bg-alt: #f0fdf4;
    --qs-primary: #15803d;
    --qs-primary-fg: #ffffff;
    --qs-secondary: #059669;
    --qs-secondary-fg: #ffffff;
    --qs-text: #14532d;
    --qs-text-muted: #166534;
    --qs-border: #bbf7d0;
    --qs-shadow: rgba(34, 197, 94, 0.1);
  `,
});

// 6. Purple Luxury
export const luxuryTheme = makeTheme({
  name: "Luxury",
  description: "Premium purple for high-end brands",
  font: "'Inter', sans-serif",
  preview: { bg: "#faf5ff", primary: "#7c3aed", text: "#581c87" },
  colors: `
    --qs-bg: #faf5ff;
    --qs-bg-alt: #f3e8ff;
    --qs-card-bg: #ffffff;
    --qs-card-bg-alt: #faf5ff;
    --qs-primary: #7c3aed;
    --qs-primary-fg: #ffffff;
    --qs-secondary: #a855f7;
    --qs-secondary-fg: #ffffff;
    --qs-text: #581c87;
    --qs-text-muted: #6b21a8;
    --qs-border: #e9d5ff;
    --qs-shadow: rgba(168, 85, 247, 0.1);
  `,
});

// 7. Midnight (Tech-Dark)
export const midnightTheme = makeTheme({
  name: "Midnight",
  description: "Deep blue-black for tech and startups",
  font: "'Inter', sans-serif",
  preview: { bg: "#020617", primary: "#06b6d4", text: "#f8fafc" },
  colors: `
    --qs-bg: #020617;
    --qs-bg-alt: #0f172a;
    --qs-card-bg: #1e293b;
    --qs-card-bg-alt: #334155;
    --qs-primary: #06b6d4;
    --qs-primary-fg: #020617;
    --qs-secondary: #14b8a6;
    --qs-secondary-fg: #020617;
    --qs-text: #f8fafc;
    --qs-text-muted: #94a3b8;
    --qs-border: #1e293b;
    --qs-shadow: rgba(6, 182, 212, 0.2);
  `,
});

// 8. Coral Pink
export const coralTheme = makeTheme({
  name: "Coral",
  description: "Vibrant coral for creative brands",
  font: "'DM Sans', sans-serif",
  preview: { bg: "#fff7ed", primary: "#ea580c", text: "#7c2d12" },
  colors: `
    --qs-bg: #fff7ed;
    --qs-bg-alt: #ffe6d1;
    --qs-card-bg: #ffffff;
    --qs-card-bg-alt: #fff7ed;
    --qs-primary: #ea580c;
    --qs-primary-fg: #ffffff;
    --qs-secondary: #f97316;
    --qs-secondary-fg: #ffffff;
    --qs-text: #7c2d12;
    --qs-text-muted: #c2410c;
    --qs-border: #fed7aa;
    --qs-shadow: rgba(249, 115, 22, 0.1);
  `,
});

// 9. Monochrome
export const monoTheme = makeTheme({
  name: "Mono",
  description: "Bold black and white minimalism",
  font: "'Space Grotesk', sans-serif",
  preview: { bg: "#fafafa", primary: "#0a0a0a", text: "#0a0a0a" },
  colors: `
    --qs-bg: #fafafa;
    --qs-bg-alt: #f4f4f5;
    --qs-card-bg: #ffffff;
    --qs-card-bg-alt: #fafafa;
    --qs-primary: #0a0a0a;
    --qs-primary-fg: #ffffff;
    --qs-secondary: #404040;
    --qs-secondary-fg: #ffffff;
    --qs-text: #0a0a0a;
    --qs-text-muted: #737373;
    --qs-border: #e5e5e5;
    --qs-shadow: rgba(0, 0, 0, 0.08);
  `,
});

// 10. Sunset
export const sunsetTheme = makeTheme({
  name: "Sunset",
  description: "Warm gradient vibes",
  font: "'DM Sans', sans-serif",
  preview: { bg: "#fef3c7", primary: "#dc2626", text: "#7c2d12" },
  colors: `
    --qs-bg: #fef3c7;
    --qs-bg-alt: #fde68a;
    --qs-card-bg: #fffbeb;
    --qs-card-bg-alt: #fef3c7;
    --qs-primary: #dc2626;
    --qs-primary-fg: #ffffff;
    --qs-secondary: #f59e0b;
    --qs-secondary-fg: #ffffff;
    --qs-text: #7c2d12;
    --qs-text-muted: #b45309;
    --qs-border: #fde68a;
    --qs-shadow: rgba(245, 158, 11, 0.15);
  `,
});

// 11. Slate
export const slateTheme = makeTheme({
  name: "Slate",
  description: "Sophisticated gray for corporate",
  font: "'Inter', sans-serif",
  preview: { bg: "#f8fafc", primary: "#475569", text: "#0f172a" },
  colors: `
    --qs-bg: #f8fafc;
    --qs-bg-alt: #f1f5f9;
    --qs-card-bg: #ffffff;
    --qs-card-bg-alt: #f8fafc;
    --qs-primary: #475569;
    --qs-primary-fg: #ffffff;
    --qs-secondary: #64748b;
    --qs-secondary-fg: #ffffff;
    --qs-text: #0f172a;
    --qs-text-muted: #64748b;
    --qs-border: #e2e8f0;
    --qs-shadow: rgba(71, 85, 105, 0.08);
  `,
});

// 12. Mint
export const mintTheme = makeTheme({
  name: "Mint",
  description: "Fresh mint for health",
  font: "'DM Sans', sans-serif",
  preview: { bg: "#ecfdf5", primary: "#10b981", text: "#064e3b" },
  colors: `
    --qs-bg: #ecfdf5;
    --qs-bg-alt: #d1fae5;
    --qs-card-bg: #ffffff;
    --qs-card-bg-alt: #ecfdf5;
    --qs-primary: #10b981;
    --qs-primary-fg: #ffffff;
    --qs-secondary: #14b8a6;
    --qs-secondary-fg: #ffffff;
    --qs-text: #064e3b;
    --qs-text-muted: #059669;
    --qs-border: #a7f3d0;
    --qs-shadow: rgba(16, 185, 129, 0.1);
  `,
});

/* =========================
   SPECIAL / TECH THEMES
   ========================= */

// 13. Cyberpunk
export const cyberpunkTheme = makeTheme({
  name: "Cyberpunk",
  description: "High-contrast neon for the future",
  font: "'JetBrains Mono', monospace",
  preview: { bg: "#050505", primary: "#fdf500", text: "#00fff9" },
  colors: `
    --qs-bg: #050505;
    --qs-bg-alt: #1a1a1a;
    --qs-card-bg: #1a1a1a;
    --qs-card-bg-alt: #2a2a2a;
    --qs-primary: #fdf500;
    --qs-primary-fg: #050505;
    --qs-secondary: #00fff9;
    --qs-secondary-fg: #050505;
    --qs-text: #ff00ff;
    --qs-text-muted: #00fff9;
    --qs-border: #333333;
    --qs-shadow: rgba(253, 245, 0, 0.25);
  `,
});

// 14. Terminal
export const terminalTheme = makeTheme({
  name: "Terminal",
  description: "Classic green-on-black console",
  font: "'Fira Code', monospace",
  preview: { bg: "#0a0a0a", primary: "#22c55e", text: "#22c55e" },
  colors: `
    --qs-bg: #0a0a0a;
    --qs-bg-alt: #111111;
    --qs-card-bg: #111111;
    --qs-card-bg-alt: #1a1a1a;
    --qs-primary: #22c55e;
    --qs-primary-fg: #000000;
    --qs-secondary: #4ade80;
    --qs-secondary-fg: #000000;
    --qs-text: #4ade80;
    --qs-text-muted: #86efac;
    --qs-border: #14532d;
    --qs-shadow: rgba(34, 197, 94, 0.15);
  `,
});

// 15. Nord
export const nordTheme = makeTheme({
  name: "Nord",
  description: "Arctic, north-bluish clean tech",
  font: "'Inter', sans-serif",
  preview: { bg: "#2e3440", primary: "#88c0d0", text: "#eceff4" },
  colors: `
    --qs-bg: #2e3440;
    --qs-bg-alt: #3b4252;
    --qs-card-bg: #3b4252;
    --qs-card-bg-alt: #434c5e;
    --qs-primary: #88c0d0;
    --qs-primary-fg: #2e3440;
    --qs-secondary: #81a1c1;
    --qs-secondary-fg: #2e3440;
    --qs-text: #eceff4;
    --qs-text-muted: #d8dee9;
    --qs-border: #4c566a;
    --qs-shadow: rgba(0, 0, 0, 0.3);
  `,
});

// 16. Dracula
export const draculaTheme = makeTheme({
  name: "Dracula",
  description: "Popular dark theme for developers",
  font: "'Fira Code', monospace",
  preview: { bg: "#282a36", primary: "#bd93f9", text: "#f8f8f2" },
  colors: `
    --qs-bg: #282a36;
    --qs-bg-alt: #44475a;
    --qs-card-bg: #44475a;
    --qs-card-bg-alt: #4f5269;
    --qs-primary: #bd93f9;
    --qs-primary-fg: #282a36;
    --qs-secondary: #ff79c6;
    --qs-secondary-fg: #282a36;
    --qs-text: #f8f8f2;
    --qs-text-muted: #6272a4;
    --qs-border: #44475a;
    --qs-shadow: rgba(189, 147, 249, 0.15);
  `,
});

// 17. Brutalist
export const brutalistTheme = makeTheme({
  name: "Brutalist",
  description: "Raw, unpolished, high-impact",
  font: "'Archivo Black', sans-serif",
  preview: { bg: "#ffffff", primary: "#000000", text: "#000000" },
  colors: `
    --qs-bg: #ffffff;
    --qs-bg-alt: #f4f4f5;
    --qs-card-bg: #ffffff;
    --qs-card-bg-alt: #fafafa;
    --qs-primary: #000000;
    --qs-primary-fg: #ffffff;
    --qs-secondary: #ff0000;
    --qs-secondary-fg: #ffffff;
    --qs-text: #000000;
    --qs-text-muted: #262626;
    --qs-border: #000000;
    --qs-shadow: 6px 6px 0px #000000;
  `,
});

// 18. Vaporwave
export const vaporwaveTheme = makeTheme({
  name: "Vaporwave",
  description: "80s aesthetics and digital nostalgia",
  font: "'Space Grotesk', sans-serif",
  preview: { bg: "#2d0a4e", primary: "#ff71ce", text: "#01cdfe" },
  colors: `
    --qs-bg: #2d0a4e;
    --qs-bg-alt: #1f0738;
    --qs-card-bg: #3a0f5e;
    --qs-card-bg-alt: #2d0a4e;
    --qs-primary: #ff71ce;
    --qs-primary-fg: #ffffff;
    --qs-secondary: #01cdfe;
    --qs-secondary-fg: #ffffff;
    --qs-text: #fffb96;
    --qs-text-muted: #b967ff;
    --qs-border: #ff71ce;
    --qs-shadow: rgba(255, 113, 206, 0.35);
  `,
});

// 19. Espresso
export const espressoTheme = makeTheme({
  name: "Espresso",
  description: "Rich dark browns for late-night coding",
  font: "'JetBrains Mono', monospace",
  preview: { bg: "#1a1614", primary: "#d4a373", text: "#fefae0" },
  colors: `
    --qs-bg: #1a1614;
    --qs-bg-alt: #2c2420;
    --qs-card-bg: #2c2420;
    --qs-card-bg-alt: #3a2f2a;
    --qs-primary: #d4a373;
    --qs-primary-fg: #1a1614;
    --qs-secondary: #c19a6b;
    --qs-secondary-fg: #1a1614;
    --qs-text: #fefae0;
    --qs-text-muted: #e6d5b8;
    --qs-border: #3f342f;
    --qs-shadow: rgba(0, 0, 0, 0.45);
  `,
});

// 20. Paper
export const paperTheme = makeTheme({
  name: "Paper",
  description: "Optimized for long-form reading",
  font: "'Georgia', serif",
  preview: { bg: "#f4f1ea", primary: "#2c2c2c", text: "#1a1a1a" },
  colors: `
    --qs-bg: #f4f1ea;
    --qs-bg-alt: #e8e4d9;
    --qs-card-bg: #f9f6f0;
    --qs-card-bg-alt: #f0ede4;
    --qs-primary: #2c2c2c;
    --qs-primary-fg: #f4f1ea;
    --qs-secondary: #5a5a5a;
    --qs-secondary-fg: #ffffff;
    --qs-text: #1a1a1a;
    --qs-text-muted: #666666;
    --qs-border: #dcd7c9;
    --qs-shadow: rgba(0, 0, 0, 0.06);
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

export const getTheme = (id: string): Theme => {
  return themeRegistry[id] || lightTheme;
};