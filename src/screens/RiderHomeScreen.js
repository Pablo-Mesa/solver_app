import { View, Text, StyleSheet, ScrollView, } from 'react-native';
import LogoSolver from '../components/LogoSolver';

export default function RiderHomeScreen({ onVolver, onAbrirCuaderno, onAbrirAsistencias, onMarcarAsistencia }) {
  
  return (
    // 1. CORRECCIÓN CLAVE: Agregamos styles.container y combinamos los insets de forma limpia
    //, { paddingTop: insets.top, paddingBottom: insets.bottom } - la ui funciona bien igual sin ellos
    <View style={[styles.container]}>      
      <ScrollView
        style={styles.body} 
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false} // Limpia la interfaz ocultando la barra si lo deseas
      >
        <LogoSolver />
        <Text style={styles.titulo}>Panel del Rider</Text>
        <Text style={styles.subtitulo}>Bienvenido a Solver App</Text>
        <Text style={styles.descripcion}>
            Aquí podrás consultar tus producciones y asistencias, tambíen marcar llegadas y salidas.
        </Text>
      </ScrollView>      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // 👈 CLAVE: Hace que la pantalla ocupe todo el alto del celular
    width: '100%',
    backgroundColor: '#ffffff',
    // Eliminamos justifyContent y alignItems de aquí porque afectaban al Header y Footer globales
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2563eb',
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 18,
    marginTop: 12,
    color: '#333333',
    textAlign: 'center',
  },
  descripcion: {
    fontSize: 15,
    marginTop: 20,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
  },
  boton: {
    marginTop: 30,
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%', // Le damos consistencia de ancho al botón de cerrar sesión
  },
  textoBoton: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  botonCuaderno: {
    marginTop: 30,
    backgroundColor: '#16a34a',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  botonAsistencias: {
    marginTop: 16,
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  botonMarcar: {
    marginTop: 30,
    backgroundColor: '#0f766e',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  body: {
    flex: 1, // Toma todo el espacio disponible que dejen el Header y el Footer
  },
  bodyContent: {
    flexGrow: 1, // Empuja el contenido para llenar el espacio libre si hay pocos botones
    padding: 20,
    justifyContent: 'center', // Centra tus botones verticalmente en el espacio disponible
    alignItems: 'center',
  },
});
