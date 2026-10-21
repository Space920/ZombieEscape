/**
 * Seasonal Halloween skin.
 * Ends 1 Nov 2026, 00:01 Europe/Berlin (CET, UTC+1 after DST).
 */
export const HALLOWEEN_ENDS_AT_MS = Date.parse(
  "2026-11-01T00:01:00+01:00",
);

export const HALLOWEEN_THEME_ATTR = "data-theme";
export const HALLOWEEN_THEME_VALUE = "halloween";
export const HALLOWEEN_PREF_KEY = "ze-halloween";

export function isHalloweenActive(now = Date.now()): boolean {
  return now < HALLOWEEN_ENDS_AT_MS;
}

export function readHalloweenEnabled(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return window.localStorage.getItem(HALLOWEEN_PREF_KEY) !== "off";
  } catch {
    return true;
  }
}

export function applyHalloweenTheme(enabled: boolean) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (enabled && isHalloweenActive()) {
    root.setAttribute(HALLOWEEN_THEME_ATTR, HALLOWEEN_THEME_VALUE);
    return;
  }
  if (root.getAttribute(HALLOWEEN_THEME_ATTR) === HALLOWEEN_THEME_VALUE) {
    root.removeAttribute(HALLOWEEN_THEME_ATTR);
  }
}

export function rememberHalloweenEnabled(enabled: boolean) {
  try {
    window.localStorage.setItem(HALLOWEEN_PREF_KEY, enabled ? "on" : "off");
  } catch {
    /* private mode */
  }
  applyHalloweenTheme(enabled);
}

export const HALLOWEEN_BOOTSTRAP_SCRIPT = `(function(){var on=true;try{on=localStorage.getItem("${HALLOWEEN_PREF_KEY}")!=="off"}catch(e){}if(on&&Date.now()<${HALLOWEEN_ENDS_AT_MS})document.documentElement.setAttribute("${HALLOWEEN_THEME_ATTR}","${HALLOWEEN_THEME_VALUE}")})();`;

export function clearHalloweenTheme() {
  applyHalloweenTheme(false);
}
