import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function RegisterScreen() {
  const router = useRouter();

  const [nome, setNome] = useState<string>("");
  const [cpf, setCpf] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const handleRegister = () => {
    if (password !== confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }
    console.log("Enviando dados de cadastro:", { nome, cpf, email, password });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => router.push("/(auth)/login")}
            style={styles.backButton}
          >
            {}
            <Text style={styles.backArrowText}>←</Text>
          </TouchableOpacity>
        </View>

        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.subtitle}>Cadastrar-se</Text>

        <Text style={styles.label}>Nome*</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu nome"
          placeholderTextColor="#757575"
          value={nome}
          onChangeText={setNome}
        />

        <Text style={styles.label}>CPF*</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu CPF"
          placeholderTextColor="#757575"
          value={cpf}
          onChangeText={setCpf}
          keyboardType="numeric"
        />

        <Text style={styles.label}>E-mail*</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu e-mail"
          placeholderTextColor="#757575"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Senha*</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite sua senha"
          placeholderTextColor="#757575"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Text style={styles.label}>Repita a senha*</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite sua senha novamente"
          placeholderTextColor="#757575"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.primaryButton} onPress={handleRegister}>
          <Text style={styles.primaryButtonText}>Criar conta</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(auth)/login")}
          style={styles.footerContainer}
        >
          <Text style={styles.loginLink}>
            Já possui uma conta?{" "}
            <Text style={styles.loginLinkBold}>Faça o login</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 80,
  },
  headerContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 10,
  },
  backButton: {
    padding: 4,
  },
  backArrowText: {
    fontSize: 38,
    color: "#333333",
    fontWeight: "700",
    lineHeight: 38,
  },
  logo: {
    width: 140,
    height: 140,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333333",
    textAlign: "left",
    marginBottom: 28,
  },
  label: {
    fontSize: 16,
    color: "#333333",
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D1D1",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: "#F9F9F9",
    color: "#333333",
  },
  primaryButton: {
    backgroundColor: "#0D41A2",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 15,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  footerContainer: {
    marginTop: 32,
  },
  loginLink: {
    textAlign: "center",
    color: "#333333",
    fontSize: 14,
  },
  loginLinkBold: {
    color: "#1C76BF",
    fontWeight: "bold",
  },
});
