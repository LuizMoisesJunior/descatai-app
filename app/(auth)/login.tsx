import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator
} from "react-native";
import { supabase } from "../../services/supabase";

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [secureMode, setSecureMode] = useState(true);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Aviso", "Por favor, preencha e-mail e senha.");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("perfis")
        .select("*")
        .eq("email", email.trim().toLowerCase())
        .eq("senha", password)
        .single();

      if (error || !data) {
        Alert.alert("Erro", "E-mail ou senha incorretos.");
      } else {
        await AsyncStorage.setItem("@usuario_logado", JSON.stringify(data));
        router.replace("/(tabs)");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Ocorreu um erro ao tentar entrar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/images/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.subtitle}>Entrar na sua conta</Text>

        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          placeholder="email@exemplo.com"
          placeholderTextColor="#757575"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Senha</Text>
        <View style={styles.inputSenhaContainer}>
          <TextInput
            style={styles.inputSenha}
            placeholder="Digite sua senha"
            placeholderTextColor="#757575"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={secureMode}
          />
          <TouchableOpacity
            style={styles.botaoOlho}
            onPress={() => setSecureMode(!secureMode)}
          >
            <Ionicons
              name={secureMode ? "eye-off-outline" : "eye-outline"}
              size={22}
              color="#757575"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.primaryButton, loading && { opacity: 0.7 }]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.primaryButtonText}>Acessar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/usuarios/formulario",
              params: { mode: "create" },
            })
          }
          style={styles.footerContainer}
        >
          <Text style={styles.registerLink}>
            Ainda não possui uma conta?{" "}
            <Text style={styles.registerLinkBold}>Cadastre-se aqui</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    fontFamily: "Poppins_600SemiBold",
    color: "#333333",
    textAlign: "center",
    marginBottom: 32,
  },
  label: {
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
    color: "#33",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D1D1",
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
    color: "#000",
    backgroundColor: "#F9F9F9",
  },
  inputSenhaContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D1D1",
    borderRadius: 8,
    backgroundColor: "#F9F9F9",
    marginBottom: 16,
  },
  inputSenha: {
    flex: 1,
    padding: 14,
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
    color: "#000",
  },
  botaoOlho: {
    paddingHorizontal: 14,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  primaryButton: {
    backgroundColor: "#0D41A2",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
    elevation: 3,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Poppins_700Bold",
  },
  footerContainer: {
    marginTop: 30,
  },
  registerLink: {
    textAlign: "center",
    color: "#333",
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
  },
  registerLinkBold: {
    color: "#5BB732",
    fontFamily: "Poppins_700Bold",
  },
});
