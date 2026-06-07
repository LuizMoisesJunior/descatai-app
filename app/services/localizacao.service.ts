export interface EnderecoCep {
  cep: string;
  cidade: string;
  bairro: string;
  logradouro: string;
  uf: string;
}

export interface Localizacao {
  latitude: number
  longitude: number
  endereco: string
  cep: string
  cidade: string
  bairro: string
  logradouro: string
  numero: string

}
import * as Location from 'expo-location';

class LocationService {
  async buscarLocalizacaoPorCep(cep: string): Promise<EnderecoCep | null> {
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

async obterLocalizacaoAtual(): Promise<Localizacao> {
  const { status } =
    await Location.requestForegroundPermissionsAsync();

  if (status !== 'granted') {
    throw new Error('Permissão negada');
  }

  const position =
    await Location.getCurrentPositionAsync();

  const { latitude, longitude } = position.coords;

  const enderecos =
    await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });

  const endereco = enderecos[0];

  return {
    latitude,
    longitude,

    endereco:
      endereco.formattedAddress ??
      `${endereco.street}, ${endereco.streetNumber}`,

    cep: endereco.postalCode ?? '',
    cidade:
      endereco.city ??
      endereco.subregion ??
      '',

    bairro:
      endereco.district ??
      '',

    logradouro:
      endereco.street ??
      '',

    numero:
      endereco.streetNumber ??
      '',
  };
}
}

export const localizacaoService = new LocationService();