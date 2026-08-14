import news1 from "@/assets/news-1.jpg";
import news2 from "@/assets/news-2.jpg";
import news3 from "@/assets/news-3.jpg";
import news4 from "@/assets/news-4.jpg";
import news5 from "@/assets/news-5.jpg";

export type Team = {
  id: string;
  name: string;
  initials: string;
  division: "Bajío Zone" | "Downtown Area";
};

export const teams: Team[] = [
  { id: "sports-club-f", name: "Sports Club F", initials: "SCF", division: "Bajío Zone" },
  { id: "project-talents", name: "Project Talents", initials: "PT", division: "Bajío Zone" },
  { id: "cheran-owls", name: "Cheran Owls", initials: "CO", division: "Bajío Zone" },
  { id: "comonfort-academy", name: "Comonfort Academy", initials: "CA", division: "Bajío Zone" },
  { id: "independent-club-v", name: "Independent Club V", initials: "ICV", division: "Bajío Zone" },
  { id: "pl-jerez-fc", name: "PL Jerez FC", initials: "PLJ", division: "Bajío Zone" },
  {
    id: "furniture-makers-fc",
    name: "Furniture Makers FC",
    initials: "FMF",
    division: "Bajío Zone",
  },
  { id: "cf-barracuda-da", name: "Barracudas CL", initials: "BCL", division: "Downtown Area" },
  { id: "fc-mixquiahuala-da", name: "FC Mixquiahuala", initials: "MIX", division: "Downtown Area" },
  {
    id: "dragons-metepec-da",
    name: "Dragones Metepec FC",
    initials: "DMF",
    division: "Downtown Area",
  },
  {
    id: "tecos-temascalapa-da",
    name: "Tecos Temascalapa",
    initials: "TT",
    division: "Downtown Area",
  },
  {
    id: "fc-galeones-da",
    name: "FC Galeones Acapulco",
    initials: "FGA",
    division: "Downtown Area",
  },
  {
    id: "tuzos-altiplano-da",
    name: "Tuzos Altiplano FC",
    initials: "TAF",
    division: "Downtown Area",
  },
  {
    id: "resilience-ac-da",
    name: "Acapulco Resilience",
    initials: "ACR",
    division: "Downtown Area",
  },
];

export const divisions = ["Bajío Zone", "Downtown Area"] as const;

export function getTeam(id: string) {
  return teams.find((t) => t.id === id);
}
export function teamByName(name: string) {
  return teams.find((t) => t.name === name)!;
}

export type Fixture = {
  jornada: number;
  date: string;
  time: string;
  home: string;
  away: string;
  homeScore?: number;
  awayScore?: number;
  status: "Completed" | "Upcoming";
  venue: string;
};

export const resultados: { jornada: string; label: string; matches: Fixture[] }[] = [
  {
    jornada: "ROUND 4",
    label: "14–18 MAY 2026",
    matches: [
      {
        jornada: 4,
        date: "15 May",
        time: "18:00",
        home: "Barracudas CL",
        away: "FC Mixquiahuala",
        homeScore: 0,
        awayScore: 2,
        status: "Completed",
        venue: "Estadio Barracudas, Celaya",
      },
      {
        jornada: 4,
        date: "16 May",
        time: "18:00",
        home: "FC Galeones Acapulco",
        away: "Dragones Metepec FC",
        homeScore: 2,
        awayScore: 0,
        status: "Completed",
        venue: "Estadio Galeones, Acapulco",
      },
    ],
  },
  {
    jornada: "ROUND 3",
    label: "7–11 MAY 2026",
    matches: [
      {
        jornada: 3,
        date: "8 May",
        time: "18:00",
        home: "FC Mixquiahuala",
        away: "Barracudas CL",
        homeScore: 4,
        awayScore: 0,
        status: "Completed",
        venue: "Estadio Mixquiahuala, Hidalgo",
      },
      {
        jornada: 3,
        date: "10 May",
        time: "18:00",
        home: "Acapulco Resilience",
        away: "FC Galeones Acapulco",
        homeScore: 1,
        awayScore: 1,
        status: "Completed",
        venue: "Estadio Resilience, Acapulco",
      },
    ],
  },
  {
    jornada: "ROUND 2",
    label: "30 APRIL–4 MAY 2026",
    matches: [
      {
        jornada: 2,
        date: "1 May",
        time: "18:00",
        home: "Tecos Temascalapa",
        away: "Dragones Metepec FC",
        homeScore: 2,
        awayScore: 0,
        status: "Completed",
        venue: "Estadio Tecos, Temascalapa",
      },
    ],
  },
];

export const proximos: { jornada: string; label: string; matches: Fixture[] }[] = [
  {
    jornada: "ROUND 5",
    label: "21–25 MAY 2026",
    matches: [
      {
        jornada: 5,
        date: "23 May",
        time: "18:00",
        home: "FC Mixquiahuala",
        away: "Barracudas CL",
        status: "Upcoming",
        venue: "Estadio Mixquiahuala, Hidalgo",
      },
    ],
  },
];

export type StandingRow = {
  team: string;
  pj: number;
  g: number;
  e: number;
  p: number;
  gf: number;
  gc: number;
  pts: number;
};

export const standings: Record<string, StandingRow[]> = {
  "Bajío Zone": [
    { team: "PL Jerez FC", pj: 10, g: 8, e: 0, p: 2, gf: 34, gc: 12, pts: 24 },
    { team: "Furniture Makers FC", pj: 10, g: 7, e: 1, p: 2, gf: 23, gc: 9, pts: 22 },
    { team: "Sports Club F", pj: 10, g: 6, e: 0, p: 4, gf: 26, gc: 22, pts: 18 },
    { team: "Cheran Owls", pj: 9, g: 4, e: 2, p: 3, gf: 21, gc: 4, pts: 14 },
    { team: "Project Talents", pj: 9, g: 3, e: 2, p: 4, gf: 13, gc: 12, pts: 11 },
    { team: "Independent Club V", pj: 9, g: 3, e: 1, p: 5, gf: 18, gc: 21, pts: 10 },
    { team: "Comonfort Academy", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, pts: 0 },
  ],
  "Downtown Area": [
    { team: "Barracudas CL", pj: 10, g: 9, e: 0, p: 1, gf: 37, gc: 7, pts: 27 },
    { team: "Tecos Temascalapa", pj: 11, g: 5, e: 2, p: 4, gf: 28, gc: 14, pts: 17 },
    { team: "Dragones Metepec FC", pj: 10, g: 5, e: 1, p: 3, gf: 16, gc: 10, pts: 16 },
    { team: "Tuzos Altiplano FC", pj: 10, g: 4, e: 1, p: 5, gf: 18, gc: 5, pts: 13 },
    { team: "Acapulco Resilience", pj: 10, g: 4, e: 0, p: 6, gf: 12, gc: 28, pts: 12 },
    { team: "FC Galeones Acapulco", pj: 10, g: 3, e: 1, p: 6, gf: 21, gc: 31, pts: 10 },
  ],
};

export type Player = {
  number: number;
  name: string;
  position: "GK" | "DF" | "MF" | "FW";
  nationality: string;
};

export const fcAztecaSquad: Player[] = [
  { number: 1, name: "Rodrigo Álvarez", position: "GK", nationality: "Mexico" },
  { number: 5, name: "Carlos Méndez", position: "DF", nationality: "Mexico" },
  { number: 4, name: "Javier Soto", position: "DF", nationality: "Mexico" },
  { number: 3, name: "Rafael Cruz", position: "DF", nationality: "Mexico" },
  { number: 2, name: "Eduardo Flores", position: "DF", nationality: "Mexico" },
  { number: 8, name: "Óscar Lima", position: "MF", nationality: "Mexico" },
  { number: 6, name: "Diego Herrera", position: "MF", nationality: "Mexico" },
  { number: 11, name: "Andrés Vega", position: "MF", nationality: "Mexico" },
  { number: 7, name: "Pablo Torres", position: "MF", nationality: "Mexico" },
  { number: 9, name: "Fernando Ruiz", position: "FW", nationality: "Mexico" },
  { number: 10, name: "Marcos Ibáñez", position: "FW", nationality: "Mexico" },
];

export const news = [
  {
    category: "LEAGUE NEWS",
    title: "Spring 2026 Season Kicks Off with Record Attendance Across All Venues",
    date: "May 10, 2026",
    excerpt: "LigaD1 opens its season with unprecedented fan turnout and renewed energy...",
    image: news1,
  },
  {
    category: "PLAYER SPOTLIGHT",
    title: "Óscar Lima Named Player of the Month for April",
    date: "May 5, 2026",
    excerpt:
      "The Bajío Zone midfielder has been in stunning form, contributing 5 goals and 3 assists...",
    image: news2,
  },
  {
    category: "FIXTURE NEWS",
    title: "Round 5 Fixtures Confirmed — Key Clashes Ahead",
    date: "May 17, 2026",
    excerpt: "The upcoming round features marquee matchups across the divisions...",
    image: news3,
  },
  {
    category: "CLUB NEWS",
    title: "FC Mixquiahuala Extend Winning Run to Four Games in Bajío Zone",
    date: "May 15, 2026",
    excerpt:
      "FC Mixquiahuala continue their flawless start to the season with another commanding win...",
    image: news4,
  },
  {
    category: "LEAGUE NEWS",
    title: "LigaD1 Partners with Local Youth Academies for Player Development",
    date: "May 3, 2026",
    excerpt:
      "A new initiative aims to bridge youth football and the semi-pro game across Mexico...",
    image: news5,
  },
];

export const highlights = [
  {
    category: "MATCH HIGHLIGHTS",
    title: "Barracudas CL 0–2 FC Mixquiahuala — Round 4 Recap",
    date: "May 15, 2026",
    excerpt:
      "Watch the full highlights from a tight away win for Mixquiahuala in the Downtown Area.",
    image: news1,
  },
  {
    category: "TOP GOALS",
    title: "Top 5 Goals of the Month — April 2026",
    date: "May 2, 2026",
    excerpt: "From thunderous strikes to silky team moves, here are April's best finishes.",
    image: news2,
  },
  {
    category: "PLAYER OF THE WEEK",
    title: "Óscar Lima's Masterclass vs PL Jerez FC",
    date: "May 11, 2026",
    excerpt:
      "A goal, two assists, and 92% pass accuracy — relive Lima's complete midfield performance.",
    image: news3,
  },
  {
    category: "MATCH HIGHLIGHTS",
    title: "FC Galeones 2–0 Dragones Metepec — Statement Win",
    date: "May 16, 2026",
    excerpt: "Galeones dominate at home with a clinical first-half display.",
    image: news4,
  },
  {
    category: "BEST SAVES",
    title: "Top Goalkeeper Saves — Round 3 & 4",
    date: "May 12, 2026",
    excerpt: "The keepers who kept their teams in the fight across the past two rounds.",
    image: news5,
  },
];
