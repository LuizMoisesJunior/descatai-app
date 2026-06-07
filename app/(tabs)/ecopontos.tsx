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
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Categoria = {
  id: string;
  nome: string;
  descricao: string;
  rota: string;
  icone: React.ReactNode;
  iconBgColor: string;
};

const categorias: Categoria[] = [
  {
    id: 'reciclaveis',
    nome: 'Recicláveis e volumosos',
    descricao: 'Papel, plástico, vidro, metal, entulho, móveis, podas, eletrodomésticos, óleo de cozinha',
    rota: '/ecopontos/reciclaveis',
    icone: <MaterialCommunityIcons name="recycle" size={30} color="#5A8A3C" />,
    iconBgColor: '#E8F5E1',
  },
  {
    id: 'eletronicos',
    nome: 'Eletrônicos e pilhas',
    descricao: 'Celular, tablet, carregadores, fones, pilhas e baterias',
    rota: '/ecopontos/eletronicos',
    icone: <Feather name="smartphone" size={28} color="#6B63B5" />,
    iconBgColor: '#EAE8F5',
  },
  {
    id: 'lampadas',
    nome: 'Lâmpadas',
    descricao: 'Lâmpadas fluorescentes, de LED e incandescentes usadas',
    rota: '/ecopontos/lampadas',
    icone: <Feather name="sun" size={28} color="#B5933C" />,
    iconBgColor: '#F5F0E8',
  },
  {
    id: 'medicamentos',
    nome: 'Medicamentos',
    descricao: 'Remédios vencidos ou em desuso, embalagens com resíduos, frascos de xarope, pomadas',
    rota: '/ecopontos/medicamentos',
    icone: <MaterialCommunityIcons name="pill" size={30} color="#B5436B" />,
    iconBgColor: '#F5E8EE',
  },
];

export default function EcopontosScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pontos de Coleta</Text>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.subtitle}>
          Selecione o tipo de resíduo que deseja descartar
        </Text>

        {categorias.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={styles.card}
            onPress={() => router.push(cat.rota as any)}
            activeOpacity={0.85}
          >
            <View style={[styles.iconContainer, { backgroundColor: cat.iconBgColor }]}>
              {cat.icone}
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>{cat.nome}</Text>
              <Text style={styles.cardDesc}>{cat.descricao}</Text>
            </View>
          </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Poppins_700Bold',
    color: '#333333',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: 'Poppins_600SemiBold',
    color: '#0D41A2',
    marginBottom: 20,
    marginTop: 8,
    lineHeight: 22,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    gap: 14,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#666666',
    lineHeight: 20,
  },
});