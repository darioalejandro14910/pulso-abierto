import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { HomePage } from './HomePage';
import * as cryptoService from '../services/cryptoService';
import { useFavoritesStore } from '../store/favoritesStore';

describe('HomePage - Consulta, carga, error y reintento', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    useFavoritesStore.setState({ favoriteIds: [] });
  });

  it('muestra el estado de carga mientras se consultan las cotizaciones', async () => {
    const user = userEvent.setup();

    vi.spyOn(cryptoService, 'fetchCryptos').mockImplementation(
      () => new Promise(() => {})
    );

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    const submitButton = screen.getByRole('button', { name: /consultar cotizaciones/i });
    await user.click(submitButton);

    expect(screen.getByText(/consultando cotizaciones en tiempo real/i)).toBeInTheDocument();
  });

  it('muestra las tarjetas de criptomonedas cuando la consulta es exitosa', async () => {
    const user = userEvent.setup();

    vi.spyOn(cryptoService, 'fetchCryptos').mockResolvedValueOnce([
      {
        id: 'bitcoin',
        name: 'Bitcoin',
        symbol: 'BTC',
        icon: '₿',
        price: 95000,
        description: 'Desc BTC'
      },
      {
        id: 'ethereum',
        name: 'Ethereum',
        symbol: 'ETH',
        icon: 'Ξ',
        price: 3200,
        description: 'Desc ETH'
      }
    ]);

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: /consultar cotizaciones/i }));

    expect(await screen.findByText('Bitcoin')).toBeInTheDocument();
    expect(screen.getByText('Ethereum')).toBeInTheDocument();
    expect(screen.getByText(/se encontraron/i)).toBeInTheDocument();
  });

  it('muestra un mensaje de error y permite reintentar cuando falla la consulta', async () => {
    const user = userEvent.setup();

    const fetchMock = vi
      .spyOn(cryptoService, 'fetchCryptos')
      .mockRejectedValueOnce(new Error('No pudimos obtener las cotizaciones.'))
      .mockResolvedValueOnce([
        {
          id: 'solana',
          name: 'Solana',
          symbol: 'SOL',
          icon: 'S',
          price: 185,
          description: 'Desc SOL'
        }
      ]);

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: /consultar cotizaciones/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /no pudimos obtener las cotizaciones/i
    );

    const retryButton = screen.getByRole('button', { name: /reintentar consulta/i });
    await user.click(retryButton);

    expect(await screen.findByText('Solana')).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});