import { useCallback, useEffect, useMemo, useReducer, useRef, type ReactNode } from 'react';
import type { Bewertung } from '../domain/types';
import { BegutachtungenContext } from './BegutachtungenContext';
import type { BegutachtungenContextValue } from './BegutachtungenContext';
import { reducer } from './reducer';
import type { Stammdaten, Begutachtung } from './schema';
import { ladeAusStorage, speichereInStorage } from './storage';

function neueId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function jetztIso(): string {
  return new Date().toISOString();
}

export function BegutachtungenProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, () => ({
    begutachtungen: ladeAusStorage(),
  }));

  const erstesRender = useRef(true);
  useEffect(() => {
    if (erstesRender.current) {
      erstesRender.current = false;
      return;
    }
    speichereInStorage(state.begutachtungen);
  }, [state.begutachtungen]);

  const finden = useCallback(
    (id: string) => state.begutachtungen.find((b) => b.id === id),
    [state.begutachtungen],
  );

  const erstellen = useCallback(() => {
    const id = neueId();
    dispatch({ type: 'erstellen', id, jetzt: jetztIso() });
    return id;
  }, []);

  const duplizieren = useCallback(
    (id: string) => {
      const original = state.begutachtungen.find((b) => b.id === id);
      if (!original) return null;
      const neueIdValue = neueId();
      dispatch({ type: 'duplizieren', id, neueId: neueIdValue, jetzt: jetztIso() });
      return neueIdValue;
    },
    [state.begutachtungen],
  );

  const loeschen = useCallback((id: string) => {
    dispatch({ type: 'loeschen', id });
  }, []);

  const stammdatenAktualisieren = useCallback((id: string, stammdaten: Stammdaten) => {
    dispatch({ type: 'stammdatenAktualisieren', id, stammdaten, jetzt: jetztIso() });
  }, []);

  const bewertungSetzen = useCallback(
    (id: string, kriteriumId: string, bewertung: Partial<Bewertung>) => {
      dispatch({ type: 'bewertungSetzen', id, kriteriumId, bewertung, jetzt: jetztIso() });
    },
    [],
  );

  const importieren = useCallback(
    (begutachtungen: Begutachtung[], modus: 'ersetzen' | 'ergaenzen') => {
      dispatch({ type: 'importieren', begutachtungen, jetzt: jetztIso(), modus });
    },
    [],
  );

  const value = useMemo<BegutachtungenContextValue>(
    () => ({
      begutachtungen: state.begutachtungen,
      finden,
      erstellen,
      duplizieren,
      loeschen,
      stammdatenAktualisieren,
      bewertungSetzen,
      importieren,
    }),
    [
      state.begutachtungen,
      finden,
      erstellen,
      duplizieren,
      loeschen,
      stammdatenAktualisieren,
      bewertungSetzen,
      importieren,
    ],
  );

  return (
    <BegutachtungenContext.Provider value={value}>{children}</BegutachtungenContext.Provider>
  );
}
