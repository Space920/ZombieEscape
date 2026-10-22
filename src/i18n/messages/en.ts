const en = {
  language: { label: "Language" },
  hero: {
    subtitle: "Counter-Strike 2 Zombie Escape server browser",
    description:
      "ZE Servers tracks active CS2 ZE communities with live player counts, current maps and direct connect. CS:S servers are included when live.",
    tagline:
      "CS2 Zombie Escape · live server list · community-maintained",
    highlightGfl: "is the most popular ZE server in America",
    highlightMap: "is the most popular in Europe",
    guideLink: "What is ZE? How to play",
  },
  halloween: {
    badge: "Halloween",
    hide: "Hide Halloween",
    show: "Show Halloween",
  },
  stats: {
    playersOnline: "Players Online",
    serversLive: "Servers Live",
    tracked: "Tracked",
    communities: "Communities",
    ariaLabel: "Server statistics",
  },
  controls: {
    searchPlaceholder: "Search map or server…",
    searchAria: "Search servers",
    filterAria: "Filter by community",
    sortAria: "Sort servers",
    refreshAria: "Refresh server list",
    allCommunities: "All communities",
    sortMostPlayers: "Most Players",
    sortLeastPlayers: "Least Players",
    sortCommunity: "Community",
    sortName: "Server Name",
    sortFavorites: "Favorites First",
    regionAria: "Filter by region",
    allRegions: "All regions",
    onlineOnly: "Online only",
    hasPlayers: "Has players",
    refresh: "Refresh",
    updating: "Updating…",
    updated: "Updated {time}",
  },
  browser: {
    errorUnavailable:
      "Server status is temporarily unavailable. Showing last known data if available.",
    noMatch: "No servers match your search or filter.",
    noData: "No server data available right now.",
    resetFilters: "Reset filters",
    liveNote:
      "Server information is queried automatically and may occasionally be delayed.",
    showMore: "Show more servers ({count})",
  },
  activity: {
    title: "ZE Live Activity",
    loading: "Loading live activity…",
    unavailable: "Live activity is unavailable right now.",
    summary: "{players} players across {active} active servers",
    mostActive: "Most active:",
    players: "players",
    topMap: "Popular map:",
    updatedMoments: "Updated moments ago",
    updatedAt: "Updated {time}",
  },
  favorites: {
    add: "Add favorite",
    remove: "Remove favorite",
    addAria: "Add {name} to favorites",
    removeAria: "Remove {name} from favorites",
  },
  weeklyStats: {
    loading: "Loading weekly stats…",
    summary:
      "This week: {visitors} site visitors · peak {peak} ZE players online · ~{avg} avg concurrent",
  },
  peaks: {
    title: "Peak Times",
    open: "Peak times",
    detailTitle: "Peak Times",
    collecting:
      "Still collecting peak hours. Check back after a few days of samples.",
    busiest: "Usually busiest: {weekday} around {time}",
    record: "Record: {players} players on {when}",
    weekdays: "Weekday",
    hours: "Hour of day",
    localNote: "Hour chart uses your local timezone.",
    samples: "{count} samples",
  },
  gameGroups: {
    featuredTitle: "Most popular",
    featuredSubtitle:
      "GFL — America · Mapeadores — Europe · Possession — Asia",
    featuredBadge: "Top picks",
    cs2Title: "All CS2 servers",
    cs2Subtitle: "Sorted by players — popular picks also appear here.",
    cssTitle: "Counter-Strike: Source",
    cssSubtitle: "Requires CS:S — not compatible with CS2.",
    playersOnline: "{players} players · {online}/{total} online",
  },
  serverRow: {
    full: "Full",
    offline: "Offline",
    join: "Join",
    details: "Details",
    copyIp: "Copy IP",
    copied: "Copied",
    copyConnect: "Copy connect command",
    copyIpAria: "Copy IP {ip}",
    popularNa: "Most popular in America",
    popularEu: "Most popular in Europe",
    popularAs: "Most popular in Asia",
  },
  links: { website: "Website", discord: "Discord" },
  detail: {
    ariaLabel: "{name} details",
    close: "Close",
    closeDialog: "Close dialog",
    loading: "Loading details…",
    error: "Could not load server details right now.",
    currentMap: "Current Map",
    playersOnline: "Players Online ({count})",
    namesHidden: "Names hidden by server",
    noPlayerList: "No player list available for this server.",
    serverOffline: "Server is offline.",
    mapHistory: "Recent Map History (24h)",
    trend24h: "24h trend:",
    noMapHistory: "Map history is not available for this server.",
    noMaps24h: "No other maps played in the last 24 hours.",
    viewMapHistory: "View map history",
    onlineMeta: "{community} · {players}/{max} online",
    pingMeta: " · {ping}ms",
    played: " played",
    peak: " peak",
    playersRange: "{start} → {end} players",
    untilNow: " → now",
    refresh: "Refresh",
    refreshing: "Refreshing…",
  },
  mapProgress: {
    title: "Community Map Progress",
    homeTitle: "Mapeadores Map Progress",
    homeDescription:
      "Track which custom maps the Mapeadores EU community has cleared — live updates.",
    loading: "Loading map progress…",
    error: "Map progress data is temporarily unavailable.",
    beaten: "beaten",
    remaining: "remaining",
    complete: "complete",
    liveNote: "Live Mapeadores map progress · updates every minute",
    liveNoteGfl: "Live GFL map progress · updates every minute",
    viewFullList: "View full map list →",
    missingData: "Missing data — will be added as soon as possible.",
  },
  trend: { up: "Rising", down: "Falling", flat: "Stable" },
  regions: {
    NA: "North America",
    EU: "Europe",
    RU: "Russia",
    JP: "Japan",
    AS: "Asia",
    BR: "Brazil",
    CN: "China",
    KR: "Korea",
  },
  contact: {
    heading: "Questions or suggestions?",
    discordLabel: "Discord:",
    copyDiscord: "Copy Discord username",
    copied: "Copied!",
    copyAria: "Copy Discord username spacemonkey716",
  },
  footer: {
    disclaimer:
      "Community-maintained server list · Not affiliated with Valve or listed communities",
    about:
      "Built with AI assistance as a simple overview for ZE players — especially those returning from CS:GO or other games — to quickly see what's live.",
    privacy: "Privacy Policy",
    directory: "More servers",
  },
  nav: {
    backToServers: "← Back to servers",
    backToBrowser: "← Back to server browser",
  },
  privacy: {
    title: "Privacy Policy",
    updated: "Last updated: August 31, 2026",
    overviewTitle: "Overview",
    overviewText:
      "This site is a community-maintained Counter-Strike 2 Zombie Escape server browser. It displays public game-server information such as player counts, maps, and community links. We do not require an account or login to use the site.",
    collectTitle: "Information we collect",
    serverDataLabel: "Server data:",
    serverDataText:
      "We query public game servers and third-party services to show live status, maps, and recent map history. This data is about servers, not about you personally.",
    browserStorageLabel: "Browser storage:",
    browserStorageText:
      "The site may store recent server list results in your browser's session storage to load faster, and favorite servers in local storage so your starred servers persist across visits. This data stays on your device and is never sent to our servers.",
    hostingLogsLabel: "Hosting logs:",
    hostingLogsText:
      "Our hosting provider may collect standard technical logs (such as IP address, browser type, and request time) for security and reliability.",
    visitStatsLabel: "Anonymous visit stats:",
    visitStatsText:
      "We count approximate weekly site visitors using a one-time session beacon. IP addresses are hashed and never stored in plain text. This helps us understand how many people use the browser.",
    thirdPartyTitle: "Third-party services",
    thirdPartyText:
      "To show server status and map history, the site may contact game servers directly and public APIs operated by third parties. Those services have their own privacy practices. Community websites, Discord links, and logos belong to their respective owners. If configured, privacy-friendly analytics (such as Plausible) may also be loaded — see their privacy policy for details.",
    notDoTitle: "What we do not do",
    notSell: "We do not sell personal information.",
    notPayment: "We do not collect payment information.",
    notProfile:
      "We do not intentionally collect player Steam IDs or in-game names for profiling. Player names shown in server details come from public server query responses at the time you view them.",
    contactTitle: "Contact",
    contactText: "Questions about this policy or the site can be sent to",
  },
  duration: {
    dash: "—",
    min: "{n} min",
    hours: "{h}h {m}m",
    minutesSeconds: "{m}m {s}s",
    seconds: "{s}s",
  },
} as const;

export type Messages = {
  [K in keyof typeof en]: {
    [P in keyof (typeof en)[K]]: string;
  };
};

export default en;
