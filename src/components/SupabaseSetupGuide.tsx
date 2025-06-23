import React, { useState } from 'react';
import { X, ExternalLink, Copy, Check, AlertTriangle, Database, Settings, Key } from 'lucide-react';

interface SupabaseSetupGuideProps {
  onClose: () => void;
}

const SupabaseSetupGuide: React.FC<SupabaseSetupGuideProps> = ({ onClose }) => {
  const [copiedStep, setCopiedStep] = useState<string | null>(null);

  const copyToClipboard = (text: string, step: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(step);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  const corsOrigins = [
    'http://localhost:5173',
    'https://*.webcontainer-api.io',
    'https://*.bolt.new',
    'https://seu-dominio.vercel.app'
  ];

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg border border-cyan-500/50 p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="cyber-border rounded-full p-2">
              <Database className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-cyan-400">Configuração do Supabase</h2>
              <p className="text-gray-400">Guia completo para resolver problemas de CORS e configuração</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Erro CORS Alert */}
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
            <div>
              <h3 className="text-red-400 font-semibold mb-2">Erro de CORS Detectado</h3>
              <p className="text-gray-300 text-sm">
                O erro "Failed to fetch" indica que o Supabase está bloqueando requisições do seu domínio. 
                Siga os passos abaixo para resolver.
              </p>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-6">
          {/* Step 1: Create Supabase Project */}
          <div className="bg-gray-800/50 p-6 rounded-lg border border-cyan-500/30">
            <h3 className="text-lg font-bold text-cyan-400 mb-4 flex items-center">
              <span className="bg-cyan-500 text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">1</span>
              Criar Projeto no Supabase
            </h3>
            <div className="space-y-3">
              <p className="text-gray-300">Se ainda não tem um projeto:</p>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-400 ml-4">
                <li>Acesse <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">supabase.com</a></li>
                <li>Clique em "Start your project"</li>
                <li>Faça login com GitHub</li>
                <li>Clique em "New Project"</li>
                <li>Escolha um nome e senha para o banco</li>
                <li>Aguarde a criação (2-3 minutos)</li>
              </ol>
            </div>
          </div>

          {/* Step 2: Configure CORS */}
          <div className="bg-gray-800/50 p-6 rounded-lg border border-red-500/30">
            <h3 className="text-lg font-bold text-red-400 mb-4 flex items-center">
              <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">2</span>
              Configurar CORS (CRÍTICO)
            </h3>
            <div className="space-y-4">
              <p className="text-gray-300">No painel do Supabase:</p>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-400 ml-4">
                <li>Vá em <strong className="text-white">Settings → API</strong></li>
                <li>Role até a seção <strong className="text-white">"CORS Origins"</strong></li>
                <li>Adicione as seguintes origens (uma por linha):</li>
              </ol>
              
              <div className="bg-black/50 p-4 rounded-lg border border-gray-600">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-300">Origens CORS para adicionar:</span>
                  <button
                    onClick={() => copyToClipboard(corsOrigins.join('\n'), 'cors')}
                    className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 text-sm"
                  >
                    {copiedStep === 'cors' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedStep === 'cors' ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
                <div className="space-y-1 text-sm font-mono">
                  {corsOrigins.map((origin, index) => (
                    <div key={index} className="text-cyan-400">{origin}</div>
                  ))}
                </div>
              </div>
              
              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded p-3">
                <p className="text-yellow-400 text-sm">
                  <strong>Importante:</strong> Substitua "seu-dominio.vercel.app" pelo seu domínio real quando fizer deploy.
                </p>
              </div>
            </div>
          </div>

          {/* Step 3: Get Credentials */}
          <div className="bg-gray-800/50 p-6 rounded-lg border border-green-500/30">
            <h3 className="text-lg font-bold text-green-400 mb-4 flex items-center">
              <span className="bg-green-500 text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">3</span>
              Obter Credenciais
            </h3>
            <div className="space-y-4">
              <p className="text-gray-300">No painel do Supabase, vá em <strong>Settings → API</strong>:</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-black/50 p-4 rounded-lg border border-gray-600">
                  <div className="flex items-center space-x-2 mb-2">
                    <Database className="w-4 h-4 text-green-400" />
                    <span className="text-sm font-medium text-gray-300">Project URL</span>
                  </div>
                  <code className="text-xs text-green-400 break-all">
                    https://xxxxxxxxxxx.supabase.co
                  </code>
                </div>
                
                <div className="bg-black/50 p-4 rounded-lg border border-gray-600">
                  <div className="flex items-center space-x-2 mb-2">
                    <Key className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium text-gray-300">Anon Key</span>
                  </div>
                  <code className="text-xs text-blue-400 break-all">
                    eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
                  </code>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4: Configure Environment */}
          <div className="bg-gray-800/50 p-6 rounded-lg border border-purple-500/30">
            <h3 className="text-lg font-bold text-purple-400 mb-4 flex items-center">
              <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">4</span>
              Configurar Variáveis de Ambiente
            </h3>
            <div className="space-y-4">
              <p className="text-gray-300">Edite o arquivo <code className="bg-gray-700 px-2 py-1 rounded">.env</code> na raiz do projeto:</p>
              
              <div className="bg-black/50 p-4 rounded-lg border border-gray-600">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-300">Conteúdo do arquivo .env:</span>
                  <button
                    onClick={() => copyToClipboard(`VITE_SUPABASE_URL=https://seu-projeto-id.supabase.co\nVITE_SUPABASE_ANON_KEY=sua_chave_anonima_aqui`, 'env')}
                    className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 text-sm"
                  >
                    {copiedStep === 'env' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedStep === 'env' ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
                <pre className="text-sm text-cyan-400">
{`VITE_SUPABASE_URL=https://seu-projeto-id.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_aqui`}
                </pre>
              </div>
              
              <div className="bg-blue-500/20 border border-blue-500/30 rounded p-3">
                <p className="text-blue-400 text-sm">
                  <strong>Dica:</strong> Substitua os valores pelos dados reais do seu projeto Supabase.
                </p>
              </div>
            </div>
          </div>

          {/* Step 5: Run Migrations */}
          <div className="bg-gray-800/50 p-6 rounded-lg border border-yellow-500/30">
            <h3 className="text-lg font-bold text-yellow-400 mb-4 flex items-center">
              <span className="bg-yellow-500 text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">5</span>
              Executar Migrações do Banco
            </h3>
            <div className="space-y-4">
              <p className="text-gray-300">No painel do Supabase, vá em <strong>SQL Editor</strong>:</p>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-400 ml-4">
                <li>Clique em "SQL Editor" no menu lateral</li>
                <li>Clique em "New Query"</li>
                <li>Copie e cole o conteúdo do arquivo <code>supabase/migrations/20250619011237_azure_wood.sql</code></li>
                <li>Clique em "Run" para executar</li>
                <li>Verifique se as tabelas foram criadas em "Table Editor"</li>
              </ol>
              
              <div className="bg-green-500/20 border border-green-500/30 rounded p-3">
                <p className="text-green-400 text-sm">
                  <strong>Sucesso:</strong> Você deve ver as tabelas: projects, testimonials, talks, site_settings
                </p>
              </div>
            </div>
          </div>

          {/* Step 6: Test Connection */}
          <div className="bg-gray-800/50 p-6 rounded-lg border border-cyan-500/30">
            <h3 className="text-lg font-bold text-cyan-400 mb-4 flex items-center">
              <span className="bg-cyan-500 text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">6</span>
              Testar Conexão
            </h3>
            <div className="space-y-3">
              <p className="text-gray-300">Após configurar tudo:</p>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-400 ml-4">
                <li>Recarregue a página (F5)</li>
                <li>Verifique o status do Supabase no canto superior direito</li>
                <li>Deve aparecer "Supabase: Conectado" em verde</li>
                <li>Os dados do site devem carregar normalmente</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 bg-gray-800/30 p-4 rounded-lg border border-gray-600">
          <h4 className="text-white font-semibold mb-3">Links Úteis</h4>
          <div className="grid md:grid-cols-2 gap-3 text-sm">
            <a 
              href="https://supabase.com/dashboard" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Dashboard Supabase</span>
            </a>
            <a 
              href="https://supabase.com/docs/guides/getting-started" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Documentação Oficial</span>
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-700 text-center">
          <p className="text-gray-400 text-sm">
            Após seguir todos os passos, o erro de CORS deve ser resolvido e o site funcionará normalmente.
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

export default SupabaseSetupGuide;