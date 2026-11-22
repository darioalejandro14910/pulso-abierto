import type { CoinGeckoResponse, Currency } from '../types/api';
import type { Crypto, CryptoId } from '../types/crypto';

export const CRYPTO_METADATA: Record<
  CryptoId,
  { name: string; symbol: string; icon: string; pair: string; description: string }
> = {
  bitcoin: {
    name: 'Bitcoin',
    symbol: 'BTC',
    icon: '₿',
    pair: 'BTC',
    description:
      'Primera criptomoneda descentralizada creada en 2009 como reserva de valor digital y red de pagos peer-to-peer.'
  },
  ethereum: {
    name: 'Ethereum',
    symbol: 'ETH',
    icon: 'Ξ',
    pair: 'ETH',
    description:
      'Plataforma blockchain de código abierto que permite ejecutar contratos inteligentes y aplicaciones descentralizadas.'
  },
  solana: {
    name: 'Solana',
    symbol: 'SOL',
    icon: 'S',
    pair: 'SOL',
    description:
      'Red blockchain de alto rendimiento diseñada para aplicaciones descentralizadas escalables y transacciones de baja latencia.'
  }
};

function buildCoinGeckoUrl(idsParam: string, currency: Currency): string {
  const url = new URL('https://coingecko.com');
  url.pathname = '/api/v3/simple/price';
  url.searchParams.set('ids', idsParam);
  url.searchParams.set('vs_currencies', currency);
  return url.toString();
}

function buildCoinbaseUrl(pair: string, fiatCode: string): string {
  const url = new URL('https://coinbase.com');
  url.pathname = '/v2/prices/' + pair + '-' + fiatCode + '/spot';
  return url.toString();
}

export function isValidCryptoId(id: string | undefined): id is CryptoId {
  return id === 'bitcoin' || id === 'ethereum' || id === 'solana';
}

export function formatCryptoPrice(price: number, currency: Currency): string {
  const currencyMap: Record<Currency, string> = {
    usd: 'USD',
    eur: 'EUR',
    ars: 'ARS'
  };

  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: currencyMap[currency],
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
}

async function fetchSingleCoinbase(
  id: CryptoId,
  currency: Currency,
  signal?: AbortSignal
): Promise<Crypto> {
  const fiatCode = currency.toUpperCase();
  const endpoint = buildCoinbaseUrl(CRYPTO_METADATA[id].pair, fiatCode);
  const res = await fetch(endpoint, { signal });

  if (!res.ok) {
    throw new Error(
      'No pudimos obtener las cotizaciones. Revisá tu conexión a Internet e intentá nuevamente.'
    );
  }

  const json = await res.json();

  return {
    id,
    name: CRYPTO_METADATA[id].name,
    symbol: CRYPTO_METADATA[id].symbol,
    icon: CRYPTO_METADATA[id].icon,
    price: Number(json.data.amount),
    description: CRYPTO_METADATA[id].description
  };
}

async function fetchCoinbaseFallback(
  ids: CryptoId[],
  currency: Currency,
  signal?: AbortSignal
): Promise<Crypto[]> {
  return Promise.all(ids.map((id) => fetchSingleCoinbase(id, currency, signal)));
}

export async function fetchCryptos(
  currency: Currency,
  signal?: AbortSignal,
  demoParam?: string | null
): Promise<Crypto[]> {
  if (demoParam === 'loading') {
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  if (demoParam === 'error') {
    throw new Error(
      'No pudimos obtener las cotizaciones. Revisá tu conexión a Internet e intentá nuevamente. El servicio también puede estar temporalmente limitado.'
    );
  }

  if (demoParam === 'empty' || demoParam === 'vacio') {
    return [];
  }

  const ids: CryptoId[] = ['bitcoin', 'ethereum', 'solana'];

  try {
    const url = buildCoinGeckoUrl('bitcoin,ethereum,solana', currency);
    const response = await fetch(url, { signal });

    if (!response.ok) {
      return await fetchCoinbaseFallback(ids, currency, signal);
    }

    const data: CoinGeckoResponse = await response.json();

    return ids
      .filter((id) => data[id]?.[currency] !== undefined)
      .map((id) => ({
        id,
        name: CRYPTO_METADATA[id].name,
        symbol: CRYPTO_METADATA[id].symbol,
        icon: CRYPTO_METADATA[id].icon,
        price: Number(data[id]![currency]),
        description: CRYPTO_METADATA[id].description
      }));
  } catch (err: unknown) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw err;
    }
    return await fetchCoinbaseFallback(ids, currency, signal);
  }
}

export async function fetchCryptoById(
  id: CryptoId,
  currency: Currency = 'usd',
  signal?: AbortSignal
): Promise<Crypto> {
  try {
    const url = buildCoinGeckoUrl(id, currency);
    const response = await fetch(url, { signal });

    if (!response.ok) {
      return await fetchSingleCoinbase(id, currency, signal);
    }

    const data: CoinGeckoResponse = await response.json();
    const price = data[id]?.[currency];

    if (price === undefined) {
      return await fetchSingleCoinbase(id, currency, signal);
    }

    return {
      id,
      name: CRYPTO_METADATA[id].name,
      symbol: CRYPTO_METADATA[id].symbol,
      icon: CRYPTO_METADATA[id].icon,
      price: Number(price),
      description: CRYPTO_METADATA[id].description
    };
  } catch (err: unknown) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw err;
    }
    return await fetchSingleCoinbase(id, currency, signal);
  }
}