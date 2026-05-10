import { describe, expect, it } from 'vitest';
import { berechneModul5Punkte, istLeere, tagesaequivalent } from '../modul5Berechnung';
import { getKriterium } from '../modules';

describe('tagesaequivalent', () => {
  it('summiert täglich + wöchentlich/7 + monatlich/30', () => {
    expect(tagesaequivalent({ tag: 2, woche: 7, monat: 30 })).toBeCloseTo(4, 5);
    expect(tagesaequivalent({ tag: 0, woche: 7, monat: 0 })).toBeCloseTo(1, 5);
    expect(tagesaequivalent({ tag: 0, woche: 0, monat: 30 })).toBeCloseTo(1, 5);
  });

  it('behandelt undefined als 0', () => {
    expect(tagesaequivalent({})).toBe(0);
    expect(tagesaequivalent({ tag: 1 })).toBe(1);
  });
});

describe('berechneModul5Punkte – tagWocheMonat (Faktor 1)', () => {
  const k = getKriterium('5.1');
  if (k.skala.art !== 'frequenz') throw new Error('Erwarte Frequenz-Skala');
  const skala = k.skala;

  it('einmal täglich = 1 Punkt', () => {
    expect(berechneModul5Punkte(skala.berechnung, skala.max, { tag: 1 })).toBe(1);
  });

  it('dreimal täglich = 3 Punkte', () => {
    expect(berechneModul5Punkte(skala.berechnung, skala.max, { tag: 3 })).toBe(3);
  });

  it('einmal pro Woche ≈ 0 Punkte (gerundet)', () => {
    expect(berechneModul5Punkte(skala.berechnung, skala.max, { woche: 1 })).toBe(0);
  });

  it('siebenmal pro Woche = 1 Punkt', () => {
    expect(berechneModul5Punkte(skala.berechnung, skala.max, { woche: 7 })).toBe(1);
  });

  it('Mischung Tag + Woche + Monat', () => {
    // 2 + 14/7 + 30/30 = 5
    expect(berechneModul5Punkte(skala.berechnung, skala.max, { tag: 2, woche: 14, monat: 30 })).toBe(5);
  });

  it('wird auf max gedeckelt', () => {
    expect(berechneModul5Punkte(skala.berechnung, skala.max, { tag: 50 })).toBe(skala.max);
  });
});

describe('berechneModul5Punkte – monatlich', () => {
  it('5.13 (Faktor 1): zwei Arztbesuche im Monat = 2 Punkte', () => {
    const k = getKriterium('5.13');
    if (k.skala.art !== 'frequenz') throw new Error('frequenz');
    expect(berechneModul5Punkte(k.skala.berechnung, k.skala.max, { monat: 2 })).toBe(2);
  });

  it('5.15 (Faktor 2): zwei lange Klinikbesuche = 4 Punkte', () => {
    const k = getKriterium('5.15');
    if (k.skala.art !== 'frequenz') throw new Error('frequenz');
    expect(berechneModul5Punkte(k.skala.berechnung, k.skala.max, { monat: 2 })).toBe(4);
  });

  it('wird auf max gedeckelt (5.13: max 4)', () => {
    const k = getKriterium('5.13');
    if (k.skala.art !== 'frequenz') throw new Error('frequenz');
    expect(berechneModul5Punkte(k.skala.berechnung, k.skala.max, { monat: 99 })).toBe(4);
  });
});

describe('berechneModul5Punkte – zeitTechnik (5.12)', () => {
  const k = getKriterium('5.12');
  if (k.skala.art !== 'frequenz') throw new Error('frequenz');
  const { berechnung, max } = k.skala;

  it('einmal täglich = 60 Punkte', () => {
    expect(berechneModul5Punkte(berechnung, max, { tag: 1 })).toBe(60);
  });

  it('zweimal täglich bleibt bei 60 (gedeckelt)', () => {
    expect(berechneModul5Punkte(berechnung, max, { tag: 2 })).toBe(60);
  });

  it('einmal pro Woche ≈ 9 Punkte (60/7 gerundet)', () => {
    expect(berechneModul5Punkte(berechnung, max, { woche: 1 })).toBe(Math.round(60 / 7));
  });
});

describe('berechneModul5Punkte – jaNein (5.16)', () => {
  const k = getKriterium('5.16');
  if (k.skala.art !== 'frequenz') throw new Error('frequenz');
  const { berechnung, max } = k.skala;

  it('aktiv = 1 Punkt', () => {
    expect(berechneModul5Punkte(berechnung, max, { jaNein: true })).toBe(1);
  });

  it('nicht aktiv = 0 Punkte', () => {
    expect(berechneModul5Punkte(berechnung, max, { jaNein: false })).toBe(0);
    expect(berechneModul5Punkte(berechnung, max, {})).toBe(0);
  });
});

describe('istLeere', () => {
  it('ist true bei undefined oder rein zerologischer Eingabe', () => {
    expect(istLeere(undefined)).toBe(true);
    expect(istLeere({})).toBe(true);
    expect(istLeere({ tag: 0, woche: 0, monat: 0 })).toBe(true);
  });

  it('ist false sobald irgendein Feld gesetzt ist', () => {
    expect(istLeere({ tag: 1 })).toBe(false);
    expect(istLeere({ jaNein: true })).toBe(false);
  });
});
