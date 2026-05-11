import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ThemeModeProvider } from './theme/ThemeModeProvider';
import { AppShell } from './AppShell';

function renderShell() {
  return render(
    <ThemeModeProvider>
      <MemoryRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<div>Inhalt</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </ThemeModeProvider>,
  );
}

describe('AppShell', () => {
  it('bietet einen Skip-Link zum Hauptinhalt', () => {
    renderShell();
    const link = screen.getByRole('link', { name: /Zum Hauptinhalt springen/i });
    expect(link).toHaveAttribute('href', '#hauptinhalt');
  });

  it('rendert den Hauptinhalt als <main> mit passender ID', () => {
    renderShell();
    const main = screen.getByRole('main');
    expect(main).toHaveAttribute('id', 'hauptinhalt');
    expect(main).toHaveTextContent('Inhalt');
  });

  it('hat einen beschrifteten Theme-Umschalter', () => {
    renderShell();
    expect(
      screen.getByRole('button', { name: /Design wechseln/i }),
    ).toBeInTheDocument();
  });
});
