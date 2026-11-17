import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, View, TouchableOpacity,}
from 'react-native';
import Header from "../components/ui/Header";
import { obtenerProducciones } from '../services/produccionService';
import { obtenerEmpresas } from '../services/empresaService';
import { API_PREF_URL_IMG } from '../config/api';
import DateTimePicker from '@react-native-community/datetimepicker';
import Svg, { Rect, Line } from 'react-native-svg';
import TarjetaInfo from '../components/ui/TarjetaInfo';
import { Picker } from '@react-native-picker/picker';

const formatoGuaranies = (valor) => {
  const numero = Number(valor) || 0;
  return `₲ ${numero.toLocaleString('es-PY')}`;
};

export default function ProduccionesScreen({ token, onVolver }) {

  const [empresas, setEmpresas] = useState([]);
  const [producciones, setProducciones] = useState([]);
  const [resumenGrupos, setResumenGrupos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState('');
  const [bloqueado, setBloqueado] = useState(false);

  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const [empresaSeleccionada, setEmpresaSeleccionada] = useState('');
 
  const consultar_empresas = async () => {
    setCargando(true);
    setMensaje('');

    const resultado_empresa = await obtenerEmpresas(token);

    if (resultado_empresa && resultado_empresa.ok) {      
      setEmpresas(resultado_empresa.empresas);
      setBloqueado(false);
    } else {
      // 3. DETECTAR EL ERROR EXACTO EN CASO DE FALLA
      console.warn("❌ Falló la consulta de empresas:", {
        mensaje: resultado_empresa?.mensaje,
        codigo: resultado_empresa?.codigo
      });

      setEmpresas([]);
      setMensaje(resultado_empresa?.mensaje || 'Error desconocido');
      setBloqueado(resultado_empresa?.codigo === 403);
    }

    setCargando(false);
  };

  const consultar = async (fechaSeleccionada = null, empresaSeleccionada = null) => {
    setCargando(true);
    setMensaje('');

    const resultado = await obtenerProducciones(
      token,
      fechaSeleccionada,
      empresaSeleccionada
    );

    if (resultado.ok) {
      setProducciones(resultado.producciones);
      setResumenGrupos(resultado.resumenGrupos);      
      setBloqueado(false);
    } else {
      setProducciones([]);
      setResumenGrupos([]);
      setMensaje(resultado.mensaje);
      setBloqueado(resultado.codigo === 403);
    }

    setCargando(false);
  };

  useEffect(() => {
    void consultar();
  }, [token]);

  useEffect(() => {
    void consultar_empresas();
  }, [token]);

  const totalServicios = resumenGrupos.reduce(
    (total, grupo) => total + Number(grupo.servicios || 0),
    0
  );

  const totalCostos = resumenGrupos.reduce(
    (total, grupo) => total + Number(grupo.costos || 0),
    0
  );

  // 1. Se ejecuta cuando el usuario elige una fecha y presiona "Aceptar"
  const handleValueChange = (event, selectedDate) => {
  setShow(false);
  if (selectedDate) {
    setDate(selectedDate);
    void consultar(formatToYYYYMMDD(selectedDate), empresaSeleccionada);
    void consultar_empresas();
  }
};

  // 2. Se ejecuta cuando el usuario cancela o toca fuera del selector
  const handleDismiss = () => {
    setShow(false);
  };

  // Función para formatear el objeto Date a YYYY-MM-DD
  const formatToYYYYMMDD = (dateObject) => {
    const year = dateObject.getFullYear();
    // Agrega un cero a la izquierda si el mes o día es menor a 10
    const month = String(dateObject.getMonth() + 1).padStart(2, '0');
    const day = String(dateObject.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  };

    return (
      //, { paddingTop: insets.top, paddingBottom: insets.bottom } - la ui funciona bien igual sin ellos
      <View style={[styles.container]}>    
       
        <Header name_screen="Producción"/>
       
        <ScrollView
          style={styles.pantalla}
          contentContainerStyle={styles.contenido}
          keyboardShouldPersistTaps="handled"
        >

          <View style={styles.fila}>
            <View style={styles.filaFecha}>
              <TextInput
                style={styles.campoFecha}
                value={date.toLocaleDateString()}          
                placeholder="DD-MM-AAAA"
                autoCapitalize="none"
                editable={!cargando}
              />

              <View style={{  justifyContent: 'flex-start', alignItems: 'center', width: 'auto', }}>                    
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

                <Picker
                  selectedValue={empresaSeleccionada}
                  onValueChange={(itemValue) => {
                    setEmpresaSeleccionada(itemValue);
                    void consultar(
                      formatToYYYYMMDD(date),
                      itemValue
                    );
                  }}
                  style={styles.picker}
                >
                  <Picker.Item
                    label="Selecciona una empresa..."
                    value=""
                  />

                  {empresas.map((empresa) => (
                    <Picker.Item
                      key={empresa.id_grupo}
                      label={empresa.nombre}
                      value={empresa.id_grupo}
                    />
                  ))}
                </Picker>
           
          </View>

          {cargando ? (
            <ActivityIndicator size="large" style={styles.indicador} />
          ) : mensaje ? (
            <Text style={styles.mensaje}>
              {mensaje}
            </Text>
          ) : (
            <>
              {resumenGrupos.length === 0 ? (
                <Text style={styles.vacio}>
                  No hay producciones para esta fecha.
                </Text>
              ) : (
                <>
                  <ScrollView 
                    style={styles.contenedorScroll}
                    contentContainerStyle={styles.contenidoScroll}
                    showsVerticalScrollIndicator={true} // Cambia a false si quieres ocultar la barra de scroll
                  >
                    {producciones.map((produccion) => {
                      return (
                        <TarjetaInfo  
                          key={produccion.id} // El key SIEMPRE debe ir en el elemento raíz del .map
                          iconoUrl={`${API_PREF_URL_IMG}${produccion.grupo_icono}`}
                          empresa={produccion.grupo_nombre}
                          fecha={produccion.fecha_creacion}
                          accion={produccion.accion}
                          turno={produccion.turno}
                          tarifa={formatoGuaranies(produccion.tarifa_detalle)} 
                        />
                      );
                    })}
                  </ScrollView>

                  {resumenGrupos.map((grupo, indice) => (
                    <View key={indice} style={styles.filaInformacion}>                
                
                      <Text style={[styles.textoCelda, styles.colEmpresa]} numberOfLines={1}>
                        {grupo.grupo_nombre}
                      </Text>

                      <Text style={[styles.textoCelda, styles.colServicios]}>
                        {grupo.servicios}
                      </Text>

                      <Text style={[styles.textoCelda, styles.colTotal]}>
                        {formatoGuaranies(grupo.costos)}
                      </Text>

                    </View>
                  ))}
                  <View style={styles.filaInformacionNoBorderBottom}>
                    <Text style={[styles.textoCelda, styles.colEmpresa]}>
                      Totales:
                    </Text>

                    <Text style={[styles.textoCelda, styles.colServicios]}>
                      {totalServicios}
                    </Text>

                    <Text style={[styles.textoCelda, styles.colTotal]}>
                      {formatoGuaranies(totalCostos)}
                    </Text>
                  </View>

                  <View style={styles.filaInformacionNoBorderBottom}>
                    <Text style={[styles.textoCelda, styles.colEmpresa]}>
                      Delivery:
                    </Text>

                    <Text style={[styles.textoCelda, styles.colServicios]}>                        
                      {'->'}
                    </Text>

                    <Text style={[styles.textoCelda, styles.colTotal]}>
                      {formatoGuaranies((totalCostos - totalCostos * 20 / 100) )}
                    </Text>
                  </View>
                </> 
              )}  

            </>
          )}

        </ScrollView>  
      </View>    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F5F6', // O '#121214'
  },
  pantalla: {
    flex: 1,
    backgroundColor: '#F4F5F6', // O '#1A1C24'
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
  textoVolver: {
    color: '#777',
    fontSize: 16,
    fontWeight: '600',
  },
  fila: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
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
  resumenGeneral: {
    backgroundColor: '#eff6ff',
    padding: 16,
    borderRadius: 10,
    marginTop: 16,
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  }
  ,
  tarjeta: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
  },
  nombreGrupo: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  fechaDetalle: {
    color: '#6b7280',
    fontSize: 12,
  },
  vacio: {
    color: '#666666',
    marginBottom: 12,
  },
  contenedorFila: {
    flexDirection: 'row',       // Alinea los hijos en línea horizontal
    justifyContent: 'space-between', // Empuja un elemento a la izquierda y el otro a la derecha
    alignItems: 'center',       // Centra verticalmente ambos textos para que queden alineados
    width: '100%',              // Asegura que ocupe todo el ancho disponible
  },
  iconoPequeno: {
    width: 20,  // Define un ancho fijo pequeño
    height: 20, // Define un alto fijo pequeño
    resizeMode: 'contain', // Opcional, para asegurar que no se corte
    borderRadius: 6,
    marginRight: 6,
  },
  contenedorGrupo: {
    flexDirection: 'row',     // Coloca el ícono y el texto en la misma línea (horizontal)
    alignItems: 'center',     // Alinea verticalmente el ícono y el texto para que queden centrados entre sí
    justifyContent: 'flex-start', // Empuja todo hacia la izquierda (comienzo de la línea)
    // marginTop: 5,           // Opcional: espacio superior si lo necesitas separar de otro elemento
    margin: 0,
    padding: 0,
  },
  // Contenedor de cada fila de información
  filaInformacion: {
    flexDirection: 'row',
    alignItems: 'center', // Alinea verticalmente los textos con el ícono
    borderBottomWidth: 1,
    borderBottomColor: '#999',
    paddingVertical: 6,
    borderStyle: 'dashed',
  },
  // Contenedor de cada fila de información
  filaInformacionNoBorderBottom: {
    flexDirection: 'row',
    alignItems: 'center', // Alinea verticalmente los textos con el ícono    
    paddingVertical: 6,
  },
  textoCelda: {
    fontSize: 14,
    color: '#444',
  },
  iconoTabla: {
    width: 30,
    height: 30,
    borderRadius: 8,
    resizeMode: 'cover',
  },

  // DISTRIBUCIÓN DE COLUMNAS (Suman 10 en total para controlar los anchos)
  colIcono: {
    flex: 1, 
    alignItems: 'center', // Centra el ícono en su columna
  },
  colEmpresa: {
    flex: 4, 
    paddingHorizontal: 8,
  },
  colServicios: {
    flex: 2.5,
    textAlign: 'center', // Centra la cantidad de servicios
  },
  colTotal: {
    flex: 2.5,
    textAlign: 'right', // Alinea los precios/guaraníes a la derecha
    fontWeight: '600',
    paddingRight: 4,
  },
  tarjetaInfoContainer: {
    gap: 4,
  },
  contenedorScroll: {
    height: 400, // 👈 Define aquí la altura fija exacta que deseas (ej. 300px)
    // O puedes usar maxHeight: 300 si quieres que mida menos si hay pocas tarjetas
    width: '100%',  // Alineado al ancho de tus tarjetas (w-72)
  },
  contenidoScroll: {
    gap: 8, // 👈 Esto mantiene la separación vertical (gap-2) entre cada tarjeta automáticamente
    paddingBottom: 16, // Espacio extra al final para que la última tarjeta no quede pegada al borde
  },
  picker: {
    height: 50, 
    textAlign: 'right',
    width: '50%',
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 6,
    padding: 0,
    margin: 0,
  },
});
