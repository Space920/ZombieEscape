import type { MapeadoresMap } from "@/types/mapeadores-map";

const MAP_NAME_PATTERN = /^z[em]_/i;

/** Parse CSV text into rows, respecting quoted fields and newlines inside quotes. */
export function parseCsvRows(csv: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < csv.length; i++) {
    const c = csv[i];

    if (inQuotes) {
      if (c === '"') {
        if (csv[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
      continue;
    }

    if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (c === "\r") {
      // ignore CR; LF handles the row break
    } else {
      field += c;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

function normalizeStatus(raw: string): MapeadoresMap["status"] | null {
  const value = raw.trim().toLowerCase();
  if (value === "yes") return "beaten";
  if (value === "no") return "unbeaten";
  if (value === "removed") return "removed";
  return null;
}

function rowToMap(cols: string[]): MapeadoresMap | null {
  const status = normalizeStatus(cols[0] ?? "");
  const mapName = (cols[1] ?? "").trim();

  if (!status || !mapName || !MAP_NAME_PATTERN.test(mapName)) {
    return null;
  }

  const levels = (cols[2] ?? "").trim();
  const information = (cols[3] ?? "").trim().replace(/\s+/g, " ");

  return {
    name: mapName,
    status,
    beaten: status === "beaten",
    levels: levels || undefined,
    information: information || undefined,
  };
}

/**
 * Parse GFL public CSV export.
 * Columns: Beaten, Map, Levels, Level Info (YES/NO status).
 * Header/meta rows above the map list are skipped.
 */
export function parseGflCSV(csv: string): MapeadoresMap[] {
  const maps: MapeadoresMap[] = [];

  for (const cols of parseCsvRows(csv)) {
    const map = rowToMap(cols);
    if (map) maps.push(map);
  }

  return maps.sort((a, b) => a.name.localeCompare(b.name));
}
