import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export interface Reporte {
  id: string,
  titulo: string
}
export default function TelaReporte() {

  // ==========================================
  // 🧠 PARTE LÓGICA (Equivalente ao .component.ts)
  // ==========================================
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);
  //Iniciador
  useEffect(() => {
    carregarDados();
  }, []);


  const carregarDados = () => {
      // mock carregando ficticio para simular a busca
    setTimeout(() => {
      const dadosFicticios: Reporte[] = [
        { id: '1', titulo: 'Lixo na água' },
        { id: '2', titulo: 'escombros perto da escola' },
        { id: '3', titulo: 'Sacolas na grama' },
      ];

      // Atualiza os estados (equivalente a mudar o valor da variável no Angular)
      setReportes(dadosFicticios);
      
      setCarregando(false);
    }, 2000);

  }


  return (
    // ==========================================
    // 🖼️ PARTE VISÍVEL / TEMPLATE (Equivalente ao .component.html)
    // ==========================================
    <View style={styles.container}>
      <Text style={styles.texto}>Tela de Reporte</Text>

      {/* 
        EQUIVALENTE AO *ngIf="carregando; else listaTemplate"
        Exibe um spinner de carregamento nativo se estiver buscando os dados
      */}
      {carregando ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        // Renderiza a lista após o carregamento (equivalente ao *ngFor)
        reportes.map((item) => (
          <View key={item.id} style={styles.cardItem}>
            <Text style={styles.textoItem}>{item.titulo}</Text>
          </View>
        ))
      )}

    </View>
  );
}

// ==========================================
// 🎨 ESTILIZAÇÃO / CSS (Equivalente ao .component.css)
// ==========================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  texto: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  cardItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textoItem: {
    fontSize: 16,
    color: '#333',
  },
});
