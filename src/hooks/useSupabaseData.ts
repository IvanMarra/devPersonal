import { useState, useEffect, useCallback } from 'react';
import { 
  projectsService, 
  testimonialsService, 
  talksService, 
  settingsService,
  blogService,
  classesService,
  Project,
  Testimonial,
  Talk,
  SiteSettings,
  BlogPost,
  ClassPlan,
  ClassSettings,
  isSupabaseConfigured
} from '../lib/supabase';

// Sistema de eventos globais para sincronização
class DataSyncManager {
  private listeners: Set<() => void> = new Set();
  private lastUpdate: number = 0;
  
  subscribe(callback: () => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }
  
  notify() {
    this.lastUpdate = Date.now();
    console.log('🔄 FORÇANDO atualização de TODOS os componentes...');
    this.listeners.forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.error('Erro ao notificar listener:', error);
      }
    });
  }
  
  getLastUpdate() {
    return this.lastUpdate;
  }
}

const dataSyncManager = new DataSyncManager();

// Hook para forçar re-render
const useForceUpdate = () => {
  const [, setTick] = useState(0);
  const forceUpdate = useCallback(() => {
    setTick(tick => tick + 1);
  }, []);
  return forceUpdate;
};

// DADOS PADRÃO APENAS PARA CASOS DE ERRO CRÍTICO - COM IMAGEM DE PERFIL
const DEFAULT_DATA = {
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
  },
  blogPosts: [
    {
      id: 1,
      title: "Introdução à Segurança Cibernética",
      slug: "introducao-seguranca-cibernetica",
      content: "<h2>Introdução à Segurança Cibernética</h2><p>A segurança cibernética é um campo em constante evolução que se concentra na proteção de sistemas, redes e programas contra ataques digitais.</p>",
      excerpt: "Uma introdução aos conceitos básicos de segurança cibernética e como proteger seus dados.",
      image_url: "https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=1200",
      tags: ["Cybersecurity", "Beginners", "Data Protection"],
      category: "Security",
      published_at: "2025-01-15T10:00:00Z",
      author: "DevIem"
    },
    {
      id: 2,
      title: "Como Iniciar sua Carreira em Desenvolvimento Web",
      slug: "iniciar-carreira-desenvolvimento-web",
      content: "<h2>Como Iniciar sua Carreira em Desenvolvimento Web em 2025</h2><p>O desenvolvimento web continua sendo uma das carreiras mais promissoras e acessíveis na área de tecnologia.</p>",
      excerpt: "Guia completo para quem deseja iniciar uma carreira em desenvolvimento web em 2025.",
      image_url: "https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=1200",
      tags: ["Career", "Web Development", "Beginners"],
      category: "Career",
      published_at: "2025-01-10T14:30:00Z",
      author: "DevIem"
    }
  ],
  classSettings: {
    id: 1,
    title: "Aulas Particulares",
    subtitle: "Aprenda com um especialista",
    description: "Aulas personalizadas para seu nível e objetivos, com foco em projetos práticos e aplicação real.",
    cta_text: "Agendar Aula Experimental",
    cta_link: "https://wa.me/5511999999999",
    methodology: [
      "Aulas 100% práticas com projetos reais",
      "Conteúdo personalizado por aluno",
      "Suporte contínuo via WhatsApp",
      "Flexibilidade de horários"
    ],
    areas: [
      "Desenvolvimento Web (React, Angular, Vue)",
      "Desenvolvimento Mobile (React Native)",
      "Backend (Node.js, Python, Java)",
      "Cybersecurity e Ethical Hacking"
    ]
  },
  classPlans: [
    {
      id: 1,
      title: "Plano Básico",
      description: "Ideal para iniciantes que desejam aprender os fundamentos.",
      price: 150,
      duration: "1 hora",
      features: [
        "1 aula semanal",
        "Suporte por e-mail",
        "Material didático",
        "Certificado de conclusão"
      ],
      image_url: "https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=800",
      is_featured: false
    },
    {
      id: 2,
      title: "Plano Premium",
      description: "Para quem deseja aprender de forma intensiva e com mais recursos.",
      price: 250,
      duration: "1.5 horas",
      features: [
        "2 aulas semanais",
        "Suporte por WhatsApp",
        "Material didático avançado",
        "Projetos práticos",
        "Certificado de conclusão",
        "Mentoria personalizada"
      ],
      image_url: "https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=800",
      is_featured: true
    }
  ]
};

// Função para verificar se está em modo local
export const isLocalMode = () => {
  return false; // Sempre retornar false para forçar o uso do Supabase
};

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const forceUpdate = useForceUpdate();

  const fetchProjects = useCallback(async (force = false) => {
    try {
      if (force) console.log('🔄 FORÇANDO atualização de projetos...');
      setLoading(true);
      setError(null);
      
      if (!isSupabaseConfigured()) {
        console.error('❌ Supabase não configurado - usando dados padrão');
        setProjects(DEFAULT_DATA.projects);
        setError('Supabase não configurado');
        setLoading(false);
        return;
      }
      
      console.log('🌐 Buscando projetos do Supabase...');
      const data = await projectsService.getAll();
      
      if (data && data.length > 0) {
        setProjects(data);
        console.log('📊 Projetos carregados do Supabase:', data.length);
      } else {
        console.log('📊 Nenhum projeto encontrado no Supabase, usando dados padrão');
        setProjects(DEFAULT_DATA.projects);
      }
      
      forceUpdate();
    } catch (err) {
      console.error('❌ Erro ao carregar projetos:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar projetos');
      console.log('📊 Usando dados padrão devido a erro');
      setProjects(DEFAULT_DATA.projects);
    } finally {
      setLoading(false);
    }
  }, [forceUpdate]);

  useEffect(() => {
    fetchProjects();
    
    const unsubscribe = dataSyncManager.subscribe(() => {
      console.log('🔄 Recebido evento de sync - atualizando projetos...');
      fetchProjects(true);
    });
    
    return unsubscribe;
  }, [fetchProjects]);

  const addProject = async (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (!isSupabaseConfigured()) {
        console.log('❌ Supabase não configurado, simulando adição');
        const newProject = {
          id: Date.now(),
          title: project.title,
          description: project.description,
          tech: project.tech,
          image_url: project.image_url,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setProjects(prev => [newProject, ...prev]);
        return newProject;
      }
      
      console.log('➕ Adicionando projeto no Supabase:', project.title);
      const newProject = await projectsService.create(project);
      
      if (newProject) {
        console.log('✅ Projeto adicionado com sucesso no Supabase');
        await fetchProjects(true);
        dataSyncManager.notify();
        return newProject;
      } else {
        throw new Error('Falha ao criar projeto no Supabase');
      }
    } catch (err) {
      console.error('❌ Erro ao adicionar projeto:', err);
      
      // Fallback: adicionar localmente
      console.log('📊 Adicionando projeto localmente devido a erro');
      const newProject = {
        id: Date.now(),
        title: project.title,
        description: project.description,
        tech: project.tech,
        image_url: project.image_url,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setProjects(prev => [newProject, ...prev]);
      
      throw err;
    }
  };

  const updateProject = async (id: number, project: Partial<Project>) => {
    try {
      if (!isSupabaseConfigured()) {
        console.log('❌ Supabase não configurado, simulando atualização');
        setProjects(prev => 
          prev.map(p => p.id === id ? { ...p, ...project, updated_at: new Date().toISOString() } : p)
        );
        return { id, ...project };
      }
      
      console.log('📝 Atualizando projeto no Supabase:', id);
      const updatedProject = await projectsService.update(id, project);
      
      if (updatedProject) {
        console.log('✅ Projeto atualizado com sucesso no Supabase');
        await fetchProjects(true);
        dataSyncManager.notify();
        return updatedProject;
      } else {
        throw new Error('Falha ao atualizar projeto no Supabase');
      }
    } catch (err) {
      console.error('❌ Erro ao atualizar projeto:', err);
      
      // Fallback: atualizar localmente
      console.log('📊 Atualizando projeto localmente devido a erro');
      setProjects(prev => 
        prev.map(p => p.id === id ? { ...p, ...project, updated_at: new Date().toISOString() } : p)
      );
      
      throw err;
    }
  };

  const deleteProject = async (id: number) => {
    try {
      if (!isSupabaseConfigured()) {
        console.log('❌ Supabase não configurado, simulando exclusão');
        setProjects(prev => prev.filter(p => p.id !== id));
        return true;
      }
      
      console.log('🗑️ Deletando projeto no Supabase:', id);
      await projectsService.delete(id);
      console.log('✅ Projeto deletado com sucesso no Supabase');
      await fetchProjects(true);
      dataSyncManager.notify();
      return true;
    } catch (err) {
      console.error('❌ Erro ao deletar projeto:', err);
      
      // Fallback: deletar localmente
      console.log('📊 Deletando projeto localmente devido a erro');
      setProjects(prev => prev.filter(p => p.id !== id));
      
      throw err;
    }
  };

  return {
    projects,
    loading,
    error,
    addProject,
    updateProject,
    deleteProject,
    refetch: fetchProjects
  };
};

export const useTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const forceUpdate = useForceUpdate();

  const fetchTestimonials = useCallback(async (force = false) => {
    try {
      if (force) console.log('🔄 FORÇANDO atualização de depoimentos...');
      setLoading(true);
      setError(null);
      
      if (!isSupabaseConfigured()) {
        console.error('❌ Supabase não configurado - usando dados padrão');
        setTestimonials(DEFAULT_DATA.testimonials);
        setError('Supabase não configurado');
        setLoading(false);
        return;
      }
      
      console.log('🌐 Buscando depoimentos do Supabase...');
      const data = await testimonialsService.getAll();
      
      if (data && data.length > 0) {
        setTestimonials(data);
        console.log('📊 Depoimentos carregados do Supabase:', data.length);
      } else {
        console.log('📊 Nenhum depoimento encontrado no Supabase, usando dados padrão');
        setTestimonials(DEFAULT_DATA.testimonials);
      }
      
      forceUpdate();
    } catch (err) {
      console.error('❌ Erro ao carregar depoimentos:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar depoimentos');
      console.log('📊 Usando dados padrão devido a erro');
      setTestimonials(DEFAULT_DATA.testimonials);
    } finally {
      setLoading(false);
    }
  }, [forceUpdate]);

  useEffect(() => {
    fetchTestimonials();
    
    const unsubscribe = dataSyncManager.subscribe(() => {
      console.log('🔄 Recebido evento de sync - atualizando depoimentos...');
      fetchTestimonials(true);
    });
    
    return unsubscribe;
  }, [fetchTestimonials]);

  const addTestimonial = async (testimonial: Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (!isSupabaseConfigured()) {
        console.log('❌ Supabase não configurado, simulando adição');
        const newTestimonial = {
          id: Date.now(),
          name: testimonial.name,
          role: testimonial.role,
          text: testimonial.text,
          avatar_url: testimonial.avatar_url,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setTestimonials(prev => [newTestimonial, ...prev]);
        return newTestimonial;
      }
      
      console.log('➕ Adicionando depoimento no Supabase:', testimonial.name);
      const newTestimonial = await testimonialsService.create(testimonial);
      
      if (newTestimonial) {
        console.log('✅ Depoimento adicionado com sucesso no Supabase');
        await fetchTestimonials(true);
        dataSyncManager.notify();
        return newTestimonial;
      } else {
        throw new Error('Falha ao criar depoimento no Supabase');
      }
    } catch (err) {
      console.error('❌ Erro ao adicionar depoimento:', err);
      
      // Fallback: adicionar localmente
      console.log('📊 Adicionando depoimento localmente devido a erro');
      const newTestimonial = {
        id: Date.now(),
        name: testimonial.name,
        role: testimonial.role,
        text: testimonial.text,
        avatar_url: testimonial.avatar_url,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setTestimonials(prev => [newTestimonial, ...prev]);
      
      throw err;
    }
  };

  const updateTestimonial = async (id: number, testimonial: Partial<Testimonial>) => {
    try {
      if (!isSupabaseConfigured()) {
        console.log('❌ Supabase não configurado, simulando atualização');
        setTestimonials(prev => 
          prev.map(t => t.id === id ? { ...t, ...testimonial, updated_at: new Date().toISOString() } : t)
        );
        return { id, ...testimonial };
      }
      
      console.log('📝 Atualizando depoimento no Supabase:', id);
      const updatedTestimonial = await testimonialsService.update(id, testimonial);
      
      if (updatedTestimonial) {
        console.log('✅ Depoimento atualizado com sucesso no Supabase');
        await fetchTestimonials(true);
        dataSyncManager.notify();
        return updatedTestimonial;
      } else {
        throw new Error('Falha ao atualizar depoimento no Supabase');
      }
    } catch (err) {
      console.error('❌ Erro ao atualizar depoimento:', err);
      
      // Fallback: atualizar localmente
      console.log('📊 Atualizando depoimento localmente devido a erro');
      setTestimonials(prev => 
        prev.map(t => t.id === id ? { ...t, ...testimonial, updated_at: new Date().toISOString() } : t)
      );
      
      throw err;
    }
  };

  const deleteTestimonial = async (id: number) => {
    try {
      if (!isSupabaseConfigured()) {
        console.log('❌ Supabase não configurado, simulando exclusão');
        setTestimonials(prev => prev.filter(t => t.id !== id));
        return true;
      }
      
      console.log('🗑️ Deletando depoimento no Supabase:', id);
      await testimonialsService.delete(id);
      console.log('✅ Depoimento deletado com sucesso no Supabase');
      await fetchTestimonials(true);
      dataSyncManager.notify();
      return true;
    } catch (err) {
      console.error('❌ Erro ao deletar depoimento:', err);
      
      // Fallback: deletar localmente
      console.log('📊 Deletando depoimento localmente devido a erro');
      setTestimonials(prev => prev.filter(t => t.id !== id));
      
      throw err;
    }
  };

  return {
    testimonials,
    loading,
    error,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    refetch: fetchTestimonials
  };
};

export const useTalks = () => {
  const [talks, setTalks] = useState<Talk[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const forceUpdate = useForceUpdate();

  const fetchTalks = useCallback(async (force = false) => {
    try {
      if (force) console.log('🔄 FORÇANDO atualização de palestras...');
      setLoading(true);
      setError(null);
      
      if (!isSupabaseConfigured()) {
        console.error('❌ Supabase não configurado - usando dados padrão');
        setTalks(DEFAULT_DATA.talks);
        setError('Supabase não configurado');
        setLoading(false);
        return;
      }
      
      console.log('🌐 Buscando palestras do Supabase...');
      const data = await talksService.getAll();
      
      if (data && data.length > 0) {
        setTalks(data);
        console.log('📊 Palestras carregadas do Supabase:', data.length);
      } else {
        console.log('📊 Nenhuma palestra encontrada no Supabase, usando dados padrão');
        setTalks(DEFAULT_DATA.talks);
      }
      
      forceUpdate();
    } catch (err) {
      console.error('❌ Erro ao carregar palestras:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar palestras');
      console.log('📊 Usando dados padrão devido a erro');
      setTalks(DEFAULT_DATA.talks);
    } finally {
      setLoading(false);
    }
  }, [forceUpdate]);

  useEffect(() => {
    fetchTalks();
    
    const unsubscribe = dataSyncManager.subscribe(() => {
      console.log('🔄 Recebido evento de sync - atualizando palestras...');
      fetchTalks(true);
    });
    
    return unsubscribe;
  }, [fetchTalks]);

  const addTalk = async (talk: Omit<Talk, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (!isSupabaseConfigured()) {
        console.log('❌ Supabase não configurado, simulando adição');
        const newTalk = {
          id: Date.now(),
          title: talk.title,
          description: talk.description,
          tags: talk.tags,
          image_url: talk.image_url,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setTalks(prev => [newTalk, ...prev]);
        return newTalk;
      }
      
      console.log('➕ Adicionando palestra no Supabase:', talk.title);
      const newTalk = await talksService.create(talk);
      
      if (newTalk) {
        console.log('✅ Palestra adicionada com sucesso no Supabase');
        await fetchTalks(true);
        dataSyncManager.notify();
        return newTalk;
      } else {
        throw new Error('Falha ao criar palestra no Supabase');
      }
    } catch (err) {
      console.error('❌ Erro ao adicionar palestra:', err);
      
      // Fallback: adicionar localmente
      console.log('📊 Adicionando palestra localmente devido a erro');
      const newTalk = {
        id: Date.now(),
        title: talk.title,
        description: talk.description,
        tags: talk.tags,
        image_url: talk.image_url,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setTalks(prev => [newTalk, ...prev]);
      
      throw err;
    }
  };

  const updateTalk = async (id: number, talk: Partial<Talk>) => {
    try {
      if (!isSupabaseConfigured()) {
        console.log('❌ Supabase não configurado, simulando atualização');
        setTalks(prev => 
          prev.map(t => t.id === id ? { ...t, ...talk, updated_at: new Date().toISOString() } : t)
        );
        return { id, ...talk };
      }
      
      console.log('📝 Atualizando palestra no Supabase:', id);
      const updatedTalk = await talksService.update(id, talk);
      
      if (updatedTalk) {
        console.log('✅ Palestra atualizada com sucesso no Supabase');
        await fetchTalks(true);
        dataSyncManager.notify();
        return updatedTalk;
      } else {
        throw new Error('Falha ao atualizar palestra no Supabase');
      }
    } catch (err) {
      console.error('❌ Erro ao atualizar palestra:', err);
      
      // Fallback: atualizar localmente
      console.log('📊 Atualizando palestra localmente devido a erro');
      setTalks(prev => 
        prev.map(t => t.id === id ? { ...t, ...talk, updated_at: new Date().toISOString() } : t)
      );
      
      throw err;
    }
  };

  const deleteTalk = async (id: number) => {
    try {
      if (!isSupabaseConfigured()) {
        console.log('❌ Supabase não configurado, simulando exclusão');
        setTalks(prev => prev.filter(t => t.id !== id));
        return true;
      }
      
      console.log('🗑️ Deletando palestra no Supabase:', id);
      await talksService.delete(id);
      console.log('✅ Palestra deletada com sucesso no Supabase');
      await fetchTalks(true);
      dataSyncManager.notify();
      return true;
    } catch (err) {
      console.error('❌ Erro ao deletar palestra:', err);
      
      // Fallback: deletar localmente
      console.log('📊 Deletando palestra localmente devido a erro');
      setTalks(prev => prev.filter(t => t.id !== id));
      
      throw err;
    }
  };

  return {
    talks,
    loading,
    error,
    addTalk,
    updateTalk,
    deleteTalk,
    refetch: fetchTalks
  };
};

export const useSiteSettings = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const forceUpdate = useForceUpdate();

  const fetchSettings = useCallback(async (force = false) => {
    try {
      if (force) console.log('🔄 FORÇANDO atualização de configurações...');
      setLoading(true);
      setError(null);
      
      if (!isSupabaseConfigured()) {
        console.error('❌ Supabase não configurado - usando configurações padrão');
        setSettings(DEFAULT_DATA.settings);
        setError('Supabase não configurado');
        setLoading(false);
        return;
      }
      
      console.log('🌐 Buscando configurações do Supabase...');
      const data = await settingsService.get();
      
      if (data) {
        setSettings(data);
        console.log('📊 Configurações carregadas do Supabase');
      } else {
        console.log('📊 Nenhuma configuração encontrada no Supabase, usando configurações padrão');
        setSettings(DEFAULT_DATA.settings);
      }
      
      forceUpdate();
    } catch (err) {
      console.error('❌ Erro ao carregar configurações:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar configurações');
      console.log('📊 Usando configurações padrão devido a erro');
      setSettings(DEFAULT_DATA.settings);
    } finally {
      setLoading(false);
    }
  }, [forceUpdate]);

  useEffect(() => {
    fetchSettings();
    
    const unsubscribe = dataSyncManager.subscribe(() => {
      console.log('🔄 Recebido evento de sync - atualizando configurações...');
      fetchSettings(true);
    });
    
    return unsubscribe;
  }, [fetchSettings]);

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    try {
      if (!isSupabaseConfigured()) {
        console.log('❌ Supabase não configurado, simulando atualização');
        setSettings(prev => prev ? { ...prev, ...newSettings, updated_at: new Date().toISOString() } : null);
        return newSettings;
      }
      
      console.log('📝 Atualizando configurações no Supabase');
      const updatedSettings = await settingsService.update(newSettings);
      
      if (updatedSettings) {
        console.log('✅ Configurações atualizadas com sucesso no Supabase');
        await fetchSettings(true);
        dataSyncManager.notify();
        return updatedSettings;
      } else {
        throw new Error('Falha ao atualizar configurações no Supabase');
      }
    } catch (err) {
      console.error('❌ Erro ao atualizar configurações:', err);
      
      // Fallback: atualizar localmente
      console.log('📊 Atualizando configurações localmente devido a erro');
      setSettings(prev => prev ? { ...prev, ...newSettings, updated_at: new Date().toISOString() } : null);
      
      throw err;
    }
  };

  return {
    settings,
    loading,
    error,
    updateSettings,
    refetch: fetchSettings
  };
};

// Hook para blog posts
export const useBlogPosts = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const forceUpdate = useForceUpdate();

  const fetchBlogPosts = useCallback(async (force = false) => {
    try {
      if (force) console.log('🔄 FORÇANDO atualização de posts do blog...');
      setLoading(true);
      setError(null);
      
      if (!isSupabaseConfigured()) {
        console.error('❌ Supabase não configurado - usando dados padrão');
        setBlogPosts(DEFAULT_DATA.blogPosts);
        setError('Supabase não configurado');
        setLoading(false);
        return;
      }
      
      console.log('🌐 Buscando posts do blog do Supabase...');
      const data = await blogService.getAll();
      
      if (data && data.length > 0) {
        setBlogPosts(data);
        console.log('📊 Posts do blog carregados do Supabase:', data.length);
      } else {
        console.log('📊 Nenhum post do blog encontrado no Supabase, usando dados padrão');
        setBlogPosts(DEFAULT_DATA.blogPosts);
      }
      
      forceUpdate();
    } catch (err) {
      console.error('❌ Erro ao carregar posts do blog:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar posts do blog');
      console.log('📊 Usando dados padrão devido a erro');
      setBlogPosts(DEFAULT_DATA.blogPosts);
    } finally {
      setLoading(false);
    }
  }, [forceUpdate]);

  useEffect(() => {
    fetchBlogPosts();
    
    const unsubscribe = dataSyncManager.subscribe(() => {
      console.log('🔄 Recebido evento de sync - atualizando posts do blog...');
      fetchBlogPosts(true);
    });
    
    return unsubscribe;
  }, [fetchBlogPosts]);

  const addBlogPost = async (post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (!isSupabaseConfigured()) {
        console.log('❌ Supabase não configurado, simulando adição');
        const newPost = {
          id: Date.now(),
          ...post,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setBlogPosts(prev => [newPost, ...prev]);
        return newPost;
      }
      
      console.log('➕ Adicionando post do blog no Supabase:', post.title);
      const newPost = await blogService.create(post);
      
      if (newPost) {
        console.log('✅ Post do blog adicionado com sucesso no Supabase');
        await fetchBlogPosts(true);
        dataSyncManager.notify();
        return newPost;
      } else {
        throw new Error('Falha ao criar post do blog no Supabase');
      }
    } catch (err) {
      console.error('❌ Erro ao adicionar post do blog:', err);
      
      // Fallback: adicionar localmente
      console.log('📊 Adicionando post do blog localmente devido a erro');
      const newPost = {
        id: Date.now(),
        ...post,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setBlogPosts(prev => [newPost, ...prev]);
      
      throw err;
    }
  };

  const updateBlogPost = async (id: number, post: Partial<BlogPost>) => {
    try {
      if (!isSupabaseConfigured()) {
        console.log('❌ Supabase não configurado, simulando atualização');
        setBlogPosts(prev => 
          prev.map(p => p.id === id ? { ...p, ...post, updated_at: new Date().toISOString() } : p)
        );
        return { id, ...post };
      }
      
      console.log('📝 Atualizando post do blog no Supabase:', id);
      const updatedPost = await blogService.update(id, post);
      
      if (updatedPost) {
        console.log('✅ Post do blog atualizado com sucesso no Supabase');
        await fetchBlogPosts(true);
        dataSyncManager.notify();
        return updatedPost;
      } else {
        throw new Error('Falha ao atualizar post do blog no Supabase');
      }
    } catch (err) {
      console.error('❌ Erro ao atualizar post do blog:', err);
      
      // Fallback: atualizar localmente
      console.log('📊 Atualizando post do blog localmente devido a erro');
      setBlogPosts(prev => 
        prev.map(p => p.id === id ? { ...p, ...post, updated_at: new Date().toISOString() } : p)
      );
      
      throw err;
    }
  };

  const deleteBlogPost = async (id: number) => {
    try {
      if (!isSupabaseConfigured()) {
        console.log('❌ Supabase não configurado, simulando exclusão');
        setBlogPosts(prev => prev.filter(p => p.id !== id));
        return true;
      }
      
      console.log('🗑️ Deletando post do blog no Supabase:', id);
      await blogService.delete(id);
      console.log('✅ Post do blog deletado com sucesso no Supabase');
      await fetchBlogPosts(true);
      dataSyncManager.notify();
      return true;
    } catch (err) {
      console.error('❌ Erro ao deletar post do blog:', err);
      
      // Fallback: deletar localmente
      console.log('📊 Deletando post do blog localmente devido a erro');
      setBlogPosts(prev => prev.filter(p => p.id !== id));
      
      throw err;
    }
  };

  return {
    blogPosts,
    loading,
    error,
    addBlogPost,
    updateBlogPost,
    deleteBlogPost,
    refetch: fetchBlogPosts
  };
};

// Hook para configurações de aulas
export const useClassSettings = () => {
  const [classSettings, setClassSettings] = useState<ClassSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const forceUpdate = useForceUpdate();

  const fetchClassSettings = useCallback(async (force = false) => {
    try {
      if (force) console.log('🔄 FORÇANDO atualização de configurações de aulas...');
      setLoading(true);
      setError(null);
      
      if (!isSupabaseConfigured()) {
        console.error('❌ Supabase não configurado - usando configurações padrão');
        setClassSettings(DEFAULT_DATA.classSettings);
        setError('Supabase não configurado');
        setLoading(false);
        return;
      }
      
      console.log('🌐 Buscando configurações de aulas do Supabase...');
      const data = await classesService.getSettings();
      
      if (data) {
        setClassSettings(data);
        console.log('📊 Configurações de aulas carregadas do Supabase');
      } else {
        console.log('📊 Nenhuma configuração de aulas encontrada no Supabase, usando configurações padrão');
        setClassSettings(DEFAULT_DATA.classSettings);
      }
      
      forceUpdate();
    } catch (err) {
      console.error('❌ Erro ao carregar configurações de aulas:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar configurações de aulas');
      console.log('📊 Usando configurações padrão devido a erro');
      setClassSettings(DEFAULT_DATA.classSettings);
    } finally {
      setLoading(false);
    }
  }, [forceUpdate]);

  useEffect(() => {
    fetchClassSettings();
    
    const unsubscribe = dataSyncManager.subscribe(() => {
      console.log('🔄 Recebido evento de sync - atualizando configurações de aulas...');
      fetchClassSettings(true);
    });
    
    return unsubscribe;
  }, [fetchClassSettings]);

  const updateClassSettings = async (settings: Partial<ClassSettings>) => {
    try {
      if (!isSupabaseConfigured()) {
        console.log('❌ Supabase não configurado, simulando atualização');
        setClassSettings(prev => prev ? { ...prev, ...settings, updated_at: new Date().toISOString() } : null);
        return settings;
      }
      
      console.log('📝 Atualizando configurações de aulas no Supabase');
      const updatedSettings = await classesService.updateSettings(settings);
      
      if (updatedSettings) {
        console.log('✅ Configurações de aulas atualizadas com sucesso no Supabase');
        await fetchClassSettings(true);
        dataSyncManager.notify();
        return updatedSettings;
      } else {
        throw new Error('Falha ao atualizar configurações de aulas no Supabase');
      }
    } catch (err) {
      console.error('❌ Erro ao atualizar configurações de aulas:', err);
      
      // Fallback: atualizar localmente
      console.log('📊 Atualizando configurações de aulas localmente devido a erro');
      setClassSettings(prev => prev ? { ...prev, ...settings, updated_at: new Date().toISOString() } : null);
      
      throw err;
    }
  };

  return {
    classSettings,
    loading,
    error,
    updateClassSettings,
    refetch: fetchClassSettings
  };
};

// Hook para planos de aula
export const useClassPlans = () => {
  const [classPlans, setClassPlans] = useState<ClassPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const forceUpdate = useForceUpdate();

  const fetchClassPlans = useCallback(async (force = false) => {
    try {
      if (force) console.log('🔄 FORÇANDO atualização de planos de aula...');
      setLoading(true);
      setError(null);
      
      if (!isSupabaseConfigured()) {
        console.error('❌ Supabase não configurado - usando dados padrão');
        setClassPlans(DEFAULT_DATA.classPlans);
        setError('Supabase não configurado');
        setLoading(false);
        return;
      }
      
      console.log('🌐 Buscando planos de aula do Supabase...');
      const data = await classesService.getPlans();
      
      if (data && data.length > 0) {
        setClassPlans(data);
        console.log('📊 Planos de aula carregados do Supabase:', data.length);
      } else {
        console.log('📊 Nenhum plano de aula encontrado no Supabase, usando dados padrão');
        setClassPlans(DEFAULT_DATA.classPlans);
      }
      
      forceUpdate();
    } catch (err) {
      console.error('❌ Erro ao carregar planos de aula:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar planos de aula');
      console.log('📊 Usando dados padrão devido a erro');
      setClassPlans(DEFAULT_DATA.classPlans);
    } finally {
      setLoading(false);
    }
  }, [forceUpdate]);

  useEffect(() => {
    fetchClassPlans();
    
    const unsubscribe = dataSyncManager.subscribe(() => {
      console.log('🔄 Recebido evento de sync - atualizando planos de aula...');
      fetchClassPlans(true);
    });
    
    return unsubscribe;
  }, [fetchClassPlans]);

  const addClassPlan = async (plan: Omit<ClassPlan, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (!isSupabaseConfigured()) {
        console.log('❌ Supabase não configurado, simulando adição');
        const newPlan = {
          id: Date.now(),
          ...plan,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setClassPlans(prev => [...prev, newPlan]);
        return newPlan;
      }
      
      console.log('➕ Adicionando plano de aula no Supabase:', plan.title);
      const newPlan = await classesService.createPlan(plan);
      
      if (newPlan) {
        console.log('✅ Plano de aula adicionado com sucesso no Supabase');
        await fetchClassPlans(true);
        dataSyncManager.notify();
        return newPlan;
      } else {
        throw new Error('Falha ao criar plano de aula no Supabase');
      }
    } catch (err) {
      console.error('❌ Erro ao adicionar plano de aula:', err);
      
      // Fallback: adicionar localmente
      console.log('📊 Adicionando plano de aula localmente devido a erro');
      const newPlan = {
        id: Date.now(),
        ...plan,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setClassPlans(prev => [...prev, newPlan]);
      
      throw err;
    }
  };

  const updateClassPlan = async (id: number, plan: Partial<ClassPlan>) => {
    try {
      if (!isSupabaseConfigured()) {
        console.log('❌ Supabase não configurado, simulando atualização');
        setClassPlans(prev => 
          prev.map(p => p.id === id ? { ...p, ...plan, updated_at: new Date().toISOString() } : p)
        );
        return { id, ...plan };
      }
      
      console.log('📝 Atualizando plano de aula no Supabase:', id);
      const updatedPlan = await classesService.updatePlan(id, plan);
      
      if (updatedPlan) {
        console.log('✅ Plano de aula atualizado com sucesso no Supabase');
        await fetchClassPlans(true);
        dataSyncManager.notify();
        return updatedPlan;
      } else {
        throw new Error('Falha ao atualizar plano de aula no Supabase');
      }
    } catch (err) {
      console.error('❌ Erro ao atualizar plano de aula:', err);
      
      // Fallback: atualizar localmente
      console.log('📊 Atualizando plano de aula localmente devido a erro');
      setClassPlans(prev => 
        prev.map(p => p.id === id ? { ...p, ...plan, updated_at: new Date().toISOString() } : p)
      );
      
      throw err;
    }
  };

  const deleteClassPlan = async (id: number) => {
    try {
      if (!isSupabaseConfigured()) {
        console.log('❌ Supabase não configurado, simulando exclusão');
        setClassPlans(prev => prev.filter(p => p.id !== id));
        return true;
      }
      
      console.log('🗑️ Deletando plano de aula no Supabase:', id);
      await classesService.deletePlan(id);
      console.log('✅ Plano de aula deletado com sucesso no Supabase');
      await fetchClassPlans(true);
      dataSyncManager.notify();
      return true;
    } catch (err) {
      console.error('❌ Erro ao deletar plano de aula:', err);
      
      // Fallback: deletar localmente
      console.log('📊 Deletando plano de aula localmente devido a erro');
      setClassPlans(prev => prev.filter(p => p.id !== id));
      
      throw err;
    }
  };

  return {
    classPlans,
    loading,
    error,
    addClassPlan,
    updateClassPlan,
    deleteClassPlan,
    refetch: fetchClassPlans
  };
};

// Hook para sincronização global de dados
export const useDataSync = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const syncAllData = async () => {
    try {
      setIsRefreshing(true);
      console.log('🔄 SINCRONIZAÇÃO GLOBAL INICIADA...');
      
      dataSyncManager.notify();
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('✅ Sincronização global concluída');
    } catch (error) {
      console.error('❌ Erro ao sincronizar dados:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return { syncAllData, isRefreshing };
};

// Hook simplificado para o frontend
export const useFrontendData = () => {
  const { projects } = useProjects();
  const { testimonials } = useTestimonials();
  const { talks } = useTalks();
  const { settings } = useSiteSettings();
  const { blogPosts } = useBlogPosts();
  const { classSettings } = useClassSettings();
  const { classPlans } = useClassPlans();

  const refreshAllData = useCallback(() => {
    console.log('🔄 FORÇANDO refresh TOTAL de todos os dados do frontend...');
    dataSyncManager.notify();
  }, []);

  return {
    projects,
    testimonials,
    talks,
    settings,
    blogPosts,
    classSettings,
    classPlans,
    refreshAllData
  };
};