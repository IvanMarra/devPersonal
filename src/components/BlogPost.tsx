import React from 'react';
import { ArrowLeft, Calendar, Clock, Tag, User, Share2, Bookmark, ThumbsUp, MessageSquare, FileText } from 'lucide-react';

interface BlogPostProps {
  post: {
    id: number;
    slug: string;
    title: string;
    content: string;
    excerpt: string;
    image_url?: string;
    tags: string[];
    category: string;
    published_at: string;
    author: string;
    reading_time?: string;
  };
  onBack: () => void;
}

const BlogPost: React.FC<BlogPostProps> = ({ post, onBack }) => {
  // Formatar data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Calcular tempo de leitura se não fornecido
  const readingTime = post.reading_time || `${Math.ceil(post.content.length / 1000)} min`;

  // Posts relacionados de exemplo
  const relatedPosts = [
    {
      id: 101,
      title: "Fundamentos de React em 2025",
      excerpt: "Aprenda os conceitos essenciais do React para desenvolvimento moderno.",
      image_url: "https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=600",
      published_at: "2025-01-05T10:00:00Z",
      reading_time: "4 min"
    },
    {
      id: 102,
      title: "Segurança em APIs RESTful",
      excerpt: "Melhores práticas para proteger suas APIs contra ataques comuns.",
      image_url: "https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=600",
      published_at: "2025-01-08T14:30:00Z",
      reading_time: "6 min"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-sm border-b border-cyan-500/30">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Voltar</span>
            </button>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full bg-gray-800/50 text-gray-400 hover:text-cyan-400 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-full bg-gray-800/50 text-gray-400 hover:text-cyan-400 transition-colors">
                <Bookmark className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-16 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl">
          {/* Hero */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm border border-orange-500/30">
                {post.category}
              </span>
              {post.tags.map((tag, index) => (
                <span key={index} className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm border border-purple-500/30">
                  {tag}
                </span>
              ))}
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-cyan-400 mb-6">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center text-sm text-gray-400 mb-6 gap-y-2 gap-x-6">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                {post.author}
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {formatDate(post.published_at)}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                {readingTime} de leitura
              </div>
            </div>
            
            {post.image_url && (
              <div className="relative aspect-video w-full overflow-hidden rounded-xl mb-8">
                <img
                  src={post.image_url}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
          
          {/* Content */}
          <article className="prose prose-invert prose-cyan max-w-none mb-12">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </article>
          
          {/* Tags and Interactions */}
          <div className="border-t border-gray-800 pt-6 mb-12">
            <div className="flex flex-wrap justify-between items-center">
              <div className="flex flex-wrap gap-2 mb-4 sm:mb-0">
                <span className="text-gray-400 mr-2">Tags:</span>
                {post.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm">
                    #{tag}
                  </span>
                ))}
              </div>
              
              <div className="flex space-x-4">
                <button className="flex items-center space-x-2 text-gray-400 hover:text-cyan-400 transition-colors">
                  <ThumbsUp className="w-5 h-5" />
                  <span>42</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-400 hover:text-cyan-400 transition-colors">
                  <MessageSquare className="w-5 h-5" />
                  <span>12</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-400 hover:text-cyan-400 transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Author */}
          <div className="bg-gray-900/50 p-6 rounded-xl border border-cyan-500/30 mb-12">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-cyan-500/50">
                <img
                  src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400"
                  alt="DevIem"
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-xl font-bold text-cyan-400 mb-2">DevIem</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Desenvolvedor com mais de 20 anos de experiência, especialista em segurança cibernética, 
                  inteligência artificial e mentor de transição de carreira.
                </p>
                <div className="flex justify-center sm:justify-start space-x-3">
                  <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                    Twitter
                  </a>
                  <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                    LinkedIn
                  </a>
                  <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {/* Related Posts */}
          <div className="mb-12">
            <h3 className="text-xl font-bold text-cyan-400 mb-6 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Artigos Relacionados
            </h3>
            
            <div className="grid sm:grid-cols-2 gap-6">
              {relatedPosts.map((relatedPost) => (
                <div key={relatedPost.id} className="bg-gray-900/30 rounded-xl overflow-hidden border border-gray-800 hover:border-cyan-500/30 transition-all duration-300 group">
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={relatedPost.image_url}
                      alt={relatedPost.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  </div>
                  
                  <div className="p-4">
                    <h4 className="text-lg font-bold text-purple-400 group-hover:text-cyan-400 transition-colors duration-300 mb-2">
                      {relatedPost.title}
                    </h4>
                    <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{formatDate(relatedPost.published_at)}</span>
                      <span>{relatedPost.reading_time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Comments Section */}
          <div className="mb-12">
            <h3 className="text-xl font-bold text-cyan-400 mb-6 flex items-center">
              <MessageSquare className="w-5 h-5 mr-2" />
              Comentários (12)
            </h3>
            
            <div className="mb-6">
              <textarea
                placeholder="Deixe seu comentário..."
                rows={4}
                className="w-full p-4 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors"
              ></textarea>
              <div className="flex justify-end mt-2">
                <button className="px-4 py-2 bg-cyan-500/20 border border-cyan-400 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-all duration-300">
                  Enviar Comentário
                </button>
              </div>
            </div>
            
            {/* Sample Comments */}
            <div className="space-y-6">
              <div className="bg-gray-900/30 p-4 rounded-lg border border-gray-800">
                <div className="flex items-start space-x-3 mb-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    <img
                      src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200"
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-purple-400">Carlos Santos</h4>
                      <span className="text-xs text-gray-500">2 dias atrás</span>
                    </div>
                    <p className="text-gray-300 text-sm mt-1">
                      Excelente artigo! Muito bem explicado e com exemplos práticos. Estou ansioso para aplicar esses conceitos nos meus projetos.
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 ml-12 text-xs text-gray-400">
                  <button className="flex items-center hover:text-cyan-400 transition-colors">
                    <ThumbsUp className="w-3 h-3 mr-1" />
                    <span>8</span>
                  </button>
                  <button className="hover:text-cyan-400 transition-colors">
                    Responder
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-900/30 p-4 rounded-lg border border-gray-800">
                <div className="flex items-start space-x-3 mb-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    <img
                      src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200"
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-purple-400">Ana Silva</h4>
                      <span className="text-xs text-gray-500">5 dias atrás</span>
                    </div>
                    <p className="text-gray-300 text-sm mt-1">
                      Você poderia elaborar mais sobre as medidas de proteção contra ataques de phishing? Estou tendo problemas com isso na minha empresa.
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 ml-12 text-xs text-gray-400">
                  <button className="flex items-center hover:text-cyan-400 transition-colors">
                    <ThumbsUp className="w-3 h-3 mr-1" />
                    <span>4</span>
                  </button>
                  <button className="hover:text-cyan-400 transition-colors">
                    Responder
                  </button>
                </div>
                
                {/* Reply */}
                <div className="ml-12 mt-4 bg-gray-900/50 p-3 rounded-lg border border-gray-700">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                      <img
                        src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200"
                        alt="DevIem"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-cyan-400">DevIem</h4>
                        <span className="text-xs text-gray-500">3 dias atrás</span>
                      </div>
                      <p className="text-gray-300 text-sm mt-1">
                        Olá Ana! Vou preparar um artigo específico sobre proteção contra phishing. Enquanto isso, recomendo implementar autenticação de dois fatores e treinamentos regulares para sua equipe.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BlogPost;