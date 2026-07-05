import { MoveProvider } from '@/contexts/MoveContext';
import { PokemonProvider } from '@/contexts/PokemonContext';
import { CaughtProvider } from '@/contexts/CaughtContext';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <PokemonProvider>
        <MoveProvider>
          <CaughtProvider>
            <App />
          </CaughtProvider>
        </MoveProvider>
      </PokemonProvider>
    </HashRouter>
  </StrictMode>
);
