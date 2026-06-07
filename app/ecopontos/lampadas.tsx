import React from 'react';
import CategoriaDetalhe, { PontoColeta } from '@/components/CategoriaDetalhe';

const pontos: PontoColeta[] = [
  {
    id: '1',
    nome: 'Pontos Reciclus em Fortaleza',
    entidade: 'Programa nacional · lojas de material de construção',
    endereco: 'Consulte no site reciclus.org.br/onde-descartar/ filtrando por Fortaleza–CE',
    horario: 'Conforme horário da loja parceira',
  },
  {
    id: '2',
    nome: 'Ecoponto Aguanambi',
    entidade: 'Ecoponto municipal · aceita lâmpadas',
    endereco: 'Av. Aguanambi, esq. Rua José Euclides – Fátima',
    horario: 'Seg–Sáb, 8h–12h e 14h–17h',
  },
];

export default function LampadasScreen() {
  return (
    <CategoriaDetalhe
      titulo="Lâmpadas"
      itens={['Fluorescentes', 'LED', 'Incandescentes']}
      avisoTexto="Lâmpadas fluorescentes contêm mercúrio e não podem ir ao lixo comum. O descarte correto é obrigação legal (PNRS). Verifique os pontos abaixo via Reciclus."
      pontos={pontos}
    />
  );
}
