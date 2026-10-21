export const LOCALES = [
  { code: "en", label: "English", nativeLabel: "English", tag: "en" },
  { code: "de", label: "German", nativeLabel: "Deutsch", tag: "de" },
  { code: "es", label: "Spanish", nativeLabel: "Español", tag: "es" },
  { code: "fr", label: "French", nativeLabel: "Français", tag: "fr" },
  { code: "zh", label: "Chinese", nativeLabel: "中文", tag: "zh-CN" },
  { code: "ja", label: "Japanese", nativeLabel: "日本語", tag: "ja" },
  { code: "ru", label: "Russian", nativeLabel: "Русский", tag: "ru" },
  { code: "ko", label: "Korean", nativeLabel: "한국어", tag: "ko" },
] as const;

export type Locale = (typeof LOCALES)[number]["code"];

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_STORAGE_KEY = "ze-locale";

export function isLocale(value: string): value is Locale {
  return LOCALES.some((l) => l.code === value);
}

export function localeTag(code: Locale): string {
  return LOCALES.find((l) => l.code === code)?.tag ?? "en";
}
