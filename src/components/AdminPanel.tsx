import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, BarChart3, Settings, Database, MessageSquare, Code, Mic, Loader, Eye, UserCog, TrendingUp, Book, FileText } from 'lucide-react';
import AdminDashboard from './AdminDashboard';
import ImageUpload from './ImageUpload';
import UserManagement from './UserManagement';
import NotificationSystem from './NotificationSystem';
import GoogleAnalyticsSetup from './GoogleAnalyticsSetup';
import BlogManager from './BlogManager';
import ClassesManager from './ClassesManager';
import { useProjects, useTestimonials, useTalks, useSiteSettings } from '../hooks/useSupabaseData';
import { logoutAdmin } from '../lib/supabase';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  // Efeito para fechar menu mobile quando mudar de tab
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [activeTab]);

  const handleLogout = () => {
    console.log('🚪 Fazendo logout completo...');
    logoutAdmin(); // Limpar sessão do Supabase
    onBackToFrontend();
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
        showSuccessMessage('✅ Projeto adicionado com sucesso no Supabase!');
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
        showSuccessMessage('✅ Projeto atualizado com sucesso no Supabase!');
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
        showSuccessMessage('✅ Projeto excluído com sucesso do Supabase!');
      } catch (error) {
        console.error('❌ Erro ao deletar projeto:', error);
        showSuccessMessage('❌ Erro ao deletar projeto: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
      } finally {
        setLoading(false);
      }
    }
  };

  // Funções para depoimentos
  const handleAddTestimonial = async () => {
    if (newTestimonial.name && newTestimonial.text) {
      try {
        setLoading(true);
        await addTestimonial(newTestimonial);
        setNewTestimonial({ name: '', role: '', text: '', avatar_url: '' });
        showSuccessMessage('✅ Depoimento adicionado com sucesso no Supabase!');
      } catch (error) {
        console.error('❌ Erro ao adicionar depoimento:', error);
        showSuccessMessage('❌ Erro ao adicionar depoimento: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
      } finally {
        setLoading(false);
      }
    }
  };

  const handleUpdateTestimonial = async () => {
    if (editingTestimonial) {
      try {
        setLoading(true);
        await updateTestimonial(editingTestimonial.id, editingTestimonial);
        setEditingTestimonial(null);
        showSuccessMessage('✅ Depoimento atualizado com sucesso no Supabase!');
      } catch (error) {
        console.error('❌ Erro ao atualizar depoimento:', error);
        showSuccessMessage('❌ Erro ao atualizar depoimento: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteTestimonial = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este depoimento?')) {
      try {
        setLoading(true);
        await deleteTestimonial(id);
        showSuccessMessage('✅ Depoimento excluído com sucesso do Supabase!');
      } catch (error) {
        console.error('❌ Erro ao deletar depoimento:', error);
        showSuccessMessage('❌ Erro ao deletar depoimento: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
      } finally {
        setLoading(false);
      }
    }
  };

  // Funções para palestras
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
        showSuccessMessage('✅ Palestra adicionada com sucesso no Supabase!');
      } catch (error) {
        console.error('❌ Erro ao adicionar palestra:', error);
        showSuccessMessage('❌ Erro ao adicionar palestra: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
      } finally {
        setLoading(false);
      }
    }
  };

  const handleUpdateTalk = async () => {
    if (editingTalk) {
      try {
        setLoading(true);
        await updateTalk(editingTalk.id, editingTalk);
        setEditingTalk(null);
        showSuccessMessage('✅ Palestra atualizada com sucesso no Supabase!');
      } catch (error) {
        console.error('❌ Erro ao atualizar palestra:', error);
        showSuccessMessage('❌ Erro ao atualizar palestra: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteTalk = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir esta palestra?')) {
      try {
        setLoading(true);
        await deleteTalk(id);
        showSuccessMessage('✅ Palestra excluída com sucesso do Supabase!');
      } catch (error) {
        console.error('❌ Erro ao deletar palestra:', error);
        showSuccessMessage('❌ Erro ao deletar palestra: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
      } finally {
        setLoading(false);
      }
    }
  };

  const tabs = [
    { id: 'dashboard', title: 'Dashboard', icon: BarChart3 },
    { id: 'projects', title: 'Projetos', icon: Code },
    { id: 'testimonials', title: 'Depoimentos', icon: MessageSquare },
    { id: 'talks', title: 'Palestras', icon: Mic },
    { id: 'blog', title: 'Blog', icon: FileText },
    { id: 'classes', title: 'Aulas', icon: Book },
    { id: 'settings', title: 'Configurações', icon: Settings }
  ];

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex">
      {/* Mobile Menu Toggle Button */}
      <div className="fixed top-4 left-4 z-60 md:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg bg-gray-800 text-cyan-400 border border-cyan-500/30"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Settings className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar - RESPONSIVIDADE MELHORADA */}
      <div className={`w-full sm:w-80 md:w-64 bg-gray-900 border-r border-cyan-500/30 p-4 sm:p-6 overflow-y-auto fixed md:static h-full z-50 transition-all duration-300 transform ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-cyan-400">Admin Panel</h2>
          <div className="flex items-center space-x-2">
            <NotificationSystem />
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onClose();
              }}
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
              onClick={() => {
                setActiveTab(tab.id);
                setIsMobileMenuOpen(false);
              }}
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
            onClick={() => {
              setShowAnalyticsSetup(true);
              setIsMobileMenuOpen(false);
            }}
            className="w-full px-3 sm:px-4 py-2 bg-green-500/20 border border-green-400 text-green-400 rounded-lg hover:bg-green-500/30 transition-all duration-300 flex items-center justify-center text-sm sm:text-base"
          >
            <TrendingUp className="w-3 sm:w-4 h-3 sm:h-4 mr-2" />
            Google Analytics
          </button>
          <button
            onClick={() => {
              setShowUserManagement(true);
              setIsMobileMenuOpen(false);
            }}
            className="w-full px-3 sm:px-4 py-2 bg-purple-500/20 border border-purple-400 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-all duration-300 flex items-center justify-center text-sm sm:text-base"
          >
            <UserCog className="w-3 sm:w-4 h-3 sm:h-4 mr-2" />
            Usuários
          </button>
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              onBackToFrontend();
            }}
            className="w-full px-3 sm:px-4 py-2 bg-cyan-500/20 border border-cyan-400 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-all duration-300 flex items-center justify-center text-sm sm:text-base"
          >
            <Eye className="w-3 sm:w-4 h-3 sm:h-4 mr-2" />
            Ver Site
          </button>
          <button
            onClick={handleLogout}
            className="w-full px-3 sm:px-4 py-2 bg-red-500/20 border border-red-400 text-red-400 rounded-lg hover:bg-red-500/30 transition-all duration-300 text-sm sm:text-base"
          >
            Sair
          </button>
        </div>
      </div>

      {/* Overlay para fechar menu mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content - RESPONSIVIDADE MELHORADA */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto md:ml-0 pt-16 md:pt-4">
        {/* Success Message */}
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

        {/* Seção de Depoimentos */}
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
                    {editingTestimonial?.id === testimonial.id ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input
                            type="text"
                            value={editingTestimonial.name}
                            onChange={(e) => setEditingTestimonial({ ...editingTestimonial, name: e.target.value })}
                            className="p-3 bg-black border border-gray-600 rounded-lg text-white text-sm sm:text-base"
                            placeholder="Nome do cliente"
                          />
                          <input
                            type="text"
                            value={editingTestimonial.role}
                            onChange={(e) => setEditingTestimonial({ ...editingTestimonial, role: e.target.value })}
                            className="p-3 bg-black border border-gray-600 rounded-lg text-white text-sm sm:text-base"
                            placeholder="Cargo/Empresa"
                          />
                        </div>
                        <textarea
                          value={editingTestimonial.text}
                          onChange={(e) => setEditingTestimonial({ ...editingTestimonial, text: e.target.value })}
                          rows={3}
                          className="w-full p-3 bg-black border border-gray-600 rounded-lg text-white text-sm sm:text-base"
                          placeholder="Depoimento"
                        />
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Avatar do Cliente
                          </label>
                          <ImageUpload
                            currentImage={editingTestimonial.avatar_url}
                            onImageUploaded={(url) => setEditingTestimonial({ ...editingTestimonial, avatar_url: url })}
                            folder="avatars"
                            recommendedSize="200x200px"
                          />
                        </div>
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                          <button
                            onClick={handleUpdateTestimonial}
                            disabled={loading}
                            className="px-4 py-2 bg-green-500/20 border border-green-400 text-green-400 rounded-lg hover:bg-green-500/30 transition-all duration-300 disabled:opacity-50 text-sm sm:text-base"
                          >
                            <Save className="w-3 sm:w-4 h-3 sm:h-4 inline mr-2" />
                            Salvar
                          </button>
                          <button
                            onClick={() => setEditingTestimonial(null)}
                            className="px-4 py-2 bg-gray-500/20 border border-gray-400 text-gray-400 rounded-lg hover:bg-gray-500/30 transition-all duration-300 text-sm sm:text-base"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
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
                          
                          <div className="flex justify-center sm:justify-start space-x-2 mt-4">
                            <button
                              onClick={() => setEditingTestimonial(testimonial)}
                              className="px-3 py-1.5 bg-cyan-500/20 text-cyan-400 rounded-lg text-sm hover:bg-cyan-500/30 transition-all duration-300"
                            >
                              <Edit className="w-3 h-3 inline mr-1" />
                              Editar
                            </button>
                            <button
                              onClick={() => handleDeleteTestimonial(testimonial.id)}
                              className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/30 transition-all duration-300"
                            >
                              <Trash2 className="w-3 h-3 inline mr-1" />
                              Excluir
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
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
                    {editingTalk?.id === talk.id ? (
                      <div className="space-y-4">
                        <input
                          type="text"
                          value={editingTalk.title}
                          onChange={(e) => setEditingTalk({ ...editingTalk, title: e.target.value })}
                          className="w-full p-3 bg-black border border-gray-600 rounded-lg text-white text-sm sm:text-base"
                          placeholder="Título da palestra"
                        />
                        <textarea
                          value={editingTalk.description}
                          onChange={(e) => setEditingTalk({ ...editingTalk, description: e.target.value })}
                          rows={3}
                          className="w-full p-3 bg-black border border-gray-600 rounded-lg text-white text-sm sm:text-base"
                          placeholder="Descrição da palestra"
                        />
                        <input
                          type="text"
                          value={Array.isArray(editingTalk.tags) ? editingTalk.tags.join(', ') : editingTalk.tags}
                          onChange={(e) => setEditingTalk({
                            ...editingTalk,
                            tags: e.target.value.split(',').map((t: string) => t.trim()).filter((t: string) => t)
                          })}
                          className="w-full p-3 bg-black border border-gray-600 rounded-lg text-white text-sm sm:text-base"
                          placeholder="Tags (separadas por vírgula)"
                        />
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Imagem da Palestra
                          </label>
                          <ImageUpload
                            currentImage={editingTalk.image_url}
                            onImageUploaded={(url) => setEditingTalk({ ...editingTalk, image_url: url })}
                            folder="talks"
                            recommendedSize="800x400px"
                          />
                        </div>
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                          <button
                            onClick={handleUpdateTalk}
                            disabled={loading}
                            className="px-4 py-2 bg-green-500/20 border border-green-400 text-green-400 rounded-lg hover:bg-green-500/30 transition-all duration-300 disabled:opacity-50 text-sm sm:text-base"
                          >
                            <Save className="w-3 sm:w-4 h-3 sm:h-4 inline mr-2" />
                            Salvar
                          </button>
                          <button
                            onClick={() => setEditingTalk(null)}
                            className="px-4 py-2 bg-gray-500/20 border border-gray-400 text-gray-400 rounded-lg hover:bg-gray-500/30 transition-all duration-300 text-sm sm:text-base"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
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
                          
                          <div className="flex space-x-2 mt-4">
                            <button
                              onClick={() => setEditingTalk(talk)}
                              className="px-3 py-1.5 bg-cyan-500/20 text-cyan-400 rounded-lg text-sm hover:bg-cyan-500/30 transition-all duration-300"
                            >
                              <Edit className="w-3 h-3 inline mr-1" />
                              Editar
                            </button>
                            <button
                              onClick={() => handleDeleteTalk(talk.id)}
                              className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/30 transition-all duration-300"
                            >
                              <Trash2 className="w-3 h-3 inline mr-1" />
                              Excluir
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Seção de Blog */}
        {activeTab === 'blog' && (
          <BlogManager />
        )}

        {/* Seção de Aulas Particulares */}
        {activeTab === 'classes' && (
          <ClassesManager />
        )}

        {/* Seção de Configurações - LAYOUT MELHORADO */}
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
                  
                  {/* Layout melhorado com grid */}
                  <div className="space-y-6">
                    {/* Primeira linha: Título e Descrição */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <input
                          type="text"
                          value={editingSettings.site_description}
                          onChange={(e) => setEditingSettings({ ...editingSettings, site_description: e.target.value })}
                          className="w-full p-3 bg-black border border-gray-600 rounded-lg text-white text-sm sm:text-base"
                        />
                      </div>
                    </div>
                    
                    {/* Segunda linha: Hero Título e Subtítulo */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    </div>
                    
                    {/* Terceira linha: Texto Sobre e Habilidades */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Texto Sobre
                        </label>
                        <textarea
                          rows={4}
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
                    </div>
                    
                    {/* Quarta linha: Foto de Perfil */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Foto de Perfil
                        </label>
                        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                          <ImageUpload
                            currentImage={editingSettings.profile_image_url}
                            onImageUploaded={(url) => setEditingSettings({ ...editingSettings, profile_image_url: url })}
                            folder="profile"
                            recommendedSize="400x400px"
                          />
                          
                          {editingSettings.profile_image_url && (
                            <div className="mt-4 p-4 bg-black/30 rounded-lg border border-gray-700">
                              <h4 className="text-sm font-medium text-gray-300 mb-2">Preview:</h4>
                              <div className="flex justify-center">
                                <div className="cyber-border rounded-full p-1 w-32 h-32">
                                  <img 
                                    src={editingSettings.profile_image_url} 
                                    alt="Profile Preview" 
                                    className="w-full h-full object-cover rounded-full" 
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Link para Aula Experimental
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={editingSettings.class_link || ''}
                            onChange={(e) => setEditingSettings({ ...editingSettings, class_link: e.target.value })}
                            placeholder="https://wa.me/5511999999999"
                            className="flex-1 p-3 bg-black border border-gray-600 rounded-lg text-white text-sm sm:text-base"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Link para WhatsApp, Calendly ou qualquer página de agendamento
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-6">
                    <button
                      onClick={async () => {
                        try {
                          setLoading(true);
                          await updateSettings(editingSettings);
                          setEditingSettings(null);
                          showSuccessMessage('✅ Configurações atualizadas com sucesso no Supabase!');
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        <strong className="text-cyan-400">Link Aula Experimental:</strong> {settings.class_link || 'Não configurado'}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <strong className="text-cyan-400 block mb-2">Foto de Perfil:</strong>
                        {settings.profile_image_url ? (
                          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
                              <div className="cyber-border rounded-full p-1 w-32 h-32">
                                <img
                                  src={settings.profile_image_url}
                                  alt="Profile"
                                  className="w-full h-full object-cover rounded-full"
                                />
                              </div>
                              <span className="text-green-400">✅ Configurada</span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-yellow-400 ml-2">⚠️ Não configurada</span>
                        )}
                      </div>
                      
                      <div>
                        <strong className="text-cyan-400 block mb-2">Habilidades:</strong>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {(Array.isArray(settings.skills) ? settings.skills : []).map((skill, index) => (
                            <span key={index} className="px-2 sm:px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs sm:text-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
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