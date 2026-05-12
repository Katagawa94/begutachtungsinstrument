import type { MLCEngineInterface } from '@mlc-ai/web-llm';

export type ChatNachricht = { role: 'system' | 'user' | 'assistant'; content: string };

export type LlmStatus =
  | { phase: 'idle' }
  | { phase: 'laden'; text: string; fortschritt?: number }
  | { phase: 'bereit'; modellId: string }
  | { phase: 'generiert' }
  | { phase: 'fehler'; fehler: string };

export type StatusCallback = (status: LlmStatus) => void;

let enginePromise: Promise<MLCEngineInterface> | null = null;
let geladenesModell: string | null = null;

export function webgpuVerfuegbar(): boolean {
  return typeof navigator !== 'undefined' && 'gpu' in navigator;
}

async function ladeEngine(
  modellId: string,
  onStatus?: StatusCallback,
): Promise<MLCEngineInterface> {
  if (enginePromise && geladenesModell === modellId) return enginePromise;

  // Modellwechsel: alte Engine entladen, Cache neu setzen.
  if (enginePromise) {
    const alt = enginePromise;
    enginePromise = null;
    geladenesModell = null;
    void alt
      .then((e) => e.unload())
      .catch(() => {
        /* ignore */
      });
  }

  if (!webgpuVerfuegbar()) {
    throw new Error(
      'Dieser Browser unterstützt WebGPU nicht. Bitte ein aktuelles Chrome/Edge (oder Safari 18+) verwenden.',
    );
  }

  geladenesModell = modellId;
  enginePromise = (async () => {
    onStatus?.({ phase: 'laden', text: 'Modell wird vorbereitet …', fortschritt: 0 });
    const { CreateMLCEngine } = await import('@mlc-ai/web-llm');
    const engine = await CreateMLCEngine(modellId, {
      initProgressCallback: (bericht) => {
        onStatus?.({
          phase: 'laden',
          text: bericht.text || 'Modell wird geladen …',
          fortschritt: typeof bericht.progress === 'number' ? bericht.progress : undefined,
        });
      },
    });
    onStatus?.({ phase: 'bereit', modellId });
    return engine;
  })();
  enginePromise.catch(() => {
    enginePromise = null;
    geladenesModell = null;
  });
  return enginePromise;
}

/** Stößt das Laden eines Modells an (z. B. nach Klick auf „Modell laden"). */
export async function modellVorbereiten(modellId: string, onStatus?: StatusCallback): Promise<void> {
  await ladeEngine(modellId, onStatus).then(
    () => undefined,
    (e: unknown) => {
      const fehler = e instanceof Error ? e.message : String(e);
      onStatus?.({ phase: 'fehler', fehler });
      throw e instanceof Error ? e : new Error(fehler);
    },
  );
}

/** True, wenn das angegebene Modell aktuell geladen und bereit ist. */
export function modellBereit(modellId: string): boolean {
  return enginePromise !== null && geladenesModell === modellId;
}

export type GenerierParameter = { temperature: number; maxTokens: number };

/**
 * Erzeugt eine Antwort als Stream. `onToken` wird für jedes Delta mit dem
 * Delta-Text und dem bisher gesammelten Volltext aufgerufen. Über `signal`
 * lässt sich die Generierung abbrechen. Gibt den (ggf. abgebrochenen) Volltext
 * zurück.
 */
export async function generiere(
  modellId: string,
  nachrichten: ChatNachricht[],
  parameter: GenerierParameter,
  onToken: (delta: string, vollText: string) => void,
  signal?: AbortSignal,
  onStatus?: StatusCallback,
): Promise<string> {
  const engine = await ladeEngine(modellId, onStatus);
  onStatus?.({ phase: 'generiert' });
  let voll = '';
  try {
    const stream = await engine.chat.completions.create({
      messages: nachrichten,
      temperature: parameter.temperature,
      max_tokens: parameter.maxTokens,
      stream: true,
    });
    for await (const chunk of stream) {
      if (signal?.aborted) {
        await engine.interruptGenerate();
        break;
      }
      const delta = chunk.choices[0]?.delta?.content ?? '';
      if (delta) {
        voll += delta;
        onToken(delta, voll);
      }
    }
  } finally {
    onStatus?.({ phase: 'bereit', modellId });
  }
  return voll;
}
