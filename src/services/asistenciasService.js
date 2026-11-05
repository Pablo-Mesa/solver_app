
import { API_BASE_URL } from '../config/api';

export async function obtenerAsistencias(token, fecha = null) {
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

    const url = `${API_BASE_URL}/api/asistencias${
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
        mensaje: datos.mensaje || 'No fue posible consultar las asistencias.',
        codigo: respuesta.status,
      };
    }

    return {
      ok: true,
      fecha: datos.fecha,
      asistencias: datos.asistencias ?? [],
    };

  } catch (error) {
    return {
      ok: false,
      mensaje: 'No fue posible conectar con el servidor.',
      errorConexion: true,
    };
  }
}

/**
 * Obtener empresas y turnos disponibles
 * para marcar llegada o salida.
 */
export async function obtenerOpcionesMarcacion(token) {
  if (typeof token !== 'string' || !/^[a-f0-9]{64}$/i.test(token)) {
    return {
      ok: false,
      mensaje: 'Token de sesión inválido.',
      codigo: 401,
    };
  }

  try {
    const respuesta = await fetch(
      `${API_BASE_URL}/api/asistencias/opciones`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      }
    );

    const datos = await respuesta.json();

    if (!respuesta.ok || datos.ok !== true) {
      return {
        ok: false,
        mensaje: datos.mensaje || 'No fue posible obtener los turnos.',
        codigo: respuesta.status,
      };
    }

    return {
      ok: true,
      fecha: datos.fecha,
      empresas: Array.isArray(datos.empresas) ? datos.empresas : [],
    };
  } catch (error) {
    return {
      ok: false,
      mensaje: 'No fue posible conectar con el servidor.',
      errorConexion: true,
    };
  }
}

/**
 * Registrar llegada o salida.
 *
 * La llegada requiere lat y lon.
 * La salida requiere fecha_jornada.
 */
export async function registrarMarcacion(token, payload) {
  if (typeof token !== 'string' || !/^[a-f0-9]{64}$/i.test(token)) {
    return {
      ok: false,
      mensaje: 'Token de sesión inválido.',
      codigo: 401,
    };
  }

  try {
    const respuesta = await fetch(
      `${API_BASE_URL}/api/asistencias/marcar`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    const datos = await respuesta.json();

    return {
      ...datos,
      ok: respuesta.ok && datos.ok === true,
      codigo: respuesta.status,
    };
  } catch (error) {
    return {
      ok: false,
      mensaje: 'No fue posible conectar con el servidor.',
      errorConexion: true,
    };
  }
}
