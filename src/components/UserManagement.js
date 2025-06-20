import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Users, Plus, Edit, Trash2, Save, X, Eye, EyeOff, Shield, Key, UserPlus } from 'lucide-react';
const UserManagement = ({ onClose }) => {
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [newUser, setNewUser] = useState({ username: '', password: '', role: 'editor' });
    const [showPasswords, setShowPasswords] = useState({});
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    // Carregar usuários do localStorage
    useEffect(() => {
        const savedUsers = localStorage.getItem('deviem_users');
        if (savedUsers) {
            setUsers(JSON.parse(savedUsers));
        }
        else {
            // Criar usuário admin padrão se não existir
            const defaultAdmin = {
                id: '1',
                username: 'deviem_admin',
                password: 'DevIem2024@Secure!',
                role: 'admin',
                createdAt: new Date().toISOString()
            };
            setUsers([defaultAdmin]);
            localStorage.setItem('deviem_users', JSON.stringify([defaultAdmin]));
        }
    }, []);
    const saveUsers = (updatedUsers) => {
        setUsers(updatedUsers);
        localStorage.setItem('deviem_users', JSON.stringify(updatedUsers));
    };
    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 3000);
    };
    const validatePassword = (password) => {
        // Senha deve ter pelo menos 8 caracteres, 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    };
    const handleAddUser = () => {
        if (!newUser.username || !newUser.password) {
            showMessage('error', 'Preencha todos os campos');
            return;
        }
        if (!validatePassword(newUser.password)) {
            showMessage('error', 'Senha deve ter pelo menos 8 caracteres, 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial');
            return;
        }
        if (users.some(user => user.username === newUser.username)) {
            showMessage('error', 'Nome de usuário já existe');
            return;
        }
        const user = {
            id: Date.now().toString(),
            username: newUser.username,
            password: newUser.password,
            role: newUser.role,
            createdAt: new Date().toISOString()
        };
        const updatedUsers = [...users, user];
        saveUsers(updatedUsers);
        setNewUser({ username: '', password: '', role: 'editor' });
        showMessage('success', 'Usuário criado com sucesso!');
    };
    const handleUpdateUser = () => {
        if (!editingUser)
            return;
        if (!editingUser.username) {
            showMessage('error', 'Nome de usuário é obrigatório');
            return;
        }
        if (users.some(user => user.username === editingUser.username && user.id !== editingUser.id)) {
            showMessage('error', 'Nome de usuário já existe');
            return;
        }
        const updatedUsers = users.map(user => user.id === editingUser.id ? editingUser : user);
        saveUsers(updatedUsers);
        setEditingUser(null);
        showMessage('success', 'Usuário atualizado com sucesso!');
    };
    const handleDeleteUser = (userId) => {
        if (users.length === 1) {
            showMessage('error', 'Não é possível excluir o último usuário');
            return;
        }
        if (confirm('Tem certeza que deseja excluir este usuário?')) {
            const updatedUsers = users.filter(user => user.id !== userId);
            saveUsers(updatedUsers);
            showMessage('success', 'Usuário excluído com sucesso!');
        }
    };
    const handleChangePassword = () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            showMessage('error', 'Preencha todos os campos');
            return;
        }
        // Verificar senha atual
        const currentUser = users.find(user => user.username === 'deviem_admin');
        if (!currentUser || currentUser.password !== currentPassword) {
            showMessage('error', 'Senha atual incorreta');
            return;
        }
        if (newPassword !== confirmPassword) {
            showMessage('error', 'Nova senha e confirmação não coincidem');
            return;
        }
        if (!validatePassword(newPassword)) {
            showMessage('error', 'Nova senha deve ter pelo menos 8 caracteres, 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial');
            return;
        }
        const updatedUsers = users.map(user => user.username === 'deviem_admin' ? { ...user, password: newPassword } : user);
        saveUsers(updatedUsers);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setShowChangePassword(false);
        showMessage('success', 'Senha alterada com sucesso!');
    };
    const togglePasswordVisibility = (userId) => {
        setShowPasswords(prev => ({
            ...prev,
            [userId]: !prev[userId]
        }));
    };
    const generateRandomPassword = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@$!%*?&';
        let password = '';
        // Garantir pelo menos um de cada tipo
        password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]; // Maiúscula
        password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]; // Minúscula
        password += '0123456789'[Math.floor(Math.random() * 10)]; // Número
        password += '@$!%*?&'[Math.floor(Math.random() * 7)]; // Especial
        // Completar com caracteres aleatórios
        for (let i = 4; i < 12; i++) {
            password += chars[Math.floor(Math.random() * chars.length)];
        }
        // Embaralhar
        return password.split('').sort(() => Math.random() - 0.5).join('');
    };
    return (_jsxs("div", { className: "fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4", children: [_jsxs("div", { className: "bg-gray-900 rounded-lg border border-cyan-500/50 p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "cyber-border rounded-full p-2", children: _jsx(Users, { className: "w-6 h-6 text-cyan-400" }) }), _jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-cyan-400", children: "Gerenciamento de Usu\u00E1rios" }), _jsx("p", { className: "text-gray-400", children: "Gerencie usu\u00E1rios e permiss\u00F5es do sistema" })] })] }), _jsx("button", { onClick: onClose, className: "p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors", children: _jsx(X, { className: "w-6 h-6" }) })] }), message && (_jsx("div", { className: `mb-6 p-4 rounded-lg border ${message.type === 'success'
                            ? 'bg-green-500/20 border-green-500/30 text-green-400'
                            : 'bg-red-500/20 border-red-500/30 text-red-400'}`, children: message.text })), _jsxs("div", { className: "grid lg:grid-cols-2 gap-8", children: [_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("h3", { className: "text-lg font-bold text-cyan-400", children: ["Usu\u00E1rios Cadastrados (", users.length, ")"] }), _jsxs("button", { onClick: () => setShowChangePassword(true), className: "px-4 py-2 bg-purple-500/20 border border-purple-400 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-all duration-300 flex items-center", children: [_jsx(Key, { className: "w-4 h-4 mr-2" }), "Alterar Minha Senha"] })] }), _jsx("div", { className: "space-y-4", children: users.map((user) => (_jsx("div", { className: "bg-gray-800/50 p-4 rounded-lg border border-gray-700", children: editingUser?.id === user.id ? (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsx("input", { type: "text", value: editingUser.username, onChange: (e) => setEditingUser({ ...editingUser, username: e.target.value }), className: "p-3 bg-black border border-gray-600 rounded-lg text-white", placeholder: "Nome de usu\u00E1rio" }), _jsxs("select", { value: editingUser.role, onChange: (e) => setEditingUser({ ...editingUser, role: e.target.value }), className: "p-3 bg-black border border-gray-600 rounded-lg text-white", children: [_jsx("option", { value: "admin", children: "Administrador" }), _jsx("option", { value: "editor", children: "Editor" })] })] }), _jsxs("div", { className: "flex space-x-2", children: [_jsxs("button", { onClick: handleUpdateUser, className: "px-4 py-2 bg-green-500/20 border border-green-400 text-green-400 rounded-lg hover:bg-green-500/30 transition-all duration-300", children: [_jsx(Save, { className: "w-4 h-4 inline mr-2" }), "Salvar"] }), _jsxs("button", { onClick: () => setEditingUser(null), className: "px-4 py-2 bg-gray-500/20 border border-gray-400 text-gray-400 rounded-lg hover:bg-gray-500/30 transition-all duration-300", children: [_jsx(X, { className: "w-4 h-4 inline mr-2" }), "Cancelar"] })] })] })) : (_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center space-x-3 mb-2", children: [_jsx("div", { className: `w-3 h-3 rounded-full ${user.role === 'admin' ? 'bg-red-400' : 'bg-blue-400'}` }), _jsx("h4", { className: "font-bold text-white", children: user.username }), _jsx("span", { className: `px-2 py-1 rounded-full text-xs ${user.role === 'admin'
                                                                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                                                            : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'}`, children: user.role === 'admin' ? 'Administrador' : 'Editor' })] }), _jsxs("div", { className: "flex items-center space-x-4 text-sm text-gray-400", children: [_jsxs("span", { children: ["Criado: ", new Date(user.createdAt).toLocaleDateString('pt-BR')] }), user.lastLogin && (_jsxs("span", { children: ["\u00DAltimo login: ", new Date(user.lastLogin).toLocaleDateString('pt-BR')] }))] }), _jsxs("div", { className: "mt-2 flex items-center space-x-2", children: [_jsx("span", { className: "text-sm text-gray-400", children: "Senha:" }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("code", { className: "bg-black/50 px-2 py-1 rounded text-xs text-cyan-400", children: showPasswords[user.id] ? user.password : '••••••••••••' }), _jsx("button", { onClick: () => togglePasswordVisibility(user.id), className: "p-1 hover:bg-gray-700 rounded", children: showPasswords[user.id] ?
                                                                                    _jsx(EyeOff, { className: "w-4 h-4 text-gray-400" }) :
                                                                                    _jsx(Eye, { className: "w-4 h-4 text-gray-400" }) })] })] })] }), _jsxs("div", { className: "flex space-x-2", children: [_jsx("button", { onClick: () => setEditingUser(user), className: "p-2 text-cyan-400 hover:bg-cyan-500/20 rounded", children: _jsx(Edit, { className: "w-4 h-4" }) }), users.length > 1 && (_jsx("button", { onClick: () => handleDeleteUser(user.id), className: "p-2 text-red-400 hover:bg-red-500/20 rounded", children: _jsx(Trash2, { className: "w-4 h-4" }) }))] })] })) }, user.id))) })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("h3", { className: "text-lg font-bold text-cyan-400 flex items-center", children: [_jsx(UserPlus, { className: "w-5 h-5 mr-2" }), "Adicionar Novo Usu\u00E1rio"] }), _jsxs("div", { className: "bg-gray-800/50 p-6 rounded-lg border border-cyan-500/30 space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Nome de Usu\u00E1rio" }), _jsx("input", { type: "text", value: newUser.username, onChange: (e) => setNewUser({ ...newUser, username: e.target.value }), className: "w-full p-3 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-400", placeholder: "Digite o nome de usu\u00E1rio" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Senha" }), _jsxs("div", { className: "flex space-x-2", children: [_jsx("input", { type: "text", value: newUser.password, onChange: (e) => setNewUser({ ...newUser, password: e.target.value }), className: "flex-1 p-3 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-400", placeholder: "Digite a senha" }), _jsx("button", { onClick: () => setNewUser({ ...newUser, password: generateRandomPassword() }), className: "px-4 py-3 bg-purple-500/20 border border-purple-400 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-all duration-300", title: "Gerar senha aleat\u00F3ria", children: _jsx(Key, { className: "w-4 h-4" }) })] }), _jsx("p", { className: "text-xs text-gray-400 mt-1", children: "M\u00EDn. 8 caracteres, 1 mai\u00FAscula, 1 min\u00FAscula, 1 n\u00FAmero e 1 especial" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Fun\u00E7\u00E3o" }), _jsxs("select", { value: newUser.role, onChange: (e) => setNewUser({ ...newUser, role: e.target.value }), className: "w-full p-3 bg-black border border-gray-600 rounded-lg text-white", children: [_jsx("option", { value: "editor", children: "Editor" }), _jsx("option", { value: "admin", children: "Administrador" })] }), _jsx("p", { className: "text-xs text-gray-400 mt-1", children: "Editor: Pode gerenciar conte\u00FAdo | Admin: Acesso total" })] }), _jsxs("button", { onClick: handleAddUser, disabled: loading, className: "w-full px-6 py-3 bg-cyan-500/20 border border-cyan-400 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-all duration-300 disabled:opacity-50", children: [_jsx(Plus, { className: "w-4 h-4 inline mr-2" }), "Criar Usu\u00E1rio"] })] }), _jsxs("div", { className: "bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4", children: [_jsxs("h4", { className: "text-yellow-400 font-semibold mb-2 flex items-center", children: [_jsx(Shield, { className: "w-4 h-4 mr-2" }), "Informa\u00E7\u00F5es de Seguran\u00E7a"] }), _jsxs("ul", { className: "text-gray-300 text-sm space-y-1", children: [_jsx("li", { children: "\u2022 Senhas s\u00E3o armazenadas localmente no navegador" }), _jsx("li", { children: "\u2022 Use senhas fortes para maior seguran\u00E7a" }), _jsx("li", { children: "\u2022 Administradores t\u00EAm acesso total ao sistema" }), _jsx("li", { children: "\u2022 Editores podem gerenciar apenas conte\u00FAdo" })] })] })] })] }), showChangePassword && (_jsx("div", { className: "fixed inset-0 bg-black/80 backdrop-blur-sm z-60 flex items-center justify-center p-4", children: _jsxs("div", { className: "bg-gray-900 rounded-lg border border-purple-500/50 p-6 w-full max-w-md", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h3", { className: "text-lg font-bold text-purple-400", children: "Alterar Senha" }), _jsx("button", { onClick: () => setShowChangePassword(false), className: "p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors", children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Senha Atual" }), _jsx("input", { type: "password", value: currentPassword, onChange: (e) => setCurrentPassword(e.target.value), className: "w-full p-3 bg-black border border-gray-600 rounded-lg text-white", placeholder: "Digite sua senha atual" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Nova Senha" }), _jsx("input", { type: "password", value: newPassword, onChange: (e) => setNewPassword(e.target.value), className: "w-full p-3 bg-black border border-gray-600 rounded-lg text-white", placeholder: "Digite a nova senha" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Confirmar Nova Senha" }), _jsx("input", { type: "password", value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value), className: "w-full p-3 bg-black border border-gray-600 rounded-lg text-white", placeholder: "Confirme a nova senha" })] }), _jsxs("div", { className: "flex space-x-3", children: [_jsxs("button", { onClick: handleChangePassword, className: "flex-1 px-4 py-3 bg-purple-500/20 border border-purple-400 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-all duration-300", children: [_jsx(Key, { className: "w-4 h-4 inline mr-2" }), "Alterar Senha"] }), _jsx("button", { onClick: () => setShowChangePassword(false), className: "px-4 py-3 bg-gray-500/20 border border-gray-400 text-gray-400 rounded-lg hover:bg-gray-500/30 transition-all duration-300", children: "Cancelar" })] })] })] }) }))] }), _jsx("style", { dangerouslySetInnerHTML: {
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
export default UserManagement;
