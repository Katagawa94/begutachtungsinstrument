import { describe, expect, it } from 'vitest';
import { buildPdfData, pdfDateinameFuer } from '../pdfData';
import { neueBegutachtung } from '../../state/schema';
import type { Bewertungen } from '../../domain/types';

const TS = '2026-05-10T08:00:00.000Z';

function bauen(bewertungen: Bewertungen) {
  const b = neueBegutachtung('id', TS);
  b.bewertungen = bewertungen;
  b.stammdaten.person.name = 'Erika Musterfrau';
  b.stammdaten.termin.datum = '2026-05-10';
  return b;
}

describe('buildPdfData', () => {
  it('liefert sechs Module mit Ergebnis und allen Kriterien', () => {
    const data = buildPdfData(bauen({}));
    expect(data.module).toHaveLength(6);
    const kriterienAnzahlen = data.module.map((m) => m.kriterien.length);
    expect(kriterienAnzahlen).toEqual([5, 11, 13, 13, 16, 6]);
    expect(data.module.every((m) => m.ergebnis.modulId === m.id)).toBe(true);
  });

  it('mappt Werte auf die Skala-Labels (ordinal)', () => {
    const data = buildPdfData(
      bauen({
        '1.1': { wert: 1, kommentar: 'Beispiel' },
      }),
    );
    const m1 = data.module[0]!;
    const k = m1.kriterien.find((x) => x.id === '1.1')!;
    expect(k.wert).toBe(1);
    expect(k.wertLabel).toMatch(/überwiegend selbstständig/i);
    expect(k.kommentar).toBe('Beispiel');
    expect(k.faktor).toBe(1);
    expect(k.punkte).toBe(1);
  });

  it('berücksichtigt den Faktor bei Modul-4-Kriterien', () => {
    const data = buildPdfData(
      bauen({
        '4.8': { wert: 3, kommentar: '' }, // ×3
        '4.9': { wert: 2, kommentar: '' }, // ×2
      }),
    );
    const m4 = data.module.find((m) => m.id === 4)!;
    const essen = m4.kriterien.find((k) => k.id === '4.8')!;
    const trinken = m4.kriterien.find((k) => k.id === '4.9')!;
    expect(essen.faktor).toBe(3);
    expect(essen.punkte).toBe(9);
    expect(trinken.faktor).toBe(2);
    expect(trinken.punkte).toBe(4);
    expect(m4.ergebnis.einzelpunkte).toBe(13);
  });

  it('markiert nicht bewertete Kriterien', () => {
    const data = buildPdfData(bauen({}));
    const k = data.module[0]!.kriterien[0]!;
    expect(k.wert).toBeNull();
    expect(k.wertLabel).toBe('nicht bewertet');
    expect(k.punkte).toBe(0);
  });

  it('pflegt das fliesstInGesamtwertungEin-Flag in den Modul-Ergebnissen', () => {
    const data = buildPdfData(
      bauen({
        '3.1': { wert: 5, kommentar: '' }, // M3 SG schwer
      }),
    );
    const m2 = data.module.find((m) => m.id === 2)!;
    const m3 = data.module.find((m) => m.id === 3)!;
    expect(m3.ergebnis.fliesstInGesamtwertungEin).toBe(true);
    expect(m2.ergebnis.fliesstInGesamtwertungEin).toBe(false);
  });
});

describe('pdfDateinameFuer', () => {
  it('verwendet Personenname und Termin-Datum', () => {
    const data = buildPdfData(bauen({}));
    expect(pdfDateinameFuer(data)).toBe('gutachten-erika-musterfrau-2026-05-10.pdf');
  });

  it('fällt auf erstelltAm zurück, wenn kein Termin gesetzt ist', () => {
    const b = neueBegutachtung('id', TS);
    b.stammdaten.person.name = 'Test';
    const data = buildPdfData(b, new Date('2026-04-01T00:00:00.000Z'));
    expect(pdfDateinameFuer(data)).toBe('gutachten-test-2026-04-01.pdf');
  });
});
