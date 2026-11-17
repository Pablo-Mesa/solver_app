import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, View, TouchableOpacity, Image, } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { obtenerAsistencias } from '../services/asistenciasService';
import Header from "../components/ui/Header";
import Svg, { Rect, Line } from 'react-native-svg';
import { API_PREF_URL_IMG } from '../config/api';
import TarjetaInfo from '../components/ui/TarjetaInfo';

export default function AsistenciasScreen({ token, onVolver }) {

  const [asistencias, setAsistencias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState('');
  const [bloqueado, setBloqueado] = useState(false);
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date());

  const consultar = async (fechaSeleccionada = null) => {
    setCargando(true);
    setMensaje('');

    const resultado = await obtenerAsistencias(
      token,
      fechaSeleccionada
    );

    if (resultado.ok) {
      setAsistencias(resultado.asistencias);
      setBloqueado(false);
    } else {
      setAsistencias([]);
      setMensaje(resultado.mensaje);
      setBloqueado(resultado.codigo === 403);
    }

    setCargando(false);
  };

  useEffect(() => {
    void consultar();
  }, [token]);

  // 1. Se ejecuta cuando el usuario elige una fecha y presiona "Aceptar"
  const handleValueChange = (event, selectedDate) => {
    setShow(false); // Oculta el selector
    if (selectedDate) {
      setDate(selectedDate);
      void consultar(formatToYYYYMMDD(selectedDate, false));
    }
  };

  // 2. Se ejecuta cuando el usuario cancela o toca fuera del selector
  const handleDismiss = () => {
    setShow(false);
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
    if (!(dateObject instanceof Date) || Number.isNaN(dateObject.getTime())) {
      throw new TypeError('La entrada no es una fecha válida.');
    }

    // 3. Tu lógica original (se ejecuta si entró como objeto Date original)
    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, '0');
    const day = String(dateObject.getDate()).padStart(2, '0');        
    let imprimir_fecha  = `${year}-${month}-${day}`;
    if(salida){ imprimir_fecha = `${day}-${month}-${year}`; }

    return imprimir_fecha;  
  };
  
  // Función agregada para resolver la advertencia de SonarQube
  const renderContenidoResultados = () => {
    if (cargando) {
      return <ActivityIndicator size="large" style={styles.indicador} />;
    }

    if (mensaje) {
      return <Text style={styles.mensaje}>{mensaje}</Text>;
    }

    if (asistencias.length === 0) {
      return (
        <Text style={styles.vacio}>
          No se encontraron asistencias para esta fecha.
        </Text>
      );
    }

    return asistencias.map((asistencia, indice) => (
      <View key={asistencia.id} style={styles.tarjeta}>

        <View style={styles.contenedorEmpresa}>
          <Image 
            source={ { uri: `${API_PREF_URL_IMG}${asistencia.grupo_icono}` } } 
            style={styles.imagenIcono}
            resizeMode="cover"
          />
          <Text style={styles.nombreGrupo}>
            {asistencia.empresa || 'Empresa no disponible'}
          </Text>
        </View>

        <View style={styles.filaTipo}>
          <Text
            style={[
              styles.tipo,
              asistencia.tipo === 'entrada'
                ? styles.tipoEntrada
                : styles.tipoSalida,
            ]}
          >
            {asistencia.tipo === 'entrada' ? 'Entrada' : 'Salida'}
          </Text>
        </View>

        <Text style={styles.dato}>Fecha: {formatToYYYYMMDD(asistencia.fecha, true)}</Text>
        <Text style={styles.dato}>Hora: {asistencia.hora}</Text>
      </View>
    ));
  };

  return (
    //, { paddingTop: insets.top, paddingBottom: insets.bottom } - la ui funciona bien igual sin ellos
    <View style={[styles.container]}>    
    
      <Header name_screen="Asistencias"/>

      <ScrollView
        style={styles.pantalla}
        contentContainerStyle={styles.contenido}
        keyboardShouldPersistTaps="handled"
      >
        {/* filtro campo fecha */}
        <View style={styles.fila}>
          <View style={styles.filaFecha}>

            <TextInput
              style={styles.campoFecha}
              value={date.toLocaleDateString()}
              placeholder="AAAA-MM-DD"
              autoCapitalize="none"
              editable={!cargando && !bloqueado}
            />

            <View style={{ justifyContent: 'flex-start', alignItems: 'center', width: 'auto', }}>                    
                {show && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onValueChange={handleValueChange}
                    onDismiss={handleDismiss}
                  />
                )}              
                <View>
                  <TouchableOpacity 
                    onPress={() => setShow(true)}
                    // Espacio táctil cómodo para el usuario
                    activeOpacity={0.7}
                  >
                    {/* 3. Dibujamos el SVG del calendario aquí adentro */}
                    <Svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="#999999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <Rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                      <Line x1="16" x2="16" y1="2" y2="6" />
                      <Line x1="8" x2="8" y1="2" y2="6" />
                      <Line x1="3" x2="21" y1="10" y2="10" />
                    </Svg>
                  </TouchableOpacity>
                </View>
            </View>

          </View>
        </View>

        {/* Invocación limpia de la función que organiza la UI */}
        {/* renderContenidoResultados() */}

        <View style={[styles.tarjetero]}>
                
          {asistencias.map((asistencia) => {
            return (
              <TarjetaInfo  
                key={asistencia.id} // El key SIEMPRE debe ir en el elemento raíz del .map
                iconoUrl={`${API_PREF_URL_IMG}${asistencia.grupo_icono}`}
                empresa={asistencia.empresa}
                fecha={asistencia.hora}
                accion={formatToYYYYMMDD(asistencia.fecha, true)}
                turno={""}
                tarifa={asistencia.tipo === 'entrada' ? 'Entrada' : 'Salida'} 
              />
            );
          })}

        </View>

      </ScrollView>
    </View>


  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F5F6', //   O '#1A1C24'
  },
  pantalla: {
    flex: 1,
    backgroundColor: '#F4F5F6', // O '#ffffff'
  },
  contenido: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    backgroundColor: '#F4F5F6', // O '#1A1C24'
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563eb',
    textAlign: 'center',
  },
  botonVolver: {
    marginVertical: 20,
  },
  textoVolver: {
    color: '#2563eb',
    fontSize: 16,
    fontWeight: '600',
  },
  etiqueta: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  filaFecha: {
    width: 120,
    justifyContent: 'flex-start',
    alignItems: 'center',    
    flexDirection: 'row',
    gap: 6,
  },
  campoFecha: {
    flex: 1,
    minWidth: 0,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 6,
    padding: 6,
    textAlign: 'center',
  },  
  textoBoton: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  botonDeshabilitado: {
    opacity: 0.6,
  },
  indicador: {
    marginTop: 35,
  },
  mensaje: {
    marginTop: 25,
    color: '#b91c1c',
    textAlign: 'center',
  },
  fechaResultado: {
    marginTop: 25,
    color: '#666666',
  },
  tarjeta: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
  },
  nombreGrupo: {
    fontSize: 16,
    fontWeight: 'bold',
    flexShrink: 1,
  },
  filaTipo: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  tipo: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    fontWeight: 'bold',
    overflow: 'hidden',
  },
  tipoEntrada: {
    backgroundColor: '#dcfce7',
    color: '#166534',
  },
  tipoSalida: {
    backgroundColor: '#dbeafe',
    color: '#1d4ed8',
  },
  dato: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 6,
  },
  vacio: {
    color: '#666666',
    marginBottom: 12,
  },
  fila: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
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
    width: '100%',
  },
  tarjetero: {
    gap: 10,
  },
});
