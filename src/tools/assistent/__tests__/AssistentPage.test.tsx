import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import type { LlmStatus } from '../llm/webllmRuntime';

vi.mock('../llm/webllmRuntime', () => ({
  webgpuVerfuegbar: () => true,
  modellVorbereiten: vi.fn(async (modellId: string, onStatus?: (s: LlmStatus) => void) => {
    onStatus?.({ phase: 'bereit', modellId });
  }),
  generiere: vi.fn(
    async (
      modellId: string,
      _nachrichten: unknown,
      _params: unknown,
      onToken: (delta: string, voll: string) => void,
      _signal?: AbortSignal,
      onStatus?: (s: LlmStatus) => void,
    ) => {
      const text = '# Modellausgabe\n\nHallo Welt aus dem Modell.';
      onToken(text, text);
      onStatus?.({ phase: 'bereit', modellId });
      return text;
    },
  ),
}));

import { AssistentPage } from '../AssistentPage';
import { AssistentSkillsProvider } from '../state/AssistentSkillsProvider';

function renderPage() {
  return render(
    <AssistentSkillsProvider>
      <MemoryRouter>
        <AssistentPage />
      </MemoryRouter>
    </AssistentSkillsProvider>,
  );
}

describe('AssistentPage', () => {
  it('zeigt Titel, Hinweis und die Schritte', () => {
    renderPage();
    expect(screen.getByRole('heading', { name: 'Textassistent', level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/verlassen den Browser nicht/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /1\. Modell/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /2\. Skill/i })).toBeInTheDocument();
  });

  it('lädt ein Modell, generiert Text und zeigt ihn an + Vorschau', async () => {
    renderPage();

    // Modell laden -> "bereit"
    await userEvent.click(screen.getByRole('button', { name: /Modell laden/i }));
    expect(await screen.findByText(/bereit/i)).toBeInTheDocument();

    // Eingabe + Generieren
    await userEvent.type(screen.getByLabelText(/Eingabe \/ Stichpunkte/i), 'ein paar Stichpunkte');
    await userEvent.click(screen.getByRole('button', { name: /^Generieren$/i }));

    // Generierter Text steht im bearbeitbaren Roh-Feld
    expect(await screen.findByDisplayValue(/Hallo Welt aus dem Modell/)).toBeInTheDocument();

    // Vorschau-Tab rendert das Markdown
    await userEvent.click(screen.getByRole('tab', { name: /Vorschau/i }));
    expect(screen.getByRole('heading', { name: /Modellausgabe/i })).toBeInTheDocument();
  });

  it('legt einen neuen Skill an und öffnet den Editor', async () => {
    renderPage();
    await userEvent.click(screen.getByRole('button', { name: /^Neu$/i }));
    expect(screen.getByRole('dialog', { name: /Skill bearbeiten/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/System-Prompt/i)).toBeInTheDocument();
  });
});
