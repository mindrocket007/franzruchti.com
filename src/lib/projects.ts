export interface ProjectPage {
  slug: string;
  title: string;
  file: string; // path in /public/projects/ or external URL
  external?: boolean;
}

export interface ProjectAccess {
  label: string;
  url: string;
  username: string;
  password: string;
  note?: string;
}

export interface Project {
  slug: string;
  title: string;
  description: string;
  pages: ProjectPage[];
  defaultAccesses?: ProjectAccess[];
}

export const projects: Project[] = [
  {
    slug: "siz-ag",
    title: "SIZ AG",
    description: "Schweizerisches Informatik-Zertifikat – Leiter Markt & Partner",
    pages: [
      {
        slug: "meeting-wolfram",
        title: "Meeting Wolfram · Mo 20.04.2026",
        file: "/projects/siz-ag/Meeting_Wolfram_Montag.html",
      },
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
        slug: "pruefungsarten",
        title: "Prüfungsarten-Übersicht",
        file: "/projects/siz-ag/SIZ_Pruefungsarten.html",
      },
      {
        slug: "12wy-planner",
        title: "12 Week Year Planner",
        file: "https://planner.learnfluencer.ch",
        external: true,
      },
      {
        slug: "ceo-agent",
        title: "CEO Agentensystem",
        file: "/projects/siz-ag/CEO_Agent_Hub.html",
      },
      {
        slug: "ceo-100tage",
        title: "CEO 100-Tage-Plan",
        file: "/projects/siz-ag/CEO_Agent_100Tage.html",
      },
      {
        slug: "ceo-challenge",
        title: "CEO Challenge Chatbot",
        file: "/projects/siz-ag/CEO_Challenge_Chatbot.html",
      },
      {
        slug: "ceo-briefing",
        title: "CEO Briefing",
        file: "/projects/siz-ag/CEO_Briefing.html",
      },
      {
        slug: "ceo-dashboard",
        title: "CEO Dashboard",
        file: "/projects/siz-ag/CEO_Dashboard.html",
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
    description: "Interaktives Marketingkonzept-Tool – PESTEL, 5 Forces, SWOT, Ansoff, Porter, McKinsey, 7P, Budget, KPIs",
    pages: [
      {
        slug: "tool",
        title: "Marketingkonzept-Tool (learnfluencer)",
        file: "https://learnfluencer.ch/tools/marketingkonzept",
        external: true,
      },
      {
        slug: "template",
        title: "Marketingkonzept Template (leer)",
        file: "/projects/Marketingkonzept_Template.html",
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
  {
    slug: "monsieur-claude",
    title: "Monsieur Claude",
    description: "Schweizer Steuer- und Buchhaltungs-SaaS mit KI-Buchungsassistent, echter doppelter Buchhaltung nach OR 957 und integriertem Steuerdossier (Privat + Einzelunternehmen + GmbH/AG) – monsieur-claude.ch",
    pages: [
      {
        slug: "homepage",
        title: "monsieur-claude.ch",
        file: "https://monsieur-claude.ch",
        external: true,
      },
    ],
  },
  {
    slug: "madame-claude",
    title: "Madame Claude",
    description: "KI-Versicherungs- und Vorsorgeportal für die Schweiz. Policen hochladen → Claude extrahiert → Lücken/Doppeldeckungen/Aktionsplan. Pendant zu Monsieur Claude mit gemeinsamer Datenbasis via Review-Token – madame-claude.ch",
    pages: [
      {
        slug: "homepage",
        title: "madame-claude.ch",
        file: "https://madame-claude.ch",
        external: true,
      },
      {
        slug: "dashboard",
        title: "User-Dashboard",
        file: "https://madame-claude.ch/dashboard",
        external: true,
      },
      {
        slug: "admin",
        title: "Admin-Panel",
        file: "https://madame-claude.ch/admin",
        external: true,
      },
      {
        slug: "github",
        title: "GitHub Repo",
        file: "https://github.com/mindrocket007/madame-claude",
        external: true,
      },
    ],
    defaultAccesses: [
      {
        label: "Madame Claude – User (Franz)",
        url: "https://madame-claude.ch/login",
        username: "franzruchti@me.com",
        password: "MadameClaude2026!",
        note: "Normaler Kunden-Account. Analyse-ID: 3afcb9ed-927e-41ba-8ae9-1036e24ee5f5 (Unternehmer-Tier, 16 Policen, bereits analysiert).",
      },
      {
        label: "Madame Claude – Admin",
        url: "https://madame-claude.ch/admin",
        username: "franzruchti@me.com",
        password: "MadameClaude2026!",
        note: "Gleicher Account wie User — Admin-Zugriff über ADMIN_EMAIL=franzruchti@me.com auto-erkannt.",
      },
    ],
  },
];
