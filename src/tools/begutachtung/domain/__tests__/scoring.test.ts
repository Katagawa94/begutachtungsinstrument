import { describe, expect, it } from 'vitest';
import { getModul } from '../modules';
import {
  berechneEinzelpunkte,
  berechneFortschritt,
  berechneGesamtergebnis,
  berechneModulErgebnis,
  bestimmePflegegrad,
  findSchweregradBereich,
} from '../scoring';
import type { Bewertungen } from '../types';

function bew(eintraege: Record<string, number>): Bewertungen {
  return Object.fromEntries(
    Object.entries(eintraege).map(([id, wert]) => [id, { wert, kommentar: '' }]),
  );
}

describe('findSchweregradBereich – Anlage 2 SGB XI Tabellengrenzen', () => {
  it('Modul 1: 0–1→0; 2–3→2,5; 4–5→5; 6–9→7,5; 10–15→10', () => {
    const m = getModul(1);
    expect(findSchweregradBereich(m, 0).gewichtetePunkte).toBe(0);
    expect(findSchweregradBereich(m, 1).gewichtetePunkte).toBe(0);
    expect(findSchweregradBereich(m, 2).gewichtetePunkte).toBe(2.5);
    expect(findSchweregradBereich(m, 3).gewichtetePunkte).toBe(2.5);
    expect(findSchweregradBereich(m, 4).gewichtetePunkte).toBe(5);
    expect(findSchweregradBereich(m, 5).gewichtetePunkte).toBe(5);
    expect(findSchweregradBereich(m, 6).gewichtetePunkte).toBe(7.5);
    expect(findSchweregradBereich(m, 9).gewichtetePunkte).toBe(7.5);
    expect(findSchweregradBereich(m, 10).gewichtetePunkte).toBe(10);
    expect(findSchweregradBereich(m, 15).gewichtetePunkte).toBe(10);
  });

  it('Modul 2: 0–1→0; 2–5→3,75; 6–10→7,5; 11–16→11,25; 17–33→15', () => {
    const m = getModul(2);
    expect(findSchweregradBereich(m, 1).gewichtetePunkte).toBe(0);
    expect(findSchweregradBereich(m, 2).gewichtetePunkte).toBe(3.75);
    expect(findSchweregradBereich(m, 5).gewichtetePunkte).toBe(3.75);
    expect(findSchweregradBereich(m, 6).gewichtetePunkte).toBe(7.5);
    expect(findSchweregradBereich(m, 10).gewichtetePunkte).toBe(7.5);
    expect(findSchweregradBereich(m, 11).gewichtetePunkte).toBe(11.25);
    expect(findSchweregradBereich(m, 16).gewichtetePunkte).toBe(11.25);
    expect(findSchweregradBereich(m, 17).gewichtetePunkte).toBe(15);
    expect(findSchweregradBereich(m, 33).gewichtetePunkte).toBe(15);
  });

  it('Modul 3: 0→0; 1–2→3,75; 3–4→7,5; 5–6→11,25; 7–65→15', () => {
    const m = getModul(3);
    expect(findSchweregradBereich(m, 0).gewichtetePunkte).toBe(0);
    expect(findSchweregradBereich(m, 1).gewichtetePunkte).toBe(3.75);
    expect(findSchweregradBereich(m, 2).gewichtetePunkte).toBe(3.75);
    expect(findSchweregradBereich(m, 3).gewichtetePunkte).toBe(7.5);
    expect(findSchweregradBereich(m, 4).gewichtetePunkte).toBe(7.5);
    expect(findSchweregradBereich(m, 5).gewichtetePunkte).toBe(11.25);
    expect(findSchweregradBereich(m, 6).gewichtetePunkte).toBe(11.25);
    expect(findSchweregradBereich(m, 7).gewichtetePunkte).toBe(15);
    expect(findSchweregradBereich(m, 65).gewichtetePunkte).toBe(15);
  });

  it('Modul 4: 0–2→0; 3–7→10; 8–18→20; 19–36→30; 37–54→40', () => {
    const m = getModul(4);
    expect(findSchweregradBereich(m, 0).gewichtetePunkte).toBe(0);
    expect(findSchweregradBereich(m, 2).gewichtetePunkte).toBe(0);
    expect(findSchweregradBereich(m, 3).gewichtetePunkte).toBe(10);
    expect(findSchweregradBereich(m, 7).gewichtetePunkte).toBe(10);
    expect(findSchweregradBereich(m, 8).gewichtetePunkte).toBe(20);
    expect(findSchweregradBereich(m, 18).gewichtetePunkte).toBe(20);
    expect(findSchweregradBereich(m, 19).gewichtetePunkte).toBe(30);
    expect(findSchweregradBereich(m, 36).gewichtetePunkte).toBe(30);
    expect(findSchweregradBereich(m, 37).gewichtetePunkte).toBe(40);
    expect(findSchweregradBereich(m, 54).gewichtetePunkte).toBe(40);
  });

  it('Modul 5: 0→0; 1→5; 2–3→10; 4–6→15; ≥7→20', () => {
    const m = getModul(5);
    expect(findSchweregradBereich(m, 0).gewichtetePunkte).toBe(0);
    expect(findSchweregradBereich(m, 1).gewichtetePunkte).toBe(5);
    expect(findSchweregradBereich(m, 2).gewichtetePunkte).toBe(10);
    expect(findSchweregradBereich(m, 3).gewichtetePunkte).toBe(10);
    expect(findSchweregradBereich(m, 4).gewichtetePunkte).toBe(15);
    expect(findSchweregradBereich(m, 6).gewichtetePunkte).toBe(15);
    expect(findSchweregradBereich(m, 7).gewichtetePunkte).toBe(20);
    expect(findSchweregradBereich(m, 999).gewichtetePunkte).toBe(20);
  });

  it('Modul 6: 0→0; 1–3→3,75; 4–6→7,5; 7–11→11,25; 12–18→15', () => {
    const m = getModul(6);
    expect(findSchweregradBereich(m, 0).gewichtetePunkte).toBe(0);
    expect(findSchweregradBereich(m, 1).gewichtetePunkte).toBe(3.75);
    expect(findSchweregradBereich(m, 3).gewichtetePunkte).toBe(3.75);
    expect(findSchweregradBereich(m, 4).gewichtetePunkte).toBe(7.5);
    expect(findSchweregradBereich(m, 6).gewichtetePunkte).toBe(7.5);
    expect(findSchweregradBereich(m, 7).gewichtetePunkte).toBe(11.25);
    expect(findSchweregradBereich(m, 11).gewichtetePunkte).toBe(11.25);
    expect(findSchweregradBereich(m, 12).gewichtetePunkte).toBe(15);
    expect(findSchweregradBereich(m, 18).gewichtetePunkte).toBe(15);
  });
});

describe('berechneEinzelpunkte', () => {
  it('berücksichtigt den Faktor je Kriterium (Modul 4: Essen ×3, Trinken/Toilette ×2)', () => {
    const summe = berechneEinzelpunkte(
      getModul(4),
      bew({
        '4.8': 3, // ×3 = 9
        '4.9': 3, // ×2 = 6
        '4.10': 3, // ×2 = 6
        '4.1': 2,
      }),
    );
    expect(summe).toBe(9 + 6 + 6 + 2);
  });

  it('zählt nicht bewertete Kriterien als 0', () => {
    const summe = berechneEinzelpunkte(getModul(1), bew({ '1.1': 3 }));
    expect(summe).toBe(3);
  });

  it('summiert die volle Modulhöchstpunktzahl korrekt (Modul 4 = 54)', () => {
    const alleSchwer = bew(
      Object.fromEntries(getModul(4).kriterien.map((k) => [k.id, k.id === '4.13' ? 6 : 3])),
    );
    expect(berechneEinzelpunkte(getModul(4), alleSchwer)).toBe(54);
  });
});

describe('berechneModulErgebnis', () => {
  it('liefert Schweregrad und Bezeichnung passend zur Anlage 2', () => {
    const ergebnis = berechneModulErgebnis(
      getModul(1),
      bew({ '1.1': 3, '1.2': 3, '1.3': 3, '1.4': 0, '1.5': 0 }),
    );
    expect(ergebnis.einzelpunkte).toBe(9);
    expect(ergebnis.schweregrad).toBe(3);
    expect(ergebnis.gewichtetePunkte).toBe(7.5);
    expect(ergebnis.bewerteteKriterien).toBe(5);
  });

  it('zählt bewertete Kriterien getrennt von der Summe', () => {
    const ergebnis = berechneModulErgebnis(getModul(2), bew({ '2.1': 0, '2.2': 0 }));
    expect(ergebnis.bewerteteKriterien).toBe(2);
    expect(ergebnis.kriterienAnzahl).toBe(11);
    expect(ergebnis.einzelpunkte).toBe(0);
  });
});

describe('bestimmePflegegrad – Schwellenwerte aus § 15 SGB XI', () => {
  const cases: Array<[number, number]> = [
    [0, 0],
    [12.49, 0],
    [12.5, 1],
    [26.99, 1],
    [27, 2],
    [47.49, 2],
    [47.5, 3],
    [69.99, 3],
    [70, 4],
    [89.99, 4],
    [90, 5],
    [100, 5],
  ];
  it.each(cases)('%f Punkte → PG %i', (punkte, erwartet) => {
    expect(bestimmePflegegrad(punkte).pflegegrad).toBe(erwartet);
  });
});

describe('berechneGesamtergebnis', () => {
  it('liefert PG 0 bei leerer Bewertung', () => {
    const ergebnis = berechneGesamtergebnis({});
    expect(ergebnis.gesamtpunkte).toBe(0);
    expect(ergebnis.pflegegrad).toBe(0);
    expect(ergebnis.modulErgebnisse).toHaveLength(6);
  });

  it('berücksichtigt nur das höhere von Modul 2/3 in der Gesamtsumme', () => {
    const bewertungen = bew({
      // Modul 2: 0 → 0 gewichtete Punkte
      // Modul 3: 5 → SG 3, 11,25 gewichtete Punkte
      '3.1': 5,
    });
    const ergebnis = berechneGesamtergebnis(bewertungen);
    const m2 = ergebnis.modulErgebnisse.find((e) => e.modulId === 2);
    const m3 = ergebnis.modulErgebnisse.find((e) => e.modulId === 3);
    expect(m2?.gewichtetePunkte).toBe(0);
    expect(m3?.gewichtetePunkte).toBe(11.25);
    expect(m3?.fliesstInGesamtwertungEin).toBe(true);
    expect(m2?.fliesstInGesamtwertungEin).toBe(false);
    expect(ergebnis.gesamtpunkte).toBe(11.25);
  });

  it('bei Gleichstand zwischen Modul 2 und 3 fließt Modul 2 ein', () => {
    const bewertungen = bew({
      '2.1': 1, // → Modul 2 Summe 1 → SG 0 (0 gewichtete Punkte)
      '3.1': 0, // → Modul 3 Summe 0 → SG 0 (0 gewichtete Punkte)
    });
    const ergebnis = berechneGesamtergebnis(bewertungen);
    const m2 = ergebnis.modulErgebnisse.find((e) => e.modulId === 2);
    const m3 = ergebnis.modulErgebnisse.find((e) => e.modulId === 3);
    expect(m2?.fliesstInGesamtwertungEin).toBe(true);
    expect(m3?.fliesstInGesamtwertungEin).toBe(false);
  });

  it('repräsentatives PG-3-Szenario wird korrekt berechnet', () => {
    const bewertungen = bew({
      // Modul 1: Summe 9 → 7,5
      '1.1': 3,
      '1.2': 3,
      '1.3': 3,
      '1.4': 0,
      '1.5': 0,
      // Modul 2: Summe 12 → 11,25
      '2.1': 2,
      '2.2': 2,
      '2.3': 2,
      '2.4': 2,
      '2.5': 2,
      '2.6': 2,
      // Modul 3 lassen wir leer (0 → 0)
      // Modul 4: Summe 24 → 30 (4.8 ×3 = 9, 4.9 ×2 = 6, plus weitere)
      '4.8': 3,
      '4.9': 3,
      '4.10': 3, // ×2 = 6
      '4.1': 3,
      // Modul 5: 4 → 15
      '5.1': 4,
      // Modul 6: 5 → 7,5
      '6.1': 2,
      '6.2': 1,
      '6.3': 2,
    });
    const ergebnis = berechneGesamtergebnis(bewertungen);
    // 7,5 (M1) + 11,25 (M2 statt M3) + 30 (M4) + 15 (M5) + 7,5 (M6) = 71,25 → PG 4
    expect(ergebnis.gesamtpunkte).toBe(71.25);
    expect(ergebnis.pflegegrad).toBe(4);
  });

  it('volle Maximalbewertung ergibt 100 Punkte und PG 5', () => {
    const allMax: Record<string, number> = {};
    for (const m of [1, 2, 3, 4, 5, 6]) {
      const modul = getModul(m);
      for (const k of modul.kriterien) {
        if (k.skala.art === 'ordinal') {
          allMax[k.id] = Math.max(...k.skala.stufen.map((s) => s.wert));
        } else {
          allMax[k.id] = k.skala.max;
        }
      }
    }
    const ergebnis = berechneGesamtergebnis(bew(allMax));
    // 10 + max(15,15) + 40 + 20 + 15 = 100
    expect(ergebnis.gesamtpunkte).toBe(100);
    expect(ergebnis.pflegegrad).toBe(5);
  });
});

describe('berechneFortschritt', () => {
  it('zählt bewertete Kriterien über alle Module zusammen', () => {
    // Total: 5+11+13+13+16+6 = 64
    const fortschritt = berechneFortschritt(bew({ '1.1': 0, '4.1': 0 }));
    expect(fortschritt.gesamt).toBe(64);
    expect(fortschritt.bewertet).toBe(2);
    expect(fortschritt.prozent).toBe(Math.round((2 / 64) * 100));
  });

  it('liefert 0 % bei leeren Bewertungen', () => {
    expect(berechneFortschritt({}).prozent).toBe(0);
  });
});
