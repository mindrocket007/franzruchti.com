type Supplement = {
  name: string;
  dose: string;
  why: string;
  swissSource: { vendor: string; product: string; price: string; url: string }[];
  note?: string;
};

type Tier = {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  items: Supplement[];
};

const tiers: Tier[] = [
  {
    id: "stufe-1",
    title: "Stufe 1 — Basis",
    subtitle: "Sehr gut belegt, klares Kosten-Nutzen-Verhältnis. Damit anfangen.",
    badge: "MUST-HAVE",
    badgeColor: "bg-green-600 text-white",
    items: [
      {
        name: "Kreatin-Monohydrat",
        dose: "3–5 g/Tag, durchgehend",
        why: "Best erforschtes Supplement überhaupt. Kraft, Muskelmasse, ab 50 zusätzlich kognitive Vorteile. Einnahmezeitpunkt egal.",
        swissSource: [
          { vendor: "Sponser (CH)", product: "Creatine Monohydrate 500 g (Creapure®)", price: "ca. CHF 39", url: "https://sponser.ch/collections/all-creatin" },
          { vendor: "Sunday Natural via Drogerie Süess", product: "Creatin Monohydrat Creapure® 500 g", price: "ca. CHF 35–45", url: "https://www.drogerie-sueess.ch/de/aktuell/sunday-natural/" },
        ],
      },
      {
        name: "Vitamin D3 + K2",
        dose: "3000–4000 IE D3 + 100–200 µg K2 (MK-7)/Tag",
        why: "In CH-Wintern fast jeder defizitär. Muskelfunktion, Knochen, Immunsystem, Testosteron-Cofaktor. K2 lenkt Calcium in den Knochen statt in die Arterien.",
        swissSource: [
          { vendor: "Burgerstein D3", product: "Vitamin D3 2000 I.E., 3×60 Kapseln", price: "CHF 43.70", url: "https://www.redcare-apotheke.ch/de/gesundheit/CH90012642/burgerstein-vitamin-d3-2000-i-e.htm" },
          { vendor: "Burgerstein K2", product: "Vitamine K2, 60 Kapseln", price: "ca. CHF 28–32", url: "https://www.redcare-apotheke.ch/de/gesundheit/CH07270317/burgerstein-vitamine-k2.htm" },
        ],
        note: "2× D3 (à 2000 IE) + 1× K2 täglich",
      },
      {
        name: "Omega-3 (EPA + DHA)",
        dose: "2–3 g EPA+DHA/Tag (nicht Fischöl-Gesamtmenge!)",
        why: "Senkt Entzündung, unterstützt Muskelproteinsynthese im Alter, Herz, Hirn, Triglyceride.",
        swissSource: [
          { vendor: "NORSAN Omega-3 Total", product: "Flüssig, 200 ml (Zitrone)", price: "ca. CHF 39", url: "https://norsan.ch/" },
          { vendor: "Burgerstein Omega-3 EPA", product: "100 Weichkapseln", price: "ca. CHF 50", url: "https://www.coopvitality.ch/de/p/burgerstein-omega-3-epa-weichkaps-ds-100-stk-4048966" },
        ],
        note: "NORSAN flüssig liefert ~2 g EPA+DHA pro Teelöffel — am günstigsten und am höchsten dosiert.",
      },
      {
        name: "Magnesium-Bisglycinat",
        dose: "300–400 mg/Tag, abends",
        why: "Schlaf, Muskelregeneration, Glukose-Stoffwechsel. Bisglycinat magenfreundlicher und besser bioverfügbar als Oxid.",
        swissSource: [
          { vendor: "Burgerstein MagnesiumVital", product: "Bisglycinat + Citrat, 120 Tabletten", price: "ca. CHF 38", url: "https://www.coopvitality.ch/de/p/burgerstein-magnesiumvital-tabl-ds-120-stk-5377991" },
          { vendor: "Sunday Natural via Drogerie Süess", product: "Magnesium Bisglycinat Pulver", price: "ca. CHF 35", url: "https://www.drogerie-sueess.ch/de/aktuell/sunday-natural/" },
        ],
      },
      {
        name: "Protein (Whey-Isolat)",
        dose: "1.8–2.2 g pro kg Körpergewicht/Tag",
        why: "Wichtigster Sarkopenie-Schutz. Mit 50 muss man höher dosieren als mit 30. Whey nur, wenn du es übers Essen nicht schaffst.",
        swissSource: [
          { vendor: "Sponser Whey Isolate 94", product: "850 g, Vanilla/Chocolate", price: "ab CHF 59", url: "https://sponser.ch/products/whey-isolate-94-vanille" },
          { vendor: "Coop", product: "Sponser Whey Isolate 94 Vanilla", price: "ca. CHF 59", url: "https://www.coop.ch/en/food/specific-diets/sports-nutrition-proteins/powder/sponser-vanilla-whey-isolate-94/p/6308435" },
        ],
        note: "Sponser ist Schweizer Hersteller (Aargau). Grass-fed Milch, Top-Qualität.",
      },
    ],
  },
  {
    id: "stufe-2",
    title: "Stufe 2 — Sinnvolle Ergänzungen",
    subtitle: "Gute Evidenz, situativ. Nicht zwingend, aber Mehrwert.",
    badge: "OPTIONAL",
    badgeColor: "bg-blue-600 text-white",
    items: [
      {
        name: "Kollagen-Hydrolysat + Vitamin C",
        dose: "10–15 g Kollagen + 50 mg Vit C, 30–60 Min. vor Training",
        why: "Mässige Evidenz für Sehnen-/Gelenkstärkung. Geringes Risiko, lohnt sich bei Belastung in 6er-Wiederholungsbereichen.",
        swissSource: [
          { vendor: "Sponser", product: "Collagen Peptides 300 g", price: "ca. CHF 35", url: "https://sponser.ch/" },
          { vendor: "Puravita", product: "Collagen Peptides diverse Marken", price: "CHF 30–60", url: "https://www.puravita.ch/" },
        ],
      },
      {
        name: "Ashwagandha (KSM-66)",
        dose: "600 mg/Tag, zyklisch (8 Wochen on / 4 off)",
        why: "Cortisol runter, moderater Testosteron-Effekt bei Männern unter Trainingsstress. Schlaf wird oft besser.",
        swissSource: [
          { vendor: "VELIFE Ashwagandha KSM-66", product: "120 Tabletten", price: "ca. CHF 45", url: "https://www.puravita.ch/de_ch/velife-ashwagandha-extrakt-ksm-66-tabletten-120-stueck" },
        ],
      },
      {
        name: "Glycin",
        dose: "3 g abends, in Wasser",
        why: "Schlafqualität (Kernkörpertemperatur runter), Bindegewebe, Cofaktor Kollagensynthese.",
        swissSource: [
          { vendor: "Sunday Natural via Drogerie Süess", product: "Glycin Pulver", price: "ca. CHF 25", url: "https://www.drogerie-sueess.ch/de/aktuell/sunday-natural/" },
        ],
      },
      {
        name: "Koffein (Trainingstage)",
        dose: "3–6 mg/kg, 30–45 Min. vor Krafttraining",
        why: "Stärkster legaler Performance-Booster. Nicht jeden Tag, sonst Toleranzaufbau.",
        swissSource: [
          { vendor: "Apotheke / Drogerie", product: "Koffein-Tabletten 200 mg (z.B. Coffea)", price: "ca. CHF 10–15", url: "https://www.coopvitality.ch/" },
        ],
      },
    ],
  },
  {
    id: "stufe-3",
    title: "Stufe 3 — Erst nach Bluttest",
    subtitle: "Nicht blind nehmen. Erst Werte messen, dann gezielt einsetzen.",
    badge: "ARZT NÖTIG",
    badgeColor: "bg-orange-600 text-white",
    items: [
      {
        name: "TRT (Testosteron-Ersatztherapie)",
        dose: "Nur bei klinischem Defizit + Symptomen",
        why: "Nur wenn Gesamttestosteron <12 nmol/l UND Symptome (Libido, Müdigkeit, Muskelabbau). Bei 6×/Woche Training oft gar nicht nötig. Supraphysiologische Dosen = Prostata-Risiko und lebenslange Abhängigkeit.",
        swissSource: [
          { vendor: "Hausarzt / Endokrinologe", product: "Verschreibungspflichtig", price: "Krankenkasse bei Indikation", url: "" },
        ],
      },
      {
        name: "NMN / NR (NAD+-Vorstufen)",
        dose: "300–500 mg NMN/Tag oder 300 mg NR",
        why: "Spannend, aber Humanevidenz noch dünn. Mit 50 würde ich noch warten oder maximal niedrig dosieren — bessere ROI mit Stufe 1.",
        swissSource: [
          { vendor: "Sunday Natural via Drogerie Süess", product: "NMN Kapseln", price: "ca. CHF 70–120/Monat", url: "https://www.drogerie-sueess.ch/de/aktuell/sunday-natural/" },
        ],
      },
      {
        name: "Berberin",
        dose: "500 mg, 2×/Tag zu kohlenhydratreichen Mahlzeiten",
        why: "Nur bei erhöhtem HbA1c, Nüchterninsulin oder Triglyceriden. Senkt Glukose ähnlich wie Metformin.",
        swissSource: [
          { vendor: "Sunday Natural via Drogerie Süess", product: "Berberin HCl 500 mg", price: "ca. CHF 40", url: "https://www.drogerie-sueess.ch/de/aktuell/sunday-natural/" },
        ],
      },
      {
        name: "Bempedoinsäure / Niacin",
        dose: "Nach ärztlicher Verordnung",
        why: "Bei erhöhtem ApoB oder Lp(a). Sache des Arztes — nicht selbst dosieren.",
        swissSource: [
          { vendor: "Kardiologe / Hausarzt", product: "Rezeptpflichtig", price: "Krankenkasse", url: "" },
        ],
      },
    ],
  },
];

const bloodwork = [
  "Gesamttestosteron + freies Testosteron + SHBG",
  "Vitamin D (25-OH)",
  "Ferritin, B12, Folsäure",
  "hsCRP, HbA1c, Nüchternglukose, Insulin (HOMA-IR)",
  "Lipidprofil inkl. ApoB und Lp(a) — klassisches LDL allein reicht nicht mehr",
  "Homocystein",
  "TSH (Schilddrüse)",
];

const foundation = [
  { title: "Schlaf 7.5–9 h", detail: "Grösster Hebel für Muskelaufbau UND Longevity. Garmin Sleep-Score >80 anstreben." },
  { title: "Progressive Overload", detail: "Gewicht muss über die Monate steigen. Sonst stagniert die Hypertrophie." },
  { title: "Zone-2-Cardio", detail: "Puls 60–70% HRmax statt 'irgendwas auf dem Hometrainer'. Mitochondriale Adaption." },
  { title: "VO2max-Intervalle", detail: "1×/Woche 4×4 Min bei 90% HRmax. Stärkster Einzel-Marker für Lebenserwartung." },
  { title: "Alkohol minimieren", detail: "Direkter Muskel-Killer, stört Testosteron und Schlaf." },
  { title: "Jährlicher Check", detail: "Blutbild + DEXA-Scan ab 50. Knochendichte und Körperfett objektiv tracken." },
];

const notRecommended = [
  { name: "GLP-1 (Semaglutid/Tirzepatid)", why: "Katabol — kostet dich die Muskelmasse, die du aufbaust. Für übergewichtige Sedentäre, nicht für dich." },
  { name: "Wachstumshormon-Spritzen", why: "Risiko/Nutzen extrem schlecht ohne medizinische Indikation. Insulinresistenz, Krebsrisiko." },
  { name: "Testosteron ohne Defizit", why: "Prostata-Risiko, Fruchtbarkeit weg, lebenslange Abhängigkeit. Enhanced-Games-Shop-Marketing." },
  { name: "Multivitamin-Megadosen", why: "Bei guter Ernährung unnötig. Hochdosis-Antioxidantien + Sport zeigen in Studien leicht erhöhte Sterblichkeit (Vitamin E)." },
];

export default function LongevityPage() {
  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Longevity & Supplements</h1>
        <p className="text-neutral-400 text-sm">
          Evidenzbasiertes Protokoll für 50-jährige Männer mit 3×/Woche Kraft + 3×/Woche Ausdauer.
          Ziel: Muskeln behalten und aufbauen, lange gesund bleiben. Schweizer Bezugsquellen.
        </p>
      </div>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-white mb-4">Fundament (10× wichtiger als Supplements)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {foundation.map((f) => (
            <div key={f.title} className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
              <p className="font-semibold text-sm text-white mb-1">{f.title}</p>
              <p className="text-neutral-400 text-xs">{f.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {tiers.map((tier) => (
        <section key={tier.id} className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-lg font-semibold text-white">{tier.title}</h2>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${tier.badgeColor}`}>
              {tier.badge}
            </span>
          </div>
          <p className="text-neutral-400 text-sm mb-4">{tier.subtitle}</p>

          <div className="space-y-3">
            {tier.items.map((item) => (
              <div key={item.name} className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
                <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-1 mb-2">
                  <h3 className="font-semibold text-white">{item.name}</h3>
                  <p className="text-xs text-neutral-400 font-mono">{item.dose}</p>
                </div>
                <p className="text-sm text-neutral-300 mb-3">{item.why}</p>
                {item.note && (
                  <p className="text-xs text-neutral-400 italic mb-3 border-l-2 border-blue-500/40 pl-3">
                    {item.note}
                  </p>
                )}
                <div className="border-t border-neutral-800 pt-3 space-y-1.5">
                  {item.swissSource.map((src, i) => (
                    <div key={i} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-xs">
                      <div>
                        <span className="font-medium text-neutral-200">{src.vendor}</span>
                        <span className="text-neutral-500"> — {src.product}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-neutral-300">{src.price}</span>
                        {src.url && (
                          <a
                            href={src.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 hover:underline"
                          >
                            → Shop
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-white mb-2">Blutbild vor Stufe 3</h2>
        <p className="text-neutral-400 text-sm mb-4">
          Beim Hausarzt anfordern. In CH meist Selbstzahler-Werte (~CHF 200–300 für das ganze Paket),
          aber objektive Grundlage für jede weitere Entscheidung.
        </p>
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
          <ul className="space-y-2">
            {bloodwork.map((b) => (
              <li key={b} className="text-sm text-neutral-300 flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-white mb-2">Was NICHT empfehlenswert ist</h2>
        <p className="text-neutral-400 text-sm mb-4">
          Marketing-Hype aus Telehealth-Shops (Enhanced, Hims & Co.). Klingt verlockend, ist aber für trainierte
          50-jährige mit normalen Werten kontraproduktiv.
        </p>
        <div className="space-y-2">
          {notRecommended.map((n) => (
            <div key={n.name} className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
              <p className="font-semibold text-sm text-orange-400 mb-1">{n.name}</p>
              <p className="text-neutral-300 text-xs">{n.why}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-white mb-4">Start-Stack (diese Woche)</h2>
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold text-white mb-2">Morgens</p>
              <ul className="space-y-1 text-neutral-300">
                <li>• 5 g Kreatin (in Kaffee/Wasser)</li>
                <li>• 4000 IE Vitamin D3 + 200 µg K2</li>
                <li>• 2 g EPA+DHA Omega-3 (NORSAN-Löffel)</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-white mb-2">Abends</p>
              <ul className="space-y-1 text-neutral-300">
                <li>• 400 mg Magnesium-Bisglycinat</li>
                <li>• 3 g Glycin (optional, Schlaf)</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-neutral-800 mt-4 pt-4 text-sm">
            <p className="font-semibold text-white mb-1">Den ganzen Tag</p>
            <p className="text-neutral-300">Protein: ~150 g/Tag (bei 80 kg). Wenn du das nicht übers Essen schaffst → 1× Whey-Shake (30 g).</p>
          </div>
          <div className="border-t border-neutral-800 mt-4 pt-4 text-sm">
            <p className="font-semibold text-white mb-1">Monatskosten Stufe 1</p>
            <p className="text-neutral-300 font-mono">ca. CHF 55–80 — das ist alles, was die meisten 50-jährigen Männer brauchen.</p>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-white mb-2">Personalisierte Kapseln (Schweiz & DACH)</h2>
        <p className="text-neutral-400 text-sm mb-4">
          Anbieter, die für dich individuell zusammenstellen — auf Basis Quiz oder Bluttest. Convenience-Plus,
          aber meist teurer als Stufe-1-Einzelkauf bei Sponser/Burgerstein. Sinnvoll als Mikronährstoff-Lückenfüller
          (B-Komplex, Zink, Selen, Jod) oder wenn du Wert auf alles-in-einer-Dose legst.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <a href="https://indyvit.com/" target="_blank" rel="noopener noreferrer" className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 hover:border-blue-500 transition-colors">
            <div className="flex items-center justify-between mb-1">
              <p className="font-semibold text-sm text-white">Indyvit</p>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-600 text-white font-bold">MADE IN CH</span>
            </div>
            <p className="text-xs text-neutral-400 mb-2">On-demand-Produktion im Schweizer Labor. 15-Fragen-Quiz oder Bluttest. Kapseln in Dose, Lieferung 2–3 Tage. Konfigurator erlaubt Anpassung.</p>
            <p className="text-xs font-mono text-neutral-300">ca. CHF 30–80/Monat</p>
          </a>

          <a href="https://www.bioniq.com/" target="_blank" rel="noopener noreferrer" className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 hover:border-blue-500 transition-colors">
            <div className="flex items-center justify-between mb-1">
              <p className="font-semibold text-sm text-white">Bioniq</p>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-600 text-white font-bold">PREMIUM</span>
            </div>
            <p className="text-xs text-neutral-400 mb-2">Bis zu 35 Wirkstoffe als Granulat (in Wasser auflösen). GO = Quiz, PRO = mit Bluttest. Global verfügbar, CH-Versand.</p>
            <p className="text-xs font-mono text-neutral-300">ca. CHF 100–200/Monat</p>
          </a>

          <a href="https://360football-supplements.ch/" target="_blank" rel="noopener noreferrer" className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 hover:border-blue-500 transition-colors">
            <div className="flex items-center justify-between mb-1">
              <p className="font-semibold text-sm text-white">360Football Supplements</p>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-600 text-white font-bold">SPORTLER</span>
            </div>
            <p className="text-xs text-neutral-400 mb-2">All-in-1-Bluttest (Heimprobe), Auswertung in CH-Labor, danach individuelle Supplement-Empfehlung. Athleten-Fokus.</p>
            <p className="text-xs font-mono text-neutral-300">Bluttest ca. CHF 200 + Supplements</p>
          </a>

          <a href="https://care.me/ch-de/tests/personalisierte-supplements/" target="_blank" rel="noopener noreferrer" className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 hover:border-blue-500 transition-colors">
            <div className="flex items-center justify-between mb-1">
              <p className="font-semibold text-sm text-white">care.me</p>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-700 text-white font-bold">CH-VERSAND</span>
            </div>
            <p className="text-xs text-neutral-400 mb-2">Bluttest + personalisierte Monatsbox. Lieferung in ca. 14 Tagen. Verschiedene Test-Pakete wählbar.</p>
            <p className="text-xs font-mono text-neutral-300">je nach Paket CHF 80–250/Monat</p>
          </a>

          <a href="https://wunschkapsel.de/" target="_blank" rel="noopener noreferrer" className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 hover:border-blue-500 transition-colors">
            <div className="flex items-center justify-between mb-1">
              <p className="font-semibold text-sm text-white">Wunschkapsel (DE)</p>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-600 text-white font-bold">DIY-REZEPTUR</span>
            </div>
            <p className="text-xs text-neutral-400 mb-2">Du gibst exakte Inhaltsstoffe + Dosen vor — Kapseln werden danach gefüllt. Kein Algorithmus, sondern echtes Custom-Compounding.</p>
            <p className="text-xs font-mono text-neutral-300">ab ca. EUR 25/Monat, abhängig vom Stack</p>
          </a>

          <a href="https://www.dunatura.com/" target="_blank" rel="noopener noreferrer" className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 hover:border-blue-500 transition-colors">
            <div className="flex items-center justify-between mb-1">
              <p className="font-semibold text-sm text-white">dunatura (DE)</p>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-700 text-white font-bold">QUIZ-BASIERT</span>
            </div>
            <p className="text-xs text-neutral-400 mb-2">Mikronährstoff-Mix nach Online-Fragebogen, Versand auch in CH. Ohne Bluttest, Algorithmus-basiert.</p>
            <p className="text-xs font-mono text-neutral-300">ca. EUR 40–80/Monat</p>
          </a>
        </div>

        <div className="bg-neutral-900 border border-blue-500/30 rounded-xl p-4 text-sm">
          <p className="font-semibold text-white mb-2">Empfehlung für deinen Fall</p>
          <ul className="space-y-1.5 text-neutral-300 text-xs">
            <li><span className="text-blue-400">•</span> Stufe 1 (Kreatin, Omega-3, Whey, Mg) <span className="text-neutral-500">selbst kaufen — Mengen zu gross für sinnvolle Kapseln, Personalisierung lohnt nicht</span></li>
            <li><span className="text-blue-400">•</span> Indyvit oder Wunschkapsel als <span className="text-white font-medium">Mikronährstoff-Kapsel</span> (B-Komplex, Zink, Selen, Jod, Borax) — was du sonst in 7 Einzelpackungen kaufen müsstest</li>
            <li><span className="text-blue-400">•</span> Bluttest <span className="text-white font-medium">unabhängig beim Hausarzt</span> machen — günstiger und ohne Verkäufer-Interesse</li>
          </ul>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-white mb-4">Schweizer Bezugsquellen (Sammlung)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <a href="https://sponser.ch/" target="_blank" rel="noopener noreferrer" className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 hover:border-blue-500 transition-colors">
            <p className="font-semibold text-sm text-white mb-1">Sponser Sport Food</p>
            <p className="text-xs text-neutral-400">Schweizer Hersteller (AG). Whey, Kreatin, Kollagen, Elektrolyte. Top-Qualität.</p>
          </a>
          <a href="https://www.burgerstein.ch/" target="_blank" rel="noopener noreferrer" className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 hover:border-blue-500 transition-colors">
            <p className="font-semibold text-sm text-white mb-1">Burgerstein</p>
            <p className="text-xs text-neutral-400">Schweizer Apotheken-Standard. Vitamine, Magnesium, Omega-3. In jeder Apotheke.</p>
          </a>
          <a href="https://norsan.ch/" target="_blank" rel="noopener noreferrer" className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 hover:border-blue-500 transition-colors">
            <p className="font-semibold text-sm text-white mb-1">NORSAN (Norwegen / CH-Shop)</p>
            <p className="text-xs text-neutral-400">Spezialist für hochdosiertes Omega-3. Flüssig am günstigsten pro Gramm EPA+DHA.</p>
          </a>
          <a href="https://www.drogerie-sueess.ch/de/aktuell/sunday-natural/" target="_blank" rel="noopener noreferrer" className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 hover:border-blue-500 transition-colors">
            <p className="font-semibold text-sm text-white mb-1">Sunday Natural via Drogerie Süess</p>
            <p className="text-xs text-neutral-400">DE-Marke, CH-Distributor. Reine Inhaltsstoffe, keine Füllstoffe. Kreatin, NMN, Berberin.</p>
          </a>
          <a href="https://www.redcare-apotheke.ch/" target="_blank" rel="noopener noreferrer" className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 hover:border-blue-500 transition-colors">
            <p className="font-semibold text-sm text-white mb-1">Redcare Apotheke</p>
            <p className="text-xs text-neutral-400">Online-Apotheke CH. Günstige Burgerstein-Preise, schnell geliefert.</p>
          </a>
          <a href="https://www.coopvitality.ch/" target="_blank" rel="noopener noreferrer" className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 hover:border-blue-500 transition-colors">
            <p className="font-semibold text-sm text-white mb-1">Coop Vitality</p>
            <p className="text-xs text-neutral-400">Apotheken in jeder grösseren Stadt. Burgerstein + diverse Standardmarken.</p>
          </a>
        </div>
      </section>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-xs text-neutral-500">
        Stand: Mai 2026. Preise indikativ, können je nach Anbieter variieren. Keine medizinische Beratung —
        bei Verschreibungspflicht und Stufe 3 immer Hausarzt einbeziehen.
      </div>
    </div>
  );
}
