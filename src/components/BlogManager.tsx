import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, FileText, Tag, Calendar, Clock, Search, Filter, ArrowRight, Link, Image as ImageIcon, Upload, File, Check } from 'lucide-react';
import ImageUpload from './ImageUpload';
import { useBlogPosts } from '../hooks/useSupabaseData';

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
  document_url?: string;
}

const BlogManager: React.FC = () => {
  const { blogPosts, loading, addBlogPost, updateBlogPost, deleteBlogPost } = useBlogPosts();
  
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [newPost, setNewPost] = useState<Partial<BlogPost>>({
    title: '',
    content: '',
    excerpt: '',
    image_url: '',
    tags: [],
    category: 'Technology',
    author: 'DevIem',
    document_url: ''
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [filter, setFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isUploading, setIsUploading] = useState(false);

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

  const handleAddPost = async () => {
    if (!newPost.title || !newPost.content) {
      showMessage('❌ Título e conteúdo são obrigatórios');
      return;
    }

    try {
      setIsUploading(true);
      
      // Gerar slug a partir do título
      const slug = newPost.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, '-');
      
      // Criar novo post
      const post: any = {
        title: newPost.title || '',
        slug: slug,
        content: newPost.content || '',
        excerpt: newPost.excerpt || newPost.content?.substring(0, 150) + '...' || '',
        image_url: newPost.image_url,
        tags: Array.isArray(newPost.tags) ? newPost.tags : 
              typeof newPost.tags === 'string' ? newPost.tags.split(',').map(t => t.trim()) : [],
        category: newPost.category || 'Technology',
        published_at: new Date().toISOString(),
        author: newPost.author || 'DevIem',
        document_url: newPost.document_url
      };
      
      await addBlogPost(post);
      
      setNewPost({
        title: '',
        content: '',
        excerpt: '',
        image_url: '',
        tags: [],
        category: 'Technology',
        author: 'DevIem',
        document_url: ''
      });
      
      showMessage('✅ Artigo adicionado com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar artigo:', error);
      showMessage('❌ Erro ao adicionar artigo');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdatePost = async () => {
    if (!editingPost) return;
    
    try {
      setIsUploading(true);
      
      // Atualizar post
      await updateBlogPost(editingPost.id, editingPost);
      setEditingPost(null);
      
      showMessage('✅ Artigo atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar artigo:', error);
      showMessage('❌ Erro ao atualizar artigo');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeletePost = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este artigo?')) {
      try {
        await deleteBlogPost(id);
        showMessage('✅ Artigo excluído com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir artigo:', error);
        showMessage('❌ Erro ao excluir artigo');
      }
    }
  };

  // Filtrar posts
  const filteredPosts = blogPosts.filter(post => {
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

  // Função para lidar com upload de documentos
  const handleDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>, isNewPost: boolean) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Verificar tipo de arquivo
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      showMessage('❌ Apenas arquivos PDF e Word são permitidos');
      return;
    }
    
    // Simular upload
    setIsUploading(true);
    
    // Em um ambiente real, aqui você faria o upload para o Supabase Storage
    // Para este exemplo, vamos simular um URL
    setTimeout(() => {
      const fakeUrl = `https://example.com/documents/${file.name}`;
      
      if (isNewPost) {
        setNewPost(prev => ({ ...prev, document_url: fakeUrl }));
      } else if (editingPost) {
        setEditingPost(prev => ({ ...prev!, document_url: fakeUrl }));
      }
      
      setIsUploading(false);
      showMessage('✅ Documento anexado com sucesso!');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-cyan-400">Gerenciar Blog</h2>
        <div className="text-sm text-gray-400">
          Total: {blogPosts.length} artigos
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
            placeholder="Conteúdo completo do artigo (suporta HTML)"
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
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
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
              <File className="w-4 h-4 mr-2" />
              Documento Anexo (PDF, Word)
            </label>
            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
              {(editingPost?.document_url || newPost.document_url) ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <File className="w-5 h-5 text-cyan-400 mr-2" />
                    <span className="text-sm text-gray-300 truncate max-w-[200px]">
                      {editingPost?.document_url?.split('/').pop() || newPost.document_url?.split('/').pop()}
                    </span>
                  </div>
                  <button
                    onClick={() => editingPost
                      ? setEditingPost({...editingPost, document_url: ''})
                      : setNewPost({...newPost, document_url: ''})
                    }
                    className="p-1 text-red-400 hover:bg-red-500/20 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <input
                    type="file"
                    id="document-upload"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleDocumentUpload(e, !editingPost)}
                  />
                  <label
                    htmlFor="document-upload"
                    className="flex items-center justify-center p-3 bg-black border border-gray-600 rounded-lg text-gray-400 hover:text-cyan-400 hover:border-cyan-400 cursor-pointer transition-colors"
                  >
                    {isUploading ? (
                      <>
                        <Clock className="w-5 h-5 mr-2 animate-spin" />
                        <span>Enviando documento...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5 mr-2" />
                        <span>Clique para anexar documento</span>
                      </>
                    )}
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    Formatos suportados: PDF, DOC, DOCX (máx. 10MB)
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          {editingPost ? (
            <>
              <button
                onClick={handleUpdatePost}
                disabled={isUploading}
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
              disabled={isUploading}
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
        {loading ? (
          <div className="text-center py-8 bg-gray-900/30 rounded-lg border border-gray-700">
            <div className="animate-spin w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-400">Carregando artigos...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
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
                  
                  {post.document_url && (
                    <div className="mb-4 flex items-center text-sm text-cyan-400">
                      <File className="w-4 h-4 mr-1" />
                      <span>Documento anexado</span>
                      <Check className="w-4 h-4 ml-1 text-green-400" />
                    </div>
                  )}
                  
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