import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

export type PontoColeta = {
  id: string;
  nome: string;
  entidade: string;
  endereco: string;
  horario: string;
};

type Props = {
  titulo: string;
  itens: string[];
  avisoTexto: string;
  pontos: PontoColeta[];
};

export default function CategoriaDetalhe({ titulo, itens, avisoTexto, pontos }: Props) {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/(tabs)/ecopontos')} style={styles.backBtn}>
          <Feather name="arrow-left" size={26} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pontos de Coleta</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.categoriaTitle}>{titulo}</Text>
        <Text style={styles.categoriaItens}>{itens.join(' · ')}</Text>

        <View style={styles.avisoBox}>
          <Feather name="info" size={16} color="#4A7C3F" style={styles.avisoIcon} />
          <Text style={styles.avisoTexto}>{avisoTexto}</Text>
        </View>

        {pontos.map((ponto) => (
          <View key={ponto.id} style={styles.card}>
            <Text style={styles.pontoNome}>{ponto.nome}</Text>
            <Text style={styles.pontoEntidade}>{ponto.entidade}</Text>

            <View style={styles.infoRow}>
              <Feather name="map-pin" size={14} color="#0D41A2" style={styles.infoIcon} />
              <Text style={styles.infoTexto}>{ponto.endereco}</Text>
            </View>

            <View style={styles.infoRow}>
              <Feather name="clock" size={14} color="#0D41A2" style={styles.infoIcon} />
              <Text style={styles.infoTexto}>{ponto.horario}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    backgroundColor: '#F5F7FA',
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 5,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Poppins_700Bold',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 36,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  categoriaTitle: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#0D41A2',
    marginTop: 8,
    marginBottom: 4,
  },
  categoriaItens: {
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    color: '#444444',
    marginBottom: 16,
    lineHeight: 20,
  },
  avisoBox: {
    backgroundColor: '#E8F5E1',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    gap: 8,
  },
  avisoIcon: {
    marginTop: 1,
    flexShrink: 0,
  },
  avisoTexto: {
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    color: '#2D5A27',
    flex: 1,
    lineHeight: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  pontoNome: {
    fontSize: 15,
    fontFamily: 'Poppins_600SemiBold',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  pontoEntidade: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: '#888888',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  infoIcon: {
    marginTop: 2,
    flexShrink: 0,
  },
  infoTexto: {
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    color: '#444444',
    flex: 1,
    lineHeight: 20,
  },
});