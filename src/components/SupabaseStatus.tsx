import React, { useState, useEffect } from 'react';
import { Database, CheckCircle, XCircle, AlertCircle, RefreshCw, Info, ExternalLink, Settings } from 'lucide-react';
import { isSupabaseConfigured, getEnvironmentInfo, testSupabaseConnection } from '../lib/supabase';
import SupabaseSetupGuide from './SupabaseSetupGuide';

const SupabaseStatus: React.FC = () => {
  const [status, setStatus] = useState<'checking' | 'connected' | 'disconnected' | 'error'>('checking');
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<'config' | 'network' | 'cors' | 'unknown'>('unknown');
  const [showDetails, setShowDetails] = useState(false);
  const [showSetupGuide, setShowSetupGuide] = useState(false);

  const checkConnection = async () => {
    setStatus('checking');
    setError(null);
    setErrorType('unknown');

    const envInfo = getEnvironmentInfo();

    if (!isSupabaseConfigured()) {
      setStatus('disconnected');
      setErrorType('config');
      if (envInfo.isProduction) {
        setError('Configure as variáveis de ambiente no Vercel/Netlify');
      } else {
        setError('Variáveis de ambiente não configuradas');
      }
      return;
    }

    try {
      const result = await testSupabaseConnection(10000); // 10 second timeout
      
      if (result.success) {
        setStatus('connected');
        setError(null);
      } else {
        setStatus('error');
        setError(result.error || 'Erro desconhecido');
        
        // Determine error type based on error message
        if (result.error?.includes('Failed to fetch') || result.error?.includes('fetch')) {
          setErrorType('cors');
        } else if (result.error?.includes('network') || result.error?.includes('timeout')) {
          setErrorType('network');
        } else {
          setErrorType('unknown');
        }
      }
    } catch (err) {
      setStatus('error');
      const errorMessage = err instanceof Error ? err.message : 'Erro de conexão com Supabase';
      setError(errorMessage);
      
      // Determine error type
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('fetch')) {
        setErrorType('cors');
      } else if (errorMessage.includes('network') || errorMessage.includes('timeout')) {
        setErrorType('network');
      } else {
        setErrorType('unknown');
      }
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  const getStatusIcon = () => {
    switch (status) {
      case 'checking':
        return <RefreshCw className="w-4 h-4 animate-spin" />;
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'disconnected':
        return <XCircle className="w-4 h-4 text-yellow-400" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'checking':
        return 'Verificando...';
      case 'connected':
        return 'Conectado';
      case 'disconnected':
        return 'Desconectado';
      case 'error':
        return 'Erro';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'checking':
        return 'text-cyan-400';
      case 'connected':
        return 'text-green-400';
      case 'disconnected':
        return 'text-yellow-400';
      case 'error':
        return 'text-red-400';
    }
  };

  const envInfo = getEnvironmentInfo();

  return (
    <>
      <div className="fixed top-4 right-4 z-50">
        <div className={`bg-black/80 backdrop-blur-sm border rounded-lg p-3 flex items-center space-x-2 ${
          status === 'connected' ? 'border-green-500/30' :
          status === 'disconnected' ? 'border-yellow-500/30' :
          status === 'error' ? 'border-red-500/30' :
          'border-cyan-500/30'
        }`}>
          <Database className="w-4 h-4 text-gray-400" />
          {getStatusIcon()}
          <span className={`text-sm font-medium ${getStatusColor()}`}>
            Supabase: {getStatusText()}
          </span>
          
          {/* Setup Guide Button */}
          {(status === 'disconnected' || status === 'error') && (
            <button
              onClick={() => setShowSetupGuide(true)}
              className="p-1 hover:bg-gray-700 rounded transition-colors"
              title="Guia de configuração"
            >
              <Settings className="w-3 h-3 text-cyan-400" />
            </button>
          )}
          
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="p-1 hover:bg-gray-700 rounded transition-colors"
            title="Ver detalhes"
          >
            <Info className="w-3 h-3 text-gray-400" />
          </button>
          {status !== 'checking' && (
            <button
              onClick={checkConnection}
              className="p-1 hover:bg-gray-700 rounded transition-colors"
              title="Verificar conexão"
            >
              <RefreshCw className="w-3 h-3 text-gray-400" />
            </button>
          )}
        </div>
        
        {error && (
          <div className={`mt-2 border rounded-lg p-2 max-w-sm ${
            errorType === 'cors' ? 'bg-red-500/20 border-red-500/30' :
            errorType === 'config' ? 'bg-yellow-500/20 border-yellow-500/30' :
            'bg-red-500/20 border-red-500/30'
          }`}>
            <p className={`text-xs font-medium ${
              errorType === 'cors' ? 'text-red-400' :
              errorType === 'config' ? 'text-yellow-400' :
              'text-red-400'
            }`}>
              {error}
            </p>
            
            {errorType === 'cors' && (
              <div className="text-gray-400 text-xs mt-1">
                <p className="text-red-400 font-medium mb-1">Erro de CORS detectado!</p>
                <button
                  onClick={() => setShowSetupGuide(true)}
                  className="inline-flex items-center text-cyan-400 hover:text-cyan-300 mt-1"
                >
                  <Settings className="w-3 h-3 mr-1" />
                  Ver guia de configuração
                </button>
              </div>
            )}
            
            {errorType === 'config' && !envInfo.isProduction && (
              <div className="text-gray-400 text-xs mt-1">
                <p className="text-yellow-400 font-medium mb-1">Configuração necessária:</p>
                <button
                  onClick={() => setShowSetupGuide(true)}
                  className="inline-flex items-center text-cyan-400 hover:text-cyan-300 mt-1"
                >
                  <Settings className="w-3 h-3 mr-1" />
                  Configurar Supabase
                </button>
              </div>
            )}
          </div>
        )}

        {showDetails && (
          <div className="mt-2 bg-gray-900/90 border border-gray-600 rounded-lg p-3 max-w-xs">
            <h4 className="text-cyan-400 text-sm font-semibold mb-2">Detalhes do Ambiente</h4>
            <div className="text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-400">Ambiente:</span>
                <span className="text-white">{envInfo.isProduction ? 'Produção' : 'Desenvolvimento'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">URL:</span>
                <span className="text-white">{envInfo.hasSupabaseConfig ? '✓' : '✗'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Chave:</span>
                <span className="text-white">{envInfo.hasAnonKey ? '✓' : '✗'}</span>
              </div>
              {error && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Tipo de erro:</span>
                  <span className="text-white capitalize">{errorType}</span>
                </div>
              )}
              {envInfo.hasSupabaseConfig && (
                <div className="mt-2 pt-2 border-t border-gray-700">
                  <p className="text-gray-400 text-xs break-all">URL: {envInfo.supabaseUrl}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Setup Guide Modal */}
      {showSetupGuide && (
        <SupabaseSetupGuide onClose={() => setShowSetupGuide(false)} />
      )}
    </>
  );
};

export default SupabaseStatus;