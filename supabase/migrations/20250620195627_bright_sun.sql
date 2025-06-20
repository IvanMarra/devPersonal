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

-- Desabilitar temporariamente RLS para testes
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials DISABLE ROW LEVEL SECURITY;
ALTER TABLE talks DISABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings DISABLE ROW LEVEL SECURITY;