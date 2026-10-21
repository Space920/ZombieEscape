export type MapStatus = "beaten" | "unbeaten" | "removed";

export interface MapeadoresMap {
  name: string;
  status: MapStatus;
  beaten: boolean;
  levels?: string;
  information?: string;
}

export interface MapeadoresMapStats {
  total: number;
  beaten: number;
  unbeaten: number;
  removed: number;
  completionPercent: number;
}

export interface MapeadoresMapsResponse {
  maps: MapeadoresMap[];
  stats: MapeadoresMapStats;
  syncedAt: string;
  sourceUrl: string;
}

export type MapFilter = "all" | "beaten" | "unbeaten";
export type MapSort = "az" | "za" | "status";
