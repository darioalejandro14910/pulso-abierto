import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <section className="control-section">
      <span className="results-eyebrow">ERROR 404</span>
      <h1 className="main-title" style={{ fontSize: '1.9rem' }}>
        Página no encontrada
      </h1>
      <p className="main-description" style={{ marginBottom: '24px' }}>
        La ruta solicitada no existe dentro de Pulso Abierto.
      </p>
      <Link to="/" className="submit-btn">
        Volver a la página principal
      </Link>
    </section>
  );
}