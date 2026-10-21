import type { CommunityId } from "@/types/server";

/** Tried in order when loading logos from /public/communities/ */
export const COMMUNITY_LOGO_EXTENSIONS = [
  ".png",
  ".webp",
  ".svg",
  ".ico",
] as const;

export interface CommunityMeta {
  id: CommunityId;
  label: string;
  shortLabel: string;
  filterLabel: string;
  accent: string;
  accentDim: string;
  initials: string;
  /** Base filename without extension in /public/communities/ */
  logoFile: string;
  /** If set, only try this extension (skip probing others) */
  logoExtension?: string;
  /** Official community website */
  website?: string;
  /** Official community Discord invite */
  discord?: string;
}

export const COMMUNITIES: Record<CommunityId, CommunityMeta> = {
  gfl: {
    id: "gfl",
    label: "Games For Life",
    shortLabel: "GFL",
    filterLabel: "GFL",
    accent: "#4da6ff",
    accentDim: "#2563a8",
    initials: "GF",
    logoFile: "gfl",
    logoExtension: ".png",
    website: "https://gflclan.com",
    discord: "https://discord.gg/gflze",
  },
  mapeadores: {
    id: "mapeadores",
    label: "Mapeadores",
    shortLabel: "MAP",
    filterLabel: "Mapeadores",
    accent: "#ff6b35",
    accentDim: "#c2410c",
    initials: "MA",
    logoFile: "mapeadores",
    logoExtension: ".jpg",
    website: "https://mapeadores.com",
    discord: "https://discord.gg/jGTySyrKq",
  },
  unloze: {
    id: "unloze",
    label: "UNLOZE",
    shortLabel: "UNL",
    filterLabel: "UNLOZE",
    accent: "#a855f7",
    accentDim: "#7e22ce",
    initials: "UZ",
    logoFile: "unloze",
    logoExtension: ".webp",
    website: "https://unloze.com",
  },
  net4all: {
    id: "net4all",
    label: "Net4ALL",
    shortLabel: "N4A",
    filterLabel: "Net4ALL",
    accent: "#fbbf24",
    accentDim: "#d97706",
    initials: "N4",
    logoFile: "net4all",
    logoExtension: ".png",
    website: "https://net4all.ru",
    discord: "https://discord.gg/vSxGxkET",
  },
  possession: {
    id: "possession",
    label: "Possession",
    shortLabel: "PSE",
    filterLabel: "Possession",
    accent: "#f472b6",
    accentDim: "#db2777",
    initials: "PS",
    logoFile: "possession",
    logoExtension: ".jpg",
    website: "https://pse.re",
    discord: "https://discord.gg/pse",
  },
  nide: {
    id: "nide",
    label: "NiDE GG",
    shortLabel: "NiDE",
    filterLabel: "NiDE",
    accent: "#e85d04",
    accentDim: "#c2410c",
    initials: "ND",
    logoFile: "nide",
    logoExtension: ".png",
    website: "https://nide.gg",
    discord: "https://discord.nide.gg/",
  },
  avalon: {
    id: "avalon",
    label: "Avalon",
    shortLabel: "AVL",
    filterLabel: "Avalon",
    accent: "#22c55e",
    accentDim: "#15803d",
    initials: "AV",
    logoFile: "avalon",
    logoExtension: ".png",
    discord: "https://discord.gg/84TrbjHQrs",
  },
  rss: {
    id: "rss",
    label: "RSS",
    shortLabel: "RSS",
    filterLabel: "RSS",
    accent: "#38bdf8",
    accentDim: "#0284c7",
    initials: "RS",
    logoFile: "rss",
    logoExtension: ".jpg",
    discord: "https://discord.gg/rssze",
  },
  lupercalia: {
    id: "lupercalia",
    label: "Lupercalia",
    shortLabel: "LUP",
    filterLabel: "Lupercalia",
    accent: "#f43f5e",
    accentDim: "#be123c",
    initials: "LP",
    logoFile: "lupercalia",
  },
  enemydowns: {
    id: "enemydowns",
    label: "EnemyDowns",
    shortLabel: "ED",
    filterLabel: "EnemyDowns",
    accent: "#14b8a6",
    accentDim: "#0f766e",
    initials: "ED",
    logoFile: "enemydowns",
  },
  kult: {
    id: "kult",
    label: "KULT Zombie Escape",
    shortLabel: "KULT",
    filterLabel: "KULT",
    accent: "#8b5cf6",
    accentDim: "#6d28d9",
    initials: "KU",
    logoFile: "kult",
  },
  zmbio: {
    id: "zmbio",
    label: "ZMBIO",
    shortLabel: "ZMB",
    filterLabel: "ZMBIO",
    accent: "#84cc16",
    accentDim: "#4d7c0f",
    initials: "ZB",
    logoFile: "zmbio",
  },
  zed: {
    id: "zed",
    label: "Zombie Paradise",
    shortLabel: "ZED",
    filterLabel: "Zombie Paradise",
    accent: "#ef4444",
    accentDim: "#b91c1c",
    initials: "ZD",
    logoFile: "zed",
    website: "https://bbs.zombieden.cn",
  },
  kaishui: {
    id: "kaishui",
    label: "Kaishui",
    shortLabel: "KS",
    filterLabel: "Kaishui",
    accent: "#fb7185",
    accentDim: "#be123c",
    initials: "KS",
    logoFile: "kaishui",
  },
  zero: {
    id: "zero",
    label: "ZeRo",
    shortLabel: "ZR",
    filterLabel: "ZeRo",
    accent: "#94a3b8",
    accentDim: "#475569",
    initials: "ZR",
    logoFile: "zero",
  },
  upkk: {
    id: "upkk",
    label: "UPKK",
    shortLabel: "UPKK",
    filterLabel: "UPKK",
    accent: "#22d3ee",
    accentDim: "#0e7490",
    initials: "UP",
    logoFile: "upkk",
  },
};

/** Broad server regions shown in the browser */
export const REGION_FLAGS: Record<string, string> = {
  NA: "🇺🇸",
  EU: "🇪🇺",
  RU: "🇷🇺",
  JP: "🇯🇵",
  AS: "🇯🇵",
  BR: "🇧🇷",
  CN: "🇨🇳",
  KR: "🇰🇷",
};

export const REGION_LABELS: Record<string, string> = {
  NA: "North America",
  EU: "Europe",
  RU: "Russia",
  JP: "Japan",
  AS: "Asia",
  BR: "Brazil",
  CN: "China",
  KR: "Korea",
};

/** Flag image slug per region code */
export const REGION_FLAG_CODES: Record<string, string> = {
  NA: "us",
  EU: "eu",
  RU: "ru",
  JP: "jp",
  AS: "jp",
  BR: "br",
  CN: "cn",
  KR: "kr",
};

/** Filter options derived from community metadata */
export const COMMUNITY_FILTER_OPTIONS = (
  Object.values(COMMUNITIES) as CommunityMeta[]
).map((c) => ({
  id: c.id,
  label: c.filterLabel,
}));
