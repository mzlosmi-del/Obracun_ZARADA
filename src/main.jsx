import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
// Self-hosted fonts (Fontsource) — removes the third-party Google Fonts
// round-trip. Vite bundles the woff2 files with hashed names + immutable cache.
// Only the latin + latin-ext subsets are imported: latin-ext is required for
// Serbian Latin (đ č ć ž š), while cyrillic/greek/vietnamese are unused. The
// subset-scoped entrypoints also drop the legacy .woff fallback that the plain
// weight entrypoints ship alongside woff2.
import '@fontsource/inter/latin-400.css'
import '@fontsource/inter/latin-ext-400.css'
import '@fontsource/inter/latin-500.css'
import '@fontsource/inter/latin-ext-500.css'
import '@fontsource/inter/latin-600.css'
import '@fontsource/inter/latin-ext-600.css'
import '@fontsource/inter/latin-700.css'
import '@fontsource/inter/latin-ext-700.css'
import '@fontsource/inter/latin-800.css'
import '@fontsource/inter/latin-ext-800.css'
import '@fontsource/jetbrains-mono/latin-400.css'
import '@fontsource/jetbrains-mono/latin-500.css'
import '@fontsource/jetbrains-mono/latin-600.css'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
