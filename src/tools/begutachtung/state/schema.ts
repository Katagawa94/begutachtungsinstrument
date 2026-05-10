import type { Bewertungen } from '../domain/types';

export const SCHEMA_VERSION = 1;

export type Stammdaten = {
  person: { name: string; geburtsdatum: string };
  gutachter: { name: string };
  termin: { datum: string; ort: string };
  versicherung: { traeger: string; aktenzeichen: string };
};

export type Begutachtung = {
  id: string;
  schemaVersion: number;
  createdAt: string;
  updatedAt: string;
  stammdaten: Stammdaten;
  bewertungen: Bewertungen;
};

export type GespeicherteDaten = {
  schemaVersion: number;
  begutachtungen: Begutachtung[];
};

export function leereStammdaten(): Stammdaten {
  return {
    person: { name: '', geburtsdatum: '' },
    gutachter: { name: '' },
    termin: { datum: '', ort: '' },
    versicherung: { traeger: '', aktenzeichen: '' },
  };
}

export function neueBegutachtung(id: string, jetzt: string): Begutachtung {
  return {
    id,
    schemaVersion: SCHEMA_VERSION,
    createdAt: jetzt,
    updatedAt: jetzt,
    stammdaten: leereStammdaten(),
    bewertungen: {},
  };
}

export function isBegutachtung(value: unknown): value is Begutachtung {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === 'string' &&
    typeof v.schemaVersion === 'number' &&
    typeof v.createdAt === 'string' &&
    typeof v.updatedAt === 'string' &&
    typeof v.stammdaten === 'object' &&
    v.stammdaten !== null &&
    typeof v.bewertungen === 'object' &&
    v.bewertungen !== null
  );
}

export function isGespeicherteDaten(value: unknown): value is GespeicherteDaten {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.schemaVersion === 'number' &&
    Array.isArray(v.begutachtungen) &&
    v.begutachtungen.every(isBegutachtung)
  );
}
