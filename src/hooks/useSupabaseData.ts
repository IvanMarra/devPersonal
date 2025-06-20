import { useState, useEffect, useCallback } from 'react';
import { 
  projectsService, 
  testimonialsService, 
  talksService, 
  settingsService,
  Project,
  Testimonial,
  Talk,
  SiteSettings,
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
  projects: [],
  testimonials: [],
  talks: [],
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
      
      if (data) {
        setProjects(data);
        console.log('📊 Projetos carregados do Supabase:', data.length);
      } else {
        setProjects([]);
        console.log('📊 Nenhum projeto encontrado no Supabase');
      }
      
      forceUpdate();
    } catch (err) {
      console.error('❌ Erro ao carregar projetos:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar projetos');
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
        throw new Error('Supabase não configurado');
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
      throw err;
    }
  };

  const updateProject = async (id: number, project: Partial<Project>) => {
    try {
      if (!isSupabaseConfigured()) {
        throw new Error('Supabase não configurado');
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
      throw err;
    }
  };

  const deleteProject = async (id: number) => {
    try {
      if (!isSupabaseConfigured()) {
        throw new Error('Supabase não configurado');
      }
      
      console.log('🗑️ Deletando projeto no Supabase:', id);
      await projectsService.delete(id);
      console.log('✅ Projeto deletado com sucesso no Supabase');
      await fetchProjects(true);
      dataSyncManager.notify();
    } catch (err) {
      console.error('❌ Erro ao deletar projeto:', err);
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
      
      if (data) {
        setTestimonials(data);
        console.log('📊 Depoimentos carregados do Supabase:', data.length);
      } else {
        setTestimonials([]);
        console.log('📊 Nenhum depoimento encontrado no Supabase');
      }
      
      forceUpdate();
    } catch (err) {
      console.error('❌ Erro ao carregar depoimentos:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar depoimentos');
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
        throw new Error('Supabase não configurado');
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
      throw err;
    }
  };

  const updateTestimonial = async (id: number, testimonial: Partial<Testimonial>) => {
    try {
      if (!isSupabaseConfigured()) {
        throw new Error('Supabase não configurado');
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
      throw err;
    }
  };

  const deleteTestimonial = async (id: number) => {
    try {
      if (!isSupabaseConfigured()) {
        throw new Error('Supabase não configurado');
      }
      
      console.log('🗑️ Deletando depoimento no Supabase:', id);
      await testimonialsService.delete(id);
      console.log('✅ Depoimento deletado com sucesso no Supabase');
      await fetchTestimonials(true);
      dataSyncManager.notify();
    } catch (err) {
      console.error('❌ Erro ao deletar depoimento:', err);
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
      
      if (data) {
        setTalks(data);
        console.log('📊 Palestras carregadas do Supabase:', data.length);
      } else {
        setTalks([]);
        console.log('📊 Nenhuma palestra encontrada no Supabase');
      }
      
      forceUpdate();
    } catch (err) {
      console.error('❌ Erro ao carregar palestras:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar palestras');
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
        throw new Error('Supabase não configurado');
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
      throw err;
    }
  };

  const updateTalk = async (id: number, talk: Partial<Talk>) => {
    try {
      if (!isSupabaseConfigured()) {
        throw new Error('Supabase não configurado');
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
      throw err;
    }
  };

  const deleteTalk = async (id: number) => {
    try {
      if (!isSupabaseConfigured()) {
        throw new Error('Supabase não configurado');
      }
      
      console.log('🗑️ Deletando palestra no Supabase:', id);
      await talksService.delete(id);
      console.log('✅ Palestra deletada com sucesso no Supabase');
      await fetchTalks(true);
      dataSyncManager.notify();
    } catch (err) {
      console.error('❌ Erro ao deletar palestra:', err);
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
        setSettings(DEFAULT_DATA.settings);
        console.log('📊 Usando configurações padrão');
      }
      
      forceUpdate();
    } catch (err) {
      console.error('❌ Erro ao carregar configurações:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar configurações');
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
        throw new Error('Supabase não configurado');
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

  const refreshAllData = useCallback(() => {
    console.log('🔄 FORÇANDO refresh TOTAL de todos os dados do frontend...');
    dataSyncManager.notify();
  }, []);

  return {
    projects,
    testimonials,
    talks,
    settings,
    refreshAllData
  };
};