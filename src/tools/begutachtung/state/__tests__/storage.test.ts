import { beforeEach, describe, expect, it } from 'vitest';
import {
  STORAGE_KEY_FOR_TESTS,
  exportiereAlleAlsJson,
  exportiereAlsJson,
  ladeAusStorage,
  parseImport,
  speichereInStorage,
} from '../storage';
import type { Begutachtung } from '../schema';
import { SCHEMA_VERSION, neueBegutachtung } from '../schema';

class MemoryStorage implements Storage {
  private data = new Map<string, string>();
  get length() {
    return this.data.size;
  }
  clear() {
    this.data.clear();
  }
  getItem(key: string) {
    return this.data.get(key) ?? null;
  }
  key(index: number) {
    return Array.from(this.data.keys())[index] ?? null;
  }
  removeItem(key: string) {
    this.data.delete(key);
  }
  setItem(key: string, value: string) {
    this.data.set(key, value);
  }
}

const TS = '2026-05-10T08:00:00.000Z';

let store: MemoryStorage;

beforeEach(() => {
  store = new MemoryStorage();
});

describe('storage', () => {
  it('lädt leeres Array, wenn nichts gespeichert ist', () => {
    expect(ladeAusStorage(store)).toEqual([]);
  });

  it('rundtrip: speichern und laden', () => {
    const a: Begutachtung = neueBegutachtung('a', TS);
    speichereInStorage([a], store);
    expect(ladeAusStorage(store)).toEqual([a]);
    expect(JSON.parse(store.getItem(STORAGE_KEY_FOR_TESTS) ?? '{}').schemaVersion).toBe(
      SCHEMA_VERSION,
    );
  });

  it('verwirft beschädigte JSON-Daten ohne zu werfen', () => {
    store.setItem(STORAGE_KEY_FOR_TESTS, '{not-json');
    expect(ladeAusStorage(store)).toEqual([]);
  });

  it('verwirft Daten mit unbekannter Schema-Version', () => {
    store.setItem(
      STORAGE_KEY_FOR_TESTS,
      JSON.stringify({ schemaVersion: 999, begutachtungen: [] }),
    );
    expect(ladeAusStorage(store)).toEqual([]);
  });

  it('parseImport akzeptiert valides Export-Format', () => {
    const a = neueBegutachtung('a', TS);
    const json = exportiereAlsJson(a);
    const ergebnis = parseImport(json);
    expect(ergebnis.ok).toBe(true);
    if (ergebnis.ok) {
      expect(ergebnis.begutachtungen).toEqual([a]);
    }
  });

  it('parseImport lehnt fehlerhafte Strukturen ab', () => {
    expect(parseImport('nicht json').ok).toBe(false);
    expect(parseImport(JSON.stringify({ foo: 'bar' })).ok).toBe(false);
    expect(
      parseImport(JSON.stringify({ schemaVersion: 1, begutachtungen: [{ id: 'x' }] })).ok,
    ).toBe(false);
  });

  it('exportiereAlleAlsJson + parseImport funktioniert für mehrere Einträge', () => {
    const a = neueBegutachtung('a', TS);
    const b = neueBegutachtung('b', TS);
    const ergebnis = parseImport(exportiereAlleAlsJson([a, b]));
    expect(ergebnis.ok).toBe(true);
    if (ergebnis.ok) {
      expect(ergebnis.begutachtungen.map((x) => x.id)).toEqual(['a', 'b']);
    }
  });
});
