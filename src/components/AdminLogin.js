import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
import { Shield, Eye, EyeOff, Terminal, ArrowLeft } from 'lucide-react';
import ReCAPTCHA from 'react-google-recaptcha';
import { authenticateAdmin } from '../lib/supabase';
const AdminLogin = ({ onLogin, onBackToFrontend }) => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [recaptchaToken, setRecaptchaToken] = useState(null);
    const recaptchaRef = useRef(null);
    // Chave do reCAPTCHA (para produção, use variável de ambiente)
    const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'; // Chave de teste
    useEffect(() => {
        // Auto-complete para facilitar o teste
        setCredentials({
            username: 'deviem_admin',
            password: 'DevIem2024@Secure!'
        });
    }, []);
    const handleRecaptchaChange = (token) => {
        console.log('🔒 reCAPTCHA token:', token ? 'Recebido' : 'Removido');
        setRecaptchaToken(token);
        setError('');
    };
    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        // Validar reCAPTCHA
        if (!recaptchaToken) {
            setError('Por favor, complete a verificação reCAPTCHA');
            setIsLoading(false);
            return;
        }
        try {
            console.log('🔐 Tentando autenticar admin...');
            // Autenticar no Supabase
            const session = await authenticateAdmin(credentials.username, credentials.password);
            if (session) {
                console.log('✅ Login bem-sucedido com autenticação Supabase');
                localStorage.setItem('deviem_admin_token', 'authenticated');
                localStorage.setItem('deviem_admin_session', Date.now().toString());
                onLogin(true);
            }
            else {
                throw new Error('Falha na autenticação');
            }
        }
        catch (err) {
            console.log('❌ Erro na autenticação:', err);
            setError(err instanceof Error ? err.message : 'Erro na autenticação');
            // Reset reCAPTCHA em caso de erro
            if (recaptchaRef.current) {
                recaptchaRef.current.reset();
            }
            setRecaptchaToken(null);
            onLogin(false);
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsxs("div", { className: "fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4", children: [_jsxs("div", { className: "bg-gray-900 rounded-lg border border-cyan-500/50 p-8 w-full max-w-md", children: [_jsxs("button", { onClick: onBackToFrontend, className: "mb-6 flex items-center text-gray-400 hover:text-cyan-400 transition-colors", children: [_jsx(ArrowLeft, { className: "w-4 h-4 mr-2" }), "Voltar ao Site"] }), _jsxs("div", { className: "text-center mb-8", children: [_jsx("div", { className: "flex items-center justify-center mb-4", children: _jsx("div", { className: "cyber-border rounded-full p-3", children: _jsx(Shield, { className: "w-8 h-8 text-cyan-400" }) }) }), _jsx("h2", { className: "text-2xl font-bold text-cyan-400 mb-2", children: "\u00C1rea Administrativa" }), _jsx("p", { className: "text-gray-400", children: "Acesso restrito - DevIem" })] }), _jsxs("form", { onSubmit: handleLogin, className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Usu\u00E1rio" }), _jsx("input", { type: "text", value: credentials.username, onChange: (e) => setCredentials({ ...credentials, username: e.target.value }), className: "w-full p-3 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors", placeholder: "Digite seu usu\u00E1rio", autoComplete: "username", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Senha" }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: showPassword ? 'text' : 'password', value: credentials.password, onChange: (e) => setCredentials({ ...credentials, password: e.target.value }), className: "w-full p-3 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors pr-12", placeholder: "Digite sua senha", autoComplete: "current-password", required: true }), _jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-400", children: showPassword ? _jsx(EyeOff, { className: "w-5 h-5" }) : _jsx(Eye, { className: "w-5 h-5" }) })] })] }), _jsx("div", { className: "flex justify-center", children: _jsx(ReCAPTCHA, { ref: recaptchaRef, sitekey: RECAPTCHA_SITE_KEY, onChange: handleRecaptchaChange, theme: "dark", size: "normal" }) }), error && (_jsx("div", { className: "bg-red-500/20 border border-red-500 rounded-lg p-3 text-red-400 text-sm", children: error })), _jsx("button", { type: "submit", disabled: isLoading || !recaptchaToken, className: "w-full bg-cyan-500/20 border-2 border-cyan-400 text-cyan-400 py-3 rounded-lg font-semibold hover:bg-cyan-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed", children: isLoading ? (_jsxs("div", { className: "flex items-center justify-center", children: [_jsx(Terminal, { className: "w-5 h-5 mr-2 animate-spin" }), "Autenticando no Supabase..."] })) : ('Entrar') })] }), _jsxs("div", { className: "mt-6 text-center text-xs text-gray-500", children: [_jsx("p", { children: "Credenciais de demonstra\u00E7\u00E3o:" }), _jsx("p", { className: "text-cyan-400", children: "deviem_admin / DevIem2024@Secure!" }), _jsx("p", { className: "text-yellow-400 mt-2", children: "\uD83D\uDD12 Protegido por reCAPTCHA + Supabase Auth" })] })] }), _jsx("style", { dangerouslySetInnerHTML: {
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
export default AdminLogin;
