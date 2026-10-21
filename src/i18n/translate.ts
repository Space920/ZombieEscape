import type { Messages } from "@/i18n/messages";

export function interpolate(
  template: string,
  values?: Record<string, string | number>,
): string {
  if (!values) return template;
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    values[key] != null ? String(values[key]) : `{${key}}`,
  );
}

export function createTranslator(messages: Messages) {
  return function t(
    path: string,
    values?: Record<string, string | number>,
  ): string {
    const [section, key] = path.split(".") as [keyof Messages, string];
    const bucket = messages[section] as unknown as
      | Record<string, string>
      | undefined;
    const raw = bucket?.[key];
    if (typeof raw !== "string") return path;
    return interpolate(raw, values);
  };
}

export type Translator = ReturnType<typeof createTranslator>;

export function translateRegion(
  messages: Messages,
  code: string,
): string {
  const regions = messages.regions as Record<string, string>;
  return regions[code] ?? code;
}
