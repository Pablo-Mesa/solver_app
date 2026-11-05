
# 📱 Solver Mobile — Resumen del proyecto
**Fecha:** 23/10/2026  
**Chats:** «Planificar app móvil» → «Continuar proyecto Solver» → Implementación y pruebas.

### 🎯 Objetivo
Extender Solver Web (PHP/MySQL) con una aplicación móvil para Riders, reutilizando la base de datos y los permisos existentes, sin afectar el funcionamiento del sistema web.

### ✅ Lo que conseguimos
- Aplicación móvil desarrollada con **React Native + Expo**.
- Inicio, restauración y cierre de sesión mediante token.
- Consulta de producciones y asistencias por fecha.
- Consulta de empresas y turnos disponibles.
- **Marcación de llegada con GPS y validación de ubicación.**
- **Marcación de salida sin GPS.**
- Actualización automática de los botones según el estado de asistencia.
- Registro real de las marcaciones en MySQL.

### 🧪 Prueba integral exitosa
**23/10/2026 — Rider 21**

| Empresa | Entrada | Salida |
|---|---|---|
| Grupo 3, turno 2 | 17:13:33 | 17:22:30 |
| Grupo 4, turno 11 | 17:13:43 | 17:22:33 |

**Resultado:** cuatro registros correctos en MySQL (IDs 93–96). GPS guardado en las entradas; salidas sin GPS.

### 🔎 Observaciones
- Horarios locales de Paraguay comprobados y correctos.
- `127.0.0.1` en las IP registradas, probablemente por Cloudflare Tunnel.
- El historial, las producciones y el login siguen funcionando.
- **No se requieren cambios inmediatos en la base de datos.**

### 📂 Ubicaciones
- **Web/API:** `C:\proyectos\mercedes`
- **Móvil:** `C:\proyectos\mercedes-mobile`
- **Conexión móvil:** Cloudflare Tunnel.
- **Servicio:** `src/services/asistenciasService.js`
- **Pantalla:** `src/screens/MarcarAsistenciaScreen.js`

### 🚀 Estado actual
**Primera versión funcional de Solver Mobile: VALIDADA.**

### ⏭️ Próximos pasos
1. Respaldar esta versión funcional.
2. Probar seguridad: duplicados, GPS fuera del radio y permisos entre Riders.
3. Mejorar progresivamente interfaz, experiencia móvil y configuración para producción.

**Regla para continuar:** preservar lo que funciona. Diagnosticar primero y aplicar cambios mínimos, sin sustituir archivos completos innecesariamente.