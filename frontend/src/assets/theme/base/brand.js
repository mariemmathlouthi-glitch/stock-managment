/**
 * StockFlow brand tokens — light & dark variants.
 * Keep accent colors consistent with the login page identity.
 */

const shared = {
  accent: "#b02a46",
  accentLight: "#db5971",
  accentDark: "#751429",
  accentHoverStart: "#8c1c34",
  accentHoverEnd: "#c4405a",
  gradient: "linear-gradient(135deg, #b02a46 0%, #751429 100%)",
  gradientButton: "linear-gradient(135deg, #b02a46 0%, #db5971 100%)",
  gradientButtonHover: "linear-gradient(135deg, #8c1c34 0%, #c4405a 100%)",
  shadowAccent: "0 4px 14px 0 rgba(176, 42, 70, 0.39)",
  shadowAccentHover: "0 6px 20px 0 rgba(176, 42, 70, 0.45)",
};

const dark = {
  ...shared,
  mode: "dark",
  dark: "#1a1215",
  darkSurface: "#241a1e",
  darkElevated: "#2d2226",
  pageBg: "#110b0e",
  cardBg: "#1a1114",
  inputBg: "#22171c",
  inputBorder: "#3a2830",
  iconMuted: "#8e7c82",
  textPrimary: "#ffffff",
  textSecondary: "#a89a9f",
  shadowCard: "0 2px 12px rgba(0, 0, 0, 0.4)",
  shadowCardHover: "0 8px 28px rgba(0, 0, 0, 0.6)",
  shadowSidebar: "4px 0 24px rgba(0, 0, 0, 0.5)",
  rowHover: "rgba(176,42,70,0.03)",
  iconBoxBg: "rgba(176,42,70,0.1)",
  status: {
    success: { color: "#4ade80", bg: "rgba(74,222,128,0.15)" },
    warning: { color: "#fbbf24", bg: "rgba(251,191,36,0.15)" },
    error: { color: "#f87171", bg: "rgba(248,113,113,0.15)" },
    info: { color: "#818cf8", bg: "rgba(129,140,248,0.15)" },
  },
};

const light = {
  ...shared,
  mode: "light",
  dark: "#1a1215",
  darkSurface: "#f8f4f5",
  darkElevated: "#ffffff",
  pageBg: "#f5f0f2",
  cardBg: "#ffffff",
  inputBg: "#f8f4f5",
  inputBorder: "#e8dce0",
  iconMuted: "#8e7c82",
  textPrimary: "#1a1215",
  textSecondary: "#6b5c62",
  shadowCard: "0 2px 12px rgba(26, 18, 21, 0.08)",
  shadowCardHover: "0 8px 28px rgba(26, 18, 21, 0.12)",
  shadowSidebar: "4px 0 24px rgba(26, 18, 21, 0.08)",
  rowHover: "rgba(176,42,70,0.04)",
  iconBoxBg: "rgba(176,42,70,0.08)",
  status: {
    success: { color: "#16a34a", bg: "rgba(22,163,74,0.12)" },
    warning: { color: "#d97706", bg: "rgba(217,119,6,0.12)" },
    error: { color: "#dc2626", bg: "rgba(220,38,38,0.12)" },
    info: { color: "#4f46e5", bg: "rgba(79,70,229,0.12)" },
  },
};

/** Default export keeps current dark look for any existing imports */
const brand = dark;

/**
 * Returns the correct brand palette for the current theme mode.
 * @param {boolean} isDark
 */
export function getBrand(isDark = true) {
  return isDark ? dark : light;
}

export { dark as brandDark, light as brandLight };
export default brand;
