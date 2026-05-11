/**
 * Stufen-Beschreibungen pro Kriterium, paraphrasiert nach den
 * Begutachtungs-Richtlinien (BRi) des GKV-Spitzenverbands gemäß § 17 SGB XI.
 *
 * Schlüssel ist die Kriterium-ID, Wert ist eine Map vom Stufen-Wert auf den
 * Beschreibungstext für genau diese Stufe.
 */
export const WERT_BESCHREIBUNGEN: Record<string, Record<number, string>> = {
  // ─── Modul 1 – Mobilität ──────────────────────────────────────────────────
  '1.1': {
    0: 'Kann sich im Bett selbstständig drehen und aufrichten — auch unter Nutzung von Hilfsmitteln wie Bettleiter oder Aufrichthilfe.',
    1: 'Bewegt sich überwiegend selbstständig im Bett, benötigt bei einzelnen Bewegungen (z. B. Aufrichten, größerer Lagewechsel) Unterstützung.',
    2: 'Kann nur Teile der Bewegung allein ausführen (z. B. Kopf drehen, Beine anziehen) — der größere Teil muss übernommen werden.',
    3: 'Positionswechsel im Bett müssen vollständig durch Pflegepersonen ausgeführt werden.',
  },
  '1.2': {
    0: 'Kann mehrere Minuten frei sitzen — auch auf einer Sitzfläche ohne Rückenlehne — ohne Hilfe.',
    1: 'Sitzt überwiegend stabil, braucht Unterstützung beim Aufrichten in den Sitz oder vereinzelt einen Halt.',
    2: 'Hält die Sitzposition nur kurz oder mit ständiger Begleitung; kippt oder rutscht ohne Hilfe.',
    3: 'Kann ohne fortlaufende Unterstützung gar nicht frei sitzen.',
  },
  '1.3': {
    0: 'Wechselt vom Bett in den Stuhl/Rollstuhl und umgekehrt allein — ggf. mit Hilfsmittel.',
    1: 'Wechsel gelingt überwiegend selbstständig, einzelne Schritte (z. B. Stand halten) brauchen Unterstützung.',
    2: 'Kann nur Teile übernehmen (z. B. Mitziehen am Galgen), der größere Anteil ist personelle Hilfe.',
    3: 'Umsetzen muss vollständig durch eine oder mehrere Personen erfolgen, ggf. mit Lifter.',
  },
  '1.4': {
    0: 'Geht selbstständig zwischen den genutzten Räumen — auch mit Rollator, Gehstock o. Ä.',
    1: 'Bewegt sich überwiegend selbstständig fort, braucht beim Anziehen der Hilfsmittel, beim Türöffnen oder bei Hindernissen Hilfe.',
    2: 'Bewegt sich nur unter ständiger Anleitung oder körperlicher Stützung fort.',
    3: 'Kann sich innerhalb der Wohnung nicht ohne aktive Hilfe fortbewegen oder ist immobil.',
  },
  '1.5': {
    0: 'Steigt eine Stockwerk-Treppe ohne Hilfe; Geländer darf genutzt werden.',
    1: 'Steigt überwiegend selbstständig; vereinzelte Unterstützung — z. B. beim Antritt oder am Treppenende.',
    2: 'Treppensteigen nur unter andauernder Hilfestellung möglich.',
    3: 'Kann eine Treppe nicht eigenständig nutzen.',
  },

  // ─── Modul 2 – Kognitive und kommunikative Fähigkeiten ───────────────────
  '2.1': {
    0: 'Erkennt vertraute Personen zuverlässig wieder.',
    1: 'Erkennt Bezugspersonen meist; gelegentlich kommt es zu kurzen Verwechslungen.',
    2: 'Erkennt Bezugspersonen nur eingeschränkt — häufig erst nach Erinnerungshilfen.',
    3: 'Erkennt selbst nahestehende Personen nicht (mehr).',
  },
  '2.2': {
    0: 'Findet sich in der Wohnung und vertrauten Umgebung uneingeschränkt zurecht.',
    1: 'Im eigenen Wohnbereich orientiert; in der weiteren Umgebung gelegentlich unsicher.',
    2: 'Selbst in der eigenen Wohnung teilweise desorientiert.',
    3: 'Ist auch in vertrauter Umgebung nicht orientiert.',
  },
  '2.3': {
    0: 'Tageszeit, Wochentag und Jahreszeit sind sicher abrufbar.',
    1: 'Tageszeitliche Orientierung gegeben; Wochentag oder Datum gelegentlich unsicher.',
    2: 'Orientierung nur zur Tageszeit zuverlässig, sonst stark eingeschränkt.',
    3: 'Keinerlei zeitliche Orientierung.',
  },
  '2.4': {
    0: 'Erinnert sich an wesentliche Vorkommnisse vom Tag und der letzten Tage.',
    1: 'Erinnert sich überwiegend, einzelne Details entfallen.',
    2: 'Erinnert sich nur bruchstückhaft an Ereignisse der letzten Tage.',
    3: 'Kann sich nicht an wesentliche Ereignisse erinnern.',
  },
  '2.5': {
    0: 'Plant und führt mehrschrittige Handlungen (z. B. Mahlzeit zubereiten) selbstständig in richtiger Reihenfolge aus.',
    1: 'Benötigt gelegentlich Erinnerungshilfen oder kleine Anleitungen.',
    2: 'Kann mehrschrittige Handlungen nur unter Anleitung zu Ende führen.',
    3: 'Steuerung mehrschrittiger Handlungen ist nicht möglich.',
  },
  '2.6': {
    0: 'Trifft Alltagsentscheidungen (Kleidung, Mahlzeit) eigenständig und nachvollziehbar.',
    1: 'Entscheidet überwiegend allein; braucht für ungewohnte Situationen Hilfe.',
    2: 'Trifft kaum noch sinnvolle Entscheidungen ohne Begleitung.',
    3: 'Kann keine Alltagsentscheidungen mehr eigenständig treffen.',
  },
  '2.7': {
    0: 'Erfasst Informationen aus Gesprächen, Nachrichten o. Ä. zuverlässig.',
    1: 'Versteht den Großteil; einzelne Inhalte müssen wiederholt werden.',
    2: 'Erfasst nur einfache Inhalte; komplexe Sachverhalte werden nicht verstanden.',
    3: 'Versteht selbst einfache Informationen nicht.',
  },
  '2.8': {
    0: 'Erkennt Alltagsgefahren (heißer Herd, Verkehr, fremde Personen) zuverlässig.',
    1: 'Erkennt die meisten Gefahren; bei ungewohnten Situationen unsicher.',
    2: 'Übersieht häufig Gefahren — auch bekannte.',
    3: 'Kann Risiken und Gefahren grundsätzlich nicht einschätzen.',
  },
  '2.9': {
    0: 'Teilt Bedürfnisse wie Hunger, Durst, Schmerzen oder Toilettengang klar mit.',
    1: 'Teilt Bedürfnisse größtenteils mit, einzelne nonverbal oder verzögert.',
    2: 'Bedürfnismitteilung gelingt nur unzuverlässig oder über andere Signale.',
    3: 'Bedürfnisse können nicht mehr aktiv mitgeteilt werden.',
  },
  '2.10': {
    0: 'Versteht und reagiert angemessen auf einfache Aufforderungen.',
    1: 'Versteht die meisten Aufforderungen; einzelne müssen wiederholt werden.',
    2: 'Nur einfachste Aufforderungen — oft erst nach mehrmaligem Ansprechen.',
    3: 'Reagiert nicht auf an sie gerichtete Aufforderungen.',
  },
  '2.11': {
    0: 'Folgt einem Gespräch und beteiligt sich aktiv und sinnvoll.',
    1: 'Folgt überwiegend; eigene Beiträge sind teils unzusammenhängend.',
    2: 'Beteiligt sich nur an kurzen, einfachen Gesprächen.',
    3: 'Kann sich an einem Gespräch nicht mehr beteiligen.',
  },

  // ─── Modul 4 – Selbstversorgung ──────────────────────────────────────────
  '4.1': {
    0: 'Wäscht Brust, Bauch, Arme und Achseln allein am Waschbecken.',
    1: 'Wäscht überwiegend allein; einzelne Schritte (Rücken, Auswringen) brauchen Hilfe.',
    2: 'Kann nur Teile selbst waschen; der größere Teil muss übernommen werden.',
    3: 'Waschen des vorderen Oberkörpers muss vollständig übernommen werden.',
  },
  '4.2': {
    0: 'Führt Kämmen, Zahnpflege, Prothesenreinigung und Rasur selbstständig durch.',
    1: 'Erledigt die meisten Tätigkeiten selbst; bei einzelnen ist Unterstützung nötig.',
    2: 'Kann nur kleinere Anteile (z. B. Kämmen mit angereichter Bürste) übernehmen.',
    3: 'Sämtliche Tätigkeiten der Kopfpflege müssen übernommen werden.',
  },
  '4.3': {
    0: 'Wäscht Genital- und Analbereich selbstständig.',
    1: 'Hilfe beim Vorbereiten oder Nachreinigen; Waschen selbst gelingt überwiegend allein.',
    2: 'Wäscht nur Teile des Intimbereichs allein; größere Hilfe nötig.',
    3: 'Intimwäsche muss vollständig durch Pflegepersonen erfolgen.',
  },
  '4.4': {
    0: 'Geht selbstständig duschen oder baden — einschließlich Haarewaschen.',
    1: 'Benötigt Unterstützung beim Ein- und Aussteigen oder beim Waschen schwer erreichbarer Bereiche.',
    2: 'Kann nur kleinere Teile selbst übernehmen; Pflege erfolgt überwiegend durch andere.',
    3: 'Duschen/Baden inkl. Haarewaschen muss vollständig übernommen werden.',
  },
  '4.5': {
    0: 'Kleidet sich am Oberkörper eigenständig an und aus.',
    1: 'Erledigt das meiste allein; bei einzelnen Kleidungsstücken (z. B. BH-Verschluss) Hilfe.',
    2: 'Kann nur kleinere Teile selbst anziehen; der größere Teil wird übernommen.',
    3: 'An- und Auskleiden des Oberkörpers wird vollständig übernommen.',
  },
  '4.6': {
    0: 'Kleidet sich am Unterkörper eigenständig an und aus, inkl. Strümpfen und Schuhen.',
    1: 'Erledigt das meiste allein; einzelne Schritte (Hose hochziehen, Schuhe binden) brauchen Hilfe.',
    2: 'Kann nur kleinere Teile selbst anziehen.',
    3: 'An- und Auskleiden des Unterkörpers wird vollständig übernommen.',
  },
  '4.7': {
    0: 'Schneidet Speisen, streicht Brot und gießt Getränke selbst ein.',
    1: 'Erledigt das Meiste; beim Öffnen von Verpackungen oder Schneiden braucht es Hilfe.',
    2: 'Kann nur kleinere Vorbereitungen übernehmen.',
    3: 'Mundgerechte Vorbereitung muss vollständig übernommen werden.',
  },
  '4.8': {
    0: 'Nimmt zubereitete Speisen selbstständig zu sich — auch ohne Anleitung.',
    1: 'Isst überwiegend allein; gelegentlich werden Speisen angereicht oder begleitet.',
    2: 'Hilfe bei jedem Bissen nötig; nur Teile gelingen allein.',
    3: 'Nahrungsaufnahme muss vollständig übernommen werden (Anreichen, Begleitung beim Schlucken).',
  },
  '4.9': {
    0: 'Trinkt selbstständig aus einem Glas oder einer Tasse.',
    1: 'Trinkt überwiegend allein; gelegentlich wird das Glas angereicht oder gehalten.',
    2: 'Trinken gelingt nur mit kontinuierlicher Begleitung.',
    3: 'Trinken muss vollständig übernommen werden.',
  },
  '4.10': {
    0: 'Geht selbstständig zur Toilette, kleidet sich aus/wieder an, reinigt sich nach dem Geschäft.',
    1: 'Erledigt das Meiste allein; einzelne Schritte (Hose öffnen, Reinigung) brauchen Hilfe.',
    2: 'Toilettengang nur unter andauernder Hilfestellung möglich.',
    3: 'Toilettengang muss vollständig übernommen werden.',
  },
  '4.11': {
    0: 'Wechselt Inkontinenzmaterial bzw. versorgt Katheter/Urostoma selbstständig.',
    1: 'Erledigt das Meiste allein; einzelne Schritte brauchen Hilfe.',
    2: 'Versorgung gelingt nur mit erheblicher Unterstützung.',
    3: 'Versorgung muss vollständig durch Pflegepersonen erfolgen.',
  },
  '4.12': {
    0: 'Wechselt Material bzw. versorgt das Stoma selbstständig.',
    1: 'Versorgung erfolgt überwiegend allein; einzelne Schritte sind unterstützt.',
    2: 'Erhebliche Unterstützung bei der Stomaversorgung erforderlich.',
    3: 'Versorgung muss vollständig übernommen werden.',
  },
  '4.13': {
    0: 'Entfällt — die Person ernährt sich auf normalem Weg.',
    3: 'Erhält täglich teilweise Sondenkost oder parenterale Ernährung zusätzlich zur oralen Aufnahme.',
    6: 'Wird täglich ausschließlich oder ganz überwiegend künstlich ernährt.',
  },

  // ─── Modul 6 – Gestaltung des Alltagslebens und sozialer Kontakte ────────
  '6.1': {
    0: 'Plant und strukturiert den Tag selbst; passt sich an Veränderungen sicher an.',
    1: 'Tagesablauf weitgehend selbst gestaltet; einzelne Anlässe brauchen Anregung.',
    2: 'Tagesablauf wird überwiegend von außen vorgegeben.',
    3: 'Kann den Tag nicht eigenständig gestalten oder Veränderungen erkennen.',
  },
  '6.2': {
    0: 'Regelt Schlafens- und Wachzeiten selbstständig und erholsam.',
    1: 'Schlaf-Wach-Rhythmus überwiegend stabil; einzelne Unterstützungen nötig.',
    2: 'Häufige Unterstützung bei Einschlafritualen oder Schlafphasen nötig.',
    3: 'Schlaf-Wach-Rhythmus muss vollständig durch andere strukturiert werden.',
  },
  '6.3': {
    0: 'Beschäftigt sich eigenständig mit sinnvollen Aktivitäten (Lesen, Hobby …).',
    1: 'Beschäftigt sich überwiegend allein; braucht gelegentlich Anregung.',
    2: 'Selbstständige Beschäftigung gelingt nur kurz oder nur mit Begleitung.',
    3: 'Eigene Beschäftigung findet ohne ständige Anregung nicht statt.',
  },
  '6.4': {
    0: 'Plant Termine und Aktivitäten für die nähere Zukunft selbst.',
    1: 'Plant überwiegend selbst; für komplexere Vorhaben Unterstützung.',
    2: 'Planung gelingt nur unter Anleitung.',
    3: 'Kann keine zukunftsgerichteten Planungen mehr vornehmen.',
  },
  '6.5': {
    0: 'Kommuniziert eigenständig mit Personen im direkten Umfeld.',
    1: 'Initiiert Kontakte überwiegend selbst; einzelne Situationen brauchen Anregung.',
    2: 'Interaktion nur auf Aufforderung und mit Anleitung.',
    3: 'Initiiert keine Interaktion mehr; reagiert kaum auf Kontaktversuche.',
  },
  '6.6': {
    0: 'Pflegt Kontakte zu Freund:innen und Verwandten eigenständig (Telefon, Brief, Besuch).',
    1: 'Pflegt Kontakte überwiegend selbst; Unterstützung beim Telefonieren oder Schreiben.',
    2: 'Kontaktpflege erfolgt nur unter Begleitung.',
    3: 'Kontaktpflege findet ohne fremde Initiative nicht mehr statt.',
  },
};

/**
 * Modul 3 (Verhaltensweisen und psychische Problemlagen) bewertet die
 * Häufigkeit eines Verhaltens — die Beschreibung der Häufigkeitsstufe ist
 * für alle 13 Kriterien gleich, nur das Verhalten variiert.
 */
export const MODUL_3_HAEUFIGKEIT_BESCHREIBUNG: Record<number, string> = {
  0: 'Das Verhalten tritt nicht oder höchstens einmal innerhalb von zwei Wochen auf. Ein regelmäßiges Eingreifen ist nicht nötig.',
  1: 'Das Verhalten tritt selten auf — ein- bis dreimal innerhalb von zwei Wochen. Pflegerisches Eingreifen wird vereinzelt nötig.',
  3: 'Das Verhalten tritt häufig auf — zwei- bis mehrmals wöchentlich, aber nicht täglich. Pflegerisches Eingreifen ist regelmäßig nötig.',
  5: 'Das Verhalten tritt täglich auf und erfordert tägliches Eingreifen.',
};
