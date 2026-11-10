
import { API_BASE_URL } from '../config/api';

export async function obtenerEmpresas(token) {
  if (typeof token !== 'string' || !/^[a-f0-9]{64}$/.test(token)) {
    return {
      ok: false,
      mensaje: 'Token de sesión inválido.',
      codigo: 401,
    };
  }

  try {
    const parametros = new URLSearchParams();

    const query = parametros.toString();

    const url = `${API_BASE_URL}/api/empresas${
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
        mensaje: datos.mensaje || 'No fue posible consultar las empresas.',
        codigo: respuesta.status,
      };
    }

    return {
      ok: true,
      empresas: datos.empresas ?? [],
    };

  } catch (error) {
    return {
      ok: false,
      mensaje: 'No fue posible conectar con el servidor. SERVIDOR.',
      errorConexion: true,
      detalle: error instanceof Error ? error.message : String(error),
    };
  }
}
