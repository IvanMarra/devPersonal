import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Menu, X, Terminal } from 'lucide-react';
const MobileMenu = ({ sections, activeSection, onSectionChange, isAuthenticated, onAdminClick }) => {
    const [isOpen, setIsOpen] = useState(false);
    // Fechar menu quando a seção mudar
    useEffect(() => {
        setIsOpen(false);
    }, [activeSection]);
    // Prevenir scroll quando menu estiver aberto
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }
        else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);
    return (_jsxs(_Fragment, { children: [_jsx("button", { onClick: () => setIsOpen(!isOpen), className: "md:hidden p-2 rounded-lg border border-cyan-400/50 text-cyan-400 hover:bg-cyan-500/20 transition-all duration-300 relative z-50", "aria-label": "Toggle menu", children: _jsxs("div", { className: "relative w-6 h-6", children: [_jsx(Menu, { className: `absolute inset-0 w-6 h-6 transition-all duration-300 ${isOpen ? 'opacity-0 rotate-45 scale-0' : 'opacity-100 rotate-0 scale-100'}` }), _jsx(X, { className: `absolute inset-0 w-6 h-6 transition-all duration-300 ${isOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-45 scale-0'}` })] }) }), _jsx("div", { className: `fixed inset-0 bg-black/80 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`, onClick: () => setIsOpen(false) }), _jsxs("div", { className: `fixed top-0 right-0 h-full w-80 bg-black/95 backdrop-blur-md border-l border-cyan-500/30 z-50 transform transition-transform duration-300 ease-in-out md:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'}`, children: [_jsxs("div", { className: "flex items-center justify-between p-6 border-b border-cyan-500/30", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Terminal, { className: "w-6 h-6 text-cyan-400" }), _jsx("span", { className: "text-xl font-bold text-cyan-400", children: "DEVIEM" })] }), _jsx("button", { onClick: () => setIsOpen(false), className: "p-2 rounded-lg text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/20 transition-all duration-300", children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsx("nav", { className: "p-6 space-y-2", children: sections.map((section, index) => (_jsxs("button", { onClick: () => onSectionChange(section.id), className: `w-full flex items-center space-x-3 px-4 py-4 rounded-lg transition-all duration-300 text-left ${activeSection === section.id
                                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-400 shadow-cyan-glow'
                                : 'text-gray-400 hover:text-cyan-400 hover:bg-gray-800/50'}`, style: {
                                animationDelay: `${index * 50}ms`,
                                animation: isOpen ? 'slideInRight 0.3s ease-out forwards' : 'none'
                            }, children: [_jsx(section.icon, { className: "w-5 h-5" }), _jsx("span", { className: "font-medium", children: section.title })] }, section.id))) }), _jsx("div", { className: "absolute top-20 right-4 w-2 h-2 bg-cyan-400/30 rounded-full animate-pulse" }), _jsx("div", { className: "absolute top-32 right-8 w-1 h-1 bg-purple-400/50 rounded-full animate-pulse", style: { animationDelay: '1s' } }), _jsx("div", { className: "absolute bottom-32 right-6 w-1.5 h-1.5 bg-green-400/40 rounded-full animate-pulse", style: { animationDelay: '2s' } })] }), _jsx("style", { jsx: true, children: `
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .shadow-cyan-glow {
          box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
        }
      ` })] }));
};
export default MobileMenu;
