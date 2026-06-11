import { Reporte } from '../(tabs)/report';
import { supabase } from './supabase';

export const reporteService = {

    async listar() {
        const { data, error } = await supabase
            .from('reportes')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Erro ao listar reportes:', error);
            return [];
        }
        return data as Reporte[];
    },

    async buscarPorId(id: string) {
        const { data, error } = await supabase
            .from('reportes')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Erro ao buscar reporte:', error);
            return null;
        }
        return data as Reporte;
    },

    async inserir(documento: Omit<Reporte, 'id'>) {
        const { data, error } = await supabase
            .from('reportes')
            .insert([documento])
            .select();

        if (error) {
            console.error('Erro ao inserir reporte:', error);
            throw error;
        }
        return data[0];
    },

    async atualizar(documento: Reporte) {
        const { error } = await supabase
            .from('reportes')
            .update(documento)
            .eq('id', documento.id);

        if (error) {
            console.error('Erro ao atualizar reporte:', error);
            throw error;
        }
    },

    async remover(id: string) {
        const { error } = await supabase
            .from('reportes')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Erro ao remover reporte:', error);
            throw error;
        }
    }

};
