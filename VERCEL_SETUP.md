# 🔧 Configuração do Supabase no Vercel

## 🚨 Problema: "Supabase Desconectado"

Quando você vê essa mensagem no seu site no Vercel, significa que as variáveis de ambiente do Supabase não estão configuradas.

## ✅ Solução Passo a Passo

### 1. **Obter Credenciais do Supabase**

1. Acesse [supabase.com/dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto (ou crie um novo)
3. Vá em **Settings → API**
4. Copie:
   - **Project URL**: `https://ognojswphapbphrjkrgj.supabase.co`
   - **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nbm9qc3dwaGFwYnBocmprcmdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0MzYwMzMsImV4cCI6MjA2NTAxMjAzM30.-j0AanCHKLwltw-Ee6euCIiTtxp7qMWZC8sB0MmbuDI`

### 2. **Configurar no Vercel Dashboard**

1. Acesse [vercel.com/dashboard](https://vercel.com/dashboard)
2. Clique no seu projeto
3. Vá na aba **Settings**
4. Clique em **Environment Variables**
5. Adicione as seguintes variáveis:

```
Nome: VITE_SUPABASE_URL
Valor: https://seu-projeto-id.supabase.co
Environment: Production, Preview, Development
```

```
Nome: VITE_SUPABASE_ANON_KEY  
Valor: sua_chave_anonima_completa_aqui
Environment: Production, Preview, Development
```

### 3. **Configurar CORS no Supabase**

1. No Supabase Dashboard, vá em **Settings → API**
2. Role até **CORS Origins**
3. Adicione seu domínio do Vercel:
   ```
   https://seu-projeto.vercel.app
   https://*.vercel.app
   ```

### 4. **Executar Migrações do Banco**

1. No Supabase, vá em **SQL Editor**
2. Clique em **New Query**
3. Cole o conteúdo do arquivo `supabase/migrations/20250619011237_azure_wood.sql`
4. Clique em **Run** para executar

### 5. **Forçar Redeploy**

Após configurar as variáveis:

1. No Vercel Dashboard, vá na aba **Deployments**
2. Clique nos 3 pontinhos do último deploy
3. Clique em **Redeploy**

**OU** via CLI:
```bash
vercel --force --prod
```

## 🔍 Como Verificar se Funcionou

1. Acesse seu site no Vercel
2. Verifique o canto superior direito
3. Deve aparecer: **"Supabase: Conectado"** em verde ✅

## 🚨 Troubleshooting

### Problema: Ainda aparece "Desconectado"
**Soluções**:
1. Verificar se as variáveis têm o prefixo `VITE_`
2. Verificar se não há espaços extras nos valores
3. Fazer hard refresh (Ctrl+F5)
4. Verificar no console do navegador se há erros

### Problema: Erro de CORS
**Solução**:
- Adicionar todos os domínios possíveis no CORS:
  ```
  https://seu-projeto.vercel.app
  https://seu-projeto-git-main-seu-usuario.vercel.app
  https://*.vercel.app
  ```

### Problema: Tabelas não existem
**Solução**:
- Executar as migrações SQL no Supabase
- Verificar se as tabelas foram criadas em **Table Editor**

## 📋 Checklist Final

- [ ] ✅ Variáveis de ambiente configuradas no Vercel
- [ ] ✅ CORS configurado no Supabase  
- [ ] ✅ Migrações executadas
- [ ] ✅ Redeploy feito
- [ ] ✅ Site funcionando com "Supabase: Conectado"

## 🎯 Comandos Úteis

```bash
# Verificar variáveis localmente
echo $VITE_SUPABASE_URL

# Redeploy forçado
vercel --force --prod

# Ver logs do deploy
vercel logs
```

---

**💡 Dica**: Depois de configurar, o site deve funcionar perfeitamente com todos os dados carregando do Supabase!