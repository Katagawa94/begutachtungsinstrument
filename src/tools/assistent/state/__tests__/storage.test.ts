import { beforeEach, describe, expect, it } from 'vitest';
import {
  STORAGE_KEY_FOR_TESTS,
  exportiereAlsJson,
  ladeAusStorage,
  parseImport,
  speichereInStorage,
} from '../storage';
import { ASSISTENT_SCHEMA_VERSION } from '../schema';
import { neueSkill } from '../../domain/skills';

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

let store: MemoryStorage;
beforeEach(() => {
  store = new MemoryStorage();
});

describe('storage', () => {
  it('lädt ein leeres Array, wenn nichts gespeichert ist', () => {
    expect(ladeAusStorage(store)).toEqual([]);
  });

  it('rundtrip: speichern und laden', () => {
    const s = neueSkill({ id: 'a' });
    speichereInStorage([s], store);
    expect(ladeAusStorage(store)).toEqual([s]);
    expect(JSON.parse(store.getItem(STORAGE_KEY_FOR_TESTS) ?? '{}').schemaVersion).toBe(
      ASSISTENT_SCHEMA_VERSION,
    );
  });

  it('verwirft beschädigtes JSON ohne zu werfen', () => {
    store.setItem(STORAGE_KEY_FOR_TESTS, '{kaputt');
    expect(ladeAusStorage(store)).toEqual([]);
  });

  it('verwirft Daten mit unbekannter Schema-Version', () => {
    store.setItem(STORAGE_KEY_FOR_TESTS, JSON.stringify({ schemaVersion: 999, skills: [] }));
    expect(ladeAusStorage(store)).toEqual([]);
  });

  it('verwirft strukturell ungültige Daten', () => {
    store.setItem(
      STORAGE_KEY_FOR_TESTS,
      JSON.stringify({ schemaVersion: ASSISTENT_SCHEMA_VERSION, skills: [{ id: 'a' }] }),
    );
    expect(ladeAusStorage(store)).toEqual([]);
  });

  it('parseImport akzeptiert valides Export-Format', () => {
    const s = neueSkill({ id: 'a' });
    const ergebnis = parseImport(exportiereAlsJson([s]));
    expect(ergebnis.ok).toBe(true);
    if (ergebnis.ok) expect(ergebnis.skills).toEqual([s]);
  });

  it('parseImport lehnt fehlerhafte Strukturen ab', () => {
    expect(parseImport('nicht json').ok).toBe(false);
    expect(parseImport(JSON.stringify({ foo: 'bar' })).ok).toBe(false);
    expect(
      parseImport(JSON.stringify({ schemaVersion: 1, skills: [{ id: 'x' }] })).ok,
    ).toBe(false);
  });
});
