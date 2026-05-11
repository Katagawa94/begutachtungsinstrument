import { describe, expect, it } from 'vitest';
import { anwendenRegeln, escapeRegex, neueRegel } from '../anonymisierung';
import type { Ersetzungsregel } from '../anonymisierung';

function regel(partial: Partial<Ersetzungsregel> & { id: string }): Ersetzungsregel {
  return { suchen: '', ersetzen: '', caseSensitive: false, teilwort: false, ...partial };
}

describe('escapeRegex', () => {
  it('escaped Regex-Sonderzeichen', () => {
    expect(escapeRegex('a.b*c?')).toBe('a\\.b\\*c\\?');
    expect(escapeRegex('(x)[y]{z}')).toBe('\\(x\\)\\[y\\]\\{z\\}');
    expect(escapeRegex('einfach')).toBe('einfach');
  });
});

describe('anwendenRegeln', () => {
  it('ersetzt ganze Wörter (nicht Teilwörter) im Standardmodus', () => {
    const text = 'Müller und Müllermilch und Schmüller.';
    const { ergebnis, anzahlProRegel, gesamtAnzahl } = anwendenRegeln(text, [
      regel({ id: 'r1', suchen: 'Müller', ersetzen: 'Person A' }),
    ]);
    expect(ergebnis).toBe('Person A und Müllermilch und Schmüller.');
    expect(anzahlProRegel.r1).toBe(1);
    expect(gesamtAnzahl).toBe(1);
  });

  it('ersetzt Teilwörter, wenn teilwort=true', () => {
    const { ergebnis, anzahlProRegel } = anwendenRegeln('Müller und Müllermilch.', [
      regel({ id: 'r1', suchen: 'Müller', ersetzen: 'X', teilwort: true }),
    ]);
    expect(ergebnis).toBe('X und Xmilch.');
    expect(anzahlProRegel.r1).toBe(2);
  });

  it('beachtet Groß-/Kleinschreibung nur, wenn caseSensitive=true', () => {
    const text = 'Müller, müller, MÜLLER';
    const insensitiv = anwendenRegeln(text, [
      regel({ id: 'r1', suchen: 'müller', ersetzen: 'X', teilwort: true }),
    ]);
    expect(insensitiv.ergebnis).toBe('X, X, X');
    expect(insensitiv.anzahlProRegel.r1).toBe(3);

    const sensitiv = anwendenRegeln(text, [
      regel({ id: 'r1', suchen: 'müller', ersetzen: 'X', teilwort: true, caseSensitive: true }),
    ]);
    expect(sensitiv.ergebnis).toBe('Müller, X, MÜLLER');
    expect(sensitiv.anzahlProRegel.r1).toBe(1);
  });

  it('wendet Regeln in Reihenfolge an (jede auf dem Ergebnis der vorigen)', () => {
    const { ergebnis } = anwendenRegeln('Anna Müller', [
      regel({ id: 'r1', suchen: 'Anna Müller', ersetzen: 'PATIENT' }),
      regel({ id: 'r2', suchen: 'PATIENT', ersetzen: 'Person 1', teilwort: true }),
    ]);
    expect(ergebnis).toBe('Person 1');
  });

  it('behandelt $-Sequenzen im Ersatztext literal', () => {
    const { ergebnis } = anwendenRegeln('Betrag X', [
      regel({ id: 'r1', suchen: 'X', ersetzen: '$1 & $&', teilwort: true }),
    ]);
    expect(ergebnis).toBe('Betrag $1 & $&');
  });

  it('zählt null und ändert nichts bei leerem Suchfeld', () => {
    const { ergebnis, anzahlProRegel } = anwendenRegeln('unverändert', [
      regel({ id: 'r1', suchen: '', ersetzen: 'X' }),
    ]);
    expect(ergebnis).toBe('unverändert');
    expect(anzahlProRegel.r1).toBe(0);
  });

  it('zählt 0 für eine Regel ohne Treffer', () => {
    const { anzahlProRegel, gesamtAnzahl } = anwendenRegeln('hallo welt', [
      regel({ id: 'r1', suchen: 'xyz', ersetzen: 'X' }),
    ]);
    expect(anzahlProRegel.r1).toBe(0);
    expect(gesamtAnzahl).toBe(0);
  });

  it('summiert über mehrere Regeln', () => {
    const { gesamtAnzahl, anzahlProRegel } = anwendenRegeln('a b a c b', [
      regel({ id: 'r1', suchen: 'a', ersetzen: 'X', teilwort: true }),
      regel({ id: 'r2', suchen: 'b', ersetzen: 'Y', teilwort: true }),
    ]);
    expect(anzahlProRegel.r1).toBe(2);
    expect(anzahlProRegel.r2).toBe(2);
    expect(gesamtAnzahl).toBe(4);
  });

  it('Wortgrenzen funktionieren mit Umlauten und ß', () => {
    const { ergebnis } = anwendenRegeln('Straße an der Straßenecke', [
      regel({ id: 'r1', suchen: 'Straße', ersetzen: 'ORT' }),
    ]);
    expect(ergebnis).toBe('ORT an der Straßenecke');
  });
});

describe('neueRegel', () => {
  it('erzeugt eine Regel mit Defaults und eindeutiger ID', () => {
    const a = neueRegel();
    const b = neueRegel();
    expect(a.id).not.toBe(b.id);
    expect(a).toMatchObject({ suchen: '', ersetzen: '', caseSensitive: false, teilwort: false });
  });

  it('übernimmt überschriebene Felder', () => {
    const r = neueRegel({ suchen: 'Test', teilwort: true });
    expect(r.suchen).toBe('Test');
    expect(r.teilwort).toBe(true);
  });
});
