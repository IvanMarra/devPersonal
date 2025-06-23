/*
  # Adicionar sistema de blog

  1. Nova Tabela
    - `blog_posts` - Posts do blog com título, conteúdo, tags, etc.

  2. Segurança
    - RLS habilitado
    - Políticas para leitura pública
    - Políticas para administração autenticada

  3. Dados Iniciais
    - Posts de exemplo sobre IA, Cybersecurity e Carreira
*/

-- Criar tabela de blog posts
CREATE TABLE IF NOT EXISTS blog_posts (
  id bigserial PRIMARY KEY,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  content text NOT NULL,
  excerpt text NOT NULL,
  image_url text,
  tags text[] NOT NULL DEFAULT '{}',
  category text NOT NULL DEFAULT 'Technology',
  published_at timestamptz DEFAULT now(),
  author text NOT NULL DEFAULT 'DevIem',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar Row Level Security
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes se existirem
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Allow public read access on blog_posts" ON blog_posts;
  DROP POLICY IF EXISTS "Allow authenticated users to manage blog_posts" ON blog_posts;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Políticas para leitura pública
CREATE POLICY "Allow public read access on blog_posts"
  ON blog_posts
  FOR SELECT
  TO public
  USING (true);

-- Políticas para administração autenticada
CREATE POLICY "Allow authenticated users to manage blog_posts"
  ON blog_posts
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Remover trigger existente se existir
DO $$
BEGIN
  DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Trigger para updated_at
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Inserir posts de exemplo
INSERT INTO blog_posts (title, slug, content, excerpt, tags, category, image_url) VALUES
  (
    'O Futuro da Inteligência Artificial em 2025',
    'futuro-ia-2025',
    '# O Futuro da Inteligência Artificial em 2025

A inteligência artificial está evoluindo rapidamente e 2025 promete ser um ano revolucionário para a área. Neste artigo, vamos explorar as principais tendências e inovações que estão moldando o futuro da IA.

## Principais Tendências

### 1. IA Generativa Mais Avançada
Os modelos de linguagem estão se tornando cada vez mais sofisticados, capazes de gerar conteúdo de alta qualidade em diversas modalidades.

### 2. Automação Inteligente
A combinação de IA com robótica está criando soluções de automação mais inteligentes e adaptáveis.

### 3. IA Ética e Responsável
Há um foco crescente em desenvolver IA de forma ética, com transparência e responsabilidade.

## Impacto no Mercado de Trabalho

A IA está transformando o mercado de trabalho, criando novas oportunidades enquanto automatiza tarefas repetitivas. É essencial que profissionais se adaptem e desenvolvam habilidades complementares à IA.

## Conclusão

O futuro da IA é promissor, mas requer preparação e adaptação contínua. Aqueles que abraçarem essas mudanças estarão melhor posicionados para o sucesso.',
    'Explore as principais tendências de IA para 2025 e como elas impactarão o mercado de trabalho e a sociedade.',
    ARRAY['IA', 'Tecnologia', 'Futuro', 'Automação'],
    'Technology',
    'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800'
  ),
  (
    'Cybersecurity: Protegendo sua Empresa em 2025',
    'cybersecurity-empresa-2025',
    '# Cybersecurity: Protegendo sua Empresa em 2025

Com o aumento dos ataques cibernéticos, a segurança digital nunca foi tão importante. Este guia abrangente mostra como proteger sua empresa contra as ameaças modernas.

## Principais Ameaças

### Ransomware
Os ataques de ransomware continuam evoluindo, tornando-se mais sofisticados e direcionados.

### Phishing Avançado
Técnicas de engenharia social estão se tornando mais convincentes com o uso de IA.

### Ataques à Cadeia de Suprimentos
Hackers estão mirando fornecedores para acessar sistemas maiores.

## Estratégias de Proteção

### 1. Implementar Zero Trust
O modelo Zero Trust assume que nenhuma conexão é confiável por padrão.

### 2. Treinamento de Funcionários
A educação contínua é fundamental para prevenir ataques de engenharia social.

### 3. Backup e Recuperação
Ter um plano robusto de backup é essencial para recuperação rápida.

## Ferramentas Recomendadas

- **Firewalls de Nova Geração**: Proteção avançada contra ameaças
- **SIEM**: Monitoramento e análise de eventos de segurança
- **EDR**: Detecção e resposta em endpoints

## Conclusão

A cybersecurity é um investimento essencial, não um custo. Empresas que priorizam a segurança digital estarão melhor preparadas para enfrentar os desafios do futuro.',
    'Guia completo de cybersecurity para empresas, com estratégias práticas para proteção contra ameaças modernas.',
    ARRAY['Cybersecurity', 'Segurança', 'Empresa', 'Proteção'],
    'Security',
    'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=800'
  ),
  (
    'Transição de Carreira para Tech: Guia Completo',
    'transicao-carreira-tech',
    '# Transição de Carreira para Tech: Guia Completo

Fazer a transição para a área de tecnologia pode parecer desafiador, mas com o planejamento certo, é totalmente possível. Este guia oferece um roadmap prático para sua jornada.

## Por Que Migrar para Tech?

### Oportunidades Abundantes
O setor de tecnologia oferece inúmeras oportunidades de crescimento e desenvolvimento.

### Salários Competitivos
Profissionais de tech geralmente recebem salários acima da média do mercado.

### Flexibilidade
Muitas posições oferecem trabalho remoto e horários flexíveis.

## Áreas Principais

### Desenvolvimento de Software
- **Frontend**: React, Vue.js, Angular
- **Backend**: Node.js, Python, Java
- **Mobile**: React Native, Flutter

### Data Science
- **Análise de Dados**: Python, R, SQL
- **Machine Learning**: TensorFlow, PyTorch
- **Visualização**: Tableau, Power BI

### DevOps
- **Cloud**: AWS, Azure, GCP
- **Containers**: Docker, Kubernetes
- **CI/CD**: Jenkins, GitLab

## Plano de Estudos

### Mês 1-2: Fundamentos
- Lógica de programação
- Escolher uma linguagem principal
- Projetos básicos

### Mês 3-4: Especialização
- Aprofundar na área escolhida
- Projetos mais complexos
- Contribuir para open source

### Mês 5-6: Preparação para o Mercado
- Portfolio profissional
- Networking
- Preparação para entrevistas

## Dicas Importantes

1. **Seja Consistente**: Estude um pouco todos os dias
2. **Pratique Muito**: Teoria sem prática não funciona
3. **Networking**: Conecte-se com profissionais da área
4. **Paciência**: A transição leva tempo, seja paciente

## Conclusão

A transição para tech é uma jornada recompensadora. Com dedicação e o plano certo, você pode alcançar seus objetivos profissionais na área de tecnologia.',
    'Roadmap completo para fazer a transição de carreira para tecnologia, com dicas práticas e plano de estudos.',
    ARRAY['Carreira', 'Tecnologia', 'Transição', 'Desenvolvimento'],
    'Career',
    'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800'
  )
ON CONFLICT (slug) DO NOTHING;