import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, FileText, Tag, Calendar, Clock, Search, Filter, ArrowRight, Link, Image as ImageIcon } from 'lucide-react';
import ImageUpload from './ImageUpload';

// Tipos para o blog
interface BlogPost {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  image_url?: string;
  tags: string[];
  category: string;
  published_at: string;
  author: string;
  slug: string;
}

const BlogManager: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([
    {
      id: 1,
      title: "Introdução à Segurança Cibernética",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.",
      excerpt: "Uma introdução aos conceitos básicos de segurança cibernética e como proteger seus dados.",
      image_url: "https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=1200",
      tags: ["Cybersecurity", "Beginners", "Data Protection"],
      category: "Security",
      published_at: "2025-01-15T10:00:00Z",
      author: "DevIem",
      slug: "introducao-seguranca-cibernetica"
    },
    {
      id: 2,
      title: "Como Iniciar sua Carreira em Desenvolvimento Web",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.",
      excerpt: "Guia completo para quem deseja iniciar uma carreira em desenvolvimento web em 2025.",
      image_url: "https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=1200",
      tags: ["Career", "Web Development", "Beginners"],
      category: "Career",
      published_at: "2025-01-10T14:30:00Z",
      author: "DevIem",
      slug: "iniciar-carreira-desenvolvimento-web"
    }
  ]);
  
  const [loading, setLoading] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [newPost, setNewPost] = useState<Partial<BlogPost>>({
    title: '',
    content: '',
    excerpt: '',
    image_url: '',
    tags: [],
    category: 'Technology',
    author: 'DevIem'
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [filter, setFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const categories = [
    { id: 'all', name: 'Todas Categorias' },
    { id: 'Technology', name: 'Tecnologia' },
    { id: 'Security', name: 'Segurança' },
    { id: 'Career', name: 'Carreira' },
    { id: 'Development', name: 'Desenvolvimento' },
    { id: 'AI', name: 'Inteligência Artificial' }
  ];

  const showMessage = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleAddPost = () => {
    if (!newPost.title || !newPost.content) {
      showMessage('❌ Título e conteúdo são obrigatórios');
      return;
    }

    try {
      setLoading(true);
      
      // Gerar slug a partir do título
      const slug = newPost.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, '-');
      
      // Criar novo post
      const post: BlogPost = {
        id: Date.now(),
        title: newPost.title || '',
        content: newPost.content || '',
        excerpt: newPost.excerpt || newPost.content?.substring(0, 150) + '...' || '',
        image_url: newPost.image_url,
        tags: Array.isArray(newPost.tags) ? newPost.tags : 
              typeof newPost.tags === 'string' ? newPost.tags.split(',').map(t => t.trim()) : [],
        category: newPost.category || 'Technology',
        published_at: new Date().toISOString(),
        author: newPost.author || 'DevIem',
        slug: slug
      };
      
      setPosts(prev => [post, ...prev]);
      setNewPost({
        title: '',
        content: '',
        excerpt: '',
        image_url: '',
        tags: [],
        category: 'Technology',
        author: 'DevIem'
      });
      
      showMessage('✅ Artigo adicionado com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar artigo:', error);
      showMessage('❌ Erro ao adicionar artigo');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePost = () => {
    if (!editingPost) return;
    
    try {
      setLoading(true);
      
      // Atualizar post
      setPosts(prev => prev.map(p => p.id === editingPost.id ? editingPost : p));
      setEditingPost(null);
      
      showMessage('✅ Artigo atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar artigo:', error);
      showMessage('❌ Erro ao atualizar artigo');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = (id: number) => {
    if (confirm('Tem certeza que deseja excluir este artigo?')) {
      try {
        setPosts(prev => prev.filter(p => p.id !== id));
        showMessage('✅ Artigo excluído com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir artigo:', error);
        showMessage('❌ Erro ao excluir artigo');
      }
    }
  };

  // Filtrar posts
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(filter.toLowerCase()) || 
                         post.content.toLowerCase().includes(filter.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(filter.toLowerCase()));
    
    const matchesCategory = categoryFilter === 'all' || post.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  // Formatar data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-cyan-400">Gerenciar Blog</h2>
        <div className="text-sm text-gray-400">
          Total: {posts.length} artigos
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className={`p-4 rounded-lg border ${successMessage.startsWith('✅') 
          ? 'bg-green-500/20 border-green-500/30 text-green-400' 
          : 'bg-red-500/20 border-red-500/30 text-red-400'}`}>
          {successMessage}
        </div>
      )}

      {/* Adicionar/Editar Post */}
      <div className="bg-gray-900/50 p-4 sm:p-6 rounded-lg border border-cyan-500/30">
        <h3 className="text-base sm:text-lg font-semibold text-cyan-400 mb-4">
          {editingPost ? 'Editar Artigo' : 'Adicionar Novo Artigo'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Título do artigo"
            value={editingPost?.title || newPost.title || ''}
            onChange={(e) => editingPost 
              ? setEditingPost({...editingPost, title: e.target.value})
              : setNewPost({...newPost, title: e.target.value})
            }
            className="p-3 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-400"
          />
          
          <div className="flex space-x-2">
            <select
              value={editingPost?.category || newPost.category || 'Technology'}
              onChange={(e) => editingPost
                ? setEditingPost({...editingPost, category: e.target.value})
                : setNewPost({...newPost, category: e.target.value})
              }
              className="flex-1 p-3 bg-black border border-gray-600 rounded-lg text-white"
            >
              {categories.filter(c => c.id !== 'all').map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            
            <input
              type="text"
              placeholder="Autor"
              value={editingPost?.author || newPost.author || 'DevIem'}
              onChange={(e) => editingPost
                ? setEditingPost({...editingPost, author: e.target.value})
                : setNewPost({...newPost, author: e.target.value})
              }
              className="w-1/3 p-3 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-400"
            />
          </div>
        </div>
        
        <div className="mb-4">
          <textarea
            placeholder="Resumo do artigo (será exibido na listagem)"
            rows={2}
            value={editingPost?.excerpt || newPost.excerpt || ''}
            onChange={(e) => editingPost
              ? setEditingPost({...editingPost, excerpt: e.target.value})
              : setNewPost({...newPost, excerpt: e.target.value})
            }
            className="w-full p-3 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-400"
          />
        </div>
        
        <div className="mb-4">
          <textarea
            placeholder="Conteúdo completo do artigo"
            rows={8}
            value={editingPost?.content || newPost.content || ''}
            onChange={(e) => editingPost
              ? setEditingPost({...editingPost, content: e.target.value})
              : setNewPost({...newPost, content: e.target.value})
            }
            className="w-full p-3 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-400"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Tags (separadas por vírgula)
          </label>
          <input
            type="text"
            placeholder="ex: Cybersecurity, Beginners, Tutorial"
            value={Array.isArray(editingPost?.tags || newPost.tags) 
              ? (editingPost?.tags || newPost.tags || []).join(', ')
              : editingPost?.tags || newPost.tags || ''
            }
            onChange={(e) => {
              const tagsArray = e.target.value.split(',').map(t => t.trim()).filter(t => t);
              editingPost
                ? setEditingPost({...editingPost, tags: tagsArray})
                : setNewPost({...newPost, tags: tagsArray});
            }}
            className="w-full p-3 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-400"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Imagem de Capa
          </label>
          <ImageUpload
            currentImage={editingPost?.image_url || newPost.image_url || ''}
            onImageUploaded={(url) => editingPost
              ? setEditingPost({...editingPost, image_url: url})
              : setNewPost({...newPost, image_url: url})
            }
            folder="blog"
            recommendedSize="1200x630px"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          {editingPost ? (
            <>
              <button
                onClick={handleUpdatePost}
                disabled={loading}
                className="px-4 py-2 bg-green-500/20 border border-green-400 text-green-400 rounded-lg hover:bg-green-500/30 transition-all duration-300 disabled:opacity-50"
              >
                <Save className="w-4 h-4 inline mr-2" />
                Salvar Alterações
              </button>
              <button
                onClick={() => setEditingPost(null)}
                className="px-4 py-2 bg-gray-500/20 border border-gray-400 text-gray-400 rounded-lg hover:bg-gray-500/30 transition-all duration-300"
              >
                <X className="w-4 h-4 inline mr-2" />
                Cancelar
              </button>
            </>
          ) : (
            <button
              onClick={handleAddPost}
              disabled={loading}
              className="px-4 py-2 bg-cyan-500/20 border border-cyan-400 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-all duration-300 disabled:opacity-50"
            >
              <Plus className="w-4 h-4 inline mr-2" />
              Publicar Artigo
            </button>
          )}
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar artigos..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pl-10 p-3 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-400"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="text-gray-400 w-4 h-4" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="p-3 bg-black border border-gray-600 rounded-lg text-white"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Posts */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-8 bg-gray-900/30 rounded-lg border border-gray-700">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">Nenhum artigo encontrado</p>
            <p className="text-gray-500 text-sm mt-2">
              {filter || categoryFilter !== 'all' 
                ? 'Tente ajustar os filtros de busca' 
                : 'Adicione seu primeiro artigo acima'}
            </p>
          </div>
        ) : (
          filteredPosts.map(post => (
            <div key={post.id} className="bg-gray-900/50 p-4 sm:p-6 rounded-lg border border-purple-500/30 hover:border-purple-400 transition-all duration-300">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Imagem */}
                {post.image_url && (
                  <div className="lg:w-1/4">
                    <div className="relative aspect-video lg:aspect-square overflow-hidden rounded-lg border border-gray-700">
                      <img 
                        src={post.image_url} 
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
                
                {/* Conteúdo */}
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">
                      {post.category}
                    </span>
                    {post.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                    {post.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs">
                        +{post.tags.length - 3}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-lg sm:text-xl font-bold text-purple-400 mb-2">{post.title}</h3>
                  
                  <p className="text-gray-300 text-sm mb-4">{post.excerpt}</p>
                  
                  <div className="flex flex-wrap items-center justify-between text-xs text-gray-400 mb-4">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(post.published_at)}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {Math.ceil(post.content.length / 1000)} min de leitura
                      </span>
                    </div>
                    <span>{post.author}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setEditingPost(post)}
                      className="px-3 py-1.5 bg-cyan-500/20 text-cyan-400 rounded-lg text-sm hover:bg-cyan-500/30 transition-all duration-300"
                    >
                      <Edit className="w-3 h-3 inline mr-1" />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/30 transition-all duration-300"
                    >
                      <Trash2 className="w-3 h-3 inline mr-1" />
                      Excluir
                    </button>
                    <a
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg text-sm hover:bg-green-500/30 transition-all duration-300 flex items-center"
                    >
                      <ArrowRight className="w-3 h-3 mr-1" />
                      Ver Artigo
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BlogManager;