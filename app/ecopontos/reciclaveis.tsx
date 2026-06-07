import React from 'react';
import CategoriaDetalhe, { PontoColeta } from '@/components/CategoriaDetalhe';

const pontos: PontoColeta[] = [
  {
    id: '1',
    nome: 'Ecoponto Aguanambi',
    entidade: 'Ecoponto municipal · Ecofor',
    endereco: 'Av. Aguanambi, esq. Rua José Euclides – Fátima',
    horario: 'Seg–Sáb, 8h–12h e 14h–17h',
  },
  {
    id: '2',
    nome: 'Ecoponto Cocó',
    entidade: 'Ecoponto municipal · Ecofor',
    endereco: 'Av. Padre Antônio Tomás, 2669 – Cocó (próximo à Via Expressa)',
    horario: 'Seg–Sáb, 8h–12h e 14h–17h',
  },
  {
    id: '3',
    nome: 'Ecoponto Varjota',
    entidade: 'Ecoponto municipal · Ecofor',
    endereco: 'Rua Meruoca, esq. Av. Antônio Justa – Varjota',
    horario: 'Seg–Sáb, 8h–12h e 14h–17h',
  },
  {
    id: '4',
    nome: 'Ecoponto Autran Nunes',
    entidade: 'Ecoponto municipal · Ecofor',
    endereco: 'Av. Senador Fernandes Távora, 2938, esq. Rua Desembargador Felismino – Autran Nunes',
    horario: 'Seg–Sáb, 8h–12h e 14h–17h',
  },
];

export default function ReciclaveiScreen() {
  return (
    <CategoriaDetalhe
      titulo="Recicláveis e volumosos"
      itens={['Papel', 'Plástico', 'Vidro', 'Metal', 'Entulho', 'Móveis', 'Podas', 'Eletrodomésticos', 'Óleo de cozinha']}
      avisoTexto="Todos os ecopontos abaixo são gratuitos e gerenciados pela Prefeitura de Fortaleza (Ecofor)."
      pontos={pontos}
    />
  );
}
