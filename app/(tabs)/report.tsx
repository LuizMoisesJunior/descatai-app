import { StyleSheet, Text, View } from 'react-native';

export default function TelaReporte() {
  return (
    <View style={styles.container}>
      <Text style={styles.texto}>tela de Reporte</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  texto: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
});
