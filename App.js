import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, View, StyleSheet, TouchableOpacity, Text, Pressable, } from 'react-native';

import LoginScreen from './src/screens/LoginScreen';
import RiderHomeScreen from './src/screens/RiderHomeScreen';
import ProduccionesScreen from './src/screens/ProduccionesScreen';
import AsistenciasScreen from './src/screens/AsistenciasScreen';
import MarcarAsistenciaScreen from './src/screens/MarcarAsistenciaScreen';
import { cerrarSesion, verificarSesion, } from './src/services/authService';
import { eliminarToken, obtenerToken, } from './src/services/sessionStorage';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function App() {
  const [sesion, setSesion] = useState(null);
  const [verificandoSesion, setVerificandoSesion] = useState(true);
  const [cerrandoSesion, setCerrandoSesion] = useState(false);
  
  // 'inicio' ahora representará nuestra primera pestaña (Home)
  const [pantallaActual, setPantallaActual] = useState('inicio');

  useEffect(() => {
    let activo = true;

    const restaurarSesion = async () => {
      try {
        const token = await obtenerToken();

        if (!token) {
          return;
        }

        const resultado = await verificarSesion(token);

        if (!activo) {
          return;
        }

        if (resultado.ok && resultado.usuario?.rol === 'rider') {
          setSesion({
            token,
            usuario: resultado.usuario,
          });
        } else if (!resultado.errorConexion) {
          await eliminarToken();
        }
      } catch (error) {
        console.log('No fue posible restaurar la sesión.');
      } finally {
        if (activo) {
          setVerificandoSesion(false);
        }
      }
    };

    restaurarSesion();

    return () => {
      activo = false;
    };
  }, []);

  const continuarAlPanel = (resultado) => {
    if (
      !resultado?.ok ||
      typeof resultado.token !== 'string' ||
      !resultado.token ||
      !resultado.usuario ||
      resultado.usuario.rol !== 'rider'
    ) {
      return;
    }

    setSesion({
      token: resultado.token,
      usuario: resultado.usuario,
    });
  };

  const volverAlLogin = async () => {
    if (cerrandoSesion) {
      return;
    }

    setCerrandoSesion(true);

    let revocacionConfirmada = false;
    let limpiezaLocalConfirmada = false;

    try {
      if (sesion?.token) {
        const resultado = await cerrarSesion(sesion.token);
        revocacionConfirmada = resultado.ok === true;
      }
    } catch (error) {
      revocacionConfirmada = false;
    }

    try {
      await eliminarToken();
      limpiezaLocalConfirmada = true;
    } catch (error) {
      limpiezaLocalConfirmada = false;
    }

    setPantallaActual('inicio');
    setSesion(null);
    setCerrandoSesion(false);

    if (!limpiezaLocalConfirmada) {
      Alert.alert(
        'Atención',
        'No se pudo eliminar el token guardado. No se confirmó un cierre de sesión seguro.'
      );
    } else if (!revocacionConfirmada) {
      Alert.alert(
        'Atención',
        'Se cerró el acceso local, pero no se pudo confirmar la revocación de la sesión en el servidor.'
      );
    }
  };

  if (verificandoSesion) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // --- CONTROL DE RENDERIZADO ---
  let contenido;

  if (sesion) {
    let pantallaActivaComponente;

    switch (pantallaActual) {
      case 'marcar_asistencia':
        pantallaActivaComponente = (
          <MarcarAsistenciaScreen token={sesion.token} onVolver={() => setPantallaActual('inicio')} />
        );
        break;
      case 'cuaderno':
        pantallaActivaComponente = (
          <ProduccionesScreen token={sesion.token} onVolver={() => setPantallaActual('inicio')} />
        );
        break;
      case 'asistencias':
        pantallaActivaComponente = (
          <AsistenciasScreen token={sesion.token} onVolver={() => setPantallaActual('inicio')} />
        );
        break;
      
      case 'opciones':
        pantallaActivaComponente = (
          <View style={{ flex: 1, backgroundColor: '#161B22', justifyContent: 'center', alignItems: 'center' }}>
            
            {/* Contenedor Principal Oscuro */}
            <View style={{ width: 220, backgroundColor: '#0D1117', borderRadius: 6, paddingVertical: 6, borderWidth: 1, borderColor: '#21262C' }}>
              
              {/* Opción 1: Perfil público */}
              <Pressable 
                style={({ pressed }) => ({
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  backgroundColor: pressed ? '#1A1F24' : 'transparent',
                })}
              >
                <Ionicons name="person-outline" size={16} color="#7D8590" style={{ marginRight: 10 }} />
                <Text style={{ color: '#FFFFFF', fontSize: 14 }}>Perfil público</Text>
              </Pressable>

              {/* Opción 2: Cuenta */}
              <Pressable 
                style={({ pressed }) => ({
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  backgroundColor: pressed ? '#1A1F24' : 'transparent',
                })}
              >
                <Ionicons name="settings-outline" size={16} color="#7D8590" style={{ marginRight: 10 }} />
                <Text style={{ color: '#FFFFFF', fontSize: 14 }}>Cuenta</Text>
              </Pressable>

              {/* Opción 3: Notificaciones */}
              <Pressable 
                style={({ pressed }) => ({
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  backgroundColor: pressed ? '#1A1F24' : 'transparent',
                })}
              >
                <Ionicons name="notifications-outline" size={16} color="#7D8590" style={{ marginRight: 10 }} />
                <Text style={{ color: '#FFFFFF', fontSize: 14 }}>Notificaciones</Text>
              </Pressable>

              {/* Separador sutil antes de la acción destructiva */}
              <View style={{ height: 1, backgroundColor: '#21262C', marginVertical: 4 }} />

              {/* Opción Destructiva: Cerrar sesión */}
              <Pressable 
                onPress={volverAlLogin}
                style={({ pressed }) => ({
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  backgroundColor: pressed ? '#1A1F24' : 'transparent',
                })}
              >
                <Ionicons name="log-out-outline" size={16} color="#e74c3c" style={{ marginRight: 10 }} />
                <Text style={{ color: '#e74c3c', fontSize: 14, fontWeight: '500' }}>Cerrar sesión</Text>
              </Pressable>

            </View>
          </View>
        );
        break;

      default:
        pantallaActivaComponente = (
          <RiderHomeScreen
            onVolver={volverAlLogin}
            onAbrirCuaderno={() => setPantallaActual('cuaderno')}
            onAbrirAsistencias={() => setPantallaActual('asistencias')}
            onMarcarAsistencia={() => setPantallaActual('marcar_asistencia')}
          />
        );
        break;
    }

    contenido = (
      <SafeAreaView style={styles.container}>
        <View style={styles.screenContainer}>
          {pantallaActivaComponente}
        </View>

        <View style={styles.tabBar}>
          <TouchableOpacity style={styles.tabItem} onPress={() => setPantallaActual('inicio')}>
            <Ionicons name={pantallaActual === 'inicio' ? "home" : "home-outline"} size={22} color={pantallaActual === 'inicio' ? '#2ecc71' : '#7f8c8d'} />
            <Text style={[styles.tabText, pantallaActual === 'inicio' && styles.activeTabText]}>Inicio</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabItem} onPress={() => setPantallaActual('cuaderno')}>
            <Ionicons name={pantallaActual === 'cuaderno' ? "book" : "book-outline"} size={22} color={pantallaActual === 'cuaderno' ? '#2ecc71' : '#7f8c8d'} />
            <Text style={[styles.tabText, pantallaActual === 'cuaderno' && styles.activeTabText]}>Cuaderno</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabItem} onPress={() => setPantallaActual('marcar_asistencia')}>
            <Ionicons name={pantallaActual === 'marcar_asistencia' ? "location" : "location-outline"} size={22} color={pantallaActual === 'marcar_asistencia' ? '#2ecc71' : '#7f8c8d'} />
            <Text style={[styles.tabText, pantallaActual === 'marcar_asistencia' && styles.activeTabText]}>Marcar</Text>
          </TouchableOpacity>

         <TouchableOpacity style={styles.tabItem} onPress={() => setPantallaActual('asistencias')}>
            <Ionicons name={pantallaActual === 'asistencias' ? "clipboard" : "clipboard-outline"} size={22} color={pantallaActual === 'asistencias' ? '#2ecc71' : '#7f8c8d'} />
            <Text style={[styles.tabText, pantallaActual === 'asistencias' && styles.activeTabText]}>Asistencias</Text>
          </TouchableOpacity>

          {/* 2. NUEVO BOTÓN EN LA BARRA INFERIOR */}
          <TouchableOpacity style={styles.tabItem} onPress={() => setPantallaActual('opciones')}>
            <Ionicons name={pantallaActual === 'opciones' ? "menu" : "menu-outline"} size={22} color={pantallaActual === 'opciones' ? '#2ecc71' : '#7f8c8d'} />
            <Text style={[styles.tabText, pantallaActual === 'opciones' && styles.activeTabText]}>Más</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );

  } else {
    contenido = <LoginScreen onContinuar={continuarAlPanel} />;
  }

  return (
    <SafeAreaProvider>
      {contenido}
    </SafeAreaProvider>
  );
}

// Estilos básicos para la barra inferior distribuidos equitativamente
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  screenContainer: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    height: 65,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#ffffff',
    elevation: 8, // Sombra para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    fontSize: 11,
    color: '#7f8c8d',
    marginTop: 2,
  },
  activeTabText: {
    color: '#2ecc71', // Puedes cambiarlo por el color principal de tu app
    fontWeight: 'bold',
  },
});
