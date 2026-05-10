import { useContext } from 'react';
import { BegutachtungenContext } from './BegutachtungenContext';
import type { BegutachtungenContextValue } from './BegutachtungenContext';

export function useBegutachtungen(): BegutachtungenContextValue {
  const ctx = useContext(BegutachtungenContext);
  if (!ctx) {
    throw new Error('useBegutachtungen muss innerhalb von <BegutachtungenProvider> verwendet werden');
  }
  return ctx;
}
