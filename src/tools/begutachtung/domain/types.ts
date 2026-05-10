export type ModulId = 1 | 2 | 3 | 4 | 5 | 6;

export type Schweregrad = 0 | 1 | 2 | 3 | 4;

/**
 * Skala für Modul 1, 2, 4, 6: 0..3 Einzelpunkte.
 * Für Modul 4 sind einige Kriterien zusätzlich gewichtet (×2 bzw. ×3),
 * Modul 4.13 hat eine eigene 0/3/6-Skala.
 *
 * Modul 3: 0 / 1 / 3 / 5 (Häufigkeit).
 * Modul 5: pro Kriterium ein Punktwert, der aus der Häufigkeit berechnet wird.
 */
export type SkalenStufe = {
  wert: number;
  label: string;
  hinweis?: string;
};

/**
 * Berechnungsart für Modul-5-Kriterien (Häufigkeit pro Tag/Woche/Monat).
 * Faktor wirkt jeweils auf die normalisierte Häufigkeit.
 */
export type Modul5Berechnung =
  | { art: 'tagWocheMonat'; faktor: number }
  | { art: 'monatlich'; faktor: number }
  | { art: 'zeitTechnik' }
  | { art: 'jaNein' };

export type KriteriumSkala =
  | { art: 'ordinal'; stufen: SkalenStufe[] }
  | { art: 'frequenz'; max: number; hinweis: string; berechnung: Modul5Berechnung };

export type Kriterium = {
  /** "1.1", "4.13" usw. */
  id: string;
  modulId: ModulId;
  bezeichnung: string;
  /** Beschreibung des bewerteten Themas, paraphrasiert nach den Begutachtungs-Richtlinien. */
  beschreibung?: string;
  skala: KriteriumSkala;
  /** Multiplikator beim Bilden der Modul-Einzelpunkt-Summe. Standard: 1. */
  faktor?: number;
};

export type Modul = {
  id: ModulId;
  name: string;
  /** Anteil der gewichteten Maximalpunkte (z. B. 10, 15, 20, 40). */
  gewichtungProzent: number;
  einleitung: string;
  kriterien: Kriterium[];
  /** Maximalsumme der Einzelpunkte über alle Kriterien (inkl. Faktor). */
  maxEinzelpunkte: number;
  /** Bewertungssystematik nach Anlage 2 SGB XI für dieses Modul. */
  schweregradBereiche: SchweregradBereich[];
};

export type SchweregradBereich = {
  schweregrad: Schweregrad;
  bezeichnung: string;
  /** Untergrenze inklusiv. */
  von: number;
  /** Obergrenze inklusiv. */
  bis: number;
  gewichtetePunkte: number;
};

export type Modul5Frequenz = {
  /** Anzahl der Maßnahmen pro Tag */
  tag?: number;
  /** Anzahl der Maßnahmen pro Woche */
  woche?: number;
  /** Anzahl der Maßnahmen pro Monat */
  monat?: number;
  /** Ja/Nein-Antwort (z. B. Diät erforderlich) */
  jaNein?: boolean;
};

export type Bewertung = {
  wert: number | null;
  kommentar: string;
  /** Optionale Roh-Häufigkeit für Modul-5-Kriterien; aus ihr wird `wert` abgeleitet. */
  frequenz?: Modul5Frequenz;
};

export type Bewertungen = Record<string, Bewertung>;

export type ModulErgebnis = {
  modulId: ModulId;
  einzelpunkte: number;
  schweregrad: Schweregrad;
  schweregradBezeichnung: string;
  gewichtetePunkte: number;
  kriterienAnzahl: number;
  bewerteteKriterien: number;
  /** Nur bei Modul 2/3 gesetzt. */
  fliesstInGesamtwertungEin?: boolean;
};

export type Pflegegrad = 0 | 1 | 2 | 3 | 4 | 5;

export type Gesamtergebnis = {
  modulErgebnisse: ModulErgebnis[];
  gesamtpunkte: number;
  pflegegrad: Pflegegrad;
  pflegegradBezeichnung: string;
};
