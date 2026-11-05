import { API_BASE_URL } from '../config/api'; //contiene la url almacenada en un archivo

export async function iniciarSesion(usuario, contrasena) {
  try {
    const respuesta = await fetch(`${API_BASE_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        email: usuario.trim(),
        password: contrasena,
      }),
    });

    const datos = await respuesta.json();

    if (!respuesta.ok || datos.ok !== true) {
      return {
        ok: false,
        mensaje: datos.mensaje || 'No fue posible iniciar sesión.',
      };
    }

    return {
      ok: true,
      mensaje: datos.mensaje,
      token: datos.token,
      usuario: datos.usuario,
    };

  } catch (error) {
    console.log('ERROR LOGIN SOLVER:', error);

    return {
      ok: false,
      mensaje: 'No se pudo completar el inicio de sesión.',
    };
  }
}

export async function cerrarSesion(token) {
  if (typeof token !== 'string' || !/^[a-f0-9]{64}$/.test(token)) {
    return {
      ok: false,
      mensaje: 'Token de sesión inválido.',
    };
  }

  try {
    const respuesta = await fetch(`${API_BASE_URL}/api/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    const datos = await respuesta.json();

    if (!respuesta.ok || datos.ok !== true) {
      return {
        ok: false,
        mensaje: datos.mensaje || 'No fue posible cerrar la sesión.',
        codigo: respuesta.status,
      };
    }

    return {
      ok: true,
      mensaje: datos.mensaje,
    };

  } catch (error) {
    return {
      ok: false,
      mensaje: 'No fue posible conectar con el servidor.',
      errorConexion: true,
    };
  }
}

export async function verificarSesion(token) {
  if (typeof token !== 'string' || !/^[a-f0-9]{64}$/.test(token)) {
    return {
      ok: false,
      mensaje: 'Token de sesión inválido.',
    };
  }

  try {
    const respuesta = await fetch(`${API_BASE_URL}/api/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    const datos = await respuesta.json();

    if (!respuesta.ok || datos.ok !== true) {
      return {
        ok: false,
        mensaje: datos.mensaje || 'La sesión no es válida.',
        codigo: respuesta.status,
      };
    }

    if (
      !datos.usuario ||
      datos.usuario.rol !== 'rider'
    ) {
      return {
        ok: false,
        mensaje: 'El usuario no tiene acceso al Panel Rider.',
      };
    }

    return {
      ok: true,
      usuario: datos.usuario,
    };

  } catch (error) {
    return {
      ok: false,
      mensaje: 'No fue posible verificar la sesión con el servidor.',
      errorConexion: true,
    };
  }
}