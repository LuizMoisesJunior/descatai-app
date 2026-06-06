import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = () => {
    console.log("Enviando credenciais de login:", { email, password });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.content}>
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.subtitle}>Entrar</Text>

        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu e-mail"
          placeholderTextColor="#757575"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite sua senha"
          placeholderTextColor="#757575"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Esqueceu a senha?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
          <Text style={styles.primaryButtonText}>Acessar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(auth)/register")}
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
  logo: {
    width: 160,
    height: 160,
    alignSelf: "center",
    marginBottom: 35,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333333",
    textAlign: "center",
    marginBottom: 32,
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
    color: "#333333",
    backgroundColor: "#F9F9F9",
  },
  forgotPassword: {
    color: "#1C76BF",
    textAlign: "right",
    marginBottom: 32,
    fontSize: 14,
  },
  primaryButton: {
    backgroundColor: "#0D41A2",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  footerContainer: {
    marginTop: 28,
  },
  registerLink: {
    textAlign: "center",
    color: "#333333",
    fontSize: 14,
  },
  registerLinkBold: {
    color: "#1C76BF",
    fontWeight: "bold",
  },
});
