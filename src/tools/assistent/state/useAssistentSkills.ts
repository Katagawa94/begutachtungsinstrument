import { useContext } from 'react';
import { AssistentSkillsContext } from './AssistentSkillsContext';
import type { AssistentSkillsContextValue } from './AssistentSkillsContext';

export function useAssistentSkills(): AssistentSkillsContextValue {
  const ctx = useContext(AssistentSkillsContext);
  if (!ctx) {
    throw new Error('useAssistentSkills muss innerhalb von <AssistentSkillsProvider> verwendet werden');
  }
  return ctx;
}
