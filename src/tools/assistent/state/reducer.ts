import type { Skill } from '../domain/skills';

export type State = { skills: Skill[] };

export type Action =
  | { type: 'hinzufuegen'; skill: Skill }
  | { type: 'loeschen'; id: string }
  | { type: 'aktualisieren'; skill: Skill }
  | { type: 'importieren'; skills: Skill[]; modus: 'ersetzen' | 'ergaenzen' }
  | { type: 'alleSetzen'; skills: Skill[] };

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'hinzufuegen':
      return { skills: [action.skill, ...state.skills] };

    case 'loeschen':
      return { skills: state.skills.filter((s) => s.id !== action.id) };

    case 'aktualisieren':
      return {
        skills: state.skills.map((s) => (s.id === action.skill.id ? action.skill : s)),
      };

    case 'importieren': {
      if (action.modus === 'ersetzen') return { skills: action.skills };
      const vorhanden = new Set(state.skills.map((s) => s.id));
      const neue = action.skills.filter((s) => !vorhanden.has(s.id));
      return { skills: [...neue, ...state.skills] };
    }

    case 'alleSetzen':
      return { skills: action.skills };
  }
}
