import { ASSISTENT_SCHEMA_VERSION } from '../domain/skills';
import type { Skill } from '../domain/skills';

export { ASSISTENT_SCHEMA_VERSION };

export type GespeicherteSkills = {
  schemaVersion: number;
  skills: Skill[];
};

export function isSkill(value: unknown): value is Skill {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === 'string' &&
    typeof v.name === 'string' &&
    typeof v.beschreibung === 'string' &&
    typeof v.systemPrompt === 'string' &&
    typeof v.vorlage === 'string' &&
    Array.isArray(v.beispiele) &&
    v.beispiele.every(
      (b) =>
        b !== null &&
        typeof b === 'object' &&
        typeof (b as Record<string, unknown>).eingabe === 'string' &&
        typeof (b as Record<string, unknown>).ausgabe === 'string',
    ) &&
    typeof v.temperature === 'number' &&
    typeof v.maxTokens === 'number'
  );
}

export function isGespeicherteSkills(value: unknown): value is GespeicherteSkills {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return typeof v.schemaVersion === 'number' && Array.isArray(v.skills) && v.skills.every(isSkill);
}
