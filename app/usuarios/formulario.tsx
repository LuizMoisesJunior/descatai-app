import { Colors, Fonts } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator
} from "react-native";
import { MaskedTextInput } from "react-native-mask-text";
import { usuarioService, Perfil } from "../services/usuario.service";

export default function FormularioUsuarioScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const isEditMode = params.mode === "edit";

  const [id, setId] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [documento, setDocumento] = useState("");
  const [tipo, setTipo] = useState<'Usuário' | 'Analista'>("Usuário");
  const [status, setStatus] = useState<'Ativo' | 'Inativo'>("Ativo");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (isEditMode && params.id) {
      carregarUsuario(params.id as string);
    }
  }, [isEditMode, params.id]);

  const carregarUsuario = async (userId: string) => {
    setCarregando(true);
    try {
      const u = await usuarioService.buscarPorId(userId);
      if (u) {
        setId(u.id);
        setNome(u.nome || "");
        setEmail(u.email || "");
        setDocumento(u.documento || "");
        setTipo(u.tipo || "Usuário");
        setStatus(u.status || "Ativo");
        setSenha(u.senha || "");
        setConfirmarSenha(u.senha || "");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível carregar os dados.");
    } finally {
      setCarregando(false);
    }
  };

  const handleSalvar = async () => {
    if (!nome || !email) {
      Alert.alert("Aviso", "Nome e E-mail são obrigatórios.");
      return;
    }

    if (!isEditMode && !senha) {
      Alert.alert("Aviso", "A senha é obrigatória.");
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    setCarregando(true);
    try {
      const dadosParaEnviar = {
        nome,
        email,
        documento: documento || null,
        tipo,
        status,
        senha
      };

      if (isEditMode) {
        await usuarioService.atualizar({ ...dadosParaEnviar, id } as any);
        Alert.alert("Sucesso", "Perfil atualizado!");
      } else {
        await usuarioService.inserir(dadosParaEnviar);
        Alert.alert("Sucesso", "Cadastro realizado!");
      }
      router.back();
    } catch (error: any) {
      console.error('Erro ao salvar:', error);
      Alert.alert("Erro", "Falha ao salvar: " + (error.message || "Tente novamente."));
    } finally {
      setCarregando(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={'#0D41A2'} />
            </TouchableOpacity>
            <Text style={styles.title}>
              {isEditMode ? "Editar Perfil" : "Novo Cadastro"}
            </Text>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.label}>Você é:</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={tipo}
                onValueChange={(val) => setTipo(val as any)}
                itemStyle={{ height: 120, color: '#0D41A2', fontSize: 18, fontFamily: 'Poppins_600SemiBold' }}
              >
                <Picker.Item label="Cidadão (Usuário)" value="Usuário" />
                <Picker.Item label="Analista (Prefeitura)" value="Analista" />
              </Picker>
            </View>

            <Text style={styles.label}>Nome Completo*</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu nome"
              placeholderTextColor="#A7A7A7"
              value={nome}
              onChangeText={setNome}
            />

            <Text style={styles.label}>E-mail*</Text>
            <TextInput
              style={styles.input}
              placeholder="exemplo@email.com"
              placeholderTextColor="#A7A7A7"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <Text style={styles.label}>Senha*</Text>
            <TextInput
              style={styles.input}
              placeholder="Mínimo 6 dígitos"
              placeholderTextColor="#A7A7A7"
              secureTextEntry
              value={senha}
              onChangeText={setSenha}
            />

            <Text style={styles.label}>Confirmar Senha*</Text>
            <TextInput
              style={styles.input}
              placeholder="Repita a senha"
              placeholderTextColor="#A7A7A7"
              secureTextEntry
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
            />

            <TouchableOpacity 
              style={[styles.saveButton, carregando && { opacity: 0.7 }]} 
              onPress={handleSalvar}
              disabled={carregando}
            >
              {carregando ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.saveButtonText}>Finalizar Cadastro</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9' },
  scrollContainer: { padding: 24, paddingTop: 60 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 24 },
  backButton: { padding: 4 },
  title: { fontSize: 22, fontFamily: 'Poppins_700Bold', color: '#0D41A2', marginLeft: 16 },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#D1D1D1',
    elevation: 4,
  },
  label: { fontSize: 14, fontFamily: 'Poppins_600SemiBold', color: '#333333', marginBottom: 8 },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D1D1',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: "#000000",
    marginBottom: 16,
  },
  pickerContainer: {
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: '#D1D1D1',
    borderRadius: 8,
    marginBottom: 16,
    height: Platform.OS === 'ios' ? 140 : 55,
    justifyContent: 'center',
    overflow: 'hidden'
  },
  saveButton: {
    backgroundColor: '#5BB732',
    padding: 18,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10
  },
  saveButtonText: { fontSize: 16, fontFamily: 'Poppins_700Bold', color: '#FFFFFF' },
});
