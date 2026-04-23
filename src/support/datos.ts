import * as path from 'path';
import * as fs from 'fs';

export interface CredencialesValidas {
  username: string;
  password: string;
}

export interface DatosDeCredenciales {
  user_valid: CredencialesValidas;
  invalid_credentials: CredencialesValidas[];
}

export function cargarDatos(): DatosDeCredenciales {
  const rutaDatos = path.join(process.cwd(), 'data', 'info.json');

  if (fs.existsSync(rutaDatos)) {
    return JSON.parse(fs.readFileSync(rutaDatos, 'utf-8')) as DatosDeCredenciales;
  }

  if (process.env.USUARIO_VALIDO && process.env.CONTRASENA_VALIDA) {
    return {
      user_valid: {
        username: process.env.USUARIO_VALIDO,
        password: process.env.CONTRASENA_VALIDA,
      },
      invalid_credentials: [
        { username: 'usuario_falso_123', password: 'password_incorrecta' },
        { username: 'otro_usuario_falso', password: 'otra_pass_mal' },
      ],
    };
  }

  throw new Error(
    `\nArchivo de datos no encontrado: ${rutaDatos}\n` +
    'Opciones:\n' +
    '  1. Copia data/info.example.json a data/info.json y completa las credenciales.\n' +
    '  2. Define las variables de entorno USUARIO_VALIDO y CONTRASENA_VALIDA.\n'
  );
}
