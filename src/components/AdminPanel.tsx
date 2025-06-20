import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X, BarChart3, Settings, Database, Users, MessageSquare, Code, Mic, Loader, ArrowLeft, Eye, Upload, Image as ImageIcon, Bell, UserCog, TrendingUp } from 'lucide-react';
import AdminDashboard from './AdminDashboard';
import ImageUpload from './ImageUpload';
import UserManagement from './UserManagement';
import NotificationSystem from './NotificationSystem';
import GoogleAnalyticsSetup from './GoogleAnalyticsSetup';

interface AdminPanelProps {
  onClose: () => void;
  onBackToFrontend: () => void;
}

interface Project {
  id: number;
  title: string;
  description: string;
  tech: string[];
  image_url?: string;
}

interface Testimonial {
  id: number;
  name: string;
  role: string;
  text: string;
  avatar_url?: string;
}

interface Talk {
  id: number;
  title: string;
  description: string;
  tags: string[];
  image_url?: string;
}

interface SiteSettings {
  site_title: string;
  site_description: string;
  hero_title: string;
  hero_subtitle: string;
  about_text: string;
  skills: string[];
  profile_image_url?: string;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose, onBackToFrontend }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [showAnalyticsSetup, setShowAnalyticsSetup] = useState(false);

  // Mock data - em produção viria do Supabase
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      title: "Sistema Bancário Seguro",
      description: "Plataforma bancária com múltiplas camadas de segurança e detecção de fraudes em tempo real.",
      tech: ["Java", "Spring Boot", "PostgreSQL", "Redis"],
      image_url: "https://images.pexels.com/photos/159888/pexels-photo-159888.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      id: 2,
      title: "E-commerce Inteligente",
      description: "Plataforma de comércio eletrônico com IA para recomendações personalizadas.",
      tech: ["React", "Node.js", "MongoDB", "TensorFlow"],
      image_url: "https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800"
    }
  ]);

  const [testimonials, setTestimonials] = useState<Testimonial[]>([
    {
      id: 1,
      name: "Ana Silva",
      role: "CTO - TechCorp",
      text: "O DevIem transformou nossa arquitetura de segurança. Sua experiência em cybersecurity salvou nossa empresa de múltiplos ataques.",
      avatar_url: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200"
    }
  ]);

  const [talks, setTalks] = useState<Talk[]>([
    {
      id: 1,
      title: "Segurança Cibernética na Era da IA",
      description: "Como a inteligência artificial está transformando o cenário de segurança digital e quais são os novos desafios para proteção de dados.",
      tags: ["Cybersecurity", "AI", "Data Protection"],
      image_url: "https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=800"
    }
  ]);

  const [settings, setSettings] = useState<SiteSettings>({
    site_title: "DevIem - Desenvolvedor • Mentor • Especialista em IA • Ethical Hacker",
    site_description: "20+ anos de experiência em desenvolvimento, mentoria em transição de carreira, especialista em IA e cybersecurity.",
    hero_title: "DEVIEM",
    hero_subtitle: "Desenvolvedor • Mentor • Especialista em IA • Ethical Hacker",
    about_text: "Mais de 20 anos transformando ideias em realidade digital",
    skills: [
      "JavaScript/TypeScript", "Python", "Java", "C#", "PHP", "React", "Angular", "Vue.js",
      "Node.js", "Spring Boot", ".NET", "Laravel", "Docker", "Kubernetes", "AWS", "Azure",
      "Machine Learning", "AI Tools", "Cybersecurity", "Ethical Hacking", "Penetration Testing"
    ],
    profile_image_url: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400"
  });

  // Estados de edição
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [editingTalk, setEditingTalk] = useState<Talk | null>(null);
  const [editingSettings, setEditingSettings] = useState<SiteSettings | null>(null);

  // Estados para novos itens
  const [newProject, setNewProject] = useState({ title: '', description: '', tech: '', image_url: '' });
  const [newTestimonial, setNewTestimonial] = useState({ name: '', role: '', text: '', avatar_url: '' });
  const [newTalk, setNewTalk] = useState({ title: '', description: '', tags: '', image_url: '' });

  const handleLogout = () => {
    localStorage.removeItem('deviem_admin_token');
    localStorage.removeItem('deviem_admin_session');
    onBackToFrontend();
  };

  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // Funções para projetos
  const handleAddProject = async () => {
    if (newProject.title && newProject.description) {
      setLoading(true);
      const project: Project = {
        id: Date.now(),
        title: newProject.title,
        description: newProject.description,
        tech: newProject.tech.split(',').map(t => t.trim()).filter(t => t),
        image_url: newProject.image_url || undefined
      };
      setProjects([...projects, project]);
      setNewProject({ title: '', description: '', tech: '', image_url: '' });
      showSuccessMessage('✅ Projeto adicionado com sucesso!');
      setLoading(false);
    }
  };

  const handleUpdateProject = () => {
    if (editingProject) {
      setProjects(projects.map(p => p.id === editingProject.id ? editingProject : p));
      setEditingProject(null);
      showSuccessMessage('✅ Projeto atualizado com sucesso!');
    }
  };

  const handleDeleteProject = (id: number) => {
    if (confirm('Tem certeza que deseja excluir este projeto?')) {
      setProjects(projects.filter(p => p.id !== id));
      showSuccessMessage('✅ Projeto excluído com sucesso!');
    }
  };

  // Funções similares para testimonials e talks...
  const handleAddTestimonial = () => {
    if (newTestimonial.name && newTestimonial.text) {
      const testimonial: Testimonial = {
        id: Date.now(),
        name: newTestimonial.name,
        role: newTestimonial.role,
        text: newTestimonial.text,
        avatar_url: newTestimonial.avatar_url || undefined
      };
      setTestimonials([...testimonials, testimonial]);
      setNewTestimonial({ name: '', role: '', text: '', avatar_url: '' });
      showSuccessMessage('✅ Depoimento adicionado com sucesso!');
    }
  };

  const handleAddTalk = () => {
    if (newTalk.title && newTalk.description) {
      const talk: Talk = {
        id: Date.now(),
        title: newTalk.title,
        description: newTalk.description,
        tags: newTalk.tags.split(',').map(t => t.trim()).filter(t => t),
        image_url: newTalk.image_url || undefined
      };
      setTalks([...talks, talk]);
      setNewTalk({ title: '', description: '', tags: '', image_url: '' });
      showSuccessMessage('✅ Palestra adicionada com sucesso!');
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
        {loading && (
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
                          value={editingProject.tech.join(', ')}
                          onChange={(e) => setEditingProject({ 
                            ...editingProject, 
                            tech: e.target.value.split(',').map(t => t.trim()).filter(t => t)
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
                              {project.tech.map((tech, index) => (
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
                        {talk.tags.map((tag, index) => (
                          <span key={index} className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
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
                        value={editingSettings.skills.join(', ')}
                        onChange={(e) => setEditingSettings({ 
                          ...editingSettings, 
                          skills: e.target.value.split(',').map(s => s.trim()).filter(s => s)
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
                      onClick={() => {
                        setSettings(editingSettings);
                        setEditingSettings(null);
                        showSuccessMessage('✅ Configurações atualizadas com sucesso!');
                      }}
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
                      {settings.skills.map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
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