/**
 * ThemeContext — provides dynamic brand tokens based on the current dark/light mode.
 * Usage: const brand = useBrand();
 */
import { useMemo } from "react";
import { useMaterialUIController } from "context";
import { getBrandTokens } from "assets/theme/base/brand";

/**
 * Hook that returns the brand tokens matching the current darkMode state.
 * @returns {object} brand tokens for the active theme
 */
export function useBrand() {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const brand = useMemo(() => getBrandTokens(darkMode), [darkMode]);
  return brand;
}
