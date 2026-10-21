/**
 * Seasonal Halloween skin.
 * Ends 1 Nov 2026, 00:01 Europe/Berlin (CET, UTC+1 after DST).
 */
export const HALLOWEEN_ENDS_AT_MS = Date.parse(
  "2026-11-01T00:01:00+01:00",
);

export const HALLOWEEN_THEME_ATTR = "data-theme";
export const HALLOWEEN_THEME_VALUE = "halloween";

export function isHalloweenActive(now = Date.now()): boolean {
  return now < HALLOWEEN_ENDS_AT_MS;
}

export const HALLOWEEN_BOOTSTRAP_SCRIPT = `(function(){if(Date.now()<${HALLOWEEN_ENDS_AT_MS})document.documentElement.setAttribute("${HALLOWEEN_THEME_ATTR}","${HALLOWEEN_THEME_VALUE}")})();`;

export function clearHalloweenTheme() {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (root.getAttribute(HALLOWEEN_THEME_ATTR) === HALLOWEEN_THEME_VALUE) {
    root.removeAttribute(HALLOWEEN_THEME_ATTR);
  }
}
