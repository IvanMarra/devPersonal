import React, { useState, useEffect } from 'react';
import { Code, Shield, Users, MessageSquare, Mic, GraduationCap, ChevronDown, Terminal, Zap, Brain, Eye, Menu, X, FileText } from 'lucide-react';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';
import SupabaseStatus from './components/SupabaseStatus';
import VersionInfo from './components/VersionInfo';
import { useFrontendData } from './hooks/useSupabaseData';
import BlogPost from './components/BlogPost';

// Matrix rain effect component
const MatrixRain = () => {
  useEffect(() => {
    const canvas = document.getElementById('matrix-canvas') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
    const matrixArray = matrix.split("");

    const fontSize = 10;
    const columns = canvas.width / fontSize;

    const drops: number[] = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = 1;
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#00ff00';
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 35);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      id="matrix-canvas"
      className="fixed inset-0 z-0 opacity-20"
      style={{ pointerEvents: 'none' }}
    />
  );
};

// Mobile Menu Component - RESPONSIVIDADE MELHORADA
const MobileMenu = ({ sections, activeSection, onSectionChange }: any) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [activeSection]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2 rounded-lg border border-cyan-400/50 text-cyan-400 hover:bg-cyan-500/20 transition-all duration-300 relative z-50"
      >
        <div className="relative w-6 h-6">
          <Menu 
            className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${
              isOpen ? 'opacity-0 rotate-45 scale-0' : 'opacity-100 rotate-0 scale-100'
            }`} 
          />
          <X 
            className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${
              isOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-45 scale-0'
            }`} 
          />
        </div>
      </button>

      <div 
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-black/95 backdrop-blur-md border-l border-cyan-500/30 z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-cyan-500/30">
          <div className="flex items-center space-x-2">
            <Terminal className="w-6 h-6 text-cyan-400" />
            <span className="text-xl font-bold text-cyan-400">DEVIEM</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/20 transition-all duration-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 sm:p-6 space-y-2">
          {sections.map((section: any, index: number) => (
            <button
              key={section.id}
              onClick={() => {
                onSectionChange(section.id);
                setIsOpen(false); // Fechar menu ao clicar
              }}
              className={`w-full flex items-center space-x-3 px-4 py-4 rounded-lg transition-all duration-300 text-left ${
                activeSection === section.id
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-400 shadow-cyan-glow'
                  : 'text-gray-400 hover:text-cyan-400 hover:bg-gray-800/50'
              }`}
              style={{
                animationDelay: `${index * 50}ms`,
                animation: isOpen ? 'slideInRight 0.3s ease-out forwards' : 'none'
              }}
            >
              <section.icon className="w-5 h-5" />
              <span className="font-medium">{section.title}</span>
            </button>
          ))}
        </nav>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          .shadow-cyan-glow {
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
          }
        `
      }} />
    </>
  );
};

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [activeBlogPost, setActiveBlogPost] = useState<string | null>(null);

  // Usar dados do Supabase
  const { projects, testimonials, talks, settings, refreshAllData } = useFrontendData();

  // Blog posts de exemplo
  const blogPosts = [
    {
      id: 1,
      slug: 'introducao-seguranca-cibernetica',
      title: 'Introdução à Segurança Cibernética',
      excerpt: 'Uma introdução aos conceitos básicos de segurança cibernética e como proteger seus dados.',
      content: `
        <h2>Introdução à Segurança Cibernética</h2>
        <p>A segurança cibernética é um campo em constante evolução que se concentra na proteção de sistemas, redes e programas contra ataques digitais. Esses ataques geralmente visam acessar, alterar ou destruir informações sensíveis, extorquir dinheiro dos usuários ou interromper processos de negócios normais.</p>
        
        <h3>Por que a segurança cibernética é importante?</h3>
        <p>Com o aumento da dependência de tecnologia e o crescimento do número de dispositivos conectados à internet, há mais dados sensíveis sendo compartilhados online do que nunca. Isso cria um cenário perfeito para cibercriminosos que buscam explorar vulnerabilidades.</p>
        
        <h3>Princípios básicos de segurança cibernética</h3>
        <ul>
          <li><strong>Confidencialidade:</strong> Garantir que informações sensíveis sejam acessíveis apenas a pessoas autorizadas.</li>
          <li><strong>Integridade:</strong> Manter a precisão e confiabilidade dos dados durante todo o seu ciclo de vida.</li>
          <li><strong>Disponibilidade:</strong> Garantir que sistemas e dados estejam disponíveis quando necessário.</li>
        </ul>
        
        <h3>Tipos comuns de ameaças cibernéticas</h3>
        <ol>
          <li><strong>Malware:</strong> Software malicioso projetado para danificar ou interromper sistemas.</li>
          <li><strong>Phishing:</strong> Tentativas de obter informações sensíveis através de e-mails ou sites fraudulentos.</li>
          <li><strong>Ataques de negação de serviço (DoS):</strong> Sobrecarregam sistemas para torná-los inacessíveis.</li>
          <li><strong>Ransomware:</strong> Criptografa dados e exige pagamento para restaurá-los.</li>
        </ol>
        
        <h3>Como se proteger</h3>
        <p>Algumas medidas básicas de proteção incluem:</p>
        <ul>
          <li>Manter software e sistemas operacionais atualizados</li>
          <li>Usar senhas fortes e gerenciadores de senhas</li>
          <li>Implementar autenticação de dois fatores</li>
          <li>Fazer backup regular de dados importantes</li>
          <li>Educar-se sobre práticas seguras online</li>
        </ul>
        
        <p>A segurança cibernética é responsabilidade de todos. Ao adotar práticas seguras, você não apenas protege seus próprios dados, mas também contribui para um ambiente digital mais seguro para todos.</p>
      `,
      image_url: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=1200',
      tags: ['Cybersecurity', 'Beginners', 'Data Protection'],
      category: 'Security',
      published_at: '2025-01-15T10:00:00Z',
      author: 'DevIem',
      reading_time: '5 min'
    },
    {
      id: 2,
      slug: 'iniciar-carreira-desenvolvimento-web',
      title: 'Como Iniciar sua Carreira em Desenvolvimento Web',
      excerpt: 'Guia completo para quem deseja iniciar uma carreira em desenvolvimento web em 2025.',
      content: `
        <h2>Como Iniciar sua Carreira em Desenvolvimento Web em 2025</h2>
        <p>O desenvolvimento web continua sendo uma das carreiras mais promissoras e acessíveis na área de tecnologia. Com a crescente digitalização dos negócios, a demanda por desenvolvedores web qualificados só aumenta a cada ano.</p>
        
        <h3>Por onde começar?</h3>
        <p>Iniciar uma carreira em desenvolvimento web pode parecer intimidador, mas com um plano estruturado, é possível progredir de forma consistente:</p>
        
        <h4>1. Aprenda os fundamentos</h4>
        <ul>
          <li><strong>HTML:</strong> A linguagem de marcação que estrutura o conteúdo web</li>
          <li><strong>CSS:</strong> Responsável pelo estilo e aparência visual</li>
          <li><strong>JavaScript:</strong> Linguagem de programação que torna as páginas interativas</li>
        </ul>
        
        <h4>2. Escolha uma especialização</h4>
        <p>O desenvolvimento web se divide principalmente em:</p>
        <ul>
          <li><strong>Frontend:</strong> Foco na interface do usuário (React, Angular, Vue.js)</li>
          <li><strong>Backend:</strong> Foco na lógica do servidor e banco de dados (Node.js, Python, PHP)</li>
          <li><strong>Fullstack:</strong> Combinação de ambos</li>
        </ul>
        
        <h4>3. Aprenda frameworks modernos</h4>
        <p>Em 2025, os frameworks mais relevantes incluem:</p>
        <ul>
          <li>React e Next.js para frontend</li>
          <li>Node.js e Express para backend</li>
          <li>Tailwind CSS para estilização</li>
          <li>Supabase ou Firebase para backend-as-a-service</li>
        </ul>
        
        <h4>4. Construa projetos práticos</h4>
        <p>Nada substitui a experiência prática. Construa projetos como:</p>
        <ul>
          <li>Um portfólio pessoal</li>
          <li>Um clone de site popular</li>
          <li>Uma aplicação CRUD simples</li>
          <li>Um blog ou loja virtual</li>
        </ul>
        
        <h4>5. Aprenda controle de versão</h4>
        <p>Git e GitHub são essenciais para qualquer desenvolvedor moderno.</p>
        
        <h3>Recursos para aprendizado</h3>
        <ul>
          <li>Plataformas como freeCodeCamp, Codecademy e The Odin Project</li>
          <li>Documentação oficial das tecnologias</li>
          <li>YouTube para tutoriais práticos</li>
          <li>Bootcamps intensivos para aprendizado acelerado</li>
        </ul>
        
        <h3>Construindo seu portfólio</h3>
        <p>Seu portfólio é sua vitrine profissional. Inclua:</p>
        <ul>
          <li>Projetos pessoais bem documentados</li>
          <li>Contribuições para projetos open source</li>
          <li>Pequenos experimentos e demonstrações de conceitos</li>
        </ul>
        
        <h3>Encontrando seu primeiro emprego</h3>
        <p>Estratégias para conseguir sua primeira oportunidade:</p>
        <ul>
          <li>Estágios e programas de trainee</li>
          <li>Trabalho freelance em plataformas como Upwork</li>
          <li>Networking em eventos e comunidades de tecnologia</li>
          <li>Participação em hackathons</li>
        </ul>
        
        <p>Lembre-se: persistência é a chave. O desenvolvimento web é uma jornada de aprendizado contínuo, mas os resultados valem a pena!</p>
      `,
      image_url: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=1200',
      tags: ['Career', 'Web Development', 'Beginners'],
      category: 'Career',
      published_at: '2025-01-10T14:30:00Z',
      author: 'DevIem',
      reading_time: '7 min'
    }
  ];

  useEffect(() => {
    // Verificar se já está autenticado
    const token = localStorage.getItem('deviem_admin_token');
    const session = localStorage.getItem('deviem_admin_session');
    
    if (token === 'authenticated' && session) {
      // Verificar se a sessão não expirou (24 horas)
      const sessionTime = parseInt(session);
      const now = Date.now();
      const twentyFourHours = 24 * 60 * 60 * 1000;
      
      if (now - sessionTime < twentyFourHours) {
        setIsAuthenticated(true);
      } else {
        // Sessão expirada
        localStorage.removeItem('deviem_admin_token');
        localStorage.removeItem('deviem_admin_session');
      }
    }
  }, []);

  // Função especial para acesso admin (sequência de teclas)
  useEffect(() => {
    let sequence = '';
    const adminSequence = 'deviem';
    let sequenceTimeout: NodeJS.Timeout;
    
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!e.key) return;

      // Limpar timeout anterior
      if (sequenceTimeout) {
        clearTimeout(sequenceTimeout);
      }
      
      // Adicionar tecla à sequência
      sequence += e.key.toLowerCase();
      
      // Limitar o tamanho da sequência
      if (sequence.length > adminSequence.length) {
        sequence = sequence.slice(-adminSequence.length);
      }
      
      // Verificar se a sequência está correta
      if (sequence === adminSequence) {
        console.log('🔑 Sequência de acesso admin detectada!');
        if (isAuthenticated) {
          setIsAdminOpen(true);
        } else {
          setShowLogin(true);
        }
        sequence = ''; // Limpar sequência
        return;
      }
      
      // Definir timeout para limpar a sequência após 2 segundos de inatividade
      sequenceTimeout = setTimeout(() => {
        sequence = '';
      }, 2000);
    };

    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      if (sequenceTimeout) {
        clearTimeout(sequenceTimeout);
      }
    };
  }, [isAuthenticated]);

  // Auto-refresh dos dados a cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('🔄 Auto-refresh dos dados...');
      refreshAllData();
    }, 30000);

    return () => clearInterval(interval);
  }, [refreshAllData]);

  const handleLogin = (success: boolean) => {
    if (success) {
      setIsAuthenticated(true);
      setShowLogin(false);
      setIsAdminOpen(true);
      // Forçar refresh dos dados após login
      refreshAllData();
    } else {
      setShowLogin(false);
    }
  };

  const handleAdminClose = () => {
    setIsAdminOpen(false);
    // Forçar refresh dos dados após fechar admin
    refreshAllData();
  };

  const handleBackToFrontend = () => {
    setIsAdminOpen(false);
    setShowLogin(false);
    setActiveSection('home');
    // Forçar refresh dos dados
    refreshAllData();
  };

  const sections = [
    { id: 'home', title: 'Início', icon: Terminal },
    { id: 'about', title: 'Sobre', icon: Eye },
    { id: 'projects', title: 'Projetos', icon: Code },
    { id: 'testimonials', title: 'Depoimentos', icon: MessageSquare },
    { id: 'talks', title: 'Palestras', icon: Mic },
    { id: 'blog', title: 'Blog', icon: FileText },
    { id: 'classes', title: 'Aulas Particulares', icon: GraduationCap },
  ];

  // Renderizar post do blog se estiver ativo
  if (activeBlogPost) {
    const post = blogPosts.find(post => post.slug === activeBlogPost);
    if (post) {
      return <BlogPost post={post} onBack={() => setActiveBlogPost(null)} />;
    }
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <MatrixRain />
      
      {/* Supabase Status */}
      <SupabaseStatus />
      
      {/* Version Info */}
      <VersionInfo />
      
      {/* Custom CSS */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .glitch-text {
            position: relative;
            animation: glitch 2s infinite;
          }
          
          .glitch-text::before,
          .glitch-text::after {
            content: attr(data-text);
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }
          
          .glitch-text::before {
            animation: glitch-1 0.5s infinite;
            color: #ff0000;
            z-index: -1;
          }
          
          .glitch-text::after {
            animation: glitch-2 0.5s infinite;
            color: #00ffff;
            z-index: -2;
          }
          
          @keyframes glitch {
            0%, 100% { transform: translate(0); }
            20% { transform: translate(-2px, 2px); }
            40% { transform: translate(-2px, -2px); }
            60% { transform: translate(2px, 2px); }
            80% { transform: translate(2px, -2px); }
          }
          
          @keyframes glitch-1 {
            0%, 100% { transform: translate(0); }
            20% { transform: translate(2px, -2px); }
            40% { transform: translate(-2px, 2px); }
            60% { transform: translate(2px, 2px); }
            80% { transform: translate(-2px, -2px); }
          }
          
          @keyframes glitch-2 {
            0%, 100% { transform: translate(0); }
            20% { transform: translate(-2px, 2px); }
            40% { transform: translate(2px, -2px); }
            60% { transform: translate(-2px, -2px); }
            80% { transform: translate(2px, 2px); }
          }
          
          .neon-glow {
            box-shadow: 0 0 20px currentColor, 0 0 40px currentColor, 0 0 60px currentColor;
          }
          
          .shadow-cyan-glow {
            box-shadow: 0 0 20px #00ffff, 0 0 40px #00ffff;
          }
          
          .shadow-purple-glow {
            box-shadow: 0 0 20px #8b5cf6, 0 0 40px #8b5cf6;
          }
          
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
          
          .typing-effect {
            overflow: hidden;
            border-right: 2px solid #00ffff;
            white-space: nowrap;
            animation: typing 3s steps(40, end), blink-caret 0.75s step-end infinite;
          }
          
          @keyframes typing {
            from { width: 0; }
            to { width: 100%; }
          }
          
          @keyframes blink-caret {
            from, to { border-color: transparent; }
            50% { border-color: #00ffff; }
          }

          .floating-animation {
            animation: floating 3s ease-in-out infinite;
          }

          @keyframes floating {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }

          .card-hover {
            transition: all 0.3s ease;
          }

          .card-hover:hover {
            transform: translateY(-8px) scale(1.02);
            box-shadow: 0 20px 40px rgba(0, 255, 255, 0.3);
          }

          .testimonial-card {
            background: linear-gradient(135deg, rgba(0, 255, 255, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(0, 255, 255, 0.2);
          }

          .project-card {
            background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(0, 255, 255, 0.1) 100%);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(139, 92, 246, 0.2);
          }

          .talk-card {
            background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(0, 255, 255, 0.1) 100%);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(34, 197, 94, 0.2);
          }

          .blog-card {
            background: linear-gradient(135deg, rgba(249, 115, 22, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(249, 115, 22, 0.2);
          }

          .avatar-glow {
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
            animation: avatar-pulse 2s ease-in-out infinite alternate;
          }

          @keyframes avatar-pulse {
            from { box-shadow: 0 0 20px rgba(0, 255, 255, 0.5); }
            to { box-shadow: 0 0 30px rgba(0, 255, 255, 0.8); }
          }

          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          /* RESPONSIVIDADE MELHORADA */
          @media (max-width: 768px) {
            .glitch-text {
              font-size: 2.5rem !important;
            }
            
            .typing-effect {
              font-size: 1rem !important;
              white-space: normal;
              border-right: none;
              animation: none;
            }
            
            .card-hover:hover {
              transform: translateY(-4px) scale(1.01);
            }
            
            .floating-animation {
              animation: none;
            }
          }

          @media (max-width: 640px) {
            .glitch-text {
              font-size: 2rem !important;
            }
            
            .project-card, .testimonial-card, .talk-card, .blog-card {
              margin: 0.5rem 0;
            }
          }
        `
      }} />

      {/* Navigation - RESPONSIVIDADE MELHORADA */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-sm border-b border-cyan-500/30">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Terminal className="w-6 sm:w-8 h-6 sm:h-8 text-cyan-400" />
              <div className="text-xl sm:text-2xl font-bold text-cyan-400 glitch-text">
                DEVIEM
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-6">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    activeSection === section.id 
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-400' 
                      : 'text-gray-400 hover:text-cyan-400'
                  }`}
                >
                  <section.icon className="w-4 h-4" />
                  <span>{section.title}</span>
                </button>
              ))}
            </div>

            {/* Mobile Menu */}
            <MobileMenu
              sections={sections}
              activeSection={activeSection}
              onSectionChange={setActiveSection}
            />
          </div>
        </div>
      </nav>

      {/* Hero Section - RESPONSIVIDADE MELHORADA */}
      {activeSection === 'home' && (
        <section className="min-h-screen flex items-center justify-center relative pt-20 px-4 sm:px-6 pb-16">
          <div className="text-center z-10 w-full max-w-4xl">
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-bold mb-4 text-cyan-400 glitch-text">
                {settings?.hero_title || 'DEVIEM'}
              </h1>
              <div className="text-base sm:text-lg md:text-xl lg:text-2xl text-purple-400 typing-effect">
                {settings?.hero_subtitle || 'Desenvolvedor • Mentor • Especialista em IA • Ethical Hacker'}
              </div>
            </div>
            
            <div className="mb-8 text-gray-300 max-w-2xl mx-auto">
              <p className="text-sm sm:text-base md:text-lg mb-4">
                {settings?.about_text || 'Mais de 20 anos transformando ideias em realidade digital'}
              </p>
              <p className="text-xs sm:text-sm md:text-base">
                {settings?.site_description || 'Especialista em desenvolvimento web/mobile, inteligência artificial, cybersecurity e mentor de transição de carreira'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={() => setActiveSection('projects')}
                className="px-4 sm:px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 border-2 bg-cyan-500/20 border-cyan-400 text-cyan-400 hover:bg-cyan-500/30 hover:shadow-cyan-glow"
              >
                <Code className="w-4 sm:w-5 h-4 sm:h-5 inline mr-2" />
                Ver Projetos
              </button>
              <button 
                onClick={() => setActiveSection('about')}
                className="px-4 sm:px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 border-2 bg-purple-500/20 border-purple-400 text-purple-400 hover:bg-purple-500/30 hover:shadow-purple-glow"
              >
                <Eye className="w-4 sm:w-5 h-4 sm:h-5 inline mr-2" />
                Sobre Mim
              </button>
            </div>
          </div>
          
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ChevronDown className="w-6 sm:w-8 h-6 sm:h-8 text-cyan-400" />
          </div>
        </section>
      )}

      {/* About Section - RESPONSIVIDADE MELHORADA */}
      {activeSection === 'about' && (
        <section className="min-h-screen pt-24 px-4 sm:px-6 pb-16">
          <div className="container mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12 text-cyan-400 glitch-text">
              Sobre DevIem
            </h2>
            
            <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 items-start">
              {/* Profile Image Section */}
              <div className="lg:col-span-1 flex justify-center">
                <div className="relative">
                  <div className="cyber-border rounded-full p-1">
                    {settings?.profile_image_url ? (
                      <img
                        src={settings.profile_image_url}
                        alt="DevIem"
                        className="w-40 sm:w-48 md:w-64 h-40 sm:h-48 md:h-64 object-cover rounded-full floating-animation"
                      />
                    ) : (
                      <div className="w-40 sm:w-48 md:w-64 h-40 sm:h-48 md:h-64 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full flex items-center justify-center border-2 border-cyan-400/50 floating-animation">
                        <div className="text-center">
                          <Terminal className="w-8 sm:w-12 md:w-16 h-8 sm:h-12 md:h-16 text-cyan-400 mx-auto mb-2" />
                          <p className="text-cyan-400 font-bold text-sm sm:text-base">DevIem</p>
                          <p className="text-purple-400 text-xs sm:text-sm">20+ anos</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Floating elements around the image */}
                  <div className="absolute -top-2 sm:-top-4 -right-2 sm:-right-4 w-6 sm:w-8 h-6 sm:h-8 bg-cyan-400/20 rounded-full border border-cyan-400 flex items-center justify-center floating-animation">
                    <Shield className="w-3 sm:w-4 h-3 sm:h-4 text-cyan-400" />
                  </div>
                  <div className="absolute -bottom-2 sm:-bottom-4 -left-2 sm:-left-4 w-6 sm:w-8 h-6 sm:h-8 bg-purple-400/20 rounded-full border border-purple-400 flex items-center justify-center floating-animation" style={{animationDelay: '1s'}}>
                    <Brain className="w-3 sm:w-4 h-3 sm:h-4 text-purple-400" />
                  </div>
                  <div className="absolute top-1/2 -left-4 sm:-left-8 w-5 sm:w-6 h-5 sm:h-6 bg-green-400/20 rounded-full border border-green-400 flex items-center justify-center floating-animation" style={{animationDelay: '2s'}}>
                    <Code className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-green-400" />
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                <div className="cyber-border rounded-lg">
                  <div className="bg-black p-4 sm:p-6 rounded-lg">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-purple-400 mb-4 flex items-center">
                      <Shield className="w-5 sm:w-6 h-5 sm:h-6 mr-2" />
                      Especialidades
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {(settings?.skills || []).map((skill, index) => (
                        <div key={index} className="bg-gray-900/50 p-2 rounded text-xs sm:text-sm text-cyan-400 border border-cyan-500/20 hover:border-cyan-400 transition-all duration-300">
                          {skill}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-gray-900/50 p-4 sm:p-6 rounded-lg border border-purple-500/30">
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-purple-400 mb-4">Experiência</h3>
                    <ul className="space-y-3 text-gray-300 text-sm md:text-base">
                      <li className="flex items-start">
                        <Zap className="w-4 sm:w-5 h-4 sm:h-5 text-cyan-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span>20+ anos em desenvolvimento de sistemas</span>
                      </li>
                      <li className="flex items-start">
                        <Shield className="w-4 sm:w-5 h-4 sm:h-5 text-cyan-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Prevenção de ataques ao Governo Federal</span>
                      </li>
                      <li className="flex items-start">
                        <Brain className="w-4 sm:w-5 h-4 sm:h-5 text-cyan-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Especialista em IA e Machine Learning</span>
                      </li>
                      <li className="flex items-start">
                        <Users className="w-4 sm:w-5 h-4 sm:h-5 text-cyan-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Mentor de transição de carreira</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gray-900/50 p-4 sm:p-6 rounded-lg border border-cyan-500/30">
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-cyan-400 mb-4">Conquistas</h3>
                    <ul className="space-y-3 text-gray-300 text-sm md:text-base">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span>Sistemas bancários de alta segurança</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span>Plataformas e-commerce inteligentes</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span>Apps mobile com IoT e IA</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span>Consultoria em cybersecurity</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Projects Section - RESPONSIVIDADE MELHORADA */}
      {activeSection === 'projects' && (
        <section className="min-h-screen pt-24 px-4 sm:px-6 pb-16">
          <div className="container mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12 text-cyan-400 glitch-text">
              Projetos Desenvolvidos
            </h2>
            
            <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {projects.map((project, index) => (
                <div key={project.id} className="project-card rounded-xl p-4 sm:p-6 card-hover group">
                  <div className="relative overflow-hidden rounded-lg mb-4 sm:mb-6">
                    <img
                      src={project.image_url || "https://images.pexels.com/photos/159888/pexels-photo-159888.jpeg?auto=compress&cs=tinysrgb&w=800"}
                      alt={project.title}
                      className="w-full h-40 sm:h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg sm:text-xl font-bold text-purple-400 group-hover:text-cyan-400 transition-colors duration-300">
                      {project.title}
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(Array.isArray(project.tech) ? project.tech : []).map((tech, techIndex) => (
                        <span 
                          key={techIndex} 
                          className="px-2 sm:px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-xs border border-cyan-500/30 hover:border-cyan-400 transition-colors duration-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section - RESPONSIVIDADE MELHORADA */}
      {activeSection === 'testimonials' && (
        <section className="min-h-screen pt-24 px-4 sm:px-6 pb-16">
          <div className="container mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12 text-cyan-400 glitch-text">
              Depoimentos
            </h2>
            
            <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={testimonial.id} className="testimonial-card rounded-xl p-4 sm:p-6 card-hover group">
                  <div className="flex items-center space-x-4 mb-4 sm:mb-6">
                    <div className="relative">
                      <img
                        src={testimonial.avatar_url || "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200"}
                        alt={testimonial.name}
                        className="w-12 sm:w-16 h-12 sm:h-16 object-cover rounded-full avatar-glow"
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 sm:w-5 h-4 sm:h-5 bg-green-400 rounded-full border-2 border-black flex items-center justify-center">
                        <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-cyan-400 group-hover:text-purple-400 transition-colors duration-300 text-sm sm:text-base">
                        {testimonial.name}
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-400">{testimonial.role}</p>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <MessageSquare className="w-6 sm:w-8 h-6 sm:h-8 text-purple-400/30 absolute -top-2 -left-2" />
                    <blockquote className="text-gray-300 italic leading-relaxed pl-4 sm:pl-6 text-sm sm:text-base">
                      "{testimonial.text}"
                    </blockquote>
                  </div>
                  
                  <div className="mt-4 sm:mt-6 flex justify-end">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-3 sm:w-4 h-3 sm:h-4 text-yellow-400">⭐</div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Talks Section - RESPONSIVIDADE MELHORADA */}
      {activeSection === 'talks' && (
        <section className="min-h-screen pt-24 px-4 sm:px-6 pb-16">
          <div className="container mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12 text-cyan-400 glitch-text">
              Palestras & Eventos
            </h2>
            
            <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
              {talks.map((talk, index) => (
                <div key={talk.id} className="talk-card rounded-xl p-4 sm:p-6 lg:p-8 card-hover group">
                  <div className="flex flex-col lg:flex-row items-start space-y-4 lg:space-y-0 lg:space-x-6 sm:lg:space-x-8">
                    <div className="flex-shrink-0 w-full lg:w-auto">
                      <img
                        src={talk.image_url || "https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=800"}
                        alt={talk.title}
                        className="w-full lg:w-40 xl:w-48 h-32 lg:h-32 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start space-x-3">
                        <Mic className="w-5 sm:w-6 h-5 sm:h-6 text-green-400 mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-green-400 group-hover:text-cyan-400 transition-colors duration-300 mb-2">
                            {talk.title}
                          </h3>
                          <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                            {talk.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {(Array.isArray(talk.tags) ? talk.tags : []).map((tag, tagIndex) => (
                          <span 
                            key={tagIndex} 
                            className="px-2 sm:px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs sm:text-sm border border-green-500/30 hover:border-green-400 transition-colors duration-300"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Blog Section - NOVA SEÇÃO */}
      {activeSection === 'blog' && (
        <section className="min-h-screen pt-24 px-4 sm:px-6 pb-16">
          <div className="container mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12 text-cyan-400 glitch-text">
              Blog & Artigos
            </h2>
            
            <div className="max-w-5xl mx-auto">
              {/* Featured Post */}
              {blogPosts.length > 0 && (
                <div 
                  className="blog-card rounded-xl p-4 sm:p-6 card-hover group mb-8 cursor-pointer"
                  onClick={() => setActiveBlogPost(blogPosts[0].slug)}
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="relative overflow-hidden rounded-lg">
                      <img
                        src={blogPosts[0].image_url}
                        alt={blogPosts[0].title}
                        className="w-full h-48 sm:h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs border border-orange-500/30">
                          {blogPosts[0].category}
                        </span>
                        {blogPosts[0].tags.slice(0, 2).map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs border border-purple-500/30">
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <h3 className="text-xl sm:text-2xl font-bold text-orange-400 group-hover:text-cyan-400 transition-colors duration-300">
                        {blogPosts[0].title}
                      </h3>
                      
                      <p className="text-gray-300 text-sm sm:text-base">
                        {blogPosts[0].excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>{new Date(blogPosts[0].published_at).toLocaleDateString('pt-BR')}</span>
                        <span>{blogPosts[0].reading_time} de leitura</span>
                      </div>
                      
                      <button 
                        className="px-4 py-2 bg-orange-500/20 border border-orange-400 text-orange-400 rounded-lg hover:bg-orange-500/30 transition-all duration-300 text-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveBlogPost(blogPosts[0].slug);
                        }}
                      >
                        Ler artigo completo
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Other Posts */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogPosts.slice(1).map((post) => (
                  <div 
                    key={post.id} 
                    className="blog-card rounded-xl p-4 card-hover group cursor-pointer"
                    onClick={() => setActiveBlogPost(post.slug)}
                  >
                    <div className="relative overflow-hidden rounded-lg mb-4">
                      <img
                        src={post.image_url}
                        alt={post.title}
                        className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-1">
                        <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 rounded-full text-xs border border-orange-500/30">
                          {post.category}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-bold text-orange-400 group-hover:text-cyan-400 transition-colors duration-300 line-clamp-2">
                        {post.title}
                      </h3>
                      
                      <p className="text-gray-300 text-sm line-clamp-3">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>{new Date(post.published_at).toLocaleDateString('pt-BR')}</span>
                        <span>{post.reading_time}</span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Placeholder para mais posts */}
                <div className="blog-card rounded-xl p-4 border border-dashed border-gray-700 flex flex-col items-center justify-center h-64 text-center">
                  <FileText className="w-12 h-12 text-gray-600 mb-4" />
                  <p className="text-gray-500">Mais artigos em breve</p>
                  <p className="text-gray-600 text-sm mt-2">Fique ligado para novos conteúdos</p>
                </div>
              </div>
              
              {/* Newsletter */}
              <div className="mt-12 bg-gray-900/50 p-6 rounded-xl border border-purple-500/30">
                <div className="grid md:grid-cols-2 gap-6 items-center">
                  <div>
                    <h3 className="text-xl font-bold text-purple-400 mb-2">Inscreva-se na Newsletter</h3>
                    <p className="text-gray-300 text-sm">Receba artigos, tutoriais e dicas diretamente no seu email.</p>
                  </div>
                  <div className="flex">
                    <input
                      type="email"
                      placeholder="Seu melhor email"
                      className="flex-1 p-3 bg-black border border-gray-600 rounded-l-lg text-white"
                    />
                    <button className="px-4 py-3 bg-purple-500/20 border border-purple-400 text-purple-400 rounded-r-lg hover:bg-purple-500/30 transition-all duration-300">
                      Inscrever
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Classes Section - RESPONSIVIDADE MELHORADA */}
      {activeSection === 'classes' && (
        <section className="min-h-screen pt-24 px-4 sm:px-6 pb-16">
          <div className="container mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12 text-cyan-400 glitch-text">
              Aulas Particulares
            </h2>
            
            <div className="max-w-4xl mx-auto">
              {/* Introdução */}
              <div className="text-center mb-12">
                <h3 className="text-xl sm:text-2xl font-bold text-purple-400 mb-4">Aprenda com um especialista</h3>
                <p className="text-gray-300 max-w-2xl mx-auto">
                  Aulas personalizadas para seu nível e objetivos, com foco em projetos práticos e aplicação real.
                  Desenvolva habilidades que o mercado realmente valoriza.
                </p>
              </div>
              
              {/* Planos */}
              <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-12">
                {/* Plano Básico */}
                <div className="bg-gray-900/50 p-6 rounded-xl border border-cyan-500/30 relative card-hover">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-cyan-400 mb-2">Plano Básico</h3>
                    <p className="text-gray-300 text-sm">Ideal para iniciantes que desejam aprender os fundamentos.</p>
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-2xl font-bold text-purple-400">R$150</span>
                    <span className="text-gray-400 text-sm">/ aula</span>
                  </div>
                  
                  <div className="text-sm text-gray-400 mb-2 flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-cyan-400" />
                    1 hora por aula
                  </div>
                  
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start text-gray-300 text-sm">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>1 aula semanal</span>
                    </li>
                    <li className="flex items-start text-gray-300 text-sm">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>Suporte por e-mail</span>
                    </li>
                    <li className="flex items-start text-gray-300 text-sm">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>Material didático</span>
                    </li>
                    <li className="flex items-start text-gray-300 text-sm">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>Certificado de conclusão</span>
                    </li>
                  </ul>
                  
                  <a 
                    href={settings?.class_link || "https://wa.me/5511999999999"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-3 bg-cyan-500/20 border border-cyan-400 text-cyan-400 rounded-lg text-center hover:bg-cyan-500/30 transition-all duration-300"
                  >
                    Agendar Aula Experimental
                  </a>
                </div>
                
                {/* Plano Premium */}
                <div className="bg-gray-900/50 p-6 rounded-xl border border-purple-500/30 relative card-hover">
                  <div className="absolute -top-3 -right-3 bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    Recomendado
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-purple-400 mb-2">Plano Premium</h3>
                    <p className="text-gray-300 text-sm">Para quem deseja aprender de forma intensiva e com mais recursos.</p>
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-2xl font-bold text-purple-400">R$250</span>
                    <span className="text-gray-400 text-sm">/ aula</span>
                  </div>
                  
                  <div className="text-sm text-gray-400 mb-2 flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-purple-400" />
                    1.5 horas por aula
                  </div>
                  
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start text-gray-300 text-sm">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>2 aulas semanais</span>
                    </li>
                    <li className="flex items-start text-gray-300 text-sm">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>Suporte por WhatsApp</span>
                    </li>
                    <li className="flex items-start text-gray-300 text-sm">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>Material didático avançado</span>
                    </li>
                    <li className="flex items-start text-gray-300 text-sm">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>Projetos práticos</span>
                    </li>
                    <li className="flex items-start text-gray-300 text-sm">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>Certificado de conclusão</span>
                    </li>
                    <li className="flex items-start text-gray-300 text-sm">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>Mentoria personalizada</span>
                    </li>
                  </ul>
                  
                  <a 
                    href={settings?.class_link || "https://wa.me/5511999999999"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-3 bg-purple-500/20 border border-purple-400 text-purple-400 rounded-lg text-center hover:bg-purple-500/30 transition-all duration-300"
                  >
                    Agendar Aula Experimental
                  </a>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
                <div className="bg-gray-900/50 p-4 sm:p-6 rounded-lg border border-cyan-500/30">
                  <GraduationCap className="w-8 sm:w-12 h-8 sm:h-12 text-cyan-400 mb-4" />
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-cyan-400 mb-4">Metodologia</h3>
                  <ul className="space-y-3 text-gray-300 text-sm md:text-base">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>Aulas 100% práticas com projetos reais</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>Conteúdo personalizado por aluno</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>Suporte contínuo via WhatsApp</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>Flexibilidade de horários</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-900/50 p-4 sm:p-6 rounded-lg border border-purple-500/30">
                  <Brain className="w-8 sm:w-12 h-8 sm:h-12 text-purple-400 mb-4" />
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-purple-400 mb-4">Áreas de Ensino</h3>
                  <ul className="space-y-3 text-gray-300 text-sm md:text-base">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>Desenvolvimento Web (React, Angular, Vue)</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>Desenvolvimento Mobile (React Native)</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>Backend (Node.js, Python, Java)</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>Cybersecurity e Ethical Hacking</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="text-center">
                <a 
                  href={settings?.class_link || "https://wa.me/5511999999999"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 border-2 bg-cyan-500/20 border-cyan-400 text-cyan-400 hover:bg-cyan-500/30 hover:shadow-cyan-glow"
                >
                  <MessageSquare className="w-5 h-5 inline mr-2" />
                  Agendar Aula Experimental
                </a>
                <p className="text-gray-400 text-sm mt-4">
                  Primeira aula com 50% de desconto para novos alunos!
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Login Modal */}
      {showLogin && (
        <AdminLogin onLogin={handleLogin} onBackToFrontend={handleBackToFrontend} />
      )}

      {/* Admin Panel */}
      {isAdminOpen && isAuthenticated && (
        <AdminPanel onClose={handleAdminClose} onBackToFrontend={handleBackToFrontend} />
      )}

      {/* Hidden admin hint */}
      <div className="fixed bottom-4 left-4 text-xs text-gray-600 opacity-30 pointer-events-none">
        Digite "deviem" para acesso administrativo
      </div>
    </div>
  );
}

export default App;