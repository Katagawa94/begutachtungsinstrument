import type { Begutachtung } from '../state/schema';
import { MODULE } from '../domain/modules';
import { berechneGesamtergebnis } from '../domain/scoring';
import type { Gesamtergebnis, Kriterium, Modul, ModulErgebnis } from '../domain/types';
import { formatDate } from '../utils/format';

export type PdfKriterium = {
  id: string;
  bezeichnung: string;
  faktor: number;
  /** Eingegebener Punktwert; null wenn nicht bewertet. */
  wert: number | null;
  /** Label der gewählten Stufe (bei ordinaler Skala) bzw. "frei" bei Frequenz. */
  wertLabel: string;
  /** Effektiver Beitrag zur Modulsumme (wert × faktor). */
  punkte: number;
  kommentar: string;
};

export type PdfModul = {
  id: number;
  name: string;
  gewichtungProzent: number;
  einleitung: string;
  ergebnis: ModulErgebnis;
  kriterien: PdfKriterium[];
};

export type PdfData = {
  erstelltAm: string;
  begutachtung: Begutachtung;
  ergebnis: Gesamtergebnis;
  module: PdfModul[];
};

export function buildPdfData(begutachtung: Begutachtung, jetzt: Date = new Date()): PdfData {
  const ergebnis = berechneGesamtergebnis(begutachtung.bewertungen);
  const module = MODULE.map((modul) => {
    const modulErgebnis = ergebnis.modulErgebnisse.find((e) => e.modulId === modul.id);
    if (!modulErgebnis) throw new Error(`Kein Ergebnis für Modul ${modul.id}`);
    return {
      id: modul.id,
      name: modul.name,
      gewichtungProzent: modul.gewichtungProzent,
      einleitung: modul.einleitung,
      ergebnis: modulErgebnis,
      kriterien: modul.kriterien.map((k) => buildKriterium(modul, k, begutachtung)),
    };
  });
  return {
    erstelltAm: jetzt.toISOString(),
    begutachtung,
    ergebnis,
    module,
  };
}

function buildKriterium(modul: Modul, k: Kriterium, b: Begutachtung): PdfKriterium {
  const bewertung = b.bewertungen[k.id];
  const wert = bewertung?.wert ?? null;
  const faktor = k.faktor ?? 1;
  const punkte = wert == null ? 0 : wert * faktor;
  return {
    id: k.id,
    bezeichnung: k.bezeichnung,
    faktor,
    wert,
    wertLabel: bestimmeWertLabel(modul, k, wert),
    punkte,
    kommentar: bewertung?.kommentar ?? '',
  };
}

function bestimmeWertLabel(modul: Modul, k: Kriterium, wert: number | null): string {
  if (wert == null) return 'nicht bewertet';
  if (k.skala.art === 'ordinal') {
    const stufe = k.skala.stufen.find((s) => s.wert === wert);
    if (!stufe) return `${wert}`;
    return stufe.hinweis ? `${stufe.label} (${stufe.hinweis})` : stufe.label;
  }
  // Frequenz – nur Punktwert anzeigen.
  void modul;
  return `${wert} Punkte`;
}

export function pdfDateinameFuer(data: PdfData): string {
  const name = data.begutachtung.stammdaten.person.name.trim() || 'unbenannt';
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const datum =
    data.begutachtung.stammdaten.termin.datum || data.erstelltAm.slice(0, 10);
  return `gutachten-${slug || 'unbenannt'}-${datum}.pdf`;
}

export function formatErstelltAm(iso: string): string {
  return formatDate(iso);
}
