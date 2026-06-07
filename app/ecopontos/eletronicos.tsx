import React from 'react';
import CategoriaDetalhe, { PontoColeta } from '@/components/CategoriaDetalhe';

const pontos: PontoColeta[] = [
  {
    id: '1',
    nome: 'Casas Bahia – Centro',
    entidade: 'PEV Green Eletron · eletrônicos e pilhas',
    endereco: 'Rua General Sampaio, 1267 – Centro',
    horario: 'Verificar horário da loja',
  },
  {
    id: '2',
    nome: 'Casas Bahia – Messejana',
    entidade: 'PEV Green Eletron · eletrônicos e pilhas',
    endereco: 'Rua Padre Pedro de Alencar, 316 – Messejana',
    horario: 'Verificar horário da loja',
  },
];

export default function EletronicosScreen() {
  return (
    <CategoriaDetalhe
      titulo="Eletrônicos e pilhas"
      itens={['Celular', 'Tablet', 'Carregadores', 'Fones', 'Pilhas e baterias']}
      avisoTexto="Ecopontos municipais não aceitam eletrônicos pequenos nem pilhas. Use os pontos abaixo, mantidos pela Green Eletron (programa nacional de logística reversa)."
      pontos={pontos}
    />
  );
}
