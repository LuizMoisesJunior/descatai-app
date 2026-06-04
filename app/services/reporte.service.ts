import { Reporte } from '../(tabs)/report';

export const reporteService = {


    async listar() {
        return mockData;
    },

    async buscarPorId(id: string) {
        return mockData.find(x => x.id === id);
    },

    async inserir(documento: Reporte) {
        if(!documento.id){
            documento.id =Date.now().toString();
        }
        mockData.push(documento)
    },
    async atualizar(documento: Reporte) {
        let index = mockData.findIndex((item: Reporte) => item.id === documento.id);
        if (index >= 0) {
            mockData[index] = documento
        } else {
            await this.inserir(documento)
        }
    },
    async remover(id: string) {
        let index = mockData.findIndex((item: Reporte) => item.id === id);
        mockData.splice(index, 1)
    }

};
export let mockData: Reporte[] = [
    { id: '1', assunto: 'Lixo na água' },
    { id: '2', assunto: 'escombros perto da escola' },
    { id: '3', assunto: 'Sacolas na grama' },
]