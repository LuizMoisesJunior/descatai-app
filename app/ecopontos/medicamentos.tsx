import React from 'react';
import CategoriaDetalhe, { PontoColeta } from '@/components/CategoriaDetalhe';

const pontos: PontoColeta[] = [
  {
    id: '1',
    nome: 'Farmácia-Escola da UFC',
    entidade: 'Posto permanente de coleta · gratuito',
    endereco: 'Rua Alexandre Baraúna, 949 – Rodolfo Teófilo (Campus Porangabuçu da UFC)',
    horario: 'Seg–Sex, 8h–12h',
  },
  {
    id: '2',
    nome: 'Farmácias Pague Menos',
    entidade: 'Rede · coletor no balcão',
    endereco: 'Diversas unidades em Fortaleza – procure a mais próxima',
    horario: 'Conforme horário da unidade',
  },
];

export default function MedicamentosScreen() {
  return (
    <CategoriaDetalhe
      titulo="Medicamentos"
      itens={['Remédios vencidos', 'Embalagens com resíduo', 'Xaropes', 'Pomadas']}
      avisoTexto="Pela Lei Estadual nº 15.192/2012 do Ceará, farmácias são obrigadas a receber medicamentos vencidos. Nunca descarte no lixo comum ou esgoto."
      pontos={pontos}
    />
  );
}
