# 🔧 Configuração do Supabase Storage

## 🚨 Problema: Upload de Imagens não Funciona

Se você não consegue alterar a imagem de perfil ou fazer upload de outras imagens, o problema é a configuração do Storage.

## ✅ Solução Completa

### 1. **Configurar Storage no Supabase**

1. **Acesse o Supabase Dashboard**:
   - Vá em [supabase.com/dashboard](https://supabase.com/dashboard)
   - Selecione seu projeto

2. **Criar Bucket de Storage**:
   - Vá em **Storage** no menu lateral
   - Clique em **Create Bucket**
   - Nome: `deviem-images`
   - Marque como **Public bucket** ✅
   - Clique em **Create bucket**

3. **Configurar Políticas de Storage**:
   - Clique no bucket `deviem-images`
   - Vá na aba **Policies**
   - Clique em **New Policy**
   
   **Política 1 - Upload Público**:
   ```sql
   CREATE POLICY "Allow public uploads" ON storage.objects
   FOR INSERT TO public
   WITH CHECK (bucket_id = 'deviem-images');
   ```
   
   **Política 2 - Leitura Pública**:
   ```sql
   CREATE POLICY "Allow public access" ON storage.objects
   FOR SELECT TO public
   USING (bucket_id = 'deviem-images');
   ```
   
   **Política 3 - Delete Autenticado**:
   ```sql
   CREATE POLICY "Allow authenticated delete" ON storage.objects
   FOR DELETE TO authenticated
   USING (bucket_id = 'deviem-images');
   ```

### 2. **Verificar se as Migrações Foram Executadas**

1. **No SQL Editor do Supabase**:
   - Vá em **SQL Editor**
   - Execute esta query para verificar:
   ```sql
   SELECT * FROM storage.buckets WHERE id = 'deviem-images';
   ```
   
2. **Se não retornar nada, execute**:
   ```sql
   -- Criar bucket
   INSERT INTO storage.buckets (id, name, public)
   VALUES ('deviem-images', 'deviem-images', true)
   ON CONFLICT (id) DO NOTHING;
   
   -- Políticas de storage
   CREATE POLICY "Allow public uploads" ON storage.objects
   FOR INSERT TO public
   WITH CHECK (bucket_id = 'deviem-images');
   
   CREATE POLICY "Allow public access" ON storage.objects
   FOR SELECT TO public
   USING (bucket_id = 'deviem-images');
   
   CREATE POLICY "Allow authenticated delete" ON storage.objects
   FOR DELETE TO authenticated
   USING (bucket_id = 'deviem-images');
   ```

### 3. **Testar Upload**

1. **Acesse o admin do seu site**
2. **Digite "deviem"** para entrar
3. **Vá em Configurações**
4. **Tente fazer upload da foto de perfil**

### 4. **Se Ainda Não Funcionar**

**Verificar CORS do Storage**:
1. No Supabase, vá em **Settings → API**
2. Na seção **CORS Origins**, adicione:
   ```
   https://seu-dominio.vercel.app
   https://*.vercel.app
   http://localhost:5173
   ```

## 🎯 **Como Usar o Sistema de Upload**

### **No Dashboard Admin:**

1. **Projetos**:
   - Clique em "Adicionar Novo Projeto"
   - Preencha título, descrição, tecnologias
   - **Clique na área de upload de imagem**
   - Selecione uma imagem do seu computador
   - A imagem será enviada automaticamente

2. **Depoimentos**:
   - Adicione nome, cargo, depoimento
   - **Upload do avatar** na seção "Avatar do Cliente"

3. **Palestras**:
   - Título, descrição, tags
   - **Upload da imagem** na seção "Imagem da Palestra"

4. **Configurações**:
   - **Foto de Perfil** na seção "Foto de Perfil"

## 🔍 **Verificar se Funcionou**

1. **Status do Supabase**: Deve aparecer "Conectado" em verde
2. **Upload**: Deve aparecer preview da imagem após upload
3. **Frontend**: Imagens devem aparecer no site

## 🚨 **Troubleshooting**

### Erro: "Supabase não configurado"
- Verificar variáveis de ambiente no Vercel
- Fazer redeploy após configurar

### Erro: "Failed to upload"
- Verificar se o bucket existe
- Verificar políticas de storage
- Verificar CORS

### Imagens não aparecem no site
- Verificar se as URLs estão corretas
- Fazer hard refresh (Ctrl+F5)
- Verificar console do navegador

---

**💡 Depois dessa configuração, você poderá:**
- ✅ Fazer upload de todas as imagens
- ✅ Editar a foto de perfil
- ✅ Adicionar imagens em projetos, depoimentos e palestras
- ✅ Gerenciar todo o conteúdo pelo dashboard