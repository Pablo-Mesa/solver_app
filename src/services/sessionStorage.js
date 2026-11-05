import * as SecureStore from 'expo-secure-store';

const CLAVE_TOKEN = 'solver_rider_token';

//
export async function guardarToken(token) {
  if (typeof token !== 'string' || !/^[a-f0-9]{64}$/.test(token)) {
    throw new Error('Formato de token inválido.');
  }

  await SecureStore.setItemAsync(CLAVE_TOKEN, token);
}

//
export async function obtenerToken() {
  return await SecureStore.getItemAsync(CLAVE_TOKEN);
}

//
export async function eliminarToken() {
  await SecureStore.deleteItemAsync(CLAVE_TOKEN);
}
