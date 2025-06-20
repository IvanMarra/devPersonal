import React, { useState } from 'react';
import { BarChart3, X, Copy, Check, ExternalLink, AlertTriangle } from 'lucide-react';

interface GoogleAnalyticsSetupProps {
  onClose: () => void;
}

const GoogleAnalyticsSetup: React.FC<GoogleAnalyticsSetupProps> = ({ onClose }) => {
  const [trackingId, setTrackingId] = useState('');
  const [copiedStep, setCopiedStep] = useState<string | null>(null);

  const copyToClipboard = (text: string, step: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(step);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  const gtagCode = `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${trackingId || 'G-XXXXXXXXXX'}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${trackingId || 'G-XXXXXXXXXX'}');
</script>`;

  const reactGACode = `// npm install react-ga4
import ReactGA from 'react-ga4';

// No main.tsx ou App.tsx
ReactGA.initialize('${trackingId || 'G-XXXXXXXXXX'}');

// Para rastrear page views
ReactGA.send({ hitType: "pageview", page: window.location.pathname });`;

  const analyticsAPICode = `// Para buscar dados do Google Analytics
// npm install googleapis

import { google } from 'googleapis';

const analytics = google.analytics('v3');
const auth = new google.auth.GoogleAuth({
  keyFile: 'path/to/service-account-key.json',
  scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
});

// Exemplo de busca de dados
const response = await analytics.data.ga.get({
  auth,
  ids: 'ga:${trackingId || 'XXXXXXXXX'}',
  'start-date': '30daysAgo',
  'end-date': 'today',
  metrics: 'ga:sessions,ga:users,ga:pageviews',
  dimensions: 'ga:date'
});`;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg border border-cyan-500/50 p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="cyber-border rounded-full p-2">
              <BarChart3 className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-cyan-400">Configuração Google Analytics</h2>
              <p className="text-gray-400">Integre analytics reais ao seu dashboard</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Aviso */}
        <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-blue-400 mt-0.5" />
            <div>
              <h3 className="text-blue-400 font-semibold mb-2">Sobre esta Integração</h3>
              <p className="text-gray-300 text-sm">
                Esta configuração permitirá substituir os dados simulados por dados reais do Google Analytics 4.
                Você precisará de uma conta do Google Analytics e conhecimentos básicos de desenvolvimento.
              </p>
            </div>
          </div>
        </div>

        {/* Input para Tracking ID */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Google Analytics Tracking ID (GA4)
          </label>
          <input
            type="text"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            placeholder="G-XXXXXXXXXX"
            className="w-full p-3 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
          />
          <p className="text-xs text-gray-400 mt-1">
            Encontre seu ID em: Google Analytics → Admin → Data Streams → Web Stream
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-6">
          {/* Step 1: Create GA Account */}
          <div className="bg-gray-800/50 p-6 rounded-lg border border-cyan-500/30">
            <h3 className="text-lg font-bold text-cyan-400 mb-4 flex items-center">
              <span className="bg-cyan-500 text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">1</span>
              Criar Conta Google Analytics
            </h3>
            <div className="space-y-3">
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-300 ml-4">
                <li>Acesse <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">analytics.google.com</a></li>
                <li>Clique em "Começar a medir"</li>
                <li>Configure sua propriedade GA4</li>
                <li>Adicione um stream de dados para seu site</li>
                <li>Copie o Measurement ID (G-XXXXXXXXXX)</li>
              </ol>
            </div>
          </div>

          {/* Step 2: Install Tracking Code */}
          <div className="bg-gray-800/50 p-6 rounded-lg border border-green-500/30">
            <h3 className="text-lg font-bold text-green-400 mb-4 flex items-center">
              <span className="bg-green-500 text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">2</span>
              Instalar Código de Rastreamento
            </h3>
            
            <div className="space-y-4">
              <p className="text-gray-300">Adicione este código no <code className="bg-gray-700 px-2 py-1 rounded">index.html</code>:</p>
              
              <div className="bg-black/50 p-4 rounded-lg border border-gray-600">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-300">HTML (index.html):</span>
                  <button
                    onClick={() => copyToClipboard(gtagCode, 'gtag')}
                    className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 text-sm"
                  >
                    {copiedStep === 'gtag' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedStep === 'gtag' ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
                <pre className="text-sm text-green-400 overflow-x-auto">
                  {gtagCode}
                </pre>
              </div>

              <p className="text-gray-300">Ou use a biblioteca React GA4:</p>
              
              <div className="bg-black/50 p-4 rounded-lg border border-gray-600">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-300">React GA4:</span>
                  <button
                    onClick={() => copyToClipboard(reactGACode, 'react-ga')}
                    className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 text-sm"
                  >
                    {copiedStep === 'react-ga' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedStep === 'react-ga' ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
                <pre className="text-sm text-blue-400 overflow-x-auto">
                  {reactGACode}
                </pre>
              </div>
            </div>
          </div>

          {/* Step 3: Analytics API */}
          <div className="bg-gray-800/50 p-6 rounded-lg border border-purple-500/30">
            <h3 className="text-lg font-bold text-purple-400 mb-4 flex items-center">
              <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">3</span>
              Configurar Analytics Reporting API
            </h3>
            
            <div className="space-y-4">
              <p className="text-gray-300">Para buscar dados reais no dashboard:</p>
              
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-300 ml-4">
                <li>Acesse <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">Google Cloud Console</a></li>
                <li>Crie um projeto ou selecione um existente</li>
                <li>Ative a "Google Analytics Reporting API"</li>
                <li>Crie credenciais de Service Account</li>
                <li>Baixe o arquivo JSON das credenciais</li>
                <li>No Google Analytics, adicione o email do Service Account como usuário</li>
              </ol>

              <div className="bg-black/50 p-4 rounded-lg border border-gray-600">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-300">Código de exemplo:</span>
                  <button
                    onClick={() => copyToClipboard(analyticsAPICode, 'api')}
                    className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 text-sm"
                  >
                    {copiedStep === 'api' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedStep === 'api' ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
                <pre className="text-sm text-purple-400 overflow-x-auto">
                  {analyticsAPICode}
                </pre>
              </div>
            </div>
          </div>

          {/* Step 4: Update Dashboard */}
          <div className="bg-gray-800/50 p-6 rounded-lg border border-yellow-500/30">
            <h3 className="text-lg font-bold text-yellow-400 mb-4 flex items-center">
              <span className="bg-yellow-500 text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">4</span>
              Atualizar Dashboard
            </h3>
            
            <div className="space-y-3">
              <p className="text-gray-300">Modifique o <code className="bg-gray-700 px-2 py-1 rounded">AdminDashboard.tsx</code>:</p>
              
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-300 ml-4">
                <li>Substitua a função <code className="bg-gray-700 px-1 rounded">generateAnalytics</code></li>
                <li>Implemente chamadas para a Analytics API</li>
                <li>Trate erros e fallbacks</li>
                <li>Adicione loading states</li>
                <li>Configure refresh automático</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Environment Variables */}
        <div className="mt-6 bg-gray-800/30 p-4 rounded-lg border border-gray-600">
          <h4 className="text-white font-semibold mb-3">Variáveis de Ambiente</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <code className="text-cyan-400">VITE_GA_TRACKING_ID</code>
              <span className="text-gray-400">{trackingId || 'G-XXXXXXXXXX'}</span>
            </div>
            <div className="flex justify-between">
              <code className="text-cyan-400">GOOGLE_APPLICATION_CREDENTIALS</code>
              <span className="text-gray-400">path/to/service-account.json</span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-6 bg-gray-800/30 p-4 rounded-lg border border-gray-600">
          <h4 className="text-white font-semibold mb-3">Links Úteis</h4>
          <div className="grid md:grid-cols-2 gap-3 text-sm">
            <a 
              href="https://analytics.google.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Google Analytics</span>
            </a>
            <a 
              href="https://console.cloud.google.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Google Cloud Console</span>
            </a>
            <a 
              href="https://developers.google.com/analytics/devguides/reporting/core/v4" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Analytics API Docs</span>
            </a>
            <a 
              href="https://www.npmjs.com/package/react-ga4" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300"
            >
              <ExternalLink className="w-4 h-4" />
              <span>React GA4 Package</span>
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-700 text-center">
          <p className="text-gray-400 text-sm">
            Após a configuração, os dados reais substituirão os simulados no dashboard.
          </p>
        </div>
      </div>

      {/* Custom CSS */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .cyber-border {
            background: linear-gradient(45deg, #00ffff, #ff00ff, #ffff00, #00ffff);
            background-size: 400% 400%;
            animation: gradient-shift 3s ease infinite;
            padding: 2px;
          }
          
          @keyframes gradient-shift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `
      }} />
    </div>
  );
};

export default GoogleAnalyticsSetup;