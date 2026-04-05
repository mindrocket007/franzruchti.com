const words = [
  "Macher",
  "Unternehmer",
  "Mensch",
  "Vater",
  "Buchautor",
  "Coach",
  "Gründer",
  "Stratege",
  "Verkaufsleiter",
  "Marketingleiter",
  "Visionär",
  "Leader",
  "Lernexperte",
  "Prüfungsexperte",
  "Personalfachmann",
  "Netzwerker",
  "Motivator",
  "Problemlöser",
  "Mentor",
  "Brückenbauer",
  "Denker",
  "Gestalter",
  "Wegbereiter",
  "Praktiker",
  "Innovator",
  "Teamplayer",
  "Möglichmacher",
  "Querdenker",
  "Optimist",
  "Bergmensch",
  "Schweizer",
  "Sarner",
  "Ehemann",
  "Freund",
  "Zuhörer",
  "Frühaufsteher",
  "Kaffeetrinker",
  "Sporttreibender",
  "Hundebesitzer",
  "Lernender",
  "Dozent",
  "Sparringspartner",
  "Menschenkenner",
  "Digitalisierer",
  "Bildungsmensch",
  "Tüftler",
  "Antreiber",
  "Umsetzer",
  "Entscheider",
  "Zielsetzer",
  "Strukturierer",
  "Vereinfacher",
  "Wissensvermittler",
  "Mutmacher",
  "Vorangeher",
  "Branchenwechsler",
  "Ideengeber",
  "Chancensucher",
  "Weiterdenker",
  "Erfahrungssammler",
  "Perspektivenwechsler",
  "Handwerker",
  "Klartexter",
  "Herausforderer",
  "Zuverlässiger",
  "Anpacker",
  "Vernetzer",
  "Geschichtenerzähler",
  "Podcashhörer",
  "Geniesser",
];

export default function Home() {
  const maxSize = 72;
  const minSize = 6;
  const step = (maxSize - minSize) / (words.length - 1);

  return (
    <main className="min-h-screen bg-black px-6 py-16 md:px-16 lg:px-24">
      <h1 className="text-white text-2xl md:text-3xl font-light mb-12 tracking-wide">
        Franz Ruchti ist<span className="text-neutral-500">...</span>
      </h1>

      <div className="flex flex-wrap gap-x-6 gap-y-3 items-baseline">
        {words.map((word, i) => {
          const size = Math.round(maxSize - i * step);
          const opacity = 1 - (i / words.length) * 0.7;
          return (
            <span
              key={word}
              className="text-white font-bold leading-tight"
              style={{
                fontSize: `${size}px`,
                opacity,
              }}
            >
              {word}
            </span>
          );
        })}
      </div>

      <div className="fixed bottom-6 right-6 flex items-center gap-4">
        <a
          href="/impressum"
          className="text-neutral-700 hover:text-neutral-500 text-xs transition-colors"
        >
          Impressum
        </a>
        <a
          href="/datenschutz"
          className="text-neutral-700 hover:text-neutral-500 text-xs transition-colors"
        >
          Datenschutz
        </a>
        <a
          href="/login"
          className="text-neutral-700 hover:text-neutral-500 text-xs transition-colors"
        >
          Login
        </a>
      </div>
    </main>
  );
}
