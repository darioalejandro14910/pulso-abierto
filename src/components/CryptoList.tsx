import type { Currency } from '../types/api';
import type { Crypto } from '../types/crypto';
import { CryptoCard } from './CryptoCard';

interface CryptoListProps {
  cryptos: Crypto[];
  currency: Currency;
}

export function CryptoList({ cryptos, currency }: CryptoListProps) {
  if (cryptos.length === 0) {
    return null;
  }

  return (
    <div className="crypto-grid">
      {cryptos.map((crypto) => (
        <CryptoCard key={crypto.id} crypto={crypto} currency={currency} />
      ))}
    </div>
  );
}