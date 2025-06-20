import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, BarChart3, Settings, Database, MessageSquare, Code, Mic, Loader, Eye, UserCog, TrendingUp, BookOpen } from 'lucide-react';
import AdminDashboard from './AdminDashboard';
import ImageUpload from './ImageUpload';
import UserManagement from './UserManagement';
import NotificationSystem from './NotificationSystem';
import GoogleAnalyticsSetup from './GoogleAnalyticsSetup';
import { useProjects, useTestimonials, useTalks, useSiteSettings } from '../hooks/useSupabaseData';
import { logoutAdmin, isAdminAuthenticated } from '../lib/supabase';

interface AdminPanelProps {
  onClose: () => void;
  onBackToFrontend: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose, onBackToFrontend }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [showAnalyticsSetup, setShowAnalyticsSetup] = useState(false);
  const [logoutInProgress, setLogoutInProgress] = useState(false);
  const [showBlogEditor, setShowBlogEditor] = useState(false);

  // Usar hooks do Supabase
  const { 
    projects, 
    loading: projectsLoading, 
    addProject, 
    updateProject, 
    deleteProject 
  } = useProjects();

  const { 
    testimonials, 
    loading: testimonialsLoading, 
    addTestimonial, 
    updateTestimonial, 
    deleteTestimonial 
  } = useTestimonials();

  const { 
    talks, 
    loading: talksLoading, 
    addTalk, 
    updateTalk, 
    deleteTalk 
  } = useTalks();

  const { 
    settings, 
    loading: settingsLoading, 
    updateSettings 
  } = useSiteSettings();

  // Estados de edição
  const [editingProject, setEditingProject] = useState<any>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<any>(null);
  const [editingTalk, setEditingTalk] = useState<any>(null);
  const [editingSettings, setEditingSettings] = useState<any>(null);

  // Estados para novos itens
  const [newProject, setNewProject] = useState({ title: '', description: '', tech: '', image_url: '' });
  const [newTestimonial, setNewTestimonial] = useState({ name: '', role: '', text: '', avatar_url: '' });
  const [newTalk, setNewTalk] = useState({ title: '', description: '', tags: '', image_url: '' });
  const [newBlogPost, setNewBlogPost] = useState({ title: '', category: '', content: '', tags: '', image_url: '' });

  // Verificar autenticação
  useEffect(() => {
    if (!isAdminAuthenticated()) {
      console.log('❌ Usuário não autenticado, redirecionando...');
      onBackToFrontend();
    }
  }, [onBackToFrontend]);

  const handleLogout = () => {
    console.log('🚪 Iniciando processo de logout completo...');
    setLogoutInProgress(true);
    
    try {
      // Limpar todos os dados de sessão
      localStorage.removeItem('deviem_admin_token');
      localStorage.removeItem('deviem_admin_session');
      localStorage.removeItem('supabase_admin_session');
      
      // Chamar função de logout do Supabase
      logoutAdmin();
      
      console.log('✅ Logout realizado com sucesso');
      
      // Redirecionar para frontend após logout
      onBackToFrontend();
    } catch (error) {
      console.error('❌ Erro durante logout:', error);
      
      // Forçar redirecionamento mesmo em caso de erro
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } finally {
      setLogoutInProgress(false);
    }
  };

  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // Funções para projetos
  const handleAddProject = async () => {
    if (newProject.title && newProject.description) {
      try {
        setLoading(true);
        console.log('➕ Adicionando projeto via AdminPanel...');
        
        const project = {
          title: newProject.title,
          description: newProject.description,
          tech: newProject.tech.split(',').map(t => t.trim()).filter(t => t),
          image_url: newProject.image_url || undefined
        };
        
        await addProject(project);
        setNewProject({ title: '', description: '', tech: '', image_url: '' });
        showSuccessMessage('✅ Projeto adicionado com sucesso!');
      } catch (error) {
        console.error('❌ Erro ao adicionar projeto:', error);
        showSuccessMessage('❌ Erro ao adicionar projeto: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
      } finally {
        setLoading(false);
      }
    }
  };

  const handleUpdateProject = async () => {
    if (editingProject) {
      try {
        setLoading(true);
        console.log('📝 Atualizando projeto via AdminPanel...');
        
        await updateProject(editingProject.id, {
          title: editingProject.title,
          description: editingProject.description,
          tech: editingProject.tech,
          image_url: editingProject.image_url
        });
        
        setEditingProject(null);
        showSuccessMessage('✅ Projeto atualizado com sucesso!');
      } catch (error) {
        console.error('❌ Erro ao atualizar projeto:', error);
        showSuccessMessage('❌ Erro ao atualizar projeto: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este projeto?')) {
      try {
        setLoading(true);
        console.log('🗑️ Deletando projeto via AdminPanel...');
        
        await deleteProject(id);
        showSuccessMessage('✅ Projeto excluído com sucesso!');
      } catch (error) {
        console.error('❌ Erro ao deletar projeto:', error);
        showSuccessMessage('❌ Erro ao deletar projeto: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
      } finally {
        setLoading(false);
      }
    }
  };

  // Funções similares para testimonials e talks...
  const handleAddTestimonial = async () => {
    if (newTestimonial.name && newTestimonial.text) {
      try {
        setLoading(true);
        await addTestimonial(newTestimonial);
        setNewTestimonial({ name: '', role: '', text: '', avatar_url: '' });
        showSuccessMessage('✅ Depoimento adicionado com sucesso!');
      } catch (error) {
        console.error('❌ Erro ao adicionar depoimento:', error);
        showSuccessMessage('❌ Erro ao adicionar depoimento: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAddTalk = async () => {
    if (newTalk.title && newTalk.description) {
      try {
        setLoading(true);
        const talk = {
          title: newTalk.title,
          description: newTalk.description,
          tags: newTalk.tags.split(',').map(t => t.trim()).filter(t => t),
          image_url: newTalk.image_url || undefined
        };
        
        await addTalk(talk);
        setNewTalk({ title: '', description: '', tags: '', image_url: '' });
        showSuccessMessage('✅ Palestra adicionada com sucesso!');
      } catch (error) {
        console.error('❌ Erro ao adicionar palestra:', error);
        showSuccessMessage('❌ Erro ao adicionar palestra: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
      } finally {
        setLoading(false);
      }
    }
  };

  // Função para adicionar post no blog
  const handleAddBlogPost = () => {
    if (newBlogPost.title && newBlogPost.content) {
      try {
        setLoading(true);
        // Simulação de adição de post
        console.log('Adicionando post:', newBlogPost);
        
        // Limpar formulário
        setNewBlogPost({ title: '', category: '', content: '', tags: '', image_url: '' });
        showSuccessMessage('✅ Post adicionado com sucesso!');
        
        // Fechar editor
        setShowBlogEditor(false);
      } catch (error) {
        console.error('❌ Erro ao adicionar post:', error);
        showSuccessMessage('❌ Erro ao adicionar post: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
      } finally {
        setLoading(false);
      }
    } else {
      showSuccessMessage('❌ Preencha pelo menos título e conteúdo');
    }
  };

  const tabs = [
    { id: 'dashboard', title: 'Dashboard', icon: BarChart3 },
    { id: 'projects', title: 'Projetos', icon: Code },
    { id: 'blog', title: 'Blog', icon: BookOpen },
    { id: 'testimonials', title: 'Depoimentos', icon: MessageSquare },
    { id: 'talks', title: 'Palestras', icon: Mic },
    { id: 'settings', title: 'Configurações', icon: Settings }
  ];

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex">
      {/* Sidebar - RESPONSIVIDADE MELHORADA */}
      <div className="w-full sm:w-80 md:w-64 bg-gray-900 border-r border-cyan-500/30 p-4 sm:p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-cyan-400">Admin Panel</h2>
          <div className="flex items-center space-x-2">
            <NotificationSystem />
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1 sm:p-0"
            >
              <X className="w-5 sm:w-6 h-5 sm:h-6" />
            </button>
          </div>
        </div>

        <nav className="space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center space-x-3 px-3 sm:px-4 py-3 rounded-lg transition-all duration-300 text-sm sm:text-base ${
                activeTab === tab.id
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-400'
                  : 'text-gray-400 hover:text-cyan-400 hover:bg-gray-800'
              }`}
            >
              <tab.icon className="w-4 sm:w-5 h-4 sm:h-5" />
              <span>{tab.title}</span>
            </button>
          ))}
        </nav>

        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-700 space-y-3">
          <button
            onClick={() => setShowAnalyticsSetup(true)}
            className="w-full px-3 sm:px-4 py-2 bg-green-500/20 border border-green-400 text-green-400 rounded-lg hover:bg-green-500/30 transition-all duration-300 flex items-center justify-center text-sm sm:text-base"
          >
            <TrendingUp className="w-3 sm:w-4 h-3 sm:h-4 mr-2" />
            Google Analytics
          </button>
          <button
            onClick={() => setShowUserManagement(true)}
            className="w-full px-3 sm:px-4 py-2 bg-purple-500/20 border border-purple-400 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-all duration-300 flex items-center justify-center text-sm sm:text-base"
          >
            <UserCog className="w-3 sm:w-4 h-3 sm:h-4 mr-2" />
            Usuários
          </button>
          <button
            onClick={onBackToFrontend}
            className="w-full px-3 sm:px-4 py-2 bg-cyan-500/20 border border-cyan-400 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-all duration-300 flex items-center justify-center text-sm sm:text-base"
          >
            <Eye className="w-3 sm:w-4 h-3 sm:h-4 mr-2" />
            Ver Site
          </button>
          <button
            onClick={handleLogout}
            disabled={logoutInProgress}
            className="w-full px-3 sm:px-4 py-2 bg-red-500/20 border border-red-400 text-red-400 rounded-lg hover:bg-red-500/30 transition-all duration-300 text-sm sm:text-base disabled:opacity-50"
          >
            {logoutInProgress ? 'Saindo...' : 'Sair'}
          </button>
        </div>
      </div>

      {/* Main Content - RESPONSIVIDADE MELHORADA */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
        {/* Success Message - CORRIGIDO: Posicionado à direita */}
        {successMessage && (
          <div className="fixed top-4 right-4 bg-green-500/20 border border-green-400 text-green-400 px-4 sm:px-6 py-3 rounded-lg flex items-center z-60 text-sm sm:text-base max-w-xs sm:max-w-md">
            {successMessage}
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="fixed top-4 right-4 bg-cyan-500/20 border border-cyan-400 text-cyan-400 px-3 sm:px-4 py-2 rounded-lg flex items-center z-60 text-sm">
            <Loader className="w-3 sm:w-4 h-3 sm:h-4 mr-2 animate-spin" />
            Processando...
          </div>
        )}

        {activeTab === 'dashboard' && <AdminDashboard />}

        {activeTab === 'projects' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-cyan-400">Gerenciar Projetos</h2>
              <div className="text-sm text-gray-400">
                Total: {projects.length} projetos
              </div>
            </div>
            
            {/* Adicionar novo projeto */}
            <div className="bg-gray-900/50 p-4 sm:p-6 rounded-lg border border-cyan-500/30">
              <h3 className="text-base sm:text-lg font-semibold text-cyan-400 mb-4">Adicionar Novo Projeto</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Título do projeto"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  className="p-3 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-400 text-sm sm:text-base"
                />
                <input
                  type="text"
                  placeholder="Tecnologias (separadas por vírgula)"
                  value={newProject.tech}
                  onChange={(e) => setNewProject({ ...newProject, tech: e.target.value })}
                  className="p-3 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-400 text-sm sm:text-base"
                />
              </div>
              <textarea
                placeholder="Descrição do projeto"
                rows={3}
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                className="w-full p-3 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-400 mt-4 text-sm sm:text-base"
              />
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Imagem do Projeto
                </label>
                <ImageUpload
                  currentImage={newProject.image_url}
                  onImageUploaded={(url) => setNewProject({ ...newProject, image_url: url })}
                  folder="projects"
                  recommendedSize="800x600px"
                />
              </div>
              <button
                onClick={handleAddProject}
                disabled={loading || projectsLoading}
                className="mt-4 px-4 sm:px-6 py-2 bg-cyan-500/20 border border-cyan-400 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-all duration-300 disabled:opacity-50 text-sm sm:text-base"
              >
                <Plus className="w-3 sm:w-4 h-3 sm:h-4 inline mr-2" />
                Adicionar Projeto
              </button>
            </div>

            {/* Lista de projetos */}
            <div className="space-y-4">
              {projectsLoading ? (
                <div className="text-center py-8">
                  <Loader className="w-8 h-8 text-cyan-400 animate-spin mx-auto mb-2" />
                  <p className="text-gray-400">Carregando projetos do Supabase...</p>
                </div>
              ) : projects.length === 0 ? (
                <div className="text-center py-8">
                  <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">Nenhum projeto encontrado no banco de dados</p>
                  <p className="text-gray-500 text-sm mt-2">Adicione o primeiro projeto acima</p>
                </div>
              ) : (
                projects.map((project) => (
                  <div key={project.id} className="bg-gray-900/50 p-4 sm:p-6 rounded-lg border border-purple-500/30">
                    {editingProject?.id === project.id ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input
                            type="text"
                            value={editingProject.title}
                            onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                            className="p-3 bg-black border border-gray-600 rounded-lg text-white text-sm sm:text-base"
                          />
                          <input
                            type="text"
                            value={Array.isArray(editingProject.tech) ? editingProject.tech.join(', ') : editingProject.tech}
                            onChange={(e) => setEditingProject({ 
                              ...editingProject, 
                              tech: e.target.value.split(',').map((t: string) => t.trim()).filter((t: string) => t)
                            })}
                            className="p-3 bg-black border border-gray-600 rounded-lg text-white text-sm sm:text-base"
                          />
                        </div>
                        <textarea
                          value={editingProject.description}
                          onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                          rows={3}
                          className="w-full p-3 bg-black border border-gray-600 rounded-lg text-white text-sm sm:text-base"
                        />
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Imagem do Projeto
                          </label>
                          <ImageUpload
                            currentImage={editingProject.image_url}
                            onImageUploaded={(url) => setEditingProject({ ...editingProject, image_url: url })}
                            folder="projects"
                            recommendedSize="800x600px"
                          />
                        </div>
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                          <button
                            onClick={handleUpdateProject}
                            disabled={loading}
                            className="px-4 py-2 bg-green-500/20 border border-green-400 text-green-400 rounded-lg hover:bg-green-500/30 transition-all duration-300 disabled:opacity-50 text-sm sm:text-base"
                          >
                            <Save className="w-3 sm:w-4 h-3 sm:h-4 inline mr-2" />
                            Salvar
                          </button>
                          <button
                            onClick={() => setEditingProject(null)}
                            className="px-4 py-2 bg-gray-500/20 border border-gray-400 text-gray-400 rounded-lg hover:bg-gray-500/30 transition-all duration-300 text-sm sm:text-base"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
                            {project.image_url && (
                              <img
                                src={project.image_url}
                                alt={project.title}
                                className="w-full sm:w-20 h-32 sm:h-20 object-cover rounded-lg"
                              />
                            )}
                            <div className="flex-1">
                              <h4 className="text-base sm:text-lg font-semibold text-purple-400">{project.title}</h4>
                              <p className="text-gray-300 mt-2 text-sm sm:text-base">{project.description}</p>
                              <div className="flex flex-wrap gap-2 mt-3">
                                {(Array.isArray(project.tech) ? project.tech : []).map((tech, index) => (
                                  <span key={index} className="px-2 sm:px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-xs sm:text-sm">
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-row lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2">
                          <button 
                            onClick={() => setEditingProject(project)}
                            className="p-2 text-cyan-400 hover:bg-cyan-500/20 rounded"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteProject(project.id)}
                            disabled={loading}
                            className="p-2 text-red-400 hover:bg-red-500/20 rounded disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Blog Section - NOVA SEÇÃO */}
        {activeTab === 'blog' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-cyan-400">Gerenciar Blog</h2>
              <button
                onClick={() => setShowBlogEditor(!showBlogEditor)}
                className="px-4 sm:px-6 py-2 bg-orange-500/20 border border-orange-400 text-orange-400 rounded-lg hover:bg-orange-500/30 transition-all duration-300 text-sm sm:text-base"
              >
                <Plus className="w-3 sm:w-4 h-3 sm:h-4 inline mr-2" />
                Novo Artigo
              </button>
            </div>
            
            {/* Editor de Blog */}
            {showBlogEditor && (
              <div className="bg-gray-900/50 p-4 sm:p-6 rounded-lg border border-orange-500/30 space-y-4">
                <h3 className="text-base sm:text-lg font-semibold text-orange-400 mb-2">Novo Artigo</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Título do artigo"
                    value={newBlogPost.title}
                    onChange={(e) => setNewBlogPost({ ...newBlogPost, title: e.target.value })}
                    className="p-3 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-400 text-sm sm:text-base"
                  />
                  
                  <select
                    value={newBlogPost.category}
                    onChange={(e) => setNewBlogPost({ ...newBlogPost, category: e.target.value })}
                    className="p-3 bg-black border border-gray-600 rounded-lg text-white text-sm sm:text-base"
                  >
                    <option value="">Selecione uma categoria</option>
                    <option value="Inteligência Artificial">Inteligência Artificial</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="Desenvolvimento">Desenvolvimento</option>
                    <option value="Carreira">Carreira</option>
                    <option value="Tutoriais">Tutoriais</option>
                  </select>
                </div>
                
                <textarea
                  placeholder="Conteúdo do artigo (suporta markdown)"
                  rows={10}
                  value={newBlogPost.content}
                  onChange={(e) => setNewBlogPost({ ...newBlogPost, content: e.target.value })}
                  className="w-full p-3 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-400 text-sm sm:text-base"
                />
                
                <input
                  type="text"
                  placeholder="Tags (separadas por vírgula)"
                  value={newBlogPost.tags}
                  onChange={(e) => setNewBlogPost({ ...newBlogPost, tags: e.target.value })}
                  className="p-3 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-400 text-sm sm:text-base"
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Imagem de Capa
                  </label>
                  <ImageUpload
                    currentImage={newBlogPost.image_url}
                    onImageUploaded={(url) => setNewBlogPost({ ...newBlogPost, image_url: url })}
                    folder="blog"
                    recommendedSize="1200x630px"
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <button
                    onClick={handleAddBlogPost}
                    disabled={loading}
                    className="px-4 py-2 bg-orange-500/20 border border-orange-400 text-orange-400 rounded-lg hover:bg-orange-500/30 transition-all duration-300 disabled:opacity-50 text-sm sm:text-base"
                  >
                    <Plus className="w-3 sm:w-4 h-3 sm:h-4 inline mr-2" />
                    Publicar Artigo
                  </button>
                  <button
                    onClick={() => setShowBlogEditor(false)}
                    className="px-4 py-2 bg-gray-500/20 border border-gray-400 text-gray-400 rounded-lg hover:bg-gray-500/30 transition-all duration-300 text-sm sm:text-base"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
            
            {/* Lista de Posts */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-orange-400 mb-2">Artigos Publicados</h3>
              
              {/* Post 1 */}
              <div className="bg-gray-900/50 p-4 sm:p-6 rounded-lg border border-orange-500/30">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
                      <img
                        src="https://images.pexels.com/photos/2004161/pexels-photo-2004161.jpeg?auto=compress&cs=tinysrgb&w=800"
                        alt="O Futuro da IA Generativa em 2025"
                        className="w-full sm:w-20 h-32 sm:h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 text-orange-400 text-xs mb-1">
                          <span>Inteligência Artificial</span>
                          <span>•</span>
                          <span>12 Jan 2025</span>
                        </div>
                        <h4 className="text-base sm:text-lg font-semibold text-orange-400">O Futuro da IA Generativa em 2025</h4>
                        <p className="text-gray-300 mt-2 text-sm sm:text-base line-clamp-2">
                          Explorando os avanços mais recentes em modelos de linguagem e como eles estão transformando 
                          o desenvolvimento de software, design e criação de conteúdo.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2">
                    <button className="p-2 text-cyan-400 hover:bg-cyan-500/20 rounded">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-red-400 hover:bg-red-500/20 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Post 2 */}
              <div className="bg-gray-900/50 p-4 sm:p-6 rounded-lg border border-orange-500/30">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
                      <img
                        src="https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=800"
                        alt="Protegendo Infraestruturas Críticas"
                        className="w-full sm:w-20 h-32 sm:h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 text-orange-400 text-xs mb-1">
                          <span>Cybersecurity</span>
                          <span>•</span>
                          <span>5 Jan 2025</span>
                        </div>
                        <h4 className="text-base sm:text-lg font-semibold text-orange-400">Protegendo Infraestruturas Críticas</h4>
                        <p className="text-gray-300 mt-2 text-sm sm:text-base line-clamp-2">
                          Como as técnicas modernas de ethical hacking estão sendo usadas para identificar vulnerabilidades 
                          em sistemas governamentais e empresariais antes que hackers maliciosos as explorem.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2">
                    <button className="p-2 text-cyan-400 hover:bg-cyan-500/20 rounded">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-red-400 hover:bg-red-500/20 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Post 3 */}
              <div className="bg-gray-900/50 p-4 sm:p-6 rounded-lg border border-orange-500/30">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
                      <img
                        src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800"
                        alt="Transição para Tech em 6 Meses"
                        className="w-full sm:w-20 h-32 sm:h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 text-orange-400 text-xs mb-1">
                          <span>Carreira</span>
                          <span>•</span>
                          <span>28 Dez 2024</span>
                        </div>
                        <h4 className="text-base sm:text-lg font-semibold text-orange-400">Transição para Tech em 6 Meses</h4>
                        <p className="text-gray-300 mt-2 text-sm sm:text-base line-clamp-2">
                          Um guia passo a passo para profissionais que desejam migrar para a área de tecnologia, 
                          com foco em desenvolvimento de software e estratégias práticas para aprendizado acelerado.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2">
                    <button className="p-2 text-cyan-400 hover:bg-cyan-500/20 rounded">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-red-400 hover:bg-red-500/20 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Outras seções similares... */}
        {activeTab === 'testimonials' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-cyan-400">Gerenciar Depoimentos</h2>
              <div className="text-sm text-gray-400">
                Total: {testimonials.length} depoimentos
              </div>
            </div>
            
            {/* Adicionar novo depoimento */}
            <div className="bg-gray-900/50 p-4 sm:p-6 rounded-lg border border-cyan-500/30">
              <h3 className="text-base sm:text-lg font-semibold text-cyan-400 mb-4">Adicionar Novo Depoimento</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Nome do cliente"
                  value={newTestimonial.name}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                  className="p-3 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-400 text-sm sm:text-base"
                />
                <input
                  type="text"
                  placeholder="Cargo/Empresa"
                  value={newTestimonial.role}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, role: e.target.value })}
                  className="p-3 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-400 text-sm sm:text-base"
                />
              </div>
              <textarea
                placeholder="Depoimento"
                rows={3}
                value={newTestimonial.text}
                onChange={(e) => setNewTestimonial({ ...newTestimonial, text: e.target.value })}
                className="w-full p-3 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-400 mt-4 text-sm sm:text-base"
              />
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Avatar do Cliente
                </label>
                <ImageUpload
                  currentImage={newTestimonial.avatar_url}
                  onImageUploaded={(url) => setNewTestimonial({ ...newTestimonial, avatar_url: url })}
                  folder="avatars"
                  recommendedSize="200x200px"
                />
              </div>
              <button
                onClick={handleAddTestimonial}
                disabled={loading || testimonialsLoading}
                className="mt-4 px-4 sm:px-6 py-2 bg-cyan-500/20 border border-cyan-400 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-all duration-300 disabled:opacity-50 text-sm sm:text-base"
              >
                <Plus className="w-3 sm:w-4 h-3 sm:h-4 inline mr-2" />
                Adicionar Depoimento
              </button>
            </div>

            {/* Lista de depoimentos */}
            <div className="space-y-4">
              {testimonialsLoading ? (
                <div className="text-center py-8">
                  <Loader className="w-8 h-8 text-cyan-400 animate-spin mx-auto mb-2" />
                  <p className="text-gray-400">Carregando depoimentos do Supabase...</p>
                </div>
              ) : testimonials.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">Nenhum depoimento encontrado no banco de dados</p>
                  <p className="text-gray-500 text-sm mt-2">Adicione o primeiro depoimento acima</p>
                </div>
              ) : (
                testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="bg-gray-900/50 p-4 sm:p-6 rounded-lg border border-purple-500/30">
                    <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
                      {testimonial.avatar_url && (
                        <img
                          src={testimonial.avatar_url}
                          alt={testimonial.name}
                          className="w-16 h-16 object-cover rounded-full mx-auto sm:mx-0"
                        />
                      )}
                      <div className="flex-1 text-center sm:text-left">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-2">
                          <h4 className="text-base sm:text-lg font-semibold text-purple-400">{testimonial.name}</h4>
                          <span className="text-gray-400 text-sm">{testimonial.role}</span>
                        </div>
                        <p className="text-gray-300 italic text-sm sm:text-base">"{testimonial.text}"</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Seção de Palestras */}
        {activeTab === 'talks' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-cyan-400">Gerenciar Palestras</h2>
              <div className="text-sm text-gray-400">
                Total: {talks.length} palestras
              </div>
            </div>
            
            {/* Adicionar nova palestra */}
            <div className="bg-gray-900/50 p-4 sm:p-6 rounded-lg border border-cyan-500/30">
              <h3 className="text-base sm:text-lg font-semibold text-cyan-400 mb-4">Adicionar Nova Palestra</h3>
              <input
                type="text"
                placeholder="Título da palestra"
                value={newTalk.title}
                onChange={(e) => setNewTalk({ ...newTalk, title: e.target.value })}
                className="w-full p-3 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-400 mb-4 text-sm sm:text-base"
              />
              <textarea
                placeholder="Descrição da palestra"
                rows={3}
                value={newTalk.description}
                onChange={(e) => setNewTalk({ ...newTalk, description: e.target.value })}
                className="w-full p-3 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-400 mb-4 text-sm sm:text-base"
              />
              <input
                type="text"
                placeholder="Tags (separadas por vírgula)"
                value={newTalk.tags}
                onChange={(e) => setNewTalk({ ...newTalk, tags: e.target.value })}
                className="w-full p-3 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-400 mb-4 text-sm sm:text-base"
              />
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Imagem da Palestra
                </label>
                <ImageUpload
                  currentImage={newTalk.image_url}
                  onImageUploaded={(url) => setNewTalk({ ...newTalk, image_url: url })}
                  folder="talks"
                  recommendedSize="800x400px"
                />
              </div>
              <button
                onClick={handleAddTalk}
                disabled={loading || talksLoading}
                className="px-4 sm:px-6 py-2 bg-cyan-500/20 border border-cyan-400 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-all duration-300 disabled:opacity-50 text-sm sm:text-base"
              >
                <Plus className="w-3 sm:w-4 h-3 sm:h-4 inline mr-2" />
                Adicionar Palestra
              </button>
            </div>

            {/* Lista de palestras */}
            <div className="space-y-4">
              {talksLoading ? (
                <div className="text-center py-8">
                  <Loader className="w-8 h-8 text-cyan-400 animate-spin mx-auto mb-2" />
                  <p className="text-gray-400">Carregando palestras do Supabase...</p>
                </div>
              ) : talks.length === 0 ? (
                <div className="text-center py-8">
                  <Mic className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">Nenhuma palestra encontrada no banco de dados</p>
                  <p className="text-gray-500 text-sm mt-2">Adicione a primeira palestra acima</p>
                </div>
              ) : (
                talks.map((talk) => (
                  <div key={talk.id} className="bg-gray-900/50 p-4 sm:p-6 rounded-lg border border-purple-500/30">
                    <div className="flex flex-col lg:flex-row lg:items-start space-y-4 lg:space-y-0 lg:space-x-4">
                      {talk.image_url && (
                        <img
                          src={talk.image_url}
                          alt={talk.title}
                          className="w-full lg:w-20 h-32 lg:h-20 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="text-base sm:text-lg font-semibold text-purple-400">{talk.title}</h4>
                        <p className="text-gray-300 mt-2 text-sm sm:text-base">{talk.description}</p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {(Array.isArray(talk.tags) ? talk.tags : []).map((tag, index) => (
                            <span key={index} className="px-2 sm:px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs sm:text-sm">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Seção de Configurações */}
        {activeTab === 'settings' && (
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-cyan-400">Configurações do Site</h2>
            
            {settingsLoading ? (
              <div className="text-center py-8">
                <Loader className="w-8 h-8 text-cyan-400 animate-spin mx-auto mb-2" />
                <p className="text-gray-400">Carregando configurações do Supabase...</p>
              </div>
            ) : editingSettings ? (
              <div className="space-y-4 sm:space-y-6">
                <div className="bg-gray-900/50 p-4 sm:p-6 rounded-lg border border-cyan-500/30">
                  <h3 className="text-base sm:text-lg font-semibold text-cyan-400 mb-4">Editar Configurações</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Título do Site
                      </label>
                      <input
                        type="text"
                        value={editingSettings.site_title}
                        onChange={(e) => setEditingSettings({ ...editingSettings, site_title: e.target.value })}
                        className="w-full p-3 bg-black border border-gray-600 rounded-lg text-white text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Descrição do Site
                      </label>
                      <textarea
                        rows={3}
                        value={editingSettings.site_description}
                        onChange={(e) => setEditingSettings({ ...editingSettings, site_description: e.target.value })}
                        className="w-full p-3 bg-black border border-gray-600 rounded-lg text-white text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Título Hero
                      </label>
                      <input
                        type="text"
                        value={editingSettings.hero_title}
                        onChange={(e) => setEditingSettings({ ...editingSettings, hero_title: e.target.value })}
                        className="w-full p-3 bg-black border border-gray-600 rounded-lg text-white text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Subtítulo Hero
                      </label>
                      <input
                        type="text"
                        value={editingSettings.hero_subtitle}
                        onChange={(e) => setEditingSettings({ ...editingSettings, hero_subtitle: e.target.value })}
                        className="w-full p-3 bg-black border border-gray-600 rounded-lg text-white text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Texto Sobre
                      </label>
                      <textarea
                        rows={3}
                        value={editingSettings.about_text}
                        onChange={(e) => setEditingSettings({ ...editingSettings, about_text: e.target.value })}
                        className="w-full p-3 bg-black border border-gray-600 rounded-lg text-white text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Habilidades (separadas por vírgula)
                      </label>
                      <textarea
                        rows={4}
                        value={Array.isArray(editingSettings.skills) ? editingSettings.skills.join(', ') : editingSettings.skills}
                        onChange={(e) => setEditingSettings({
                          ...editingSettings,
                          skills: e.target.value.split(',').map((s: string) => s.trim()).filter((s: string) => s)
                        })}
                        className="w-full p-3 bg-black border border-gray-600 rounded-lg text-white text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Foto de Perfil
                      </label>
                      <ImageUpload
                        currentImage={editingSettings.profile_image_url}
                        onImageUploaded={(url) => setEditingSettings({ ...editingSettings, profile_image_url: url })}
                        folder="profile"
                        recommendedSize="400x400px"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-6">
                    <button
                      onClick={async () => {
                        try {
                          setLoading(true);
                          await updateSettings(editingSettings);
                          setEditingSettings(null);
                          showSuccessMessage('✅ Configurações atualizadas com sucesso!');
                        } catch (error) {
                          console.error('❌ Erro ao atualizar configurações:', error);
                          showSuccessMessage('❌ Erro ao atualizar configurações: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
                        } finally {
                          setLoading(false);
                        }
                      }}
                      disabled={loading}
                      className="px-4 sm:px-6 py-2 bg-green-500/20 border border-green-400 text-green-400 rounded-lg hover:bg-green-500/30 transition-all duration-300 disabled:opacity-50 text-sm sm:text-base"
                    >
                      <Save className="w-3 sm:w-4 h-3 sm:h-4 inline mr-2" />
                      Salvar Configurações
                    </button>
                    <button
                      onClick={() => setEditingSettings(null)}
                      className="px-4 sm:px-6 py-2 bg-gray-500/20 border border-gray-400 text-gray-400 rounded-lg hover:bg-gray-500/30 transition-all duration-300 text-sm sm:text-base"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-900/50 p-4 sm:p-6 rounded-lg border border-cyan-500/30">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                  <h3 className="text-base sm:text-lg font-semibold text-cyan-400">Configurações Atuais</h3>
                  <button
                    onClick={() => setEditingSettings(settings)}
                    className="mt-2 sm:mt-0 px-4 py-2 bg-cyan-500/20 border border-cyan-400 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-all duration-300 text-sm sm:text-base"
                  >
                    <Edit className="w-3 sm:w-4 h-3 sm:h-4 inline mr-2" />
                    Editar
                  </button>
                </div>
                {settings ? (
                  <div className="space-y-4 text-gray-300 text-sm sm:text-base">
                    <div>
                      <strong className="text-cyan-400">Título:</strong> {settings.site_title}
                    </div>
                    <div>
                      <strong className="text-cyan-400">Descrição:</strong> {settings.site_description}
                    </div>
                    <div>
                      <strong className="text-cyan-400">Hero Título:</strong> {settings.hero_title}
                    </div>
                    <div>
                      <strong className="text-cyan-400">Hero Subtítulo:</strong> {settings.hero_subtitle}
                    </div>
                    <div>
                      <strong className="text-cyan-400">Sobre:</strong> {settings.about_text}
                    </div>
                    <div>
                      <strong className="text-cyan-400">Foto de Perfil:</strong>
                      {settings.profile_image_url ? (
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 mt-2">
                          <img
                            src={settings.profile_image_url}
                            alt="Profile"
                            className="w-16 h-16 object-cover rounded-full"
                          />
                          <span className="text-green-400">✅ Configurada</span>
                        </div>
                      ) : (
                        <span className="text-yellow-400 ml-2">⚠️ Não configurada</span>
                      )}
                    </div>
                    <div>
                      <strong className="text-cyan-400">Habilidades:</strong>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {(Array.isArray(settings.skills) ? settings.skills : []).map((skill, index) => (
                          <span key={index} className="px-2 sm:px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs sm:text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">Nenhuma configuração encontrada no banco de dados</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* User Management Modal */}
      {showUserManagement && (
        <UserManagement onClose={() => setShowUserManagement(false)} />
      )}

      {/* Google Analytics Setup Modal */}
      {showAnalyticsSetup && (
        <GoogleAnalyticsSetup onClose={() => setShowAnalyticsSetup(false)} />
      )}

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

export default AdminPanel;