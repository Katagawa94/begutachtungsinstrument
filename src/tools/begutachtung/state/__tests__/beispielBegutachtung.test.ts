import { describe, expect, it } from 'vitest';
import { bauBeispielBegutachtung } from '../beispielBegutachtung';
import { berechneFortschritt, berechneGesamtergebnis } from '../../domain/scoring';
import { ALLE_KRITERIEN } from '../../domain/modules';

describe('bauBeispielBegutachtung', () => {
  const beispiel = bauBeispielBegutachtung('id', '2026-05-10T08:00:00.000Z');

  it('liefert Pflegegrad 3 mit 57,5 gewichteten Punkten', () => {
    const ergebnis = berechneGesamtergebnis(beispiel.bewertungen);
    expect(ergebnis.gesamtpunkte).toBe(57.5);
    expect(ergebnis.pflegegrad).toBe(3);
  });

  it('lässt M3 weg und nutzt M2 in der Gesamtwertung', () => {
    const ergebnis = berechneGesamtergebnis(beispiel.bewertungen);
    const m2 = ergebnis.modulErgebnisse.find((e) => e.modulId === 2);
    const m3 = ergebnis.modulErgebnisse.find((e) => e.modulId === 3);
    expect(m2?.fliesstInGesamtwertungEin).toBe(true);
    expect(m3?.fliesstInGesamtwertungEin).toBe(false);
  });

  it('hat ein vollständig ausgefülltes Stammdaten-Set', () => {
    expect(beispiel.stammdaten.person.name).not.toBe('');
    expect(beispiel.stammdaten.person.geburtsdatum).not.toBe('');
    expect(beispiel.stammdaten.gutachter.name).not.toBe('');
    expect(beispiel.stammdaten.termin.datum).not.toBe('');
    expect(beispiel.stammdaten.versicherung.aktenzeichen).not.toBe('');
  });

  it('bewertet eine substanzielle Mehrheit aller Kriterien', () => {
    const fortschritt = berechneFortschritt(beispiel.bewertungen);
    // Alle Kriterien außer einigen Modul-5-Häufigkeiten sind gesetzt
    expect(fortschritt.bewertet).toBeGreaterThanOrEqual(ALLE_KRITERIEN.length - 16);
  });

  it('enthält mehrere Kommentare zur Demonstration', () => {
    const kommentare = Object.values(beispiel.bewertungen).filter(
      (b) => b.kommentar.trim().length > 0,
    );
    expect(kommentare.length).toBeGreaterThanOrEqual(5);
  });
});
