import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchCryptos } from './cryptoService';

describe('fetchCryptos', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('devuelve las criptomonedas transformadas cuando la respuesta HTTP es exitosa', async () => {
    const mockResponse = {
      bitcoin: { usd: 95000 },
      ethereum: { usd: 3200 },
      solana: { usd: 185 }
    };

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    } as Response);

    const result = await fetchCryptos('usd');

    expect(result).toHaveLength(3);
    expect(result[0]).toMatchObject({
      id: 'bitcoin',
      name: 'Bitcoin',
      symbol: 'BTC',
      price: 95000
    });
    expect(result[1].price).toBe(3200);
    expect(result[2].price).toBe(185);
  });

  it('lanza un error cuando la respuesta HTTP no es exitosa (ok: false)', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 500
    } as Response);

    await expect(fetchCryptos('usd')).rejects.toThrow(
      'No pudimos obtener las cotizaciones.'
    );
  });

  it('omite las criptomonedas que no tienen un precio válido en la respuesta', async () => {
    const partialResponse = {
      bitcoin: { usd: 95000 },
      solana: { usd: 185 }
    };

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => partialResponse
    } as Response);

    const result = await fetchCryptos('usd');

    expect(result).toHaveLength(2);
    expect(result.map((c) => c.id)).toEqual(['bitcoin', 'solana']);
  });
});