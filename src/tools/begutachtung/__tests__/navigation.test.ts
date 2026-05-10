import { describe, expect, it } from 'vitest';
import { buildSteps, findActiveStepIndex } from '../navigation';

describe('buildSteps', () => {
  it('liefert acht Schritte: Stammdaten + Module 1–6 + Abschluss', () => {
    const steps = buildSteps('abc');
    expect(steps).toHaveLength(8);
    expect(steps[0]?.kind).toBe('stammdaten');
    expect(steps[7]?.kind).toBe('abschluss');
    const modulIds = steps.filter((s) => s.kind === 'modul').map((s) => s.modulId);
    expect(modulIds).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('baut die Pfade unter der Begutachtungs-ID auf', () => {
    const steps = buildSteps('xyz');
    expect(steps[0]?.pfad).toBe('/begutachtung/xyz/stammdaten');
    expect(steps[7]?.pfad).toBe('/begutachtung/xyz/abschluss');
    expect(steps[1]?.pfad).toBe('/begutachtung/xyz/modul/1');
  });
});

describe('findActiveStepIndex', () => {
  const steps = buildSteps('abc');

  it('findet den exakten Pfad', () => {
    expect(findActiveStepIndex(steps, '/begutachtung/abc/stammdaten')).toBe(0);
    expect(findActiveStepIndex(steps, '/begutachtung/abc/modul/3')).toBe(3);
    expect(findActiveStepIndex(steps, '/begutachtung/abc/abschluss')).toBe(7);
  });

  it('liefert -1 für unbekannte Pfade', () => {
    expect(findActiveStepIndex(steps, '/begutachtung')).toBe(-1);
    expect(findActiveStepIndex(steps, '/foo/bar')).toBe(-1);
  });

  it('matcht den längsten Präfix (Stammdaten unterscheidet sich von Abschluss)', () => {
    expect(findActiveStepIndex(steps, '/begutachtung/abc/abschluss')).toBe(7);
    expect(findActiveStepIndex(steps, '/begutachtung/abc/stammdaten')).toBe(0);
  });
});
