import { createContext } from 'react';
import type { Skill } from '../domain/skills';

export type AssistentSkillsContextValue = {
  /** Mitgelieferte, schreibgeschützte Vorlagen. */
  presets: readonly Skill[];
  /** Vom Nutzer angelegte, gespeicherte Skills. */
  eigeneSkills: Skill[];
  /** presets + eigeneSkills. */
  alleSkills: Skill[];
  finden: (id: string) => Skill | undefined;
  istPreset: (id: string) => boolean;
  /** Legt einen neuen leeren Skill an und liefert ihn. */
  erstellen: () => Skill;
  /** Dupliziert einen beliebigen Skill (auch ein Preset) als editierbare Kopie und liefert sie. */
  duplizieren: (id: string) => Skill | null;
  /** Aktualisiert einen eigenen Skill. */
  aktualisieren: (skill: Skill) => void;
  loeschen: (id: string) => void;
  importieren: (skills: Skill[], modus: 'ersetzen' | 'ergaenzen') => void;
};

export const AssistentSkillsContext = createContext<AssistentSkillsContextValue | undefined>(
  undefined,
);
