import { supabase } from './supabase';

export interface Perfil {
  id: string;
  nome: string;
  email: string;
  documento: string;
  tipo: 'Usuário' | 'Analista';
  status: 'Ativo' | 'Inativo';
  senha?: string;
  created_at?: string;
}

export const usuarioService = {
  async listar() {
    const { data, error } = await supabase
      .from('perfis')
      .select('*')
      .order('nome', { ascending: true });

    if (error) {
      console.error('Erro ao listar usuários:', error);
      throw error;
    }
    return data as Perfil[];
  },

  async buscarPorId(id: string) {
    const { data, error } = await supabase
      .from('perfis')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erro ao buscar usuário:', error);
      throw error;
    }
    return data as Perfil;
  },

  async inserir(perfil: Omit<Perfil, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('perfis')
      .insert([perfil])
      .select();

    if (error) {
      console.error('Erro ao inserir usuário:', error);
      throw error;
    }
    return data[0];
  },

  async atualizar(perfil: Perfil) {
    const { error } = await supabase
      .from('perfis')
      .update(perfil)
      .eq('id', perfil.id);

    if (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  },

  async remover(id: string) {
    const { error } = await supabase
      .from('perfis')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao remover usuário:', error);
      throw error;
    }
  }
};
