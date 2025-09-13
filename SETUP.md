# Guía de Configuración - Notas App

Esta guía te ayudará a configurar tu aplicación de notas con Supabase paso a paso.

## 📋 Prerrequisitos

- Cuenta en [GitHub](https://github.com)
- Cuenta en [Supabase](https://supabase.com)
- Node.js instalado (versión 18 o superior)
- Git instalado

## 🚀 Configuración Paso a Paso

### 1. Configurar Supabase

1. **Crear cuenta en Supabase**
   - Ve a [supabase.com](https://supabase.com)
   - Haz clic en "Start your project"
   - Regístrate con GitHub o email

2. **Crear un nuevo proyecto**
   - Haz clic en "New Project"
   - Elige tu organización
   - Nombre del proyecto: `notas-app`
   - Contraseña de la base de datos: (guárdala en un lugar seguro)
   - Región: Elige la más cercana a ti
   - Haz clic en "Create new project"

3. **Obtener credenciales**
   - Ve a Settings > API
   - Copia la "Project URL"
   - Copia la "anon public" key

### 2. Configurar la Base de Datos

1. **Ejecutar migración SQL**
   - Ve a SQL Editor en tu dashboard de Supabase
   - Haz clic en "New query"
   - Copia y pega el contenido de `supabase/migrations/001_create_notes_table.sql`
   - Haz clic en "Run" para ejecutar la migración

2. **Verificar la tabla**
   - Ve a Table Editor
   - Deberías ver la tabla `notes` creada

### 3. Configurar Autenticación

1. **Configurar URLs de redirección**
   - Ve a Authentication > Settings
   - En "Site URL" pon: `http://localhost:3000`
   - En "Redirect URLs" agrega: `http://localhost:3000`

2. **Configurar proveedores OAuth (Opcional)**

#### GitHub OAuth:
1. Ve a GitHub Settings > Developer settings > OAuth Apps
2. Haz clic en "New OAuth App"
3. Application name: `Notas App`
4. Homepage URL: `http://localhost:3000`
5. Authorization callback URL: `https://tu-proyecto.supabase.co/auth/v1/callback`
6. Copia Client ID y Client Secret

#### Google OAuth:
1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Crea un proyecto o selecciona uno existente
3. Habilita Google+ API
4. Ve a Credentials > Create Credentials > OAuth 2.0 Client ID
5. Application type: Web application
6. Authorized redirect URIs: `https://tu-proyecto.supabase.co/auth/v1/callback`
7. Copia Client ID y Client Secret

3. **Configurar en Supabase**
   - Ve a Authentication > Providers
   - Habilita los proveedores que quieras usar
   - Agrega las credenciales de GitHub/Google

### 4. Configurar Variables de Entorno

1. **Crear archivo de configuración**
   ```bash
   cp env.example .env
   ```

2. **Actualizar variables**
   Edita el archivo `.env` con tus credenciales:
   ```env
   SUPABASE_URL=https://tu-proyecto.supabase.co
   SUPABASE_ANON_KEY=tu_anon_key_aqui
   GITHUB_CLIENT_ID=tu_github_client_id
   GITHUB_CLIENT_SECRET=tu_github_client_secret
   GOOGLE_CLIENT_ID=tu_google_client_id
   GOOGLE_CLIENT_SECRET=tu_google_client_secret
   ```

3. **Actualizar configuración de la app**
   Edita `js/config.js` con tus credenciales:
   ```javascript
   const config = {
     development: {
       supabaseUrl: 'https://tu-proyecto.supabase.co',
       supabaseAnonKey: 'tu_anon_key_aqui',
       environment: 'development'
     },
     production: {
       supabaseUrl: 'https://tu-proyecto.supabase.co',
       supabaseAnonKey: 'tu_anon_key_aqui',
       environment: 'production'
     }
   };
   ```

### 5. Instalar y Ejecutar

1. **Instalar dependencias**
   ```bash
   npm install
   ```

2. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

3. **Abrir en el navegador**
   - Ve a `http://localhost:3000`
   - Deberías ver la aplicación funcionando

### 6. Probar la Aplicación

1. **Registrarse**
   - Haz clic en "Registrarse"
   - Crea una cuenta con email/password
   - O usa GitHub/Google

2. **Crear una nota**
   - Escribe un título y contenido
   - Haz clic en "Guardar"
   - La nota debería aparecer en la lista

3. **Verificar sincronización**
   - Abre la aplicación en otra pestaña
   - Las notas deberían sincronizarse automáticamente

## 🚀 Despliegue

### GitHub Pages

1. **Subir a GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Configurar GitHub Pages**
   - Ve a Settings > Pages en tu repositorio
   - Source: Deploy from a branch
   - Branch: main
   - Folder: / (root)

3. **Actualizar configuración de producción**
   - Actualiza las URLs en `js/config.js` con tu dominio de GitHub Pages

### Vercel

1. **Instalar Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Desplegar**
   ```bash
   vercel
   ```

3. **Configurar variables de entorno**
   - Ve a tu proyecto en Vercel
   - Settings > Environment Variables
   - Agrega las variables de Supabase

### Netlify

1. **Conectar repositorio**
   - Ve a [netlify.com](https://netlify.com)
   - Conecta tu repositorio de GitHub

2. **Configurar build**
   - Build command: `npm run build`
   - Publish directory: `.`

3. **Configurar variables de entorno**
   - Site settings > Environment variables
   - Agrega las variables de Supabase

## 🔧 Solución de Problemas

### Error: "Invalid API key"
- Verifica que las credenciales de Supabase sean correctas
- Asegúrate de usar la "anon public" key, no la "service_role" key

### Error: "Failed to fetch"
- Verifica que la URL de Supabase sea correcta
- Asegúrate de que el proyecto esté activo en Supabase

### Error de autenticación OAuth
- Verifica que las URLs de redirección estén configuradas correctamente
- Asegúrate de que las credenciales OAuth sean correctas

### Las notas no se sincronizan
- Verifica que Row Level Security esté configurado correctamente
- Asegúrate de que el usuario esté autenticado

## 📞 Soporte

Si tienes problemas:

1. Revisa los logs en la consola del navegador
2. Verifica la configuración en Supabase
3. Asegúrate de que todas las variables de entorno estén configuradas
4. Revisa que la migración SQL se haya ejecutado correctamente

¡Tu aplicación de notas debería estar funcionando perfectamente! 🎉
