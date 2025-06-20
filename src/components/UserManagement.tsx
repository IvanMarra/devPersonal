import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit, Trash2, Save, X, Eye, EyeOff, Shield, Key, UserPlus } from 'lucide-react';

interface User {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'editor';
  createdAt: string;
  lastLogin?: string;
}

interface UserManagementProps {
  onClose: () => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ onClose }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState<{ username: string; password: string; role: 'admin' | 'editor' }>({ 
    username: '', 
    password: '', 
    role: 'editor' 
  });
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Carregar usuários do localStorage
  useEffect(() => {
    const savedUsers = localStorage.getItem('deviem_users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      // Criar usuário admin padrão se não existir
      const defaultAdmin: User = {
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

  const saveUsers = (updatedUsers: User[]) => {
    setUsers(updatedUsers);
    localStorage.setItem('deviem_users', JSON.stringify(updatedUsers));
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const validatePassword = (password: string): boolean => {
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

    const user: User = {
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
    if (!editingUser) return;

    if (!editingUser.username) {
      showMessage('error', 'Nome de usuário é obrigatório');
      return;
    }

    if (users.some(user => user.username === editingUser.username && user.id !== editingUser.id)) {
      showMessage('error', 'Nome de usuário já existe');
      return;
    }

    const updatedUsers = users.map(user => 
      user.id === editingUser.id ? editingUser : user
    );
    saveUsers(updatedUsers);
    setEditingUser(null);
    showMessage('success', 'Usuário atualizado com sucesso!');
  };

  const handleDeleteUser = (userId: string) => {
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

    const updatedUsers = users.map(user => 
      user.username === 'deviem_admin' ? { ...user, password: newPassword } : user
    );
    saveUsers(updatedUsers);
    
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowChangePassword(false);
    showMessage('success', 'Senha alterada com sucesso!');
  };

  const togglePasswordVisibility = (userId: string) => {
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

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg border border-cyan-500/50 p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="cyber-border rounded-full p-2">
              <Users className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-cyan-400">Gerenciamento de Usuários</h2>
              <p className="text-gray-400">Gerencie usuários e permissões do sistema</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg border ${
            message.type === 'success' 
              ? 'bg-green-500/20 border-green-500/30 text-green-400' 
              : 'bg-red-500/20 border-red-500/30 text-red-400'
          }`}>
            {message.text}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Lista de Usuários */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-cyan-400">Usuários Cadastrados ({users.length})</h3>
              <button
                onClick={() => setShowChangePassword(true)}
                className="px-4 py-2 bg-purple-500/20 border border-purple-400 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-all duration-300 flex items-center"
              >
                <Key className="w-4 h-4 mr-2" />
                Alterar Minha Senha
              </button>
            </div>

            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                  {editingUser?.id === user.id ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          value={editingUser.username}
                          onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                          className="p-3 bg-black border border-gray-600 rounded-lg text-white"
                          placeholder="Nome de usuário"
                        />
                        <select
                          value={editingUser.role}
                          onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as 'admin' | 'editor' })}
                          className="p-3 bg-black border border-gray-600 rounded-lg text-white"
                        >
                          <option value="admin">Administrador</option>
                          <option value="editor">Editor</option>
                        </select>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={handleUpdateUser}
                          className="px-4 py-2 bg-green-500/20 border border-green-400 text-green-400 rounded-lg hover:bg-green-500/30 transition-all duration-300"
                        >
                          <Save className="w-4 h-4 inline mr-2" />
                          Salvar
                        </button>
                        <button
                          onClick={() => setEditingUser(null)}
                          className="px-4 py-2 bg-gray-500/20 border border-gray-400 text-gray-400 rounded-lg hover:bg-gray-500/30 transition-all duration-300"
                        >
                          <X className="w-4 h-4 inline mr-2" />
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className={`w-3 h-3 rounded-full ${user.role === 'admin' ? 'bg-red-400' : 'bg-blue-400'}`}></div>
                          <h4 className="font-bold text-white">{user.username}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.role === 'admin' 
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                              : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          }`}>
                            {user.role === 'admin' ? 'Administrador' : 'Editor'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span>Criado: {new Date(user.createdAt).toLocaleDateString('pt-BR')}</span>
                          {user.lastLogin && (
                            <span>Último login: {new Date(user.lastLogin).toLocaleDateString('pt-BR')}</span>
                          )}
                        </div>
                        <div className="mt-2 flex items-center space-x-2">
                          <span className="text-sm text-gray-400">Senha:</span>
                          <div className="flex items-center space-x-2">
                            <code className="bg-black/50 px-2 py-1 rounded text-xs text-cyan-400">
                              {showPasswords[user.id] ? user.password : '••••••••••••'}
                            </code>
                            <button
                              onClick={() => togglePasswordVisibility(user.id)}
                              className="p-1 hover:bg-gray-700 rounded"
                            >
                              {showPasswords[user.id] ? 
                                <EyeOff className="w-4 h-4 text-gray-400" /> : 
                                <Eye className="w-4 h-4 text-gray-400" />
                              }
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => setEditingUser(user)}
                          className="p-2 text-cyan-400 hover:bg-cyan-500/20 rounded"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {users.length > 1 && (
                          <button 
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-2 text-red-400 hover:bg-red-500/20 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Adicionar Novo Usuário */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-cyan-400 flex items-center">
              <UserPlus className="w-5 h-5 mr-2" />
              Adicionar Novo Usuário
            </h3>

            <div className="bg-gray-800/50 p-6 rounded-lg border border-cyan-500/30 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nome de Usuário
                </label>
                <input
                  type="text"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  className="w-full p-3 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-400"
                  placeholder="Digite o nome de usuário"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Senha
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className="flex-1 p-3 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-400"
                    placeholder="Digite a senha"
                  />
                  <button
                    onClick={() => setNewUser({ ...newUser, password: generateRandomPassword() })}
                    className="px-4 py-3 bg-purple-500/20 border border-purple-400 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-all duration-300"
                    title="Gerar senha aleatória"
                  >
                    <Key className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Mín. 8 caracteres, 1 maiúscula, 1 minúscula, 1 número e 1 especial
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Função
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as 'admin' | 'editor' })}
                  className="w-full p-3 bg-black border border-gray-600 rounded-lg text-white"
                >
                  <option value="editor">Editor</option>
                  <option value="admin">Administrador</option>
                </select>
                <p className="text-xs text-gray-400 mt-1">
                  Editor: Pode gerenciar conteúdo | Admin: Acesso total
                </p>
              </div>

              <button
                onClick={handleAddUser}
                disabled={loading}
                className="w-full px-6 py-3 bg-cyan-500/20 border border-cyan-400 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-all duration-300 disabled:opacity-50"
              >
                <Plus className="w-4 h-4 inline mr-2" />
                Criar Usuário
              </button>
            </div>

            {/* Informações de Segurança */}
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <h4 className="text-yellow-400 font-semibold mb-2 flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                Informações de Segurança
              </h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Senhas são armazenadas localmente no navegador</li>
                <li>• Use senhas fortes para maior segurança</li>
                <li>• Administradores têm acesso total ao sistema</li>
                <li>• Editores podem gerenciar apenas conteúdo</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Modal de Alteração de Senha */}
        {showChangePassword && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-60 flex items-center justify-center p-4">
            <div className="bg-gray-900 rounded-lg border border-purple-500/50 p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-purple-400">Alterar Senha</h3>
                <button
                  onClick={() => setShowChangePassword(false)}
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Senha Atual
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full p-3 bg-black border border-gray-600 rounded-lg text-white"
                    placeholder="Digite sua senha atual"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nova Senha
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-3 bg-black border border-gray-600 rounded-lg text-white"
                    placeholder="Digite a nova senha"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirmar Nova Senha
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-3 bg-black border border-gray-600 rounded-lg text-white"
                    placeholder="Confirme a nova senha"
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={handleChangePassword}
                    className="flex-1 px-4 py-3 bg-purple-500/20 border border-purple-400 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-all duration-300"
                  >
                    <Key className="w-4 h-4 inline mr-2" />
                    Alterar Senha
                  </button>
                  <button
                    onClick={() => setShowChangePassword(false)}
                    className="px-4 py-3 bg-gray-500/20 border border-gray-400 text-gray-400 rounded-lg hover:bg-gray-500/30 transition-all duration-300"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
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

export default UserManagement;