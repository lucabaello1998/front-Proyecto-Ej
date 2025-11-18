# Muestrario de Proyectos

Aplicación web para mostrar y administrar proyectos desarrollados por el equipo (Agustín, Cyn, Sebastián).

## 🚀 Características

- **Vista Pública**: Lista de proyectos con buscador y paginación
- **Vista de Detalle**: Información completa de cada proyecto (imágenes, descripción, stack, tags, creador)
- **Panel de Administración**: CRUD completo de proyectos (requiere autenticación)
- **Autenticación**: Sistema de login con JWT
- **Búsqueda**: Filtrado por título, descripción, creador, tags y stack tecnológico

## 🛠️ Stack Tecnológico

- **React** 18 con TypeScript
- **Material UI** - Componentes de interfaz
- **Zustand** - Gestión de estado
- **Axios** - Cliente HTTP
- **React Router** - Enrutamiento
- **Vite** - Build tool

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Iniciar en modo desarrollo
npm run dev
```

## 🔧 Configuración

Edita el archivo `.env` con la URL de tu API:

```env
# Desarrollo
VITE_API_URL=http://localhost:3000

# Producción
# VITE_API_URL=https://back-proyecto-ej.onrender.com
```

## 📁 Estructura del Proyecto

```
src/
├── components/         # Componentes reutilizables
│   ├── Navbar.tsx
│   ├── LoginDialog.tsx
│   ├── ProjectFormDialog.tsx
│   └── ProtectedRoute.tsx
├── pages/             # Páginas principales
│   ├── ProjectsListPage.tsx
│   ├── ProjectDetailPage.tsx
│   └── AdminPage.tsx
├── services/          # Servicios API
│   └── api/
│       ├── client.ts
│       ├── auth.ts
│       └── projects.ts
├── store/             # Estado global (Zustand)
│   ├── authStore.ts
│   └── projectsStore.ts
├── types/             # Interfaces TypeScript
│   └── index.ts
├── App.tsx
└── main.tsx
```

## 🔐 Autenticación

Credenciales de prueba:
- **Usuario**: `prueba`
- **Contraseña**: `123456`

## 🌐 API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión

### Proyectos
- `GET /api/projects?page=1&limit=10` - Listar proyectos (paginado)
- `GET /api/projects/:id` - Obtener proyecto por ID
- `POST /api/projects` - Crear proyecto (requiere auth)
- `PUT /api/projects/:id` - Actualizar proyecto (requiere auth)
- `DELETE /api/projects/:id` - Eliminar proyecto (requiere auth)

## 📝 Uso

1. **Vista Pública**: Navega por los proyectos y usa el buscador para filtrar
2. **Login**: Haz clic en "Login" en el navbar e ingresa tus credenciales
3. **Administración**: Una vez autenticado, accede al panel de administración
4. **Crear Proyecto**: Agrega título, descripción, imágenes (base64), stack, tags y creador
5. **Editar/Eliminar**: Gestiona proyectos existentes desde el panel de admin

## 🎨 Características de Interfaz

- Diseño responsive con Material UI
- Tarjetas de proyecto con preview de imagen
- Chips para visualizar tags y stack tecnológico
- Galería de imágenes en vista de detalle
- Formularios con validación
- Diálogos de confirmación para acciones destructivas

## 🚀 Scripts Disponibles

```bash
npm run dev      # Modo desarrollo
npm run build    # Build para producción
npm run preview  # Preview del build
npm run lint     # Ejecutar linter
```

## 📄 Licencia

Proyecto privado del equipo.
