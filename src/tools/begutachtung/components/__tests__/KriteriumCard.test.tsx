import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { KriteriumCard } from '../KriteriumCard';
import { getKriterium } from '../../domain/modules';

describe('KriteriumCard', () => {
  it('zeigt die offizielle Themen-Beschreibung des Kriteriums an', () => {
    render(<KriteriumCard kriterium={getKriterium('1.1')} bewertung={undefined} onChange={vi.fn()} />);
    expect(screen.getByText(/Liegeposition im Bett/i)).toBeInTheDocument();
  });

  it('zeigt nach der Auswahl das offizielle Stufen-Label neben den Buttons', () => {
    render(
      <KriteriumCard
        kriterium={getKriterium('1.1')}
        bewertung={{ wert: 2, kommentar: '' }}
        onChange={vi.fn()}
      />,
    );
    expect(screen.getByText(/überwiegend unselbstständig/i)).toBeInTheDocument();
  });

  it('ruft onChange mit dem ausgewählten ordinalen Wert auf', async () => {
    const onChange = vi.fn();
    render(<KriteriumCard kriterium={getKriterium('1.1')} bewertung={undefined} onChange={onChange} />);
    const button = screen.getByRole('button', { name: /überwiegend selbstständig/i });
    await userEvent.click(button);
    expect(onChange).toHaveBeenCalledWith({ wert: 1 });
  });

  it('synchronisiert Kommentar-Änderungen', async () => {
    const onChange = vi.fn();
    render(
      <KriteriumCard
        kriterium={getKriterium('1.1')}
        bewertung={{ wert: 0, kommentar: '' }}
        onChange={onChange}
      />,
    );
    const input = screen.getByLabelText(/kommentar/i);
    await userEvent.type(input, 'X');
    expect(onChange).toHaveBeenCalledWith({ kommentar: 'X' });
  });

  it('berechnet Modul-5-Punkte aus der Häufigkeit und deckelt auf max', async () => {
    const onChange = vi.fn();
    render(
      <KriteriumCard
        kriterium={getKriterium('5.13')}
        bewertung={undefined}
        onChange={onChange}
      />,
    );
    const monatInput = screen.getByLabelText(/Pro Monat/i);
    // Mit nicht-aufgehobener Eingabe wird jeder Keystroke einzeln verarbeitet —
    // wir prüfen daher nur den Clamp-Effekt: 9 (× 1) → clamped auf 4.
    await userEvent.type(monatInput, '9');
    const letzte = onChange.mock.calls.at(-1)?.[0];
    expect(letzte).toEqual({ wert: 4, frequenz: { monat: 9 } });
  });

  it('zeigt drei Häufigkeits-Felder für Standard-Modul-5-Kriterien', () => {
    render(
      <KriteriumCard
        kriterium={getKriterium('5.1')}
        bewertung={undefined}
        onChange={vi.fn()}
      />,
    );
    expect(screen.getByLabelText(/Pro Tag/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Pro Woche/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Pro Monat/i)).toBeInTheDocument();
  });

  it('zeigt einen Ja/Nein-Schalter für Diät-Kriterium 5.16', () => {
    const onChange = vi.fn();
    render(
      <KriteriumCard
        kriterium={getKriterium('5.16')}
        bewertung={undefined}
        onChange={onChange}
      />,
    );
    const schalter = screen.getByRole('checkbox', { name: /Erforderlich/i });
    expect(schalter).toBeInTheDocument();
  });
});
