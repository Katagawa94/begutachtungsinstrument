/**
 * Per-Kriterium Beschreibungen, paraphrasiert nach den
 * Begutachtungs-Richtlinien (BRi) des GKV-Spitzenverbands gemäß § 17 SGB XI
 * (rechtsverbindliche Anwendungs-Doku zu Anlage 1 SGB XI).
 *
 * Die Texte sind bewusst kurz gehalten und beschreiben das Thema des
 * Kriteriums – nicht die Bewertung selbst.
 */
export const KRITERIEN_BESCHREIBUNGEN: Record<string, string> = {
  // Modul 1 — Mobilität
  '1.1':
    'Eigenständiges Verändern der Liegeposition im Bett, z. B. Drehen von Rücken- in Seitenlage oder Aufrichten zum Sitzen am Bettrand. Wichtig zur Druckentlastung und Vorbereitung auf das Aufstehen.',
  '1.2':
    'Freies Sitzen über mehrere Minuten ohne Hilfe – z. B. auf einem Stuhl ohne Lehne oder am Bettrand – ohne nach vorn, hinten oder zur Seite zu kippen. Hilfsmittel wie Kissen oder Sitzschalen werden mit einbezogen.',
  '1.3':
    'Wechsel zwischen Sitzflächen: Bett ↔ Stuhl/Rollstuhl, Stuhl/Rollstuhl ↔ Toilette. Beinhaltet Aufstehen, Drehung im Stand und Hinsetzen.',
  '1.4':
    'Gehen innerhalb der Wohnung zwischen den genutzten Räumen (z. B. Schlafzimmer – Küche – Bad). Hilfsmittel wie Rollator oder Gehstock dürfen verwendet werden.',
  '1.5':
    'Auf- und Absteigen einer Treppe zwischen zwei Wohnetagen, ggf. unter Nutzung des Handlaufs. Liegt keine Treppe vor, wird hypothetisch eingeschätzt.',

  // Modul 2 — Kognitive und kommunikative Fähigkeiten
  '2.1':
    'Wiedererkennen nahestehender Personen aus dem persönlichen Umfeld (Angehörige, regelmäßige Pflegekräfte). Es geht um das Wiedererkennen, nicht um das Erinnern von Namen.',
  '2.2':
    'Sich in der vertrauten Umgebung – insbesondere innerhalb der Wohnung – zurechtfinden und wissen, wo man sich befindet.',
  '2.3':
    'Wissen um Tageszeit, Wochentag und Jahreszeit; Ereignisse zeitlich einordnen können.',
  '2.4':
    'Kurz- und Mittelzeitgedächtnis: Erinnern an wesentliche Ereignisse oder Beobachtungen vom Tag bzw. der letzten Tage (z. B. Mahlzeiten, Besuch, Arzttermine).',
  '2.5':
    'Mehrschrittige Alltagshandlungen in der richtigen Reihenfolge selbstständig planen und ausführen, z. B. eine Mahlzeit zubereiten oder sich vollständig anziehen.',
  '2.6':
    'Einfache Alltagsentscheidungen treffen: Kleidung wählen, Essen auswählen, Tagesablauf gestalten.',
  '2.7':
    'Inhalte aus Gesprächen, Nachrichten oder Texten sinngemäß erfassen und einordnen.',
  '2.8':
    'Alltägliche Gefahrenquellen erkennen (heißer Herd, Verkehr, fremde Personen an der Tür) und ein angemessenes Vorsichtsverhalten zeigen.',
  '2.9':
    'Grundbedürfnisse wie Hunger, Durst, Schmerzen oder einen Toilettengang verständlich – verbal oder nonverbal – mitteilen.',
  '2.10':
    'Einfache an die Person gerichtete Aufforderungen erfassen und umsetzen, z. B. „Heben Sie bitte den Arm".',
  '2.11':
    'Einem Gespräch folgen, eigene Beiträge sinnvoll einbringen und auf das Gegenüber eingehen.',

  // Modul 3 — Verhaltensweisen und psychische Problemlagen
  '3.1':
    'Motorische Auffälligkeiten wie zielloses Umherwandern, ständiges Hin- und Hergehen oder Hantieren mit Gegenständen, das den Alltag beeinträchtigt.',
  '3.2':
    'Aufstehen, Umhergehen oder andere Aktivitäten in der Nacht, die den Schlaf beeinträchtigen und ein Eingreifen der Pflegenden erfordern.',
  '3.3':
    'Sich selbst Schaden zufügen – etwa Schlagen, Beißen, Kratzen, Manipulationen an Wunden oder Einnehmen ungeeigneter Substanzen.',
  '3.4':
    'Werfen, Zerschlagen oder Zerstören von Gegenständen in der Umgebung.',
  '3.5':
    'Körperliche Aggressionen gegen andere Personen wie Schlagen, Treten, Stoßen, Beißen oder Festhalten – auch im Rahmen pflegerischer Handlungen.',
  '3.6':
    'Verbale Übergriffe: Beschimpfen, Beleidigen, Bedrohen, anhaltendes Anschreien.',
  '3.7':
    'Lautes Rufen, Schreien, Stöhnen oder Murmeln über längere Zeit, das ein Eingreifen der Pflegenden erfordert.',
  '3.8':
    'Ablehnen, Wegstoßen oder körperliches Abwehren bei Körperpflege, Ernährung, Medikamentengabe oder anderen unterstützenden Maßnahmen.',
  '3.9':
    'Erleben einer realitätsfernen Wirklichkeit (z. B. Verfolgungsideen), das ein Eingreifen erforderlich macht.',
  '3.10':
    'Anhaltende oder situativ auftretende Angstzustände, die ein beruhigendes oder ablenkendes Eingreifen erfordern.',
  '3.11':
    'Anhaltende Niedergeschlagenheit verbunden mit fehlendem Antrieb zu Alltagsaktivitäten, sodass Pflegende zur Aktivierung eingreifen müssen.',
  '3.12':
    'Sozial unangemessenes Verhalten: Distanzlosigkeit, sexuell enthemmtes oder ungehemmtes Verhalten in der Öffentlichkeit.',
  '3.13':
    'Andere wiederkehrende, pflegerelevante Verhaltensweisen, die nicht in 3.1–3.12 abgebildet sind, etwa Verstecken, Sammeln oder Horten von Gegenständen.',

  // Modul 4 — Selbstversorgung
  '4.1':
    'Selbstständiges Waschen von Brust, Bauch, Armen und Achseln am Waschbecken.',
  '4.2':
    'Pflegende Handlungen rund um den Kopf außer Haarewaschen: Kämmen, Zahnpflege, Reinigung von Zahnersatz, Rasieren.',
  '4.3': 'Waschen des Genital- und Analbereichs am Waschbecken oder Bidet.',
  '4.4':
    'Ganzkörperwäsche unter der Dusche oder in der Badewanne einschließlich Haarewaschen.',
  '4.5':
    'An- und Ausziehen von Kleidungsstücken für den Oberkörper – Hemd, Pullover, BH usw.',
  '4.6':
    'An- und Ausziehen von Kleidungsstücken für den Unterkörper – Hose, Rock, Strümpfe, Schuhe, Unterwäsche.',
  '4.7':
    'Tätigkeiten unmittelbar vor dem Essen: Speisen kleinschneiden, Brot streichen, Getränke eingießen, Flaschen oder Verpackungen öffnen.',
  '4.8':
    'Aufnehmen von zubereiteter Nahrung: zum Mund führen, kauen, schlucken. Faktor ×3.',
  '4.9':
    'Aufnehmen von Flüssigkeit aus einem Trinkgefäß. Faktor ×2.',
  '4.10':
    'Vollständiger Toilettengang: Aufsuchen, Hose öffnen, Hinsetzen, Reinigung nach der Ausscheidung, Wiederankleiden. Faktor ×2.',
  '4.11':
    'Selbstständiger Umgang mit Harninkontinenz oder einem Dauerkatheter / Urostoma: Wechsel von Inkontinenzmaterial, Versorgung des Katheters bzw. Stomas. Nur relevant bei entsprechender Versorgung.',
  '4.12':
    'Selbstständiger Umgang mit Stuhlinkontinenz oder einem Stoma (Kolostoma, Ileostoma): Materialwechsel, Stomaversorgung. Nur relevant bei entsprechender Versorgung.',
  '4.13':
    'Künstliche Ernährung – parenteral oder über eine Sonde (z. B. PEG/PEJ). Werte: 0 = entfällt; 3 = täglich teilweise zusätzlich zu oraler Nahrung; 6 = ausschließlich künstliche Ernährung.',

  // Modul 5 — Krankheits-/therapiebedingte Anforderungen
  '5.1':
    'Häufigkeit notwendiger Hilfen bei der Einnahme oraler Medikamente – Bereitstellen, Anreichen, Kontrolle der Einnahme.',
  '5.2':
    'Häufigkeit subkutaner oder intramuskulärer Injektionen sowie subkutaner Infusionen mit Unterstützungsbedarf.',
  '5.3':
    'Versorgung intravenöser Zugänge wie Port-Systeme oder zentrale Venenkatheter.',
  '5.4':
    'Maßnahmen der Atemunterstützung: Absaugen von Sekret, Sauerstoffgabe über Nasenbrille oder Maske.',
  '5.5':
    'Therapeutische Einreibungen mit Salben oder Lösungen sowie regelmäßige Kälte- oder Wärmeanwendungen.',
  '5.6':
    'Regelmäßige Messung und Interpretation von Werten wie Blutdruck, Puls, Blutzucker oder Körpergewicht.',
  '5.7':
    'Versorgung mit körpernahen Hilfsmitteln: An- und Ablegen von Bandagen, Kompressionsstrümpfen, Orthesen oder Prothesen.',
  '5.8':
    'Verbandwechsel und Wundversorgung – Reinigung der Wunde, Auftragen von Salben oder Verbandstoffen.',
  '5.9':
    'Versorgung künstlicher Körperöffnungen, soweit nicht durch Modul 4 abgedeckt – z. B. Tracheostoma.',
  '5.10':
    'Einmalkatheterisierung der Blase oder regelmäßige Maßnahmen zur Stuhlentleerung (z. B. Klistier, manuelle Ausräumung).',
  '5.11':
    'Verordnete Therapien, die in häuslicher Umgebung durchgeführt werden – Physio-, Ergo- oder Logopädie-Übungen unter Anleitung.',
  '5.12':
    'Aufwendige medizinische Maßnahmen wie invasive Beatmung, kontinuierliche Sauerstoffgabe oder vergleichbar zeit- und technikintensive Therapien.',
  '5.13':
    'Häufigkeit von Arztbesuchen, bei denen die begutachtete Person begleitet werden muss.',
  '5.14':
    'Besuche bei Therapeut:innen, Ambulanzen o. Ä. mit Begleitbedarf, die kürzer als 3 Stunden dauern.',
  '5.15':
    'Längere Besuche medizinischer oder therapeutischer Einrichtungen (über 3 Stunden), z. B. Tagesklinik, Dialyse, Bestrahlung.',
  '5.16':
    'Notwendigkeit und Hilfebedarf bei der Einhaltung einer ärztlich verordneten Diät oder anderer krankheits-/therapiebedingter Verhaltensvorschriften.',

  // Modul 6 — Gestaltung des Alltagslebens und sozialer Kontakte
  '6.1':
    'Eigenständiges Strukturieren und Gestalten des Tagesablaufs sowie das Anpassen an unerwartete Veränderungen.',
  '6.2':
    'Selbstständiges Regulieren des Schlaf-Wach-Rhythmus: regelmäßige Schlafenszeiten, ausreichende Erholungsphasen.',
  '6.3':
    'Eigenständiges Beschäftigen mit für die Person sinnvollen Aktivitäten – Lesen, Hobbys, Spiele, Fernsehen u. Ä.',
  '6.4':
    'In die Zukunft gerichtete Planung: Aktivitäten oder Termine für den nächsten Tag, die nächste Woche oder darüber hinaus vornehmen.',
  '6.5':
    'Kontaktaufnahme und Kommunikation mit Personen im direkten Umfeld – Angehörige, Pflegekräfte, Besuch.',
  '6.6':
    'Aufrechterhalten und Pflegen von Kontakten zu Personen außerhalb des direkten Umfelds – Freund:innen, weiter entfernten Verwandten oder Bekannten (Telefon, Brief, Besuch).',
};

export function beschreibungFuer(kriteriumId: string): string | undefined {
  return KRITERIEN_BESCHREIBUNGEN[kriteriumId];
}
