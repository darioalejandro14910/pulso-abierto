import { useState, type FormEvent } from 'react';
import type { Currency } from '../types/api';
import { querySchema } from '../schemas/querySchema';

interface QueryControlsProps {
  searchTerm: string;
  selectedCurrency: Currency;
  onlyFavorites: boolean;
  isLoading: boolean;
  onSearchChange: (value: string) => void;
  onCurrencyChange: (value: Currency) => void;
  onFavoritesChange: (value: boolean) => void;
  onSearch: () => void;
}

export function QueryControls({
  searchTerm,
  selectedCurrency,
  onlyFavorites,
  isLoading,
  onSearchChange,
  onCurrencyChange,
  onFavoritesChange,
  onSearch
}: QueryControlsProps) {
  const [errors, setErrors] = useState<{
    searchTerm?: string;
    selectedCurrency?: string;
  }>({});

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = querySchema.safeParse({
      searchTerm,
      selectedCurrency
    });

    if (!result.success) {
      const fieldErrors: { searchTerm?: string; selectedCurrency?: string } = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0];
        if (field === 'searchTerm' || field === 'selectedCurrency') {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    onSearch();
  };

  return (
    <section className="control-section" aria-labelledby="control-heading">
      <h2 id="control-heading" className="control-title">
        Consultar precios
      </h2>
      <p className="control-subtitle">
        Los valores se obtienen directamente de CoinGecko. Filtrá por nombre, moneda o favoritas.
      </p>

      <form className="crypto-form" onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="search-input" className="form-label">
              Buscar criptomoneda
            </label>
            <input
              id="search-input"
              type="text"
              className={`form-input ${errors.searchTerm ? 'input-error' : ''}`}
              placeholder="Ej: Bitcoin, ETH, Solana..."
              value={searchTerm}
              onChange={(e) => {
                onSearchChange(e.target.value);
                if (errors.searchTerm) {
                  setErrors((prev) => ({ ...prev, searchTerm: undefined }));
                }
              }}
              aria-invalid={Boolean(errors.searchTerm)}
              aria-describedby={errors.searchTerm ? 'search-error' : undefined}
            />
            {errors.searchTerm && (
              <p id="search-error" className="field-error" role="alert">
                ⚠ {errors.searchTerm}
              </p>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="currency-select" className="form-label">
              Moneda de cotización
            </label>
            <select
              id="currency-select"
              className={`form-select ${errors.selectedCurrency ? 'input-error' : ''}`}
              value={selectedCurrency}
              onChange={(e) => {
                onCurrencyChange(e.target.value as Currency);
                if (errors.selectedCurrency) {
                  setErrors((prev) => ({ ...prev, selectedCurrency: undefined }));
                }
              }}
              aria-invalid={Boolean(errors.selectedCurrency)}
              aria-describedby={errors.selectedCurrency ? 'currency-error' : undefined}
            >
              <option value="usd">Dólar estadounidense (USD)</option>
              <option value="eur">Euro (EUR)</option>
              <option value="ars">Peso argentino (ARS)</option>
            </select>
            {errors.selectedCurrency && (
              <p id="currency-error" className="field-error" role="alert">
                ⚠ {errors.selectedCurrency}
              </p>
            )}
          </div>
        </div>

        <div className="form-checkbox-row">
          <input
            id="favorites-checkbox"
            type="checkbox"
            checked={onlyFavorites}
            onChange={(e) => onFavoritesChange(e.target.checked)}
          />
          <label htmlFor="favorites-checkbox" className="checkbox-label">
            Mostrar solo criptomonedas favoritas
          </label>
        </div>

        <button type="submit" className="submit-btn" disabled={isLoading}>
          {isLoading ? 'Consultando...' : 'Consultar cotizaciones'}
        </button>
      </form>
    </section>
  );
}
