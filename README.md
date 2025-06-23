# DevIem - Portfolio Profissional

Portfolio profissional do DevIem com área administrativa completa.

## 🚀 Funcionalidades

- **Frontend Responsivo**: Design cyberpunk com animações e efeitos visuais
- **Área Administrativa**: Gerenciamento completo de conteúdo
- **Integração Supabase**: Banco de dados e storage em tempo real
- **Dashboard Analytics**: Métricas e estatísticas do site
- **Upload de Imagens**: Sistema completo de gerenciamento de mídia

## 🛠️ Tecnologias

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Storage)
- **Deploy**: Vercel
- **Icons**: Lucide React

## 📦 Instalação Local

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   ```bash
   cp .env.example .env
   ```
   
   Edite o arquivo `.env` com suas credenciais do Supabase:
   ```
   VITE_SUPABASE_URL=sua_url_do_supabase
   VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
   ```

4. Execute o projeto:
   ```bash
   npm run dev
   ```

## 🌐 Deploy no Vercel

### Método 1: Via GitHub (Recomendado)

1. **Faça push do código para GitHub**:
   ```bash
   git add .
   git commit -m "Deploy inicial"
   git push origin main
   ```

2. **No Vercel Dashboard**:
   - Acesse [vercel.com/dashboard](https://vercel.com/dashboard)
   - Clique em "New Project"
   - Conecte seu repositório GitHub
   - Selecione o repositório do projeto

3. **Configure as variáveis de ambiente**:
   - Na seção "Environment Variables", adicione:
     - `VITE_SUPABASE_URL`: sua URL do Supabase
     - `VITE_SUPABASE_ANON_KEY`: sua chave anônima do Supabase

4. **Deploy automático**:
   - O Vercel detectará automaticamente que é um projeto Vite
   - Clique em "Deploy"

### Método 2: Via Vercel CLI

```bash
# Instalar Vercel CLI globalmente
npm i -g vercel

# Fazer login
vercel login

# Deploy do projeto
vercel

# Para production
vercel --prod
```

### Configurações Específicas do Vercel

O projeto já está configurado com:

- **vercel.json** otimizado para Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Framework**: Vite (detectado automaticamente)
- **Node.js Version**: 18.x

### Troubleshooting Vercel

#### Problema: "Branch main não encontrada"
**Solução**:
```bash
# Verificar branch atual
git branch

# Se não estiver na main, criar e mudar
git checkout -b main

# Fazer push da branch main
git push -u origin main
```

#### Problema: "Build falha"
**Soluções**:
1. Verificar se as variáveis de ambiente estão configuradas
2. Verificar se o Node.js está na versão 18+
3. Limpar cache do Vercel:
   ```bash
   vercel --force
   ```

#### Problema: "Variáveis de ambiente não funcionam"
**Verificar**:
- Nomes devem ter prefixo `VITE_`
- Configuradas tanto para Development quanto Production
- Fazer redeploy após adicionar variáveis

### 🔧 Configuração do Supabase

1. **Criar projeto no Supabase**:
   - Acesse [supabase.com](https://supabase.com)
   - Crie um novo projeto

2. **Executar migrações**:
   - No SQL Editor do Supabase
   - Execute o conteúdo de `supabase/migrations/20250619011237_azure_wood.sql`

3. **Configurar CORS**:
   - Settings → API → CORS Origins
   - Adicionar seu domínio do Vercel: `https://seu-projeto.vercel.app`

4. **Obter credenciais**:
   - Settings → API
   - Copiar Project URL e anon key

### 📊 Estrutura do Banco de Dados

- `projects`: Projetos desenvolvidos
- `testimonials`: Depoimentos de clientes
- `talks`: Palestras e eventos
- `site_settings`: Configurações do site
- Storage bucket: `deviem-images`


### 🎨 Personalização

Todo o conteúdo pode ser gerenciado através da área administrativa:
- Projetos
- Depoimentos
- Palestras
- Configurações do site

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview

# Lint do código
npm run lint

# Deploy no Vercel
vercel --prod
```

## 📝 Licença

Este projeto é privado e proprietário do DevIem.

## 🤝 Suporte

Para suporte técnico, entre em contato através dos canais oficiais do DevIem.
