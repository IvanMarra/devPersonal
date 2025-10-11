import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface BreadcrumbSmartProps {
  type: 'blog' | 'projeto';
  currentSlug: string;
  currentTitle?: string;
}

const BreadcrumbSmart = ({ type, currentSlug, currentTitle }: BreadcrumbSmartProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [backDestination, setBackDestination] = useState<string>('');
  const [backMethod, setBackMethod] = useState<'history' | 'navigate'>('navigate');

  // Humanizar slug para exibição
  const humanizeSlug = (slug: string): string => {
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const detectBackDestination = () => {
    const params = new URLSearchParams(location.search);
    const referrer = document.referrer;
    const origin = window.location.origin;
    
    // A) Histórico navegável e referrer same-origin
    if (window.history.length > 1 && referrer && referrer.startsWith(origin)) {
      setBackMethod('history');
      setBackDestination(type === 'blog' ? '/blog' : '/projetos'); // fallback display
      return;
    }

    // B) Query param de origem
    const fromParam = params.get('from');
    if (fromParam) {
      setBackMethod('navigate');
      switch (fromParam) {
        case 'blog':
          setBackDestination('/blog');
          return;
        case 'projetos':
          setBackDestination('/projetos');
          return;
        case 'home':
          setBackDestination('/');
          return;
        case 'tags':
          const tagParam = params.get('tag');
          if (tagParam) {
            setBackDestination(`/blog/tags/${tagParam}`);
            return;
          }
          setBackDestination('/blog');
          return;
        case 'search':
          setBackDestination('/buscar');
          return;
        default:
          break;
      }
    }

    // C) Path atual indica tipo de detalhe
    if (type === 'blog') {
      // D) Detectar se veio de listagem filtrada
      const tagParam = params.get('tag');
      const catParam = params.get('cat');
      
      if (tagParam) {
        setBackDestination(`/blog/tags/${tagParam}`);
        setBackMethod('navigate');
        return;
      }
      
      if (catParam) {
        setBackDestination(`/blog/categorias/${catParam}`);
        setBackMethod('navigate');
        return;
      }
      
      // Fallback padrão para blog
      setBackDestination('/blog');
    } else {
      // Fallback padrão para projetos
      setBackDestination('/projetos');
    }
    
    setBackMethod('navigate');
  };

  useEffect(() => {
    detectBackDestination();
  }, [location, type]);

  const handleBack = () => {
    if (backMethod === 'history' && window.history.length > 1) {
      window.history.back();
    } else {
      navigate(backDestination || (type === 'blog' ? '/blog' : '/projetos'));
    }
  };

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        handleBack();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [backMethod, backDestination]);

  const displayTitle = currentTitle || humanizeSlug(currentSlug);
  const breadcrumbPath = type === 'blog' ? 'blog' : 'projetos';
  const canonicalPath = backDestination || `/${breadcrumbPath}`;

  return (
    <nav 
      className="container mx-auto px-6 py-4" 
      aria-label="Navegação por trilha (breadcrumb)"
    >
      <div className="flex items-center gap-2 text-sm font-mono text-muted-foreground">
        {/* Botão Voltar */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded-sm px-1"
          aria-label="Voltar para a página anterior"
          tabIndex={0}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar</span>
        </button>

        <span className="text-muted-foreground">·</span>

        {/* Link canônico */}
        <button
          onClick={() => navigate(canonicalPath)}
          className="text-primary hover:text-primary/80 hover:underline transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded-sm px-1"
          tabIndex={0}
        >
          cd ../{breadcrumbPath}
        </button>

        <span className="text-muted-foreground">·</span>

        {/* Path atual (não clicável) */}
        <span className="text-muted-foreground">
          ~/{breadcrumbPath}/{currentSlug}$
        </span>
      </div>

      {/* Texto oculto para leitores de tela */}
      <div 
        className="sr-only" 
        aria-live="polite"
        role="status"
      >
        Breadcrumb atual: voltar para {canonicalPath}, você está em {displayTitle}
      </div>
    </nav>
  );
};

export default BreadcrumbSmart;