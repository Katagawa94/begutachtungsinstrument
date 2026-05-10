import { MODULE } from './domain/modules';
import type { ModulId } from './domain/types';

export type StepKind = 'stammdaten' | 'modul' | 'abschluss';

export type Step =
  | { kind: 'stammdaten'; pfad: string; label: string; kurzlabel: string }
  | { kind: 'modul'; pfad: string; label: string; kurzlabel: string; modulId: ModulId }
  | { kind: 'abschluss'; pfad: string; label: string; kurzlabel: string };

export function buildSteps(begutachtungId: string): Step[] {
  const basis = `/begutachtung/${begutachtungId}`;
  const modulSteps: Step[] = MODULE.map((m) => ({
    kind: 'modul',
    pfad: `${basis}/modul/${m.id}`,
    label: `Modul ${m.id}: ${m.name}`,
    kurzlabel: `M${m.id}`,
    modulId: m.id,
  }));
  return [
    { kind: 'stammdaten', pfad: `${basis}/stammdaten`, label: 'Stammdaten', kurzlabel: 'Stamm' },
    ...modulSteps,
    { kind: 'abschluss', pfad: `${basis}/abschluss`, label: 'Abschluss', kurzlabel: 'Ende' },
  ];
}

export function findActiveStepIndex(steps: Step[], pathname: string): number {
  // Längster passender Präfix gewinnt — sonst trifft "stammdaten" bei "/abschluss" nichts.
  let bestIndex = -1;
  let bestLen = -1;
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    if (!step) continue;
    if (pathname === step.pfad || pathname.startsWith(step.pfad + '/')) {
      if (step.pfad.length > bestLen) {
        bestIndex = i;
        bestLen = step.pfad.length;
      }
    }
  }
  return bestIndex;
}
