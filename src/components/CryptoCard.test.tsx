import '@testing-library/jest-dom/vitest';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { CryptoCard } from './CryptoCard';
import { useFavoritesStore } from '../store/favoritesStore';
import type { Crypto } from '../types/crypto';

const mockBitcoin: Crypto = {
  id: 'bitcoin',
  name: 'Bitcoin',
  symbol: 'BTC',
  icon: '₿',
  price: 95000,
  description: 'Primera criptomoneda descentralizada.'
};

describe('CryptoCard - Favoritos', () => {
  beforeEach(() => {
    localStorage.clear();
    useFavoritesStore.setState({ favoriteIds: [] });
  });

  it('permite marcar y desmarcar una criptomoneda como favorita reflejando el cambio en la interfaz', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <CryptoCard crypto={mockBitcoin} currency="usd" />
      </MemoryRouter>
    );

    const favButton = screen.getByRole('button', { name: /favorita/i });
    expect(favButton).toHaveAttribute('aria-pressed', 'false');
    expect(favButton).toHaveTextContent('☆ Favorita');

    await user.click(favButton);
    expect(favButton).toHaveAttribute('aria-pressed', 'true');
    expect(favButton).toHaveTextContent('★ Favorita');

    await user.click(favButton);
    expect(favButton).toHaveAttribute('aria-pressed', 'false');
    expect(favButton).toHaveTextContent('☆ Favorita');
  });

  it('muestra la criptomoneda como favorita si ya estaba guardada en el store', () => {
    useFavoritesStore.setState({ favoriteIds: ['bitcoin'] });

    render(
      <MemoryRouter>
        <CryptoCard crypto={mockBitcoin} currency="usd" />
      </MemoryRouter>
    );

    const favButton = screen.getByRole('button', { name: /favorita/i });
    expect(favButton).toHaveAttribute('aria-pressed', 'true');
    expect(favButton).toHaveTextContent('★ Favorita');
  });
});