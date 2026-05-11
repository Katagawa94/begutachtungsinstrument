import { describe, expect, it } from 'vitest';
import { ALLE_KRITERIEN, MODULE, getKriterium, getModul } from '../modules';

describe('Modul-Definitionen', () => {
  it('enthält genau die 6 Module 1..6', () => {
    expect(MODULE.map((m) => m.id)).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('hat die nach SGB XI vorgeschriebene Anzahl Kriterien je Modul', () => {
    const erwartet = { 1: 5, 2: 11, 3: 13, 4: 13, 5: 16, 6: 6 } as const;
    for (const modul of MODULE) {
      expect(modul.kriterien.length).toBe(erwartet[modul.id]);
    }
  });

  it('vergibt eindeutige Kriterien-IDs über alle Module', () => {
    const ids = ALLE_KRITERIEN.map((k) => k.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('hat Kriterien-IDs im Format "<modul>.<nr>"', () => {
    for (const k of ALLE_KRITERIEN) {
      expect(k.id).toMatch(/^[1-6]\.\d+$/);
      expect(k.id.startsWith(`${k.modulId}.`)).toBe(true);
    }
  });

  it('hat die SGB-XI-Gewichtungen 10/15/15/40/20/15', () => {
    expect(MODULE.map((m) => m.gewichtungProzent)).toEqual([10, 15, 15, 40, 20, 15]);
  });

  it('hat Modul 4 mit den korrekten Faktoren (×3 für Essen, ×2 für Trinken/Toilette)', () => {
    expect(getKriterium('4.8').faktor).toBe(3);
    expect(getKriterium('4.9').faktor).toBe(2);
    expect(getKriterium('4.10').faktor).toBe(2);
    // Standard-Faktor 1 wird als undefined modelliert
    expect(getKriterium('4.1').faktor).toBeUndefined();
  });

  it('hat zusammenhängende und lückenlose Schweregrad-Bereiche je Modul', () => {
    for (const modul of MODULE) {
      const bereiche = [...modul.schweregradBereiche].sort((a, b) => a.von - b.von);
      expect(bereiche[0]?.von).toBe(0);
      for (let i = 1; i < bereiche.length; i++) {
        const vorher = bereiche[i - 1];
        const aktuell = bereiche[i];
        if (!vorher || !aktuell) throw new Error('unerreichbar');
        expect(aktuell.von).toBe(vorher.bis + 1);
      }
    }
  });

  it('wirft bei unbekannten IDs', () => {
    expect(() => getModul(99)).toThrow();
    expect(() => getKriterium('9.9')).toThrow();
  });

  it('versorgt jedes Kriterium mit einer offiziellen Beschreibung', () => {
    for (const k of ALLE_KRITERIEN) {
      expect(k.beschreibung, `Beschreibung fehlt für Kriterium ${k.id}`).toBeDefined();
      expect(k.beschreibung!.length).toBeGreaterThan(20);
    }
  });

  it('versorgt jede Stufe ordinaler Kriterien mit einer eigenen Beschreibung', () => {
    for (const k of ALLE_KRITERIEN) {
      if (k.skala.art !== 'ordinal') continue;
      for (const stufe of k.skala.stufen) {
        expect(
          stufe.beschreibung,
          `Stufen-Beschreibung fehlt für ${k.id} = ${stufe.wert}`,
        ).toBeDefined();
        expect(stufe.beschreibung!.length).toBeGreaterThan(10);
      }
    }
  });

  it('verwendet bei Modul 3 die gemeinsame Häufigkeitsbeschreibung für alle Kriterien', () => {
    const modul3 = MODULE.find((m) => m.id === 3)!;
    const text0 = (modul3.kriterien[0]!.skala as { stufen: { wert: number; beschreibung?: string }[] }).stufen.find(
      (s) => s.wert === 0,
    )?.beschreibung;
    expect(text0).toBeDefined();
    for (const k of modul3.kriterien) {
      if (k.skala.art !== 'ordinal') continue;
      const stufe = k.skala.stufen.find((s) => s.wert === 0);
      expect(stufe?.beschreibung).toBe(text0);
    }
  });
});
