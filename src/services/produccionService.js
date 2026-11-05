
import { API_BASE_URL } from '../config/api';

export async function obtenerProducciones(token, fecha = null) {
  if (typeof token !== 'string' || !/^[a-f0-9]{64}$/.test(token)) {
    return {
      ok: false,
      mensaje: 'Token de sesión inválido.',
      codigo: 401,
    };
  }

  try {
    const parametros = new URLSearchParams();

    if (fecha !== null) {
      parametros.append('fecha', fecha);
    }

    const query = parametros.toString();

    const url = `${API_BASE_URL}/api/producciones${
      query ? `?${query}` : ''
    }`;

    const respuesta = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    const datos = await respuesta.json();

    if (!respuesta.ok || datos.ok !== true) {
      return {
        ok: false,
        mensaje: datos.mensaje || 'No fue posible consultar las producciones.',
        codigo: respuesta.status,
      };
    }

    return {
      ok: true,
      fecha: datos.fecha,
      producciones: datos.producciones ?? [],
      resumenGrupos: datos.resumen_grupos ?? [],
    };

  } catch (error) {
    return {
      ok: false,
      mensaje: 'No fue posible conectar con el servidor.',
      errorConexion: true,
    };
  }
}
