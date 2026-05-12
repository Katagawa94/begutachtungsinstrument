export type ModellInfo = {
  /** WebLLM-Modell-ID (model_id aus prebuiltAppConfig). */
  id: string;
  /** Anzeigename. */
  label: string;
  /** Ungefähre Downloadgröße in MB (gerundet). */
  groesseMb: number;
  /** Kurze Einordnung für die UI. */
  beschreibung: string;
};

/**
 * Kuratierte Auswahl kleiner Instruct-Modelle. IDs stammen aus
 * `prebuiltAppConfig.model_list` von `@mlc-ai/web-llm` (q4f16_1-Quantisierung,
 * WebGPU). Bei einem Upgrade des Pakets ggf. gegen die aktuelle Liste prüfen.
 */
export const MODELLE: readonly ModellInfo[] = [
  {
    id: 'Qwen2.5-0.5B-Instruct-q4f16_1-MLC',
    label: 'Qwen2.5 0.5B',
    groesseMb: 400,
    beschreibung: 'Sehr klein und schnell, einfache Entwürfe.',
  },
  {
    id: 'Llama-3.2-1B-Instruct-q4f16_1-MLC',
    label: 'Llama 3.2 1B',
    groesseMb: 700,
    beschreibung: 'Guter Kompromiss aus Tempo und Qualität (Standard).',
  },
  {
    id: 'Qwen2.5-1.5B-Instruct-q4f16_1-MLC',
    label: 'Qwen2.5 1.5B',
    groesseMb: 1100,
    beschreibung: 'Etwas größer, sorgfältigere Formulierungen.',
  },
  {
    id: 'Llama-3.2-3B-Instruct-q4f16_1-MLC',
    label: 'Llama 3.2 3B',
    groesseMb: 1900,
    beschreibung: 'Bestes Ergebnis dieser Auswahl, langsamster Download.',
  },
];

export const DEFAULT_MODELL_ID = 'Llama-3.2-1B-Instruct-q4f16_1-MLC';

export function modellInfo(id: string): ModellInfo | undefined {
  return MODELLE.find((m) => m.id === id);
}

export function modellLabel(id: string): string {
  return modellInfo(id)?.label ?? id;
}
