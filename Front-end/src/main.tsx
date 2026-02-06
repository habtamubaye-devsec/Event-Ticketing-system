import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'antd/dist/reset.css'; // For Ant Design v5+
import App from './App.tsx'
import ThemeProvider from './theme/ThemeProvider.tsx'
import { HelmetProvider } from 'react-helmet-async'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </HelmetProvider>
  </StrictMode>,
)

