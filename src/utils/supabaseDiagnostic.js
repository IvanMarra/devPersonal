import { supabase, isSupabaseConfigured } from '../lib/supabase';
export const runSupabaseDiagnostic = async () => {
    console.log('🔍 Iniciando diagnóstico do Supabase...');
    // 1. Verificar configuração
    console.log('1. Verificando configuração...');
    const isConfigured = isSupabaseConfigured();
    console.log(`   ✅ Configurado: ${isConfigured}`);
    if (!isConfigured) {
        console.log('   ❌ Supabase não está configurado. Verifique as variáveis de ambiente.');
        return;
    }
    // 2. Verificar conexão básica
    console.log('2. Testando conexão...');
    try {
        const { data, error } = await supabase.from('projects').select('count', { count: 'exact', head: true });
        if (error) {
            console.log(`   ❌ Erro de conexão: ${error.message}`);
        }
        else {
            console.log('   ✅ Conexão estabelecida');
        }
    }
    catch (err) {
        console.log(`   ❌ Erro de conexão: ${err}`);
    }
    // 3. Verificar tabelas
    console.log('3. Verificando tabelas...');
    const tables = ['projects', 'testimonials', 'talks', 'site_settings'];
    for (const table of tables) {
        try {
            const { data, error } = await supabase.from(table).select('*').limit(1);
            if (error) {
                console.log(`   ❌ Tabela ${table}: ${error.message}`);
            }
            else {
                console.log(`   ✅ Tabela ${table}: OK`);
            }
        }
        catch (err) {
            console.log(`   ❌ Tabela ${table}: ${err}`);
        }
    }
    // 4. Verificar storage
    console.log('4. Verificando storage...');
    try {
        const { data, error } = await supabase.storage.listBuckets();
        if (error) {
            console.log(`   ❌ Storage: ${error.message}`);
        }
        else {
            const devIemBucket = data?.find(bucket => bucket.id === 'deviem-images');
            if (devIemBucket) {
                console.log('   ✅ Bucket deviem-images: OK');
            }
            else {
                console.log('   ❌ Bucket deviem-images: Não encontrado');
            }
        }
    }
    catch (err) {
        console.log(`   ❌ Storage: ${err}`);
    }
    console.log('🏁 Diagnóstico concluído');
};
// Executar diagnóstico automaticamente em desenvolvimento
if (import.meta.env.DEV) {
    runSupabaseDiagnostic();
}
