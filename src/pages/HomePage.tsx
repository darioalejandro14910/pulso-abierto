import { useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Currency } from '../types/api';
import type { Crypto, StatusType } from '../types/crypto';
import { fetchCryptos } from '../services/cryptoService';
import { useFavoritesStore } from '../store/favoritesStore';
import { QueryControls } from '../components/QueryControls';
import { StatusMessage } from '../components/StatusMessage';
import { CryptoList } from '../components/CryptoList';

export function HomePage() {
  const [searchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('usd');
  const [onlyFavorites, setOnlyFavorites] = useState<boolean>(false);

  const [cryptos, setCryptos] = useState<Crypto[]>([]);
  const [status, setStatus] = useState<StatusType>('initial');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const favoriteIds = useFavoritesStore((state) => state.favoriteIds);
  const favoritesCount = favoriteIds.length;

  const abortControllerRef = useRef<AbortController | null>(null);

  const handleSearch = async (currencyToFetch: Currency = selectedCurrency) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setStatus('loading');
    setErrorMessage('');

    try {
      const demoParam = searchParams.get('demo');
      const data = await fetchCryptos(currencyToFetch, controller.signal, demoParam);
      setCryptos(data);
      setStatus(data.length === 0 ? 'empty' : 'success');
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        return;
      }
      const message =
        err instanceof Error
          ? err.message
          : 'No pudimos obtener las cotizaciones. Revisá tu conexión e intentá nuevamente.';
      setErrorMessage(message);
      setStatus('error');
    }
  };

  const handleCurrencyChange = (newCurrency: Currency) => {
    setSelectedCurrency(newCurrency);
    if (status === 'success' || status === 'empty') {
      handleSearch(newCurrency);
    }
  };

  const filteredCryptos = cryptos.filter((crypto) => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const matchesSearch =
      normalizedSearch === '' ||
      crypto.name.toLowerCase().includes(normalizedSearch) ||
      crypto.symbol.toLowerCase().includes(normalizedSearch);

    const matchesFavorite = !onlyFavorites || favoriteIds.includes(crypto.id);

    return matchesSearch && matchesFavorite;
  });

  const visibleCount = filteredCryptos.length;
  const effectiveStatus: StatusType =
    status === 'success' && visibleCount === 0 ? 'empty' : status;

  return (
    <>
      <section className="hero-section">
        <h1 className="main-title">Cotizaciones de criptomonedas</h1>
        <p className="main-description">
          Consultá el valor actual de Bitcoin, Ethereum y Solana en dólares estadounidenses, euros o pesos argentinos.
        </p>
      </section>

      <QueryControls
        searchTerm={searchTerm}
        selectedCurrency={selectedCurrency}
        onlyFavorites={onlyFavorites}
        isLoading={status === 'loading'}
        onSearchChange={setSearchTerm}
        onCurrencyChange={handleCurrencyChange}
        onFavoritesChange={setOnlyFavorites}
        onSearch={() => handleSearch(selectedCurrency)}
      />

      <div style={{ marginBottom: '28px' }}>
        <StatusMessage
          type={effectiveStatus}
          resultCount={visibleCount}
          errorMessage={errorMessage}
          onRetry={() => handleSearch(selectedCurrency)}
        />
      </div>

      {(effectiveStatus === 'success' || effectiveStatus === 'empty') && (
        <section className="results-section" aria-labelledby="results-heading">
          <div className="results-header">
            <div>
              <span className="results-eyebrow">TUS RESULTADOS</span>
              <h2 id="results-heading" className="results-title">
                Precios actuales ({visibleCount})
              </h2>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span className="currency-badge">Favoritas: {favoritesCount}</span>
              <span className="currency-badge">Moneda: {selectedCurrency.toUpperCase()}</span>
            </div>
          </div>

          <CryptoList cryptos={filteredCryptos} currency={selectedCurrency} />
        </section>
      )}
    </>
  );
}