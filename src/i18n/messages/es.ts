import type { Messages } from "./en";

const es: Messages = {
  language: { label: "Idioma" },
  hero: {
    subtitle: "Navegador de servidores Zombie Escape de Counter-Strike 2",
    description:
      "Una lista seleccionada de servidores y comunidades activas de Zombie Escape. Mira quién juega, la mapa actual y conéctate directamente a un servidor. La información se actualiza automáticamente.",
    tagline:
      "Lista de servidores mantenida por la comunidad para Counter-Strike 2 Zombie Escape.",
    guideLink: "¿Qué es ZE? Cómo jugar",
    highlightGfl: "es el servidor ZE más popular de América",
    highlightMap: "es el más popular de Europa",
  },
  halloween: {
    badge: "Halloween",
    until: "Tema de temporada hasta el 1 nov 2026, 00:01",
  },
  stats: {
    playersOnline: "Jugadores en línea",
    serversLive: "Servidores activos",
    tracked: "Seguidos",
    communities: "Comunidades",
    ariaLabel: "Estadísticas de servidores",
  },
  controls: {
    searchPlaceholder: "Buscar mapa o servidor…",
    searchAria: "Buscar servidores",
    filterAria: "Filtrar por comunidad",
    sortAria: "Ordenar servidores",
    refreshAria: "Actualizar lista de servidores",
    allCommunities: "Todas las comunidades",
    sortMostPlayers: "Más jugadores",
    sortLeastPlayers: "Menos jugadores",
    sortCommunity: "Comunidad",
    sortName: "Nombre del servidor",
    sortFavorites: "Favoritos primero",
    regionAria: "Filtrar por región",
    allRegions: "Todas las regiones",
    onlineOnly: "Solo en línea",
    hasPlayers: "Con jugadores",
    refresh: "Actualizar",
    updating: "Actualizando…",
    updated: "Actualizado {time}",
  },
  browser: {
    errorUnavailable:
      "El estado del servidor no está disponible temporalmente. Mostrando los últimos datos conocidos si existen.",
    noMatch: "Ningún servidor coincide con tu búsqueda o filtro.",
    noData: "No hay datos de servidores disponibles ahora.",
    resetFilters: "Restablecer filtros",
    liveNote:
      "La información del servidor se consulta automáticamente y puede retrasarse ocasionalmente.",
    showMore: "Mostrar más servidores ({count})",
  },
  activity: {
    title: "Actividad ZE en vivo",
    loading: "Cargando actividad en vivo…",
    unavailable: "Actividad en vivo no disponible.",
    summary: "{players} jugadores en {active} servidores activos",
    mostActive: "Más activo:",
    players: "jugadores",
    topMap: "Mapa popular:",
    updatedMoments: "Actualizado hace un momento",
    updatedAt: "Actualizado {time}",
  },
  favorites: {
    add: "Favorito",
    remove: "Quitar",
    addAria: "Añadir {name} a favoritos",
    removeAria: "Quitar {name} de favoritos",
  },
  weeklyStats: {
    loading: "Cargando estadísticas semanales…",
    summary:
      "Esta semana: {visitors} visitantes · pico {peak} jugadores ZE · ~{avg} media concurrente",
  },
  gameGroups: {
    featuredTitle: "Más populares",
    featuredSubtitle:
      "GFL — América · Mapeadores — Europa · Possession — Asia",
    featuredBadge: "Destacados",
    cs2Title: "Todos los servidores CS2",
    cs2Subtitle: "Ordenados por jugadores — los destacados también aparecen aquí.",
    cssTitle: "Counter-Strike: Source",
    cssSubtitle:
      "Servidores CS:S legacy — necesitas Counter-Strike: Source instalado. No compatible con CS2.",
    playersOnline: "{players} jugadores · {online}/{total} en línea",
  },
  serverRow: {
    full: "Lleno",
    offline: "Desconectado",
    join: "Unirse",
    details: "Detalles",
    copyIp: "Copiar IP",
    copied: "Copiado",
    copyConnect: "Copiar comando connect",
    copyIpAria: "Copiar IP {ip}",
    popularNa: "Más popular en América",
    popularEu: "Más popular en Europa",
    popularAs: "Más popular en Asia",
  },
  links: { website: "Sitio web", discord: "Discord" },
  detail: {
    ariaLabel: "Detalles de {name}",
    close: "Cerrar",
    closeDialog: "Cerrar diálogo",
    loading: "Cargando detalles…",
    error: "No se pudieron cargar los detalles del servidor.",
    currentMap: "Mapa actual",
    playersOnline: "Jugadores en línea ({count})",
    namesHidden: "Nombres ocultos por el servidor",
    noPlayerList: "No hay lista de jugadores para este servidor.",
    serverOffline: "El servidor está desconectado.",
    mapHistory: "Historial reciente de mapas (24h)",
    trend24h: "Tendencia 24h:",
    noMapHistory: "El historial de mapas no está disponible para este servidor.",
    noMaps24h: "No se jugaron otros mapas en las últimas 24 horas.",
    viewMapHistory: "Ver historial de mapas",
    onlineMeta: "{community} · {players}/{max} en línea",
    pingMeta: " · {ping}ms",
    played: " jugado",
    peak: " pico",
    playersRange: "{start} → {end} jugadores",
    untilNow: " → ahora",
    refresh: "Actualizar",
    refreshing: "Actualizando…",
  },
  mapProgress: {
    title: "Progreso de mapas de la comunidad",
    homeTitle: "Progreso de mapas Mapeadores",
    homeDescription:
      "Sigue qué mapas personalizados ha completado la comunidad EU Mapeadores — actualizaciones en vivo.",
    loading: "Cargando progreso de mapas…",
    error: "Los datos de progreso no están disponibles temporalmente.",
    beaten: "completados",
    remaining: "restantes",
    complete: "completado",
    liveNote:
      "Progreso de mapas Mapeadores en vivo · se actualiza cada minuto",
    liveNoteGfl: "Progreso de mapas GFL en vivo · se actualiza cada minuto",
    viewFullList: "Ver lista completa de mapas →",
    missingData: "Datos no disponibles — se añadirán lo antes posible.",
  },
  trend: { up: "Subiendo", down: "Bajando", flat: "Estable" },
  regions: {
    NA: "América del Norte",
    EU: "Europa",
    RU: "Rusia",
    JP: "Japón",
    AS: "Asia",
    BR: "Brasil",
    CN: "China",
    KR: "Corea",
  },
  contact: {
    heading: "¿Preguntas o sugerencias?",
    discordLabel: "Discord:",
    copyDiscord: "Copiar nombre de Discord",
    copied: "¡Copiado!",
    copyAria: "Copiar nombre de Discord spacemonkey716",
  },
  footer: {
    disclaimer:
      "Lista de servidores mantenida por la comunidad · No afiliada a Valve ni a las comunidades listadas",
    about:
      "Creado con asistencia de IA como una vista rápida para jugadores de ZE — especialmente quienes vuelven de CS:GO u otros juegos.",
    privacy: "Política de privacidad",
  },
  nav: {
    backToServers: "← Volver a servidores",
    backToBrowser: "← Volver al navegador de servidores",
  },
  privacy: {
    title: "Política de privacidad",
    updated: "Última actualización: 31 de agosto de 2026",
    overviewTitle: "Resumen",
    overviewText:
      "Este sitio es un navegador de servidores Counter-Strike 2 Zombie Escape mantenido por la comunidad. Muestra información pública de servidores como jugadores, mapas y enlaces de comunidades. No se requiere cuenta ni inicio de sesión.",
    collectTitle: "Información que recopilamos",
    serverDataLabel: "Datos del servidor:",
    serverDataText:
      "Consultamos servidores públicos y servicios de terceros para mostrar estado en vivo, mapas e historial reciente. Estos datos son sobre servidores, no sobre ti personalmente.",
    browserStorageLabel: "Almacenamiento del navegador:",
    browserStorageText:
      "El sitio puede guardar resultados recientes de la lista en el almacenamiento de sesión de tu navegador para cargar más rápido. Permanece en tu dispositivo y se borra al cerrar la pestaña.",
    hostingLogsLabel: "Registros de hosting:",
    hostingLogsText:
      "Nuestro proveedor de hosting puede recopilar registros técnicos estándar (como dirección IP, tipo de navegador y hora de solicitud) por seguridad y fiabilidad.",
    visitStatsLabel: "Estadísticas anónimas de visitas:",
    visitStatsText:
      "Contamos visitantes semanales aproximados con una señal única por sesión. Las IP se hashean y nunca se guardan en texto plano.",
    thirdPartyTitle: "Servicios de terceros",
    thirdPartyText:
      "Para mostrar el estado del servidor e historial de mapas, el sitio puede contactar servidores de juego directamente y APIs públicas de terceros. Esos servicios tienen sus propias prácticas de privacidad. Los sitios web, enlaces de Discord y logos de las comunidades pertenecen a sus respectivos propietarios. Si está configurado, puede cargarse analítica respetuosa con la privacidad (p. ej. Plausible).",
    notDoTitle: "Lo que no hacemos",
    notSell: "No vendemos información personal.",
    notPayment: "No recopilamos información de pago.",
    notProfile:
      "No recopilamos intencionalmente Steam IDs ni nombres en el juego para crear perfiles. Los nombres mostrados provienen de respuestas públicas del servidor en el momento de tu visita.",
    contactTitle: "Contacto",
    contactText:
      "Las preguntas sobre esta política o el sitio pueden enviarse a",
  },
  duration: {
    dash: "—",
    min: "{n} min",
    hours: "{h}h {m}m",
    minutesSeconds: "{m}m {s}s",
    seconds: "{s}s",
  },
};

export default es;
