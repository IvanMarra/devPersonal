import { useState, useEffect, useCallback } from 'react';
import { 
  projectsService, 
  testimonialsService, 
  talksService, 
  settingsService,
  Project,
  Testimonial,
  Talk,
  SiteSettings
} from '../lib/supabase';
import { isLocalMode, getMockData } from '../lib/localConfig';

// Sistema de eventos globais para sincronização FORÇADA
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

// Hook para forçar re-render quando dados mudam
const useForceUpdate = () => {
  const [, setTick] = useState(0);
  const forceUpdate = useCallback(() => {
    setTick(tick => tick + 1);
  }, []);
  return forceUpdate;
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
      
      // Se estiver em modo local, usar dados mock
      if (isLocalMode()) {
        console.log('🔄 Modo local ativo - usando dados mock para projetos');
        const mockData = getMockData();
        setProjects(mockData.projects);
        setLoading(false);
        return;
      }
      
      console.log('🔄 Buscando projetos do Supabase...');
      
      const data = await projectsService.getAll();
      console.log('✅ Projetos carregados:', data?.length || 0);
      
      if (data && data.length > 0) {
        setProjects(data);
        console.log('📊 Projetos atualizados no estado:', data.length);
      } else {
        // Fallback apenas se não houver dados no Supabase
        console.log('⚠️ Usando dados fallback para projetos');
        const mockData = getMockData();
        setProjects(mockData.projects);
      }
      
      // Forçar re-render
      forceUpdate();
    } catch (err) {
      console.error('❌ Erro ao carregar projetos:', err);
      setError('Erro ao carregar projetos');
      // Fallback para dados mock apenas em caso de erro
      const mockData = getMockData();
      setProjects(mockData.projects);
    } finally {
      setLoading(false);
    }
  }, [forceUpdate]);

  useEffect(() => {
    fetchProjects();
    
    // Inscrever-se para atualizações automáticas
    const unsubscribe = dataSyncManager.subscribe(() => {
      console.log('🔄 Recebido evento de sync - atualizando projetos...');
      fetchProjects(true);
    });
    
    return unsubscribe;
  }, [fetchProjects]);

  const addProject = async (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (isLocalMode()) {
        console.log('⚠️ Modo local - simulando adição de projeto');
        const newProject = { ...project, id: Date.now() };
        setProjects(prev => {
          const updated = [newProject, ...prev];
          console.log('📊 Projetos após adição (local):', updated.length);
          return updated;
        });
        dataSyncManager.notify();
        return newProject;
      }
      
      console.log('➕ Adicionando projeto:', project.title);
      const newProject = await projectsService.create(project);
      
      if (newProject) {
        console.log('✅ Projeto adicionado com sucesso');
        // Atualização IMEDIATA local
        setProjects(prev => {
          const updated = [newProject, ...prev];
          console.log('📊 Projetos após adição:', updated.length);
          return updated;
        });
        // Notificação GLOBAL
        dataSyncManager.notify();
        // Forçar re-render
        forceUpdate();
        return newProject;
      }
    } catch (err) {
      console.error('❌ Erro ao adicionar projeto:', err);
      throw err;
    }
  };

  const updateProject = async (id: number, project: Partial<Project>) => {
    try {
      if (isLocalMode()) {
        console.log('⚠️ Modo local - simulando atualização de projeto');
        setProjects(prev => {
          const updated = prev.map(p => p.id === id ? { ...p, ...project } : p);
          console.log('📊 Projetos após atualização (local):', updated.length);
          return updated;
        });
        dataSyncManager.notify();
        return { ...project, id } as Project;
      }
      
      console.log('📝 Atualizando projeto:', id);
      const updatedProject = await projectsService.update(id, project);
      
      if (updatedProject) {
        console.log('✅ Projeto atualizado com sucesso');
        // Atualização IMEDIATA local
        setProjects(prev => {
          const updated = prev.map(p => p.id === id ? updatedProject : p);
          console.log('📊 Projetos após atualização:', updated.length);
          return updated;
        });
        // Notificação GLOBAL
        dataSyncManager.notify();
        // Forçar re-render
        forceUpdate();
        return updatedProject;
      }
    } catch (err) {
      console.error('❌ Erro ao atualizar projeto:', err);
      throw err;
    }
  };

  const deleteProject = async (id: number) => {
    try {
      if (isLocalMode()) {
        console.log('⚠️ Modo local - simulando exclusão de projeto');
        setProjects(prev => {
          const updated = prev.filter(p => p.id !== id);
          console.log('📊 Projetos após exclusão (local):', updated.length);
          return updated;
        });
        dataSyncManager.notify();
        return;
      }
      
      console.log('🗑️ Deletando projeto:', id);
      await projectsService.delete(id);
      console.log('✅ Projeto deletado com sucesso');
      // Atualização IMEDIATA local
      setProjects(prev => {
        const updated = prev.filter(p => p.id !== id);
        console.log('📊 Projetos após exclusão:', updated.length);
        return updated;
      });
      // Notificação GLOBAL
      dataSyncManager.notify();
      // Forçar re-render
      forceUpdate();
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
      
      if (isLocalMode()) {
        console.log('🔄 Modo local ativo - usando dados mock para depoimentos');
        const mockData = getMockData();
        setTestimonials(mockData.testimonials);
        setLoading(false);
        return;
      }
      
      console.log('🔄 Buscando depoimentos do Supabase...');
      
      const data = await testimonialsService.getAll();
      console.log('✅ Depoimentos carregados:', data?.length || 0);
      
      if (data && data.length > 0) {
        setTestimonials(data);
        console.log('📊 Depoimentos atualizados no estado:', data.length);
      } else {
        console.log('⚠️ Usando dados fallback para depoimentos');
        const mockData = getMockData();
        setTestimonials(mockData.testimonials);
      }
      
      forceUpdate();
    } catch (err) {
      console.error('❌ Erro ao carregar depoimentos:', err);
      setError('Erro ao carregar depoimentos');
      const mockData = getMockData();
      setTestimonials(mockData.testimonials);
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
      if (isLocalMode()) {
        console.log('⚠️ Modo local - simulando adição de depoimento');
        const newTestimonial = { ...testimonial, id: Date.now() };
        setTestimonials(prev => {
          const updated = [newTestimonial, ...prev];
          console.log('📊 Depoimentos após adição (local):', updated.length);
          return updated;
        });
        dataSyncManager.notify();
        return newTestimonial;
      }
      
      console.log('➕ Adicionando depoimento:', testimonial.name);
      const newTestimonial = await testimonialsService.create(testimonial);
      
      if (newTestimonial) {
        console.log('✅ Depoimento adicionado com sucesso');
        setTestimonials(prev => {
          const updated = [newTestimonial, ...prev];
          console.log('📊 Depoimentos após adição:', updated.length);
          return updated;
        });
        dataSyncManager.notify();
        forceUpdate();
        return newTestimonial;
      }
    } catch (err) {
      console.error('❌ Erro ao adicionar depoimento:', err);
      throw err;
    }
  };

  const updateTestimonial = async (id: number, testimonial: Partial<Testimonial>) => {
    try {
      if (isLocalMode()) {
        console.log('⚠️ Modo local - simulando atualização de depoimento');
        setTestimonials(prev => {
          const updated = prev.map(t => t.id === id ? { ...t, ...testimonial } : t);
          console.log('📊 Depoimentos após atualização (local):', updated.length);
          return updated;
        });
        dataSyncManager.notify();
        return { ...testimonial, id } as Testimonial;
      }
      
      console.log('📝 Atualizando depoimento:', id);
      const updatedTestimonial = await testimonialsService.update(id, testimonial);
      
      if (updatedTestimonial) {
        console.log('✅ Depoimento atualizado com sucesso');
        setTestimonials(prev => {
          const updated = prev.map(t => t.id === id ? updatedTestimonial : t);
          console.log('📊 Depoimentos após atualização:', updated.length);
          return updated;
        });
        dataSyncManager.notify();
        forceUpdate();
        return updatedTestimonial;
      }
    } catch (err) {
      console.error('❌ Erro ao atualizar depoimento:', err);
      throw err;
    }
  };

  const deleteTestimonial = async (id: number) => {
    try {
      if (isLocalMode()) {
        console.log('⚠️ Modo local - simulando exclusão de depoimento');
        setTestimonials(prev => {
          const updated = prev.filter(t => t.id !== id);
          console.log('📊 Depoimentos após exclusão (local):', updated.length);
          return updated;
        });
        dataSyncManager.notify();
        return;
      }
      
      console.log('🗑️ Deletando depoimento:', id);
      await testimonialsService.delete(id);
      console.log('✅ Depoimento deletado com sucesso');
      setTestimonials(prev => {
        const updated = prev.filter(t => t.id !== id);
        console.log('📊 Depoimentos após exclusão:', updated.length);
        return updated;
      });
      dataSyncManager.notify();
      forceUpdate();
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
      
      if (isLocalMode()) {
        console.log('🔄 Modo local ativo - usando dados mock para palestras');
        const mockData = getMockData();
        setTalks(mockData.talks);
        setLoading(false);
        return;
      }
      
      console.log('🔄 Buscando palestras do Supabase...');
      
      const data = await talksService.getAll();
      console.log('✅ Palestras carregadas:', data?.length || 0);
      
      if (data && data.length > 0) {
        setTalks(data);
        console.log('📊 Palestras atualizadas no estado:', data.length);
      } else {
        console.log('⚠️ Usando dados fallback para palestras');
        const mockData = getMockData();
        setTalks(mockData.talks);
      }
      
      forceUpdate();
    } catch (err) {
      console.error('❌ Erro ao carregar palestras:', err);
      setError('Erro ao carregar palestras');
      const mockData = getMockData();
      setTalks(mockData.talks);
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
      if (isLocalMode()) {
        console.log('⚠️ Modo local - simulando adição de palestra');
        const newTalk = { ...talk, id: Date.now() };
        setTalks(prev => {
          const updated = [newTalk, ...prev];
          console.log('📊 Palestras após adição (local):', updated.length);
          return updated;
        });
        dataSyncManager.notify();
        return newTalk;
      }
      
      console.log('➕ Adicionando palestra:', talk.title);
      const newTalk = await talksService.create(talk);
      
      if (newTalk) {
        console.log('✅ Palestra adicionada com sucesso');
        setTalks(prev => {
          const updated = [newTalk, ...prev];
          console.log('📊 Palestras após adição:', updated.length);
          return updated;
        });
        dataSyncManager.notify();
        forceUpdate();
        return newTalk;
      }
    } catch (err) {
      console.error('❌ Erro ao adicionar palestra:', err);
      throw err;
    }
  };

  const updateTalk = async (id: number, talk: Partial<Talk>) => {
    try {
      if (isLocalMode()) {
        console.log('⚠️ Modo local - simulando atualização de palestra');
        setTalks(prev => {
          const updated = prev.map(t => t.id === id ? { ...t, ...talk } : t);
          console.log('📊 Palestras após atualização (local):', updated.length);
          return updated;
        });
        dataSyncManager.notify();
        return { ...talk, id } as Talk;
      }
      
      console.log('📝 Atualizando palestra:', id);
      const updatedTalk = await talksService.update(id, talk);
      
      if (updatedTalk) {
        console.log('✅ Palestra atualizada com sucesso');
        setTalks(prev => {
          const updated = prev.map(t => t.id === id ? updatedTalk : t);
          console.log('📊 Palestras após atualização:', updated.length);
          return updated;
        });
        dataSyncManager.notify();
        forceUpdate();
        return updatedTalk;
      }
    } catch (err) {
      console.error('❌ Erro ao atualizar palestra:', err);
      throw err;
    }
  };

  const deleteTalk = async (id: number) => {
    try {
      if (isLocalMode()) {
        console.log('⚠️ Modo local - simulando exclusão de palestra');
        setTalks(prev => {
          const updated = prev.filter(t => t.id !== id);
          console.log('📊 Palestras após exclusão (local):', updated.length);
          return updated;
        });
        dataSyncManager.notify();
        return;
      }
      
      console.log('🗑️ Deletando palestra:', id);
      await talksService.delete(id);
      console.log('✅ Palestra deletada com sucesso');
      setTalks(prev => {
        const updated = prev.filter(t => t.id !== id);
        console.log('📊 Palestras após exclusão:', updated.length);
        return updated;
      });
      dataSyncManager.notify();
      forceUpdate();
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
      
      if (isLocalMode()) {
        console.log('🔄 Modo local ativo - usando configurações mock');
        const mockData = getMockData();
        setSettings(mockData.settings);
        setLoading(false);
        return;
      }
      
      console.log('🔄 Buscando configurações do Supabase...');
      
      const data = await settingsService.get();
      console.log('✅ Configurações carregadas:', data ? 'Sim' : 'Não');
      
      if (data) {
        setSettings(data);
        console.log('📊 Configurações atualizadas no estado');
      } else {
        console.log('⚠️ Usando configurações fallback');
        const mockData = getMockData();
        setSettings(mockData.settings);
      }
      
      forceUpdate();
    } catch (err) {
      console.error('❌ Erro ao carregar configurações:', err);
      setError('Erro ao carregar configurações');
      const mockData = getMockData();
      setSettings(mockData.settings);
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
      if (isLocalMode()) {
        console.log('⚠️ Modo local - simulando atualização de configurações');
        const updated = { ...settings, ...newSettings } as SiteSettings;
        setSettings(updated);
        dataSyncManager.notify();
        return updated;
      }
      
      console.log('📝 Atualizando configurações do site');
      const updatedSettings = await settingsService.update(newSettings);
      
      if (updatedSettings) {
        console.log('✅ Configurações atualizadas com sucesso');
        setSettings(updatedSettings);
        dataSyncManager.notify();
        forceUpdate();
        return updatedSettings;
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
      
      // Notificar TODOS os componentes para atualizar IMEDIATAMENTE
      dataSyncManager.notify();
      
      // Aguardar um pouco para garantir que todos os componentes processaram
      await new Promise(resolve => setTimeout(resolve, 500));
      
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