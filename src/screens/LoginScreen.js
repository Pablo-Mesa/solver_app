import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Pressable, KeyboardAvoidingView, ScrollView, Platform, Alert } from 'react-native';
import { useState } from 'react';
import LogoSolver from '../components/LogoSolver';
import { iniciarSesion as autenticarRider } from '../services/authService';
import { guardarToken } from '../services/sessionStorage';

export default function LoginScreen({ onContinuar }) {

  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');

  const [errorUsuario, setErrorUsuario] = useState('');
  const [errorContrasena, setErrorContrasena] = useState('');

  const [cargando, setCargando] = useState(false);
  
  const iniciarSesion = async () => {
    const usuarioLimpio = usuario.trim();

    setErrorUsuario('');
    setErrorContrasena('');

    let hayErrores = false;

    if (usuarioLimpio === '') {
      setErrorUsuario('Ingrese su usuario.');
      hayErrores = true;
    }

    if (contrasena === '') {
      setErrorContrasena('Ingrese su contraseña.');
      hayErrores = true;
    }

    if (hayErrores || cargando) {
      return;
    }

    setCargando(true);

    try {
      const resultado = await autenticarRider(
        usuarioLimpio,
        contrasena
      );

      if (resultado.ok) {
        await guardarToken(resultado.token);
        onContinuar(resultado);
      } else {
        Alert.alert(
          'Inicio de sesión',
          resultado.mensaje
        );
      }

    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      Alert.alert(
        'Error de conexión',
        'No fue posible procesar la solicitud.'
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    
    <KeyboardAvoidingView
      style={{flex:1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}> 

      <ScrollView
        contentContainerStyle={styles.contenidoScroll}
        keyboardShouldPersistTaps="handled">

        <View style={styles.container}>
          <StatusBar style="auto" />


          <LogoSolver size={80} />

          <Text style={styles.titulo}>Bienvenidos a Solver App</Text>
          <Text style={styles.subtitulo}>Cuaderno y Control de Asistencias</Text>

          <Text style={styles.etiqueta}>Correo electrónico</Text>

          <TextInput
            style={[ styles.campo, errorUsuario !== '' && styles.campoError, ]}
            placeholder="Ingrese su correo"
            autoCapitalize="none"
            value={usuario}
            onChangeText={(texto) => {
              setUsuario(texto);
              setErrorUsuario('');
            }}
          />

          {errorUsuario !== '' && (
            <Text style={styles.error}>
              {errorUsuario}
            </Text>  
          )}

          <Text style={styles.etiqueta}>Contraseña</Text>

          <TextInput
            style={[
              styles.campo,
              errorContrasena !== '' && styles.campoError,
            ]}
            placeholder="Ingrese su contraseña"
            secureTextEntry={true}
            autoCapitalize="none"
            autoCorrect={false}
            value={contrasena}
            onChangeText={(texto)=>{
              setContrasena(texto);
              setErrorContrasena('');
            }}
          />

          {errorContrasena !== '' && (
            <Text style={styles.error}>
              {errorContrasena}
            </Text>
          )}

          <Pressable
            style={[ styles.boton, cargando && styles.botonDeshabilitado, ]}
            onPress={iniciarSesion}
            disabled={cargando}
          >
            <Text style={styles.textoBoton}>
              {cargando ? 'Verificando...' : 'Iniciar sesión'}
            </Text>
          </Pressable>

        </View>

      </ScrollView>
    </KeyboardAvoidingView>  
    
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',    
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 16,
    color: '#666666',
    marginTop: 10,
    textAlign: 'center',
  },
  etiqueta: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 25,
    marginBottom: 8,
    color: '#333333',
  },
  campo: {
    width: '85%',
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
  boton: {
    width: '85%',
    backgroundColor: '#2563eb',
    padding: 15,
    borderRadius: 8,
    marginTop: 25,
    alignItems: 'center',
  },
  textoBoton: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
    error: {
    color: '#dc2626',
    fontSize: 13,
    marginTop: 5,
    width: '85%',
  },
  campoError: {
    borderColor: '#dc2626',
  },
  contenidoScroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 30,
  },
  botonDeshabilitado: {
    opacity: 0.6,
  },
});
