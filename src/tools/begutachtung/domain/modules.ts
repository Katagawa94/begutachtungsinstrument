import type { Kriterium, Modul, SkalenStufe } from './types';

const STUFEN_SELBSTSTAENDIGKEIT: SkalenStufe[] = [
  { wert: 0, label: 'selbstständig' },
  { wert: 1, label: 'überwiegend selbstständig' },
  { wert: 2, label: 'überwiegend unselbstständig' },
  { wert: 3, label: 'unselbstständig' },
];

const STUFEN_FAEHIGKEIT: SkalenStufe[] = [
  { wert: 0, label: 'Fähigkeit vorhanden / unbeeinträchtigt' },
  { wert: 1, label: 'Fähigkeit größtenteils vorhanden' },
  { wert: 2, label: 'Fähigkeit in geringem Maße vorhanden' },
  { wert: 3, label: 'Fähigkeit nicht vorhanden' },
];

const STUFEN_HAEUFIGKEIT_M3: SkalenStufe[] = [
  { wert: 0, label: 'nie oder sehr selten' },
  { wert: 1, label: 'selten', hinweis: 'ein- bis dreimal innerhalb von zwei Wochen' },
  {
    wert: 3,
    label: 'häufig',
    hinweis: 'zweimal bis mehrmals wöchentlich, aber nicht täglich',
  },
  { wert: 5, label: 'täglich' },
];

const STUFEN_M4_13: SkalenStufe[] = [
  { wert: 0, label: 'entfällt / selbstständig' },
  { wert: 3, label: 'täglich, zusätzliche orale Ernährung' },
  { wert: 6, label: 'täglich, ausschließlich Sondenernährung / parenteral' },
];

function ordinal(stufen: SkalenStufe[]): Kriterium['skala'] {
  return { art: 'ordinal', stufen };
}

const MODUL_1: Modul = {
  id: 1,
  name: 'Mobilität',
  gewichtungProzent: 10,
  einleitung:
    'Wie selbstständig kann sich die begutachtete Person fortbewegen und ihre Position verändern?',
  maxEinzelpunkte: 15,
  kriterien: [
    { id: '1.1', modulId: 1, bezeichnung: 'Positionswechsel im Bett', skala: ordinal(STUFEN_SELBSTSTAENDIGKEIT) },
    { id: '1.2', modulId: 1, bezeichnung: 'Halten einer stabilen Sitzposition', skala: ordinal(STUFEN_SELBSTSTAENDIGKEIT) },
    { id: '1.3', modulId: 1, bezeichnung: 'Umsetzen', skala: ordinal(STUFEN_SELBSTSTAENDIGKEIT) },
    { id: '1.4', modulId: 1, bezeichnung: 'Fortbewegen innerhalb des Wohnbereichs', skala: ordinal(STUFEN_SELBSTSTAENDIGKEIT) },
    { id: '1.5', modulId: 1, bezeichnung: 'Treppensteigen', skala: ordinal(STUFEN_SELBSTSTAENDIGKEIT) },
  ],
  schweregradBereiche: [
    { schweregrad: 0, bezeichnung: 'keine Beeinträchtigung', von: 0, bis: 1, gewichtetePunkte: 0 },
    { schweregrad: 1, bezeichnung: 'geringe Beeinträchtigung', von: 2, bis: 3, gewichtetePunkte: 2.5 },
    { schweregrad: 2, bezeichnung: 'erhebliche Beeinträchtigung', von: 4, bis: 5, gewichtetePunkte: 5 },
    { schweregrad: 3, bezeichnung: 'schwere Beeinträchtigung', von: 6, bis: 9, gewichtetePunkte: 7.5 },
    { schweregrad: 4, bezeichnung: 'schwerste Beeinträchtigung', von: 10, bis: 15, gewichtetePunkte: 10 },
  ],
};

const MODUL_2: Modul = {
  id: 2,
  name: 'Kognitive und kommunikative Fähigkeiten',
  gewichtungProzent: 15,
  einleitung:
    'Wie gut kann sich die begutachtete Person orientieren, Sachverhalte erfassen und am Gespräch teilnehmen? Bewertet werden ausschließlich kognitive Funktionen.',
  maxEinzelpunkte: 33,
  kriterien: [
    { id: '2.1', modulId: 2, bezeichnung: 'Erkennen von Personen aus dem näheren Umfeld', skala: ordinal(STUFEN_FAEHIGKEIT) },
    { id: '2.2', modulId: 2, bezeichnung: 'Örtliche Orientierung', skala: ordinal(STUFEN_FAEHIGKEIT) },
    { id: '2.3', modulId: 2, bezeichnung: 'Zeitliche Orientierung', skala: ordinal(STUFEN_FAEHIGKEIT) },
    { id: '2.4', modulId: 2, bezeichnung: 'Erinnern an wesentliche Ereignisse oder Beobachtungen', skala: ordinal(STUFEN_FAEHIGKEIT) },
    { id: '2.5', modulId: 2, bezeichnung: 'Steuern von mehrschrittigen Alltagshandlungen', skala: ordinal(STUFEN_FAEHIGKEIT) },
    { id: '2.6', modulId: 2, bezeichnung: 'Treffen von Entscheidungen im Alltagsleben', skala: ordinal(STUFEN_FAEHIGKEIT) },
    { id: '2.7', modulId: 2, bezeichnung: 'Verstehen von Sachverhalten und Informationen', skala: ordinal(STUFEN_FAEHIGKEIT) },
    { id: '2.8', modulId: 2, bezeichnung: 'Erkennen von Risiken und Gefahren', skala: ordinal(STUFEN_FAEHIGKEIT) },
    { id: '2.9', modulId: 2, bezeichnung: 'Mitteilen von elementaren Bedürfnissen', skala: ordinal(STUFEN_FAEHIGKEIT) },
    { id: '2.10', modulId: 2, bezeichnung: 'Verstehen von Aufforderungen', skala: ordinal(STUFEN_FAEHIGKEIT) },
    { id: '2.11', modulId: 2, bezeichnung: 'Beteiligen an einem Gespräch', skala: ordinal(STUFEN_FAEHIGKEIT) },
  ],
  schweregradBereiche: [
    { schweregrad: 0, bezeichnung: 'keine Beeinträchtigung', von: 0, bis: 1, gewichtetePunkte: 0 },
    { schweregrad: 1, bezeichnung: 'geringe Beeinträchtigung', von: 2, bis: 5, gewichtetePunkte: 3.75 },
    { schweregrad: 2, bezeichnung: 'erhebliche Beeinträchtigung', von: 6, bis: 10, gewichtetePunkte: 7.5 },
    { schweregrad: 3, bezeichnung: 'schwere Beeinträchtigung', von: 11, bis: 16, gewichtetePunkte: 11.25 },
    { schweregrad: 4, bezeichnung: 'schwerste Beeinträchtigung', von: 17, bis: 33, gewichtetePunkte: 15 },
  ],
};

const MODUL_3: Modul = {
  id: 3,
  name: 'Verhaltensweisen und psychische Problemlagen',
  gewichtungProzent: 15,
  einleitung:
    'Wie häufig führen Verhaltensweisen oder psychische Problemlagen dazu, dass eine personelle Unterstützung nötig wird? In die Gesamtwertung fließt nur das Modul mit dem höheren gewichteten Punktwert von Modul 2 oder 3 ein.',
  maxEinzelpunkte: 65,
  kriterien: [
    { id: '3.1', modulId: 3, bezeichnung: 'Motorisch geprägte Verhaltensauffälligkeiten', skala: ordinal(STUFEN_HAEUFIGKEIT_M3) },
    { id: '3.2', modulId: 3, bezeichnung: 'Nächtliche Unruhe', skala: ordinal(STUFEN_HAEUFIGKEIT_M3) },
    { id: '3.3', modulId: 3, bezeichnung: 'Selbstschädigendes und autoaggressives Verhalten', skala: ordinal(STUFEN_HAEUFIGKEIT_M3) },
    { id: '3.4', modulId: 3, bezeichnung: 'Beschädigen von Gegenständen', skala: ordinal(STUFEN_HAEUFIGKEIT_M3) },
    { id: '3.5', modulId: 3, bezeichnung: 'Physisch aggressives Verhalten gegenüber anderen Personen', skala: ordinal(STUFEN_HAEUFIGKEIT_M3) },
    { id: '3.6', modulId: 3, bezeichnung: 'Verbale Aggression', skala: ordinal(STUFEN_HAEUFIGKEIT_M3) },
    { id: '3.7', modulId: 3, bezeichnung: 'Andere pflegerelevante vokale Auffälligkeiten', skala: ordinal(STUFEN_HAEUFIGKEIT_M3) },
    { id: '3.8', modulId: 3, bezeichnung: 'Abwehr pflegerischer und anderer unterstützender Maßnahmen', skala: ordinal(STUFEN_HAEUFIGKEIT_M3) },
    { id: '3.9', modulId: 3, bezeichnung: 'Wahnvorstellungen', skala: ordinal(STUFEN_HAEUFIGKEIT_M3) },
    { id: '3.10', modulId: 3, bezeichnung: 'Ängste', skala: ordinal(STUFEN_HAEUFIGKEIT_M3) },
    { id: '3.11', modulId: 3, bezeichnung: 'Antriebslosigkeit bei depressiver Stimmungslage', skala: ordinal(STUFEN_HAEUFIGKEIT_M3) },
    { id: '3.12', modulId: 3, bezeichnung: 'Sozial inadäquate Verhaltensweisen', skala: ordinal(STUFEN_HAEUFIGKEIT_M3) },
    { id: '3.13', modulId: 3, bezeichnung: 'Sonstige pflegerelevante inadäquate Handlungen', skala: ordinal(STUFEN_HAEUFIGKEIT_M3) },
  ],
  schweregradBereiche: [
    { schweregrad: 0, bezeichnung: 'keine Beeinträchtigung', von: 0, bis: 0, gewichtetePunkte: 0 },
    { schweregrad: 1, bezeichnung: 'geringe Beeinträchtigung', von: 1, bis: 2, gewichtetePunkte: 3.75 },
    { schweregrad: 2, bezeichnung: 'erhebliche Beeinträchtigung', von: 3, bis: 4, gewichtetePunkte: 7.5 },
    { schweregrad: 3, bezeichnung: 'schwere Beeinträchtigung', von: 5, bis: 6, gewichtetePunkte: 11.25 },
    { schweregrad: 4, bezeichnung: 'schwerste Beeinträchtigung', von: 7, bis: 65, gewichtetePunkte: 15 },
  ],
};

const MODUL_4: Modul = {
  id: 4,
  name: 'Selbstversorgung',
  gewichtungProzent: 40,
  einleitung:
    'Wie selbstständig kann die begutachtete Person sich waschen, anziehen, essen, trinken und ausscheiden? Modul 4 hat mit 40 % das höchste Gewicht in der Gesamtbewertung.',
  maxEinzelpunkte: 54,
  kriterien: [
    { id: '4.1', modulId: 4, bezeichnung: 'Waschen des vorderen Oberkörpers', skala: ordinal(STUFEN_SELBSTSTAENDIGKEIT) },
    { id: '4.2', modulId: 4, bezeichnung: 'Körperpflege im Bereich des Kopfes (Kämmen, Zahnpflege, Prothesenreinigung, Rasieren)', skala: ordinal(STUFEN_SELBSTSTAENDIGKEIT) },
    { id: '4.3', modulId: 4, bezeichnung: 'Waschen des Intimbereichs', skala: ordinal(STUFEN_SELBSTSTAENDIGKEIT) },
    { id: '4.4', modulId: 4, bezeichnung: 'Duschen und Baden einschließlich Waschen der Haare', skala: ordinal(STUFEN_SELBSTSTAENDIGKEIT) },
    { id: '4.5', modulId: 4, bezeichnung: 'An- und Auskleiden des Oberkörpers', skala: ordinal(STUFEN_SELBSTSTAENDIGKEIT) },
    { id: '4.6', modulId: 4, bezeichnung: 'An- und Auskleiden des Unterkörpers', skala: ordinal(STUFEN_SELBSTSTAENDIGKEIT) },
    { id: '4.7', modulId: 4, bezeichnung: 'Mundgerechtes Zubereiten der Nahrung und Eingießen von Getränken', skala: ordinal(STUFEN_SELBSTSTAENDIGKEIT) },
    { id: '4.8', modulId: 4, bezeichnung: 'Essen', skala: ordinal(STUFEN_SELBSTSTAENDIGKEIT), faktor: 3 },
    { id: '4.9', modulId: 4, bezeichnung: 'Trinken', skala: ordinal(STUFEN_SELBSTSTAENDIGKEIT), faktor: 2 },
    { id: '4.10', modulId: 4, bezeichnung: 'Benutzen einer Toilette oder eines Toilettenstuhls', skala: ordinal(STUFEN_SELBSTSTAENDIGKEIT), faktor: 2 },
    { id: '4.11', modulId: 4, bezeichnung: 'Bewältigung der Folgen einer Harninkontinenz und Umgang mit Dauerkatheter / Urostoma', skala: ordinal(STUFEN_SELBSTSTAENDIGKEIT) },
    { id: '4.12', modulId: 4, bezeichnung: 'Bewältigung der Folgen einer Stuhlinkontinenz und Umgang mit Stoma', skala: ordinal(STUFEN_SELBSTSTAENDIGKEIT) },
    { id: '4.13', modulId: 4, bezeichnung: 'Ernährung parenteral oder über Sonde', skala: ordinal(STUFEN_M4_13) },
  ],
  schweregradBereiche: [
    { schweregrad: 0, bezeichnung: 'keine Beeinträchtigung', von: 0, bis: 2, gewichtetePunkte: 0 },
    { schweregrad: 1, bezeichnung: 'geringe Beeinträchtigung', von: 3, bis: 7, gewichtetePunkte: 10 },
    { schweregrad: 2, bezeichnung: 'erhebliche Beeinträchtigung', von: 8, bis: 18, gewichtetePunkte: 20 },
    { schweregrad: 3, bezeichnung: 'schwere Beeinträchtigung', von: 19, bis: 36, gewichtetePunkte: 30 },
    { schweregrad: 4, bezeichnung: 'schwerste Beeinträchtigung', von: 37, bis: 54, gewichtetePunkte: 40 },
  ],
};

const FREQUENZ_HINWEIS =
  'Eingabe als Punktwert nach Begutachtungsrichtlinien (Häufigkeit pro Tag/Woche/Monat × kriterienspezifischer Faktor). Frequenzrechner folgt im UI.';

function frequenzKriterium(id: string, bezeichnung: string, max: number): Kriterium {
  return {
    id,
    modulId: 5,
    bezeichnung,
    skala: { art: 'frequenz', max, hinweis: FREQUENZ_HINWEIS },
  };
}

const MODUL_5: Modul = {
  id: 5,
  name: 'Bewältigung von und selbstständiger Umgang mit krankheits- oder therapiebedingten Anforderungen und Belastungen',
  gewichtungProzent: 20,
  einleitung:
    'Wie selbstständig kann die begutachtete Person mit ärztlich angeordneten, voraussichtlich mindestens sechs Monate erforderlichen Maßnahmen umgehen? Bewertet wird die Häufigkeit notwendiger Hilfen.',
  maxEinzelpunkte: 100,
  kriterien: [
    frequenzKriterium('5.1', 'Medikation', 30),
    frequenzKriterium('5.2', 'Injektionen / subkutane Infusionen', 30),
    frequenzKriterium('5.3', 'Versorgung intravenöser Zugänge (z. B. Port)', 30),
    frequenzKriterium('5.4', 'Absaugen und Sauerstoffgabe', 30),
    frequenzKriterium('5.5', 'Einreibungen sowie Kälte- und Wärmeanwendungen', 30),
    frequenzKriterium('5.6', 'Messung und Deutung von Körperzuständen (z. B. Blutdruck, Blutzucker)', 30),
    frequenzKriterium('5.7', 'Körpernahe Hilfsmittel (z. B. Bandagen, Kompressionsstrümpfe)', 30),
    frequenzKriterium('5.8', 'Verbandwechsel und Wundversorgung', 30),
    frequenzKriterium('5.9', 'Versorgung mit Stoma', 30),
    frequenzKriterium('5.10', 'Regelmäßige Einmalkatheterisierung und Nutzung von Abführmethoden', 30),
    frequenzKriterium('5.11', 'Therapiemaßnahmen in häuslicher Umgebung', 30),
    frequenzKriterium('5.12', 'Zeit- und technikintensive Maßnahmen in häuslicher Umgebung', 60),
    frequenzKriterium('5.13', 'Arztbesuche', 4),
    frequenzKriterium('5.14', 'Besuch anderer medizinischer oder therapeutischer Einrichtungen (bis 3 Stunden)', 4),
    frequenzKriterium('5.15', 'Zeitlich ausgedehnte Besuche medizinischer oder therapeutischer Einrichtungen (länger als 3 Stunden)', 4),
    frequenzKriterium('5.16', 'Einhalten einer Diät oder anderer krankheits- oder therapiebedingter Verhaltensvorschriften', 1),
  ],
  schweregradBereiche: [
    { schweregrad: 0, bezeichnung: 'keine Beeinträchtigung', von: 0, bis: 0, gewichtetePunkte: 0 },
    { schweregrad: 1, bezeichnung: 'geringe Beeinträchtigung', von: 1, bis: 1, gewichtetePunkte: 5 },
    { schweregrad: 2, bezeichnung: 'erhebliche Beeinträchtigung', von: 2, bis: 3, gewichtetePunkte: 10 },
    { schweregrad: 3, bezeichnung: 'schwere Beeinträchtigung', von: 4, bis: 6, gewichtetePunkte: 15 },
    { schweregrad: 4, bezeichnung: 'schwerste Beeinträchtigung', von: 7, bis: Number.POSITIVE_INFINITY, gewichtetePunkte: 20 },
  ],
};

const MODUL_6: Modul = {
  id: 6,
  name: 'Gestaltung des Alltagslebens und sozialer Kontakte',
  gewichtungProzent: 15,
  einleitung:
    'Wie selbstständig kann die begutachtete Person ihren Tagesablauf gestalten, sich beschäftigen und soziale Kontakte pflegen?',
  maxEinzelpunkte: 18,
  kriterien: [
    { id: '6.1', modulId: 6, bezeichnung: 'Gestaltung des Tagesablaufs und Anpassung an Veränderungen', skala: ordinal(STUFEN_SELBSTSTAENDIGKEIT) },
    { id: '6.2', modulId: 6, bezeichnung: 'Ruhen und Schlafen', skala: ordinal(STUFEN_SELBSTSTAENDIGKEIT) },
    { id: '6.3', modulId: 6, bezeichnung: 'Sich beschäftigen', skala: ordinal(STUFEN_SELBSTSTAENDIGKEIT) },
    { id: '6.4', modulId: 6, bezeichnung: 'Vornehmen von in die Zukunft gerichteten Planungen', skala: ordinal(STUFEN_SELBSTSTAENDIGKEIT) },
    { id: '6.5', modulId: 6, bezeichnung: 'Interaktion mit Personen im direkten Kontakt', skala: ordinal(STUFEN_SELBSTSTAENDIGKEIT) },
    { id: '6.6', modulId: 6, bezeichnung: 'Kontaktpflege zu Personen außerhalb des direkten Umfelds', skala: ordinal(STUFEN_SELBSTSTAENDIGKEIT) },
  ],
  schweregradBereiche: [
    { schweregrad: 0, bezeichnung: 'keine Beeinträchtigung', von: 0, bis: 0, gewichtetePunkte: 0 },
    { schweregrad: 1, bezeichnung: 'geringe Beeinträchtigung', von: 1, bis: 3, gewichtetePunkte: 3.75 },
    { schweregrad: 2, bezeichnung: 'erhebliche Beeinträchtigung', von: 4, bis: 6, gewichtetePunkte: 7.5 },
    { schweregrad: 3, bezeichnung: 'schwere Beeinträchtigung', von: 7, bis: 11, gewichtetePunkte: 11.25 },
    { schweregrad: 4, bezeichnung: 'schwerste Beeinträchtigung', von: 12, bis: 18, gewichtetePunkte: 15 },
  ],
};

export const MODULE: readonly Modul[] = [MODUL_1, MODUL_2, MODUL_3, MODUL_4, MODUL_5, MODUL_6];

export const MODUL_BY_ID: Record<number, Modul> = Object.fromEntries(
  MODULE.map((m) => [m.id, m]),
);

export function getModul(id: number): Modul {
  const modul = MODUL_BY_ID[id];
  if (!modul) throw new Error(`Modul ${id} unbekannt`);
  return modul;
}

export function getKriterium(id: string): Kriterium {
  for (const modul of MODULE) {
    const kriterium = modul.kriterien.find((k) => k.id === id);
    if (kriterium) return kriterium;
  }
  throw new Error(`Kriterium ${id} unbekannt`);
}

export const ALLE_KRITERIEN: readonly Kriterium[] = MODULE.flatMap((m) => m.kriterien);
