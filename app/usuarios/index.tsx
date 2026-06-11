import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, FlatList, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { usuarioService, Perfil } from '../services/usuario.service';

export default function ListaUsuariosScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [usuarios, setUsuarios] = useState<Perfil[]>([]);
  const [carregando, setCarregando] = useState(true);

  const carregarUsuarios = async () => {
    setCarregando(true);
    try {
      const dados = await usuarioService.listar();
      setUsuarios(dados || []);
    } catch (error: any) {
      console.error('Erro ao carregar usuários:', error);
      Alert.alert('Erro', 'Não foi possível carregar a lista.');
    } finally {
      setCarregando(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarUsuarios();
    }, [])
  );

  const filteredUsuarios = usuarios.filter(u => 
    u.nome?.toLowerCase().includes(search.toLowerCase()) || 
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }: { item: Perfil }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => router.push({ pathname: '/usuarios/formulario', params: { id: item.id, mode: 'edit' } })}
    >
      <View style={styles.cardContent}>
        <View style={styles.userIcon}>
          <Ionicons name={item.tipo === 'Analista' ? "business-outline" : "person-outline"} size={24} color={'#0D41A2'} />
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.nome}</Text>
          <Text style={styles.userEmail}>{item.email}</Text>
          <View style={[styles.statusBadge, { backgroundColor: item.status === 'Ativo' ? '#EBF9F2' : '#FEE2E2' }]}>
            <Text style={[styles.statusText, { color: item.status === 'Ativo' ? '#5BB732' : '#EF4444' }]}>
              {item.status}
            </Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#A7A7A7" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={'#0D41A2'} />
        </TouchableOpacity>
        <Text style={styles.title}>Gerenciar Usuários</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#A7A7A7" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar usuário..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#A7A7A7"
        />
      </View>

      {carregando ? (
        <ActivityIndicator size="large" color="#0D41A2" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={filteredUsuarios}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhum usuário encontrado.</Text>
          }
        />
      )}

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => router.push({ pathname: '/usuarios/formulario', params: { mode: 'create' } })}
      >
        <Ionicons name="add" size={32} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Poppins_700Bold',
    color: '#0D41A2',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: 20,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D1D1',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#000000',
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#D1D1D1',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#333333',
  },
  userEmail: {
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    color: '#666666',
    marginBottom: 4,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 11,
    fontFamily: 'Poppins_700Bold',
  },
  emptyText: {
    textAlign: 'center',
    fontFamily: 'Poppins_400Regular',
    color: '#A7A7A7',
    marginTop: 40,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#0D41A2',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
