import { Picker } from '@react-native-picker/picker';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { MaskedTextInput } from 'react-native-mask-text';
import { Reporte } from '../(tabs)/report';
import { reporteService } from '../services/reporte.service';

export default function ReporteFormularioScreen() {


  const parametro: any = useLocalSearchParams();
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
    fotoUrl: '',
    categoria: null
  };
  const categoryOptions = [
    {
      value: 1,
      label: 'Descarte Indevido'
    },
    {
      value: 2,
      label: 'Lixo Aculmulado'
    },
    {
      value: 3,
      label: 'Outros'
    },
  ]

  const [documento, setDocumento] = useState<Reporte>(emptyDocument);
  const isViewMode = mode === 'view';
  const isEditMode = mode === 'edit';
  const isCreateMode = mode === 'create';

  const voltar = () => {
    router.back()
  }
  const salvar = async () => {

    //validar campos obrigatorios

    //validar se esta cadastrando
    //salvar
    if (isCreateMode) {
      await reporteService.inserir(documento)
    } else if (isEditMode) {
      await reporteService.atualizar(documento)
    }

    voltar()

  }


  const handleTakePhoto = async () => {
    const permission =
      await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      alert('É necessário permitir o acesso à câmera.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      allowsEditing: true,
    });

    if (!result.canceled) {
      /* 
      implementar chyamada do service que cadastrar a imagem e gera link para ela
      */
      setDocumento(prev => ({
        ...prev,
        fotoUrl: result.assets[0].uri
      }));
    }
  };

  const carregarDocumento = async () => {

    if (parametro.id) {

      const reporte = await reporteService.buscarPorId(
        parametro.id as string
      );

      if (reporte) {
        setDocumento(reporte);
      }


      return;
    }

    setDocumento(emptyDocument);
  }
  useEffect(() => {
    carregarDocumento()
  }, []);


  return (
    <View
      style={styles.container}>
      <ScrollView style={styles.conteudoFormulario} contentContainerStyle={styles.conteudoFormularioScrolavel}>

        <Text style={styles.labelInput}>Assunto</Text>
        <TextInput
          style={styles.input}
          value={documento.assunto}
          editable={!isViewMode}
          onChangeText={(text) => setDocumento(prev => ({ ...prev, assunto: text }))}
          placeholder="Digite o assunto"
        />
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={documento.categoria}
            enabled={!isViewMode}
            onValueChange={(value) =>
              setDocumento(prev => ({
                ...prev,
                categoria: value ? Number(value) : null
              }))
            }
          >
            <Picker.Item label="Selecione uma opção..." value={null} />
            {categoryOptions.map(option => (
              <Picker.Item
                key={option.value}
                label={option.label}
                value={option.value}
              />
            ))}
          </Picker>
        </View>
        <Text style={styles.labelInput}>CEP</Text>
        <MaskedTextInput
          mask="99999-999"
          keyboardType="numeric"
          value={documento.cep}
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
          placeholder="Informe o Numero da Casa "
        />
        <Text style={styles.labelInput}>Complemento</Text>
        <TextInput
          style={styles.input}
          value={documento.complemento}
          editable={!isViewMode}
          onChangeText={(text) => setDocumento(prev => ({ ...prev, complemento: text }))}
          placeholder="Informe o complemento"
        />
        <Text style={styles.labelInput}>Descrição</Text>
        <TextInput
          style={styles.textArea}
          value={documento.descricao}
          editable={!isViewMode}
          onChangeText={(text) => setDocumento(prev => ({ ...prev, descricao: text }))}
          placeholder="Digite aqui os detalhes do reporte..."
          multiline={true}          // Permite quebra de linhas (transforma em textarea)
          numberOfLines={6}         // Altura inicial baseada em linhas (relevante para Android)
          textAlignVertical="top"   // Garante que o texto comece no topo (essencial para Android)
        />


        <Text>Foto do descarte</Text>

        <TouchableOpacity
          onPress={handleTakePhoto}
          disabled={isViewMode}
          style={{
            padding: 12,
            borderWidth: 1,
            borderRadius: 8,
            marginTop: 8,
          }}
        >
          <Text>
            {documento.fotoUrl ? 'Trocar foto' : 'Tirar foto'}
          </Text>
        </TouchableOpacity>

        {documento.fotoUrl && (
          <Image
            source={{ uri: documento.fotoUrl }}
            style={{
              width: '100%',
              height: 200,
              marginTop: 12,
              borderRadius: 8,
            }}
          />
        )}

      </ScrollView>
      <View style={styles.containerBotoesModal}>

        <TouchableOpacity style={[styles.botaoModal, styles.botaoFechar]} onPress={voltar}>
          <Text style={styles.textoBotaoModal}>Voltar</Text>
        </TouchableOpacity>
        {!isViewMode ?
          <TouchableOpacity style={[styles.botaoModal, styles.botaoSalvar]} onPress={salvar}>
            <Text style={styles.textoBotaoModal}>Salvar</Text>
          </TouchableOpacity>
          : null
        }

      </View>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    paddingTop: 60,
  },
  lista: {
    width: '100%',
  },
  texto: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  textoItem: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  containerBotoesAcao: {
    flexDirection: 'row',
    gap: 8,
  },
  botaoQuadrado: {
    width: 38,
    height: 38,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fafafa',
  },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  botaoVoltar: {
    padding: 10,
    marginRight: 15,
  },
  textoBotaoVoltar: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  textoBotaoFlutuante: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  conteudoFormularioScrolavel: {
    paddingBottom: 40,
  },
  conteudoFormulario: {
    width: '85%',
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
    fontWeight: '600',
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
  },
  containerBotoesModal: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  botaoModal: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  botaoSalvar: {
    backgroundColor: '#66b940',
  },
  botaoFechar: {
    backgroundColor: '#555454',
  },
  textoBotaoModal: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    height: 150,                // Define uma altura fixa para a área de texto
    backgroundColor: '#fff',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
  },
});