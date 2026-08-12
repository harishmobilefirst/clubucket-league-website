import { useEffect, useMemo } from "react";
import { useLocale } from "./locale";

export type TranslateVars = Record<string, string | number | undefined>;

export type TranslationKey = keyof typeof en;

const en = {
  // Language names
  "language.en": "English",
  "language.es": "Español",
  "nav.language": "Language",

  // Navigation
  "nav.home": "Home",
  "nav.divisions": "Divisions",
  "nav.schedule": "Schedule",
  "nav.standings": "Standings",
  "nav.news": "News",
  "nav.highlights": "Highlights",
  "nav.topScorers": "Top Scorers",
  "nav.about": "About Us",
  "nav.register": "Register",
  "nav.newTeamMembership": "New Team Membership",
  "nav.openMenu": "Open menu",
  "nav.closeMenu": "Close menu",
  "nav.navigationMenu": "Navigation menu",

  // Common
  "common.retry": "Retry",
  "common.sectionCouldNotLoad": "This section could not load.",
  "common.sectionError": "This section could not load.",
  "common.loading": "Loading…",
  "common.learnMore": "Learn more",
  "common.viewAll": "View All",
  "common.noItems": "No items found.",
  "common.previous": "Previous",
  "common.next": "Next",

  // Pagination
  "pagination.nav": "pagination",
  "pagination.previous": "Go to previous page",
  "pagination.previousLabel": "Previous",
  "pagination.next": "Go to next page",
  "pagination.nextLabel": "Next",

  // Footer
  "footer.quickLinks": "Quick Links",
  "footer.contact": "Contact",
  "footer.copyright": "© {year} {league}. All rights reserved.",
  "footer.poweredBy": "Powered by Clubucket",

  // Home
  "home.heroTitle": "The Heart of Mexican Soccer",
  "home.heroCta": "View Schedule",
  "home.aboutEyebrow": "About LigaD1",
  "home.aboutTitle": "More Than a League. A Community.",
  "home.aboutBody1": "LigaD1 is Mexico's premier semi-professional soccer league, bringing together the most competitive clubs from across the country. Founded to bridge the gap between amateur football and the professional game, LigaD1 gives talented players a real platform to grow.",
  "home.aboutBody2": "With three competitive divisions and a rapidly growing fan base, LigaD1 is more than a competition — it's a movement built on passion, discipline, and community.",
  "home.aboutImgAlt": "LigaD1 season in action",
  "home.our": "OUR",
  "home.divisions": "DIVISIONS",
  "home.viewStandings": "View Standings",
  "home.latestNews": "Latest News",
  "home.viewAllNews": "View All News",
  "home.highlights": "Highlights",
  "home.viewAllHighlights": "View All Highlights",
  "home.topScorers": "Top Scorers",
  "home.sponsors": "Sponsors",
  "home.recentResults": "Recent Results",
  "home.pauseTicker": "Pause ticker",
  "home.resumeTicker": "Resume ticker",
  "ticker.pause": "Pause ticker",
  "ticker.resume": "Resume ticker",

  // Schedule
  "schedule.fixtures": "FIXTURES",
  "schedule.results": "RESULTS",
  "schedule.allDivisions": "All Divisions",
  "schedule.allSeasons": "All Seasons",
  "schedule.selectSeason": "Select Season",
  "schedule.noFixtures": "No fixtures found for this filter.",
  "schedule.completed": "Completed",
  "schedule.upcoming": "Upcoming",
  "schedule.vs": "vs",
  "schedule.legend":
    "P: Played · W: Wins · L: Losses · GF: Goals For · GA: Goals Against · GD: Goal Difference · PTS: Points",
  "schedule.matchDetails": "Match Details",
  "schedule.goals": "Goals",
  "schedule.cards": "Cards",
  "schedule.yellow": "Yellow",
  "schedule.red": "Red",
  "schedule.noGoals": "No goals recorded.",
  "schedule.noCards": "No cards recorded.",
  "schedule.noGoalOrCardDetails": "No goal or card details recorded for this match.",
  "schedule.matchDetailsCouldNotLoad": "Match details could not load.",
  "schedule.unknownPlayer": "Unknown player",

  // Standings
  "standings.team": "TEAM",
  "standings.p": "P",
  "standings.w": "W",
  "standings.l": "L",
  "standings.gf": "GF",
  "standings.ga": "GA",
  "standings.gd": "GD",
  "standings.pts": "PTS",
  "standings.legend":
    "P: Played · W: Wins · L: Losses · GF: Goals For · GA: Goals Against · GD: Goal Difference · PTS: Points",
  "standings.notAvailable": "Standings are not available yet.",
  "standings.empty": "Standings are not available yet.",

  // Top scorers
  "topScorers.title": "Top Scorers",
  "topScorers.subtitle": "Leading goal-scorers across the league.",
  "topScorers.allSeasons": "All Seasons",
  "topScorers.allDivisions": "All Divisions",
  "topScorers.player": "Player",
  "topScorers.team": "Team",
  "topScorers.goals": "Goals",
  "topScorers.empty": "No top scorers found for the selected filters.",

  // News
  "news.title": "News & Updates",
  "news.subtitle": "Latest from LigaD1",
  "news.empty": "No news articles available.",
  "news.notFound": "Article not found.",
  "news.back": "Back to News",
  "news.backToNews": "Back to News",
  "news.watchVideo": "Watch Video",
  "news.learnMore": "Learn More",

  // Highlights
  "highlights.title": "Highlights",
  "highlights.subtitle": "The best moments from LigaD1",
  "highlights.empty": "No highlights available.",
  "highlights.notFound": "Highlight not found.",
  "highlights.back": "Back to Highlights",
  "highlights.backToHighlights": "Back to Highlights",

  // Divisions
  "divisions.empty": "No divisions are published yet.",
  "divisions.noTeams": "No teams in this division yet.",
  "divisions.scrollLeft": "Scroll left",
  "divisions.scrollRight": "Scroll right",
  "divisions.back": "Back to Divisions",

  // Teams
  "teams.divisions": "Divisions",
  "teams.squad": "Squad",
  "teams.coaches": "Coaches",
  "teams.noPlayers": "No players listed yet.",
  "teams.noCoaches": "No coaches listed yet.",
  "teams.notFound": "Team not found.",
  "teams.backToDivisions": "Back to Divisions",

  // Fixture detail dialog
  "fixture.details": "Match Details",
  "fixture.detailsError": "Match details could not load.",
  "fixture.noEvents": "No goal or card details recorded for this match.",
  "fixture.goals": "Goals",
  "fixture.cards": "Cards",
  "fixture.yellow": "Yellow",
  "fixture.red": "Red",
  "fixture.noGoals": "No goals recorded.",
  "fixture.noCards": "No cards recorded.",
  "fixture.unknownPlayer": "Unknown player",

  // Register
  "register.title": "New Team Membership",
  "register.subtitle": "Submit a request to join LigaD1.",
  "register.formTitle": "Team Registration Request",
  "register.formIntro":
    "Fill in the details below and our team will get back to you within 3–5 business days.",
  "register.teamName": "Team Name *",
  "register.city": "City *",
  "register.contactName": "Contact Person Full Name *",
  "register.contactRole": "Describe your Role",
  "register.contactRolePlaceholder": "e.g. Team Manager",
  "register.email": "Email Address *",
  "register.phone": "Phone Number *",
  "register.divisionInterest": "Division Interest",
  "register.loadingDivisions": "Loading divisions...",
  "register.noPreference": "No Preference",
  "register.aboutTeam": "Tell us about your team",
  "register.aboutTeamPlaceholder":
    "Share any relevant background — how long active, number of players, previous league experience...",
  "register.submit": "Submit Request",
  "register.submitting": "Submitting...",
  "register.consent":
    "By submitting this form you agree to be contacted by LigaD1 regarding your application.",
  "register.requestSubmitted": "Request Submitted!",
  "register.thankYou":
    "Thank you for your interest. Our team will review your application and reach out within 3–5 business days.",
  "register.backHome": "Back to Home",
  "register.whyJoin": "Why Join LigaD1?",
  "register.benefit1": "Compete in one of Mexico's most organised semi-professional leagues",
  "register.benefit2": "Full access to LigaD1's scheduling, standings, and digital platform",
  "register.benefit3": "Exposure for your players and club to scouts and fans across the region",
  "register.haveQuestions": "Have questions?",
  "register.genericError": "Something went wrong. Please try again.",

  // About
  "about.eyebrow": "Who We Are",
  "about.title": "About Us",
  "about.subtitle": "The story behind LigaD1",
  "about.fallbackTitle": "More Than a League. A Community.",
  "about.fallbackSummary":
    "LigaD1 is Mexico's premier semi-professional soccer league, bringing together the most competitive clubs from across the country. Founded to bridge the gap between amateur football and the professional game, LigaD1 gives talented players a real platform to grow.",
  "about.mission.title": "Our Mission",
  "about.mission.body":
    "Develop the next generation of Mexican soccer talent through competitive, well-organized league play.",
  "about.vision.title": "Our Vision",
  "about.vision.body":
    "Become the most respected semi-professional league in Latin America, known for fair play and community impact.",
  "about.values.title": "Our Values",
  "about.values.body": "Passion, discipline, community, and respect — on the field and beyond.",

  // App prompt
  "app.download": "Download our app",
  "app.title": "For the best live experience —",
  "app.body": "Get the fastest push notifications and live stats for all games.",
  "app.get": "Get the {app} App",
  "app.continue": "Continue in browser",
  "appPrompt.ariaLabel": "Download our app",
  "appPrompt.title": "For the best live experience —",
  "appPrompt.subtitle": "Get the fastest push notifications and live stats for all games.",
  "appPrompt.getApp": "Get the {league} App",
  "appPrompt.continue": "Continue in browser",

  // Cards
  "cards.matchPhoto": "Match Photo",
  "cards.highlight": "Highlight",

  // 404 / error
  "notFound.title": "Page not found",
  "notFound.message": "The page you're looking for doesn't exist or has been moved.",
  "notFound.body": "The page you're looking for doesn't exist or has been moved.",
  "notFound.goHome": "Go home",
  "error.title": "This page didn't load",
  "error.message": "Something went wrong on our end.",
  "error.body": "Something went wrong on our end.",
  "error.tryAgain": "Try again",
  "error.goHome": "Go home",
  "error.websiteUnavailable": "Website unavailable",
  "error.configLoadFailed": "The public website configuration could not be loaded.",

  // Document titles
  "meta.home": "LigaD1 — The Heart of Mexican Soccer",
  "meta.divisions": "Divisions — LigaD1",
  "meta.schedule": "Schedule — LigaD1",
  "meta.standings": "Standings — LigaD1",
  "meta.news": "News & Updates — LigaD1",
  "meta.newsItem": "News — {slug} — LigaD1",
  "meta.highlights": "Highlights — LigaD1",
  "meta.highlightsItem": "Highlights — {slug} — LigaD1",
  "meta.about": "About Us — LigaD1",
  "meta.register": "New Team Membership — LigaD1",
  "meta.topScorers": "Top Scorers — LigaD1",
  "meta.team": "Team Profile — LigaD1",
};

const es: Record<TranslationKey, string> = {
  "language.en": "Inglés",
  "language.es": "Español",
  "nav.language": "Idioma",

  "nav.home": "Inicio",
  "nav.divisions": "Divisiones",
  "nav.schedule": "Calendario",
  "nav.standings": "Tabla General",
  "nav.news": "Noticias",
  "nav.highlights": "Destacados",
  "nav.topScorers": "Goleadores",
  "nav.about": "Nosotros",
  "nav.register": "Regístrate",
  "nav.newTeamMembership": "Nueva Membresía de Equipo",
  "nav.openMenu": "Abrir menú",
  "nav.closeMenu": "Cerrar menú",
  "nav.navigationMenu": "Menú de navegación",

  "common.retry": "Reintentar",
  "common.sectionCouldNotLoad": "Esta sección no pudo cargarse.",
  "common.sectionError": "Esta sección no pudo cargarse.",
  "common.loading": "Cargando…",
  "common.learnMore": "Saber más",
  "common.viewAll": "Ver todos",
  "common.noItems": "No se encontraron elementos.",
  "common.previous": "Anterior",
  "common.next": "Siguiente",

  "pagination.nav": "paginación",
  "pagination.previous": "Ir a la página anterior",
  "pagination.previousLabel": "Anterior",
  "pagination.next": "Ir a la página siguiente",
  "pagination.nextLabel": "Siguiente",

  "footer.quickLinks": "Enlaces rápidos",
  "footer.contact": "Contacto",
  "footer.copyright": "© {year} {league}. Todos los derechos reservados.",
  "footer.poweredBy": "Desarrollado por Clubucket",

  "home.heroTitle": "El Corazón del Futbol Mexicano",
  "home.heroCta": "Ver Calendario",
  "home.aboutEyebrow": "Acerca de LigaD1",
  "home.aboutTitle": "Más que una liga. Una comunidad.",
  "home.aboutBody1": "LigaD1 es la liga de fútbol semiprofesional premier de México, reuniendo a los clubes más competitivos de todo el país. Fundada para cerrar la brecha entre el fútbol amateur y el profesional, LigaD1 da a los jugadores talentosos una plataforma real para crecer.",
  "home.aboutBody2": "Con tres divisiones competitivas y una base de fans en rápido crecimiento, LigaD1 es más que una competencia — es un movimiento construido sobre pasión, disciplina y comunidad.",
  "home.aboutImgAlt": "La temporada de LigaD1 en acción",
  "home.our": "NUESTRAS",
  "home.divisions": "DIVISIONES",
  "home.viewStandings": "Ver Tabla",
  "home.latestNews": "Últimas Noticias",
  "home.viewAllNews": "Ver todas las noticias",
  "home.highlights": "Destacados",
  "home.viewAllHighlights": "Ver todos los destacados",
  "home.topScorers": "Goleadores",
  "home.sponsors": "Patrocinadores",
  "home.recentResults": "Resultados Recientes",
  "home.pauseTicker": "Pausar marcador",
  "home.resumeTicker": "Reanudar marcador",
  "ticker.pause": "Pausar marcador",
  "ticker.resume": "Reanudar marcador",

  "schedule.fixtures": "PARTIDOS",
  "schedule.results": "RESULTADOS",
  "schedule.allDivisions": "Todas las Divisiones",
  "schedule.allSeasons": "Todas las Temporadas",
  "schedule.selectSeason": "Seleccionar Temporada",
  "schedule.noFixtures": "No se encontraron partidos con este filtro.",
  "schedule.completed": "Finalizado",
  "schedule.upcoming": "Próximo",
  "schedule.vs": "vs",
  "schedule.legend":
    "P: Jugados · G: Ganados · P: Perdidos · GF: Goles a Favor · GA: Goles en Contra · DG: Diferencia de Goles · PTS: Puntos",
  "schedule.matchDetails": "Detalles del Partido",
  "schedule.goals": "Goles",
  "schedule.cards": "Tarjetas",
  "schedule.yellow": "Amarilla",
  "schedule.red": "Roja",
  "schedule.noGoals": "No se registraron goles.",
  "schedule.noCards": "No se registraron tarjetas.",
  "schedule.noGoalOrCardDetails": "No hay detalles de goles o tarjetas para este partido.",
  "schedule.matchDetailsCouldNotLoad": "No se pudieron cargar los detalles del partido.",
  "schedule.unknownPlayer": "Jugador desconocido",

  "standings.team": "EQUIPO",
  "standings.p": "PJ",
  "standings.w": "G",
  "standings.l": "P",
  "standings.gf": "GF",
  "standings.ga": "GC",
  "standings.gd": "DG",
  "standings.pts": "PTS",
  "standings.legend":
    "PJ: Partidos Jugados · G: Ganados · P: Perdidos · GF: Goles a Favor · GC: Goles en Contra · DG: Diferencia de Goles · PTS: Puntos",
  "standings.notAvailable": "La tabla aún no está disponible.",
  "standings.empty": "La tabla aún no está disponible.",

  "topScorers.title": "Goleadores",
  "topScorers.subtitle": "Los máximos goleadores de la liga.",
  "topScorers.allSeasons": "Todas las Temporadas",
  "topScorers.allDivisions": "Todas las Divisiones",
  "topScorers.player": "Jugador",
  "topScorers.team": "Equipo",
  "topScorers.goals": "Goles",
  "topScorers.empty": "No se encontraron goleadores con los filtros seleccionados.",

  "news.title": "Noticias y Actualizaciones",
  "news.subtitle": "Lo último de LigaD1",
  "news.empty": "No hay artículos de noticias disponibles.",
  "news.notFound": "Artículo no encontrado.",
  "news.back": "Volver a Noticias",
  "news.backToNews": "Volver a Noticias",
  "news.watchVideo": "Ver Video",
  "news.learnMore": "Saber más",

  "highlights.title": "Destacados",
  "highlights.subtitle": "Los mejores momentos de LigaD1",
  "highlights.empty": "No hay destacados disponibles.",
  "highlights.notFound": "Destacado no encontrado.",
  "highlights.back": "Volver a Destacados",
  "highlights.backToHighlights": "Volver a Destacados",

  "divisions.empty": "Aún no hay divisiones publicadas.",
  "divisions.noTeams": "Aún no hay equipos en esta división.",
  "divisions.scrollLeft": "Desplazarse a la izquierda",
  "divisions.scrollRight": "Desplazarse a la derecha",
  "divisions.back": "Volver a Divisiones",

  "teams.divisions": "Divisiones",
  "teams.squad": "Plantel",
  "teams.coaches": "Cuerpo Técnico",
  "teams.noPlayers": "Aún no hay jugadores registrados.",
  "teams.noCoaches": "Aún no hay técnicos registrados.",
  "teams.notFound": "Equipo no encontrado.",
  "teams.backToDivisions": "Volver a Divisiones",

  "fixture.details": "Detalles del Partido",
  "fixture.detailsError": "No se pudieron cargar los detalles del partido.",
  "fixture.noEvents": "No hay detalles de goles o tarjetas para este partido.",
  "fixture.goals": "Goles",
  "fixture.cards": "Tarjetas",
  "fixture.yellow": "Amarilla",
  "fixture.red": "Roja",
  "fixture.noGoals": "No se registraron goles.",
  "fixture.noCards": "No se registraron tarjetas.",
  "fixture.unknownPlayer": "Jugador desconocido",

  "register.title": "Nueva Membresía de Equipo",
  "register.subtitle": "Envía una solicitud para unirte a LigaD1.",
  "register.formTitle": "Solicitud de Registro de Equipo",
  "register.formIntro":
    "Completa los detalles a continuación y nuestro equipo se comunicará contigo en un plazo de 3 a 5 días hábiles.",
  "register.teamName": "Nombre del Equipo *",
  "register.city": "Ciudad *",
  "register.contactName": "Nombre Completo de la Persona de Contacto *",
  "register.contactRole": "Describe tu Rol",
  "register.contactRolePlaceholder": "ej. Mánager del Equipo",
  "register.email": "Correo Electrónico *",
  "register.phone": "Número de Teléfono *",
  "register.divisionInterest": "División de Interés",
  "register.loadingDivisions": "Cargando divisiones...",
  "register.noPreference": "Sin Preferencia",
  "register.aboutTeam": "Cuéntanos sobre tu equipo",
  "register.aboutTeamPlaceholder":
    "Comparte información relevante: cuánto tiempo activo, número de jugadores, experiencia en ligas anteriores...",
  "register.submit": "Enviar Solicitud",
  "register.submitting": "Enviando...",
  "register.consent":
    "Al enviar este formulario aceptas ser contactado por LigaD1 respecto a tu solicitud.",
  "register.requestSubmitted": "¡Solicitud Enviada!",
  "register.thankYou":
    "Gracias por tu interés. Nuestro equipo revisará tu solicitud y se comunicará contigo en un plazo de 3 a 5 días hábiles.",
  "register.backHome": "Volver al Inicio",
  "register.whyJoin": "¿Por qué unirte a LigaD1?",
  "register.benefit1": "Compite en una de las ligas semiprofesionales mejor organizadas de México",
  "register.benefit2":
    "Acceso completo al calendario, las tablas y la plataforma digital de LigaD1",
  "register.benefit3":
    "Visibilidad para tus jugadores y tu club ante visores y aficionados de la región",
  "register.haveQuestions": "¿Tienes preguntas?",
  "register.genericError": "Algo salió mal. Inténtalo de nuevo.",

  "about.title": "Nosotros",
  "about.eyebrow": "Quiénes Somos",
  "about.subtitle": "La historia detrás de LigaD1",
  "about.fallbackTitle": "Más que una liga. Una comunidad.",
  "about.fallbackSummary":
    "LigaD1 es la liga semiprofesional de futbol más importante de México, que reúne a los clubes más competitivos del país. Fundada para cerrar la brecha entre el futbol amateur y el juego profesional, LigaD1 da a los jugadores talentosos una plataforma real para crecer.",
  "about.mission.title": "Nuestra Misión",
  "about.mission.body":
    "Desarrollar a la próxima generación de talento futbolístico mexicano mediante una liga competitiva y bien organizada.",
  "about.vision.title": "Nuestra Visión",
  "about.vision.body":
    "Convertirnos en la liga semiprofesional más respetada de Latinoamérica, reconocida por el juego limpio y el impacto comunitario.",
  "about.values.title": "Nuestros Valores",
  "about.values.body": "Pasión, disciplina, comunidad y respeto, dentro y fuera de la cancha.",

  "app.download": "Descarga nuestra app",
  "app.title": "Para la mejor experiencia en vivo —",
  "app.body":
    "Recibe las notificaciones push más rápidas y estadísticas en vivo de todos los partidos.",
  "app.get": "Obtén la App de {app}",
  "app.continue": "Continuar en el navegador",
  "appPrompt.ariaLabel": "Descarga nuestra app",
  "appPrompt.title": "Para la mejor experiencia en vivo —",
  "appPrompt.subtitle":
    "Recibe las notificaciones push más rápidas y estadísticas en vivo de todos los partidos.",
  "appPrompt.getApp": "Obtén la App de {league}",
  "appPrompt.continue": "Continuar en el navegador",

  "cards.matchPhoto": "Foto del Partido",
  "cards.highlight": "Destacado",

  "notFound.title": "Página no encontrada",
  "notFound.message": "La página que buscas no existe o ha sido movida.",
  "notFound.body": "La página que buscas no existe o ha sido movida.",
  "notFound.goHome": "Ir al inicio",
  "error.title": "Esta página no cargó",
  "error.message": "Algo salió mal de nuestro lado.",
  "error.body": "Algo salió mal de nuestro lado.",
  "error.tryAgain": "Intentar de nuevo",
  "error.goHome": "Ir al inicio",
  "error.websiteUnavailable": "Sitio web no disponible",
  "error.configLoadFailed": "No se pudo cargar la configuración del sitio web público.",

  "meta.home": "LigaD1 — El Corazón del Futbol Mexicano",
  "meta.divisions": "Divisiones — LigaD1",
  "meta.schedule": "Calendario — LigaD1",
  "meta.standings": "Tabla General — LigaD1",
  "meta.news": "Noticias y Actualizaciones — LigaD1",
  "meta.newsItem": "Noticias — {slug} — LigaD1",
  "meta.highlights": "Destacados — LigaD1",
  "meta.highlightsItem": "Destacados — {slug} — LigaD1",
  "meta.about": "Nosotros — LigaD1",
  "meta.register": "Nueva Membresía de Equipo — LigaD1",
  "meta.topScorers": "Goleadores — LigaD1",
  "meta.team": "Perfil del Equipo — LigaD1",
};

export const translations: Record<string, Record<string, string>> = { en, es };

export function translate(locale: string, key: string, vars?: TranslateVars): string {
  const dict = translations[locale] ?? en;
  let value = dict[key] ?? en[key as TranslationKey] ?? key;
  if (vars) {
    for (const [name, v] of Object.entries(vars)) {
      if (v != null) value = value.split(`{${name}}`).join(String(v));
    }
  }
  return value;
}

export function isSpanishLocale(locale: string): boolean {
  return locale.toLowerCase().startsWith("es");
}

/** Full locale code for date formatting ("es-MX" / "en-US"). */
export function dateLocale(locale: string): string {
  return isSpanishLocale(locale) ? "es-MX" : "en-US";
}

export function useI18n() {
  const { locale, setLocale } = useLocale();
  const isSpanish = isSpanishLocale(locale);

  const t = useMemo(
    () => (key: string, vars?: TranslateVars) => translate(locale, key, vars),
    [locale],
  );

  return { locale, setLocale, t, isSpanish };
}

/** Keep the browser's <html lang> in sync with the active locale. */
export function useDocumentLanguage() {
  const { locale } = useLocale();
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = isSpanishLocale(locale) ? "es" : "en";
  }, [locale]);
}

/** Set `document.title` from a translation key whenever the locale changes. */
export function usePageTitle(key: string, vars?: TranslateVars) {
  const { locale } = useLocale();
  const title = translate(locale, key, vars);
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.title = title;
  }, [title]);
}
