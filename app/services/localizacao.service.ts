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

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
    );

    const data = await response.json();

    const endereco =
      `${data.address.road || ''}, ${data.address.house_number || ''} ${data.address.suburb || ''} - ${data.address.municipality || ''}  ${data.address.state || ''}`.trim();

    return {
      latitude,
      longitude,
      endereco,

      cep: data.address.postcode,
      cidade: data.address.municipality,
      bairro: data.address.suburb,
      logradouro: data.address.road,
      numero: data.address.house_number,
    };
  }
}

export const localizacaoService = new LocationService();