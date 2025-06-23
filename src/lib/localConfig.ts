// Configuração para desenvolvimento local sem Supabase
export const LOCAL_MODE = {
  // Forçar modo local apenas se as variáveis não estiverem configuradas OU forem valores de exemplo
  enabled: !import.meta.env.VITE_SUPABASE_URL || 
           import.meta.env.VITE_SUPABASE_URL === 'https://seu-projeto-id.supabase.co' ||
           import.meta.env.VITE_SUPABASE_URL.includes('your_actual_supabase_url_here') ||
           !import.meta.env.VITE_SUPABASE_ANON_KEY ||
           import.meta.env.VITE_SUPABASE_ANON_KEY.includes('your_actual_supabase_anon_key_here'),
  
  // Dados mock APENAS para fallback quando Supabase não retorna dados
  mockData: {
    projects: [
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
      },
      {
        id: 3,
        title: "App Mobile Saúde",
        description: "Aplicativo para monitoramento de saúde com IoT e análise preditiva.",
        tech: ["React Native", "Python", "AWS", "IoT"],
        image_url: "https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=800"
      },
      {
        id: 4,
        title: "Sistema de Cybersecurity",
        description: "Plataforma de monitoramento e prevenção de ataques cibernéticos para o Governo Federal.",
        tech: ["Python", "Machine Learning", "Elasticsearch", "Kibana"],
        image_url: "https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=800"
      }
    ],
    
    testimonials: [
      {
        id: 1,
        name: "Ana Silva",
        role: "CTO - TechCorp",
        text: "O DevIem transformou nossa arquitetura de segurança. Sua experiência em cybersecurity salvou nossa empresa de múltiplos ataques.",
        avatar_url: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200"
      },
      {
        id: 2,
        name: "Carlos Santos",
        role: "Desenvolvedor Junior",
        text: "A mentoria do DevIem foi fundamental na minha transição de carreira. Em 6 meses saí de iniciante para desenvolvedor pleno.",
        avatar_url: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200"
      },
      {
        id: 3,
        name: "Maria Oliveira",
        role: "Gerente de TI - Gov Federal",
        text: "Profissional excepcional. Já nos ajudou a prevenir ataques críticos à infraestrutura nacional.",
        avatar_url: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200"
      },
      {
        id: 4,
        name: "João Pereira",
        role: "CEO - StartupTech",
        text: "Contratamos o DevIem para desenvolver nossa plataforma. Entregou um sistema robusto e escalável que suporta milhares de usuários.",
        avatar_url: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200"
      }
    ],
    
    talks: [
      {
        id: 1,
        title: "Segurança Cibernética na Era da IA",
        description: "Como a inteligência artificial está transformando o cenário de segurança digital e quais são os novos desafios para proteção de dados.",
        tags: ["Cybersecurity", "AI", "Data Protection"],
        image_url: "https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=800"
      },
      {
        id: 2,
        title: "Transição de Carreira para Tech",
        description: "Estratégias práticas para profissionais que desejam migrar para área de tecnologia, com foco em desenvolvimento de software.",
        tags: ["Career", "Mentoring", "Development"],
        image_url: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800"
      },
      {
        id: 3,
        title: "Arquitetura de Software Moderna",
        description: "Melhores práticas em arquitetura de software, microserviços, containerização e deploy automatizado.",
        tags: ["Architecture", "Microservices", "DevOps"],
        image_url: "https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=800"
      },
      {
        id: 4,
        title: "Ethical Hacking: Protegendo Infraestruturas Críticas",
        description: "Técnicas de penetration testing e como proteger sistemas governamentais e empresariais de ataques cibernéticos.",
        tags: ["Ethical Hacking", "Penetration Testing", "Government Security"],
        image_url: "https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=800"
      }
    ],
    
    settings: {
      id: 1,
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
    }
  }
};

// Função para verificar se está em modo local
export const isLocalMode = () => {
  const result = LOCAL_MODE.enabled;
  console.log('🔍 Verificando modo local:', {
    hasUrl: !!import.meta.env.VITE_SUPABASE_URL,
    hasKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
    url: import.meta.env.VITE_SUPABASE_URL,
    isLocalMode: result
  });
  return result;
};

// Função para obter dados mock APENAS como fallback
export const getMockData = () => {
  console.log('📦 Retornando dados mock como fallback');
  return LOCAL_MODE.mockData;
};