import { Link } from 'react-router-dom';
import type { Currency } from '../types/api';
import type { Crypto } from '../types/crypto';
import { formatCryptoPrice } from '../services/cryptoService';
import { useFavoritesStore } from '../store/favoritesStore';

interface CryptoCardProps {
  crypto: Crypto;
  currency: Currency;
}

export function CryptoCard({ crypto, currency }: CryptoCardProps) {
  const isFavorite = useFavoritesStore((state) =>
    state.favoriteIds.includes(crypto.id)
  );
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);

  const currencyLabels: Record<Currency, string> = {
    usd: 'dólares estadounidenses',
    eur: 'euros',
    ars: 'pesos argentinos'
  };

  return (
    <article className={`crypto-card ${isFavorite ? 'crypto-card--favorite' : ''}`}>
      <div className="crypto-card-header">
        <div className="card-info">
          <span className="crypto-icon" aria-hidden="true">
            {crypto.icon}
          </span>
          <div>
            <h2>{crypto.name}</h2>
            <span className="crypto-symbol">{crypto.symbol}</span>
          </div>
        </div>

        <button
          type="button"
          className={`fav-btn ${isFavorite ? 'fav-btn--active' : ''}`}
          onClick={() => toggleFavorite(crypto.id)}
          aria-pressed={isFavorite}
        >
          {isFavorite ? '★ Favorita' : '☆ Favorita'}
        </button>
      </div>

      <p className="crypto-price-label">Precio en {currencyLabels[currency]}</p>
      <p className="crypto-price">{formatCryptoPrice(crypto.price, currency)}</p>

      <div className="crypto-card-footer">
        <Link to={`/criptomonedas/${crypto.id}?currency=${currency}`} className="detail-link">
          Ver detalle →
        </Link>
      </div>
    </article>
  );
}