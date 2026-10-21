import type {
  MapeadoresMap,
  MapeadoresMapStats,
} from "@/types/mapeadores-map";

export type MapProgressCommunity = "mapeadores" | "gfl";

export interface CommunityMapSheet {
  communityId: MapProgressCommunity;
  apiPath: string;
  pagePath: string;
  title: string;
  description: string;
  attribution: string;
}

export const COMMUNITY_MAP_SHEETS: Record<
  MapProgressCommunity,
  CommunityMapSheet
> = {
  mapeadores: {
    communityId: "mapeadores",
    apiPath: "/api/mapeadores/maps",
    pagePath: "/mapeadores/maps",
    title: "Mapeadores Map Progress",
    description:
      "Community map completion — auto-refreshes every minute.",
    attribution: "Map progress data provided by the Mapeadores community.",
  },
  gfl: {
    communityId: "gfl",
    apiPath: "/api/gfl/maps",
    pagePath: "/gfl/maps",
    title: "GFL Map Progress",
    description:
      "Games For Life map completion — auto-refreshes every minute.",
    attribution: "Map progress data provided by the GFL community.",
  },
};

export function hasMapProgress(
  community: string,
): community is MapProgressCommunity {
  return community in COMMUNITY_MAP_SHEETS;
}

export type { MapeadoresMap as CommunityMap, MapeadoresMapStats as CommunityMapStats };
