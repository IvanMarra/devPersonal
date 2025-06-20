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
const hasValidCredentials = !!(supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('https://') &&
    supabaseUrl.includes('.supabase.co') &&
    supabaseAnonKey.startsWith('eyJ') &&
    supabaseAnonKey.length > 100);
console.log('✅ Credenciais válidas:', hasValidCredentials);
// Criar cliente Supabase com configuração para RLS
export const supabase = hasValidCredentials
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
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
// Função para autenticar usuário admin no Supabase
export const authenticateAdmin = async (username, password) => {
    if (!supabase) {
        throw new Error('Supabase não configurado');
    }
    try {
        console.log('🔐 Tentando autenticar admin no Supabase...');
        // Para este projeto, vamos usar uma autenticação simples
        // Em produção, você deveria ter usuários reais no Supabase Auth
        if (username === 'deviem_admin' && password === 'DevIem2024@Secure!') {
            // Simular sessão autenticada criando um token temporário
            const fakeSession = {
                access_token: 'admin_authenticated_' + Date.now(),
                user: {
                    id: 'admin-user-id',
                    email: 'admin@deviem.com',
                    role: 'admin'
                }
            };
            // Armazenar sessão
            localStorage.setItem('supabase_admin_session', JSON.stringify(fakeSession));
            console.log('✅ Admin autenticado com sucesso');
            return fakeSession;
        }
        else {
            throw new Error('Credenciais inválidas');
        }
    }
    catch (error) {
        console.error('❌ Erro na autenticação:', error);
        throw error;
    }
};
// Função para verificar se admin está autenticado
export const isAdminAuthenticated = () => {
    const session = localStorage.getItem('supabase_admin_session');
    if (!session)
        return false;
    try {
        const parsedSession = JSON.parse(session);
        return !!parsedSession.access_token;
    }
    catch {
        return false;
    }
};
// Função para fazer logout
export const logoutAdmin = () => {
    localStorage.removeItem('supabase_admin_session');
    localStorage.removeItem('deviem_admin_token');
    localStorage.removeItem('deviem_admin_session');
    console.log('🚪 Admin deslogado com sucesso');
};
// Enhanced error handling wrapper
const withErrorHandling = async (operation) => {
    try {
        if (!supabase) {
            console.error('❌ Supabase não configurado - cliente é null');
            throw new Error('Supabase não configurado');
        }
        return await operation();
    }
    catch (error) {
        console.error('❌ Erro na operação Supabase:', error);
        throw error;
    }
};
// Função para executar operações com bypass de RLS (usando service role)
const withServiceRole = async (operation) => {
    try {
        if (!supabase) {
            throw new Error('Supabase não configurado');
        }
        // Para operações administrativas, vamos usar headers especiais
        const adminHeaders = {
            'apikey': supabaseAnonKey,
            'Authorization': `Bearer ${supabaseAnonKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation',
            'X-Admin-Override': 'true' // Header customizado para identificar operações admin
        };
        // Temporariamente sobrescrever headers
        const originalHeaders = supabase.rest.headers;
        supabase.rest.headers = { ...originalHeaders, ...adminHeaders };
        const result = await operation();
        // Restaurar headers originais
        supabase.rest.headers = originalHeaders;
        return result;
    }
    catch (error) {
        console.error('❌ Erro na operação com service role:', error);
        throw error;
    }
};
// Database functions - COM AUTENTICAÇÃO ADMIN
export const projectsService = {
    async getAll() {
        console.log('🔍 Buscando projetos do Supabase...');
        return withErrorHandling(async () => {
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
        });
    },
    async create(project) {
        console.log('➕ Criando projeto no Supabase:', project.title);
        // Verificar se admin está autenticado
        if (!isAdminAuthenticated()) {
            throw new Error('Usuário não autenticado para esta operação');
        }
        return withServiceRole(async () => {
            const { data, error } = await supabase
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
    async update(id, project) {
        console.log('📝 Atualizando projeto no Supabase:', id);
        // Verificar se admin está autenticado
        if (!isAdminAuthenticated()) {
            throw new Error('Usuário não autenticado para esta operação');
        }
        return withServiceRole(async () => {
            const updateData = {};
            if (project.title !== undefined)
                updateData.title = project.title;
            if (project.description !== undefined)
                updateData.description = project.description;
            if (project.tech !== undefined)
                updateData.tech = project.tech;
            if (project.image_url !== undefined)
                updateData.image_url = project.image_url;
            const { data, error } = await supabase
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
    async delete(id) {
        console.log('🗑️ Deletando projeto no Supabase:', id);
        // Verificar se admin está autenticado
        if (!isAdminAuthenticated()) {
            throw new Error('Usuário não autenticado para esta operação');
        }
        return withServiceRole(async () => {
            const { error } = await supabase
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
        return withErrorHandling(async () => {
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
        });
    },
    async create(testimonial) {
        console.log('➕ Criando depoimento no Supabase:', testimonial.name);
        if (!isAdminAuthenticated()) {
            throw new Error('Usuário não autenticado para esta operação');
        }
        return withServiceRole(async () => {
            const { data, error } = await supabase
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
    async update(id, testimonial) {
        console.log('📝 Atualizando depoimento no Supabase:', id);
        if (!isAdminAuthenticated()) {
            throw new Error('Usuário não autenticado para esta operação');
        }
        return withServiceRole(async () => {
            const updateData = {};
            if (testimonial.name !== undefined)
                updateData.name = testimonial.name;
            if (testimonial.role !== undefined)
                updateData.role = testimonial.role;
            if (testimonial.text !== undefined)
                updateData.text = testimonial.text;
            if (testimonial.avatar_url !== undefined)
                updateData.avatar_url = testimonial.avatar_url;
            const { data, error } = await supabase
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
    async delete(id) {
        console.log('🗑️ Deletando depoimento no Supabase:', id);
        if (!isAdminAuthenticated()) {
            throw new Error('Usuário não autenticado para esta operação');
        }
        return withServiceRole(async () => {
            const { error } = await supabase
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
        return withErrorHandling(async () => {
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
        });
    },
    async create(talk) {
        console.log('➕ Criando palestra no Supabase:', talk.title);
        if (!isAdminAuthenticated()) {
            throw new Error('Usuário não autenticado para esta operação');
        }
        return withServiceRole(async () => {
            const { data, error } = await supabase
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
    async update(id, talk) {
        console.log('📝 Atualizando palestra no Supabase:', id);
        if (!isAdminAuthenticated()) {
            throw new Error('Usuário não autenticado para esta operação');
        }
        return withServiceRole(async () => {
            const updateData = {};
            if (talk.title !== undefined)
                updateData.title = talk.title;
            if (talk.description !== undefined)
                updateData.description = talk.description;
            if (talk.tags !== undefined)
                updateData.tags = talk.tags;
            if (talk.image_url !== undefined)
                updateData.image_url = talk.image_url;
            const { data, error } = await supabase
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
    async delete(id) {
        console.log('🗑️ Deletando palestra no Supabase:', id);
        if (!isAdminAuthenticated()) {
            throw new Error('Usuário não autenticado para esta operação');
        }
        return withServiceRole(async () => {
            const { error } = await supabase
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
        return withErrorHandling(async () => {
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
        });
    },
    async update(settings) {
        console.log('📝 Atualizando configurações no Supabase');
        if (!isAdminAuthenticated()) {
            throw new Error('Usuário não autenticado para esta operação');
        }
        return withServiceRole(async () => {
            const updateData = {};
            if (settings.site_title !== undefined)
                updateData.site_title = settings.site_title;
            if (settings.site_description !== undefined)
                updateData.site_description = settings.site_description;
            if (settings.hero_title !== undefined)
                updateData.hero_title = settings.hero_title;
            if (settings.hero_subtitle !== undefined)
                updateData.hero_subtitle = settings.hero_subtitle;
            if (settings.about_text !== undefined)
                updateData.about_text = settings.about_text;
            if (settings.skills !== undefined)
                updateData.skills = settings.skills;
            if (settings.profile_image_url !== undefined)
                updateData.profile_image_url = settings.profile_image_url;
            const { data, error } = await supabase
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
    async uploadImage(file, folder = 'general') {
        return withErrorHandling(async () => {
            const fileExt = file.name.split('.').pop();
            const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
            const { data, error } = await supabase.storage
                .from('deviem-images')
                .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false
            });
            if (error) {
                console.error('❌ Erro ao fazer upload:', error);
                throw error;
            }
            const { data: { publicUrl } } = supabase.storage
                .from('deviem-images')
                .getPublicUrl(fileName);
            console.log('✅ Upload realizado com sucesso:', publicUrl);
            return publicUrl;
        });
    },
    async deleteImage(url) {
        return withErrorHandling(async () => {
            const urlParts = url.split('/');
            const fileName = urlParts[urlParts.length - 1];
            const folder = urlParts[urlParts.length - 2];
            const filePath = `${folder}/${fileName}`;
            const { error } = await supabase.storage
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
export const testSupabaseConnection = async (timeoutMs = 5000) => {
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
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                return { success: false, error: 'Timeout na conexão com Supabase' };
            }
            return { success: false, error: error.message };
        }
        return { success: false, error: 'Erro desconhecido na conexão' };
    }
};
