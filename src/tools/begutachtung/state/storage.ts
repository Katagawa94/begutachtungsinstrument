import { SCHEMA_VERSION, isGespeicherteDaten } from './schema';
import type { Begutachtung, GespeicherteDaten } from './schema';

const STORAGE_KEY = 'psv-hub:begutachtungen:v1';

export function ladeAusStorage(storage: Storage = localStorage): Begutachtung[] {
  let raw: string | null = null;
  try {
    raw = storage.getItem(STORAGE_KEY);
  } catch {
    return [];
  }
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isGespeicherteDaten(parsed)) return [];
    if (parsed.schemaVersion !== SCHEMA_VERSION) {
      // Spätere Migrationen kommen hier rein.
      return [];
    }
    return parsed.begutachtungen;
  } catch {
    return [];
  }
}

export function speichereInStorage(
  begutachtungen: Begutachtung[],
  storage: Storage = localStorage,
): void {
  const daten: GespeicherteDaten = {
    schemaVersion: SCHEMA_VERSION,
    begutachtungen,
  };
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(daten));
  } catch {
    /* z. B. QuotaExceeded — ignorieren, UI zeigt Bestand weiter an */
  }
}

export function exportiereAlsJson(begutachtung: Begutachtung): string {
  const exportFormat: GespeicherteDaten = {
    schemaVersion: SCHEMA_VERSION,
    begutachtungen: [begutachtung],
  };
  return JSON.stringify(exportFormat, null, 2);
}

export function exportiereAlleAlsJson(begutachtungen: Begutachtung[]): string {
  const exportFormat: GespeicherteDaten = {
    schemaVersion: SCHEMA_VERSION,
    begutachtungen,
  };
  return JSON.stringify(exportFormat, null, 2);
}

export type ImportErgebnis = {
  ok: true;
  begutachtungen: Begutachtung[];
} | {
  ok: false;
  fehler: string;
};

export function parseImport(json: string): ImportErgebnis {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return { ok: false, fehler: 'Ungültiges JSON.' };
  }
  if (!isGespeicherteDaten(parsed)) {
    return { ok: false, fehler: 'Datei entspricht nicht dem erwarteten Format.' };
  }
  if (parsed.schemaVersion !== SCHEMA_VERSION) {
    return {
      ok: false,
      fehler: `Schema-Version ${parsed.schemaVersion} wird nicht unterstützt (erwartet ${SCHEMA_VERSION}).`,
    };
  }
  return { ok: true, begutachtungen: parsed.begutachtungen };
}

export const STORAGE_KEY_FOR_TESTS = STORAGE_KEY;
