-- COPIE DAQUI PARA BAIXO NO SQL EDITOR DO SUPABASE
-- NÃO COPIE NÚMEROS DE LINHA SE APARECEREM

CREATE TABLE reportes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  assunto TEXT NOT NULL,
  categoria INT,
  cep TEXT,
  cidade TEXT,
  logradouro TEXT,
  rua TEXT,
  numero TEXT,
  complemento TEXT,
  descricao TEXT,
  status TEXT DEFAULT 'pendente'
);

-- Habilitar Realtime para esta tabela
ALTER PUBLICATION supabase_realtime ADD TABLE reportes;

-- POLÍTICAS DE SEGURANÇA (RLS)
-- Por padrão, o Supabase bloqueia escrita/leitura. 
-- Escolha UMA das opções abaixo e execute no SQL Editor:

-- OPÇÃO A: Desativar segurança (Apenas para desenvolvimento/testes rápidos)
ALTER TABLE reportes DISABLE ROW LEVEL SECURITY;

-- OPÇÃO B: Permitir que qualquer pessoa leia e crie reportes (Recomendado para o MVP)
-- CREATE POLICY "Permitir leitura pública" ON reportes FOR SELECT USING (true);
-- CREATE POLICY "Permitir inserção pública" ON reportes FOR INSERT WITH CHECK (true);
-- CREATE POLICY "Permitir atualização pública" ON reportes FOR UPDATE USING (true);
-- CREATE POLICY "Permitir exclusão pública" ON reportes FOR DELETE USING (true);
