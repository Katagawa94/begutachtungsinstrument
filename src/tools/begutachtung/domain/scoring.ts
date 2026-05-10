import { MODULE, getModul } from './modules';
import type {
  Bewertungen,
  Gesamtergebnis,
  Modul,
  ModulErgebnis,
  Pflegegrad,
  Schweregrad,
  SchweregradBereich,
} from './types';

/**
 * Liefert den Schweregrad-Bereich nach Anlage 2 SGB XI für eine
 * Einzelpunkt-Summe innerhalb eines Moduls.
 */
export function findSchweregradBereich(modul: Modul, einzelpunkte: number): SchweregradBereich {
  const bereich = modul.schweregradBereiche.find(
    (b) => einzelpunkte >= b.von && einzelpunkte <= b.bis,
  );
  if (!bereich) {
    throw new Error(
      `Einzelpunkt-Summe ${einzelpunkte} liegt außerhalb der Bereiche von Modul ${modul.id}`,
    );
  }
  return bereich;
}

/**
 * Summiert die Einzelpunkte eines Moduls. Bewertete Werte werden mit dem
 * Kriterien-Faktor multipliziert. Nicht bewertete Kriterien zählen als 0.
 */
export function berechneEinzelpunkte(modul: Modul, bewertungen: Bewertungen): number {
  let summe = 0;
  for (const kriterium of modul.kriterien) {
    const bewertung = bewertungen[kriterium.id];
    if (!bewertung || bewertung.wert == null) continue;
    const faktor = kriterium.faktor ?? 1;
    summe += bewertung.wert * faktor;
  }
  return summe;
}

export function zaehleBewerteteKriterien(modul: Modul, bewertungen: Bewertungen): number {
  return modul.kriterien.reduce((acc, k) => {
    const wert = bewertungen[k.id]?.wert;
    return acc + (wert == null ? 0 : 1);
  }, 0);
}

export function berechneModulErgebnis(modul: Modul, bewertungen: Bewertungen): ModulErgebnis {
  const einzelpunkte = berechneEinzelpunkte(modul, bewertungen);
  const bereich = findSchweregradBereich(modul, einzelpunkte);
  return {
    modulId: modul.id,
    einzelpunkte,
    schweregrad: bereich.schweregrad,
    schweregradBezeichnung: bereich.bezeichnung,
    gewichtetePunkte: bereich.gewichtetePunkte,
    kriterienAnzahl: modul.kriterien.length,
    bewerteteKriterien: zaehleBewerteteKriterien(modul, bewertungen),
  };
}

const PFLEGEGRADE: { schwelle: number; pflegegrad: Pflegegrad; bezeichnung: string }[] = [
  { schwelle: 90, pflegegrad: 5, bezeichnung: 'Pflegegrad 5 (schwerste Beeinträchtigung)' },
  { schwelle: 70, pflegegrad: 4, bezeichnung: 'Pflegegrad 4 (schwerste Beeinträchtigung)' },
  { schwelle: 47.5, pflegegrad: 3, bezeichnung: 'Pflegegrad 3 (schwere Beeinträchtigung)' },
  { schwelle: 27, pflegegrad: 2, bezeichnung: 'Pflegegrad 2 (erhebliche Beeinträchtigung)' },
  { schwelle: 12.5, pflegegrad: 1, bezeichnung: 'Pflegegrad 1 (geringe Beeinträchtigung)' },
];

export function bestimmePflegegrad(gesamtpunkte: number): {
  pflegegrad: Pflegegrad;
  bezeichnung: string;
} {
  for (const stufe of PFLEGEGRADE) {
    if (gesamtpunkte >= stufe.schwelle) {
      return { pflegegrad: stufe.pflegegrad, bezeichnung: stufe.bezeichnung };
    }
  }
  return { pflegegrad: 0, bezeichnung: 'Kein Pflegegrad' };
}

/**
 * Berechnet das Gesamtergebnis nach SGB XI:
 * - Modul 1, 4, 5, 6 fließen jeweils mit ihren gewichteten Punkten ein.
 * - Modul 2 und 3 werden gemeinsam betrachtet; nur das Modul mit dem
 *   höheren gewichteten Punktwert fließt in die Gesamtsumme ein.
 */
export function berechneGesamtergebnis(bewertungen: Bewertungen): Gesamtergebnis {
  const modulErgebnisse: ModulErgebnis[] = MODULE.map((m) =>
    berechneModulErgebnis(m, bewertungen),
  );

  const ergebnisFuer = (id: number): ModulErgebnis => {
    const erg = modulErgebnisse.find((e) => e.modulId === id);
    if (!erg) throw new Error(`Kein Ergebnis für Modul ${id}`);
    return erg;
  };

  const m2 = ergebnisFuer(2);
  const m3 = ergebnisFuer(3);
  const m2Gewinnt = m2.gewichtetePunkte >= m3.gewichtetePunkte;
  m2.fliesstInGesamtwertungEin = m2Gewinnt;
  m3.fliesstInGesamtwertungEin = !m2Gewinnt;
  const m2m3Punkte = m2Gewinnt ? m2.gewichtetePunkte : m3.gewichtetePunkte;

  const gesamtpunkte =
    ergebnisFuer(1).gewichtetePunkte +
    m2m3Punkte +
    ergebnisFuer(4).gewichtetePunkte +
    ergebnisFuer(5).gewichtetePunkte +
    ergebnisFuer(6).gewichtetePunkte;

  const pflegegrad = bestimmePflegegrad(gesamtpunkte);

  return {
    modulErgebnisse,
    gesamtpunkte: Math.round(gesamtpunkte * 100) / 100,
    pflegegrad: pflegegrad.pflegegrad,
    pflegegradBezeichnung: pflegegrad.bezeichnung,
  };
}

export function berechneFortschritt(bewertungen: Bewertungen): {
  bewertet: number;
  gesamt: number;
  prozent: number;
} {
  let bewertet = 0;
  let gesamt = 0;
  for (const modul of MODULE) {
    gesamt += modul.kriterien.length;
    bewertet += zaehleBewerteteKriterien(modul, bewertungen);
  }
  return {
    bewertet,
    gesamt,
    prozent: gesamt === 0 ? 0 : Math.round((bewertet / gesamt) * 100),
  };
}

export function berechneModulFortschritt(modulId: number, bewertungen: Bewertungen) {
  const modul = getModul(modulId);
  const bewertet = zaehleBewerteteKriterien(modul, bewertungen);
  return {
    bewertet,
    gesamt: modul.kriterien.length,
    vollstaendig: bewertet === modul.kriterien.length,
  };
}

export type { Schweregrad };
