import type {
  MapeadoresMap,
  MapeadoresMapStats,
} from "@/types/mapeadores-map";

const MAP_NAME_PATTERN = /^z[em]_/i;

function parseRow(cols: string[]): MapeadoresMap | null {
  const statusCol = cols[0]?.trim() ?? "";
  const mapName = cols[1]?.trim() ?? "";

  if (!mapName || mapName === "Map Name" || !MAP_NAME_PATTERN.test(mapName)) {
    return null;
  }

  let status: MapeadoresMap["status"];
  if (statusCol === "Yes") status = "beaten";
  else if (statusCol === "No") status = "unbeaten";
  else if (statusCol === "Removed") status = "removed";
  else return null;

  return {
    name: mapName,
    status,
    beaten: status === "beaten",
    levels: cols[2]?.trim() || undefined,
    information: cols[3]?.trim() || undefined,
  };
}

/** Parse the Mapeadores public CSV export (columns: Status, Map Name, Levels, Information). */
export function parseMapeadoresCSV(csv: string): MapeadoresMap[] {
  const maps: MapeadoresMap[] = [];

  for (const line of csv.split(/\r?\n/)) {
    if (!line.trim()) continue;
    const cols = line.split(",");
    const map = parseRow(cols);
    if (map) maps.push(map);
  }

  return maps.sort((a, b) => a.name.localeCompare(b.name));
}

export function computeMapStats(maps: MapeadoresMap[]): MapeadoresMapStats {
  const beaten = maps.filter((m) => m.status === "beaten").length;
  const unbeaten = maps.filter((m) => m.status === "unbeaten").length;
  const removed = maps.filter((m) => m.status === "removed").length;
  const total = maps.length;

  return {
    total,
    beaten,
    unbeaten,
    removed,
    completionPercent:
      total > 0 ? Math.round((beaten / total) * 1000) / 10 : 0,
  };
}
