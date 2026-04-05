export interface NewsItem {
  summary: string;
  source: string;
  url: string;
  date: string;
  category: string;
  addedAt: string; // ISO date YYYY-MM-DD – für NEW-Badge
}

export interface SocialMention {
  platform: string;
  description: string;
  url: string;
  date: string;
  sentiment: "positiv" | "neutral" | "negativ";
  author?: string; // Wer hat geschrieben/erwähnt
  addedAt: string; // ISO date YYYY-MM-DD – für NEW-Badge
}

export interface ProjectIntel {
  news: NewsItem[];
  social: SocialMention[];
  socialSummary?: string;
}

export const projectIntel: Record<string, ProjectIntel> = {
  "siz-ag": {
    news: [
      // SIZ AG direkt
      {
        summary: "SIZ AG führt per April 2026 ein komplett neues mySIZ-System ein, das benutzerfreundlicher und leistungsfähiger sein soll.",
        source: "SIZ Newsflash",
        url: "https://siz.ch/newsflash-dezember-2025/",
        date: "12.12.2025",
        category: "SIZ AG direkt",
        addedAt: "2026-04-05",
      },
      {
        summary: "SIZ AG Geschäftsstelle ist seit 1. Oktober 2025 an die Reitergasse 9, Zürich (Büro des Kaufmännischen Verbands Schweiz) umgezogen.",
        source: "SIZ Newsflash",
        url: "https://siz.ch/newsflash-oktober2025/",
        date: "Oktober 2025",
        category: "SIZ AG direkt",
        addedAt: "2026-04-05",
      },
      {
        summary: "Alle bestandenen Modulprüfungen und Diplome werden ab 2025 nur noch als digitale Zertifikate ausgestellt (fälschungssicheres PDF via mySIZ).",
        source: "SIZ Newsflash",
        url: "https://siz.ch/newsflash-april-2025/",
        date: "21.04.2025",
        category: "SIZ AG direkt",
        addedAt: "2026-04-05",
      },
      {
        summary: "SIZ lanciert neues Modul PU45 'ICT Technologien' – Lernziel-Checks ab Januar 2026, Modulprüfungen ab Mai 2026.",
        source: "SIZ Newsflash",
        url: "https://siz.ch/newsflash-januar-2026/",
        date: "Januar 2026",
        category: "SIZ AG direkt",
        addedAt: "2026-04-05",
      },
      {
        summary: "Module AU1 und AU2 werden zu neuem Modul 'AU1 Communication & Presentation' zusammengelegt (ab Schuljahr 2026/27).",
        source: "SIZ Newsflash",
        url: "https://siz.ch/newsflash-november-2025/",
        date: "November 2025",
        category: "SIZ AG direkt",
        addedAt: "2026-04-05",
      },
      {
        summary: "Modulprüfungen für ICT Power-User SIZ (Web) werden nur noch bis Ende 2026 angeboten – Entscheidung über Fortführung steht aus.",
        source: "SIZ Newsflash",
        url: "https://siz.ch/newsflash-dezember-2025/",
        date: "Dezember 2025",
        category: "SIZ AG direkt",
        addedAt: "2026-04-05",
      },
      // Digitale Bildung
      {
        summary: "Neuer eidgenössischer Fachausweis 'AI Business Specialist' vom SBFI genehmigt – erste Berufsprüfung im Herbst 2026.",
        source: "SRF / ICT-Berufsbildung Schweiz",
        url: "https://www.srf.ch/news/schweiz/ai-business-specialist-ki-spezialisten-koennen-ab-naechstem-jahr-berufspruefung-absolvieren",
        date: "2025",
        category: "Digitale Bildung",
        addedAt: "2026-04-05",
      },
      {
        summary: "ICT-Berufsbildung Schweiz hat im März 2026 insgesamt 145 ICT-Fachkräfte diplomiert (77 Cyber Security, 52 Platform Dev, 16 InfoSec).",
        source: "Netzwoche",
        url: "https://www.netzwoche.ch/news/2026-03-31/ict-berufsbildung-schweiz-diplomiert-145-ict-fachkraefte",
        date: "31.03.2026",
        category: "Digitale Bildung",
        addedAt: "2026-04-05",
      },
      {
        summary: "Ab Januar 2026 heisst der ECDL in der Schweiz offiziell ICDL (International Certification of Digital Literacy).",
        source: "Swiss Informatics",
        url: "https://swissinformatics.org/ecdl.php?Lang=de",
        date: "2025/2026",
        category: "Digitale Bildung",
        addedAt: "2026-04-05",
      },
      {
        summary: "Bildungsbericht 2026: 90% der Schüler in der Sekundarstufe I nutzen bereits generative KI – KI verändert Lernen und Arbeitsmarkt grundlegend.",
        source: "SBFI / SKBF",
        url: "https://www.sbfi.admin.ch/de/newnsb/xxaqE43omx0pByMGNfRVe",
        date: "23.03.2026",
        category: "Digitale Bildung",
        addedAt: "2026-04-05",
      },
      {
        summary: "Ab 2026 gelten neue SBFI-Mindestvorschriften für die Allgemeinbildung in der Berufsbildung zur besseren Vorbereitung auf die Digitalisierung.",
        source: "SBFI",
        url: "https://www.sbfi.admin.ch/de/digitalisierung-in-der-bildung",
        date: "09.04.2025",
        category: "Digitale Bildung",
        addedAt: "2026-04-05",
      },
      // Arbeitsmarkt & IT
      {
        summary: "Bis 2033 fehlen in der Schweiz 54'400 ICT-Fachkräfte – die Lücke bleibt trotz Ausbildung und Zuwanderung erheblich.",
        source: "Netzwoche / ICT-Berufsbildung",
        url: "https://www.netzwoche.ch/news/2025-09-18/bis-2033-fehlen-in-der-schweiz-54000-ict-fachkraefte",
        date: "18.09.2025",
        category: "Arbeitsmarkt & IT",
        addedAt: "2026-04-05",
      },
      {
        summary: "KI drückt die Nachfrage nach IT-Fachkräften – der Fachkräftemangel-Index sinkt 2025 um 22% gegenüber dem Vorjahr.",
        source: "Netzwoche",
        url: "https://www.netzwoche.ch/news/2025-11-28/ki-drueckt-die-nachfrage-nach-it-fachkraeften",
        date: "28.11.2025",
        category: "Arbeitsmarkt & IT",
        addedAt: "2026-04-05",
      },
      {
        summary: "PwC AI Jobs Barometer: KI-Jobs in der Schweiz haben sich seit 2018 verzehnfacht (von 2'000 auf 20'000 Stellenausschreibungen).",
        source: "PwC Schweiz",
        url: "https://www.pwc.ch/de/presse/AI_Jobs_Barometer_2025.html",
        date: "2025",
        category: "Arbeitsmarkt & IT",
        addedAt: "2026-04-05",
      },
      {
        summary: "KOF ETH: Nach Einführung von ChatGPT steigt die Zahl der Stellensuchenden in KI-exponierten Berufen um 27% stärker.",
        source: "KOF ETH Zürich",
        url: "https://kof.ethz.ch/news-und-veranstaltungen/kof-news/2025/10/kuenstliche-intelligenz-hinterlaesst-deutliche-spuren-auf-dem-schweizer-arbeitsmarkt.html",
        date: "27.10.2025",
        category: "Arbeitsmarkt & IT",
        addedAt: "2026-04-05",
      },
      {
        summary: "swissICT: 'Bis vor kurzem war es ein Wunder, eine ICT-Fachkraft zu finden – jetzt ist es nur noch schwierig.'",
        source: "swissICT",
        url: "https://www.swissict.ch/ict-arbeitsmarktzahlen-maerz2025-hunziker/",
        date: "März 2025",
        category: "Arbeitsmarkt & IT",
        addedAt: "2026-04-05",
      },
      // Bildungspolitik
      {
        summary: "SBFI hat 2025 insgesamt 43 neue oder revidierte Berufe genehmigt, darunter den neuen 'AI Business Specialist'.",
        source: "SBFI",
        url: "https://www.sbfi.admin.ch/de/newnsb/99wjr4Bk83kLHmHW7DhL5",
        date: "2025",
        category: "Bildungspolitik",
        addedAt: "2026-04-05",
      },
      {
        summary: "Eidgenössische Räte verabschieden Massnahmenpaket zur Stärkung der höheren Berufsbildung (Bekanntheit und Ansehen).",
        source: "SBFI",
        url: "https://www.sbfi.admin.ch/de/massnahmenpaket-zur-staerkung-der-hoeheren-berufsbildung",
        date: "Winter 2025",
        category: "Bildungspolitik",
        addedAt: "2026-04-05",
      },
      {
        summary: "Bildungsbericht 2026: 'Herkunft schlägt Leistung' – Warnsignale für die Berufsbildung, stärkere Förderung gefordert.",
        source: "Syna",
        url: "https://syna.ch/aktuell/bildungsbericht-schweiz-2026-warnsignale-fuer-die-berufsbildung",
        date: "März 2026",
        category: "Bildungspolitik",
        addedAt: "2026-04-05",
      },
      {
        summary: "Bund stellt 2026-2028 insgesamt 3 Mio. CHF für Förderschwerpunkt 'Betriebliche Bildung' bereit.",
        source: "SBFI",
        url: "https://www.sbfi.admin.ch/de/foerderschwerpunkt-betriebliche-bildung",
        date: "2025/2026",
        category: "Bildungspolitik",
        addedAt: "2026-04-05",
      },
      // Wirtschaft & Digitalisierung
      {
        summary: "Bundesrat verabschiedet Strategie Digitale Schweiz 2026 – Fokus: digitale Souveränität, digitaler Gaststaat, E-ID.",
        source: "Bundesrat / admin.ch",
        url: "https://www.news.admin.ch/de/newnsb/d6evGIoTYTmY4VMGk0-v0",
        date: "12.12.2025",
        category: "Wirtschaft & Digitalisierung",
        addedAt: "2026-04-05",
      },
      {
        summary: "76% der Schweizer Bevölkerung nutzen 2026 regelmässig KI-Tools – administrative Prozesse in KMU laufen 35% schneller.",
        source: "Nume.ch",
        url: "https://www.nume.ch/ki-nutzung-schweiz-2026-76-nutzen-kuenstliche-intelligenz/",
        date: "2026",
        category: "Wirtschaft & Digitalisierung",
        addedAt: "2026-04-05",
      },
      {
        summary: "Über ein Fünftel der Schweizer Bevölkerung fühlt sich nicht in der Lage, mit dem Tempo des technologischen Fortschritts mitzuhalten.",
        source: "Handelszeitung",
        url: "https://www.handelszeitung.ch/insurance/digitaltage-6-studie-switzerlands-digital-dna-536956",
        date: "2025/2026",
        category: "Wirtschaft & Digitalisierung",
        addedAt: "2026-04-05",
      },
      {
        summary: "SECO erwartet Anstieg der Arbeitslosigkeit von 2,9% (2025) auf 3,2% (2026), Beschäftigungswachstum unter Langzeit-Durchschnitt.",
        source: "SECO / Capiwell",
        url: "https://capiwell.ch/en/swiss-it-labour-market-2026-specialised-skills-slower-growth-and-new-openings-for-start-ups/",
        date: "2026",
        category: "Wirtschaft & Digitalisierung",
        addedAt: "2026-04-05",
      },
    ],
    social: [
      // Erwähnungen durch Personen / Organisationen
      {
        platform: "LinkedIn",
        description: "Diverse Absolventen führen SIZ-Diplome in ihren Profilen – u.a. bei Mercedes-Benz, ISP AG, BWZ Oftringen.",
        url: "https://ch.linkedin.com/company/siz-ag",
        date: "laufend",
        sentiment: "positiv",
        author: "Diverse Absolventen",
        addedAt: "2026-04-05",
      },
      {
        platform: "LinkedIn",
        description: "SIZ AG Unternehmensseite mit 346 Followern – 'führende ICT-Prüfungsorganisation der Schweiz'.",
        url: "https://ch.linkedin.com/company/siz-ag",
        date: "laufend",
        sentiment: "neutral",
        author: "SIZ AG (eigene Seite)",
        addedAt: "2026-04-05",
      },
      {
        platform: "LinkedIn",
        description: "Ronald G. Müller gelistet als 'Präsident Prüfungskommission Web - SIZ AG'.",
        url: "https://www.linkedin.com/in/ronald-g-m%C3%BCller-8163b6156/",
        date: "laufend",
        sentiment: "neutral",
        author: "Ronald G. Müller",
        addedAt: "2026-04-05",
      },
      {
        platform: "Swico",
        description: "Offizielle Partnerseite von Swico verlinkt und empfiehlt das Schweizerische Informatik-Zertifikat SIZ.",
        url: "https://www.swico.ch/de/bildung/schweizerisches-informatik-zertifikat-siz/",
        date: "laufend",
        sentiment: "positiv",
        author: "Swico (Branchenverband)",
        addedAt: "2026-04-05",
      },
      {
        platform: "ausbildung-weiterbildung.ch",
        description: "Umfassende Info-Seite über SIZ-Diplome mit Schulübersicht und Beratungsangeboten.",
        url: "https://www.ausbildung-weiterbildung.ch/siz-info.html",
        date: "laufend",
        sentiment: "positiv",
        author: "Bildungsportal-Redaktion",
        addedAt: "2026-04-05",
      },
      {
        platform: "IT Magazine",
        description: "Vergleichsstudie HSLU: SIZ und ECDL gleichwertig, SIZ sogar leicht besser (84% vs. 76% Praxistransfer).",
        url: "https://www.itmagazine.ch/Artikel/3219/ICT-Zertifikate_SIZ_und_ECDL_gleich_gut.html",
        date: "04.05.2010",
        sentiment: "positiv",
        author: "IT Magazine Redaktion",
        addedAt: "2026-04-05",
      },
      {
        platform: "Inside-IT",
        description: "'SIZ und ECDL unter der Lupe' – Unterschiede als 'marginal' bezeichnet, SIZ in der Schweiz besonders anerkannt.",
        url: "https://www.inside-it.ch/post/siz-und-ecdl-unter-der-lupe-20100504",
        date: "04.05.2010",
        sentiment: "positiv",
        author: "Inside-IT Redaktion",
        addedAt: "2026-04-05",
      },
      {
        platform: "karriere.ch",
        description: "Forum-Diskussion 'SIZ oder ECDL' – Nutzer fragen nach dem besseren Zertifikat für den Lebenslauf.",
        url: "https://www.karriere.ch/bildung/bildungsberatung/SIZ-oder-ECDL-608-forum-bildungsberatung.asp",
        date: "unbekannt",
        sentiment: "neutral",
        author: "Forum-Nutzer",
        addedAt: "2026-04-05",
      },
      {
        platform: "Facebook",
        description: "Offizielle Facebook-Seite existiert, ist aber kaum sichtbar – Inhalte nur mit Login einsehbar.",
        url: "https://m.facebook.com/profile.php?id=469021269857269",
        date: "unbekannt",
        sentiment: "neutral",
        author: "SIZ AG (eigene Seite)",
        addedAt: "2026-04-05",
      },
      {
        platform: "Google Reviews",
        description: "SIZ AG betreibt einen Wettbewerb für Absolventen – konkrete Bewertungen nicht öffentlich einsehbar.",
        url: "https://siz.ch/wettbewerb/",
        date: "laufend",
        sentiment: "neutral",
        addedAt: "2026-04-05",
      },
      // Plattformen ohne Präsenz
      {
        platform: "X / Twitter",
        description: "Kein Account und keine Erwähnungen gefunden – SIZ AG ist auf X/Twitter komplett unsichtbar.",
        url: "",
        date: "Stand 05.04.2026",
        sentiment: "negativ",
        addedAt: "2026-04-05",
      },
      {
        platform: "YouTube",
        description: "Keine Videos zu SIZ AG oder SIZ-Zertifikaten gefunden – weder eigene noch von Schulen oder Absolventen.",
        url: "",
        date: "Stand 05.04.2026",
        sentiment: "negativ",
        addedAt: "2026-04-05",
      },
      {
        platform: "Instagram",
        description: "Kein Profil und keine Posts mit SIZ-bezogenen Tags gefunden.",
        url: "",
        date: "Stand 05.04.2026",
        sentiment: "negativ",
        addedAt: "2026-04-05",
      },
      {
        platform: "TikTok",
        description: "Keinerlei Inhalte zu SIZ AG oder SIZ-Zertifikaten auffindbar.",
        url: "",
        date: "Stand 05.04.2026",
        sentiment: "negativ",
        addedAt: "2026-04-05",
      },
      {
        platform: "Kununu / Glassdoor",
        description: "Kein Firmenprofil oder Arbeitgeberbewertungen vorhanden.",
        url: "",
        date: "Stand 05.04.2026",
        sentiment: "negativ",
        addedAt: "2026-04-05",
      },
    ],
    socialSummary: "Die Social-Media-Präsenz der SIZ AG ist extrem schwach. LinkedIn ist der einzige aktive Kanal (346 Follower). Kein X, kein YouTube, kein Instagram, kein TikTok. Die grösste Sichtbarkeit entsteht indirekt durch Absolventen, die SIZ-Diplome in LinkedIn-Profilen führen. Für eine Organisation mit über 100'000 Absolventen seit 1991 ist die digitale Sichtbarkeit bemerkenswert gering.",
  },
  "mind-rocket": {
    news: [],
    social: [],
    socialSummary: "Noch keine Recherche durchgeführt.",
  },
};
