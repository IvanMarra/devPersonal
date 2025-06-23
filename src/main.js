import { jsx as _jsx } from "react/jsx-runtime";
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
// Função para remover loading screen
const removeLoadingScreen = () => {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        loadingScreen.style.transition = 'opacity 0.5s ease-out';
        setTimeout(() => {
            loadingScreen.remove();
        }, 500);
    }
};
// Garantir que o DOM está pronto
const initApp = () => {
    const rootElement = document.getElementById('root');
    if (!rootElement) {
        console.error('❌ Elemento root não encontrado!');
        return;
    }
    console.log('🚀 Iniciando aplicação DevIem...');
    try {
        const root = createRoot(rootElement);
        root.render(_jsx(StrictMode, { children: _jsx(App, {}) }));
        console.log('✅ Aplicação React renderizada com sucesso!');
        // Remover loading screen após renderização
        setTimeout(removeLoadingScreen, 500);
    }
    catch (error) {
        console.error('❌ Erro ao renderizar aplicação:', error);
        // Fallback em caso de erro
        if (rootElement) {
            rootElement.innerHTML = `
        <div style="
          min-height: 100vh; 
          background: #000; 
          color: #00ffff; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          font-family: monospace;
          text-align: center;
          padding: 20px;
        ">
          <div>
            <h1 style="font-size: 2rem; margin-bottom: 1rem;">DEVIEM</h1>
            <p style="margin-bottom: 1rem;">Erro ao carregar a aplicação</p>
            <p style="font-size: 0.8rem; opacity: 0.7;">Recarregue a página (F5)</p>
          </div>
        </div>
      `;
        }
        removeLoadingScreen();
    }
};
// Inicializar quando DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
}
else {
    initApp();
}
