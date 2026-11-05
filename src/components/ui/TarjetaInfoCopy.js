import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

export default function TarjetaInfo({ iconoUrl, empresa, fecha, accion, turno, tarifa }) {
  return (
      <View className="flex flex-col gap-2 w-72 z-50">
        <View className="flex-row items-center justify-between w-full min-h-[70px] rounded-lg bg-[#232531] px-3 py-2">
          
          {/* Contenedor Izquierdo: Icono e Información Principal */}
          <View className="flex-row items-center gap-3 flex-1">
            
            {/* Contenedor del Icono / Imagen de la empresa */}
            <View className="bg-white/5 backdrop-blur-xl p-1 rounded-lg w-10 h-10 items-center justify-center">
              {iconoUrl ? (
                <Image 
                  source={{ uri: iconoUrl }} 
                  className="w-8 h-8 rounded-md"
                  style={{ width: 32, height: 32 }}
                  resizeMode="cover"
                />
              ) : (
                /* Fallback en caso de que no haya URL de icono */
                <View className="w-6 h-6 bg-[#2b9875] rounded-full" />
              )}
            </View>

            {/* Textos Informativos */}
            <View className="flex-1">
              <Text className="text-white font-bold text-sm" numberOfLines={1}>
                {empresa}
              </Text>
              <Text className="text-gray-400 text-xs mt-0.5">
                {accion} • {turno}
              </Text>
              <Text className="text-gray-500 text-[10px] mt-0.5">
                {fecha}
              </Text>
            </View>
            <Text className="text-[#2b9875] font-bold text-sm">
              {tarifa} cambio
            </Text>
          </View>

          {/* Contenedor Derecho: Tarifa o Precio */}
          <View className="ml-2 items-end">
            
          </View>

        </View>
      </View>
  );
}
