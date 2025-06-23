-- Desabilitar temporariamente RLS para testes
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials DISABLE ROW LEVEL SECURITY;
ALTER TABLE talks DISABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings DISABLE ROW LEVEL SECURITY;

-- Criar políticas mais permissivas para testes
DO $$ 
BEGIN
  -- Drop policies if they exist
  BEGIN
    DROP POLICY IF EXISTS "Allow all operations on projects" ON projects;
  EXCEPTION
    WHEN undefined_object THEN NULL;
  END;
  
  BEGIN
    DROP POLICY IF EXISTS "Allow all operations on testimonials" ON testimonials;
  EXCEPTION
    WHEN undefined_object THEN NULL;
  END;
  
  BEGIN
    DROP POLICY IF EXISTS "Allow all operations on talks" ON talks;
  EXCEPTION
    WHEN undefined_object THEN NULL;
  END;
  
  BEGIN
    DROP POLICY IF EXISTS "Allow all operations on site_settings" ON site_settings;
  EXCEPTION
    WHEN undefined_object THEN NULL;
  END;
END $$;

-- Criar novas políticas permissivas
CREATE POLICY "Allow all operations on projects" ON projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on testimonials" ON testimonials FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on talks" ON talks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on site_settings" ON site_settings FOR ALL USING (true) WITH CHECK (true);

-- Habilitar RLS novamente, mas com políticas permissivas
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE talks ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;