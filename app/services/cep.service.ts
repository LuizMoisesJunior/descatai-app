export interface EnderecoCep {
  cep: string;
  cidade: string;
  bairro: string;
  logradouro: string;
  uf: string;
}
class CepService {
  async buscar(cep: string): Promise<EnderecoCep | null> {
    const cepLimpo = cep.replace(/\D/g, '');

    if (cepLimpo.length !== 8) {
      return null;
    }

    const response = await fetch(
      `https://viacep.com.br/ws/${cepLimpo}/json/`
    );

    const data = await response.json();

    if (data.erro) {
      return null;
    }

    return {
      cep: data.cep,
      cidade: data.localidade,
      bairro: data.bairro,
      logradouro: data.logradouro,
      uf: data.uf,
    };
  }
}

export const cepService = new CepService();