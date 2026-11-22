# Pulso Abierto

Aplicación web desarrollada con **React** y **TypeScript** que permite consultar en tiempo real la cotización de **Bitcoin (BTC)**, **Ethereum (ETH)** y **Solana (SOL)** en dólares estadounidenses (USD), euros (EUR) y pesos argentinos (ARS), con gestión de favoritos persistentes y vista de detalle por criptomoneda.

---

## Enlaces del proyecto

- **Repositorio en GitHub:** https://github.com[darioalejandro14910]/[(https://github.com/darioalejandro14910/pulso-abierto.git)]
- **Aplicación publicada en Vercel:** https://vercel.app

---

## Tecnologías principales

- **React 19** y **TypeScript**
- **Vite** (entorno de desarrollo y empaquetado productivo)
- **React Router DOM** (navegación entre listado, detalle y ruta 404)
- **Zustand** con middleware `persist` (gestión de favoritos en `localStorage`)
- **Zod** (validación tipada de los controles del formulario)
- **Vitest** y **Testing Library** (pruebas automatizadas unitarias y de integración)
- **Oxlint** (análisis estático de código)

---

## Instalación y ejecución local

### Requisitos previos
- Node.js (v18 o superior) y npm.

### 1. Instalar dependencias
```bash
npm install
```

### 2. Ejecutar en modo desarrollo
```bash
npm run dev
```

### 3. Ejecutar pruebas automatizadas
```bash
npm run test:run
```
*(Para modo interactivo/watch, utilizar `npm run test`).*

### 4. Ejecutar verificación de linter
```bash
npm run lint
```

### 5. Generar el build de producción
```bash
npm run build
```

### 6. Comprobar el build productivo localmente (Preview)
```bash
npm run preview
```

---

## Variables de entorno

El proyecto **no requiere variables de entorno** ni claves privadas para su ejecución, ya que consume endpoints públicos de consulta de precios (CoinGecko API con respaldo automático en Coinbase API).

---

## Mejora de mantenibilidad realizada

- **Problema identificado:** En la hoja de estilos global (`src/index.css`) existía la regla `.crypto-card-identity`, la cual había quedado en desuso tras unificar la estructura visual de las tarjetas bajo la clase `.card-info`.
- **Cambio realizado:** Se eliminó el bloque CSS muerto `.crypto-card-identity` en `src/index.css` para evitar estilos huérfanos y mantener la hoja de estilos limpia y coherente con los componentes actuales.
- **Comprobación de no regresión:** Se ejecutaron `npm run lint`, `npm run test:run` y `npm run build` sin errores, y se verificó visualmente en `npm run preview` (vista móvil y escritorio) que las tarjetas del listado y la vista de detalle conservan exactamente su alineación y diseño.

---

## Verificación final

- **Pruebas ejecutadas:** `npm run test:run` ejecutado correctamente (todas las suites aprobadas: `cryptoService.test.ts`, `CryptoCard.test.tsx`, `HomePage.test.tsx`).
- **Build generado correctamente:** `npm run build` (`tsc -b && vite build`) completado sin errores de compilación ni de tipado.
- **Preview comprobado:** `npm run preview` verificado localmente comprobando carga inicial, consulta a la API, navegación al detalle, persistencia de favoritos tras recargar, validación del formulario y ausencia de errores en consola.
- **Despliegue realizado:** Publicado en Vercel desde la rama principal del repositorio en GitHub, verificando funcionamiento de rutas SPA (incluyendo recarga directa en `/criptomonedas/:id`) y diseño responsivo.
- **Fecha de verificación:** 22/11/2026
