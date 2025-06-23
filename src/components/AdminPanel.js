import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Plus, Edit, Trash2, Save, X, BarChart3, Settings, Database, MessageSquare, Code, Mic, Loader, Eye, UserCog, TrendingUp } from 'lucide-react';
import AdminDashboard from './AdminDashboard';
import ImageUpload from './ImageUpload';
import UserManagement from './UserManagement';
import NotificationSystem from './NotificationSystem';
import GoogleAnalyticsSetup from './GoogleAnalyticsSetup';
import { useProjects, useTestimonials, useTalks, useSiteSettings } from '../hooks/useSupabaseData';
import { logoutAdmin } from '../lib/supabase';
const AdminPanel = ({ onClose, onBackToFrontend }) => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const [showUserManagement, setShowUserManagement] = useState(false);
    const [showAnalyticsSetup, setShowAnalyticsSetup] = useState(false);
    // Usar hooks do Supabase
    const { projects, loading: projectsLoading, addProject, updateProject, deleteProject } = useProjects();
    const { testimonials, loading: testimonialsLoading, addTestimonial, updateTestimonial, deleteTestimonial } = useTestimonials();
    const { talks, loading: talksLoading, addTalk, updateTalk, deleteTalk } = useTalks();
    const { settings, loading: settingsLoading, updateSettings } = useSiteSettings();
    // Estados de edição
    const [editingProject, setEditingProject] = useState(null);
    const [editingTestimonial, setEditingTestimonial] = useState(null);
    const [editingTalk, setEditingTalk] = useState(null);
    const [editingSettings, setEditingSettings] = useState(null);
    // Estados para novos itens
    const [newProject, setNewProject] = useState({ title: '', description: '', tech: '', image_url: '' });
    const [newTestimonial, setNewTestimonial] = useState({ name: '', role: '', text: '', avatar_url: '' });
    const [newTalk, setNewTalk] = useState({ title: '', description: '', tags: '', image_url: '' });
    const handleLogout = () => {
        console.log('🚪 Fazendo logout completo...');
        logoutAdmin(); // Limpar sessão do Supabase
        onBackToFrontend();
    };
    const showSuccessMessage = (message) => {
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
            }
            catch (error) {
                console.error('❌ Erro ao adicionar projeto:', error);
                showSuccessMessage('❌ Erro ao adicionar projeto: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
            }
            finally {
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
            }
            catch (error) {
                console.error('❌ Erro ao atualizar projeto:', error);
                showSuccessMessage('❌ Erro ao atualizar projeto: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
            }
            finally {
                setLoading(false);
            }
        }
    };
    const handleDeleteProject = async (id) => {
        if (confirm('Tem certeza que deseja excluir este projeto?')) {
            try {
                setLoading(true);
                console.log('🗑️ Deletando projeto via AdminPanel...');
                await deleteProject(id);
                showSuccessMessage('✅ Projeto excluído com sucesso do Supabase!');
            }
            catch (error) {
                console.error('❌ Erro ao deletar projeto:', error);
                showSuccessMessage('❌ Erro ao deletar projeto: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
            }
            finally {
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
                showSuccessMessage('✅ Depoimento adicionado com sucesso no Supabase!');
            }
            catch (error) {
                console.error('❌ Erro ao adicionar depoimento:', error);
                showSuccessMessage('❌ Erro ao adicionar depoimento: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
            }
            finally {
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
                showSuccessMessage('✅ Palestra adicionada com sucesso no Supabase!');
            }
            catch (error) {
                console.error('❌ Erro ao adicionar palestra:', error);
                showSuccessMessage('❌ Erro ao adicionar palestra: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
            }
            finally {
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
    return (_jsxs("div", { className: "fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex", children: [_jsxs("div", { className: "w-full sm:w-80 md:w-64 bg-gray-900 border-r border-cyan-500/30 p-4 sm:p-6 overflow-y-auto", children: [_jsxs("div", { className: "flex items-center justify-between mb-6 sm:mb-8", children: [_jsx("h2", { className: "text-lg sm:text-xl font-bold text-cyan-400", children: "Admin Panel" }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(NotificationSystem, {}), _jsx("button", { onClick: onClose, className: "text-gray-400 hover:text-white p-1 sm:p-0", children: _jsx(X, { className: "w-5 sm:w-6 h-5 sm:h-6" }) })] })] }), _jsx("nav", { className: "space-y-2", children: tabs.map((tab) => (_jsxs("button", { onClick: () => setActiveTab(tab.id), className: `w-full flex items-center space-x-3 px-3 sm:px-4 py-3 rounded-lg transition-all duration-300 text-sm sm:text-base ${activeTab === tab.id
                                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-400'
                                : 'text-gray-400 hover:text-cyan-400 hover:bg-gray-800'}`, children: [_jsx(tab.icon, { className: "w-4 sm:w-5 h-4 sm:h-5" }), _jsx("span", { children: tab.title })] }, tab.id))) }), _jsxs("div", { className: "mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-700 space-y-3", children: [_jsxs("button", { onClick: () => setShowAnalyticsSetup(true), className: "w-full px-3 sm:px-4 py-2 bg-green-500/20 border border-green-400 text-green-400 rounded-lg hover:bg-green-500/30 transition-all duration-300 flex items-center justify-center text-sm sm:text-base", children: [_jsx(TrendingUp, { className: "w-3 sm:w-4 h-3 sm:h-4 mr-2" }), "Google Analytics"] }), _jsxs("button", { onClick: () => setShowUserManagement(true), className: "w-full px-3 sm:px-4 py-2 bg-purple-500/20 border border-purple-400 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-all duration-300 flex items-center justify-center text-sm sm:text-base", children: [_jsx(UserCog, { className: "w-3 sm:w-4 h-3 sm:h-4 mr-2" }), "Usu\u00E1rios"] }), _jsxs("button", { onClick: onBackToFrontend, className: "w-full px-3 sm:px-4 py-2 bg-cyan-500/20 border border-cyan-400 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-all duration-300 flex items-center justify-center text-sm sm:text-base", children: [_jsx(Eye, { className: "w-3 sm:w-4 h-3 sm:h-4 mr-2" }), "Ver Site"] }), _jsx("button", { onClick: handleLogout, className: "w-full px-3 sm:px-4 py-2 bg-red-500/20 border border-red-400 text-red-400 rounded-lg hover:bg-red-500/30 transition-all duration-300 text-sm sm:text-base", children: "Sair" })] })] }), _jsxs("div", { className: "flex-1 p-4 sm:p-6 overflow-y-auto", children: [successMessage && (_jsx("div", { className: "fixed top-4 right-4 bg-green-500/20 border border-green-400 text-green-400 px-4 sm:px-6 py-3 rounded-lg flex items-center z-60 text-sm sm:text-base max-w-xs sm:max-w-md", children: successMessage })), loading && (_jsxs("div", { className: "fixed top-4 right-4 bg-cyan-500/20 border border-cyan-400 text-cyan-400 px-3 sm:px-4 py-2 rounded-lg flex items-center z-60 text-sm", children: [_jsx(Loader, { className: "w-3 sm:w-4 h-3 sm:h-4 mr-2 animate-spin" }), "Processando..."] })), activeTab === 'dashboard' && _jsx(AdminDashboard, {}), activeTab === 'projects' && (_jsxs("div", { className: "space-y-4 sm:space-y-6", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [_jsx("h2", { className: "text-xl sm:text-2xl font-bold text-cyan-400", children: "Gerenciar Projetos" }), _jsxs("div", { className: "text-sm text-gray-400", children: ["Total: ", projects.length, " projetos"] })] }), _jsxs("div", { className: "bg-gray-900/50 p-4 sm:p-6 rounded-lg border border-cyan-500/30", children: [_jsx("h3", { className: "text-base sm:text-lg font-semibold text-cyan-400 mb-4", children: "Adicionar Novo Projeto" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsx("input", { type: "text", placeholder: "T\u00EDtulo do projeto", value: newProject.title, onChange: (e) => setNewProject({ ...newProject, title: e.target.value }), className: "p-3 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-400 text-sm sm:text-base" }), _jsx("input", { type: "text", placeholder: "Tecnologias (separadas por v\u00EDrgula)", value: newProject.tech, onChange: (e) => setNewProject({ ...newProject, tech: e.target.value }), className: "p-3 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-400 text-sm sm:text-base" })] }), _jsx("textarea", { placeholder: "Descri\u00E7\u00E3o do projeto", rows: 3, value: newProject.description, onChange: (e) => setNewProject({ ...newProject, description: e.target.value }), className: "w-full p-3 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-400 mt-4 text-sm sm:text-base" }), _jsxs("div", { className: "mt-4", children: [_jsx("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Imagem do Projeto" }), _jsx(ImageUpload, { currentImage: newProject.image_url, onImageUploaded: (url) => setNewProject({ ...newProject, image_url: url }), folder: "projects" })] }), _jsxs("button", { onClick: handleAddProject, disabled: loading || projectsLoading, className: "mt-4 px-4 sm:px-6 py-2 bg-cyan-500/20 border border-cyan-400 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-all duration-300 disabled:opacity-50 text-sm sm:text-base", children: [_jsx(Plus, { className: "w-3 sm:w-4 h-3 sm:h-4 inline mr-2" }), "Adicionar Projeto"] })] }), _jsx("div", { className: "space-y-4", children: projectsLoading ? (_jsxs("div", { className: "text-center py-8", children: [_jsx(Loader, { className: "w-8 h-8 text-cyan-400 animate-spin mx-auto mb-2" }), _jsx("p", { className: "text-gray-400", children: "Carregando projetos do Supabase..." })] })) : projects.length === 0 ? (_jsxs("div", { className: "text-center py-8", children: [_jsx(Database, { className: "w-12 h-12 text-gray-400 mx-auto mb-4" }), _jsx("p", { className: "text-gray-400", children: "Nenhum projeto encontrado no banco de dados" }), _jsx("p", { className: "text-gray-500 text-sm mt-2", children: "Adicione o primeiro projeto acima" })] })) : (projects.map((project) => (_jsx("div", { className: "bg-gray-900/50 p-4 sm:p-6 rounded-lg border border-purple-500/30", children: editingProject?.id === project.id ? (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsx("input", { type: "text", value: editingProject.title, onChange: (e) => setEditingProject({ ...editingProject, title: e.target.value }), className: "p-3 bg-black border border-gray-600 rounded-lg text-white text-sm sm:text-base" }), _jsx("input", { type: "text", value: Array.isArray(editingProject.tech) ? editingProject.tech.join(', ') : editingProject.tech, onChange: (e) => setEditingProject({
                                                            ...editingProject,
                                                            tech: e.target.value.split(',').map((t) => t.trim()).filter((t) => t)
                                                        }), className: "p-3 bg-black border border-gray-600 rounded-lg text-white text-sm sm:text-base" })] }), _jsx("textarea", { value: editingProject.description, onChange: (e) => setEditingProject({ ...editingProject, description: e.target.value }), rows: 3, className: "w-full p-3 bg-black border border-gray-600 rounded-lg text-white text-sm sm:text-base" }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Imagem do Projeto" }), _jsx(ImageUpload, { currentImage: editingProject.image_url, onImageUploaded: (url) => setEditingProject({ ...editingProject, image_url: url }), folder: "projects" })] }), _jsxs("div", { className: "flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2", children: [_jsxs("button", { onClick: handleUpdateProject, disabled: loading, className: "px-4 py-2 bg-green-500/20 border border-green-400 text-green-400 rounded-lg hover:bg-green-500/30 transition-all duration-300 disabled:opacity-50 text-sm sm:text-base", children: [_jsx(Save, { className: "w-3 sm:w-4 h-3 sm:h-4 inline mr-2" }), "Salvar"] }), _jsx("button", { onClick: () => setEditingProject(null), className: "px-4 py-2 bg-gray-500/20 border border-gray-400 text-gray-400 rounded-lg hover:bg-gray-500/30 transition-all duration-300 text-sm sm:text-base", children: "Cancelar" })] })] })) : (_jsxs("div", { className: "flex flex-col lg:flex-row lg:items-start justify-between gap-4", children: [_jsx("div", { className: "flex-1", children: _jsxs("div", { className: "flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-4", children: [project.image_url && (_jsx("img", { src: project.image_url, alt: project.title, className: "w-full sm:w-20 h-32 sm:h-20 object-cover rounded-lg" })), _jsxs("div", { className: "flex-1", children: [_jsx("h4", { className: "text-base sm:text-lg font-semibold text-purple-400", children: project.title }), _jsx("p", { className: "text-gray-300 mt-2 text-sm sm:text-base", children: project.description }), _jsx("div", { className: "flex flex-wrap gap-2 mt-3", children: (Array.isArray(project.tech) ? project.tech : []).map((tech, index) => (_jsx("span", { className: "px-2 sm:px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-xs sm:text-sm", children: tech }, index))) })] })] }) }), _jsxs("div", { className: "flex flex-row lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2", children: [_jsx("button", { onClick: () => setEditingProject(project), className: "p-2 text-cyan-400 hover:bg-cyan-500/20 rounded", children: _jsx(Edit, { className: "w-4 h-4" }) }), _jsx("button", { onClick: () => handleDeleteProject(project.id), disabled: loading, className: "p-2 text-red-400 hover:bg-red-500/20 rounded disabled:opacity-50", children: _jsx(Trash2, { className: "w-4 h-4" }) })] })] })) }, project.id)))) })] })), activeTab === 'testimonials' && (_jsxs("div", { className: "space-y-4 sm:space-y-6", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [_jsx("h2", { className: "text-xl sm:text-2xl font-bold text-cyan-400", children: "Gerenciar Depoimentos" }), _jsxs("div", { className: "text-sm text-gray-400", children: ["Total: ", testimonials.length, " depoimentos"] })] }), _jsxs("div", { className: "bg-gray-900/50 p-4 sm:p-6 rounded-lg border border-cyan-500/30", children: [_jsx("h3", { className: "text-base sm:text-lg font-semibold text-cyan-400 mb-4", children: "Adicionar Novo Depoimento" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsx("input", { type: "text", placeholder: "Nome do cliente", value: newTestimonial.name, onChange: (e) => setNewTestimonial({ ...newTestimonial, name: e.target.value }), className: "p-3 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-400 text-sm sm:text-base" }), _jsx("input", { type: "text", placeholder: "Cargo/Empresa", value: newTestimonial.role, onChange: (e) => setNewTestimonial({ ...newTestimonial, role: e.target.value }), className: "p-3 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-400 text-sm sm:text-base" })] }), _jsx("textarea", { placeholder: "Depoimento", rows: 3, value: newTestimonial.text, onChange: (e) => setNewTestimonial({ ...newTestimonial, text: e.target.value }), className: "w-full p-3 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-400 mt-4 text-sm sm:text-base" }), _jsxs("div", { className: "mt-4", children: [_jsx("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Avatar do Cliente" }), _jsx(ImageUpload, { currentImage: newTestimonial.avatar_url, onImageUploaded: (url) => setNewTestimonial({ ...newTestimonial, avatar_url: url }), folder: "avatars" })] }), _jsxs("button", { onClick: handleAddTestimonial, disabled: loading || testimonialsLoading, className: "mt-4 px-4 sm:px-6 py-2 bg-cyan-500/20 border border-cyan-400 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-all duration-300 disabled:opacity-50 text-sm sm:text-base", children: [_jsx(Plus, { className: "w-3 sm:w-4 h-3 sm:h-4 inline mr-2" }), "Adicionar Depoimento"] })] }), _jsx("div", { className: "space-y-4", children: testimonialsLoading ? (_jsxs("div", { className: "text-center py-8", children: [_jsx(Loader, { className: "w-8 h-8 text-cyan-400 animate-spin mx-auto mb-2" }), _jsx("p", { className: "text-gray-400", children: "Carregando depoimentos do Supabase..." })] })) : testimonials.length === 0 ? (_jsxs("div", { className: "text-center py-8", children: [_jsx(MessageSquare, { className: "w-12 h-12 text-gray-400 mx-auto mb-4" }), _jsx("p", { className: "text-gray-400", children: "Nenhum depoimento encontrado no banco de dados" }), _jsx("p", { className: "text-gray-500 text-sm mt-2", children: "Adicione o primeiro depoimento acima" })] })) : (testimonials.map((testimonial) => (_jsx("div", { className: "bg-gray-900/50 p-4 sm:p-6 rounded-lg border border-purple-500/30", children: _jsxs("div", { className: "flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-4", children: [testimonial.avatar_url && (_jsx("img", { src: testimonial.avatar_url, alt: testimonial.name, className: "w-16 h-16 object-cover rounded-full mx-auto sm:mx-0" })), _jsxs("div", { className: "flex-1 text-center sm:text-left", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-2", children: [_jsx("h4", { className: "text-base sm:text-lg font-semibold text-purple-400", children: testimonial.name }), _jsx("span", { className: "text-gray-400 text-sm", children: testimonial.role })] }), _jsxs("p", { className: "text-gray-300 italic text-sm sm:text-base", children: ["\"", testimonial.text, "\""] })] })] }) }, testimonial.id)))) })] })), activeTab === 'talks' && (_jsxs("div", { className: "space-y-4 sm:space-y-6", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [_jsx("h2", { className: "text-xl sm:text-2xl font-bold text-cyan-400", children: "Gerenciar Palestras" }), _jsxs("div", { className: "text-sm text-gray-400", children: ["Total: ", talks.length, " palestras"] })] }), _jsxs("div", { className: "bg-gray-900/50 p-4 sm:p-6 rounded-lg border border-cyan-500/30", children: [_jsx("h3", { className: "text-base sm:text-lg font-semibold text-cyan-400 mb-4", children: "Adicionar Nova Palestra" }), _jsx("input", { type: "text", placeholder: "T\u00EDtulo da palestra", value: newTalk.title, onChange: (e) => setNewTalk({ ...newTalk, title: e.target.value }), className: "w-full p-3 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-400 mb-4 text-sm sm:text-base" }), _jsx("textarea", { placeholder: "Descri\u00E7\u00E3o da palestra", rows: 3, value: newTalk.description, onChange: (e) => setNewTalk({ ...newTalk, description: e.target.value }), className: "w-full p-3 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-400 mb-4 text-sm sm:text-base" }), _jsx("input", { type: "text", placeholder: "Tags (separadas por v\u00EDrgula)", value: newTalk.tags, onChange: (e) => setNewTalk({ ...newTalk, tags: e.target.value }), className: "w-full p-3 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-400 mb-4 text-sm sm:text-base" }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Imagem da Palestra" }), _jsx(ImageUpload, { currentImage: newTalk.image_url, onImageUploaded: (url) => setNewTalk({ ...newTalk, image_url: url }), folder: "talks" })] }), _jsxs("button", { onClick: handleAddTalk, disabled: loading || talksLoading, className: "px-4 sm:px-6 py-2 bg-cyan-500/20 border border-cyan-400 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-all duration-300 disabled:opacity-50 text-sm sm:text-base", children: [_jsx(Plus, { className: "w-3 sm:w-4 h-3 sm:h-4 inline mr-2" }), "Adicionar Palestra"] })] }), _jsx("div", { className: "space-y-4", children: talksLoading ? (_jsxs("div", { className: "text-center py-8", children: [_jsx(Loader, { className: "w-8 h-8 text-cyan-400 animate-spin mx-auto mb-2" }), _jsx("p", { className: "text-gray-400", children: "Carregando palestras do Supabase..." })] })) : talks.length === 0 ? (_jsxs("div", { className: "text-center py-8", children: [_jsx(Mic, { className: "w-12 h-12 text-gray-400 mx-auto mb-4" }), _jsx("p", { className: "text-gray-400", children: "Nenhuma palestra encontrada no banco de dados" }), _jsx("p", { className: "text-gray-500 text-sm mt-2", children: "Adicione a primeira palestra acima" })] })) : (talks.map((talk) => (_jsx("div", { className: "bg-gray-900/50 p-4 sm:p-6 rounded-lg border border-purple-500/30", children: _jsxs("div", { className: "flex flex-col lg:flex-row lg:items-start space-y-4 lg:space-y-0 lg:space-x-4", children: [talk.image_url && (_jsx("img", { src: talk.image_url, alt: talk.title, className: "w-full lg:w-20 h-32 lg:h-20 object-cover rounded-lg" })), _jsxs("div", { className: "flex-1", children: [_jsx("h4", { className: "text-base sm:text-lg font-semibold text-purple-400", children: talk.title }), _jsx("p", { className: "text-gray-300 mt-2 text-sm sm:text-base", children: talk.description }), _jsx("div", { className: "flex flex-wrap gap-2 mt-3", children: (Array.isArray(talk.tags) ? talk.tags : []).map((tag, index) => (_jsx("span", { className: "px-2 sm:px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs sm:text-sm", children: tag }, index))) })] })] }) }, talk.id)))) })] })), activeTab === 'settings' && (_jsxs("div", { className: "space-y-4 sm:space-y-6", children: [_jsx("h2", { className: "text-xl sm:text-2xl font-bold text-cyan-400", children: "Configura\u00E7\u00F5es do Site" }), settingsLoading ? (_jsxs("div", { className: "text-center py-8", children: [_jsx(Loader, { className: "w-8 h-8 text-cyan-400 animate-spin mx-auto mb-2" }), _jsx("p", { className: "text-gray-400", children: "Carregando configura\u00E7\u00F5es do Supabase..." })] })) : editingSettings ? (_jsx("div", { className: "space-y-4 sm:space-y-6", children: _jsxs("div", { className: "bg-gray-900/50 p-4 sm:p-6 rounded-lg border border-cyan-500/30", children: [_jsx("h3", { className: "text-base sm:text-lg font-semibold text-cyan-400 mb-4", children: "Editar Configura\u00E7\u00F5es" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "T\u00EDtulo do Site" }), _jsx("input", { type: "text", value: editingSettings.site_title, onChange: (e) => setEditingSettings({ ...editingSettings, site_title: e.target.value }), className: "w-full p-3 bg-black border border-gray-600 rounded-lg text-white text-sm sm:text-base" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Descri\u00E7\u00E3o do Site" }), _jsx("textarea", { rows: 3, value: editingSettings.site_description, onChange: (e) => setEditingSettings({ ...editingSettings, site_description: e.target.value }), className: "w-full p-3 bg-black border border-gray-600 rounded-lg text-white text-sm sm:text-base" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "T\u00EDtulo Hero" }), _jsx("input", { type: "text", value: editingSettings.hero_title, onChange: (e) => setEditingSettings({ ...editingSettings, hero_title: e.target.value }), className: "w-full p-3 bg-black border border-gray-600 rounded-lg text-white text-sm sm:text-base" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Subt\u00EDtulo Hero" }), _jsx("input", { type: "text", value: editingSettings.hero_subtitle, onChange: (e) => setEditingSettings({ ...editingSettings, hero_subtitle: e.target.value }), className: "w-full p-3 bg-black border border-gray-600 rounded-lg text-white text-sm sm:text-base" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Texto Sobre" }), _jsx("textarea", { rows: 3, value: editingSettings.about_text, onChange: (e) => setEditingSettings({ ...editingSettings, about_text: e.target.value }), className: "w-full p-3 bg-black border border-gray-600 rounded-lg text-white text-sm sm:text-base" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Habilidades (separadas por v\u00EDrgula)" }), _jsx("textarea", { rows: 4, value: Array.isArray(editingSettings.skills) ? editingSettings.skills.join(', ') : editingSettings.skills, onChange: (e) => setEditingSettings({
                                                                ...editingSettings,
                                                                skills: e.target.value.split(',').map((s) => s.trim()).filter((s) => s)
                                                            }), className: "w-full p-3 bg-black border border-gray-600 rounded-lg text-white text-sm sm:text-base" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Foto de Perfil" }), _jsx(ImageUpload, { currentImage: editingSettings.profile_image_url, onImageUploaded: (url) => setEditingSettings({ ...editingSettings, profile_image_url: url }), folder: "profile" })] })] }), _jsxs("div", { className: "flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-6", children: [_jsxs("button", { onClick: async () => {
                                                        try {
                                                            setLoading(true);
                                                            await updateSettings(editingSettings);
                                                            setEditingSettings(null);
                                                            showSuccessMessage('✅ Configurações atualizadas com sucesso no Supabase!');
                                                        }
                                                        catch (error) {
                                                            console.error('❌ Erro ao atualizar configurações:', error);
                                                            showSuccessMessage('❌ Erro ao atualizar configurações: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
                                                        }
                                                        finally {
                                                            setLoading(false);
                                                        }
                                                    }, disabled: loading, className: "px-4 sm:px-6 py-2 bg-green-500/20 border border-green-400 text-green-400 rounded-lg hover:bg-green-500/30 transition-all duration-300 disabled:opacity-50 text-sm sm:text-base", children: [_jsx(Save, { className: "w-3 sm:w-4 h-3 sm:h-4 inline mr-2" }), "Salvar Configura\u00E7\u00F5es"] }), _jsx("button", { onClick: () => setEditingSettings(null), className: "px-4 sm:px-6 py-2 bg-gray-500/20 border border-gray-400 text-gray-400 rounded-lg hover:bg-gray-500/30 transition-all duration-300 text-sm sm:text-base", children: "Cancelar" })] })] }) })) : (_jsxs("div", { className: "bg-gray-900/50 p-4 sm:p-6 rounded-lg border border-cyan-500/30", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between mb-4", children: [_jsx("h3", { className: "text-base sm:text-lg font-semibold text-cyan-400", children: "Configura\u00E7\u00F5es Atuais" }), _jsxs("button", { onClick: () => setEditingSettings(settings), className: "mt-2 sm:mt-0 px-4 py-2 bg-cyan-500/20 border border-cyan-400 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-all duration-300 text-sm sm:text-base", children: [_jsx(Edit, { className: "w-3 sm:w-4 h-3 sm:h-4 inline mr-2" }), "Editar"] })] }), settings ? (_jsxs("div", { className: "space-y-4 text-gray-300 text-sm sm:text-base", children: [_jsxs("div", { children: [_jsx("strong", { className: "text-cyan-400", children: "T\u00EDtulo:" }), " ", settings.site_title] }), _jsxs("div", { children: [_jsx("strong", { className: "text-cyan-400", children: "Descri\u00E7\u00E3o:" }), " ", settings.site_description] }), _jsxs("div", { children: [_jsx("strong", { className: "text-cyan-400", children: "Hero T\u00EDtulo:" }), " ", settings.hero_title] }), _jsxs("div", { children: [_jsx("strong", { className: "text-cyan-400", children: "Hero Subt\u00EDtulo:" }), " ", settings.hero_subtitle] }), _jsxs("div", { children: [_jsx("strong", { className: "text-cyan-400", children: "Sobre:" }), " ", settings.about_text] }), _jsxs("div", { children: [_jsx("strong", { className: "text-cyan-400", children: "Foto de Perfil:" }), settings.profile_image_url ? (_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 mt-2", children: [_jsx("img", { src: settings.profile_image_url, alt: "Profile", className: "w-16 h-16 object-cover rounded-full" }), _jsx("span", { className: "text-green-400", children: "\u2705 Configurada" })] })) : (_jsx("span", { className: "text-yellow-400 ml-2", children: "\u26A0\uFE0F N\u00E3o configurada" }))] }), _jsxs("div", { children: [_jsx("strong", { className: "text-cyan-400", children: "Habilidades:" }), _jsx("div", { className: "flex flex-wrap gap-2 mt-2", children: (Array.isArray(settings.skills) ? settings.skills : []).map((skill, index) => (_jsx("span", { className: "px-2 sm:px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs sm:text-sm", children: skill }, index))) })] })] })) : (_jsxs("div", { className: "text-center py-8", children: [_jsx(Settings, { className: "w-12 h-12 text-gray-400 mx-auto mb-4" }), _jsx("p", { className: "text-gray-400", children: "Nenhuma configura\u00E7\u00E3o encontrada no banco de dados" })] }))] }))] }))] }), showUserManagement && (_jsx(UserManagement, { onClose: () => setShowUserManagement(false) })), showAnalyticsSetup && (_jsx(GoogleAnalyticsSetup, { onClose: () => setShowAnalyticsSetup(false) })), _jsx("style", { dangerouslySetInnerHTML: {
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
export default AdminPanel;
