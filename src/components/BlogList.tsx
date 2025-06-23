import React from 'react';
import { Calendar, Clock, Tag, ArrowRight, BookOpen } from 'lucide-react';
import { BlogPost } from '../lib/supabase';

interface BlogListProps {
  posts: BlogPost[];
  onPostClick: (slug: string) => void;
}

const BlogList: React.FC<BlogListProps> = ({ posts, onPostClick }) => {
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

  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-400 mb-2">Nenhum post encontrado</h3>
        <p className="text-gray-500">Os posts do blog aparecerão aqui quando estiverem disponíveis.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {posts.map((post, index) => (
        <article 
          key={post.id}
          className="group cursor-pointer"
          onClick={() => onPostClick(post.slug)}
        >
          <div className="bg-gray-900/50 rounded-xl border border-gray-700 hover:border-cyan-400/50 transition-all duration-300 overflow-hidden card-hover">
            <div className="flex flex-col lg:flex-row">
              {/* Imagem */}
              <div className="lg:w-1/3">
                <div className="relative h-48 lg:h-full overflow-hidden">
                  <img
                    src={post.image_url || `https://images.pexels.com/photos/${1181677 + index}/pexels-photo-${1181677 + index}.jpeg?auto=compress&cs=tinysrgb&w=800`}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Categoria */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-xs font-medium border border-cyan-500/30">
                      {post.category}
                    </span>
                  </div>
                </div>
              </div>

              {/* Conteúdo */}
              <div className="lg:w-2/3 p-6 lg:p-8">
                <div className="flex items-center space-x-4 text-sm text-gray-400 mb-4">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(post.published_at || post.created_at || '')}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {getReadingTime(post.content)}
                  </div>
                  <div className="flex items-center">
                    <span className="text-purple-400">Por {post.author}</span>
                  </div>
                </div>

                <h2 className="text-xl lg:text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors duration-300 line-clamp-2">
                  {post.title}
                </h2>

                <p className="text-gray-300 mb-4 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags.slice(0, 3).map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="inline-flex items-center px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs border border-purple-500/30"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                  {post.tags.length > 3 && (
                    <span className="text-xs text-gray-400 px-2 py-1">
                      +{post.tags.length - 3} mais
                    </span>
                  )}
                </div>

                {/* Call to Action */}
                <div className="flex items-center text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300">
                  <span className="font-medium">Ler artigo completo</span>
                  <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};

export default BlogList;