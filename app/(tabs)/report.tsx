import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ComponentProps, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { reporteService } from '../services/reporte.service';
export interface Reporte {
  id: string;
  assunto: string;
  categoria?: number | null
  cep?: string
  cidade?: string
  logradouro?: string
  rua?: string
  numero?: string
  complemento?: string
  descricao?: string

  fotoUrl?: string;
}

export interface AcaoItem {
  nome: string;
  label: string;
  buttonColor: string;
  iconName: ComponentProps<typeof Ionicons>['name'];
  visible: (item: Reporte) => boolean;
  command: (item: Reporte) => void;
}

const emptyDocument: Reporte = {
  id: '',
  assunto: ''
};

export default function TelaReporte() {

  //variaveis
  const [documents, setDocuments] = useState<Reporte[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [formIsVisible, setFormIsVisible] = useState<boolean>(false);


  const titulo = "Reporte";


  const recirecionarRota = (caminho: any, parametros?: any) => {
    caminho = `/${caminho}`
    router.push({
      pathname: caminho,
      params: parametros
    });
  }
  //funcoes
  const openModalForm = (item?: Reporte) => {
    setFormIsVisible(true);
  };

  const closeModal = () => {
    setFormIsVisible(false);

  };

  const saveModal = () => {
    setCarregando(true);

    closeModal();
    setCarregando(false);
  }

  const add = () => {
    router.push({
      pathname: '/report/formulario',
      params: {
        mode: 'create'
      }
    });
  };

  const view = (item: Reporte) => {
    router.push({
      pathname: '/report/formulario',
      params: {
        id: item.id,
        mode: 'view'
      }
    });
  };

  const remove = async (item: Reporte) => {

    await reporteService.remover(item.id);

    carregarDados();

  };

  const acoes: AcaoItem[] = [
    {
      nome: 'view',
      label: 'Visualizar',
      iconName: 'eye-outline',
      buttonColor: '#007AFF',
      visible: () => true,
      command: view
    },
    {
      nome: 'remove',
      label: 'Remover',
      iconName: 'trash-outline',
      buttonColor: '#FF3B30',
      visible: () => true,
      command: remove
    },
  ];

  //INICIADOR
  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {

    setCarregando(true);

    const dados = await reporteService.listar();

    setDocuments(dados);

    setCarregando(false);
  };

  //Parte visivel na tela
  return (
    <View style={styles.container}>
      <View style={styles.cabecalho}>
        <TouchableOpacity style={styles.botaoVoltar} onPress={() => console.log('Voltar')}>
          <Text style={styles.textoBotaoVoltar}>←</Text>
        </TouchableOpacity>
        <Text style={styles.texto}>{titulo}</Text>
      </View>

      {carregando ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={documents}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.cardItem}>
              <Text style={styles.textoItem} numberOfLines={1}>{item.assunto}</Text>

              <View style={styles.containerBotoesAcao}>
                {acoes.map((acao) => {
                  if (!acao.visible(item)) return null;
                  return (
                    <TouchableOpacity
                      key={acao.nome}
                      style={styles.botaoQuadrado}
                      onPress={() => acao.command(item)}
                    >
                      <Ionicons name={acao.iconName} size={20} color={acao.buttonColor} />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}
          style={styles.lista}
        />
      )}

      <TouchableOpacity style={[styles.botaoFlutuante, styles.botaoSalvar]} onPress={add}>
        <Text style={styles.textoBotaoFlutuante}>+</Text>
      </TouchableOpacity>

      {/* Modal de resolucao e validacao da resolucao */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={formIsVisible}
        onRequestClose={closeModal}
      >

      </Modal>
    </View>
  );
}
//lista de estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    paddingTop: 60,
  },
  lista: {
    width: '100%',
  },
  texto: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  cardItem: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 12,
    width: '100%',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textoItem: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  containerBotoesAcao: {
    flexDirection: 'row',
    gap: 8,
  },
  botaoQuadrado: {
    width: 38,
    height: 38,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fafafa',
  },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  botaoVoltar: {
    padding: 10,
    marginRight: 15,
  },
  textoBotaoVoltar: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  botaoFlutuante: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  textoBotaoFlutuante: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  fundoModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  conteudoModal: {
    width: '85%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  labelInput: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
    width: '100%',
  },
  containerBotoesModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  botaoModal: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  botaoSalvar: {
    backgroundColor: '#66b940',
  },
  botaoFechar: {
    backgroundColor: '#555454',
  },
  textoBotaoModal: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    height: 150,                // Define uma altura fixa para a área de texto
    backgroundColor: '#fff',
  }
});
