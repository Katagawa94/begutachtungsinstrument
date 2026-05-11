import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../markitdown/pyodideRuntime', () => ({
  konvertiereZuMarkdown: vi.fn(async () => '# Befund\n\nFrau Müller wohnt in der Müllerstraße.'),
  runtimeVorbereiten: vi.fn(),
}));

import { AnonymisierungPage } from '../AnonymisierungPage';

function renderPage() {
  return render(
    <MemoryRouter>
      <AnonymisierungPage />
    </MemoryRouter>,
  );
}

describe('AnonymisierungPage', () => {
  it('zeigt Titel, Datenschutzhinweis und Leerzustand', () => {
    renderPage();
    expect(screen.getByRole('heading', { name: 'Anonymisierung', level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/verlässt den Browser nicht/i)).toBeInTheDocument();
    expect(screen.getByText(/Lade eine Datei/i)).toBeInTheDocument();
  });

  it('konvertiert eine Datei, wendet eine Regel an und zählt die Ersetzungen', async () => {
    const { container } = renderPage();
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    await userEvent.upload(input, new File(['x'], 'akte.docx'));

    // Konvertierter Markdown taucht im Roh-Textfeld auf
    expect(await screen.findByDisplayValue(/Frau Müller wohnt in der Müllerstraße/)).toBeInTheDocument();

    // Regel hinzufügen und ausfüllen: "Müller" -> "Person A" (ganzes Wort)
    await userEvent.click(screen.getByRole('button', { name: /Regel hinzufügen/i }));
    await userEvent.type(screen.getByLabelText(/Suchen #1/i), 'Müller');
    await userEvent.type(screen.getByLabelText(/Ersetzen durch/i), 'Person A');

    // Genau eine Ersetzung (Müllerstraße bleibt, da kein Teilwort)
    expect(screen.getByText('1 Ersetzung')).toBeInTheDocument();
    expect(
      screen.getByDisplayValue(/Frau Person A wohnt in der Müllerstraße/),
    ).toBeInTheDocument();

    // Teilwort aktivieren -> jetzt zwei Treffer
    await userEvent.click(screen.getByRole('checkbox', { name: /Teilwort/i }));
    expect(screen.getByText('2 Ersetzungen')).toBeInTheDocument();
    expect(
      screen.getByDisplayValue(/Frau Person A wohnt in der Person Astraße/),
    ).toBeInTheDocument();
  });
});
