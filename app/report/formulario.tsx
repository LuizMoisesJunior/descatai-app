import { Picker } from '@react-native-picker/picker';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView, Alert, Platform } from 'react-native';
import { MaskedTextInput } from 'react-native-mask-text';
import { reporteService } from '../services/reporte.service';
import { usuarioService } from '../services/usuario.service';
import { Colors, Fonts } from '@/constants/theme';

export interface Reporte {
  id: string;
  assunto: string;
  categoria?: number;
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

export default function CadastroScreen() {
  const parametro: any = useLocalSearchParams();
  const [userType, setUserType] = useState<'Cidadão' | 'Prefeitura'>('Cidadão');

  useEffect(() => {
    const carregarTipoUsuario = async () => {
      try {
        const usuarios = await usuarioService.listar();
        if (usuarios.length > 0) {
          // Mapeia 'Analista' para 'Prefeitura' para mostrar os campos administrativos
          const tipo = usuarios[0].tipo === 'Analista' ? 'Prefeitura' : 'Cidadão';
          setUserType(tipo);
        }
      } catch (error) {
        console.warn('Erro ao carregar tipo de usuário no formulário:', error);
      }
    };
    carregarTipoUsuario();
  }, []);

  type FormMode = 'create' | 'edit' | 'view';
  const mode = (parametro.mode as FormMode) || 'create';

  const emptyDocument: Reporte = {
    id: '',
    assunto: '',
    cep: '',
    cidade: '',
    logradouro: '',
    rua: '',
    numero: '',
    complemento: '',
    descricao: '',
    status: 'pendente',
    resposta_prefeitura: ''
  };

  const categoryOptions = [
    { value: 1, label: 'Descarte Indevido' },
    { value: 2, label: 'Lixo Acumulado' },
    { value: 3, label: 'Outros' },
  ];

  const [documento, setDocumento] = useState<Reporte>(emptyDocument);
  const isViewMode = mode === 'view';
  const isEditMode = mode === 'edit';
  const isCreateMode = mode === 'create';

  const voltar = () => {
    router.back();
  };

  const salvar = async () => {
    if (!documento.assunto) {
      Alert.alert('Aviso', 'Por favor, preencha o assunto.');
      return;
    }

    try {
      // Criamos um objeto apenas com os campos que existem na tabela 'reportes'
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
        status: documento.status || 'pendente',
        resposta_prefeitura: documento.resposta_prefeitura || null
      };

      if (isCreateMode) {
        await reporteService.inserir(dados);
      } else if (isEditMode) {
        await reporteService.atualizar({ ...dados, id: documento.id });
      }
      
      Alert.alert('Sucesso', 'Reporte salvo com sucesso!');
      voltar();
    } catch (error: any) {
      console.error('Erro ao salvar no Supabase:', error);
      // Mostra o erro real para sabermos o que o banco está rejeitando
      Alert.alert('Erro', 'Não foi possível salvar: ' + (error.message || 'Erro desconhecido'));
    }
  };

  const carregarDocumento = async () => {
    try {
      if (parametro.id) {
        const reporte = await reporteService.buscarPorId(parametro.id as string);
        if (reporte) {
          setDocumento(reporte);
        }
        return;
      }
      setDocumento(emptyDocument);
    } catch (error) {
      console.error('Erro ao carregar documento:', error);
    }
  };

  useEffect(() => {
    carregarDocumento();
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.conteudoFormulario}
    >
      <View style={styles.conteudoModal}>
        <Text style={styles.labelInput}>Assunto</Text>
        <TextInput
          style={styles.input}
          value={documento.assunto}
          editable={!isViewMode}
          onChangeText={(text) => setDocumento(prev => ({ ...prev, assunto: text }))}
          placeholder="Digite o assunto"
        />

        <Text style={styles.labelInput}>Categoria</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={documento.categoria}
            enabled={!isViewMode}
            onValueChange={(itemValue) => {
              setDocumento(prev => ({ ...prev, categoria: itemValue ? Number(itemValue) : undefined }));
            }}
            itemStyle={Platform.OS === 'ios' ? { height: 150, fontSize: 18, color: '#0D41A2' } : {}}
          >
            <Picker.Item label="Selecione uma opção..." value={null} color={Platform.OS === 'ios' ? '#0D41A2' : undefined} />
            {categoryOptions.map((option) => (
              <Picker.Item 
                key={option.value} 
                label={option.label} 
                value={option.value} 
                color={Platform.OS === 'ios' ? '#0D41A2' : undefined} 
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
          onChangeText={(text) => setDocumento(prev => ({ ...prev, cep: text }))}
          style={styles.input}
          placeholder="00000-000"
        />

        <Text style={styles.labelInput}>Cidade</Text>
        <TextInput
          style={styles.input}
          value={documento.cidade}
          editable={!isViewMode}
          onChangeText={(text) => setDocumento(prev => ({ ...prev, cidade: text }))}
          placeholder="Informe a Cidade"
        />

        <Text style={styles.labelInput}>Logradouro</Text>
        <TextInput
          style={styles.input}
          value={documento.logradouro}
          editable={!isViewMode}
          onChangeText={(text) => setDocumento(prev => ({ ...prev, logradouro: text }))}
          placeholder="Informe o Logradouro"
        />

        <Text style={styles.labelInput}>Rua</Text>
        <TextInput
          style={styles.input}
          value={documento.rua}
          editable={!isViewMode}
          onChangeText={(text) => setDocumento(prev => ({ ...prev, rua: text }))}
          placeholder="Informe a Rua"
        />

        <Text style={styles.labelInput}>Número</Text>
        <TextInput
          style={styles.input}
          value={documento.numero}
          editable={!isViewMode}
          onChangeText={(text) => setDocumento(prev => ({ ...prev, numero: text }))}
          placeholder="Número"
        />

        <Text style={styles.labelInput}>Complemento</Text>
        <TextInput
          style={styles.input}
          value={documento.complemento}
          editable={!isViewMode}
          onChangeText={(text) => setDocumento(prev => ({ ...prev, complemento: text }))}
          placeholder="Complemento"
        />

        <Text style={styles.labelInput}>Descrição</Text>
        <TextInput
          style={styles.textArea}
          value={documento.descricao}
          editable={!isViewMode}
          onChangeText={(text) => setDocumento(prev => ({ ...prev, descricao: text }))}
          placeholder="Detalhes do reporte..."
          multiline={true}
          numberOfLines={6}
          textAlignVertical="top"
        />

        {/* GERENCIAMENTO PREFEITURA */}
        {userType === 'Prefeitura' && !isCreateMode && (
          <View style={styles.adminSection}>
            <Text style={[styles.labelInput, { color: Colors.primary, marginTop: 20 }]}>Gerenciamento (Prefeitura)</Text>
            
            <Text style={styles.labelInput}>Status do Reporte</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={documento.status}
                onValueChange={(value) => setDocumento(prev => ({ ...prev, status: value }))}
                itemStyle={Platform.OS === 'ios' ? { height: 120, fontSize: 16, color: '#0D41A2' } : {}}
              >
                <Picker.Item label="Pendente" value="pendente" color={Platform.OS === 'ios' ? '#0D41A2' : undefined} />
                <Picker.Item label="Em Análise" value="em_analise" color={Platform.OS === 'ios' ? '#0D41A2' : undefined} />
                <Picker.Item label="Resolvido" value="resolvido" color={Platform.OS === 'ios' ? '#0D41A2' : undefined} />
              </Picker>
            </View>

            <Text style={styles.labelInput}>Resposta para o Cidadão</Text>
            <TextInput
              style={styles.textArea}
              value={documento.resposta_prefeitura}
              onChangeText={(text) => setDocumento(prev => ({ ...prev, resposta_prefeitura: text }))}
              placeholder="Digite o feedback aqui..."
              multiline={true}
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        )}

        {userType === 'Cidadão' && documento.resposta_prefeitura && (
          <View style={styles.citizenFeedback}>
            <Text style={[styles.labelInput, { color: Colors.secondary }]}>Resposta da Prefeitura:</Text>
            <Text style={styles.feedbackText}>{documento.resposta_prefeitura}</Text>
          </View>
        )}

        <View style={styles.containerBotoesModal}>
          <TouchableOpacity style={[styles.botaoModal, styles.botaoFechar]} onPress={voltar}>
            <Text style={styles.textoBotaoModal}>Voltar</Text>
          </TouchableOpacity>
          {!isViewMode && (
            <TouchableOpacity style={[styles.botaoModal, styles.botaoSalvar]} onPress={salvar}>
              <Text style={styles.textoBotaoModal}>Salvar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  conteudoFormulario: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
  },
  conteudoModal: {
    width: '100%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  labelInput: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    color: '#333',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
    width: '100%',
    fontFamily: Fonts.regular,
    color: '#000', // Força cor preta para o texto digitado
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    height: 120,
    backgroundColor: '#fff',
    fontFamily: Fonts.regular,
    marginBottom: 20,
    color: '#000', // Força cor preta para o texto digitado
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: '#fff',
    overflow: Platform.OS === 'ios' ? 'visible' : 'hidden',
    height: Platform.OS === 'ios' ? 180 : 50, // No iOS o picker de roda precisa de mais altura
    justifyContent: 'center',
  },
  adminSection: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  citizenFeedback: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#EBF9F2',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2D6A4F',
    marginBottom: 20,
  },
  feedbackText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#333',
    lineHeight: 20,
  },
  containerBotoesModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 10,
  },
  botaoModal: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  botaoSalvar: {
    backgroundColor: Colors.secondary,
  },
  botaoFechar: {
    backgroundColor: '#555454',
  },
  textoBotaoModal: {
    color: '#fff',
    fontFamily: Fonts.bold,
    fontSize: 16,
  },
});
