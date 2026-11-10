import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View, Image,} from 'react-native';
import * as Location from 'expo-location';
import { obtenerOpcionesMarcacion, registrarMarcacion,} from '../services/asistenciasService';
import Header from "../components/ui/Header";
//import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {Ionicons} from '@expo/vector-icons';
import { API_PREF_URL_IMG } from '../config/api';

export default function MarcarAsistenciaScreen({ token, onVolver }) {

  //const insets = useSafeAreaInsets();

  const [empresas, setEmpresas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const bloqueo = useRef(false);

  const cargar = useCallback(async () => {
    setCargando(true);

    const resultado = await obtenerOpcionesMarcacion(token);

    if (resultado.ok) {
      setEmpresas(
        Array.isArray(resultado.empresas)
          ? resultado.empresas
          : []
      );

      setMensaje('');
    } else {
      setMensaje(
        resultado.mensaje ||
        'No se pudieron cargar las opciones.'
      );
    }

    setCargando(false);
  }, [token]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const marcar = async (empresa, turno) => {
    if (bloqueo.current) {
      return;
    }

    bloqueo.current = true;
    setProcesando(true);

    try {
      const payload = {
        accion: turno.accion,
        grupo_id: empresa.grupo_id,
        turno_id: turno.turno_id,
      };

      // La llegada requiere GPS.
      if (turno.accion === 'marcar_llegada') {
        const permiso =
          await Location.requestForegroundPermissionsAsync();

        if (permiso.status !== 'granted') {
          Alert.alert(
            'Ubicación requerida',
            'Para marcar llegada debes permitir el acceso a tu ubicación.'
          );
          return;
        }

        const posicion =
          await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          });

        payload.lat = posicion.coords.latitude;
        payload.lon = posicion.coords.longitude;
      } else {
        // La salida conserva la fecha original de la jornada.
        // No solicita GPS.
        payload.fecha_jornada = turno.fecha_jornada;
      }

      const resultado = await registrarMarcacion(
        token,
        payload
      );

      Alert.alert(
        resultado.ok
          ? 'Marcación registrada'
          : 'No se pudo marcar',
        resultado.mensaje ||
          'Sin respuesta del servidor.'
      );

      if (resultado.ok) {
        await cargar();
      }
    } catch (error) {
      Alert.alert(
        'Error',
        error?.message ||
          'No fue posible obtener la ubicación o completar la marcación.'
      );
    } finally {
      bloqueo.current = false;
      setProcesando(false);
    }
  };

  // Función para formatear a YYYY-MM-DD aceptando Date u objetos ISO String de forma segura
  const formatToYYYYMMDD = (dateInput, salida) => {
    let dateObject = dateInput;

    // 1. Si recibe un string, lo limpiamos y procesamos
    if (typeof dateInput === 'string') {
      const trimmedInput = dateInput.trim();
      
      // Si viene con formato ISO (ej. 2026-11-05T00:00:00.000Z), extraemos solo "2026-11-05"
      if (trimmedInput.includes('T')) {
        const onlyDateString = trimmedInput.split('T')[0]; // "2026-11-05"
        
        // Añadimos "T00:00:00" e intentamos forzar la lectura local o el reemplazo de guiones
        // La forma más limpia para evitar desfases con YYYY-MM-DD en string es usar expresiones regulares o dividirlo:
        const [year, month, day] = onlyDateString.split('-');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
      
      // Si es otro tipo de string, intentamos parsearlo normalmente
      dateObject = new Date(trimmedInput);
    }

    // 2. Control de seguridad: Validamos si el objeto Date es válido
    if (!(dateObject instanceof Date) || isNaN(dateObject.getTime())) {
      throw new Error('La entrada no es una fecha válida.');
    }

    // 3. Tu lógica original (se ejecuta si entró como objeto Date original)
    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, '0');
    const day = String(dateObject.getDate()).padStart(2, '0');        
    let imprimir_fecha  = `${year}-${month}-${day}`;
    if(salida){ imprimir_fecha = `${day}-${month}-${year}`; }

    return imprimir_fecha;  
  };

  return (
    //, { paddingTop: insets.top, paddingBottom: insets.bottom } - la ui funciona bien igual sin ellos
    <View style={[styles.container]}>    
        
      <Header name_screen="Marcar llegada" />

      <ScrollView contentContainerStyle={styles.contenedor}>
        
        <Text style={styles.texto_parrafos}> La llegada requiere GPS.</Text>
        <Text style={styles.texto_parrafos}> La salida no requiere el uso de ubicación.</Text>

        {cargando && (
          <ActivityIndicator
            size="large"
            style={{ marginTop: 24 }}
          />
        )}

        {mensaje ? (
          <Text style={styles.error}>
            {mensaje}
          </Text>
        ) : null}

        {!cargando &&
          empresas.length === 0 &&
          !mensaje && (
            <Text style={styles.ayuda}>
              No hay marcaciones disponibles ahora.
            </Text>
          )}

        {empresas.map((empresa) => (
          <View
            key={String(empresa.grupo_id)}
            style={styles.empresa}
          >
            <View style={styles.contenedorEmpresa}>
              <Image 
                source={{ uri: `${API_PREF_URL_IMG}${empresa.grupo_icono}` }} 
                style={styles.imagenIcono}
                resizeMode="cover"
              />
              <Text style={styles.empresaTitulo}>
                {empresa.nombre}
              </Text>
            </View>

            {(empresa.turnos || []).map((turno, indice) => (
              <View
                key={`${turno.turno_id}-${turno.accion}-${turno.fecha_jornada}-${indice}`}
                style={styles.turno}
              >
                <Text style={styles.turnoTitulo}>
                  {turno.turno}
                </Text>

                <Text style={styles.detalle}>
                  Horario: {turno.hora_inicio} –{' '}
                  {turno.hora_fin || 'sin hora fin'}
                </Text>

                <Text style={styles.detalle}> 
                  Jornada: {formatToYYYYMMDD(turno.fecha_jornada, true)}
                </Text>

                {turno.accion === 'marcar_salida' && (
                  <Text style={styles.detalle}>
                    Entrada: {turno.hora_entrada}
                  </Text>
                )}

                <Pressable
                  disabled={procesando}
                  onPress={() => marcar(empresa, turno)}
                  style={[
                    styles.boton,
                    turno.accion === 'marcar_salida'
                      ? styles.salida
                      : null,
                    procesando
                      ? styles.deshabilitado
                      : null,
                  ]}
                  accessibilityRole="button"
                >
                  <Text style={styles.textoBoton}>
                    {procesando && 'Procesando...' 
                      || (turno.accion === 'marcar_salida' ? 'Marcar salida' : 'Marcar llegada')
                    }
                  </Text>
                </Pressable>
              </View>
            ))}
          </View>
        ))}

        <View style={styles.contenedorBoton}>
          <Pressable
            onPress={cargar}
            disabled={cargando || procesando}
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.botonCapsula,
              // Dejamos en línea únicamente los colores que dependen del estado interno
              {
                backgroundColor: pressed ? '#E8F8F5' : '#FFFFFF', 
                borderColor: (cargando || procesando) ? '#A3E4D7' : '#2ecc71',
              }
            ]}
          >
            {(cargando || procesando) ? (
              <ActivityIndicator size="small" color="#2ecc71" style={styles.iconoBoton} />
            ) : (
              <Ionicons name="refresh" size={16} color="#2ecc71" style={styles.iconoBoton} />
            )}

            <Text 
              style={[
                styles.textoBotonCapsula,
                { color: (cargando || procesando) ? '#A3E4D7' : '#2ecc71' }
              ]}
            >
              {(cargando || procesando) ? 'Actualizando' : 'Actualizar turnos'}
            </Text>
          </Pressable>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  contenedor: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 0,
    backgroundColor: '#f8fafc',
  },
  titulo: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1d4ed8',
    textAlign: 'center',
  },
  ayuda: {
    color: '#475569',
    textAlign: 'center',
    marginVertical: 14,
    lineHeight: 22,
  },
  texto_parrafos: {
    color: '#475569',
    textAlign: 'left',
    width: '100%',
  },
  volver: {
    backgroundColor: '#475569',
    padding: 13,
    borderRadius: 8,
    marginTop: 8,
  },

  actualizar: {
    backgroundColor: '#64748b',
    padding: 13,
    borderRadius: 8,
    marginTop: 10,
  },

  empresa: {
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  empresaTitulo: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
  },

  turno: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },

  turnoTitulo: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1e293b',
  },

  detalle: {
    color: '#475569',
    marginTop: 4,
    flexWrap: 'wrap',
  },

  boton: {
    marginTop: 14,
    backgroundColor: '#2563eb',
    padding: 14,
    borderRadius: 8,
  },

  salida: {
    backgroundColor: '#047857',
  },

  deshabilitado: {
    opacity: 0.5,
  },

  textoBoton: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
  },
  error: {
    color: '#b91c1c',
    marginTop: 18,
    textAlign: 'center',
  },
  contenedorBoton: {
    alignItems: 'center', 
    marginVertical: 16,
  },
  botonCapsula: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 100, // Estilo píldora perfecto
    borderWidth: 1.5,    
    // Sombras sutiles de alta gama
    shadowColor: '#2ecc71',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 1, 
  },
  iconoBoton: {
    marginRight: 6,
  },
  textoBotonCapsula: {
    fontSize: 14, 
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  imagenIcono: {
    width: 26, // Prioricé el tamaño estricto que tenías en tu style inline
    height: 26,
    borderRadius: 50,
    alignItems: 'center',
  },
  contenedorEmpresa: {
    flexDirection: 'row',       // Coloca los elementos uno al lado del otro
    alignItems: 'center',        // Alinea verticalmente el texto y la imagen
    backgroundColor: '#ffffff',  // Fondo blanco para resaltar
  },
});