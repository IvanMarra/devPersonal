-- Função RPC para criar projetos com bypass de RLS
CREATE OR REPLACE FUNCTION create_project(
  p_title TEXT,
  p_description TEXT,
  p_tech TEXT[],
  p_image_url TEXT
) RETURNS JSONB AS $$
DECLARE
  v_result JSONB;
BEGIN
  -- Inserir o projeto
  INSERT INTO projects (title, description, tech, image_url)
  VALUES (p_title, p_description, p_tech, p_image_url)
  RETURNING to_jsonb(projects.*) INTO v_result;
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentário para documentação
COMMENT ON FUNCTION create_project IS 'Cria um novo projeto com bypass de RLS';

-- Função RPC para atualizar projetos com bypass de RLS
CREATE OR REPLACE FUNCTION update_project(
  p_id BIGINT,
  p_title TEXT DEFAULT NULL,
  p_description TEXT DEFAULT NULL,
  p_tech TEXT[] DEFAULT NULL,
  p_image_url TEXT DEFAULT NULL
) RETURNS JSONB AS $$
DECLARE
  v_result JSONB;
  v_updates TEXT := '';
  v_params TEXT[] := ARRAY[]::TEXT[];
BEGIN
  -- Construir a query de atualização dinamicamente
  IF p_title IS NOT NULL THEN
    v_updates := v_updates || 'title = $1';
    v_params := v_params || p_title;
  END IF;
  
  IF p_description IS NOT NULL THEN
    IF v_updates <> '' THEN v_updates := v_updates || ', '; END IF;
    v_updates := v_updates || 'description = $' || (array_length(v_params, 1) + 1)::TEXT;
    v_params := v_params || p_description;
  END IF;
  
  IF p_tech IS NOT NULL THEN
    IF v_updates <> '' THEN v_updates := v_updates || ', '; END IF;
    v_updates := v_updates || 'tech = $' || (array_length(v_params, 1) + 1)::TEXT;
    v_params := v_params || p_tech::TEXT;
  END IF;
  
  IF p_image_url IS NOT NULL THEN
    IF v_updates <> '' THEN v_updates := v_updates || ', '; END IF;
    v_updates := v_updates || 'image_url = $' || (array_length(v_params, 1) + 1)::TEXT;
    v_params := v_params || p_image_url;
  END IF;
  
  -- Atualizar o projeto
  EXECUTE 'UPDATE projects SET ' || v_updates || ', updated_at = now() WHERE id = $' || (array_length(v_params, 1) + 1)::TEXT || ' RETURNING to_jsonb(projects.*)'
  INTO v_result
  USING v_params, p_id;
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentário para documentação
COMMENT ON FUNCTION update_project IS 'Atualiza um projeto existente com bypass de RLS';

-- Função RPC para excluir projetos com bypass de RLS
CREATE OR REPLACE FUNCTION delete_project(
  p_id BIGINT
) RETURNS BOOLEAN AS $$
DECLARE
  v_count INT;
BEGIN
  -- Excluir o projeto
  DELETE FROM projects WHERE id = p_id;
  GET DIAGNOSTICS v_count = ROW_COUNT;
  
  RETURN v_count > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentário para documentação
COMMENT ON FUNCTION delete_project IS 'Exclui um projeto existente com bypass de RLS';

-- Funções similares para testimonials
CREATE OR REPLACE FUNCTION create_testimonial(
  p_name TEXT,
  p_role TEXT,
  p_text TEXT,
  p_avatar_url TEXT
) RETURNS JSONB AS $$
DECLARE
  v_result JSONB;
BEGIN
  INSERT INTO testimonials (name, role, text, avatar_url)
  VALUES (p_name, p_role, p_text, p_avatar_url)
  RETURNING to_jsonb(testimonials.*) INTO v_result;
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Funções similares para talks
CREATE OR REPLACE FUNCTION create_talk(
  p_title TEXT,
  p_description TEXT,
  p_tags TEXT[],
  p_image_url TEXT
) RETURNS JSONB AS $$
DECLARE
  v_result JSONB;
BEGIN
  INSERT INTO talks (title, description, tags, image_url)
  VALUES (p_title, p_description, p_tags, p_image_url)
  RETURNING to_jsonb(talks.*) INTO v_result;
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Funções para settings
CREATE OR REPLACE FUNCTION update_settings(
  p_site_title TEXT DEFAULT NULL,
  p_site_description TEXT DEFAULT NULL,
  p_hero_title TEXT DEFAULT NULL,
  p_hero_subtitle TEXT DEFAULT NULL,
  p_about_text TEXT DEFAULT NULL,
  p_skills TEXT[] DEFAULT NULL,
  p_profile_image_url TEXT DEFAULT NULL
) RETURNS JSONB AS $$
DECLARE
  v_result JSONB;
  v_updates TEXT := '';
  v_params TEXT[] := ARRAY[]::TEXT[];
  v_param_count INT := 0;
BEGIN
  -- Construir a query de atualização dinamicamente
  IF p_site_title IS NOT NULL THEN
    v_param_count := v_param_count + 1;
    v_updates := v_updates || 'site_title = $' || v_param_count::TEXT;
    v_params := v_params || p_site_title;
  END IF;
  
  IF p_site_description IS NOT NULL THEN
    IF v_updates <> '' THEN v_updates := v_updates || ', '; END IF;
    v_param_count := v_param_count + 1;
    v_updates := v_updates || 'site_description = $' || v_param_count::TEXT;
    v_params := v_params || p_site_description;
  END IF;
  
  IF p_hero_title IS NOT NULL THEN
    IF v_updates <> '' THEN v_updates := v_updates || ', '; END IF;
    v_param_count := v_param_count + 1;
    v_updates := v_updates || 'hero_title = $' || v_param_count::TEXT;
    v_params := v_params || p_hero_title;
  END IF;
  
  IF p_hero_subtitle IS NOT NULL THEN
    IF v_updates <> '' THEN v_updates := v_updates || ', '; END IF;
    v_param_count := v_param_count + 1;
    v_updates := v_updates || 'hero_subtitle = $' || v_param_count::TEXT;
    v_params := v_params || p_hero_subtitle;
  END IF;
  
  IF p_about_text IS NOT NULL THEN
    IF v_updates <> '' THEN v_updates := v_updates || ', '; END IF;
    v_param_count := v_param_count + 1;
    v_updates := v_updates || 'about_text = $' || v_param_count::TEXT;
    v_params := v_params || p_about_text;
  END IF;
  
  IF p_skills IS NOT NULL THEN
    IF v_updates <> '' THEN v_updates := v_updates || ', '; END IF;
    v_param_count := v_param_count + 1;
    v_updates := v_updates || 'skills = $' || v_param_count::TEXT;
    v_params := v_params || p_skills::TEXT;
  END IF;
  
  IF p_profile_image_url IS NOT NULL THEN
    IF v_updates <> '' THEN v_updates := v_updates || ', '; END IF;
    v_param_count := v_param_count + 1;
    v_updates := v_updates || 'profile_image_url = $' || v_param_count::TEXT;
    v_params := v_params || p_profile_image_url;
  END IF;
  
  -- Atualizar as configurações
  IF v_updates <> '' THEN
    v_param_count := v_param_count + 1;
    EXECUTE 'UPDATE site_settings SET ' || v_updates || ', updated_at = now() WHERE id = $' || v_param_count::TEXT || ' RETURNING to_jsonb(site_settings.*)'
    INTO v_result
    USING v_params, 1;
  END IF;
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentário para documentação
COMMENT ON FUNCTION update_settings IS 'Atualiza as configurações do site com bypass de RLS';

-- Desabilitar temporariamente RLS para testes (OPCIONAL - REMOVER EM PRODUÇÃO)
-- ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE testimonials DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE talks DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE site_settings DISABLE ROW LEVEL SECURITY;

-- Criar políticas mais permissivas para testes
CREATE POLICY "Allow all operations on projects" ON projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on testimonials" ON testimonials FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on talks" ON talks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on site_settings" ON site_settings FOR ALL USING (true) WITH CHECK (true);