const RELOAD_FLAG_KEY = 'psv-hub:chunk-reload-at';
const RELOAD_COOLDOWN_MS = 10_000;

/**
 * Erkennt Fehler, die typischerweise nach einem Deploy entstehen: die
 * gecachte index.html verweist auf Chunk-Dateien mit alten Hashes, die auf
 * dem Server nicht mehr existieren. In diesem Fall lädt ein einmaliger Reload
 * die frische index.html mit den korrekten Chunk-Namen.
 */
export function installChunkReloadHandler(): void {
  if (typeof window === 'undefined') return;

  // Vite feuert dieses Event, wenn ein dynamisch importiertes Modul nicht
  // geladen werden konnte (siehe https://vite.dev/guide/build#load-error-handling).
  window.addEventListener('vite:preloadError', () => {
    reloadOnce();
  });

  // Fängt zusätzlich nicht abgefangene Promise-Rejections ab, deren Meldung
  // auf ein fehlgeschlagenes Modul-Fetch hindeutet (Browser-übergreifend).
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const message =
      reason instanceof Error ? reason.message : typeof reason === 'string' ? reason : '';
    if (sieht_nach_chunk_fehler_aus(message)) {
      reloadOnce();
    }
  });
}

export function sieht_nach_chunk_fehler_aus(message: string): boolean {
  return (
    /failed to fetch dynamically imported module/i.test(message) ||
    /error loading dynamically imported module/i.test(message) ||
    /importing a module script failed/i.test(message)
  );
}

function reloadOnce(): void {
  let last = 0;
  try {
    last = Number(sessionStorage.getItem(RELOAD_FLAG_KEY) ?? 0);
  } catch {
    /* sessionStorage nicht verfügbar — dann eben ohne Cooldown */
  }
  if (Date.now() - last < RELOAD_COOLDOWN_MS) {
    // Wir haben vor Kurzem schon neu geladen — Endlosschleife vermeiden.
    return;
  }
  try {
    sessionStorage.setItem(RELOAD_FLAG_KEY, String(Date.now()));
  } catch {
    /* ignore */
  }
  window.location.reload();
}
