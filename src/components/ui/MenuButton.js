import React from 'react';
import { Pressable, Text, StyleSheet, Image, View } from 'react-native';

export default function MenuButton({ texto, onPress, uriImagen, estiloBoton }) {
  return (
    <Pressable 
      style={({ pressed }) => [
        styles.botonBase, 
        estiloBoton, 
        pressed && styles.botonPresionado
      ]} 
      onPress={onPress}
    >
      <View style={styles.contenedorContenido}>
        {uriImagen && (
          <Image 
            source={typeof uriImagen === 'string' ? { uri: uriImagen } : uriImagen} 
            style={styles.icono} 
          />
        )}
        <Text style={styles.textoBoton}>{texto}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  botonBase: {
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginVertical: 8,
    width: '100%',
    elevation: 2, // Sombra para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  botonPresionado: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }], // Pequeño efecto visual al tocarlo
  },
  contenedorContenido: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12, // Espacio entre la imagen y el texto
  },
  icono: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  textoBoton: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
    flexShrink: 1, // Evita que textos largos rompan el diseño
  },
});
