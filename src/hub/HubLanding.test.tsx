import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { HubLanding } from './HubLanding';

describe('HubLanding', () => {
  it('zeigt das Begutachtungsinstrument als Tool-Kachel', () => {
    render(
      <MemoryRouter>
        <HubLanding />
      </MemoryRouter>,
    );
    expect(screen.getByRole('heading', { name: /Begutachtungsinstrument/i })).toBeInTheDocument();
  });
});
