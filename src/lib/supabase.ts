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

// Create a mock client when environment variables are missing
const createMockClient = () => ({
  from: () => ({
    select: () => ({ 
      order: () => Promise.resolve({ 
        data: null, 
        error: new Error('Supabase não configurado. Configure as variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.') 
      }),
      single: () => Promise.resolve({ 
        data: null, 
        error: new Error('Supabase não configurado. Configure as variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.') 
      }),
      limit: () => Promise.resolve({ 
        data: null, 
        error: new Error('Supabase não configurado. Configure as variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.') 
      })
    }),
    insert: () => ({ 
      select: () => ({ 
        single: () => Promise.resolve({ 
          data: null, 
          error: new Error('Supabase não configurado. Configure as variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.') 
        }) 
      }) 
    }),
    update: () => ({ 
      eq: () => ({ 
        select: () => ({ 
          single: () => Promise.resolve({ 
            data: null, 
            error: new Error('Supabase não configurado. Configure as variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.') 
          }) 
        }) 
      }) 
    }),
    delete: () => ({ 
      eq: () => Promise.resolve({ 
        error: new Error('Supabase não configurado. Configure as variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.') 
      }) 
    })
  }),
  storage: {
    from: () => ({
      upload: () => Promise.resolve({ 
        data: null, 
        error: new Error('Supabase não configurado. Configure as variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.') 
      }),
      getPublicUrl: () => ({ 
        data: { publicUrl: '' } 
      }),
      listBuckets: () => Promise.resolve({
        data: null,
        error: new Error('Supabase não configurado. Configure as variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.')
      }),
      remove: () => Promise.resolve({
        error: new Error('Supabase não configurado. Configure as variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.')
      })
    })
  }
});

export const supabase = hasSupabaseConfig 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockClient();

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
    return await operation();
  } catch (error) {
    console.warn('Supabase operation failed:', error);
    return fallbackValue;
  }
};

// Database functions with better error handling
export const projectsService = {
  async getAll() {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.warn('Erro ao buscar projetos do Supabase:', error.message);
        return null;
      }
      return data;
    }, null);
  },

  async create(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from('projects')
        .insert([project])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    });
  },

  async update(id: number, project: Partial<Project>) {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from('projects')
        .update(project)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    });
  },

  async delete(id: number) {
    return withErrorHandling(async () => {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    });
  }
};

export const testimonialsService = {
  async getAll() {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.warn('Erro ao buscar depoimentos do Supabase:', error.message);
        return null;
      }
      return data;
    }, null);
  },

  async create(testimonial: Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>) {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .insert([testimonial])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    });
  },

  async update(id: number, testimonial: Partial<Testimonial>) {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .update(testimonial)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    });
  },

  async delete(id: number) {
    return withErrorHandling(async () => {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    });
  }
};

export const talksService = {
  async getAll() {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from('talks')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.warn('Erro ao buscar palestras do Supabase:', error.message);
        return null;
      }
      return data;
    }, null);
  },

  async create(talk: Omit<Talk, 'id' | 'created_at' | 'updated_at'>) {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from('talks')
        .insert([talk])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    });
  },

  async update(id: number, talk: Partial<Talk>) {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from('talks')
        .update(talk)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    });
  },

  async delete(id: number) {
    return withErrorHandling(async () => {
      const { error } = await supabase
        .from('talks')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    });
  }
};

export const settingsService = {
  async get() {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 1)
        .single();
      
      if (error) {
        console.warn('Erro ao buscar configurações do Supabase:', error.message);
        return null;
      }
      return data;
    }, null);
  },

  async update(settings: Partial<SiteSettings>) {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .update(settings)
        .eq('id', 1)
        .select()
        .single();
      
      if (error) throw error;
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

      const { data, error } = await supabase.storage
        .from('deviem-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('deviem-images')
        .getPublicUrl(fileName);

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

      const { error } = await supabase.storage
        .from('deviem-images')
        .remove([filePath]);

      if (error) throw error;
      return true;
    });
  }
};

// Utility function to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return hasSupabaseConfig;
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
  if (!hasSupabaseConfig) {
    return { success: false, error: 'Supabase não configurado' };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const { data, error } = await supabase
      .from('site_settings')
      .select('id')
      .limit(1);

    clearTimeout(timeoutId);

    if (error) {
      return { success: false, error: error.message };
    }

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