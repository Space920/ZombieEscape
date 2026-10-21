import type { ServerEntry } from "@/types/server";
import { COMMUNITIES } from "@/data/communities";

/** Human-readable game label for SEO copy — matches actual server data. */
export function gameSeoLabel(game: ServerEntry["game"]): string {
  switch (game) {
    case "cs2":
      return "CS2";
    case "css":
      return "CS:S";
    case "csgo":
      return "CS:GO";
  }
}

export function gameZePhrase(game: ServerEntry["game"]): string {
  switch (game) {
    case "cs2":
      return "CS2 Zombie Escape";
    case "css":
      return "Counter-Strike: Source Zombie Escape";
    case "csgo":
      return "CS:GO Zombie Escape";
  }
}

export function serverPageTitle(entry: ServerEntry): string {
  const community = COMMUNITIES[entry.community].shortLabel;
  return `${community} ${gameZePhrase(entry.game)} Server`;
}

export function serverPageDescription(entry: ServerEntry): string {
  const community = COMMUNITIES[entry.community].label;
  const game = gameZePhrase(entry.game);
  return `Live ${game} server operated by ${community}. Check player count, current map and connect directly — ${entry.host}:${entry.port}.`;
}

export const CS2_SERVER_COUNT = 15;
export const CSS_SERVER_COUNT = 1;
export const TOTAL_TRACKED = 16;
