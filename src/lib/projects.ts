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
];
