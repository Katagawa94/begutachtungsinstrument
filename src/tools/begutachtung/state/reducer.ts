import type { Bewertung } from '../domain/types';
import type { Begutachtung, Stammdaten } from './schema';
import { SCHEMA_VERSION, neueBegutachtung } from './schema';

export type State = {
  begutachtungen: Begutachtung[];
};

export type Action =
  | { type: 'erstellen'; id: string; jetzt: string }
  | { type: 'loeschen'; id: string }
  | { type: 'duplizieren'; id: string; neueId: string; jetzt: string }
  | { type: 'stammdatenAktualisieren'; id: string; stammdaten: Stammdaten; jetzt: string }
  | { type: 'bewertungSetzen'; id: string; kriteriumId: string; bewertung: Partial<Bewertung>; jetzt: string }
  | { type: 'importieren'; begutachtungen: Begutachtung[]; jetzt: string; modus: 'ersetzen' | 'ergaenzen' }
  | { type: 'alleSetzen'; begutachtungen: Begutachtung[] };

function patchBegutachtung(
  state: State,
  id: string,
  jetzt: string,
  patch: (b: Begutachtung) => Begutachtung,
): State {
  return {
    ...state,
    begutachtungen: state.begutachtungen.map((b) =>
      b.id === id ? { ...patch(b), updatedAt: jetzt } : b,
    ),
  };
}

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'erstellen':
      return {
        ...state,
        begutachtungen: [neueBegutachtung(action.id, action.jetzt), ...state.begutachtungen],
      };

    case 'loeschen':
      return {
        ...state,
        begutachtungen: state.begutachtungen.filter((b) => b.id !== action.id),
      };

    case 'duplizieren': {
      const original = state.begutachtungen.find((b) => b.id === action.id);
      if (!original) return state;
      const kopie: Begutachtung = {
        ...structuredClone(original),
        id: action.neueId,
        createdAt: action.jetzt,
        updatedAt: action.jetzt,
        schemaVersion: SCHEMA_VERSION,
      };
      return {
        ...state,
        begutachtungen: [kopie, ...state.begutachtungen],
      };
    }

    case 'stammdatenAktualisieren':
      return patchBegutachtung(state, action.id, action.jetzt, (b) => ({
        ...b,
        stammdaten: action.stammdaten,
      }));

    case 'bewertungSetzen':
      return patchBegutachtung(state, action.id, action.jetzt, (b) => {
        const aktuell = b.bewertungen[action.kriteriumId] ?? { wert: null, kommentar: '' };
        const neuWert = action.bewertung.wert !== undefined ? action.bewertung.wert : aktuell.wert;
        const neuKommentar =
          action.bewertung.kommentar !== undefined ? action.bewertung.kommentar : aktuell.kommentar;
        const neuFrequenz =
          'frequenz' in action.bewertung ? action.bewertung.frequenz : aktuell.frequenz;
        const frequenzLeer =
          !neuFrequenz ||
          (neuFrequenz.jaNein !== true &&
            neuFrequenz.tag === undefined &&
            neuFrequenz.woche === undefined &&
            neuFrequenz.monat === undefined);
        if (neuWert === null && neuKommentar === '' && frequenzLeer) {
          const { [action.kriteriumId]: _entfernt, ...rest } = b.bewertungen;
          void _entfernt;
          return { ...b, bewertungen: rest };
        }
        const naechste: Bewertung = { wert: neuWert, kommentar: neuKommentar };
        if (!frequenzLeer && neuFrequenz) naechste.frequenz = neuFrequenz;
        return {
          ...b,
          bewertungen: {
            ...b.bewertungen,
            [action.kriteriumId]: naechste,
          },
        };
      });

    case 'importieren': {
      if (action.modus === 'ersetzen') {
        return { ...state, begutachtungen: action.begutachtungen };
      }
      const bestehendIds = new Set(state.begutachtungen.map((b) => b.id));
      const neueIds = action.begutachtungen.filter((b) => !bestehendIds.has(b.id));
      return {
        ...state,
        begutachtungen: [...neueIds, ...state.begutachtungen],
      };
    }

    case 'alleSetzen':
      return { ...state, begutachtungen: action.begutachtungen };
  }
}
