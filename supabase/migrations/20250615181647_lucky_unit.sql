/*
  # Schema DevIem - Criação completa das tabelas

  1. Novas Tabelas
    - `projects` - Projetos desenvolvidos
    - `testimonials` - Depoimentos de clientes  
    - `talks` - Palestras e eventos
    - `site_settings` - Configurações do site

  2. Segurança
    - RLS habilitado em todas as tabelas
    - Políticas para leitura pública
    - Políticas para administração autenticada

  3. Storage
    - Bucket para imagens
    - Políticas de acesso
*/

-- Remover tabelas existentes se existirem (para garantir recriação limpa)
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS testimonials CASCADE;
DROP TABLE IF EXISTS talks CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;

-- Remover função se existir
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Criar função para atualizar timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar tabela de projetos
CREATE TABLE projects (
  id bigserial PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  tech text[] NOT NULL DEFAULT '{}',
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Criar tabela de depoimentos
CREATE TABLE testimonials (
  id bigserial PRIMARY KEY,
  name text NOT NULL,
  role text NOT NULL DEFAULT '',
  text text NOT NULL,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Criar tabela de palestras
CREATE TABLE talks (
  id bigserial PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  tags text[] NOT NULL DEFAULT '{}',
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Criar tabela de configurações do site
CREATE TABLE site_settings (
  id bigserial PRIMARY KEY,
  site_title text NOT NULL DEFAULT 'DevIem',
  site_description text NOT NULL DEFAULT 'Desenvolvedor • Mentor • Especialista em IA • Ethical Hacker',
  hero_title text NOT NULL DEFAULT 'DEVIEM',
  hero_subtitle text NOT NULL DEFAULT 'Desenvolvedor • Mentor • Especialista em IA • Ethical Hacker',
  about_text text NOT NULL DEFAULT 'Mais de 20 anos transformando ideias em realidade digital',
  skills text[] NOT NULL DEFAULT '{}',
  profile_image_url text,
  updated_at timestamptz DEFAULT now()
);

-- Habilitar Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE talks ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Políticas para leitura pública
CREATE POLICY "Allow public read access on projects"
  ON projects
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access on testimonials"
  ON testimonials
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access on talks"
  ON talks
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access on site_settings"
  ON site_settings
  FOR SELECT
  TO public
  USING (true);

-- Políticas para administração autenticada
CREATE POLICY "Allow authenticated users to manage projects"
  ON projects
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to manage testimonials"
  ON testimonials
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to manage talks"
  ON talks
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to manage site_settings"
  ON site_settings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Triggers para updated_at
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON testimonials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_talks_updated_at
  BEFORE UPDATE ON talks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Criar bucket de storage para imagens
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('deviem-images', 'deviem-images', true);
EXCEPTION
  WHEN unique_violation THEN 
    RAISE NOTICE 'Bucket deviem-images já existe';
END $$;

-- Políticas de storage
DO $$
BEGIN
  -- Remover políticas existentes
  DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;
  DROP POLICY IF EXISTS "Allow public access" ON storage.objects;
  DROP POLICY IF EXISTS "Allow authenticated delete" ON storage.objects;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Criar políticas de storage
CREATE POLICY "Allow public uploads" ON storage.objects
FOR INSERT TO public
WITH CHECK (bucket_id = 'deviem-images');

CREATE POLICY "Allow public access" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'deviem-images');

CREATE POLICY "Allow authenticated delete" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'deviem-images');

-- Inserir configurações padrão do site
INSERT INTO site_settings (
  id,
  site_title,
  site_description,
  hero_title,
  hero_subtitle,
  about_text,
  skills
) VALUES (
  1,
  'DevIem - Desenvolvedor • Mentor • Especialista em IA • Ethical Hacker',
  '20+ anos de experiência em desenvolvimento, mentoria em transição de carreira, especialista em IA e cybersecurity.',
  'DEVIEM',
  'Desenvolvedor • Mentor • Especialista em IA • Ethical Hacker',
  'Mais de 20 anos transformando ideias em realidade digital',
  ARRAY[
    'JavaScript/TypeScript', 'Python', 'Java', 'C#', 'PHP', 'React', 'Angular', 'Vue.js',
    'Node.js', 'Spring Boot', '.NET', 'Laravel', 'Docker', 'Kubernetes', 'AWS', 'Azure',
    'Machine Learning', 'AI Tools', 'Cybersecurity', 'Ethical Hacking', 'Penetration Testing'
  ]
);

-- Inserir projetos de exemplo
INSERT INTO projects (title, description, tech) VALUES
  (
    'Sistema Bancário Seguro',
    'Plataforma bancária com múltiplas camadas de segurança e detecção de fraudes em tempo real.',
    ARRAY['Java', 'Spring Boot', 'PostgreSQL', 'Redis']
  ),
  (
    'E-commerce Inteligente',
    'Plataforma de comércio eletrônico com IA para recomendações personalizadas.',
    ARRAY['React', 'Node.js', 'MongoDB', 'TensorFlow']
  ),
  (
    'App Mobile Saúde',
    'Aplicativo para monitoramento de saúde com IoT e análise preditiva.',
    ARRAY['React Native', 'Python', 'AWS', 'IoT']
  ),
  (
    'Sistema de Cybersecurity',
    'Plataforma de monitoramento e prevenção de ataques cibernéticos para o Governo Federal.',
    ARRAY['Python', 'Machine Learning', 'Elasticsearch', 'Kibana']
  );

-- Inserir depoimentos de exemplo
INSERT INTO testimonials (name, role, text) VALUES
  (
    'Ana Silva',
    'CTO - TechCorp',
    'O DevIem transformou nossa arquitetura de segurança. Sua experiência em cybersecurity salvou nossa empresa de múltiplos ataques.'
  ),
  (
    'Carlos Santos',
    'Desenvolvedor Junior',
    'A mentoria do DevIem foi fundamental na minha transição de carreira. Em 6 meses saí de iniciante para desenvolvedor pleno.'
  ),
  (
    'Maria Oliveira',
    'Gerente de TI - Gov Federal',
    'Profissional excepcional. Já nos ajudou a prevenir ataques críticos à infraestrutura nacional.'
  ),
  (
    'João Pereira',
    'CEO - StartupTech',
    'Contratamos o DevIem para desenvolver nossa plataforma. Entregou um sistema robusto e escalável que suporta milhares de usuários.'
  );

-- Inserir palestras de exemplo
INSERT INTO talks (title, description, tags) VALUES
  (
    'Segurança Cibernética na Era da IA',
    'Como a inteligência artificial está transformando o cenário de segurança digital e quais são os novos desafios para proteção de dados.',
    ARRAY['Cybersecurity', 'AI', 'Data Protection']
  ),
  (
    'Transição de Carreira para Tech',
    'Estratégias práticas para profissionais que desejam migrar para área de tecnologia, com foco em desenvolvimento de software.',
    ARRAY['Career', 'Mentoring', 'Development']
  ),
  (
    'Arquitetura de Software Moderna',
    'Melhores práticas em arquitetura de software, microserviços, containerização e deploy automatizado.',
    ARRAY['Architecture', 'Microservices', 'DevOps']
  ),
  (
    'Ethical Hacking: Protegendo Infraestruturas Críticas',
    'Técnicas de penetration testing e como proteger sistemas governamentais e empresariais de ataques cibernéticos.',
    ARRAY['Ethical Hacking', 'Penetration Testing', 'Government Security']
  );

-- Verificar se as tabelas foram criadas
DO $$
BEGIN
  RAISE NOTICE 'Verificando tabelas criadas:';
  RAISE NOTICE 'projects: %', (SELECT COUNT(*) FROM projects);
  RAISE NOTICE 'testimonials: %', (SELECT COUNT(*) FROM testimonials);
  RAISE NOTICE 'talks: %', (SELECT COUNT(*) FROM talks);
  RAISE NOTICE 'site_settings: %', (SELECT COUNT(*) FROM site_settings);
END $$;