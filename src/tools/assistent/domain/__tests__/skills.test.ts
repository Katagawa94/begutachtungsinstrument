import { describe, expect, it } from 'vitest';
import { PRESET_SKILLS, baueNachrichten, istPreset, neueSkill } from '../skills';
import type { Skill } from '../skills';

function skill(partial: Partial<Skill> = {}): Skill {
  return { ...neueSkill(), ...partial };
}

describe('neueSkill', () => {
  it('liefert sinnvolle Defaults und eindeutige IDs', () => {
    const a = neueSkill();
    const b = neueSkill();
    expect(a.id).not.toBe(b.id);
    expect(a.beispiele).toEqual([]);
    expect(a.temperature).toBeGreaterThanOrEqual(0);
    expect(a.maxTokens).toBeGreaterThan(0);
    expect(a.systemPrompt.length).toBeGreaterThan(10);
  });

  it('übernimmt überschriebene Felder', () => {
    const s = neueSkill({ name: 'X', temperature: 0.9 });
    expect(s.name).toBe('X');
    expect(s.temperature).toBe(0.9);
  });
});

describe('istPreset', () => {
  it('erkennt mitgelieferte Vorlagen', () => {
    expect(istPreset(PRESET_SKILLS[0]!.id)).toBe(true);
    expect(istPreset('irgendwas')).toBe(false);
  });
});

describe('baueNachrichten', () => {
  it('beginnt mit einer System-Nachricht, die den systemPrompt enthält', () => {
    const s = skill({ systemPrompt: 'SYSTEM-ANWEISUNG' });
    const n = baueNachrichten(s, 'Eingabe');
    expect(n[0]?.role).toBe('system');
    expect(n[0]?.content).toContain('SYSTEM-ANWEISUNG');
  });

  it('hängt die Vorlage als Gerüst-Hinweis an die System-Nachricht an', () => {
    const s = skill({ systemPrompt: 'SYS', vorlage: '## A\n\n## B\n' });
    const n = baueNachrichten(s, 'x');
    expect(n[0]?.content).toContain('## A');
    expect(n[0]?.content).toContain('Gerüst');
  });

  it('lässt die Vorlage weg, wenn sie leer ist', () => {
    const s = skill({ systemPrompt: 'SYS', vorlage: '   ' });
    const n = baueNachrichten(s, 'x');
    expect(n[0]?.content).toBe('SYS');
  });

  it('fügt few-shot Beispiele als user/assistant in Reihenfolge ein', () => {
    const s = skill({
      beispiele: [
        { eingabe: 'frage1', ausgabe: 'antwort1' },
        { eingabe: 'frage2', ausgabe: 'antwort2' },
      ],
    });
    const n = baueNachrichten(s, 'echte eingabe');
    expect(n.map((m) => m.role)).toEqual(['system', 'user', 'assistant', 'user', 'assistant', 'user']);
    expect(n[1]?.content).toBe('frage1');
    expect(n[2]?.content).toBe('antwort1');
    expect(n[3]?.content).toBe('frage2');
    expect(n[4]?.content).toBe('antwort2');
  });

  it('überspringt komplett leere Beispiel-Paare', () => {
    const s = skill({ beispiele: [{ eingabe: '  ', ausgabe: '' }] });
    const n = baueNachrichten(s, 'eingabe');
    expect(n.map((m) => m.role)).toEqual(['system', 'user']);
  });

  it('schließt mit der aktuellen Eingabe als letzter user-Nachricht ab', () => {
    const n = baueNachrichten(skill(), 'MEINE EINGABE');
    expect(n.at(-1)).toEqual({ role: 'user', content: 'MEINE EINGABE' });
  });
});
