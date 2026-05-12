import { describe, expect, it } from 'vitest';
import { reducer } from '../reducer';
import type { State } from '../reducer';
import type { Begutachtung, Stammdaten } from '../schema';
import { SCHEMA_VERSION, leereStammdaten, neueBegutachtung } from '../schema';

const T1 = '2026-05-10T08:00:00.000Z';
const T2 = '2026-05-10T09:00:00.000Z';

function leererState(): State {
  return { begutachtungen: [] };
}

function stateMit(...begutachtungen: Begutachtung[]): State {
  return { begutachtungen };
}

describe('reducer', () => {
  it('erstellen fügt eine neue Begutachtung an den Anfang', () => {
    const next = reducer(leererState(), { type: 'erstellen', id: 'a', jetzt: T1 });
    expect(next.begutachtungen).toHaveLength(1);
    expect(next.begutachtungen[0]?.id).toBe('a');
    expect(next.begutachtungen[0]?.schemaVersion).toBe(SCHEMA_VERSION);
    expect(next.begutachtungen[0]?.bewertungen).toEqual({});
  });

  it('loeschen entfernt nur die passende Begutachtung', () => {
    const a = neueBegutachtung('a', T1);
    const b = neueBegutachtung('b', T1);
    const next = reducer(stateMit(a, b), { type: 'loeschen', id: 'a' });
    expect(next.begutachtungen.map((x) => x.id)).toEqual(['b']);
  });

  it('stammdatenAktualisieren ändert nur die betroffene Begutachtung', () => {
    const a = neueBegutachtung('a', T1);
    const b = neueBegutachtung('b', T1);
    const stammdaten: Stammdaten = {
      ...leereStammdaten(),
      person: { name: 'Erika Mustermann', geburtsdatum: '1940-01-01' },
    };
    const next = reducer(stateMit(a, b), {
      type: 'stammdatenAktualisieren',
      id: 'a',
      stammdaten,
      jetzt: T2,
    });
    expect(next.begutachtungen[0]?.stammdaten.person.name).toBe('Erika Mustermann');
    expect(next.begutachtungen[0]?.updatedAt).toBe(T2);
    expect(next.begutachtungen[1]?.updatedAt).toBe(T1);
  });

  it('bewertungSetzen speichert Wert und Kommentar', () => {
    const a = neueBegutachtung('a', T1);
    const next = reducer(stateMit(a), {
      type: 'bewertungSetzen',
      id: 'a',
      kriteriumId: '1.1',
      bewertung: { wert: 2, kommentar: 'hilft beim Aufstehen' },
      jetzt: T2,
    });
    expect(next.begutachtungen[0]?.bewertungen['1.1']).toEqual({
      wert: 2,
      kommentar: 'hilft beim Aufstehen',
    });
    expect(next.begutachtungen[0]?.updatedAt).toBe(T2);
  });

  it('bewertungSetzen überschreibt nur explizit gesetzte Felder', () => {
    const start: Begutachtung = {
      ...neueBegutachtung('a', T1),
      bewertungen: { '1.1': { wert: 2, kommentar: 'alt' } },
    };
    const next = reducer(stateMit(start), {
      type: 'bewertungSetzen',
      id: 'a',
      kriteriumId: '1.1',
      bewertung: { kommentar: 'neu' },
      jetzt: T2,
    });
    expect(next.begutachtungen[0]?.bewertungen['1.1']).toEqual({ wert: 2, kommentar: 'neu' });
  });

  it('bewertungSetzen entfernt den Eintrag, wenn Wert null und Kommentar leer', () => {
    const start: Begutachtung = {
      ...neueBegutachtung('a', T1),
      bewertungen: { '1.1': { wert: 2, kommentar: 'foo' } },
    };
    const next = reducer(stateMit(start), {
      type: 'bewertungSetzen',
      id: 'a',
      kriteriumId: '1.1',
      bewertung: { wert: null, kommentar: '' },
      jetzt: T2,
    });
    expect(next.begutachtungen[0]?.bewertungen).toEqual({});
  });

  it('bewertungSetzen speichert eine Modul-5-Frequenz und behält sie bei Kommentar-Änderung', () => {
    const a = neueBegutachtung('a', T1);
    const mitFrequenz = reducer(stateMit(a), {
      type: 'bewertungSetzen',
      id: 'a',
      kriteriumId: '5.1',
      bewertung: { wert: 3, frequenz: { tag: 3 } },
      jetzt: T2,
    });
    expect(mitFrequenz.begutachtungen[0]?.bewertungen['5.1']).toEqual({
      wert: 3,
      kommentar: '',
      frequenz: { tag: 3 },
    });
    const mitKommentar = reducer(mitFrequenz, {
      type: 'bewertungSetzen',
      id: 'a',
      kriteriumId: '5.1',
      bewertung: { kommentar: 'tägliche Tabletten' },
      jetzt: T2,
    });
    expect(mitKommentar.begutachtungen[0]?.bewertungen['5.1']).toEqual({
      wert: 3,
      kommentar: 'tägliche Tabletten',
      frequenz: { tag: 3 },
    });
  });

  it('bewertungSetzen löscht den Eintrag, wenn Wert/Frequenz/Kommentar alle leer sind', () => {
    const start: Begutachtung = {
      ...neueBegutachtung('a', T1),
      bewertungen: { '5.1': { wert: 3, kommentar: '', frequenz: { tag: 3 } } },
    };
    const next = reducer(stateMit(start), {
      type: 'bewertungSetzen',
      id: 'a',
      kriteriumId: '5.1',
      bewertung: { wert: null, frequenz: undefined },
      jetzt: T2,
    });
    expect(next.begutachtungen[0]?.bewertungen).toEqual({});
  });

  it('bewertungSetzen behält eine Modul-5-Bewertung mit explizit eingetragener 0', () => {
    const a = neueBegutachtung('a', T1);
    const next = reducer(stateMit(a), {
      type: 'bewertungSetzen',
      id: 'a',
      kriteriumId: '5.1',
      bewertung: { wert: 0, frequenz: { tag: 0 } },
      jetzt: T2,
    });
    expect(next.begutachtungen[0]?.bewertungen['5.1']).toEqual({
      wert: 0,
      kommentar: '',
      frequenz: { tag: 0 },
    });
  });

  it('duplizieren erzeugt eine unabhängige Kopie mit neuer ID', () => {
    const start: Begutachtung = {
      ...neueBegutachtung('a', T1),
      bewertungen: { '1.1': { wert: 1, kommentar: 'x' } },
    };
    const next = reducer(stateMit(start), {
      type: 'duplizieren',
      id: 'a',
      neueId: 'a-kopie',
      jetzt: T2,
    });
    expect(next.begutachtungen).toHaveLength(2);
    expect(next.begutachtungen[0]?.id).toBe('a-kopie');
    expect(next.begutachtungen[0]?.bewertungen['1.1']).toEqual({ wert: 1, kommentar: 'x' });
    // Mutation der Kopie betrifft das Original nicht
    next.begutachtungen[0]!.bewertungen['1.1'] = { wert: 3, kommentar: 'y' };
    expect(next.begutachtungen[1]?.bewertungen['1.1']?.wert).toBe(1);
  });

  it('importieren im Modus "ergaenzen" überspringt vorhandene IDs', () => {
    const a = neueBegutachtung('a', T1);
    const b = neueBegutachtung('b', T1);
    const next = reducer(stateMit(a), {
      type: 'importieren',
      modus: 'ergaenzen',
      jetzt: T2,
      begutachtungen: [a, b],
    });
    expect(next.begutachtungen.map((x) => x.id)).toEqual(['b', 'a']);
  });

  it('importieren im Modus "ersetzen" überschreibt den Bestand komplett', () => {
    const a = neueBegutachtung('a', T1);
    const b = neueBegutachtung('b', T1);
    const next = reducer(stateMit(a), {
      type: 'importieren',
      modus: 'ersetzen',
      jetzt: T2,
      begutachtungen: [b],
    });
    expect(next.begutachtungen.map((x) => x.id)).toEqual(['b']);
  });
});
