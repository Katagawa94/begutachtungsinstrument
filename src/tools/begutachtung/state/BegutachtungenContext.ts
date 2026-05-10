import { createContext } from 'react';
import type { Bewertung } from '../domain/types';
import type { Begutachtung, Stammdaten } from './schema';

export type BegutachtungenContextValue = {
  begutachtungen: Begutachtung[];
  finden: (id: string) => Begutachtung | undefined;
  erstellen: () => string;
  erstelleBeispiel: () => string;
  duplizieren: (id: string) => string | null;
  loeschen: (id: string) => void;
  stammdatenAktualisieren: (id: string, stammdaten: Stammdaten) => void;
  bewertungSetzen: (id: string, kriteriumId: string, bewertung: Partial<Bewertung>) => void;
  importieren: (begutachtungen: Begutachtung[], modus: 'ersetzen' | 'ergaenzen') => void;
};

export const BegutachtungenContext = createContext<BegutachtungenContextValue | undefined>(
  undefined,
);
