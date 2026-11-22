import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import type { Currency } from '../types/api';
import type { Crypto } from '../types/crypto';
import {
  fetchCryptoById,
  formatCryptoPrice,
  isValidCryptoId
} from '../services/cryptoService';
import { useFavoritesStore } from '../store/favoritesStore';

export function CryptoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();

  const rawCurrency = searchParams.get('currency');
  const currency: Currency =
    rawCurrency === 'eur' || rawCurrency === 'ars' ? rawCurrency : 'usd';

  const validId = isValidCryptoId(id);
  const currentKey = validId ? `${id}-${currency}` : '';

  const [crypto, setCrypto] = useState<Crypto | null>(null);
  const [error, setError] = useState<string>('');
  const [resolvedKey, setResolvedKey] = useState<string>('');

  const loading = validId && resolvedKey !== currentKey;

  const isFavorite = useFavoritesStore((state) =>
    validId ? state.favoriteIds.includes(id) : false
  );
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);

  useEffect(() => {
    if (!validId) {
      return;
    }

    const controller = new AbortController();

    fetchCryptoById(id, currency, controller.signal)
      .then((data) => {
        setCrypto(data);
        setError('');
        setResolvedKey(`${id}-${currency}`);
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setError(
          err instanceof Error
            ? err.message
            : 'No pudimos cargar el detalle de la criptomoneda.'
        );
        setResolvedKey(`${id}-${currency}`);
      });

    return () => {
      controller.abort();
    };
  }, [id, validId, currency]);

  if (!validId) {
    return (
      <section className="control-section">
        <span className="results-eyebrow">RECURSO NO ADMITIDO</span>
        <h1 className="main-title" style={{ fontSize: '1.8rem' }}>
          Criptomoneda no encontrada
        </h1>
        <p className="main-description" style={{ marginBottom: '20px' }}>
          El identificador <strong>"{id}"</strong> no corresponde a ninguno de los registros admitidos por Pulso Abierto (Bitcoin, Ethereum o Solana).
        </p>
        <Link to="/" className="submit-btn">
          ← Volver al listado principal
        </Link>
      </section>
    );
  }

  return (
    <section>
      <div style={{ marginBottom: '20px' }}>
        <Link to="/" className="detail-link">
          ← Volver a cotizaciones
        </Link>
      </div>

      {loading && (
        <div className="status-box status-loading" role="status">
          <p>Cargando información detallada desde CoinGecko...</p>
        </div>
      )}

      {!loading && error && (
        <div className="status-box status-error" role="alert">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && crypto && (
        <article className="control-section">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: '16px',
              marginBottom: '20px'
            }}
          >
            <div className="card-info">
              <span
                className="crypto-icon"
                style={{ width: '44px', height: '44px', fontSize: '1.2rem' }}
              >
                {crypto.icon}
              </span>
              <div>
                <h1 className="main-title" style={{ fontSize: '1.9rem', marginBottom: '2px' }}>
                  {crypto.name} ({crypto.symbol})
                </h1>
                <span className="currency-badge">ID: {crypto.id}</span>
              </div>
            </div>

            <button
              type="button"
              className={`fav-btn ${isFavorite ? 'fav-btn--active' : ''}`}
              onClick={() => toggleFavorite(crypto.id)}
              aria-pressed={isFavorite}
            >
              {isFavorite ? '★ Quitar de favoritas' : '☆ Agregar a favoritas'}
            </button>
          </div>

          <p className="main-description" style={{ marginBottom: '24px' }}>
            {crypto.description}
          </p>

          <div
            style={{
              padding: '18px',
              background: 'var(--color-bg)',
              borderRadius: '8px',
              border: '1px solid var(--color-border)'
            }}
          >
            <span className="crypto-price-label">
              Cotización actual ({currency.toUpperCase()})
            </span>
            <p className="crypto-price" style={{ fontSize: '2.1rem' }}>
              {formatCryptoPrice(crypto.price, currency)}
            </p>
          </div>
        </article>
      )}
    </section>
  );
}