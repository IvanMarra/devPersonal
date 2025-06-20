import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Info, X, ExternalLink, GitBranch, Calendar, Code, Zap } from 'lucide-react';
import packageJson from '../../package.json';
const VersionInfo = () => {
    const [showModal, setShowModal] = useState(false);
    const currentVersion = packageJson.version;
    const changelog = packageJson.changelog;
    const getVersionType = (version) => {
        const [major, minor, patch] = version.split('.').map(Number);
        if (patch > 0)
            return { type: 'patch', color: 'text-green-400', icon: '🐛' };
        if (minor > 0)
            return { type: 'minor', color: 'text-blue-400', icon: '✨' };
        return { type: 'major', color: 'text-purple-400', icon: '🚀' };
    };
    const versionInfo = getVersionType(currentVersion);
    return (_jsxs(_Fragment, { children: [_jsxs("button", { onClick: () => setShowModal(true), className: "fixed bottom-4 right-4 bg-black/80 backdrop-blur-sm border border-cyan-500/30 rounded-lg px-3 py-2 flex items-center space-x-2 hover:border-cyan-400 transition-all duration-300 z-40", children: [_jsx(GitBranch, { className: "w-4 h-4 text-cyan-400" }), _jsxs("span", { className: `text-sm font-mono ${versionInfo.color}`, children: ["v", currentVersion] }), _jsx(Info, { className: "w-3 h-3 text-gray-400" })] }), showModal && (_jsx("div", { className: "fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4", children: _jsxs("div", { className: "bg-gray-900 rounded-lg border border-cyan-500/50 p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "cyber-border rounded-full p-2", children: _jsx(Code, { className: "w-6 h-6 text-cyan-400" }) }), _jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-cyan-400", children: "DevIem Portfolio" }), _jsxs("p", { className: "text-gray-400", children: ["Vers\u00E3o ", currentVersion, " \u2022 ", versionInfo.icon, " ", versionInfo.type] })] })] }), _jsx("button", { onClick: () => setShowModal(false), className: "p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors", children: _jsx(X, { className: "w-6 h-6" }) })] }), _jsxs("div", { className: "mb-8", children: [_jsxs("h3", { className: "text-lg font-bold text-purple-400 mb-4 flex items-center", children: [_jsx(Zap, { className: "w-5 h-5 mr-2" }), "Stack Tecnol\u00F3gico"] }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [
                                        { name: 'React', version: '18.3.1', color: 'text-blue-400' },
                                        { name: 'TypeScript', version: '5.5.3', color: 'text-blue-600' },
                                        { name: 'Vite', version: '5.4.2', color: 'text-yellow-400' },
                                        { name: 'Tailwind', version: '3.4.1', color: 'text-cyan-400' },
                                        { name: 'Supabase', version: '2.39.0', color: 'text-green-400' },
                                        { name: 'Lucide', version: '0.344.0', color: 'text-orange-400' },
                                        { name: 'ESLint', version: '9.9.1', color: 'text-purple-400' },
                                        { name: 'PostCSS', version: '8.4.35', color: 'text-red-400' }
                                    ].map((tech, index) => (_jsxs("div", { className: "bg-gray-800/50 p-3 rounded-lg border border-gray-700", children: [_jsx("div", { className: `font-semibold ${tech.color}`, children: tech.name }), _jsxs("div", { className: "text-xs text-gray-400", children: ["v", tech.version] })] }, index))) })] }), _jsxs("div", { className: "mb-6", children: [_jsxs("h3", { className: "text-lg font-bold text-cyan-400 mb-4 flex items-center", children: [_jsx(Calendar, { className: "w-5 h-5 mr-2" }), "Hist\u00F3rico de Vers\u00F5es"] }), _jsx("div", { className: "space-y-6", children: Object.entries(changelog)
                                        .sort(([a], [b]) => b.localeCompare(a))
                                        .map(([version, info]) => {
                                        const isCurrentVersion = version === currentVersion;
                                        const versionType = getVersionType(version);
                                        return (_jsxs("div", { className: `border rounded-lg p-4 ${isCurrentVersion
                                                ? 'border-cyan-400 bg-cyan-500/10'
                                                : 'border-gray-700 bg-gray-800/30'}`, children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsxs("span", { className: `text-lg font-bold ${versionType.color}`, children: [versionType.icon, " v", version] }), isCurrentVersion && (_jsx("span", { className: "px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded-full border border-cyan-500/30", children: "Atual" }))] }), _jsx("span", { className: "text-sm text-gray-400", children: info.date })] }), _jsx("ul", { className: "space-y-1", children: info.changes.map((change, index) => (_jsxs("li", { className: "text-sm text-gray-300 flex items-start", children: [_jsx("span", { className: "mr-2 mt-1", children: "\u2022" }), _jsx("span", { children: change })] }, index))) })] }, version));
                                    }) })] }), _jsxs("div", { className: "bg-blue-500/10 border border-blue-500/30 rounded-lg p-4", children: [_jsxs("h4", { className: "text-blue-400 font-semibold mb-3 flex items-center", children: [_jsx(ExternalLink, { className: "w-4 h-4 mr-2" }), "Instru\u00E7\u00F5es para Sincroniza\u00E7\u00E3o Git Offline"] }), _jsxs("div", { className: "grid md:grid-cols-2 gap-4 text-sm", children: [_jsxs("div", { children: [_jsx("h5", { className: "text-blue-300 font-medium mb-2", children: "1. Verificar Vers\u00E3o Local" }), _jsx("code", { className: "bg-black/50 p-2 rounded text-xs block text-gray-300", children: "cat package.json | grep version" })] }), _jsxs("div", { children: [_jsx("h5", { className: "text-blue-300 font-medium mb-2", children: "2. Comparar Vers\u00F5es" }), _jsxs("p", { className: "text-gray-400 text-xs", children: ["Compare sua vers\u00E3o local com a vers\u00E3o atual: ", _jsxs("span", { className: "text-cyan-400", children: ["v", currentVersion] })] })] }), _jsxs("div", { children: [_jsx("h5", { className: "text-blue-300 font-medium mb-2", children: "3. Baixar Mudan\u00E7as" }), _jsxs("code", { className: "bg-black/50 p-2 rounded text-xs block text-gray-300", children: ["git log --name-only v[sua-vers\u00E3o]..v", currentVersion] })] }), _jsxs("div", { children: [_jsx("h5", { className: "text-blue-300 font-medium mb-2", children: "4. Atualizar Depend\u00EAncias" }), _jsx("code", { className: "bg-black/50 p-2 rounded text-xs block text-gray-300", children: "npm install" })] })] })] }), _jsxs("div", { className: "mt-6 pt-4 border-t border-gray-700 text-center", children: [_jsxs("p", { className: "text-gray-400 text-sm", children: ["Desenvolvido com \u2764\uFE0F por ", _jsx("span", { className: "text-cyan-400 font-semibold", children: "DevIem" })] }), _jsx("p", { className: "text-gray-500 text-xs mt-1", children: "Portfolio Profissional \u2022 Cybersecurity \u2022 Mentoring \u2022 AI Specialist" })] })] }) })), _jsx("style", { dangerouslySetInnerHTML: {
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
                } })] }));
};
export default VersionInfo;
