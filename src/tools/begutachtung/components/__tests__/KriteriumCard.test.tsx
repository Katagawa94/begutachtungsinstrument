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

  it('begrenzt Frequenzeingabe auf den Maximalwert des Kriteriums', async () => {
    const onChange = vi.fn();
    render(
      <KriteriumCard
        kriterium={getKriterium('5.13')}
        bewertung={undefined}
        onChange={onChange}
      />,
    );
    const input = screen.getByRole('spinbutton');
    await userEvent.type(input, '99');
    // Das Kriterium 5.13 ist auf max 4 beschränkt – die letzte Auswertung clampt.
    const letzte = onChange.mock.calls.at(-1)?.[0];
    expect(letzte).toEqual({ wert: 4 });
  });
});
