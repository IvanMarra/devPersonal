import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Verificar se estamos em produção e se as variáveis estão definidas e válidas
const isProduction = import.meta.env.PROD;
const hasSupabaseConfig = !!(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('your_actual_supabase_url_here') &&
  !supabaseAnonKey.includes('your_actual_supabase_anon_key_here')
);

// Log para debug (apenas em desenvolvimento)
if (!isProduction) {
  console.log('🔧 Configuração Supabase:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
    isProduction,
    url: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'não configurada'
  });
}

// Criar cliente Supabase com configurações otimizadas
export const supabase = hasSupabaseConfig 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false, // Não persistir sessão para operações anônimas
        autoRefreshToken: false,
        detectSessionInUrl: false
      },
      global: {
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
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

// Enhanced error handling wrapper
const withErrorHandling = async <T>(operation: () => Promise<T>, fallbackValue: T | null = null): Promise<T | null> => {
  try {
    if (!supabase) {
      console.warn('⚠️ Supabase não configurado, retornando fallback');
      return fallbackValue;
    }
    return await operation();
  } catch (error) {
    console.warn('⚠️ Operação Supabase falhou:', error);
    return fallbackValue;
  }
};

// Database functions with better error handling
export const projectsService = {
  async getAll() {
    return withErrorHandling(async () => {
      console.log('🔍 Buscando projetos do Supabase...');
      const { data, error } = await supabase!
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Erro ao buscar projetos:', error);
        throw error;
      }
      
      console.log('✅ Projetos encontrados:', data?.length || 0);
      return data || [];
    }, []);
  },

  async create(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) {
    return withErrorHandling(async () => {
      console.log('➕ Criando projeto no Supabase:', project.title);
      
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
    return withErrorHandling(async () => {
      console.log('📝 Atualizando projeto no Supabase:', id);
      
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
    return withErrorHandling(async () => {
      console.log('🗑️ Deletando projeto no Supabase:', id);
      
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
    return withErrorHandling(async () => {
      console.log('🔍 Buscando depoimentos do Supabase...');
      const { data, error } = await supabase!
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Erro ao buscar depoimentos:', error);
        throw error;
      }
      
      console.log('✅ Depoimentos encontrados:', data?.length || 0);
      return data || [];
    }, []);
  },

  async create(testimonial: Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>) {
    return withErrorHandling(async () => {
      console.log('➕ Criando depoimento no Supabase:', testimonial.name);
      
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
    return withErrorHandling(async () => {
      console.log('📝 Atualizando depoimento no Supabase:', id);
      
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
    return withErrorHandling(async () => {
      console.log('🗑️ Deletando depoimento no Supabase:', id);
      
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
    return withErrorHandling(async () => {
      console.log('🔍 Buscando palestras do Supabase...');
      const { data, error } = await supabase!
        .from('talks')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Erro ao buscar palestras:', error);
        throw error;
      }
      
      console.log('✅ Palestras encontradas:', data?.length || 0);
      return data || [];
    }, []);
  },

  async create(talk: Omit<Talk, 'id' | 'created_at' | 'updated_at'>) {
    return withErrorHandling(async () => {
      console.log('➕ Criando palestra no Supabase:', talk.title);
      
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
    return withErrorHandling(async () => {
      console.log('📝 Atualizando palestra no Supabase:', id);
      
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
    return withErrorHandling(async () => {
      console.log('🗑️ Deletando palestra no Supabase:', id);
      
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
    return withErrorHandling(async () => {
      console.log('🔍 Buscando configurações do Supabase...');
      const { data, error } = await supabase!
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
    }, null);
  },

  async update(settings: Partial<SiteSettings>) {
    return withErrorHandling(async () => {
      console.log('📝 Atualizando configurações no Supabase');
      
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

// Storage functions with better error handling
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
      // Extract file path from URL
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

// Utility function to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return hasSupabaseConfig && !!supabase;
};

// Function to get environment info
export const getEnvironmentInfo = () => {
  return {
    isProduction,
    hasSupabaseConfig,
    supabaseUrl: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'não configurada',
    hasAnonKey: !!supabaseAnonKey
  };
};

// Test connection function with timeout
export const testSupabaseConnection = async (timeoutMs: number = 5000): Promise<{ success: boolean; error?: string }> => {
  if (!hasSupabaseConfig || !supabase) {
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