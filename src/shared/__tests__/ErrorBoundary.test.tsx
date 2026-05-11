import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from '../ErrorBoundary';

function Boom({ message }: { message: string }): never {
  throw new Error(message);
}

describe('ErrorBoundary', () => {
  let consoleError: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    consoleError.mockRestore();
  });

  it('rendert die Kinder, wenn kein Fehler auftritt', () => {
    render(
      <ErrorBoundary>
        <div>alles gut</div>
      </ErrorBoundary>,
    );
    expect(screen.getByText('alles gut')).toBeInTheDocument();
  });

  it('zeigt den Fallback mit Fehlermeldung und Reload-Button bei einem Fehler', () => {
    render(
      <ErrorBoundary>
        <Boom message="Kaputt im Detail" />
      </ErrorBoundary>,
    );
    expect(screen.getByText(/Etwas ist schiefgelaufen/i)).toBeInTheDocument();
    expect(screen.getByText('Kaputt im Detail')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Seite neu laden/i })).toBeInTheDocument();
  });

  it('erkennt Chunk-Lade-Fehler und zeigt einen Update-Hinweis statt der Roh-Meldung', () => {
    render(
      <ErrorBoundary>
        <Boom message="Failed to fetch dynamically imported module: /assets/x.js" />
      </ErrorBoundary>,
    );
    expect(screen.getByText(/wurde wahrscheinlich gerade aktualisiert/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/Failed to fetch dynamically imported module/i),
    ).not.toBeInTheDocument();
  });
});
