import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, SafeAreaView, ScrollView, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Fonts } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { MaskedTextInput } from 'react-native-mask-text';

export default function EditarPerfilScreen() {
  const router = useRouter();
  
  // Estado para o formulário
  const [nome, setNome] = useState('Lucas da Silva');
  const [cpf, setCpf] = useState('123.456.789-00');
  const [email, setEmail] = useState('lucas@email.com');
  const [senha, setSenha] = useState('********');
  const [confirmarSenha, setConfirmarSenha] = useState('********');
  const [showSenha, setShowSenha] = useState(false);

  // Histórico para a Listagem (FlatList)
  const [historico, setHistorico] = useState([
    { id: '1', data: '05/06/2026', acao: 'Perfil Atualizado' },
    { id: '2', data: '02/06/2026', acao: 'Cadastro Inicial' },
  ]);

  const handleSalvar = () => {
    // Lógica para salvar
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={Colors.primary} />
            </TouchableOpacity>
            <Text style={styles.title}>Editar Perfil</Text>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.label}>Nome*</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu nome"
              placeholderTextColor={Colors.placeholder}
              value={nome}
              onChangeText={setNome}
            />

            <Text style={styles.label}>CPF*</Text>
            <MaskedTextInput
              mask="999.999.999-99"
              style={styles.input}
              placeholder="Digite seu CPF"
              placeholderTextColor={Colors.placeholder}
              keyboardType="numeric"
              value={cpf}
              onChangeText={setCpf}
            />

            <Text style={styles.label}>E-mail*</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu e-mail"
              placeholderTextColor={Colors.placeholder}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <Text style={styles.label}>Senha*</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, { flex: 1, marginBottom: 0 }]}
                placeholder="Digite sua senha"
                placeholderTextColor={Colors.placeholder}
                secureTextEntry={!showSenha}
                value={senha}
                onChangeText={setSenha}
              />
              <TouchableOpacity onPress={() => setShowSenha(!showSenha)} style={styles.eyeIcon}>
                <Ionicons name={showSenha ? "eye-off-outline" : "eye-outline"} size={24} color={Colors.gray} />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Repita a senha*</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite sua senha novamente"
              placeholderTextColor={Colors.placeholder}
              secureTextEntry={!showSenha}
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleSalvar}>
              <Text style={styles.saveButtonText}>Salvar Alterações</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.listSection}>
            <Text style={styles.sectionTitle}>Histórico de Acessos</Text>
            <FlatList
              data={historico}
              keyExtractor={(item) => item.id}
              scrollEnabled={false} // FlatList dentro de ScrollView
              renderItem={({ item }) => (
                <View style={styles.historyCard}>
                  <View style={styles.historyIcon}>
                    <Ionicons name="time-outline" size={20} color={Colors.secondary} />
                  </View>
                  <View>
                    <Text style={styles.historyAction}>{item.acao}</Text>
                    <Text style={styles.historyDate}>{item.data}</Text>
                  </View>
                </View>
              )}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContainer: {
    padding: 24,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: Colors.primary,
  },
  formCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: Colors.placeholderStroke,
  },
  label: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.placeholderFill,
    borderWidth: 1,
    borderColor: Colors.placeholderStroke,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.text,
    marginBottom: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: Colors.white,
  },
  listSection: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: Colors.primary,
    marginBottom: 16,
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.placeholderStroke,
  },
  historyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundAlt,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  historyAction: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
  },
  historyDate: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.gray,
  },
});
