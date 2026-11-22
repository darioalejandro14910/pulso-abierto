import type { StatusType } from '../types/crypto';

interface StatusMessageProps {
  type: StatusType;
  resultCount?: number;
  errorMessage?: string;
  onRetry?: () => void;
}

export function StatusMessage({
  type,
  resultCount = 0,
  errorMessage,
  onRetry
}: StatusMessageProps) {
  return (
    <div id="status-container" aria-live="polite">
      {type === 'initial' && (
        <div className="status-box status-initial" role="status">
          <p>Todavía no has realizado ninguna consulta. Presioná el botón para comenzar.</p>
        </div>
      )}

      {type === 'loading' && (
        <div className="status-box status-loading" role="status">
          <p>Consultando cotizaciones en tiempo real...</p>
        </div>
      )}

      {type === 'success' && (
        <div className="status-box status-success" role="status">
          <p>
            Consulta completada. Se {resultCount === 1 ? 'encontró' : 'encontraron'}{' '}
            <strong>{resultCount}</strong> {resultCount === 1 ? 'cotización' : 'cotizaciones'}.
          </p>
        </div>
      )}

      {type === 'empty' && (
        <div className="status-box status-empty" role="status">
          <p>
            La consulta finalizó correctamente, pero no se encontraron cotizaciones que coincidan con los filtros seleccionados.
          </p>
        </div>
      )}

      {type === 'error' && (
        <div className="status-box status-error" role="alert">
          <div className="error-layout">
            <p>
              {errorMessage ||
                'No pudimos obtener las cotizaciones. Revisá tu conexión a Internet e intentá nuevamente.'}
            </p>
            {onRetry && (
              <button type="button" className="retry-btn" onClick={onRetry}>
                Reintentar consulta
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}