export interface ProjectPage {
  slug: string;
  title: string;
  file: string; // path in /public/projects/ or external URL
  external?: boolean;
}

export interface Project {
  slug: string;
  title: string;
  description: string;
  pages: ProjectPage[];
}

export const projects: Project[] = [
  {
    slug: "siz-ag",
    title: "SIZ AG",
    description: "Schweizerisches Informatik-Zertifikat – Leiter Markt & Partner",
    pages: [
      {
        slug: "argumentarium",
        title: "Argumentarium",
        file: "/projects/siz-ag/SIZ_Argumentarium.html",
      },
      {
        slug: "einsatzgebiete",
        title: "Einsatzgebiete",
        file: "/projects/siz-ag/SIZ_Einsatzgebiete.html",
      },
      {
        slug: "website-analyse",
        title: "Website-Analyse",
        file: "/projects/siz-ag/SIZ_Website_Analyse.html",
      },
      {
        slug: "marketing",
        title: "Marketing-Software",
        file: "/projects/siz-ag/SIZ_Marketing.html",
      },
      {
        slug: "diplome",
        title: "Diplome-Übersicht",
        file: "/projects/siz-ag/SIZ_Diplome_Uebersicht.html",
      },
      {
        slug: "12wy-planner",
        title: "12 Week Year Planner",
        file: "https://planner.learnfluencer.ch",
        external: true,
      },
    ],
  },
  {
    slug: "mind-rocket",
    title: "Mind Rocket GmbH",
    description: "Programme und Lernformate für persönliche Entwicklung",
    pages: [
      {
        slug: "12wy-planner",
        title: "12 Week Year Planner",
        file: "https://planner.learnfluencer.ch",
        external: true,
      },
    ],
  },
  {
    slug: "hypnovital",
    title: "hypnovital",
    description: "Hypnose-Coaching, Audio-Programme & betriebliches Gesundheitsmanagement",
    pages: [
      {
        slug: "homepage",
        title: "hypnovital.net",
        file: "https://hypnovital.net",
        external: true,
      },
    ],
  },
  {
    slug: "mindrocket-trading",
    title: "Mind Rocket Trading",
    description: "Trading-Strategien, ES Futures, NinjaTrader & algorithmischer Handel",
    pages: [
      {
        slug: "homepage",
        title: "mindrocket-trading.com",
        file: "https://mindrocket-trading.com",
        external: true,
      },
    ],
  },
  {
    slug: "mindtools",
    title: "mindtools Werkzeugkiste",
    description: "Mentale Werkzeuge und Techniken für persönliche Entwicklung",
    pages: [
      {
        slug: "homepage",
        title: "mindtools.ch",
        file: "https://mindtools.ch",
        external: true,
      },
    ],
  },
  {
    slug: "12wy-planner",
    title: "12 Week Year Planner",
    description: "SaaS-Tool für Zielplanung nach der 12-Week-Year-Methode",
    pages: [
      {
        slug: "app",
        title: "12wy-planner.vercel.app",
        file: "https://12wy-planner.vercel.app",
        external: true,
      },
      {
        slug: "planner",
        title: "planner.learnfluencer.ch",
        file: "https://planner.learnfluencer.ch",
        external: true,
      },
    ],
  },
  {
    slug: "orgasmus",
    title: "Orgasmus hinauszögern",
    description: "Hypnose-Audio Landingpage – orgasmus-hinauszoegern.de",
    pages: [
      {
        slug: "homepage",
        title: "orgasmus-hinauszoegern.de",
        file: "https://orgasmus-hinauszoegern.de",
        external: true,
      },
    ],
  },
  {
    slug: "lampenfieber",
    title: "Lampenfieber besiegen",
    description: "Hypnose-Audio gegen Lampenfieber – lampenfieber-besiegen.de",
    pages: [
      {
        slug: "homepage",
        title: "lampenfieber-besiegen.de",
        file: "https://lampenfieber-besiegen.de",
        external: true,
      },
    ],
  },
  {
    slug: "learnfluencer",
    title: "learnfluencer",
    description: "Thought-Leadership-Plattform für Lernen, KI & Weiterbildung – learnfluencer.ch",
    pages: [
      {
        slug: "homepage",
        title: "learnfluencer.ch",
        file: "https://learnfluencer.ch",
        external: true,
      },
    ],
  },
  {
    slug: "marketingplan-software",
    title: "Marketingplan Software",
    description: "Interaktives Marketingkonzept-Tool – PESTEL, 5 Forces, SWOT, 7P, Budget, KPIs",
    pages: [
      {
        slug: "tool",
        title: "Marketingkonzept-Tool (learnfluencer)",
        file: "https://learnfluencer.ch/tools/marketingkonzept",
        external: true,
      },
    ],
  },
  {
    slug: "bestattungsplaner",
    title: "Bestattungsplaner",
    description: "Online-Portal für Bestattungsplanung in der Schweiz – bestattungsplaner.ch",
    pages: [
      {
        slug: "homepage",
        title: "bestattungsplaner.vercel.app",
        file: "https://bestattungsplaner.vercel.app",
        external: true,
      },
    ],
  },
];
