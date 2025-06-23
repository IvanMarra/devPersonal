import React from 'react';
import { Calendar, Clock, Tag, ArrowLeft, User } from 'lucide-react';
import { BlogPost as BlogPostType } from '../lib/supabase';

interface BlogPostProps {
  post: BlogPostType;
  onBack: () => void;
}

const BlogPost: React.FC<BlogPostProps> = ({ post, onBack }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readingTime} min de leitura`;
  };

  const renderMarkdown = (content: string) => {
    // Simples renderização de markdown para demonstração
    return content
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-cyan-400 mb-6 mt-8">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-purple-400 mb-4 mt-6">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold text-white mb-3 mt-4">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-cyan-400">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-gray-300">$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-800 text-cyan-400 px-2 py-1 rounded text-sm">$1</code>')
      .replace(/\n\n/g, '</p><p class="text-gray-300 leading-relaxed mb-4">')
      .replace(/^(?!<h|<p)/gm, '<p class="text-gray-300 leading-relaxed mb-4">')
      .replace(/(<p[^>]*>)\s*(<\/p>)/g, '');
  };

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6">
      <div className="container mx-auto max-w-4xl">
        {/* Botão Voltar */}
        <button
          onClick={onBack}
          className="mb-8 flex items-center text-cyan-400 hover:text-cyan-300 transition-colors duration-300 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-300" />
          Voltar para o blog
        </button>

        {/* Header do Post */}
        <header className="mb-8">
          {/* Categoria */}
          <div className="mb-4">
            <span className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-full text-sm font-medium border border-cyan-500/30">
              {post.category}
            </span>
          </div>

          {/* Título */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Meta informações */}
          <div className="flex flex-wrap items-center gap-6 text-gray-400 mb-6">
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              <span className="text-purple-400 font-medium">{post.author}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              {formatDate(post.published_at || post.created_at || '')}
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              {getReadingTime(post.content)}
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm border border-purple-500/30"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>

          {/* Imagem de destaque */}
          {post.image_url && (
            <div className="relative rounded-xl overflow-hidden mb-8">
              <img
                src={post.image_url}
                alt={post.title}
                className="w-full h-64 sm:h-80 lg:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          )}

          {/* Excerpt */}
          <div className="bg-gray-900/50 border-l-4 border-cyan-400 p-6 rounded-r-lg mb-8">
            <p className="text-lg text-gray-300 leading-relaxed italic">
              {post.excerpt}
            </p>
          </div>
        </header>

        {/* Conteúdo do Post */}
        <article className="prose prose-lg max-w-none">
          <div 
            className="blog-content"
            dangerouslySetInnerHTML={{ 
              __html: renderMarkdown(post.content) 
            }}
          />
        </article>

        {/* Footer do Post */}
        <footer className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full flex items-center justify-center mr-4">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-white">{post.author}</h4>
                <p className="text-gray-400 text-sm">Desenvolvedor • Mentor • Especialista em IA</p>
              </div>
            </div>
            
            <button
              onClick={onBack}
              className="px-6 py-3 bg-cyan-500/20 border border-cyan-400 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-all duration-300"
            >
              Ver mais posts
            </button>
          </div>
        </footer>
      </div>

      {/* Estilos para o conteúdo do blog */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .blog-content h1 {
            margin-top: 2rem;
            margin-bottom: 1.5rem;
          }
          
          .blog-content h2 {
            margin-top: 1.5rem;
            margin-bottom: 1rem;
          }
          
          .blog-content h3 {
            margin-top: 1rem;
            margin-bottom: 0.75rem;
          }
          
          .blog-content p {
            margin-bottom: 1rem;
            line-height: 1.7;
          }
          
          .blog-content ul, .blog-content ol {
            margin: 1rem 0;
            padding-left: 1.5rem;
          }
          
          .blog-content li {
            margin-bottom: 0.5rem;
            color: #d1d5db;
          }
          
          .blog-content blockquote {
            border-left: 4px solid #06b6d4;
            padding-left: 1rem;
            margin: 1.5rem 0;
            background: rgba(6, 182, 212, 0.1);
            padding: 1rem;
            border-radius: 0.5rem;
          }
          
          .blog-content code {
            font-family: 'Courier New', monospace;
          }
          
          .blog-content pre {
            background: #1f2937;
            padding: 1rem;
            border-radius: 0.5rem;
            overflow-x: auto;
            margin: 1rem 0;
          }
        `
      }} />
    </div>
  );
};

export default BlogPost;