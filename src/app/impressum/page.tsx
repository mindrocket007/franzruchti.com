import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Impressum – Franz Ruchti',
}

export default function ImpressumPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-16 md:px-16 lg:px-24">
      <div className="max-w-2xl">
        <Link href="/" className="text-neutral-600 hover:text-neutral-400 text-sm transition-colors">
          &larr; Zurück
        </Link>

        <h1 className="text-3xl font-bold text-white mt-8 mb-2">Impressum</h1>
        <p className="text-sm text-neutral-500 mb-10">
          Angaben gemäss Art. 13 OR (CH) · § 5 DDG (DE) · § 5 ECG (AT)
        </p>

        <div className="space-y-10 text-neutral-400 text-sm leading-relaxed">

          {/* Anbieter */}
          <div>
            <h2 className="font-bold text-white text-base mb-3">Anbieter</h2>
            <p className="font-semibold text-neutral-300">Mind Rocket GmbH</p>
            <p>Gresigengasse 3</p>
            <p>6055 Alpnach Dorf</p>
            <p>Schweiz</p>
            <p className="mt-3">
              Vertreten durch den Geschäftsführer: <span className="font-medium text-neutral-300">Franz Ruchti</span>
            </p>
            <p className="mt-3">
              Telefon:{' '}
              <a href="tel:+41788815379" className="text-neutral-300 hover:text-white transition-colors">
                +41 78 881 53 79
              </a>
            </p>
            <p>
              E-Mail:{' '}
              <a href="mailto:info@mindrocket.ch" className="text-neutral-300 hover:text-white transition-colors">
                info@mindrocket.ch
              </a>
            </p>
            <p>
              Website:{' '}
              <a href="https://franzruchti.com" className="text-neutral-300 hover:text-white transition-colors">
                https://franzruchti.com
              </a>
            </p>
          </div>

          <hr className="border-neutral-800" />

          {/* Handelsregister */}
          <div>
            <h2 className="font-bold text-white text-base mb-3">Handelsregister</h2>
            <p>
              Eingetragen im Handelsregister des Kantons Obwalden, Schweiz
            </p>
            <p className="mt-2">
              Handelsregister-Nr.: <span className="font-medium text-neutral-300">CH-140-4004121-4</span>
            </p>
            <p>
              UID (Unternehmens-Identifikation):{' '}
              <span className="font-medium text-neutral-300">CHE-491.002.733</span>
            </p>
          </div>

          <hr className="border-neutral-800" />

          {/* Verantwortlich für den Inhalt */}
          <div>
            <h2 className="font-bold text-white text-base mb-3">
              Verantwortlich für den Inhalt
            </h2>
            <p>
              Franz Ruchti<br />
              Gresigengasse 3<br />
              6055 Alpnach Dorf<br />
              Schweiz
            </p>
            <p className="mt-2 text-xs text-neutral-600">
              (gemäss § 18 Abs. 2 MStV für Nutzer aus Deutschland)
            </p>
          </div>

          <hr className="border-neutral-800" />

          {/* Urheberrecht */}
          <div>
            <h2 className="font-bold text-white text-base mb-3">Urheberrecht</h2>
            <p>
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf dieser Website
              unterliegen dem Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und
              jede Art der Verwertung ausserhalb der Grenzen des Urheberrechts bedürfen der
              schriftlichen Zustimmung der Mind Rocket GmbH. Downloads und Kopien dieser Website
              sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.
            </p>
            <p className="mt-2">
              Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden
              die Urheberrechte Dritter beachtet. Solltest du trotzdem auf eine
              Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden
              Hinweis an{' '}
              <a href="mailto:info@mindrocket.ch" className="text-neutral-300 hover:text-white transition-colors">
                info@mindrocket.ch
              </a>
              . Bei Bekanntwerden von Rechtsverletzungen werden wir den entsprechenden Inhalt
              umgehend entfernen.
            </p>
          </div>

          <hr className="border-neutral-800" />

          {/* Haftungsausschluss */}
          <div>
            <h2 className="font-bold text-white text-base mb-3">Haftungsausschluss</h2>

            <h3 className="font-semibold text-neutral-300 mb-1">Haftung für Inhalte</h3>
            <p>
              Die Inhalte unserer Website wurden mit grösster Sorgfalt erstellt. Für die
              Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine
              Gewähr übernehmen. Als Diensteanbieter sind wir gemäss § 7 Abs. 1 DDG (DE) für
              eigene Inhalte nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10
              DDG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder
              gespeicherte fremde Informationen zu überwachen.
            </p>

            <h3 className="font-semibold text-neutral-300 mt-4 mb-1">Haftung für Links</h3>
            <p>
              Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir
              keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine
              Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige
              Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden
              zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstösse überprüft. Rechtswidrige
              Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.
            </p>
          </div>

          <hr className="border-neutral-800" />

          {/* Online-Streitbeilegung */}
          <div>
            <h2 className="font-bold text-white text-base mb-3">
              Online-Streitbeilegung (EU/EWR)
            </h2>
            <p>
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS)
              bereit:{' '}
              <a
                href="https://ec.europa.eu/consumers/odr/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-300 hover:text-white transition-colors underline underline-offset-2"
              >
                https://ec.europa.eu/consumers/odr/
              </a>
            </p>
            <p className="mt-2">
              Unsere E-Mail-Adresse für etwaige Beschwerden:{' '}
              <a href="mailto:info@mindrocket.ch" className="text-neutral-300 hover:text-white transition-colors">
                info@mindrocket.ch
              </a>
            </p>
            <p className="mt-2">
              Wir sind nicht verpflichtet und grundsätzlich nicht bereit, an
              Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </div>

        </div>
      </div>
    </main>
  )
}
