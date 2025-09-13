# Notas App

Una aplicación moderna para tomar notas con backend en Supabase, autenticación de usuarios y sincronización en tiempo real.

## Características

- ✅ Autenticación con email/password, GitHub y Google
- ✅ Crear, editar y eliminar notas
- ✅ Sincronización en tiempo real
- ✅ Búsqueda en tiempo real
- ✅ Exportar notas a JSON
- ✅ Importar notas desde JSON
- ✅ Interfaz moderna y responsive
- ✅ Atajos de teclado
- ✅ Base de datos segura con Supabase

## Configuración

### 1. Configurar Supabase

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta
2. Crea un nuevo proyecto
3. Ve a Settings > API y copia:
   - Project URL
   - Anon public key

### 2. Configurar OAuth (Opcional)

#### GitHub OAuth:
1. Ve a GitHub Settings > Developer settings > OAuth Apps
2. Crea una nueva OAuth App
3. Configura la URL de autorización: `https://tu-proyecto.supabase.co/auth/v1/authorize`
4. Copia Client ID y Client Secret

#### Google OAuth:
1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Crea un proyecto o selecciona uno existente
3. Habilita Google+ API
4. Crea credenciales OAuth 2.0
5. Copia Client ID y Client Secret

### 3. Configurar variables de entorno

1. Copia `env.example` a `.env`
2. Actualiza las variables con tus credenciales:

```env
SUPABASE_URL=tu_supabase_url
SUPABASE_ANON_KEY=tu_supabase_anon_key
GITHUB_CLIENT_ID=tu_github_client_id
GITHUB_CLIENT_SECRET=tu_github_client_secret
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret
```

### 4. Configurar la base de datos

1. Ejecuta las migraciones SQL en tu proyecto Supabase:
   - Ve a SQL Editor en tu dashboard de Supabase
   - Ejecuta el contenido de `supabase/migrations/001_create_notes_table.sql`

### 5. Configurar autenticación en Supabase

1. Ve a Authentication > Settings en tu dashboard de Supabase
2. Configura las URLs de redirección:
   - Site URL: `http://localhost:3000` (desarrollo) o tu dominio de producción
   - Redirect URLs: `http://localhost:3000` (desarrollo) o tu dominio de producción
3. Habilita los proveedores OAuth que quieras usar (GitHub, Google)

## Instalación y desarrollo

```bash
# Instalar dependencias
npm install

# Ejecutar servidor de desarrollo
npm run dev

# La aplicación estará disponible en http://localhost:3000
```

## Despliegue

### GitHub Pages

1. Sube tu código a GitHub
2. Ve a Settings > Pages en tu repositorio
3. Selecciona "Deploy from a branch" y elige "main"
4. Actualiza las variables de entorno con la URL de producción

### Otras plataformas

La aplicación es estática y puede desplegarse en cualquier servicio de hosting estático:
- Vercel
- Netlify
- Firebase Hosting
- AWS S3 + CloudFront

## Uso

1. Abre la aplicación en tu navegador
2. Inicia sesión o regístrate
3. Comienza a crear tus notas
4. Tus notas se sincronizan automáticamente

## Atajos de teclado

- `Ctrl + S`: Guardar nota
- `Ctrl + Enter`: Guardar nota (desde el área de contenido)
- `Escape`: Limpiar formulario o cerrar modal
- `Ctrl + F`: Enfocar búsqueda

## Tecnologías

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Supabase (PostgreSQL + API REST + Real-time)
- **Autenticación**: Supabase Auth
- **Base de datos**: PostgreSQL con Row Level Security
- **Despliegue**: GitHub Pages

## Estructura del proyecto

```
notas-app/
├── index.html              # Página principal
├── script.js               # Lógica principal de la aplicación
├── styles.css              # Estilos CSS
├── js/
│   └── supabase.js         # Configuración y API de Supabase
├── supabase/
│   ├── config.toml         # Configuración de Supabase
│   └── migrations/
│       └── 001_create_notes_table.sql  # Migración de base de datos
├── package.json            # Dependencias de Node.js
└── README.md              # Este archivo
```

## Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.