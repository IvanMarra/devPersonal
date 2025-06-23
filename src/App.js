import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Code, Shield, Users, MessageSquare, Mic, GraduationCap, ChevronDown, Terminal, Zap, Brain, Eye, Menu, X } from 'lucide-react';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';
import SupabaseStatus from './components/SupabaseStatus';
import VersionInfo from './components/VersionInfo';
import { useFrontendData } from './hooks/useSupabaseData';
// Matrix rain effect component
const MatrixRain = () => {
    useEffect(() => {
        const canvas = document.getElementById('matrix-canvas');
        if (!canvas)
            return;
        const ctx = canvas.getContext('2d');
        if (!ctx)
            return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
        const matrixArray = matrix.split("");
        const fontSize = 10;
        const columns = canvas.width / fontSize;
        const drops = [];
        for (let i = 0; i < columns; i++) {
            drops[i] = 1;
        }
        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#00ff00';
            ctx.font = fontSize + 'px monospace';
            for (let i = 0; i < drops.length; i++) {
                const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };
        const interval = setInterval(draw, 35);
        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);
        return () => {
            clearInterval(interval);
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    return (_jsx("canvas", { id: "matrix-canvas", className: "fixed inset-0 z-0 opacity-20", style: { pointerEvents: 'none' } }));
};
// Mobile Menu Component - RESPONSIVIDADE MELHORADA
const MobileMenu = ({ sections, activeSection, onSectionChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    useEffect(() => {
        setIsOpen(false);
    }, [activeSection]);
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
    return (_jsxs(_Fragment, { children: [_jsx("button", { onClick: () => setIsOpen(!isOpen), className: "md:hidden p-2 rounded-lg border border-cyan-400/50 text-cyan-400 hover:bg-cyan-500/20 transition-all duration-300 relative z-50", children: _jsxs("div", { className: "relative w-6 h-6", children: [_jsx(Menu, { className: `absolute inset-0 w-6 h-6 transition-all duration-300 ${isOpen ? 'opacity-0 rotate-45 scale-0' : 'opacity-100 rotate-0 scale-100'}` }), _jsx(X, { className: `absolute inset-0 w-6 h-6 transition-all duration-300 ${isOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-45 scale-0'}` })] }) }), _jsx("div", { className: `fixed inset-0 bg-black/80 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`, onClick: () => setIsOpen(false) }), _jsxs("div", { className: `fixed top-0 right-0 h-full w-full max-w-sm bg-black/95 backdrop-blur-md border-l border-cyan-500/30 z-50 transform transition-transform duration-300 ease-in-out md:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'}`, children: [_jsxs("div", { className: "flex items-center justify-between p-4 sm:p-6 border-b border-cyan-500/30", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Terminal, { className: "w-6 h-6 text-cyan-400" }), _jsx("span", { className: "text-xl font-bold text-cyan-400", children: "DEVIEM" })] }), _jsx("button", { onClick: () => setIsOpen(false), className: "p-2 rounded-lg text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/20 transition-all duration-300", children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsx("nav", { className: "p-4 sm:p-6 space-y-2", children: sections.map((section, index) => (_jsxs("button", { onClick: () => onSectionChange(section.id), className: `w-full flex items-center space-x-3 px-4 py-4 rounded-lg transition-all duration-300 text-left ${activeSection === section.id
                                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-400 shadow-cyan-glow'
                                : 'text-gray-400 hover:text-cyan-400 hover:bg-gray-800/50'}`, style: {
                                animationDelay: `${index * 50}ms`,
                                animation: isOpen ? 'slideInRight 0.3s ease-out forwards' : 'none'
                            }, children: [_jsx(section.icon, { className: "w-5 h-5" }), _jsx("span", { className: "font-medium", children: section.title })] }, section.id))) })] })] }));
};
function App() {
    const [activeSection, setActiveSection] = useState('home');
    const [isAdminOpen, setIsAdminOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    // Usar dados do Supabase
    const { projects, testimonials, talks, settings, refreshAllData } = useFrontendData();
    useEffect(() => {
        // Verificar se já está autenticado
        const token = localStorage.getItem('deviem_admin_token');
        const session = localStorage.getItem('deviem_admin_session');
        if (token === 'authenticated' && session) {
            // Verificar se a sessão não expirou (24 horas)
            const sessionTime = parseInt(session);
            const now = Date.now();
            const twentyFourHours = 24 * 60 * 60 * 1000;
            if (now - sessionTime < twentyFourHours) {
                setIsAuthenticated(true);
            }
            else {
                // Sessão expirada
                localStorage.removeItem('deviem_admin_token');
                localStorage.removeItem('deviem_admin_session');
            }
        }
    }, []);
    // Função especial para acesso admin (sequência de teclas)
    useEffect(() => {
        let sequence = '';
        const adminSequence = 'deviem';
        let sequenceTimeout;
        const handleKeyPress = (e) => {
            if (!e.key)
                return;
            // Limpar timeout anterior
            if (sequenceTimeout) {
                clearTimeout(sequenceTimeout);
            }
            // Adicionar tecla à sequência
            sequence += e.key.toLowerCase();
            // Limitar o tamanho da sequência
            if (sequence.length > adminSequence.length) {
                sequence = sequence.slice(-adminSequence.length);
            }
            // Verificar se a sequência está correta
            if (sequence === adminSequence) {
                console.log('🔑 Sequência de acesso admin detectada!');
                if (isAuthenticated) {
                    setIsAdminOpen(true);
                }
                else {
                    setShowLogin(true);
                }
                sequence = ''; // Limpar sequência
                return;
            }
            // Definir timeout para limpar a sequência após 2 segundos de inatividade
            sequenceTimeout = setTimeout(() => {
                sequence = '';
            }, 2000);
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
            if (sequenceTimeout) {
                clearTimeout(sequenceTimeout);
            }
        };
    }, [isAuthenticated]);
    // Auto-refresh dos dados a cada 30 segundos
    useEffect(() => {
        const interval = setInterval(() => {
            console.log('🔄 Auto-refresh dos dados...');
            refreshAllData();
        }, 30000);
        return () => clearInterval(interval);
    }, [refreshAllData]);
    const handleLogin = (success) => {
        if (success) {
            setIsAuthenticated(true);
            setShowLogin(false);
            setIsAdminOpen(true);
            // Forçar refresh dos dados após login
            refreshAllData();
        }
        else {
            setShowLogin(false);
        }
    };
    const handleAdminClose = () => {
        setIsAdminOpen(false);
        // Forçar refresh dos dados após fechar admin
        refreshAllData();
    };
    const handleBackToFrontend = () => {
        setIsAdminOpen(false);
        setShowLogin(false);
        setActiveSection('home');
        // Forçar refresh dos dados
        refreshAllData();
    };
    const sections = [
        { id: 'home', title: 'Início', icon: Terminal },
        { id: 'about', title: 'Sobre', icon: Eye },
        { id: 'projects', title: 'Projetos', icon: Code },
        { id: 'testimonials', title: 'Depoimentos', icon: MessageSquare },
        { id: 'talks', title: 'Palestras', icon: Mic },
        { id: 'classes', title: 'Aulas Particulares', icon: GraduationCap },
    ];
    return (_jsxs("div", { className: "min-h-screen bg-black text-white overflow-x-hidden", children: [_jsx(MatrixRain, {}), _jsx(SupabaseStatus, {}), _jsx(VersionInfo, {}), _jsx("style", { dangerouslySetInnerHTML: {
                    __html: `
          .glitch-text {
            position: relative;
            animation: glitch 2s infinite;
          }
          
          .glitch-text::before,
          .glitch-text::after {
            content: attr(data-text);
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }
          
          .glitch-text::before {
            animation: glitch-1 0.5s infinite;
            color: #ff0000;
            z-index: -1;
          }
          
          .glitch-text::after {
            animation: glitch-2 0.5s infinite;
            color: #00ffff;
            z-index: -2;
          }
          
          @keyframes glitch {
            0%, 100% { transform: translate(0); }
            20% { transform: translate(-2px, 2px); }
            40% { transform: translate(-2px, -2px); }
            60% { transform: translate(2px, 2px); }
            80% { transform: translate(2px, -2px); }
          }
          
          @keyframes glitch-1 {
            0%, 100% { transform: translate(0); }
            20% { transform: translate(2px, -2px); }
            40% { transform: translate(-2px, 2px); }
            60% { transform: translate(2px, 2px); }
            80% { transform: translate(-2px, -2px); }
          }
          
          @keyframes glitch-2 {
            0%, 100% { transform: translate(0); }
            20% { transform: translate(-2px, 2px); }
            40% { transform: translate(2px, -2px); }
            60% { transform: translate(-2px, -2px); }
            80% { transform: translate(2px, 2px); }
          }
          
          .neon-glow {
            box-shadow: 0 0 20px currentColor, 0 0 40px currentColor, 0 0 60px currentColor;
          }
          
          .shadow-cyan-glow {
            box-shadow: 0 0 20px #00ffff, 0 0 40px #00ffff;
          }
          
          .shadow-purple-glow {
            box-shadow: 0 0 20px #8b5cf6, 0 0 40px #8b5cf6;
          }
          
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
          
          .typing-effect {
            overflow: hidden;
            border-right: 2px solid #00ffff;
            white-space: nowrap;
            animation: typing 3s steps(40, end), blink-caret 0.75s step-end infinite;
          }
          
          @keyframes typing {
            from { width: 0; }
            to { width: 100%; }
          }
          
          @keyframes blink-caret {
            from, to { border-color: transparent; }
            50% { border-color: #00ffff; }
          }

          .floating-animation {
            animation: floating 3s ease-in-out infinite;
          }

          @keyframes floating {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }

          .card-hover {
            transition: all 0.3s ease;
          }

          .card-hover:hover {
            transform: translateY(-8px) scale(1.02);
            box-shadow: 0 20px 40px rgba(0, 255, 255, 0.3);
          }

          .testimonial-card {
            background: linear-gradient(135deg, rgba(0, 255, 255, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(0, 255, 255, 0.2);
          }

          .project-card {
            background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(0, 255, 255, 0.1) 100%);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(139, 92, 246, 0.2);
          }

          .talk-card {
            background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(0, 255, 255, 0.1) 100%);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(34, 197, 94, 0.2);
          }

          .avatar-glow {
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
            animation: avatar-pulse 2s ease-in-out infinite alternate;
          }

          @keyframes avatar-pulse {
            from { box-shadow: 0 0 20px rgba(0, 255, 255, 0.5); }
            to { box-shadow: 0 0 30px rgba(0, 255, 255, 0.8); }
          }

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

          /* RESPONSIVIDADE MELHORADA */
          @media (max-width: 768px) {
            .glitch-text {
              font-size: 2.5rem !important;
            }
            
            .typing-effect {
              font-size: 1rem !important;
              white-space: normal;
              border-right: none;
              animation: none;
            }
            
            .card-hover:hover {
              transform: translateY(-4px) scale(1.01);
            }
            
            .floating-animation {
              animation: none;
            }
          }

          @media (max-width: 640px) {
            .glitch-text {
              font-size: 2rem !important;
            }
            
            .project-card, .testimonial-card, .talk-card {
              margin: 0.5rem 0;
            }
          }
        `
                } }), _jsx("nav", { className: "fixed top-0 w-full z-50 bg-black/80 backdrop-blur-sm border-b border-cyan-500/30", children: _jsx("div", { className: "container mx-auto px-4 sm:px-6 py-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Terminal, { className: "w-6 sm:w-8 h-6 sm:h-8 text-cyan-400" }), _jsx("div", { className: "text-xl sm:text-2xl font-bold text-cyan-400 glitch-text", children: "DEVIEM" })] }), _jsx("div", { className: "hidden md:flex space-x-6", children: sections.map((section) => (_jsxs("button", { onClick: () => setActiveSection(section.id), className: `flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${activeSection === section.id
                                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-400'
                                        : 'text-gray-400 hover:text-cyan-400'}`, children: [_jsx(section.icon, { className: "w-4 h-4" }), _jsx("span", { children: section.title })] }, section.id))) }), _jsx(MobileMenu, { sections: sections, activeSection: activeSection, onSectionChange: setActiveSection })] }) }) }), activeSection === 'home' && (_jsxs("section", { className: "min-h-screen flex items-center justify-center relative pt-20 px-4 sm:px-6", children: [_jsxs("div", { className: "text-center z-10 w-full max-w-4xl", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-bold mb-4 text-cyan-400 glitch-text", children: settings?.hero_title || 'DEVIEM' }), _jsx("div", { className: "text-base sm:text-lg md:text-xl lg:text-2xl text-purple-400 typing-effect", children: settings?.hero_subtitle || 'Desenvolvedor • Mentor • Especialista em IA • Ethical Hacker' })] }), _jsxs("div", { className: "mb-8 text-gray-300 max-w-2xl mx-auto", children: [_jsx("p", { className: "text-sm sm:text-base md:text-lg mb-4", children: settings?.about_text || 'Mais de 20 anos transformando ideias em realidade digital' }), _jsx("p", { className: "text-xs sm:text-sm md:text-base", children: settings?.site_description || 'Especialista em desenvolvimento web/mobile, inteligência artificial, cybersecurity e mentor de transição de carreira' })] }), _jsxs("div", { className: "flex flex-col sm:flex-row justify-center gap-4", children: [_jsxs("button", { onClick: () => setActiveSection('projects'), className: "px-4 sm:px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 border-2 bg-cyan-500/20 border-cyan-400 text-cyan-400 hover:bg-cyan-500/30 hover:shadow-cyan-glow", children: [_jsx(Code, { className: "w-4 sm:w-5 h-4 sm:h-5 inline mr-2" }), "Ver Projetos"] }), _jsxs("button", { onClick: () => setActiveSection('about'), className: "px-4 sm:px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 border-2 bg-purple-500/20 border-purple-400 text-purple-400 hover:bg-purple-500/30 hover:shadow-purple-glow", children: [_jsx(Eye, { className: "w-4 sm:w-5 h-4 sm:h-5 inline mr-2" }), "Sobre Mim"] })] })] }), _jsx("div", { className: "absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce", children: _jsx(ChevronDown, { className: "w-6 sm:w-8 h-6 sm:h-8 text-cyan-400" }) })] })), activeSection === 'about' && (_jsx("section", { className: "min-h-screen pt-24 px-4 sm:px-6", children: _jsxs("div", { className: "container mx-auto", children: [_jsx("h2", { className: "text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12 text-cyan-400 glitch-text", children: "Sobre DevIem" }), _jsxs("div", { className: "grid lg:grid-cols-3 gap-8 lg:gap-12 items-start", children: [_jsx("div", { className: "lg:col-span-1 flex justify-center", children: _jsxs("div", { className: "relative", children: [_jsx("div", { className: "cyber-border rounded-full p-1", children: settings?.profile_image_url ? (_jsx("img", { src: settings.profile_image_url, alt: "DevIem", className: "w-40 sm:w-48 md:w-64 h-40 sm:h-48 md:h-64 object-cover rounded-full floating-animation" })) : (_jsx("div", { className: "w-40 sm:w-48 md:w-64 h-40 sm:h-48 md:h-64 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full flex items-center justify-center border-2 border-cyan-400/50 floating-animation", children: _jsxs("div", { className: "text-center", children: [_jsx(Terminal, { className: "w-8 sm:w-12 md:w-16 h-8 sm:h-12 md:h-16 text-cyan-400 mx-auto mb-2" }), _jsx("p", { className: "text-cyan-400 font-bold text-sm sm:text-base", children: "DevIem" }), _jsx("p", { className: "text-purple-400 text-xs sm:text-sm", children: "20+ anos" })] }) })) }), _jsx("div", { className: "absolute -top-2 sm:-top-4 -right-2 sm:-right-4 w-6 sm:w-8 h-6 sm:h-8 bg-cyan-400/20 rounded-full border border-cyan-400 flex items-center justify-center floating-animation", children: _jsx(Shield, { className: "w-3 sm:w-4 h-3 sm:h-4 text-cyan-400" }) }), _jsx("div", { className: "absolute -bottom-2 sm:-bottom-4 -left-2 sm:-left-4 w-6 sm:w-8 h-6 sm:h-8 bg-purple-400/20 rounded-full border border-purple-400 flex items-center justify-center floating-animation", style: { animationDelay: '1s' }, children: _jsx(Brain, { className: "w-3 sm:w-4 h-3 sm:h-4 text-purple-400" }) }), _jsx("div", { className: "absolute top-1/2 -left-4 sm:-left-8 w-5 sm:w-6 h-5 sm:h-6 bg-green-400/20 rounded-full border border-green-400 flex items-center justify-center floating-animation", style: { animationDelay: '2s' }, children: _jsx(Code, { className: "w-2.5 sm:w-3 h-2.5 sm:h-3 text-green-400" }) })] }) }), _jsxs("div", { className: "lg:col-span-2 space-y-6 sm:space-y-8", children: [_jsx("div", { className: "cyber-border rounded-lg", children: _jsxs("div", { className: "bg-black p-4 sm:p-6 rounded-lg", children: [_jsxs("h3", { className: "text-lg sm:text-xl md:text-2xl font-bold text-purple-400 mb-4 flex items-center", children: [_jsx(Shield, { className: "w-5 sm:w-6 h-5 sm:h-6 mr-2" }), "Especialidades"] }), _jsx("div", { className: "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2", children: (settings?.skills || []).map((skill, index) => (_jsx("div", { className: "bg-gray-900/50 p-2 rounded text-xs sm:text-sm text-cyan-400 border border-cyan-500/20 hover:border-cyan-400 transition-all duration-300", children: skill }, index))) })] }) }), _jsxs("div", { className: "grid md:grid-cols-2 gap-4 sm:gap-6", children: [_jsxs("div", { className: "bg-gray-900/50 p-4 sm:p-6 rounded-lg border border-purple-500/30", children: [_jsx("h3", { className: "text-base sm:text-lg md:text-xl font-bold text-purple-400 mb-4", children: "Experi\u00EAncia" }), _jsxs("ul", { className: "space-y-3 text-gray-300 text-sm md:text-base", children: [_jsxs("li", { className: "flex items-start", children: [_jsx(Zap, { className: "w-4 sm:w-5 h-4 sm:h-5 text-cyan-400 mr-2 mt-0.5 flex-shrink-0" }), _jsx("span", { children: "20+ anos em desenvolvimento de sistemas" })] }), _jsxs("li", { className: "flex items-start", children: [_jsx(Shield, { className: "w-4 sm:w-5 h-4 sm:h-5 text-cyan-400 mr-2 mt-0.5 flex-shrink-0" }), _jsx("span", { children: "Preven\u00E7\u00E3o de ataques ao Governo Federal" })] }), _jsxs("li", { className: "flex items-start", children: [_jsx(Brain, { className: "w-4 sm:w-5 h-4 sm:h-5 text-cyan-400 mr-2 mt-0.5 flex-shrink-0" }), _jsx("span", { children: "Especialista em IA e Machine Learning" })] }), _jsxs("li", { className: "flex items-start", children: [_jsx(Users, { className: "w-4 sm:w-5 h-4 sm:h-5 text-cyan-400 mr-2 mt-0.5 flex-shrink-0" }), _jsx("span", { children: "Mentor de transi\u00E7\u00E3o de carreira" })] })] })] }), _jsxs("div", { className: "bg-gray-900/50 p-4 sm:p-6 rounded-lg border border-cyan-500/30", children: [_jsx("h3", { className: "text-base sm:text-lg md:text-xl font-bold text-cyan-400 mb-4", children: "Conquistas" }), _jsxs("ul", { className: "space-y-3 text-gray-300 text-sm md:text-base", children: [_jsxs("li", { className: "flex items-start", children: [_jsx("div", { className: "w-2 h-2 bg-cyan-400 rounded-full mt-2 mr-3 flex-shrink-0" }), _jsx("span", { children: "Sistemas banc\u00E1rios de alta seguran\u00E7a" })] }), _jsxs("li", { className: "flex items-start", children: [_jsx("div", { className: "w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0" }), _jsx("span", { children: "Plataformas e-commerce inteligentes" })] }), _jsxs("li", { className: "flex items-start", children: [_jsx("div", { className: "w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0" }), _jsx("span", { children: "Apps mobile com IoT e IA" })] }), _jsxs("li", { className: "flex items-start", children: [_jsx("div", { className: "w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0" }), _jsx("span", { children: "Consultoria em cybersecurity" })] })] })] })] })] })] })] }) })), activeSection === 'projects' && (_jsx("section", { className: "min-h-screen pt-24 px-4 sm:px-6", children: _jsxs("div", { className: "container mx-auto", children: [_jsx("h2", { className: "text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12 text-cyan-400 glitch-text", children: "Projetos Desenvolvidos" }), _jsx("div", { className: "grid sm:grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8", children: projects.map((project, index) => (_jsxs("div", { className: "project-card rounded-xl p-4 sm:p-6 card-hover group", children: [_jsxs("div", { className: "relative overflow-hidden rounded-lg mb-4 sm:mb-6", children: [_jsx("img", { src: project.image_url || "https://images.pexels.com/photos/159888/pexels-photo-159888.jpeg?auto=compress&cs=tinysrgb&w=800", alt: project.title, className: "w-full h-40 sm:h-48 object-cover transition-transform duration-300 group-hover:scale-110" }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-lg sm:text-xl font-bold text-purple-400 group-hover:text-cyan-400 transition-colors duration-300", children: project.title }), _jsx("p", { className: "text-gray-300 text-sm leading-relaxed", children: project.description }), _jsx("div", { className: "flex flex-wrap gap-2", children: (Array.isArray(project.tech) ? project.tech : []).map((tech, techIndex) => (_jsx("span", { className: "px-2 sm:px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-xs border border-cyan-500/30 hover:border-cyan-400 transition-colors duration-300", children: tech }, techIndex))) })] })] }, project.id))) })] }) })), activeSection === 'testimonials' && (_jsx("section", { className: "min-h-screen pt-24 px-4 sm:px-6", children: _jsxs("div", { className: "container mx-auto", children: [_jsx("h2", { className: "text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12 text-cyan-400 glitch-text", children: "Depoimentos" }), _jsx("div", { className: "grid sm:grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8", children: testimonials.map((testimonial, index) => (_jsxs("div", { className: "testimonial-card rounded-xl p-4 sm:p-6 card-hover group", children: [_jsxs("div", { className: "flex items-center space-x-4 mb-4 sm:mb-6", children: [_jsxs("div", { className: "relative", children: [_jsx("img", { src: testimonial.avatar_url || "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200", alt: testimonial.name, className: "w-12 sm:w-16 h-12 sm:h-16 object-cover rounded-full avatar-glow" }), _jsx("div", { className: "absolute -bottom-1 -right-1 w-4 sm:w-5 h-4 sm:h-5 bg-green-400 rounded-full border-2 border-black flex items-center justify-center", children: _jsx("div", { className: "w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white rounded-full" }) })] }), _jsxs("div", { children: [_jsx("h4", { className: "font-bold text-cyan-400 group-hover:text-purple-400 transition-colors duration-300 text-sm sm:text-base", children: testimonial.name }), _jsx("p", { className: "text-xs sm:text-sm text-gray-400", children: testimonial.role })] })] }), _jsxs("div", { className: "relative", children: [_jsx(MessageSquare, { className: "w-6 sm:w-8 h-6 sm:h-8 text-purple-400/30 absolute -top-2 -left-2" }), _jsxs("blockquote", { className: "text-gray-300 italic leading-relaxed pl-4 sm:pl-6 text-sm sm:text-base", children: ["\"", testimonial.text, "\""] })] }), _jsx("div", { className: "mt-4 sm:mt-6 flex justify-end", children: _jsx("div", { className: "flex space-x-1", children: [...Array(5)].map((_, i) => (_jsx("div", { className: "w-3 sm:w-4 h-3 sm:h-4 text-yellow-400", children: "\u2B50" }, i))) }) })] }, testimonial.id))) })] }) })), activeSection === 'talks' && (_jsx("section", { className: "min-h-screen pt-24 px-4 sm:px-6", children: _jsxs("div", { className: "container mx-auto", children: [_jsx("h2", { className: "text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12 text-cyan-400 glitch-text", children: "Palestras & Eventos" }), _jsx("div", { className: "max-w-4xl mx-auto space-y-6 sm:space-y-8", children: talks.map((talk, index) => (_jsx("div", { className: "talk-card rounded-xl p-4 sm:p-6 lg:p-8 card-hover group", children: _jsxs("div", { className: "flex flex-col lg:flex-row items-start space-y-4 lg:space-y-0 lg:space-x-6 sm:lg:space-x-8", children: [_jsx("div", { className: "flex-shrink-0 w-full lg:w-auto", children: _jsx("img", { src: talk.image_url || "https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=800", alt: talk.title, className: "w-full lg:w-40 xl:w-48 h-32 lg:h-32 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300" }) }), _jsxs("div", { className: "flex-1 space-y-4", children: [_jsxs("div", { className: "flex items-start space-x-3", children: [_jsx(Mic, { className: "w-5 sm:w-6 h-5 sm:h-6 text-green-400 mt-1 flex-shrink-0" }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg sm:text-xl lg:text-2xl font-bold text-green-400 group-hover:text-cyan-400 transition-colors duration-300 mb-2", children: talk.title }), _jsx("p", { className: "text-gray-300 leading-relaxed text-sm sm:text-base", children: talk.description })] })] }), _jsx("div", { className: "flex flex-wrap gap-2", children: (Array.isArray(talk.tags) ? talk.tags : []).map((tag, tagIndex) => (_jsxs("span", { className: "px-2 sm:px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs sm:text-sm border border-green-500/30 hover:border-green-400 transition-colors duration-300", children: ["#", tag] }, tagIndex))) })] })] }) }, talk.id))) })] }) })), activeSection === 'classes' && (_jsx("section", { className: "min-h-screen pt-24 px-4 sm:px-6", children: _jsxs("div", { className: "container mx-auto", children: [_jsx("h2", { className: "text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12 text-cyan-400 glitch-text", children: "Aulas Particulares" }), _jsxs("div", { className: "max-w-4xl mx-auto", children: [_jsxs("div", { className: "grid md:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12", children: [_jsxs("div", { className: "bg-gray-900/50 p-4 sm:p-6 rounded-lg border border-cyan-500/30", children: [_jsx(GraduationCap, { className: "w-8 sm:w-12 h-8 sm:h-12 text-cyan-400 mb-4" }), _jsx("h3", { className: "text-lg sm:text-xl md:text-2xl font-bold text-cyan-400 mb-4", children: "Metodologia" }), _jsxs("ul", { className: "space-y-3 text-gray-300 text-sm md:text-base", children: [_jsxs("li", { className: "flex items-start", children: [_jsx("div", { className: "w-2 h-2 bg-cyan-400 rounded-full mt-2 mr-3 flex-shrink-0" }), _jsx("span", { children: "Aulas 100% pr\u00E1ticas com projetos reais" })] }), _jsxs("li", { className: "flex items-start", children: [_jsx("div", { className: "w-2 h-2 bg-cyan-400 rounded-full mt-2 mr-3 flex-shrink-0" }), _jsx("span", { children: "Conte\u00FAdo personalizado por aluno" })] }), _jsxs("li", { className: "flex items-start", children: [_jsx("div", { className: "w-2 h-2 bg-cyan-400 rounded-full mt-2 mr-3 flex-shrink-0" }), _jsx("span", { children: "Suporte cont\u00EDnuo via WhatsApp" })] }), _jsxs("li", { className: "flex items-start", children: [_jsx("div", { className: "w-2 h-2 bg-cyan-400 rounded-full mt-2 mr-3 flex-shrink-0" }), _jsx("span", { children: "Flexibilidade de hor\u00E1rios" })] })] })] }), _jsxs("div", { className: "bg-gray-900/50 p-4 sm:p-6 rounded-lg border border-purple-500/30", children: [_jsx(Brain, { className: "w-8 sm:w-12 h-8 sm:h-12 text-purple-400 mb-4" }), _jsx("h3", { className: "text-lg sm:text-xl md:text-2xl font-bold text-purple-400 mb-4", children: "\u00C1reas de Ensino" }), _jsxs("ul", { className: "space-y-3 text-gray-300 text-sm md:text-base", children: [_jsxs("li", { className: "flex items-start", children: [_jsx("div", { className: "w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0" }), _jsx("span", { children: "Desenvolvimento Web (React, Angular, Vue)" })] }), _jsxs("li", { className: "flex items-start", children: [_jsx("div", { className: "w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0" }), _jsx("span", { children: "Desenvolvimento Mobile (React Native)" })] }), _jsxs("li", { className: "flex items-start", children: [_jsx("div", { className: "w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0" }), _jsx("span", { children: "Backend (Node.js, Python, Java)" })] }), _jsxs("li", { className: "flex items-start", children: [_jsx("div", { className: "w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0" }), _jsx("span", { children: "Cybersecurity e Ethical Hacking" })] })] })] })] }), _jsx("div", { className: "text-center", children: _jsxs("button", { className: "px-4 sm:px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 border-2 bg-cyan-500/20 border-cyan-400 text-cyan-400 hover:bg-cyan-500/30 hover:shadow-cyan-glow", children: [_jsx(MessageSquare, { className: "w-4 sm:w-5 h-4 sm:h-5 inline mr-2" }), "Agendar Aula Experimental"] }) })] })] }) })), showLogin && (_jsx(AdminLogin, { onLogin: handleLogin, onBackToFrontend: handleBackToFrontend })), isAdminOpen && isAuthenticated && (_jsx(AdminPanel, { onClose: handleAdminClose, onBackToFrontend: handleBackToFrontend })), _jsx("div", { className: "fixed bottom-4 left-4 text-xs text-gray-600 opacity-30 pointer-events-none", children: "Digite \"deviem\" para acesso administrativo" })] }));
}
export default App;
