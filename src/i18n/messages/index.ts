import type { Locale } from "@/i18n/config";
import type { Messages } from "./en";
import en from "./en";
import de from "./de";
import es from "./es";
import fr from "./fr";
import zh from "./zh";
import ja from "./ja";
import ru from "./ru";
import ko from "./ko";

const catalogs: Record<Locale, Messages> = {
  en,
  de,
  es,
  fr,
  zh,
  ja,
  ru,
  ko,
};

export function getMessages(locale: Locale): Messages {
  return catalogs[locale] ?? en;
}

export type { Messages };
