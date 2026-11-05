import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function TarjetaInfo({ iconoUrl, empresa, fecha, accion, turno, tarifa }) {
  return (
    <View style={styles.contenedorPrincipal}>
      <View style={styles.tarjetaFila}>
        
        {/* Contenedor Izquierdo: Icono e Información Principal */}
        <View style={styles.contenedorIzquierdo}>
          
          {/* Contenedor del Icono / Imagen de la empresa */}
          <View style={styles.contenedorIcono}>
            {iconoUrl ? (
              <Image 
                source={{ uri: iconoUrl }} 
                style={styles.imagenIcono}
                resizeMode="cover"
              />
            ) : (
              /* Fallback en caso de que no haya URL de icono */
              <View style={styles.fallbackIcono} />
            )}
          </View>

          {/* Textos Informativos */}
          <View style={styles.contenedorTextos}>
            <Text style={styles.textoEmpresa} numberOfLines={1}>
              {empresa}
            </Text>
            <Text style={styles.textoAccion}>
              {accion} • {turno}
            </Text>
            <Text style={styles.textoFecha}>
              {fecha}
            </Text>
          </View>

          {/* Tarifa */}
          <Text style={styles.textoTarifa}>
            {tarifa}
          </Text>
        </View>

        {/* Contenedor Derecho */}
        <View style={styles.contenedorDerecho} />

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedorPrincipal: {
    flexDirection: 'column',
    gap: 8,
    width: '100%', // w-72 equivale a 72 * 4 = 288px
    zIndex: 50,
  },
  tarjetaFila: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    minHeight: 70,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  contenedorIzquierdo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  contenedorIcono: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    // Nota: backdrop-blur no es soportado nativamente por Android en React Native.
    // Si necesitas desenfoque severo en ambas plataformas, considera @react-native-community/blur
    padding: 4,
    borderRadius: 8,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagenIcono: {
    width: 46, // Prioricé el tamaño estricto que tenías en tu style inline
    height: 46,
    borderRadius: 50,
  },
  fallbackIcono: {
    width: 24,
    height: 24,
    backgroundColor: '#2b9875',
    borderRadius: 12, // full circle para un tamaño de 24
  },
  contenedorTextos: {
    flex: 1,
  },
  textoEmpresa: {
    color: '#232531',
    fontWeight: 'bold',
    fontSize: 14,
  },
  textoAccion: {
    color: '#9ca3af',
    fontSize: 12,
    marginTop: 2,
  },
  textoFecha: {
    color: '#6b7280',
    fontSize: 10,
    marginTop: 2,
  },
  textoTarifa: {
    color: '#2b9875',
    fontWeight: 'bold',
    fontSize: 14,
  },
  contenedorDerecho: {
    marginLeft: 8,
    alignItems: 'flex-end',
  },
});
