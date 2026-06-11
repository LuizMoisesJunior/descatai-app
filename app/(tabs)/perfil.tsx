import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Colors, Fonts } from '@/constants/theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { usuarioService, Perfil } from '../services/usuario.service';

export default function PerfilScreen() {
  const router = useRouter();
  const [user, setUser] = useState<Perfil | null>(null);
  const [carregando, setCarregando] = useState(true);

  const carregarPerfil = async () => {
    setCarregando(true);
    try {
      const usuarios = await usuarioService.listar();
      if (usuarios && usuarios.length > 0) {
        setUser(usuarios[0]);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      setUser(null);
    } finally {
      setCarregando(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarPerfil();
    }, [])
  );

  const menuItems = [
    {
      id: '1',
      title: 'Editar meus dados',
      icon: 'person-outline',
      route: user ? { pathname: '/usuarios/formulario', params: { id: user.id, mode: 'edit' } } : null,
      visible: !!user
    },
    ...(user?.tipo === 'Analista' ? [{
      id: 'admin_1',
      title: 'Gerenciar Usuários',
      icon: 'people-outline',
      route: '/usuarios',
      visible: true
    }] : []),
    {
      id: '2',
      title: 'Ver meus reportes',
      icon: 'document-text-outline',
      route: '/(tabs)/report',
      visible: true
    },
    {
      id: 'cadastrar',
      title: 'Criar uma conta / Cadastrar',
      icon: 'person-add-outline',
      route: { pathname: '/usuarios/formulario', params: { mode: 'create' } },
      visible: !user,
      color: Colors.secondary
    },
    {
      id: '4',
      title: 'Sair / Trocar Conta',
      icon: 'log-out-outline',
      onPress: () => router.replace('/(auth)/login'),
      color: '#FF3B30',
      visible: true 
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <MaterialCommunityIcons name="account-circle" size={80} color={Colors.primary || '#0D41A2'} />
          </View>
          
          {carregando ? (
            <ActivityIndicator size="small" color={Colors.primary} />
          ) : user ? (
            <>
              <Text style={styles.userName}>{user.nome}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
              <View style={[styles.typeBadge, { backgroundColor: user.tipo === 'Analista' ? Colors.primary : Colors.secondary }]}>
                <Text style={styles.typeBadgeText}>{user.tipo}</Text>
              </View>
            </>
          ) : (
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.userName}>Visitante</Text>
              <Text style={styles.userEmail}>Conecte-se para ver seus dados</Text>
            </View>
          )}
        </View>

        {user && (
          <View style={styles.infoCard}>
            <Text style={styles.cardTitle}>Dados Cadastrados</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{user.tipo === 'Analista' ? 'CNPJ' : 'CPF'}</Text>
              <Text style={styles.infoValue}>{user.documento || 'Não informado'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Status da Conta</Text>
              <Text style={[styles.infoValue, { color: user.status === 'Ativo' ? Colors.secondary : '#FF3B30' }]}>
                {user.status}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.menuContainer}>
          {menuItems.filter(i => i.visible).map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.menuItem}
              onPress={() => {
                if (item.onPress) item.onPress();
                else if (item.route) router.push(item.route as any);
              }}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name={item.icon as any} size={24} color={item.color || Colors.primary} />
                <Text style={[styles.menuItemText, item.color ? { color: item.color } : {}]}>
                  {item.title}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background || '#F9F9F9',
  },
  scrollContainer: {
    padding: 24,
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    marginBottom: 8,
  },
  userName: {
    fontSize: 22,
    fontFamily: 'Poppins_700Bold',
    color: Colors.text || '#333',
    textAlign: 'center'
  },
  userEmail: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: Colors.gray || '#A7A7A7',
    marginBottom: 8,
    textAlign: 'center'
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginTop: 4
  },
  typeBadgeText: {
    color: Colors.white || '#FFF',
    fontFamily: 'Poppins_700Bold',
    fontSize: 12,
  },
  infoCard: {
    backgroundColor: Colors.white || '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.placeholderStroke || '#D1D1D1',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: Colors.primary || '#0D41A2',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.placeholderFill || '#F9F9F9',
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: Colors.gray || '#A7A7A7',
  },
  infoValue: {
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
    color: Colors.text || '#333',
  },
  menuContainer: {
    backgroundColor: Colors.white || '#FFF',
    borderRadius: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: Colors.placeholderStroke || '#D1D1D1',
    marginBottom: 40,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.placeholderFill || '#F9F9F9',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: Colors.text || '#333',
  },
});
