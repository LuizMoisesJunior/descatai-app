import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView, Dimensions, ActivityIndicator, Image } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Colors, Fonts } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { usuarioService } from '../services/usuario.service';

export default function HomeScreen() {
  const router = useRouter();
  const [userType, setUserType] = useState<'Cidadão' | 'Prefeitura'>('Cidadão');
  const [carregando, setCarregando] = useState(true);

  const carregarTipoUsuario = async () => {
    setCarregando(true);
    try {
      const usuarios = await usuarioService.listar();
      if (usuarios && usuarios.length > 0) {
        const tipo = usuarios[0].tipo === 'Analista' ? 'Prefeitura' : 'Cidadão';
        setUserType(tipo);
      }
    } catch (error) {
      console.error('Erro ao carregar perfil na Home:', error);
      setUserType('Cidadão');
    } finally {
      setCarregando(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarTipoUsuario();
    }, [])
  );

  const menuItems = userType === 'Cidadão' ? [
    {
      id: '1',
      title: 'Realizar um reporte de lixo',
      description: 'Relate um local com descarte indevido para que a prefeitura possa agir.',
      buttonText: 'Reportar',
      icon: 'recycle',
      route: '/report',
    },
    {
      id: '2',
      title: 'Pontos de Coleta',
      description: 'Localize pontos de descarte correto próximos a você.',
      buttonText: 'Localizar',
      icon: 'map-marker-outline',
      route: '/ecopontos',
    },
  ] : [
    {
      id: '1',
      title: 'Analisar reportes',
      description: 'Veja os problemas relatados e mude o status para resolvido.',
      buttonText: 'Analisar',
      icon: 'clipboard-text-search-outline',
      route: '/report',
    },
    {
      id: '2',
      title: 'Gerenciar Ecopontos',
      description: 'Cadastre novos locais de coleta no sistema.',
      buttonText: 'Gerenciar',
      icon: 'map-marker-plus-outline',
      route: '/ecopontos',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Image 
              source={require("../../assets/images/logo.png")} 
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.welcomeText}>Bem-vindo, o que deseja fazer?</Text>
        </View>

        {carregando ? (
          <ActivityIndicator size="large" color={Colors.primary || '#0D41A2'} style={{ marginTop: 50 }} />
        ) : (
          menuItems.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <MaterialCommunityIcons name={item.icon as any} size={32} color={Colors.primary || '#0D41A2'} />
                <Text style={styles.cardTitle}>{item.title}</Text>
              </View>
              <Text style={styles.cardDescription}>{item.description}</Text>
              <TouchableOpacity 
                style={styles.cardButton} 
                onPress={() => router.push(item.route as any)}
              >
                <Text style={styles.cardButtonText}>{item.buttonText}</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  scrollContent: {
    padding: 24,
    paddingTop: 40,
  },
  header: {
    marginBottom: 32,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 100,
    height: 32,
    alignSelf: 'flex-start',
  },
  welcomeText: {
    fontSize: 18,
    color: '#0D41A2',
    fontFamily: 'Poppins_600SemiBold',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#EEE',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
    color: '#333',
    flex: 1,
  },
  cardDescription: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#666',
    marginBottom: 20,
    lineHeight: 20,
  },
  cardButton: {
    backgroundColor: '#0D41A2',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cardButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins_700Bold',
    color: '#FFFFFF',
  },
});
