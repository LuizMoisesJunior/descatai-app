import { Fonts } from "@/constants/theme";
import { Picker } from "@react-native-picker/picker";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { MaskedTextInput } from "react-native-mask-text";
import { reporteService } from "../services/reporte.service";
import { usuarioService } from "../services/usuario.service";

export interface Reporte {
  id: string;
  assunto: string;
  categoria?: number | null;
  cep?: string;
  cidade?: string;
  logradouro?: string;
  rua?: string;
  numero?: string;
  complemento?: string;
  descricao?: string;
  status?: string;
  resposta_prefeitura?: string;
}

const corPrimaria = "#0F41A4";
const corVerdeDestaque = "#46B964";
const corBorda = "#232324";

const fonteRegular = (Fonts as any).regular || (Fonts as any).sans || "System";
const fonteSemiBold =
  (Fonts as any).semiBold || (Fonts as any).sans || "System";
const fonteBold = (Fonts as any).bold || (Fonts as any).sans || "System";

export default function CadastroScreen() {
  const parametro: any = useLocalSearchParams();
  const [userType, setUserType] = useState<"Cidadão" | "Prefeitura">("Cidadão");

  useEffect(() => {
    const carregarTipoUsuario = async () => {
      try {
        const usuarios = await usuarioService.listar();
        if (usuarios.length > 0) {
          const tipo =
            usuarios[0].tipo === "Analista" ? "Prefeitura" : "Cidadão";
          setUserType(tipo);
        }
      } catch (error) {
        console.warn("Erro ao carregar tipo de usuário no formulário:", error);
      }
    };
    carregarTipoUsuario();
  }, []);

  type FormMode = "create" | "edit" | "view";
  const mode = (parametro.mode as FormMode) || "create";

  const emptyDocument: Reporte = {
    id: "",
    assunto: "",
    cep: "",
    cidade: "",
    logradouro: "",
    rua: "",
    numero: "",
    complemento: "",
    descricao: "",
    status: "pendente",
    resposta_prefeitura: "",
  };

  const categoryOptions = [
    { value: 1, label: "Descarte Indevido" },
    { value: 2, label: "Lixo Acumulado" },
    { value: 3, label: "Outros" },
  ];

  const [documento, setDocumento] = useState<Reporte>(emptyDocument);
  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";
  const isCreateMode = mode === "create";

  const voltar = () => {
    router.back();
  };

  const salvar = async () => {
    if (!documento.assunto) {
      Alert.alert("Aviso", "Por favor, preencha o assunto.");
      return;
    }

    try {
      const dados: any = {
        assunto: documento.assunto,
        categoria: documento.categoria ? Number(documento.categoria) : null,
        cep: documento.cep || null,
        cidade: documento.cidade || null,
        logradouro: documento.logradouro || null,
        rua: documento.rua || null,
        numero: documento.numero || null,
        complemento: documento.complemento || null,
        descricao: documento.descricao || null,
        status: documento.status || "pendente",
        resposta_prefeitura: documento.resposta_prefeitura || null,
      };

      if (isCreateMode) {
        await reporteService.inserir(dados);
      } else if (isEditMode) {
        await reporteService.atualizar({ ...dados, id: documento.id });
      }

      Alert.alert("Sucesso", "Reporte salvo com sucesso!");
      voltar();
    } catch (error: any) {
      console.error("Erro ao salvar no Supabase:", error);
      Alert.alert(
        "Erro",
        "Não foi possível salvar: " + (error.message || "Erro desconhecido"),
      );
    }
  };

  const carregarDocumento = async () => {
    try {
      if (parametro.id) {
        const reporte = await reporteService.buscarPorId(
          parametro.id as string,
        );
        if (reporte) {
          setDocumento(reporte as Reporte);
        }
        return;
      }
      setDocumento(emptyDocument);
    } catch (error) {
      console.error("Erro ao carregar documento:", error);
    }
  };

  useEffect(() => {
    carregarDocumento();
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.conteudoFormulario}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.conteudoModal}>
            <Text style={styles.labelInput}>Assunto</Text>
            <TextInput
              style={styles.input}
              value={documento.assunto}
              editable={!isViewMode}
              onChangeText={(text) =>
                setDocumento((prev) => ({ ...prev, assunto: text }))
              }
              placeholder="Digite o assunto"
            />

            <Text style={styles.labelInput}>Categoria</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={documento.categoria}
                enabled={!isViewMode}
                onValueChange={(itemValue) => {
                  setDocumento((prev) => ({
                    ...prev,
                    categoria: itemValue ? Number(itemValue) : undefined,
                  }));
                }}
                itemStyle={
                  Platform.OS === "ios"
                    ? { height: 150, fontSize: 18, color: corPrimaria }
                    : {}
                }
              >
                <Picker.Item
                  label="Selecione uma opção..."
                  value={null}
                  color={Platform.OS === "ios" ? corPrimaria : undefined}
                />
                {categoryOptions.map((option) => (
                  <Picker.Item
                    key={option.value}
                    label={option.label}
                    value={option.value}
                    color={Platform.OS === "ios" ? corPrimaria : undefined}
                  />
                ))}
              </Picker>
            </View>

            <Text style={styles.labelInput}>CEP</Text>
            <MaskedTextInput
              mask="99999-999"
              keyboardType="numeric"
              value={documento.cep}
              editable={!isViewMode}
              onChangeText={(text) =>
                setDocumento((prev) => ({ ...prev, cep: text }))
              }
              style={styles.input}
              placeholder="00000-000"
            />

            <Text style={styles.labelInput}>Cidade</Text>
            <TextInput
              style={styles.input}
              value={documento.cidade}
              editable={!isViewMode}
              onChangeText={(text) =>
                setDocumento((prev) => ({ ...prev, cidade: text }))
              }
              placeholder="Informe a Cidade"
            />

            <Text style={styles.labelInput}>Logradouro</Text>
            <TextInput
              style={styles.input}
              value={documento.logradouro}
              editable={!isViewMode}
              onChangeText={(text) =>
                setDocumento((prev) => ({ ...prev, logradouro: text }))
              }
              placeholder="Informe o Logradouro"
            />

            <Text style={styles.labelInput}>Rua</Text>
            <TextInput
              style={styles.input}
              value={documento.rua}
              editable={!isViewMode}
              onChangeText={(text) =>
                setDocumento((prev) => ({ ...prev, rua: text }))
              }
              placeholder="Informe a Rua"
            />

            <Text style={styles.labelInput}>Número</Text>
            <TextInput
              style={styles.input}
              value={documento.numero}
              editable={!isViewMode}
              onChangeText={(text) =>
                setDocumento((prev) => ({ ...prev, numero: text }))
              }
              placeholder="Número"
            />

            <Text style={styles.labelInput}>Complemento</Text>
            <TextInput
              style={styles.input}
              value={documento.complemento}
              editable={!isViewMode}
              onChangeText={(text) =>
                setDocumento((prev) => ({ ...prev, complemento: text }))
              }
              placeholder="Complemento"
            />

            <Text style={styles.labelInput}>Descrição</Text>
            <TextInput
              style={styles.textArea}
              value={documento.descricao}
              editable={!isViewMode}
              onChangeText={(text) =>
                setDocumento((prev) => ({ ...prev, descricao: text }))
              }
              placeholder="Detalhes do reporte..."
              multiline={true}
              numberOfLines={6}
              textAlignVertical="top"
            />

            {userType === "Prefeitura" && !isCreateMode && (
              <View style={styles.adminSection}>
                <Text
                  style={[
                    styles.labelInput,
                    { color: corPrimaria, marginTop: 20 },
                  ]}
                >
                  Gerenciamento (Prefeitura)
                </Text>

                <Text style={styles.labelInput}>Status do Reporte</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={documento.status}
                    onValueChange={(value) =>
                      setDocumento((prev) => ({ ...prev, status: value }))
                    }
                    itemStyle={
                      Platform.OS === "ios"
                        ? { height: 120, fontSize: 16, color: corPrimaria }
                        : {}
                    }
                  >
                    <Picker.Item
                      label="Pendente"
                      value="pendente"
                      color={Platform.OS === "ios" ? corPrimaria : undefined}
                    />
                    <Picker.Item
                      label="Em Análise"
                      value="em_analise"
                      color={Platform.OS === "ios" ? corPrimaria : undefined}
                    />
                    <Picker.Item
                      label="Resolvido"
                      value="resolvido"
                      color={Platform.OS === "ios" ? corPrimaria : undefined}
                    />
                  </Picker>
                </View>

                <Text style={styles.labelInput}>Resposta para o Cidadão</Text>
                <TextInput
                  style={styles.textArea}
                  value={documento.resposta_prefeitura}
                  onChangeText={(text) =>
                    setDocumento((prev) => ({
                      ...prev,
                      resposta_prefeitura: text,
                    }))
                  }
                  placeholder="Digite o feedback aqui..."
                  multiline={true}
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            )}

            {userType === "Cidadão" && documento.resposta_prefeitura && (
              <View style={styles.citizenFeedback}>
                <Text style={[styles.labelInput, { color: corVerdeDestaque }]}>
                  Resposta da Prefeitura:
                </Text>
                <Text style={styles.feedbackText}>
                  {documento.resposta_prefeitura}
                </Text>
              </View>
            )}

            <View style={styles.containerBotoesModal}>
              <TouchableOpacity
                style={[styles.botaoModal, styles.botaoFechar]}
                onPress={voltar}
              >
                <Text style={styles.textoBotaoModal}>Voltar</Text>
              </TouchableOpacity>
              {!isViewMode && (
                <TouchableOpacity
                  style={[styles.botaoModal, styles.botaoSalvar]}
                  onPress={salvar}
                >
                  <Text style={styles.textoBotaoModal}>Salvar</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  conteudoFormulario: {
    padding: 20,
    paddingTop: 30,
    paddingBottom: 60,
    alignItems: "center",
  },
  conteudoModal: {
    width: "100%",
    backgroundColor: "white",
  },
  labelInput: {
    fontSize: 14,
    fontFamily: fonteSemiBold,
    color: "#000000",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: corBorda,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    width: "100%",
    fontFamily: fonteRegular,
    color: "#000000",
  },
  textArea: {
    borderWidth: 1,
    borderColor: corBorda,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    height: 120,
    backgroundColor: "#fff",
    fontFamily: fonteRegular,
    marginBottom: 20,
    color: "#000000",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: corBorda,
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: "#fff",
    overflow: Platform.OS === "ios" ? "visible" : "hidden",
    height: Platform.OS === "ios" ? 180 : 54,
    justifyContent: "center",
  },
  adminSection: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  citizenFeedback: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#F4FBF7",
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: corVerdeDestaque,
    marginBottom: 20,
  },
  feedbackText: {
    fontSize: 14,
    fontFamily: fonteRegular,
    color: "#333",
    lineHeight: 20,
  },
  containerBotoesModal: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 10,
  },
  botaoModal: {
    flex: 1,
    padding: 14,
    borderRadius: 100,
    alignItems: "center",
  },
  botaoSalvar: {
    backgroundColor: corPrimaria,
  },
  botaoFechar: {
    backgroundColor: "#555454",
  },
  textoBotaoModal: {
    color: "#fff",
    fontFamily: fonteBold,
    fontSize: 16,
  },
});
