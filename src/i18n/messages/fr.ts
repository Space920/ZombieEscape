import type { Messages } from "./en";

const fr: Messages = {
  language: { label: "Langue" },
  hero: {
    subtitle: "Navigateur de serveurs Zombie Escape Counter-Strike 2",
    description:
      "Une liste sélectionnée de serveurs et communautés Zombie Escape actifs. Voir qui joue, la map en cours et se connecter directement à un serveur. Les informations sont mises à jour automatiquement.",
    tagline:
      "Liste de serveurs maintenue par la communauté pour Counter-Strike 2 Zombie Escape.",
    guideLink: "Qu'est-ce que ZE ? Comment jouer",
    highlightGfl: "est le serveur ZE le plus populaire en Amérique",
    highlightMap: "est le plus populaire en Europe",
  },
  halloween: {
    badge: "Halloween",
  },
  stats: {
    playersOnline: "Joueurs en ligne",
    serversLive: "Serveurs actifs",
    tracked: "Suivis",
    communities: "Communautés",
    ariaLabel: "Statistiques des serveurs",
  },
  controls: {
    searchPlaceholder: "Rechercher une map ou un serveur…",
    searchAria: "Rechercher des serveurs",
    filterAria: "Filtrer par communauté",
    sortAria: "Trier les serveurs",
    refreshAria: "Actualiser la liste",
    allCommunities: "Toutes les communautés",
    sortMostPlayers: "Plus de joueurs",
    sortLeastPlayers: "Moins de joueurs",
    sortCommunity: "Communauté",
    sortName: "Nom du serveur",
    sortFavorites: "Favoris en premier",
    regionAria: "Filtrer par région",
    allRegions: "Toutes les régions",
    onlineOnly: "En ligne uniquement",
    hasPlayers: "Avec joueurs",
    refresh: "Actualiser",
    updating: "Mise à jour…",
    updated: "Mis à jour {time}",
  },
  browser: {
    errorUnavailable:
      "Statut des serveurs temporairement indisponible. Affichage des dernières données connues si disponibles.",
    noMatch: "Aucun serveur ne correspond à votre recherche ou filtre.",
    noData: "Aucune donnée de serveur disponible pour le moment.",
    resetFilters: "Réinitialiser les filtres",
    liveNote:
      "Les informations serveur sont interrogées automatiquement et peuvent parfois être retardées.",
    showMore: "Afficher plus de serveurs ({count})",
  },
  activity: {
    title: "Activité ZE en direct",
    loading: "Chargement de l'activité…",
    unavailable: "Activité en direct indisponible.",
    summary: "{players} joueurs sur {active} serveurs actifs",
    mostActive: "Plus actif :",
    players: "joueurs",
    topMap: "Carte populaire :",
    updatedMoments: "Mis à jour à l'instant",
    updatedAt: "Mis à jour {time}",
  },
  favorites: {
    add: "Favori",
    remove: "Retirer",
    addAria: "Ajouter {name} aux favoris",
    removeAria: "Retirer {name} des favoris",
  },
  weeklyStats: {
    loading: "Chargement des stats hebdomadaires…",
    summary:
      "Cette semaine : {visitors} visiteurs · pic {peak} joueurs ZE · ~{avg} moy. concurrents",
  },
  gameGroups: {
    featuredTitle: "Les plus populaires",
    featuredSubtitle:
      "GFL — Amérique · Mapeadores — Europe · Possession — Asie",
    featuredBadge: "Top",
    cs2Title: "Tous les serveurs CS2",
    cs2Subtitle: "Triés par joueurs — les tops apparaissent aussi ici.",
    cssTitle: "Counter-Strike: Source",
    cssSubtitle:
      "Serveurs CS:S legacy — Counter-Strike: Source requis. Non compatible avec CS2.",
    playersOnline: "{players} joueurs · {online}/{total} en ligne",
  },
  serverRow: {
    full: "Complet",
    offline: "Hors ligne",
    join: "Rejoindre",
    details: "Détails",
    copyIp: "Copier l'IP",
    copied: "Copié",
    copyConnect: "Copier la commande connect",
    copyIpAria: "Copier l'IP {ip}",
    popularNa: "Le plus populaire en Amérique",
    popularEu: "Le plus populaire en Europe",
    popularAs: "Le plus populaire en Asie",
  },
  links: { website: "Site web", discord: "Discord" },
  detail: {
    ariaLabel: "Détails de {name}",
    close: "Fermer",
    closeDialog: "Fermer la fenêtre",
    loading: "Chargement des détails…",
    error: "Impossible de charger les détails du serveur.",
    currentMap: "Map actuelle",
    playersOnline: "Joueurs en ligne ({count})",
    namesHidden: "Noms masqués par le serveur",
    noPlayerList: "Aucune liste de joueurs pour ce serveur.",
    serverOffline: "Le serveur est hors ligne.",
    mapHistory: "Historique récent des maps (24h)",
    trend24h: "Tendance 24h :",
    noMapHistory: "Historique des maps indisponible pour ce serveur.",
    noMaps24h: "Aucune autre map jouée dans les dernières 24 heures.",
    viewMapHistory: "Voir l'historique des maps",
    onlineMeta: "{community} · {players}/{max} en ligne",
    pingMeta: " · {ping}ms",
    played: " joué",
    peak: " pic",
    playersRange: "{start} → {end} joueurs",
    untilNow: " → maintenant",
    refresh: "Actualiser",
    refreshing: "Actualisation…",
  },
  mapProgress: {
    title: "Progression des maps de la communauté",
    homeTitle: "Progression des maps Mapeadores",
    homeDescription:
      "Suivez les maps custom terminées par la communauté EU Mapeadores — mises à jour en direct.",
    loading: "Chargement de la progression…",
    error: "Données de progression temporairement indisponibles.",
    beaten: "terminées",
    remaining: "restantes",
    complete: "complété",
    liveNote:
      "Progression Mapeadores en direct · mis à jour chaque minute",
    liveNoteGfl: "Progression GFL en direct · mis à jour chaque minute",
    viewFullList: "Voir la liste complète des maps →",
    missingData: "Données manquantes — seront ajoutées dès que possible.",
  },
  trend: { up: "En hausse", down: "En baisse", flat: "Stable" },
  regions: {
    NA: "Amérique du Nord",
    EU: "Europe",
    RU: "Russie",
    JP: "Japon",
    AS: "Asie",
    BR: "Brésil",
    CN: "Chine",
    KR: "Corée",
  },
  contact: {
    heading: "Questions ou suggestions ?",
    discordLabel: "Discord :",
    copyDiscord: "Copier le nom Discord",
    copied: "Copié !",
    copyAria: "Copier le nom Discord spacemonkey716",
  },
  footer: {
    disclaimer:
      "Liste maintenue par la communauté · Non affiliée à Valve ni aux communautés listées",
    about:
      "Créé avec l'aide de l'IA comme aperçu simple pour les joueurs ZE — surtout ceux qui reviennent de CS:GO ou d'autres jeux.",
    privacy: "Politique de confidentialité",
  },
  nav: {
    backToServers: "← Retour aux serveurs",
    backToBrowser: "← Retour au navigateur de serveurs",
  },
  privacy: {
    title: "Politique de confidentialité",
    updated: "Dernière mise à jour : 31 août 2026",
    overviewTitle: "Aperçu",
    overviewText:
      "Ce site est un navigateur de serveurs Counter-Strike 2 Zombie Escape maintenu par la communauté. Il affiche des informations publiques sur les serveurs (joueurs, maps, liens communautaires). Aucun compte ni connexion requis.",
    collectTitle: "Informations collectées",
    serverDataLabel: "Données serveur :",
    serverDataText:
      "Nous interrogeons des serveurs publics et des services tiers pour afficher le statut en direct, les maps et l'historique récent. Ces données concernent les serveurs, pas vous personnellement.",
    browserStorageLabel: "Stockage navigateur :",
    browserStorageText:
      "Le site peut stocker les derniers résultats dans le stockage de session de votre navigateur pour un chargement plus rapide. Cela reste sur votre appareil et est effacé à la fermeture de l'onglet.",
    hostingLogsLabel: "Journaux d'hébergement :",
    hostingLogsText:
      "Notre hébergeur peut collecter des journaux techniques standard (adresse IP, type de navigateur, heure de requête) pour la sécurité et la fiabilité.",
    visitStatsLabel: "Statistiques de visite anonymes :",
    visitStatsText:
      "Nous comptons les visiteurs hebdomadaires approximatifs via un signal unique par session. Les IP sont hachées et jamais stockées en clair.",
    thirdPartyTitle: "Services tiers",
    thirdPartyText:
      "Pour afficher le statut et l'historique, le site peut contacter directement les serveurs de jeu et des API publiques tierces. Ces services ont leurs propres pratiques de confidentialité. Les sites, liens Discord et logos appartiennent à leurs propriétaires respectifs. Si configuré, une analytique respectueuse de la vie privée (p. ex. Plausible) peut être chargée.",
    notDoTitle: "Ce que nous ne faisons pas",
    notSell: "Nous ne vendons pas d'informations personnelles.",
    notPayment: "Nous ne collectons pas d'informations de paiement.",
    notProfile:
      "Nous ne collectons pas intentionnellement les Steam ID ou pseudos pour du profilage. Les noms affichés proviennent de requêtes publiques au moment de votre visite.",
    contactTitle: "Contact",
    contactText:
      "Les questions sur cette politique ou le site peuvent être envoyées à",
  },
  duration: {
    dash: "—",
    min: "{n} min",
    hours: "{h}h {m}m",
    minutesSeconds: "{m}m {s}s",
    seconds: "{s}s",
  },
};

export default fr;
