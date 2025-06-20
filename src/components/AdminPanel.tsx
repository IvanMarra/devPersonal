import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X, BarChart3, Settings, Database, Users, MessageSquare, Code, Mic, Loader, ArrowLeft, Eye, Upload, Image as ImageIcon, Bell, UserCog, TrendingUp } from 'lucide-react';
import AdminDashboard from './AdminDashboard';
import ImageUpload from './ImageUpload';
import UserManagement from './UserManagement';
import NotificationSystem from './NotificationSystem';
import GoogleAnalyticsSetup from './GoogleAnalyticsSetup';
import { useProjects, useTestimonials, useTalks, useSiteSettings } from '../hooks/useSupabaseData';

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

  // Usar hooks do Supabase para dados reais
  const { 
    projects, 
    addProject, 
    updateProject, 
    deleteProject,
    loading: projectsLoading 
  } = useProjects();
  
  const { 
    testimonials, 
    addTestimonial, 
    updateTestimonial, 
    deleteTestimonial,
    loading: testimonialsLoading 
  } = useTestimonials();
  
  const { 
    talks, 
    addTalk, 
    updateTalk, 
    deleteTalk,
    loading: talksLoading 
  } = useTalks();
  
  const { 
    settings, 
    updateSettings,
    loading: settingsLoading 
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

  const handleLogout = () => {
    console.log('🚪 Iniciando processo de logout...');
    
    // Limpar TODAS as informações de autenticação
    localStorage.removeItem('deviem_admin_token');
    localStorage.removeItem('deviem_admin_session');
    localStorage.removeItem('deviem_users');
    
    // Limpar qualquer cache do Supabase
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.includes('supabase') || key.includes('sb-') || key.includes('deviem')) {
        localStorage.removeItem(key);
      }
    });
    
    // Limpar sessionStorage também
    sessionStorage.clear();
    
    console.log('✅ Dados de autenticação limpos');
    
    // Voltar ao frontend e forçar recarregamento
    onBackToFrontend();
    
    // Forçar recarregamento da página para garantir estado limpo
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // Funções para projetos com Supabase real
  const handleAddProject = async () => {
    if (newProject.title && newProject.description) {
      setLoading(true);
      try {
        console.log('➕ Adicionando projeto:', newProject.title);
        
        const projectData = {
          title: newProject.title,
          description: newProject.description,
          tech: newProject.tech.split(',').map(t => t.trim()).filter(t => t),
          image_url: newProject.image_url || undefined
        };
        
        await addProject(projectData);
        setNewProject({ title: '', description: '', tech: '', image_url: '' });
        showSuccessMessage('✅ Projeto adicionado com sucesso!');
        
        console.log('✅ Projeto adicionado e dados sincronizados');
      } catch (error) {
        console.error('❌ Erro ao adicionar projeto:', error);
        showSuccessMessage('❌ Erro ao adicionar projeto');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleUpdateProject = async () => {
    if (editingProject) {
      setLoading(true);
      try {
        console.log('📝 Atualizando projeto:', editingProject.id);
        
        await updateProject(editingProject.id, {
          title: editingProject.title,
          description: editingProject.description,
          tech: editingProject.tech,
          image_url: editingProject.image_url
        });
        
        setEditingProject(null);
        showSuccessMessage('✅ Projeto atualizado com sucesso!');
        
        console.log('✅ Projeto atualizado e dados sincronizados');
      } catch (error) {
        console.error('❌ Erro ao atualizar projeto:', error);
        showSuccessMessage('❌ Erro ao atualizar projeto');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este projeto?')) {
      setLoading(true);
      try {
        console.log('🗑️ Deletando projeto:', id);
        
        await deleteProject(id);
        showSuccessMessage('✅ Projeto excluído com sucesso!');
        
        console.log('✅ Projeto deletado e dados sincronizados');
      } catch (error) {
        console.error('❌ Erro ao deletar projeto:', error);
        showSuccessMessage('❌ Erro ao deletar projeto');
      } finally {
        setLoading(false);
      }
    }
  };

  // Funções similares para testimonials
  const handleAddTestimonial = async () => {
    if (newTestimonial.name && newTestimonial.text) {
      setLoading(true);
      try {
        console.log('➕ Adicionando depoimento:', newTestimonial.name);
        
        await addTestimonial({
          name: newTestimonial.name,
          role: newTestimonial.role,
          text: newTestimonial.text,
          avatar_url: newTestimonial.avatar_url || undefined
        });
        
        setNewTestimonial({ name: '', role: '', text: '', avatar_url: '' });
        showSuccessMessage('✅ Depoimento adicionado com sucesso!');
        
        console.log('✅ Depoimento adicionado e dados sincronizados');
      } catch (error) {
        console.error('❌ Erro ao adicionar depoimento:', error);
        showSuccessMessage('❌ Erro ao adicionar depoimento');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleUpdateTestimonial = async () => {
    if (editingTestimonial) {
      setLoading(true);
      try {
        console.log('📝 Atualizando depoimento:', editingTestimonial.id);
        
        await updateTestimonial(editingTestimonial.id, {
          name: editingTestimonial.name,
          role: editingTestimonial.role,
          text: editingTestimonial.text,
          avatar_url: editingTestimonial.avatar_url
        });
        
        setEditingTestimonial(null);
        showSuccessMessage('✅ Depoimento atualizado com sucesso!');
        
        console.log('✅ Depoimento atualizado e dados sincronizados');
      } catch (error) {
        console.error('❌ Erro ao atualizar depoimento:', error);
        showSuccessMessage('❌ Erro ao atualizar depoimento');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteTestimonial = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este depoimento?')) {
      setLoading(true);
      try {
        console.log('🗑️ Deletando depoimento:', id);
        
        await deleteTestimonial(id);
        showSuccessMessage('✅ Depoimento excluído com sucesso!');
        
        console.log('✅ Depoimento deletado e dados sincronizados');
      } catch (error) {
        console.error('❌ Erro ao deletar depoimento:', error);
        showSuccessMessage('❌ Erro ao deletar depoimento');
      } finally {
        setLoading(false);
      }
    }
  };

  // Funções para talks
  const handleAddTalk = async () => {
    if (newTalk.title && newTalk.description) {
      setLoading(true);
      try {
        console.log('➕ Adicionando palestra:', newTalk.title);
        
        await addTalk({
          title: newTalk.title,
          description: newTalk.description,
          tags: newTalk.tags.split(',').map(t => t.trim()).filter(t => t),
          image_url: newTalk.image_url || undefined
        });
        
        setNewTalk({ title: '', description: '', tags: '', image_url: '' });
        showSuccessMessage('✅ Palestra adicionada com sucesso!');
        
        console.log('✅ Palestra adicionada e dados sincronizados');
      } catch (error) {
        console.error('❌ Erro ao adicionar palestra:', error);
        showSuccessMessage('❌ Erro ao adicionar palestra');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleUpdateTalk = async () => {
    if (editingTalk) {
      setLoading(true);
      try {
        console.log('📝 Atualizando palestra:', editingTalk.id);
        
        await updateTalk(editingTalk.id, {
          title: editingTalk.title,
          description: editingTalk.description,
          tags: editingTalk.tags,
          image_url: editingTalk.image_url
        });
        
        setEditingTalk(null);
        showSuccessMessage('✅ Palestra atualizada com sucesso!');
        
        console.log('✅ Palestra atualizada e dados sincronizados');
      } catch (error) {
        console.error('❌ Erro ao atualizar palestra:', error);
        showSuccessMessage('❌ Erro ao atualizar palestra');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteTalk = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir esta palestra?')) {
      setLoading(true);
      try {
        console.log('🗑️ Deletando palestra:', id);
        
        await deleteTalk(id);
        showSuccessMessage('✅ Palestra excluída com sucesso!');
        
        console.log('✅ Palestra deletada e dados sincronizados');
      } catch (error) {
        console.error('❌ Erro ao deletar palestra:', error);
        showSuccessMessage('❌ Erro ao deletar palestra');
      } finally {
        setLoading(false);
      }
    }
  };

  // Função para atualizar configurações
  const handleUpdateSettings = async () => {
    if (editingSettings) {
      setLoading(true);
      try {
        console.log('📝 Atualizando configurações do site');
        
        await updateSettings({
          site_title: editingSettings.site_title,
          site_description: editingSettings.site_description,
          hero_title: editingSettings.hero_title,
          hero_subtitle: editingSettings.hero_subtitle,
          about_text: editingSettings.about_text,
          skills: editingSettings.skills,
          profile_image_url: editingSettings.profile_image_url
        });
        
        setEditingSettings(null);
        showSuccessMessage('✅ Configurações atualizadas com sucesso!');
        
        console.log('✅ Configurações atualizadas e dados sincronizados');
      } catch (error) {
        console.error('❌ Erro ao atualizar configurações:', error);
        showSuccessMessage('❌ Erro ao atualizar configurações');
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
    { id: 'settings', title: 'Configurações', icon: Settings }
  ];

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 border-r border-cyan-500/30 p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-cyan-400">Admin Panel</h2>
          <div className="flex items-center space-x-2">
            <NotificationSystem />
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <nav className="space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-400'
                  : 'text-gray-400 hover:text-cyan-400 hover:bg-gray-800'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.title}</span>
            </button>
          ))}
        </nav>

        <div className="mt-8 pt-8 border-t border-gray-700 space-y-3">
          <button
            onClick={() => setShowAnalyticsSetup(true)}
            className="w-full px-4 py-2 bg-green-500/20 border border-green-400 text-green-400 rounded-lg hover:bg-green-500/30 transition-all duration-300 flex items-center justify-center"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Google Analytics
          </button>
          <button
            onClick={() => setShowUserManagement(true)}
            className="w-full px-4 py-2 bg-purple-500/20 border border-purple-400 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-all duration-300 flex items-center justify-center"
          >
            <UserCog className="w-4 h-4 mr-2" />
            Usuários
          </button>
          <button
            onClick={onBackToFrontend}
            className="w-full px-4 py-2 bg-cyan-500/20 border border-cyan-400 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-all duration-300 flex items-center justify-center"
          >
            <Eye className="w-4 h-4 mr-2" />
            Ver Site
          </button>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-500/20 border border-red-400 text-red-400 rounded-lg hover:bg-red-500/30 transition-all duration-300"
          >
            Sair
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Success Message */}
        {successMessage && (
          <div className="fixed top-4 right-4 bg-green-500/20 border border-green-400 text-green-400 px-6 py-3 rounded-lg flex items-center z-60">
            {successMessage}
          </div>
        )}

        {/* Loading Indicator */}
        {(loading || projectsLoading || testimonialsLoading || talksLoading || settingsLoading) && (
          <div className="fixed top-4 right-4 bg-cyan-500/20 border border-cyan-400 text-cyan-400 px-4 py-2 rounded-lg flex items-center z-60">
            <Loader className="w-4 h-4 mr-2 animate-spin" />
            Processando...
          </div>
        )}

        {activeTab === 'dashboard' && <AdminDashboard />}

        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-cyan-400">Gerenciar Projetos</h2>
              <div className="text-sm text-gray-400">
                Total: {projects.length} projetos
              </div>
            </div>
            
            {/* Adicionar novo projeto */}
            <div className="bg-gray-900/50 p-6 rounded-lg border border-cyan-500/30">
              <h3 className="text-lg font-semibold text-cyan-400 mb-4">Adicionar Novo Projeto</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Título do projeto"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  className="p-3 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-400"
                />
                <input
                  type="text"
                  placeholder="Tecnologias (separadas por vírgula)"
                  value={newProject.tech}
                  onChange={(e) => setNewProject({ ...newProject, tech: e.target.value })}
                  className="p-3 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-400"
                />
              </div>
              <textarea
                placeholder="Descrição do projeto"
                rows={3}
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                className="w-full p-3 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-400 mt-4"
              />
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Imagem do Projeto
                </label>
                <ImageUpload
                  currentImage={newProject.image_url}
                  onImageUploaded={(url) => setNewProject({ ...newProject, image_url: url })}
                  folder="projects"
                />
              </div>
              <button
                onClick={handleAddProject}
                disabled={loading}
                className="mt-4 px-6 py-2 bg-cyan-500/20 border border-cyan-400 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-all duration-300 disabled:opacity-50"
              >
                <Plus className="w-4 h-4 inline mr-2" />
                Adicionar Projeto
              </button>
            </div>

            {/* Lista de projetos */}
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="bg-gray-900/50 p-6 rounded-lg border border-purple-500/30">
                  {editingProject?.id === project.id ? (
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          value={editingProject.title}
                          onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                          className="p-3 bg-black border border-gray-600 rounded-lg text-white"
                        />
                        <input
                          type="text"
                          value={Array.isArray(editingProject.tech) ? editingProject.tech.join(', ') : editingProject.tech}
                          onChange={(e) => setEditingProject({ 
                            ...editingProject, 
                            tech: e.target.value.split(',').map((t: string) => t.trim()).filter((t: string) => t)
                          })}
                          className="p-3 bg-black border border-gray-600 rounded-lg text-white"
                        />
                      </div>
                      <textarea
                        value={editingProject.description}
                        onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                        rows={3}
                        className="w-full p-3 bg-black border border-gray-600 rounded-lg text-white"
                      />
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Imagem do Projeto
                        </label>
                        <ImageUpload
                          currentImage={editingProject.image_url}
                          onImageUploaded={(url) => setEditingProject({ ...editingProject, image_url: url })}
                          folder="projects"
                        />
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={handleUpdateProject}
                          disabled={loading}
                          className="px-4 py-2 bg-green-500/20 border border-green-400 text-green-400 rounded-lg hover:bg-green-500/30 transition-all duration-300 disabled:opacity-50"
                        >
                          <Save className="w-4 h-4 inline mr-2" />
                          Salvar
                        </button>
                        <button
                          onClick={() => setEditingProject(null)}
                          className="px-4 py-2 bg-gray-500/20 border border-gray-400 text-gray-400 rounded-lg hover:bg-gray-500/30 transition-all duration-300"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start space-x-4">
                          {project.image_url && (
                            <img
                              src={project.image_url}
                              alt={project.title}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                          )}
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-purple-400">{project.title}</h4>
                            <p className="text-gray-300 mt-2">{project.description}</p>
                            <div className="flex flex-wrap gap-2 mt-3">
                              {(Array.isArray(project.tech) ? project.tech : []).map((tech, index) => (
                                <span key={index} className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm">
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
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
              ))}
            </div>
          </div>
        )}

        {activeTab === 'testimonials' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-cyan-400">Gerenciar Depoimentos</h2>
              <div className="text-sm text-gray-400">
                Total: {testimonials.length} depoimentos
              </div>
            </div>
            
            {/* Adicionar novo depoimento */}
            <div className="bg-gray-900/50 p-6 rounded-lg border border-cyan-500/30">
              <h3 className="text-lg font-semibold text-cyan-400 mb-4">Adicionar Novo Depoimento</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Nome do cliente"
                  value={newTestimonial.name}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                  className="p-3 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-400"
                />
                <input
                  type="text"
                  placeholder="Cargo/Empresa"
                  value={newTestimonial.role}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, role: e.target.value })}
                  className="p-3 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-400"
                />
              </div>
              <textarea
                placeholder="Depoimento"
                rows={3}
                value={newTestimonial.text}
                onChange={(e) => setNewTestimonial({ ...newTestimonial, text: e.target.value })}
                className="w-full p-3 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-400 mt-4"
              />
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Avatar do Cliente
                </label>
                <ImageUpload
                  currentImage={newTestimonial.avatar_url}
                  onImageUploaded={(url) => setNewTestimonial({ ...newTestimonial, avatar_url: url })}
                  folder="avatars"
                />
              </div>
              <button
                onClick={handleAddTestimonial}
                disabled={loading}
                className="mt-4 px-6 py-2 bg-cyan-500/20 border border-cyan-400 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-all duration-300 disabled:opacity-50"
              >
                <Plus className="w-4 h-4 inline mr-2" />
                Adicionar Depoimento
              </button>
            </div>

            {/* Lista de depoimentos */}
            <div className="space-y-4">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-gray-900/50 p-6 rounded-lg border border-purple-500/30">
                  {editingTestimonial?.id === testimonial.id ? (
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          value={editingTestimonial.name}
                          onChange={(e) => setEditingTestimonial({ ...editingTestimonial, name: e.target.value })}
                          className="p-3 bg-black border border-gray-600 rounded-lg text-white"
                        />
                        <input
                          type="text"
                          value={editingTestimonial.role}
                          onChange={(e) => setEditingTestimonial({ ...editingTestimonial, role: e.target.value })}
                          className="p-3 bg-black border border-gray-600 rounded-lg text-white"
                        />
                      </div>
                      <textarea
                        value={editingTestimonial.text}
                        onChange={(e) => setEditingTestimonial({ ...editingTestimonial, text: e.target.value })}
                        rows={3}
                        className="w-full p-3 bg-black border border-gray-600 rounded-lg text-white"
                      />
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Avatar do Cliente
                        </label>
                        <ImageUpload
                          currentImage={editingTestimonial.avatar_url}
                          onImageUploaded={(url) => setEditingTestimonial({ ...editingTestimonial, avatar_url: url })}
                          folder="avatars"
                        />
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={handleUpdateTestimonial}
                          disabled={loading}
                          className="px-4 py-2 bg-green-500/20 border border-green-400 text-green-400 rounded-lg hover:bg-green-500/30 transition-all duration-300 disabled:opacity-50"
                        >
                          <Save className="w-4 h-4 inline mr-2" />
                          Salvar
                        </button>
                        <button
                          onClick={() => setEditingTestimonial(null)}
                          className="px-4 py-2 bg-gray-500/20 border border-gray-400 text-gray-400 rounded-lg hover:bg-gray-500/30 transition-all duration-300"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        {testimonial.avatar_url && (
                          <img
                            src={testimonial.avatar_url}
                            alt={testimonial.name}
                            className="w-16 h-16 object-cover rounded-full"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-lg font-semibold text-purple-400">{testimonial.name}</h4>
                            <span className="text-gray-400 text-sm">{testimonial.role}</span>
                          </div>
                          <p className="text-gray-300 italic">"{testimonial.text}"</p>
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button 
                          onClick={() => setEditingTestimonial(testimonial)}
                          className="p-2 text-cyan-400 hover:bg-cyan-500/20 rounded"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteTestimonial(testimonial.id)}
                          disabled={loading}
                          className="p-2 text-red-400 hover:bg-red-500/20 rounded disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'talks' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-cyan-400">Gerenciar Palestras</h2>
              <div className="text-sm text-gray-400">
                Total: {talks.length} palestras
              </div>
            </div>
            
            {/* Adicionar nova palestra */}
            <div className="bg-gray-900/50 p-6 rounded-lg border border-cyan-500/30">
              <h3 className="text-lg font-semibold text-cyan-400 mb-4">Adicionar Nova Palestra</h3>
              <input
                type="text"
                placeholder="Título da palestra"
                value={newTalk.title}
                onChange={(e) => setNewTalk({ ...newTalk, title: e.target.value })}
                className="w-full p-3 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-400 mb-4"
              />
              <textarea
                placeholder="Descrição da palestra"
                rows={3}
                value={newTalk.description}
                onChange={(e) => setNewTalk({ ...newTalk, description: e.target.value })}
                className="w-full p-3 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-400 mb-4"
              />
              <input
                type="text"
                placeholder="Tags (separadas por vírgula)"
                value={newTalk.tags}
                onChange={(e) => setNewTalk({ ...newTalk, tags: e.target.value })}
                className="w-full p-3 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-400 mb-4"
              />
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Imagem da Palestra
                </label>
                <ImageUpload
                  currentImage={newTalk.image_url}
                  onImageUploaded={(url) => setNewTalk({ ...newTalk, image_url: url })}
                  folder="talks"
                />
              </div>
              <button
                onClick={handleAddTalk}
                disabled={loading}
                className="px-6 py-2 bg-cyan-500/20 border border-cyan-400 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-all duration-300 disabled:opacity-50"
              >
                <Plus className="w-4 h-4 inline mr-2" />
                Adicionar Palestra
              </button>
            </div>

            {/* Lista de palestras */}
            <div className="space-y-4">
              {talks.map((talk) => (
                <div key={talk.id} className="bg-gray-900/50 p-6 rounded-lg border border-purple-500/30">
                  {editingTalk?.id === talk.id ? (
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={editingTalk.title}
                        onChange={(e) => setEditingTalk({ ...editingTalk, title: e.target.value })}
                        className="w-full p-3 bg-black border border-gray-600 rounded-lg text-white"
                      />
                      <textarea
                        value={editingTalk.description}
                        onChange={(e) => setEditingTalk({ ...editingTalk, description: e.target.value })}
                        rows={3}
                        className="w-full p-3 bg-black border border-gray-600 rounded-lg text-white"
                      />
                      <input
                        type="text"
                        value={Array.isArray(editingTalk.tags) ? editingTalk.tags.join(', ') : editingTalk.tags}
                        onChange={(e) => setEditingTalk({ 
                          ...editingTalk, 
                          tags: e.target.value.split(',').map((t: string) => t.trim()).filter((t: string) => t)
                        })}
                        className="w-full p-3 bg-black border border-gray-600 rounded-lg text-white"
                      />
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Imagem da Palestra
                        </label>
                        <ImageUpload
                          currentImage={editingTalk.image_url}
                          onImageUploaded={(url) => setEditingTalk({ ...editingTalk, image_url: url })}
                          folder="talks"
                        />
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={handleUpdateTalk}
                          disabled={loading}
                          className="px-4 py-2 bg-green-500/20 border border-green-400 text-green-400 rounded-lg hover:bg-green-500/30 transition-all duration-300 disabled:opacity-50"
                        >
                          <Save className="w-4 h-4 inline mr-2" />
                          Salvar
                        </button>
                        <button
                          onClick={() => setEditingTalk(null)}
                          className="px-4 py-2 bg-gray-500/20 border border-gray-400 text-gray-400 rounded-lg hover:bg-gray-500/30 transition-all duration-300"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        {talk.image_url && (
                          <img
                            src={talk.image_url}
                            alt={talk.title}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-purple-400">{talk.title}</h4>
                          <p className="text-gray-300 mt-2">{talk.description}</p>
                          <div className="flex flex-wrap gap-2 mt-3">
                            {(Array.isArray(talk.tags) ? talk.tags : []).map((tag, index) => (
                              <span key={index} className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button 
                          onClick={() => setEditingTalk(talk)}
                          className="p-2 text-cyan-400 hover:bg-cyan-500/20 rounded"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteTalk(talk.id)}
                          disabled={loading}
                          className="p-2 text-red-400 hover:bg-red-500/20 rounded disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-cyan-400">Configurações do Site</h2>
            
            {editingSettings ? (
              <div className="space-y-6">
                <div className="bg-gray-900/50 p-6 rounded-lg border border-cyan-500/30">
                  <h3 className="text-lg font-semibold text-cyan-400 mb-4">Editar Configurações</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Título do Site
                      </label>
                      <input
                        type="text"
                        value={editingSettings.site_title}
                        onChange={(e) => setEditingSettings({ ...editingSettings, site_title: e.target.value })}
                        className="w-full p-3 bg-black border border-gray-600 rounded-lg text-white"
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
                        className="w-full p-3 bg-black border border-gray-600 rounded-lg text-white"
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
                        className="w-full p-3 bg-black border border-gray-600 rounded-lg text-white"
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
                        className="w-full p-3 bg-black border border-gray-600 rounded-lg text-white"
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
                        className="w-full p-3 bg-black border border-gray-600 rounded-lg text-white"
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
                        className="w-full p-3 bg-black border border-gray-600 rounded-lg text-white"
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
                      />
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-6">
                    <button
                      onClick={handleUpdateSettings}
                      disabled={loading}
                      className="px-6 py-2 bg-green-500/20 border border-green-400 text-green-400 rounded-lg hover:bg-green-500/30 transition-all duration-300 disabled:opacity-50"
                    >
                      <Save className="w-4 h-4 inline mr-2" />
                      Salvar Configurações
                    </button>
                    <button
                      onClick={() => setEditingSettings(null)}
                      className="px-6 py-2 bg-gray-500/20 border border-gray-400 text-gray-400 rounded-lg hover:bg-gray-500/30 transition-all duration-300"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-900/50 p-6 rounded-lg border border-cyan-500/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-cyan-400">Configurações Atuais</h3>
                  <button
                    onClick={() => setEditingSettings(settings)}
                    className="px-4 py-2 bg-cyan-500/20 border border-cyan-400 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-all duration-300"
                  >
                    <Edit className="w-4 h-4 inline mr-2" />
                    Editar
                  </button>
                </div>
                {settings && (
                  <div className="space-y-4 text-gray-300">
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
                        <div className="flex items-center space-x-3 mt-2">
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
                          <span key={index} className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
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