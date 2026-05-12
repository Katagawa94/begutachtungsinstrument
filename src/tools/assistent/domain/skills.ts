import type { ChatNachricht } from '../llm/webllmRuntime';

export const ASSISTENT_SCHEMA_VERSION = 1;

export type SkillBeispiel = { eingabe: string; ausgabe: string };

export type Skill = {
  id: string;
  name: string;
  beschreibung: string;
  /** Anweisungen + Struktur-Vorgaben für den Markdown-Output. */
  systemPrompt: string;
  /** Optionale Markdown-Vorlage, die als Gerüst dienen soll (leer = keine). */
  vorlage: string;
  /** Optionale few-shot Paare (Beispiel-Eingabe → Beispiel-Ausgabe). */
  beispiele: SkillBeispiel[];
  /** 0..1.5 */
  temperature: number;
  /** Maximale Antwortlänge in Tokens. */
  maxTokens: number;
};

const VORLAGE_HINWEIS = '\n\nVerwende exakt diese Markdown-Struktur als Gerüst:\n\n';

let zaehler = 0;
function neueId(): string {
  zaehler += 1;
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `skill-${Date.now().toString(36)}-${zaehler}`;
}

export function neueSkill(partial?: Partial<Skill>): Skill {
  return {
    id: neueId(),
    name: 'Neuer Skill',
    beschreibung: '',
    systemPrompt:
      'Du bist ein Assistent für Pflegesachverständige. Formuliere aus den gegebenen Stichpunkten einen sachlichen Text in deutscher Sprache als Markdown. Erfinde keine Fakten; verwende nur die gegebenen Angaben.',
    vorlage: '',
    beispiele: [],
    temperature: 0.4,
    maxTokens: 800,
    ...partial,
  };
}

/**
 * Mitgelieferte, schreibgeschützte Vorlagen. "Duplizieren" erzeugt eine
 * editierbare Kopie in den eigenen (gespeicherten) Skills.
 */
export const PRESET_SKILLS: readonly Skill[] = [
  {
    id: 'preset-kurzbericht',
    name: 'Kurzbericht aus Stichpunkten',
    beschreibung: 'Aus Stichpunkten einen gegliederten, sachlichen Kurzbericht formulieren.',
    systemPrompt:
      'Du bist ein Assistent für Pflegesachverständige. Formuliere aus den gegebenen Stichpunkten einen sachlichen, neutralen Kurzbericht in deutscher Sprache als Markdown. Nutze Überschriften (##), kurze Absätze und bei Aufzählungen Listen. Erfinde keine Fakten; verwende ausschließlich die gegebenen Angaben.',
    vorlage: '## Sachverhalt\n\n## Einschätzung\n\n## Empfehlung\n',
    beispiele: [],
    temperature: 0.4,
    maxTokens: 900,
  },
  {
    id: 'preset-anschreiben',
    name: 'Förmliches Anschreiben',
    beschreibung: 'Ein höfliches, sachliches Anschreiben aus Eckdaten und Anliegen erzeugen.',
    systemPrompt:
      'Du bist ein Assistent für Pflegesachverständige. Erstelle aus den gegebenen Eckdaten ein höfliches, förmliches Anschreiben in deutscher Sprache als Markdown. Halte dich an die genannten Angaben, erfinde nichts. Beginne mit einer passenden Anrede und schließe mit einer Grußformel.',
    vorlage:
      'Sehr geehrte Damen und Herren,\n\n[Anliegen]\n\nMit freundlichen Grüßen\n[Name]\n',
    beispiele: [],
    temperature: 0.5,
    maxTokens: 700,
  },
  {
    id: 'preset-stellungnahme',
    name: 'Stellungnahme / Widerspruch',
    beschreibung: 'Eine begründete Stellungnahme bzw. einen Widerspruch strukturiert ausformulieren.',
    systemPrompt:
      'Du bist ein Assistent für Pflegesachverständige. Formuliere aus den gegebenen Punkten eine sachliche, begründete Stellungnahme (ggf. einen Widerspruch) in deutscher Sprache als Markdown. Gliedere in: Anlass, Begründung (mit Bezug auf die genannten Punkte), Fazit. Erfinde keine Fakten.',
    vorlage: '## Anlass\n\n## Begründung\n\n## Fazit\n',
    beispiele: [],
    temperature: 0.4,
    maxTokens: 1100,
  },
];

const PRESET_IDS = new Set(PRESET_SKILLS.map((s) => s.id));

export function istPreset(id: string): boolean {
  return PRESET_IDS.has(id);
}

/**
 * Setzt die Chat-Nachrichten für die Generierung zusammen: System-Prompt
 * (plus Vorlage als Gerüst-Hinweis), anschließend die few-shot Paare als
 * abwechselnde user/assistant-Nachrichten, dann die aktuelle Eingabe.
 */
export function baueNachrichten(skill: Skill, eingabe: string): ChatNachricht[] {
  const systemInhalt = skill.vorlage.trim()
    ? skill.systemPrompt + VORLAGE_HINWEIS + skill.vorlage.trim()
    : skill.systemPrompt;
  const nachrichten: ChatNachricht[] = [{ role: 'system', content: systemInhalt }];
  for (const beispiel of skill.beispiele) {
    if (!beispiel.eingabe.trim() && !beispiel.ausgabe.trim()) continue;
    nachrichten.push({ role: 'user', content: beispiel.eingabe });
    nachrichten.push({ role: 'assistant', content: beispiel.ausgabe });
  }
  nachrichten.push({ role: 'user', content: eingabe });
  return nachrichten;
}
