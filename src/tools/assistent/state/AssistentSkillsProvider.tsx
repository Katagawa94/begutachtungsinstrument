import { useCallback, useEffect, useMemo, useReducer, useRef, type ReactNode } from 'react';
import { PRESET_SKILLS, istPreset, neueSkill } from '../domain/skills';
import type { Skill } from '../domain/skills';
import { AssistentSkillsContext } from './AssistentSkillsContext';
import type { AssistentSkillsContextValue } from './AssistentSkillsContext';
import { reducer } from './reducer';
import { ladeAusStorage, speichereInStorage } from './storage';

function neueId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `skill-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function AssistentSkillsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, () => ({
    skills: ladeAusStorage(),
  }));

  const erstesRender = useRef(true);
  useEffect(() => {
    if (erstesRender.current) {
      erstesRender.current = false;
      return;
    }
    speichereInStorage(state.skills);
  }, [state.skills]);

  const alleSkills = useMemo(() => [...PRESET_SKILLS, ...state.skills], [state.skills]);
  const finden = useCallback((id: string) => alleSkills.find((s) => s.id === id), [alleSkills]);

  const erstellen = useCallback(() => {
    const skill = neueSkill({ id: neueId() });
    dispatch({ type: 'hinzufuegen', skill });
    return skill;
  }, []);

  const duplizieren = useCallback(
    (id: string) => {
      const vorlage = alleSkills.find((s) => s.id === id);
      if (!vorlage) return null;
      const kopie: Skill = {
        ...structuredClone(vorlage),
        id: neueId(),
        name: `${vorlage.name} (Kopie)`,
      };
      dispatch({ type: 'hinzufuegen', skill: kopie });
      return kopie;
    },
    [alleSkills],
  );

  const aktualisieren = useCallback((skill: Skill) => {
    dispatch({ type: 'aktualisieren', skill });
  }, []);

  const loeschen = useCallback((id: string) => {
    dispatch({ type: 'loeschen', id });
  }, []);

  const importieren = useCallback((skills: Skill[], modus: 'ersetzen' | 'ergaenzen') => {
    dispatch({ type: 'importieren', skills, modus });
  }, []);

  const value = useMemo<AssistentSkillsContextValue>(
    () => ({
      presets: PRESET_SKILLS,
      eigeneSkills: state.skills,
      alleSkills,
      finden,
      istPreset,
      erstellen,
      duplizieren,
      aktualisieren,
      loeschen,
      importieren,
    }),
    [state.skills, alleSkills, finden, erstellen, duplizieren, aktualisieren, loeschen, importieren],
  );

  return (
    <AssistentSkillsContext.Provider value={value}>{children}</AssistentSkillsContext.Provider>
  );
}
