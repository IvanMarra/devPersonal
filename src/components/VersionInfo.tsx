import React, { useState } from 'react';
import { Info, X, ExternalLink, GitBranch, Calendar, Code, Zap } from 'lucide-react';
import packageJson from '../../package.json';

const VersionInfo: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  const currentVersion = packageJson.version;
  const changelog = packageJson.changelog as Record<string, { date: string; changes: string[] }>;

  const getVersionType = (version: string) => {
    const [major, minor, patch] = version.split('.').map(Number);
    if (patch > 0) return { type: 'patch', color: 'text-green-400', icon: '🐛' };
    if (minor > 0) return { type: 'minor', color: 'text-blue-400', icon: '✨' };
    return { type: 'major', color: 'text-purple-400', icon: '🚀' };
  };

  const versionInfo = getVersionType(currentVersion);

  return (
    <>
      {/* Version Button */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-4 right-4 bg-black/80 backdrop-blur-sm border border-cyan-500/30 rounded-lg px-3 py-2 flex items-center space-x-2 hover:border-cyan-400 transition-all duration-300 z-40"
      >
        <GitBranch className="w-4 h-4 text-cyan-400" />
        <span className={`text-sm font-mono ${versionInfo.color}`}>
          v{currentVersion}
        </span>
        <Info className="w-3 h-3 text-gray-400" />
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-lg border border-cyan-500/50 p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="cyber-border rounded-full p-2">
                  <Code className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-cyan-400">DevIem Portfolio</h2>
                  <p className="text-gray-400">Versão {currentVersion} • {versionInfo.icon} {versionInfo.type}</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Tech Stack */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-purple-400 mb-4 flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                Stack Tecnológico
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'React', version: '18.3.1', color: 'text-blue-400' },
                  { name: 'TypeScript', version: '5.5.3', color: 'text-blue-600' },
                  { name: 'Vite', version: '5.4.2', color: 'text-yellow-400' },
                  { name: 'Tailwind', version: '3.4.1', color: 'text-cyan-400' },
                  { name: 'Supabase', version: '2.39.0', color: 'text-green-400' },
                  { name: 'Lucide', version: '0.344.0', color: 'text-orange-400' },
                  { name: 'ESLint', version: '9.9.1', color: 'text-purple-400' },
                  { name: 'PostCSS', version: '8.4.35', color: 'text-red-400' }
                ].map((tech, index) => (
                  <div key={index} className="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                    <div className={`font-semibold ${tech.color}`}>{tech.name}</div>
                    <div className="text-xs text-gray-400">v{tech.version}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Changelog */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-cyan-400 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Histórico de Versões
              </h3>
              <div className="space-y-6">
                {Object.entries(changelog)
                  .sort(([a], [b]) => b.localeCompare(a))
                  .map(([version, info]) => {
                    const isCurrentVersion = version === currentVersion;
                    const versionType = getVersionType(version);
                    
                    return (
                      <div 
                        key={version} 
                        className={`border rounded-lg p-4 ${
                          isCurrentVersion 
                            ? 'border-cyan-400 bg-cyan-500/10' 
                            : 'border-gray-700 bg-gray-800/30'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <span className={`text-lg font-bold ${versionType.color}`}>
                              {versionType.icon} v{version}
                            </span>
                            {isCurrentVersion && (
                              <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded-full border border-cyan-500/30">
                                Atual
                              </span>
                            )}
                          </div>
                          <span className="text-sm text-gray-400">{info.date}</span>
                        </div>
                        <ul className="space-y-1">
                          {info.changes.map((change, index) => (
                            <li key={index} className="text-sm text-gray-300 flex items-start">
                              <span className="mr-2 mt-1">•</span>
                              <span>{change}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Sync Instructions */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <h4 className="text-blue-400 font-semibold mb-3 flex items-center">
                <ExternalLink className="w-4 h-4 mr-2" />
                Instruções para Sincronização Git Offline
              </h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h5 className="text-blue-300 font-medium mb-2">1. Verificar Versão Local</h5>
                  <code className="bg-black/50 p-2 rounded text-xs block text-gray-300">
                    cat package.json | grep version
                  </code>
                </div>
                <div>
                  <h5 className="text-blue-300 font-medium mb-2">2. Comparar Versões</h5>
                  <p className="text-gray-400 text-xs">
                    Compare sua versão local com a versão atual: <span className="text-cyan-400">v{currentVersion}</span>
                  </p>
                </div>
                <div>
                  <h5 className="text-blue-300 font-medium mb-2">3. Baixar Mudanças</h5>
                  <code className="bg-black/50 p-2 rounded text-xs block text-gray-300">
                    git log --name-only v[sua-versão]..v{currentVersion}
                  </code>
                </div>
                <div>
                  <h5 className="text-blue-300 font-medium mb-2">4. Atualizar Dependências</h5>
                  <code className="bg-black/50 p-2 rounded text-xs block text-gray-300">
                    npm install
                  </code>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-gray-700 text-center">
              <p className="text-gray-400 text-sm">
                Desenvolvido com ❤️ por <span className="text-cyan-400 font-semibold">DevIem</span>
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Portfolio Profissional • Cybersecurity • Mentoring • AI Specialist
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Custom CSS usando style tag normal */}
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
    </>
  );
};

export default VersionInfo;