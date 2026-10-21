import type { Messages } from "./en";

const de: Messages = {
  language: { label: "Sprache" },
  hero: {
    subtitle: "Counter-Strike 2 Zombie Escape Server-Browser",
    description:
      "Eine kuratierte Liste aktiver Zombie-Escape-Server und Communities. Sieh wer spielt, welche Map läuft und verbinde dich direkt mit einem Server. Serverinformationen werden automatisch aktualisiert.",
    tagline:
      "Community-pflegte Serverliste für Counter-Strike 2 Zombie Escape.",
    guideLink: "Was ist ZE? So spielt man",
    highlightGfl: "ist der beliebteste ZE-Server in Amerika",
    highlightMap: "ist der beliebteste in Europa",
  },
  halloween: {
    badge: "Halloween",
  },
  stats: {
    playersOnline: "Spieler online",
    serversLive: "Server online",
    tracked: "Verfolgt",
    communities: "Communities",
    ariaLabel: "Serverstatistiken",
  },
  controls: {
    searchPlaceholder: "Map oder Server suchen…",
    searchAria: "Server suchen",
    filterAria: "Nach Community filtern",
    sortAria: "Server sortieren",
    refreshAria: "Serverliste aktualisieren",
    allCommunities: "Alle Communities",
    sortMostPlayers: "Meiste Spieler",
    sortLeastPlayers: "Wenigste Spieler",
    sortCommunity: "Community",
    sortName: "Servername",
    sortFavorites: "Favoriten zuerst",
    regionAria: "Nach Region filtern",
    allRegions: "Alle Regionen",
    onlineOnly: "Nur online",
    hasPlayers: "Mit Spielern",
    refresh: "Aktualisieren",
    updating: "Aktualisiere…",
    updated: "Aktualisiert {time}",
  },
  browser: {
    errorUnavailable:
      "Serverstatus vorübergehend nicht verfügbar. Zeige letzte bekannte Daten, falls vorhanden.",
    noMatch: "Keine Server entsprechen deiner Suche oder deinem Filter.",
    noData: "Derzeit keine Serverdaten verfügbar.",
    resetFilters: "Filter zurücksetzen",
    liveNote:
      "Serverinformationen werden automatisch abgefragt und können gelegentlich verzögert sein.",
    showMore: "Mehr Server anzeigen ({count})",
  },
  activity: {
    title: "ZE Live-Aktivität",
    loading: "Live-Aktivität wird geladen…",
    unavailable: "Live-Aktivität derzeit nicht verfügbar.",
    summary: "{players} Spieler auf {active} aktiven Servern",
    mostActive: "Am aktivsten:",
    players: "Spieler",
    topMap: "Beliebte Map:",
    updatedMoments: "Gerade aktualisiert",
    updatedAt: "Aktualisiert {time}",
  },
  favorites: {
    add: "Favorit",
    remove: "Entfernen",
    addAria: "{name} zu Favoriten hinzufügen",
    removeAria: "{name} aus Favoriten entfernen",
  },
  weeklyStats: {
    loading: "Wochenstatistik wird geladen…",
    summary:
      "Diese Woche: {visitors} Besucher · Spitze {peak} ZE-Spieler online · ~{avg} Ø gleichzeitig",
  },
  gameGroups: {
    featuredTitle: "Beliebteste",
    featuredSubtitle:
      "GFL — Amerika · Mapeadores — Europa · Possession — Asien",
    featuredBadge: "Top-Picks",
    cs2Title: "Alle CS2-Server",
    cs2Subtitle: "Nach Spielern sortiert — Top-Picks erscheinen auch hier.",
    cssTitle: "Counter-Strike: Source",
    cssSubtitle:
      "Legacy CS:S-Server — Counter-Strike: Source muss installiert sein. Nicht mit CS2 kompatibel.",
    playersOnline: "{players} Spieler · {online}/{total} online",
  },
  serverRow: {
    full: "Voll",
    offline: "Offline",
    join: "Beitreten",
    details: "Details",
    copyIp: "IP kopieren",
    copied: "Kopiert",
    copyConnect: "Connect-Befehl kopieren",
    copyIpAria: "IP {ip} kopieren",
    popularNa: "Beliebtester in Amerika",
    popularEu: "Beliebtester in Europa",
    popularAs: "Beliebtester in Asien",
  },
  links: { website: "Website", discord: "Discord" },
  detail: {
    ariaLabel: "{name} Details",
    close: "Schließen",
    closeDialog: "Dialog schließen",
    loading: "Lade Details…",
    error: "Serverdetails konnten gerade nicht geladen werden.",
    currentMap: "Aktuelle Map",
    playersOnline: "Spieler online ({count})",
    namesHidden: "Namen vom Server verborgen",
    noPlayerList: "Keine Spielerliste für diesen Server verfügbar.",
    serverOffline: "Server ist offline.",
    mapHistory: "Kürzliche Map-Historie (24h)",
    trend24h: "24h-Trend:",
    noMapHistory: "Map-Historie für diesen Server nicht verfügbar.",
    noMaps24h: "Keine anderen Maps in den letzten 24 Stunden gespielt.",
    viewMapHistory: "Map-Historie ansehen",
    onlineMeta: "{community} · {players}/{max} online",
    pingMeta: " · {ping}ms",
    played: " gespielt",
    peak: " Peak",
    playersRange: "{start} → {end} Spieler",
    untilNow: " → jetzt",
    refresh: "Aktualisieren",
    refreshing: "Aktualisiere…",
  },
  mapProgress: {
    title: "Community Map-Fortschritt",
    homeTitle: "Mapeadores Map-Fortschritt",
    homeDescription:
      "Verfolge, welche Custom Maps die Mapeadores-EU-Community geschafft hat — live aktualisiert.",
    loading: "Lade Map-Fortschritt…",
    error: "Map-Fortschrittsdaten vorübergehend nicht verfügbar.",
    beaten: "geschafft",
    remaining: "offen",
    complete: "abgeschlossen",
    liveNote:
      "Live Mapeadores Map-Fortschritt · aktualisiert jede Minute",
    liveNoteGfl: "Live GFL Map-Fortschritt · aktualisiert jede Minute",
    viewFullList: "Vollständige Map-Liste →",
    missingData: "Daten fehlen — werden so schnell wie möglich ergänzt.",
  },
  trend: { up: "Steigend", down: "Fallend", flat: "Stabil" },
  regions: {
    NA: "Nordamerika",
    EU: "Europa",
    RU: "Russland",
    JP: "Japan",
    AS: "Asien",
    BR: "Brasilien",
    CN: "China",
    KR: "Korea",
  },
  contact: {
    heading: "Fragen oder Vorschläge?",
    discordLabel: "Discord:",
    copyDiscord: "Discord-Benutzername kopieren",
    copied: "Kopiert!",
    copyAria: "Discord-Benutzername spacemonkey716 kopieren",
  },
  footer: {
    disclaimer:
      "Community-pflegte Serverliste · Nicht verbunden mit Valve oder gelisteten Communities",
    about:
      "Mit KI-Unterstützung erstellt — eine einfache Übersicht für ZE-Spieler, besonders für Rückkehrer aus CS:GO oder anderen Spielen.",
    privacy: "Datenschutz",
  },
  nav: {
    backToServers: "← Zurück zu Servern",
    backToBrowser: "← Zurück zum Server-Browser",
  },
  privacy: {
    title: "Datenschutz",
    updated: "Zuletzt aktualisiert: 31. August 2026",
    overviewTitle: "Überblick",
    overviewText:
      "Diese Seite ist ein community-pflegter Counter-Strike 2 Zombie Escape Server-Browser. Sie zeigt öffentliche Spielserver-Informationen wie Spielerzahlen, Maps und Community-Links. Ein Konto oder Login ist nicht erforderlich.",
    collectTitle: "Welche Informationen wir erheben",
    serverDataLabel: "Serverdaten:",
    serverDataText:
      "Wir fragen öffentliche Spielserver und Dienste Dritter ab, um Live-Status, Maps und kürzliche Map-Historie anzuzeigen. Diese Daten betreffen Server, nicht dich persönlich.",
    browserStorageLabel: "Browser-Speicher:",
    browserStorageText:
      "Die Seite kann aktuelle Serverlistenergebnisse im Session-Speicher deines Browsers speichern, um schneller zu laden. Dies bleibt auf deinem Gerät und wird beim Schließen des Tabs gelöscht.",
    hostingLogsLabel: "Hosting-Logs:",
    hostingLogsText:
      "Unser Hosting-Anbieter kann standardmäßige technische Logs (z. B. IP-Adresse, Browsertyp, Anfragezeit) für Sicherheit und Zuverlässigkeit erfassen.",
    visitStatsLabel: "Anonyme Besuchsstatistik:",
    visitStatsText:
      "Wir zählen ungefähr wöchentliche Besucher über ein einmaliges Session-Signal. IP-Adressen werden gehasht und nie im Klartext gespeichert.",
    thirdPartyTitle: "Dienste Dritter",
    thirdPartyText:
      "Zum Anzeigen von Serverstatus und Map-Verlauf kann die Seite Spielserver und öffentliche APIs Dritter kontaktieren. Community-Websites, Discord-Links und Logos gehören ihren jeweiligen Eigentümern. Optional kann datenschutzfreundliche Analyse (z. B. Plausible) geladen werden.",
    notDoTitle: "Was wir nicht tun",
    notSell: "Wir verkaufen keine personenbezogenen Daten.",
    notPayment: "Wir erheben keine Zahlungsinformationen.",
    notProfile:
      "Wir erfassen absichtlich keine Steam-IDs oder Ingame-Namen zum Profiling. Spielernamen in Serverdetails stammen aus öffentlichen Server-Abfragen zum Zeitpunkt deines Aufrufs.",
    contactTitle: "Kontakt",
    contactText:
      "Fragen zu dieser Richtlinie oder der Seite können gesendet werden an",
  },
  duration: {
    dash: "—",
    min: "{n} Min.",
    hours: "{h}h {m}m",
    minutesSeconds: "{m}m {s}s",
    seconds: "{s}s",
  },
};

export default de;
