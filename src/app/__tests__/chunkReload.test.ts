import { describe, expect, it } from 'vitest';
import { sieht_nach_chunk_fehler_aus } from '../chunkReload';

describe('sieht_nach_chunk_fehler_aus', () => {
  it('erkennt typische Chunk-Lade-Fehlermeldungen', () => {
    expect(
      sieht_nach_chunk_fehler_aus('Failed to fetch dynamically imported module: /assets/a.js'),
    ).toBe(true);
    expect(
      sieht_nach_chunk_fehler_aus('error loading dynamically imported module https://x/y.js'),
    ).toBe(true);
    expect(sieht_nach_chunk_fehler_aus('Importing a module script failed.')).toBe(true);
  });

  it('ignoriert unrelated Fehlermeldungen', () => {
    expect(sieht_nach_chunk_fehler_aus('Cannot read properties of undefined')).toBe(false);
    expect(sieht_nach_chunk_fehler_aus('')).toBe(false);
  });
});
