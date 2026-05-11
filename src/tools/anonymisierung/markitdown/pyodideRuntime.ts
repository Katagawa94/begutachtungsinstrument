import type { PyodideInterface } from 'pyodide';
import { PYTHON_BOOTSTRAP, PYTHON_ENSURE_PANDAS } from './pythonBootstrap';

export type RuntimeStatus =
  | { phase: 'idle' }
  | { phase: 'laden'; text: string }
  | { phase: 'bereit' }
  | { phase: 'fehler'; fehler: string };

export type StatusCallback = (status: RuntimeStatus) => void;

let runtimePromise: Promise<PyodideInterface> | null = null;
let pandasGeladen = false;

const ENDUNGEN_MIT_PANDAS = new Set(['.xlsx', '.xlsm']);

async function ladeRuntime(onStatus?: StatusCallback): Promise<PyodideInterface> {
  if (runtimePromise) return runtimePromise;
  runtimePromise = (async () => {
    onStatus?.({
      phase: 'laden',
      text: 'Python-Laufzeit wird geladen … (einmalig, kann je nach Verbindung etwas dauern)',
    });
    const { loadPyodide, version } = await import('pyodide');
    const indexURL = `https://cdn.jsdelivr.net/pyodide/v${version}/full/`;
    const pyodide = await loadPyodide({ indexURL });
    onStatus?.({ phase: 'laden', text: 'Bibliotheken werden installiert …' });
    await pyodide.loadPackage('micropip');
    await pyodide.runPythonAsync(PYTHON_BOOTSTRAP);
    onStatus?.({ phase: 'bereit' });
    return pyodide;
  })();
  // Bei Fehlschlag den Cache leeren, damit ein erneuter Versuch möglich ist.
  runtimePromise.catch(() => {
    runtimePromise = null;
  });
  return runtimePromise;
}

function dateiendung(name: string): string {
  const punkt = name.lastIndexOf('.');
  if (punkt <= 0 || punkt === name.length - 1) return '';
  return name.slice(punkt).toLowerCase();
}

function pythonFehlerText(e: unknown): string {
  if (e instanceof Error) {
    // Pyodide-Tracebacks sind lang; die letzte nicht-leere Zeile ist meist die Kernaussage.
    const zeilen = e.message
      .split('\n')
      .map((z) => z.trim())
      .filter(Boolean);
    return zeilen[zeilen.length - 1] ?? e.message;
  }
  return String(e);
}

/**
 * Lädt (falls nötig) Pyodide + MarkItDown und konvertiert die übergebene Datei
 * zu Markdown. Alles passiert lokal im Browser; die Python-Laufzeit kommt von
 * einem öffentlichen CDN, die Datei selbst verlässt den Browser nicht.
 */
export async function konvertiereZuMarkdown(
  file: File,
  onStatus?: StatusCallback,
): Promise<string> {
  const pyodide = await ladeRuntime(onStatus);

  const ext = dateiendung(file.name);
  if (ENDUNGEN_MIT_PANDAS.has(ext) && !pandasGeladen) {
    onStatus?.({ phase: 'laden', text: 'Tabellen-Bibliothek wird nachgeladen …' });
    await pyodide.runPythonAsync(PYTHON_ENSURE_PANDAS);
    pandasGeladen = true;
  }

  onStatus?.({ phase: 'laden', text: `„${file.name}" wird konvertiert …` });
  const bytes = new Uint8Array(await file.arrayBuffer());
  const pfad = `/tmp/upload${ext}`;
  pyodide.FS.writeFile(pfad, bytes);
  let konvertiere: ReturnType<PyodideInterface['globals']['get']> | undefined;
  try {
    konvertiere = pyodide.globals.get('konvertiere');
    const markdown = konvertiere(pfad) as string;
    onStatus?.({ phase: 'bereit' });
    return typeof markdown === 'string' ? markdown : String(markdown ?? '');
  } catch (e) {
    onStatus?.({ phase: 'bereit' });
    throw new Error(`Konvertierung fehlgeschlagen: ${pythonFehlerText(e)}`);
  } finally {
    if (konvertiere && typeof (konvertiere as { destroy?: () => void }).destroy === 'function') {
      (konvertiere as { destroy: () => void }).destroy();
    }
    try {
      pyodide.FS.unlink(pfad);
    } catch {
      /* ignore */
    }
  }
}

/** Stößt das Laden der Laufzeit im Hintergrund an (z. B. beim Öffnen der Seite). */
export function runtimeVorbereiten(onStatus?: StatusCallback): void {
  void ladeRuntime(onStatus).catch(() => {
    /* Fehler werden beim eigentlichen Konvertieren erneut gemeldet */
  });
}
