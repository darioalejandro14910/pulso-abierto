export type CryptoId = 'bitcoin' | 'ethereum' | 'solana';

export interface Crypto {
  id: CryptoId;
  name: string;
  symbol: string;
  icon: string;
  price: number;
  description: string;
}

export type StatusType = 'initial' | 'loading' | 'success' | 'empty' | 'error';