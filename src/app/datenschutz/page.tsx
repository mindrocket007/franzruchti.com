import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Datenschutz – Franz Ruchti',
}

export default function DatenschutzPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-16 md:px-16 lg:px-24">
      <div className="max-w-2xl">
        <Link href="/" className="text-neutral-600 hover:text-neutral-400 text-sm transition-colors">
          &larr; Zurück
        </Link>

        <h1 className="text-3xl font-bold text-white mt-8 mb-2">Datenschutzerklärung</h1>
        <p className="text-sm text-neutral-500 mb-10">Stand: April 2026</p>

        <div className="space-y-8 text-neutral-400 text-sm leading-relaxed">

          {/* 1. Verantwortliche Stelle */}
          <div>
            <h2 className="font-bold text-white text-base mb-3">1. Verantwortliche Stelle</h2>
            <p>
              Mind Rocket GmbH<br />
              Gresigengasse 3<br />
              6055 Alpnach Dorf, Schweiz<br />
              Vertreten durch: Franz Ruchti<br />
              E-Mail: <a href="mailto:info@mindrocket.ch" className="text-neutral-300 hover:text-white transition-colors">info@mindrocket.ch</a><br />
              Telefon: +41 78 881 53 79
            </p>
            <p className="mt-3">
              Diese Datenschutzerklärung gilt für die Website <strong className="text-neutral-300">franzruchti.com</strong> und alle damit
              verbundenen Dienstleistungen. Da wir in der Schweiz, in Deutschland und in Österreich tätig sind,
              gilt sowohl das schweizerische Datenschutzgesetz (DSG) als auch – für Nutzerinnen und Nutzer mit
              Wohnsitz in der EU – die Datenschutz-Grundverordnung (DSGVO).
            </p>
          </div>

          {/* 2. Welche Daten wir erheben */}
          <div>
            <h2 className="font-bold text-white text-base mb-3">2. Welche Daten wir erheben und wozu</h2>

            <div className="space-y-5">

              <div className="bg-neutral-900 rounded-xl p-4">
                <h3 className="font-semibold text-neutral-200 mb-2">a) Kontaktaufnahme</h3>
                <p>
                  Wenn du uns per E-Mail kontaktierst, erheben wir: Name, E-Mail-Adresse und deine Nachricht.
                  Diese Daten werden ausschliesslich zur Beantwortung deiner Anfrage verwendet und danach nicht weiterverarbeitet.
                </p>
                <p className="mt-2 text-xs text-neutral-600">Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche Massnahmen) bzw. lit. f DSGVO (berechtigtes Interesse an der Beantwortung von Anfragen)</p>
              </div>

              <div className="bg-neutral-900 rounded-xl p-4">
                <h3 className="font-semibold text-neutral-200 mb-2">b) Login-Bereich</h3>
                <p>
                  Diese Website verfügt über einen passwortgeschützten Bereich. Beim Login wird ein
                  Session-Cookie gesetzt, das für die Authentifizierung notwendig ist. Es werden
                  keine personenbezogenen Daten gespeichert – die Authentifizierung erfolgt
                  ausschliesslich über ein gemeinsames Passwort ohne Benutzerkonten.
                </p>
                <p className="mt-2 text-xs text-neutral-600">Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse am Schutz interner Inhalte)</p>
              </div>

            </div>
          </div>

          {/* 3. Auftragsverarbeiter */}
          <div>
            <h2 className="font-bold text-white text-base mb-3">3. Auftragsverarbeiter & Drittanbieter</h2>
            <p className="mb-3">
              Für den Betrieb dieser Website setzen wir folgende Dienstleister ein:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-neutral-900">
                    <th className="text-left px-3 py-2 font-semibold text-neutral-300 rounded-tl-lg">Anbieter</th>
                    <th className="text-left px-3 py-2 font-semibold text-neutral-300">Zweck</th>
                    <th className="text-left px-3 py-2 font-semibold text-neutral-300 rounded-tr-lg">Sitz / Datenschutz</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  <tr>
                    <td className="px-3 py-2 font-medium text-neutral-200">Vercel Inc.</td>
                    <td className="px-3 py-2 text-neutral-400">Website-Hosting & Infrastruktur</td>
                    <td className="px-3 py-2 text-neutral-400">USA – vercel.com/legal/privacy-policy</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3">
              Alle genannten US-Anbieter sind nach dem EU-US Data Privacy Framework zertifiziert bzw. haben
              Standardvertragsklauseln (SCCs) der EU-Kommission abgeschlossen, die einen angemessenen Datenschutz
              bei der Übertragung in Drittländer gewährleisten.
            </p>
          </div>

          {/* 4. Hosting */}
          <div>
            <h2 className="font-bold text-white text-base mb-3">4. Hosting & Server-Logs</h2>
            <p>
              Diese Website wird bei <strong className="text-neutral-300">Vercel Inc.</strong> (San Francisco, USA) gehostet. Bei jedem Aufruf
              unserer Website werden automatisch technische Informationen übermittelt (IP-Adresse, Browser, Betriebssystem,
              aufgerufene Seite, Datum/Uhrzeit). Diese Daten werden von Vercel in Server-Logs gespeichert und dienen
              ausschliesslich der Sicherheit und Stabilität des Betriebs. Wir haben keinen direkten Zugriff auf
              diese Logs und werten sie nicht aus.
            </p>
            <p className="mt-2 text-xs text-neutral-600">Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse am sicheren Betrieb der Website)</p>
          </div>

          {/* 5. Cookies */}
          <div>
            <h2 className="font-bold text-white text-base mb-3">5. Cookies</h2>
            <p>
              Diese Website verwendet ausschliesslich technisch notwendige Cookies (Session-Cookie für den
              Login-Bereich). Es werden <strong className="text-neutral-300">keine Tracking-Cookies, Werbe-Cookies oder Analyse-Tools</strong> (wie
              Google Analytics) eingesetzt. Eine gesonderte Cookie-Einwilligung ist daher nicht erforderlich.
            </p>
          </div>

          {/* 6. Speicherdauer */}
          <div>
            <h2 className="font-bold text-white text-base mb-3">6. Speicherdauer</h2>
            <p>
              Wir speichern personenbezogene Daten nur so lange, wie es für den jeweiligen Zweck erforderlich ist:
            </p>
            <ul className="mt-2 space-y-1 list-disc list-inside text-neutral-400">
              <li>Kontaktanfragen: bis zur abschliessenden Bearbeitung, danach Löschung innerhalb von 6 Monaten</li>
              <li>E-Mail-Kommunikation: 3 Jahre ab letztem Kontakt</li>
            </ul>
          </div>

          {/* 7. Deine Rechte */}
          <div>
            <h2 className="font-bold text-white text-base mb-3">7. Deine Rechte</h2>
            <p className="mb-3">
              Du hast gegenüber uns jederzeit folgende Rechte bezüglich deiner personenbezogenen Daten:
            </p>
            <ul className="space-y-1 list-disc list-inside text-neutral-400">
              <li><strong className="text-neutral-300">Auskunft</strong> – du kannst erfahren, welche Daten wir über dich gespeichert haben</li>
              <li><strong className="text-neutral-300">Berichtigung</strong> – unrichtige Daten können korrigiert werden</li>
              <li><strong className="text-neutral-300">Löschung</strong> – du kannst die Löschung deiner Daten verlangen (soweit keine gesetzliche Aufbewahrungspflicht besteht)</li>
              <li><strong className="text-neutral-300">Einschränkung der Verarbeitung</strong> – du kannst die Verarbeitung einschränken lassen</li>
              <li><strong className="text-neutral-300">Datenübertragbarkeit</strong> – du kannst deine Daten in einem maschinenlesbaren Format erhalten</li>
              <li><strong className="text-neutral-300">Widerspruch</strong> – du kannst der Verarbeitung auf Basis unserer berechtigten Interessen widersprechen</li>
            </ul>
            <p className="mt-3">
              Zur Ausübung deiner Rechte wende dich an:{' '}
              <a href="mailto:info@mindrocket.ch" className="text-neutral-300 hover:text-white transition-colors">
                info@mindrocket.ch
              </a>
            </p>
          </div>

          {/* 8. Beschwerderecht */}
          <div>
            <h2 className="font-bold text-white text-base mb-3">8. Beschwerderecht bei einer Aufsichtsbehörde</h2>
            <p>
              Du hast das Recht, dich bei einer Datenschutzaufsichtsbehörde zu beschweren. Zuständig sind je nach
              Wohnsitz:
            </p>
            <ul className="mt-2 space-y-1 list-disc list-inside text-neutral-400">
              <li><strong className="text-neutral-300">Schweiz:</strong> Eidgenössischer Datenschutz- und Öffentlichkeitsbeauftragter (EDÖB) – edoeb.admin.ch</li>
              <li><strong className="text-neutral-300">Deutschland:</strong> Die/der Bundesbeauftragte für den Datenschutz und die Informationsfreiheit (BfDI) oder die jeweils zuständige Landesbehörde</li>
              <li><strong className="text-neutral-300">Österreich:</strong> Österreichische Datenschutzbehörde (DSB) – dsb.gv.at</li>
            </ul>
          </div>

          {/* 9. Änderungen */}
          <div>
            <h2 className="font-bold text-white text-base mb-3">9. Änderungen dieser Erklärung</h2>
            <p>
              Wir behalten uns vor, diese Datenschutzerklärung bei Bedarf anzupassen, etwa bei Änderungen unserer
              Dienstleistungen oder der Rechtslage. Die jeweils aktuelle Version ist unter franzruchti.com/datenschutz
              abrufbar. Das Datum der letzten Aktualisierung ist oben angegeben.
            </p>
          </div>

        </div>
      </div>
    </main>
  )
}
