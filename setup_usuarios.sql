CREATE TABLE IF NOT EXISTS perfis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  documento TEXT, 
  tipo TEXT DEFAULT 'Usuário', 
  status TEXT DEFAULT 'Ativo'
);

-- Permissões para o App conseguir ler/gravar
ALTER TABLE perfis DISABLE ROW LEVEL SECURITY;
GRANT ALL ON TABLE perfis TO anon;
GRANT ALL ON TABLE perfis TO authenticated;
GRANT ALL ON SEQUENCE perfis_id_seq TO anon;
GRANT ALL ON SEQUENCE perfis_id_seq TO authenticated;
