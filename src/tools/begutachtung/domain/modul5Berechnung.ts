import type { Modul5Berechnung, Modul5Frequenz } from './types';

const TAGE_PRO_WOCHE = 7;
const TAGE_PRO_MONAT = 30;

export type Modul5Eingabe = Pick<Modul5Frequenz, 'tag' | 'woche' | 'monat' | 'jaNein'>;

/**
 * Wandelt eine Modul-5-Häufigkeit in einen ganzzahligen Punktwert um.
 *
 * - `tagWocheMonat`: Tagesäquivalent = Tag + Woche/7 + Monat/30, multipliziert mit Faktor.
 * - `monatlich`: Monatsanzahl × Faktor.
 * - `zeitTechnik`: 60 × Tagesäquivalent (gedeckelt bei 60).
 * - `jaNein`: 1 wenn aktiviert, sonst 0.
 *
 * Das Ergebnis wird auf den Kriterien-Maximalwert gedeckelt.
 */
export function berechneModul5Punkte(
  berechnung: Modul5Berechnung,
  max: number,
  eingabe: Modul5Eingabe,
): number {
  switch (berechnung.art) {
    case 'jaNein':
      return eingabe.jaNein ? 1 : 0;

    case 'monatlich': {
      const roh = (eingabe.monat ?? 0) * berechnung.faktor;
      return clamp(Math.round(roh), 0, max);
    }

    case 'zeitTechnik': {
      const proTag = tagesaequivalent(eingabe);
      return clamp(Math.round(proTag * 60), 0, 60);
    }

    case 'tagWocheMonat': {
      const proTag = tagesaequivalent(eingabe);
      return clamp(Math.round(proTag * berechnung.faktor), 0, max);
    }
  }
}

export function tagesaequivalent(eingabe: Modul5Eingabe): number {
  return (
    (eingabe.tag ?? 0) +
    (eingabe.woche ?? 0) / TAGE_PRO_WOCHE +
    (eingabe.monat ?? 0) / TAGE_PRO_MONAT
  );
}

export function istLeere(eingabe: Modul5Eingabe | undefined): boolean {
  if (!eingabe) return true;
  if (eingabe.jaNein === true) return false;
  return !eingabe.tag && !eingabe.woche && !eingabe.monat;
}

function clamp(wert: number, min: number, max: number): number {
  if (Number.isNaN(wert)) return 0;
  return Math.max(min, Math.min(max, wert));
}
