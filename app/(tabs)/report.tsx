import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import React, { ComponentProps, useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import { reporteService } from '../services/reporte.service';
import { usuarioService } from '../services/usuario.service';
import { Colors, Fonts } from '@/constants/theme';

export interface Reporte {
  id: string;
  assunto: string;
  categoria?: number | null;
  cep?: string;
  cidade?: string;
  logradouro?: string;
  rua?: string;
  numero?: string;
  complemento?: string;
  descricao?: string;
  status?: string;
  resposta_prefeitura?: string;
}

export interface AcaoItem {
  nome: string;
  label: string;
  buttonColor: string;
  iconName: ComponentProps<typeof Ionicons>['name'];
  visible: (userType: string) => boolean;
  command: (item: Reporte) => void;
}

export default function TelaReporte() {
  const [documents, setDocuments] = useState<Reporte[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [userType, setUserType] = useState<'Cidadão' | 'Prefeitura'>('Cidadão');

  const carregarDados = async () => {
    setCarregando(true);
    try {
      const usuarios = await usuarioService.listar();
      if (usuarios.length > 0) {
        const tipo = usuarios[0].tipo === 'Analista' ? 'Prefeitura' : 'Cidadão';
        setUserType(tipo);
      }
      const dados = await reporteService.listar();
      setDocuments(dados);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setCarregando(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [])
  );

  const add = () => {
    router.push({ pathname: '/report/formulario', params: { mode: 'create' } });
  };

  const view = (item: Reporte) => {
    router.push({ pathname: '/report/formulario', params: { id: item.id, mode: 'view' } });
  };

  const edit = (item: Reporte) => {
    router.push({ pathname: '/report/formulario', params: { id: item.id, mode: 'edit' } });
  };

  const remove = async (item: Reporte) => {
    Alert.alert(
      "Confirmar Exclusão",
      "Deseja realmente excluir este reporte?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir", 
          style: "destructive",
          onPress: async () => {
            try {
              await reporteService.remover(item.id);
              carregarDados();
            } catch (error) {
              Alert.alert("Erro", "Não foi possível remover o item.");
            }
          }
        }
      ]
    );
  };

  const acoes: AcaoItem[] = [
    {
      nome: 'view',
      label: 'Visualizar',
      iconName: 'eye-outline',
      buttonColor: '#0D41A2',
      visible: () => true, 
      command: view
    },
    {
      nome: 'edit',
      label: 'Editar',
      iconName: 'create-outline',
      buttonColor: '#5BB732',
      visible: (type) => type === 'Prefeitura', 
      command: edit
    },
    {
      nome: 'remove',
      label: 'Remover',
      iconName: 'trash-outline',
      buttonColor: '#FF3B30',
      visible: (type) => type === 'Prefeitura', 
      command: remove
    },
  ];

  const getStatusStyle = (status: string | undefined) => {
    switch (status?.toLowerCase()) {
      case 'resolvido': return { bg: '#EBF9F2', text: '#2D6A4F' };
      case 'em_analise': return { bg: '#FFF9DB', text: '#F59E0B' };
      default: return { bg: '#FEE2E2', text: '#EF4444' };
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.cabecalho}>
        <TouchableOpacity style={styles.botaoVoltar} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.texto}>Reportes</Text>
      </View>

      {carregando ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#0D41A2" />
        </View>
      ) : (
        <FlatList
          data={documents}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const statusStyle = getStatusStyle(item.status);
            return (
              <View style={styles.cardItem}>
                <View style={styles.infoContainer}>
                  <Text style={styles.textoItem} numberOfLines={1}>{item.assunto}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                    <Text style={[styles.statusText, { color: statusStyle.text }]}>
                      {(item.status || 'pendente').replace('_', ' ')}
                    </Text>
                  </View>
                </View>

                <View style={styles.containerBotoesAcao}>
                  {acoes.filter(acao => acao.visible(userType)).map((acao) => (
                    <TouchableOpacity
                      key={acao.nome}
                      style={styles.botaoQuadrado}
                      onPress={() => acao.command(item)}
                    >
                      <Ionicons name={acao.iconName} size={20} color={acao.buttonColor} />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            );
          }}
          style={styles.lista}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="document-text-outline" size={64} color="#A7A7A7" />
              <Text style={styles.emptyText}>Nenhum reporte encontrado.</Text>
            </View>
          }
        />
      )}

      {userType === 'Cidadão' && (
        <TouchableOpacity style={styles.fab} onPress={add}>
          <Ionicons name="add" size={32} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9', paddingHorizontal: 20, paddingTop: 60 },
  cabecalho: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  botaoVoltar: { marginRight: 15 },
  texto: { fontSize: 24, fontFamily: 'Poppins_700Bold', color: '#0D41A2' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  lista: { flex: 1 },
  cardItem: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#D1D1D1', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', elevation: 2 },
  infoContainer: { flex: 1, marginRight: 10 },
  textoItem: { fontSize: 16, fontFamily: 'Poppins_600SemiBold', color: '#333', marginBottom: 4 },
  statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  statusText: { fontSize: 10, fontFamily: 'Poppins_700Bold', textTransform: 'uppercase' },
  containerBotoesAcao: { flexDirection: 'row', gap: 8 },
  botaoQuadrado: { width: 38, height: 38, borderRadius: 8, borderWidth: 1, borderColor: '#D1D1D1', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' },
  fab: { position: 'absolute', right: 20, bottom: 30, width: 60, height: 60, borderRadius: 30, backgroundColor: '#5BB732', justifyContent: 'center', alignItems: 'center', elevation: 5 },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { marginTop: 16, fontSize: 16, fontFamily: 'Poppins_400Regular', color: '#A7A7A7', textAlign: 'center' },
});
