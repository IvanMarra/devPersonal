import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Log das variáveis para debug
console.log('🔧 Variáveis de ambiente:', {
  url: supabaseUrl,
  hasKey: !!supabaseAnonKey,
  keyLength: supabaseAnonKey?.length || 0
});

// Verificação RIGOROSA das credenciais
const hasValidCredentials = !!(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('https://') &&
  supabaseUrl.includes('.supabase.co') &&
  supabaseAnonKey.startsWith('eyJ') &&
  supabaseAnonKey.length > 100
);

console.log('✅ Credenciais válidas:', hasValidCredentials);

// Criar cliente Supabase SIMPLIFICADO
export const supabase = hasValidCredentials 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
      },
      global: {
        headers: {
          'X-Client-Info': 'deviem-portfolio'
        }
      }
    })
  : null;

// Types for our database tables
export interface Project {
  id: number;
  title: string;
  description: string;
  tech: string[];
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  text: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Talk {
  id: number;
  title: string;
  description: string;
  tags: string[];
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SiteSettings {
  id: number;
  site_title: string;
  site_description: string;
  hero_title: string;
  hero_subtitle: string;
  about_text: string;
  skills: string[];
  profile_image_url?: string;
  updated_at?: string;
}

// SISTEMA DE AUTENTICAÇÃO SIMPLIFICADO
export const authenticateAdmin = async (username: string, password: string) => {
  try {
    console.log('🔐 Autenticando admin...');
    
    if (username === 'deviem_admin' && password === 'DevIem2024@Secure!') {
      const session = {
        access_token: 'admin_authenticated_' + Date.now(),
        user: { id: 'admin', email: 'admin@deviem.com' }
      };
      
      localStorage.setItem('deviem_admin_token', 'authenticated');
      localStorage.setItem('deviem_admin_session', Date.now().toString());
      localStorage.setItem('supabase_admin_session', JSON.stringify(session));
      
      console.log('✅ Admin autenticado com sucesso');
      return session;
    } else {
      throw new Error('Credenciais inválidas');
    }
  } catch (error) {
    console.error('❌ Erro na autenticação:', error);
    throw error;
  }
};

export const isAdminAuthenticated = () => {
  const token = localStorage.getItem('deviem_admin_token');
  const session = localStorage.getItem('deviem_admin_session');
  
  if (token === 'authenticated' && session) {
    // Verificar se a sessão não expirou (24 horas)
    const sessionTime = parseInt(session);
    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000;
    
    if (now - sessionTime < twentyFourHours) {
      return true;
    } else {
      // Sessão expirada, limpar
      localStorage.removeItem('deviem_admin_token');
      localStorage.removeItem('deviem_admin_session');
      localStorage.removeItem('supabase_admin_session');
      return false;
    }
  }
  
  return false;
};

export const logoutAdmin = () => {
  console.log('🚪 Fazendo logout completo...');
  
  // Limpar TODOS os dados de sessão
  localStorage.removeItem('deviem_admin_token');
  localStorage.removeItem('deviem_admin_session');
  localStorage.removeItem('supabase_admin_session');
  
  // Limpar qualquer cache do Supabase
  if (supabase?.auth) {
    try {
      supabase.auth.signOut();
    } catch (error) {
      console.error('Erro ao fazer signOut do Supabase:', error);
    }
  }
  
  console.log('✅ Logout completo realizado');
  
  // Forçar reload da página para garantir limpeza total
  setTimeout(() => {
    window.location.href = '/';
  }, 100);
};

// Enhanced error handling wrapper
const withErrorHandling = async <T>(operation: () => Promise<T>): Promise<T | null> => {
  try {
    if (!supabase) {
      console.error('❌ Supabase não configurado');
      throw new Error('Supabase não configurado');
    }
    
    // Verificar autenticação para operações de escrita
    if (!isAdminAuthenticated()) {
      console.error('❌ Usuário não autenticado para esta operação');
      throw new Error('Usuário não autenticado para esta operação');
    }
    
    return await operation();
  } catch (error) {
    console.error('❌ Erro na operação Supabase:', error);
    throw error;
  }
};

// Database functions - SIMPLIFICADAS E CORRIGIDAS
export const projectsService = {
  async getAll() {
    console.log('🔍 Buscando projetos do Supabase...');
    try {
      if (!supabase) {
        console.error('❌ Supabase não configurado');
        throw new Error('Supabase não configurado');
      }
      
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Erro ao buscar projetos:', error);
        throw error;
      }
      
      console.log('✅ Projetos encontrados:', data?.length || 0);
      return data || [];
    } catch (error) {
      console.error('❌ Erro ao buscar projetos:', error);
      throw error;
    }
  },

  async create(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) {
    console.log('➕ Criando projeto no Supabase:', project.title);
    
    return withErrorHandling(async () => {
      // Tentar usar RPC para bypass de RLS
      try {
        console.log('🔍 Tentando usar RPC para criar projeto...');
        const { data: rpcData, error: rpcError } = await supabase!.rpc('create_project', {
          p_title: project.title,
          p_description: project.description,
          p_tech: project.tech,
          p_image_url: project.image_url
        });
        
        if (!rpcError && rpcData) {
          console.log('✅ Projeto criado com sucesso via RPC:', rpcData);
          return rpcData;
        }
        
        console.log('⚠️ RPC falhou, tentando método padrão...');
      } catch (rpcErr) {
        console.log('⚠️ Erro ao usar RPC:', rpcErr);
      }
      
      // Método padrão
      const { data, error } = await supabase!
        .from('projects')
        .insert([{
          title: project.title,
          description: project.description,
          tech: project.tech,
          image_url: project.image_url
        }])
        .select()
        .single();
      
      if (error) {
        console.error('❌ Erro ao criar projeto:', error);
        throw error;
      }
      
      console.log('✅ Projeto criado com sucesso:', data);
      return data;
    });
  },

  async update(id: number, project: Partial<Project>) {
    console.log('📝 Atualizando projeto no Supabase:', id);
    
    return withErrorHandling(async () => {
      // Tentar usar RPC para bypass de RLS
      try {
        console.log('🔍 Tentando usar RPC para atualizar projeto...');
        const { data: rpcData, error: rpcError } = await supabase!.rpc('update_project', {
          p_id: id,
          p_title: project.title,
          p_description: project.description,
          p_tech: project.tech,
          p_image_url: project.image_url
        });
        
        if (!rpcError && rpcData) {
          console.log('✅ Projeto atualizado com sucesso via RPC:', rpcData);
          return rpcData;
        }
        
        console.log('⚠️ RPC falhou, tentando método padrão...');
      } catch (rpcErr) {
        console.log('⚠️ Erro ao usar RPC:', rpcErr);
      }
      
      // Método padrão
      const updateData: any = {};
      if (project.title !== undefined) updateData.title = project.title;
      if (project.description !== undefined) updateData.description = project.description;
      if (project.tech !== undefined) updateData.tech = project.tech;
      if (project.image_url !== undefined) updateData.image_url = project.image_url;
      
      const { data, error } = await supabase!
        .from('projects')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('❌ Erro ao atualizar projeto:', error);
        throw error;
      }
      
      console.log('✅ Projeto atualizado com sucesso:', data);
      return data;
    });
  },

  async delete(id: number) {
    console.log('🗑️ Deletando projeto no Supabase:', id);
    
    return withErrorHandling(async () => {
      // Tentar usar RPC para bypass de RLS
      try {
        console.log('🔍 Tentando usar RPC para deletar projeto...');
        const { data: rpcData, error: rpcError } = await supabase!.rpc('delete_project', {
          p_id: id
        });
        
        if (!rpcError && rpcData) {
          console.log('✅ Projeto deletado com sucesso via RPC');
          return true;
        }
        
        console.log('⚠️ RPC falhou, tentando método padrão...');
      } catch (rpcErr) {
        console.log('⚠️ Erro ao usar RPC:', rpcErr);
      }
      
      // Método padrão
      const { error } = await supabase!
        .from('projects')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('❌ Erro ao deletar projeto:', error);
        throw error;
      }
      
      console.log('✅ Projeto deletado com sucesso');
      return true;
    });
  }
};

export const testimonialsService = {
  async getAll() {
    console.log('🔍 Buscando depoimentos do Supabase...');
    try {
      if (!supabase) {
        console.error('❌ Supabase não configurado');
        throw new Error('Supabase não configurado');
      }
      
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Erro ao buscar depoimentos:', error);
        throw error;
      }
      
      console.log('✅ Depoimentos encontrados:', data?.length || 0);
      return data || [];
    } catch (error) {
      console.error('❌ Erro ao buscar depoimentos:', error);
      throw error;
    }
  },

  async create(testimonial: Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>) {
    console.log('➕ Criando depoimento no Supabase:', testimonial.name);
    
    return withErrorHandling(async () => {
      const { data, error } = await supabase!
        .from('testimonials')
        .insert([{
          name: testimonial.name,
          role: testimonial.role,
          text: testimonial.text,
          avatar_url: testimonial.avatar_url
        }])
        .select()
        .single();
      
      if (error) {
        console.error('❌ Erro ao criar depoimento:', error);
        throw error;
      }
      
      console.log('✅ Depoimento criado com sucesso:', data);
      return data;
    });
  },

  async update(id: number, testimonial: Partial<Testimonial>) {
    console.log('📝 Atualizando depoimento no Supabase:', id);
    
    return withErrorHandling(async () => {
      const updateData: any = {};
      if (testimonial.name !== undefined) updateData.name = testimonial.name;
      if (testimonial.role !== undefined) updateData.role = testimonial.role;
      if (testimonial.text !== undefined) updateData.text = testimonial.text;
      if (testimonial.avatar_url !== undefined) updateData.avatar_url = testimonial.avatar_url;
      
      const { data, error } = await supabase!
        .from('testimonials')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('❌ Erro ao atualizar depoimento:', error);
        throw error;
      }
      
      console.log('✅ Depoimento atualizado com sucesso:', data);
      return data;
    });
  },

  async delete(id: number) {
    console.log('🗑️ Deletando depoimento no Supabase:', id);
    
    return withErrorHandling(async () => {
      const { error } = await supabase!
        .from('testimonials')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('❌ Erro ao deletar depoimento:', error);
        throw error;
      }
      
      console.log('✅ Depoimento deletado com sucesso');
      return true;
    });
  }
};

export const talksService = {
  async getAll() {
    console.log('🔍 Buscando palestras do Supabase...');
    try {
      if (!supabase) {
        console.error('❌ Supabase não configurado');
        throw new Error('Supabase não configurado');
      }
      
      const { data, error } = await supabase
        .from('talks')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Erro ao buscar palestras:', error);
        throw error;
      }
      
      console.log('✅ Palestras encontradas:', data?.length || 0);
      return data || [];
    } catch (error) {
      console.error('❌ Erro ao buscar palestras:', error);
      throw error;
    }
  },

  async create(talk: Omit<Talk, 'id' | 'created_at' | 'updated_at'>) {
    console.log('➕ Criando palestra no Supabase:', talk.title);
    
    return withErrorHandling(async () => {
      const { data, error } = await supabase!
        .from('talks')
        .insert([{
          title: talk.title,
          description: talk.description,
          tags: talk.tags,
          image_url: talk.image_url
        }])
        .select()
        .single();
      
      if (error) {
        console.error('❌ Erro ao criar palestra:', error);
        throw error;
      }
      
      console.log('✅ Palestra criada com sucesso:', data);
      return data;
    });
  },

  async update(id: number, talk: Partial<Talk>) {
    console.log('📝 Atualizando palestra no Supabase:', id);
    
    return withErrorHandling(async () => {
      const updateData: any = {};
      if (talk.title !== undefined) updateData.title = talk.title;
      if (talk.description !== undefined) updateData.description = talk.description;
      if (talk.tags !== undefined) updateData.tags = talk.tags;
      if (talk.image_url !== undefined) updateData.image_url = talk.image_url;
      
      const { data, error } = await supabase!
        .from('talks')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('❌ Erro ao atualizar palestra:', error);
        throw error;
      }
      
      console.log('✅ Palestra atualizada com sucesso:', data);
      return data;
    });
  },

  async delete(id: number) {
    console.log('🗑️ Deletando palestra no Supabase:', id);
    
    return withErrorHandling(async () => {
      const { error } = await supabase!
        .from('talks')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('❌ Erro ao deletar palestra:', error);
        throw error;
      }
      
      console.log('✅ Palestra deletada com sucesso');
      return true;
    });
  }
};

export const settingsService = {
  async get() {
    console.log('🔍 Buscando configurações do Supabase...');
    try {
      if (!supabase) {
        console.error('❌ Supabase não configurado');
        throw new Error('Supabase não configurado');
      }
      
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 1)
        .single();
      
      if (error) {
        console.error('❌ Erro ao buscar configurações:', error);
        throw error;
      }
      
      console.log('✅ Configurações encontradas:', !!data);
      return data;
    } catch (error) {
      console.error('❌ Erro ao buscar configurações:', error);
      throw error;
    }
  },

  async update(settings: Partial<SiteSettings>) {
    console.log('📝 Atualizando configurações no Supabase');
    
    return withErrorHandling(async () => {
      const updateData: any = {};
      if (settings.site_title !== undefined) updateData.site_title = settings.site_title;
      if (settings.site_description !== undefined) updateData.site_description = settings.site_description;
      if (settings.hero_title !== undefined) updateData.hero_title = settings.hero_title;
      if (settings.hero_subtitle !== undefined) updateData.hero_subtitle = settings.hero_subtitle;
      if (settings.about_text !== undefined) updateData.about_text = settings.about_text;
      if (settings.skills !== undefined) updateData.skills = settings.skills;
      if (settings.profile_image_url !== undefined) updateData.profile_image_url = settings.profile_image_url;
      
      const { data, error } = await supabase!
        .from('site_settings')
        .update(updateData)
        .eq('id', 1)
        .select()
        .single();
      
      if (error) {
        console.error('❌ Erro ao atualizar configurações:', error);
        throw error;
      }
      
      console.log('✅ Configurações atualizadas com sucesso:', data);
      return data;
    });
  }
};

// Storage functions
export const storageService = {
  async uploadImage(file: File, folder: string = 'general') {
    return withErrorHandling(async () => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { data, error } = await supabase!.storage
        .from('deviem-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('❌ Erro ao fazer upload:', error);
        throw error;
      }

      const { data: { publicUrl } } = supabase!.storage
        .from('deviem-images')
        .getPublicUrl(fileName);

      console.log('✅ Upload realizado com sucesso:', publicUrl);
      return publicUrl;
    });
  },

  async deleteImage(url: string) {
    return withErrorHandling(async () => {
      const urlParts = url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const folder = urlParts[urlParts.length - 2];
      const filePath = `${folder}/${fileName}`;

      const { error } = await supabase!.storage
        .from('deviem-images')
        .remove([filePath]);

      if (error) {
        console.error('❌ Erro ao deletar imagem:', error);
        throw error;
      }
      
      console.log('✅ Imagem deletada com sucesso');
      return true;
    });
  }
};

// Utility functions
export const isSupabaseConfigured = () => {
  const result = hasValidCredentials && !!supabase;
  console.log('🔍 isSupabaseConfigured:', result);
  return result;
};

export const getEnvironmentInfo = () => {
  return {
    isProduction: import.meta.env.PROD,
    hasSupabaseConfig: hasValidCredentials,
    supabaseUrl: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'não configurada',
    hasAnonKey: !!supabaseAnonKey
  };
};

export const testSupabaseConnection = async (timeoutMs: number = 5000): Promise<{ success: boolean; error?: string }> => {
  if (!hasValidCredentials || !supabase) {
    return { success: false, error: 'Supabase não configurado' };
  }

  try {
    console.log('🔍 Testando conexão com Supabase...');
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const { data, error } = await supabase
      .from('site_settings')
      .select('id')
      .limit(1);

    clearTimeout(timeoutId);

    if (error) {
      console.error('❌ Erro na conexão:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Conexão com Supabase bem-sucedida');
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return { success: false, error: 'Timeout na conexão com Supabase' };
      }
      return { success: false, error: error.message };
    }
    return { success: false, error: 'Erro desconhecido na conexão' };
  }
};