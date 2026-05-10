import type { Bewertungen } from '../domain/types';
import { SCHEMA_VERSION } from './schema';
import type { Begutachtung } from './schema';

/**
 * Liefert eine vollständig ausgefüllte Beispiel-Begutachtung mit
 * realistischen Bewertungen über alle sechs Module. Das Ergebnis
 * landet bei Pflegegrad 3 (≈ 57,5 gewichtete Punkte) und enthält
 * mehrere Kommentare, sodass alle UI-Bereiche – inkl. PDF-Export –
 * aussagekräftig dargestellt werden.
 */
export function bauBeispielBegutachtung(id: string, jetztIso: string): Begutachtung {
  const k = (wert: number, kommentar = ''): { wert: number; kommentar: string } => ({
    wert,
    kommentar,
  });

  const bewertungen: Bewertungen = {
    // Modul 1 — Mobilität (Summe 6 → SG 3 → 7,5 gew. P.)
    '1.1': k(1),
    '1.2': k(1),
    '1.3': k(2, 'Benötigt Festhaltehilfe beim Umsetzen vom Bett in den Rollstuhl.'),
    '1.4': k(1),
    '1.5': k(1, 'Treppensteigen nur mit Geländer auf einer Seite möglich.'),

    // Modul 2 — Kognitive und kommunikative Fähigkeiten (Summe 6 → SG 2 → 7,5 gew. P.)
    '2.1': k(0),
    '2.2': k(1),
    '2.3': k(2, 'Tageszeitliche Orientierung tagsüber meist gegeben, abends unsicher.'),
    '2.4': k(2),
    '2.5': k(1),
    '2.6': k(0),
    '2.7': k(0),
    '2.8': k(0),
    '2.9': k(0),
    '2.10': k(0),
    '2.11': k(0),

    // Modul 3 — Verhaltensweisen und psychische Problemlagen (Summe 0 → 0 gew. P.)
    '3.1': k(0),
    '3.2': k(0),
    '3.3': k(0),
    '3.4': k(0),
    '3.5': k(0),
    '3.6': k(0),
    '3.7': k(0),
    '3.8': k(0),
    '3.9': k(0),
    '3.10': k(1, 'Gelegentliche Unruhe vor Arztbesuchen.'),
    '3.11': k(0),
    '3.12': k(0),
    '3.13': k(0),

    // Modul 4 — Selbstversorgung (Summe 13 → SG 2 → 20 gew. P.)
    '4.1': k(1),
    '4.2': k(1),
    '4.3': k(2, 'Intimpflege benötigt vollständige Anleitung.'),
    '4.4': k(2),
    '4.5': k(1),
    '4.6': k(1),
    '4.7': k(0),
    '4.8': k(1), // ×3 = 3
    '4.9': k(0), // ×2 = 0
    '4.10': k(1, 'Begleitung zur Toilette in der Nacht erforderlich.'), // ×2 = 2
    '4.11': k(0),
    '4.12': k(0),
    '4.13': k(0),

    // Modul 5 — Krankheits-/therapiebedingte Anforderungen (Summe 5 → SG 3 → 15 gew. P.)
    '5.1': {
      wert: 4,
      kommentar: 'Drei orale Medikamente morgens, eines abends. Stellen erfolgt durch Tochter.',
      frequenz: { tag: 4 },
    },
    '5.16': {
      wert: 1,
      kommentar: 'Salzarme Diät bei Hypertonie.',
      frequenz: { jaNein: true },
    },

    // Modul 6 — Gestaltung des Alltagslebens und sozialer Kontakte (Summe 4 → SG 2 → 7,5 gew. P.)
    '6.1': k(1),
    '6.2': k(1, 'Nächtliches Aufwachen 1–2× pro Nacht.'),
    '6.3': k(1),
    '6.4': k(1),
    '6.5': k(0),
    '6.6': k(0),
  };

  return {
    id,
    schemaVersion: SCHEMA_VERSION,
    createdAt: jetztIso,
    updatedAt: jetztIso,
    stammdaten: {
      person: { name: 'Erika Musterfrau (Beispiel)', geburtsdatum: '1942-03-15' },
      gutachter: { name: 'Anna Beispielmann' },
      termin: { datum: '2026-04-20', ort: 'Berlin' },
      versicherung: { traeger: 'AOK Nordost', aktenzeichen: 'AZ-12345-2026' },
    },
    bewertungen,
  };
}
