export type Ersetzungsregel = {
  id: string;
  /** Gesuchter Text (literal — wird beim Anwenden Regex-escaped). */
  suchen: string;
  /** Ersatztext (literal). */
  ersetzen: string;
  /** true = Groß-/Kleinschreibung wird beachtet. */
  caseSensitive: boolean;
  /** true = Teilstring-Treffer erlaubt; false = nur ganze Wörter (mit Unicode-Wortgrenzen). */
  teilwort: boolean;
};

export type AnonymisierungsErgebnis = {
  ergebnis: string;
  /** Anzahl der Ersetzungen je Regel-ID. */
  anzahlProRegel: Record<string, number>;
  gesamtAnzahl: number;
};

const REGEX_SONDERZEICHEN = /[.*+?^${}()|[\]\\]/g;

export function escapeRegex(s: string): string {
  return s.replace(REGEX_SONDERZEICHEN, '\\$&');
}

/** Zeichenklasse, die als "Wortzeichen" gilt — Unicode-Buchstaben/-Ziffern und Unterstrich. */
const WORTZEICHEN = '[\\p{L}\\p{N}_]';

function buildRegex(regel: Ersetzungsregel): RegExp | null {
  if (!regel.suchen) return null;
  const kern = escapeRegex(regel.suchen);
  const pattern = regel.teilwort
    ? kern
    : `(?<!${WORTZEICHEN})${kern}(?!${WORTZEICHEN})`;
  const flags = `gu${regel.caseSensitive ? '' : 'i'}`;
  try {
    return new RegExp(pattern, flags);
  } catch {
    return null;
  }
}

/**
 * Wendet die Regeln in der gegebenen Reihenfolge auf den Text an. Jede Regel
 * arbeitet auf dem Ergebnis der vorherigen. Liefert den anonymisierten Text
 * sowie die Anzahl der Ersetzungen je Regel.
 */
export function anwendenRegeln(
  text: string,
  regeln: readonly Ersetzungsregel[],
): AnonymisierungsErgebnis {
  let aktuell = text;
  const anzahlProRegel: Record<string, number> = {};
  let gesamtAnzahl = 0;

  for (const regel of regeln) {
    const re = buildRegex(regel);
    if (!re) {
      anzahlProRegel[regel.id] = 0;
      continue;
    }
    let n = 0;
    aktuell = aktuell.replace(re, () => {
      n += 1;
      return regel.ersetzen;
    });
    anzahlProRegel[regel.id] = n;
    gesamtAnzahl += n;
  }

  return { ergebnis: aktuell, anzahlProRegel, gesamtAnzahl };
}

let regelZaehler = 0;
export function neueRegel(partial?: Partial<Ersetzungsregel>): Ersetzungsregel {
  regelZaehler += 1;
  const id =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `regel-${Date.now().toString(36)}-${regelZaehler}`;
  return {
    id,
    suchen: '',
    ersetzen: '',
    caseSensitive: false,
    teilwort: false,
    ...partial,
  };
}
