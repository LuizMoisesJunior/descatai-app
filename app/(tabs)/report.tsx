import { Ionicons } from '@expo/vector-icons';
import { ComponentProps, useEffect, useState } from 'react';
import { ActivityIndicator, Button, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface Reporte {
  id: string,
  titulo: string
}

export interface AcaoItem {
  nome: string;
  label: string;
  buttonColor:any
  iconName: ComponentProps<typeof Ionicons>['name']; // Garante apenas ícones válidos
  visible: (document: any) => boolean;  
  command: (item: Reporte) => void; // <--- O padrão Command aqui
}

export default function TelaReporte() {
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);
  
  const add = () => {
    console.log(`Adicionando um novo item`);
  };
 const view = (item: Reporte) => {
    console.log(`Visualizar: ${item.titulo}`);
  };

  const remove = (item: Reporte) => {
    console.log(`Remover: ${item.titulo}`);
  };

  const acoes: AcaoItem[] = [
    {
      nome: 'view',
      label: 'Visualizar',
      iconName: 'eye-outline',
      buttonColor:'#007AFF',
      visible: (document) => true,
      command: view // <--- Referência direta para a função local
    },
    {
      nome: 'remove',
      label: 'Remover',
      iconName: 'trash-outline',
      buttonColor:'#FF3B30',
      visible: (document) => true,
      command: remove // <--- Referência direta para a função local
    },
  ];

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = () => {
    setTimeout(() => {
      const dadosFicticios: Reporte[] = [
        { id: '1', titulo: 'Lixo na água' },
        { id: '2', titulo: 'escombros perto da escola' },
        { id: '3', titulo: 'Sacolas na grama' },
      ];
      setReportes(dadosFicticios);
      setCarregando(false);
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.cabecalho}>
        <TouchableOpacity style={styles.botaoVoltar} onPress={() => console.log('Voltar')}>
          <Text style={styles.textoBotaoVoltar}>←</Text>
        </TouchableOpacity>
        <Text style={styles.texto}>Reporte</Text>
      </View>

      {carregando ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={reportes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            /* 1. MUDANÇA ESTRUTURAL AQUI */
            <View style={styles.cardItem}>
              {/* O flex: 1 garante que textos longos quebrem linha sem empurrar os botões */}
              <Text style={styles.textoItem} numberOfLines={1}>{item.titulo}</Text>
              
              {acoes.length > 0 ? (
                <View style={styles.containerBotoesAcao}>
                  {acoes.map((acao) => {
            // Executa a validação dinâmica de visibilidade para cada item
            if (!acao.visible(item)) return null;

            return (
              <TouchableOpacity 
                key={acao.nome} 
                style={styles.botaoQuadrado} 
                onPress={() => acao.command(item)} // <--- Correção: Executa a função passando o item atual
              >
                <Ionicons name={acao.iconName} size={20} color={acao.buttonColor} />
              </TouchableOpacity>
            );
          })}
                </View>
              ) : null}
            
            </View>
          )}
          style={styles.lista}
        />
      )}
      <Button color="#09ff0099" title='+' onPress={add} ></Button>
    </View>
  );
}

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
  /* 2. NOVOS E AJUSTADOS ESTILOS ABAIXO */
  cardItem: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 12,
    width: '100%',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',        // Organiza texto e bloco de botões lado a lado
    alignItems: 'center',        // Centraliza verticalmente o texto e os botões
    justifyContent: 'space-between', // Joga o texto para a esquerda e botões para a direita
  },
  textoItem: {
    fontSize: 16,
    color: '#333',
    flex: 1,                     // Permite que o texto ocupe o espaço restante disponível
    marginRight: 10,             // Evita que o texto encoste nos botões
  },
  containerBotoesAcao: {
    flexDirection: 'row',        // Coloca os botões quadrados lado a lado
    gap: 8,                      // Espaçamento entre os dois botões quadrados
  },
  botaoQuadrado: {
    width: 38,                   // Altura e largura idênticas para formar o quadrado
    height: 38,
    borderRadius: 8,             // Cantos arredondados suaves idênticos ao mockup
    borderWidth: 1,
    borderColor: '#ddd',         // Borda fina cinza idêntica ao desenho
    alignItems: 'center',        // Centraliza o ícone horizontalmente
    justifyContent: 'center',   // Centraliza o ícone verticalmente
    backgroundColor: '#fafafa',  // Um fundo leve para destacar o botão do card
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
});
