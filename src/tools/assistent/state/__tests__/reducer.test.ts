import { describe, expect, it } from 'vitest';
import { reducer } from '../reducer';
import type { State } from '../reducer';
import { neueSkill } from '../../domain/skills';
import type { Skill } from '../../domain/skills';

function stateMit(...skills: Skill[]): State {
  return { skills };
}

describe('reducer', () => {
  it('hinzufuegen prepended einen Skill', () => {
    const a = neueSkill({ id: 'a' });
    const b = neueSkill({ id: 'b' });
    const next = reducer(stateMit(a), { type: 'hinzufuegen', skill: b });
    expect(next.skills.map((s) => s.id)).toEqual(['b', 'a']);
  });

  it('loeschen entfernt nur den passenden Skill', () => {
    const a = neueSkill({ id: 'a' });
    const b = neueSkill({ id: 'b' });
    const next = reducer(stateMit(a, b), { type: 'loeschen', id: 'a' });
    expect(next.skills.map((s) => s.id)).toEqual(['b']);
  });

  it('aktualisieren ersetzt den passenden Skill', () => {
    const a = neueSkill({ id: 'a', name: 'alt' });
    const next = reducer(stateMit(a), { type: 'aktualisieren', skill: { ...a, name: 'neu' } });
    expect(next.skills[0]?.name).toBe('neu');
  });

  it('importieren ergänzt und überspringt vorhandene IDs', () => {
    const a = neueSkill({ id: 'a' });
    const b = neueSkill({ id: 'b' });
    const next = reducer(stateMit(a), { type: 'importieren', modus: 'ergaenzen', skills: [a, b] });
    expect(next.skills.map((s) => s.id)).toEqual(['b', 'a']);
  });

  it('importieren im Modus "ersetzen" überschreibt den Bestand', () => {
    const a = neueSkill({ id: 'a' });
    const b = neueSkill({ id: 'b' });
    const next = reducer(stateMit(a), { type: 'importieren', modus: 'ersetzen', skills: [b] });
    expect(next.skills.map((s) => s.id)).toEqual(['b']);
  });

  it('alleSetzen ersetzt die Liste komplett', () => {
    const a = neueSkill({ id: 'a' });
    const next = reducer(stateMit(neueSkill({ id: 'x' })), { type: 'alleSetzen', skills: [a] });
    expect(next.skills.map((s) => s.id)).toEqual(['a']);
  });
});
