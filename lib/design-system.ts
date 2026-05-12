/**
 * Premium Design System
 * Global design tokens and utilities for world-class UI
 */

// Premium color palette
export const premiumColors = {
  brand: {
    light: "from-indigo-500 to-purple-600",
    dark: "from-indigo-950 to-purple-950",
  },
  accent: {
    cyan: "from-cyan-400 to-blue-500",
    emerald: "from-emerald-400 to-teal-500",
    rose: "from-rose-400 to-pink-500",
  },
  neutral: {
    light: "#f8f9fa",
    dark: "#0f1419",
  },
};

// Premium shadows
export const premiumShadows = {
  xs: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  sm: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  glow: {
    brand: "0 0 20px rgba(99, 102, 241, 0.3)",
    cyan: "0 0 20px rgba(34, 211, 238, 0.3)",
    rose: "0 0 20px rgba(244, 63, 94, 0.3)",
  },
};

// Premium animations
export const premiumAnimations = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideIn: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
  slideInX: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },
  float: {
    animate: {
      y: [0, -10, 0],
    },
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
  pulse: {
    animate: {
      opacity: [1, 0.5, 1],
    },
    transition: {
      duration: 2,
      repeat: Infinity,
    },
  },
};

// Typography hierarchy
export const typographyClasses = {
  "display-lg": "text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight",
  "display-md": "text-4xl sm:text-5xl font-bold tracking-tight",
  "display-sm": "text-3xl sm:text-4xl font-bold tracking-tight",
  "heading-lg": "text-2xl sm:text-3xl font-bold",
  "heading-md": "text-xl sm:text-2xl font-bold",
  "heading-sm": "text-lg font-semibold",
  "body-lg": "text-lg leading-relaxed",
  "body-md": "text-base leading-relaxed",
  "body-sm": "text-sm leading-relaxed",
};

// Glass effect utilities
export const glassEffects = {
  light: "backdrop-blur-xl bg-white/80 border border-white/20",
  dark: "backdrop-blur-xl bg-black/50 border border-white/10",
  premium: "backdrop-blur-2xl bg-gradient-to-br from-white/80 to-white/40 border border-white/20",
};

// Spacing system (8px base)
export const spacing = {
  xs: "0.5rem",
  sm: "1rem",
  md: "1.5rem",
  lg: "2rem",
  xl: "3rem",
  "2xl": "4rem",
  "3xl": "6rem",
};

// Border radius
export const borderRadius = {
  sm: "0.5rem",
  md: "0.75rem",
  lg: "1rem",
  xl: "1.5rem",
  "2xl": "2rem",
  "3xl": "3rem",
  full: "9999px",
};

// Responsive breakpoints
export const breakpoints = {
  xs: "0px",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
};

// Transition durations
export const transitions = {
  fast: "150ms",
  base: "200ms",
  slow: "300ms",
  slower: "500ms",
};

export const easing = {
  ease: "cubic-bezier(0.4, 0, 0.2, 1)",
  easeIn: "cubic-bezier(0.4, 0, 1, 1)",
  easeOut: "cubic-bezier(0, 0, 0.2, 1)",
  easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
};

// Z-index system
export const zIndex = {
  hide: "-10",
  base: "0",
  docked: "10",
  dropdown: "1000",
  sticky: "1020",
  fixed: "1030",
  offcanvas: "1040",
  modal: "1050",
  popover: "1060",
  tooltip: "1070",
  notification: "1080",
};
