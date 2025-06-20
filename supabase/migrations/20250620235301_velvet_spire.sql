/*
  # Adição de tabelas para Blog e Aulas

  1. Novas Tabelas
    - `blog_posts` - Posts do blog
    - `class_settings` - Configurações da seção de aulas
    - `class_plans` - Planos de aula

  2. Alterações
    - Adição do campo `class_link` à tabela `site_settings`
*/

-- Criar tabela de blog se não existir
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

-- Criar tabela de configurações de aulas se não existir
CREATE TABLE IF NOT EXISTS class_settings (
  id bigserial PRIMARY KEY,
  title text NOT NULL DEFAULT 'Aulas Particulares',
  subtitle text NOT NULL DEFAULT 'Aprenda com um especialista',
  description text NOT NULL DEFAULT 'Aulas personalizadas para seu nível e objetivos',
  cta_text text NOT NULL DEFAULT 'Agendar Aula Experimental',
  cta_link text NOT NULL DEFAULT 'https://wa.me/5511999999999',
  methodology text[] NOT NULL DEFAULT '{}',
  areas text[] NOT NULL DEFAULT '{}',
  updated_at timestamptz DEFAULT now()
);

-- Criar tabela de planos de aula se não existir
CREATE TABLE IF NOT EXISTS class_plans (
  id bigserial PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  duration text NOT NULL DEFAULT '1 hora',
  features text[] NOT NULL DEFAULT '{}',
  image_url text,
  is_featured boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Adicionar campo class_link à tabela site_settings se não existir
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'site_settings' AND column_name = 'class_link'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN class_link text;
  END IF;
END $$;

-- Habilitar Row Level Security
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_plans ENABLE ROW LEVEL SECURITY;

-- Políticas para leitura pública
CREATE POLICY "Allow public read access on blog_posts"
  ON blog_posts
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access on class_settings"
  ON class_settings
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access on class_plans"
  ON class_plans
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

CREATE POLICY "Allow authenticated users to manage class_settings"
  ON class_settings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to manage class_plans"
  ON class_plans
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Triggers para updated_at
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_class_settings_updated_at
  BEFORE UPDATE ON class_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_class_plans_updated_at
  BEFORE UPDATE ON class_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Inserir dados de exemplo para blog
INSERT INTO blog_posts (title, slug, content, excerpt, image_url, tags, category, published_at, author)
VALUES
  (
    'Introdução à Segurança Cibernética',
    'introducao-seguranca-cibernetica',
    '<h2>Introdução à Segurança Cibernética</h2><p>A segurança cibernética é um campo em constante evolução que se concentra na proteção de sistemas, redes e programas contra ataques digitais.</p>',
    'Uma introdução aos conceitos básicos de segurança cibernética e como proteger seus dados.',
    'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ARRAY['Cybersecurity', 'Beginners', 'Data Protection'],
    'Security',
    '2025-01-15T10:00:00Z',
    'DevIem'
  ),
  (
    'Como Iniciar sua Carreira em Desenvolvimento Web',
    'iniciar-carreira-desenvolvimento-web',
    '<h2>Como Iniciar sua Carreira em Desenvolvimento Web em 2025</h2><p>O desenvolvimento web continua sendo uma das carreiras mais promissoras e acessíveis na área de tecnologia.</p>',
    'Guia completo para quem deseja iniciar uma carreira em desenvolvimento web em 2025.',
    'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ARRAY['Career', 'Web Development', 'Beginners'],
    'Career',
    '2025-01-10T14:30:00Z',
    'DevIem'
  )
ON CONFLICT (slug) DO NOTHING;

-- Inserir dados de exemplo para configurações de aulas
INSERT INTO class_settings (id, title, subtitle, description, cta_text, cta_link, methodology, areas)
VALUES (
  1,
  'Aulas Particulares',
  'Aprenda com um especialista',
  'Aulas personalizadas para seu nível e objetivos, com foco em projetos práticos e aplicação real.',
  'Agendar Aula Experimental',
  'https://wa.me/5511999999999',
  ARRAY[
    'Aulas 100% práticas com projetos reais',
    'Conteúdo personalizado por aluno',
    'Suporte contínuo via WhatsApp',
    'Flexibilidade de horários'
  ],
  ARRAY[
    'Desenvolvimento Web (React, Angular, Vue)',
    'Desenvolvimento Mobile (React Native)',
    'Backend (Node.js, Python, Java)',
    'Cybersecurity e Ethical Hacking'
  ]
) ON CONFLICT (id) DO NOTHING;

-- Inserir dados de exemplo para planos de aula
INSERT INTO class_plans (title, description, price, duration, features, image_url, is_featured)
VALUES
  (
    'Plano Básico',
    'Ideal para iniciantes que desejam aprender os fundamentos.',
    150,
    '1 hora',
    ARRAY[
      '1 aula semanal',
      'Suporte por e-mail',
      'Material didático',
      'Certificado de conclusão'
    ],
    'https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=800',
    false
  ),
  (
    'Plano Premium',
    'Para quem deseja aprender de forma intensiva e com mais recursos.',
    250,
    '1.5 horas',
    ARRAY[
      '2 aulas semanais',
      'Suporte por WhatsApp',
      'Material didático avançado',
      'Projetos práticos',
      'Certificado de conclusão',
      'Mentoria personalizada'
    ],
    'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=800',
    true
  )
ON CONFLICT DO NOTHING;

-- Atualizar site_settings com link para aula experimental
UPDATE site_settings
SET class_link = 'https://wa.me/5511999999999'
WHERE id = 1 AND (class_link IS NULL OR class_link = '');