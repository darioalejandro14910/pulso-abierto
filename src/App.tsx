import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { CryptoDetailPage } from './pages/CryptoDetailPage';
import { NotFoundPage } from './pages/NotFoundPage';

export function App() {
  return (
    <BrowserRouter>
      <header className="app-header">
        <div className="container">
          <Link
            to="/"
            className="app-brand"
            style={{ color: 'inherit', textDecoration: 'none' }}
          >
            Pulso Abierto
          </Link>
          <p className="app-tagline">Información pública y abierta</p>
        </div>
      </header>

      <main className="app-main container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/criptomonedas/:id" element={<CryptoDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <footer className="app-footer">
        <div className="container">
          <p>© 2026 Pulso Abierto</p>
          <p className="data-source">
            Fuente de datos:{' '}
            <a
              href="https://coingecko.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              CoinGecko
            </a>
          </p>
          <p>Proyecto académico desarrollado con React, TypeScript y Vite.</p>
        </div>
      </footer>
    </BrowserRouter>
  );
}

export default App;