import { ASSISTENT_SCHEMA_VERSION, isGespeicherteSkills } from './schema';
import type { GespeicherteSkills } from './schema';
import type { Skill } from '../domain/skills';

const STORAGE_KEY = 'psv-hub:assistent-skills:v1';

export function ladeAusStorage(storage: Storage = localStorage): Skill[] {
  let raw: string | null = null;
  try {
    raw = storage.getItem(STORAGE_KEY);
  } catch {
    return [];
  }
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isGespeicherteSkills(parsed)) return [];
    if (parsed.schemaVersion !== ASSISTENT_SCHEMA_VERSION) return [];
    return parsed.skills;
  } catch {
    return [];
  }
}

export function speichereInStorage(skills: Skill[], storage: Storage = localStorage): void {
  const daten: GespeicherteSkills = { schemaVersion: ASSISTENT_SCHEMA_VERSION, skills };
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(daten));
  } catch {
    /* z. B. QuotaExceeded — ignorieren */
  }
}

export function exportiereAlsJson(skills: Skill[]): string {
  const daten: GespeicherteSkills = { schemaVersion: ASSISTENT_SCHEMA_VERSION, skills };
  return JSON.stringify(daten, null, 2);
}

export type ImportErgebnis =
  | { ok: true; skills: Skill[] }
  | { ok: false; fehler: string };

export function parseImport(json: string): ImportErgebnis {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return { ok: false, fehler: 'Ungültiges JSON.' };
  }
  if (!isGespeicherteSkills(parsed)) {
    return { ok: false, fehler: 'Datei entspricht nicht dem erwarteten Format.' };
  }
  if (parsed.schemaVersion !== ASSISTENT_SCHEMA_VERSION) {
    return {
      ok: false,
      fehler: `Schema-Version ${parsed.schemaVersion} wird nicht unterstützt (erwartet ${ASSISTENT_SCHEMA_VERSION}).`,
    };
  }
  return { ok: true, skills: parsed.skills };
}

export const STORAGE_KEY_FOR_TESTS = STORAGE_KEY;
