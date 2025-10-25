# 🔒 Dashboard de Seguridad Personal

Sistema web interactivo para evaluar hábitos de seguridad digital y recibir recomendaciones personalizadas basadas en mejores prácticas de ciberseguridad.

![Security Dashboard](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Node](https://img.shields.io/badge/Node.js-18+-brightgreen)
![React](https://img.shields.io/badge/React-18-61dafb)

---

## 📋 Tabla de Contenidos

- [Descripción](#descripción)
- [Características](#características)
- [Tecnologías](#tecnologías)
- [Medidas de Seguridad](#medidas-de-seguridad)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [API Endpoints](#api-endpoints)
- [CI/CD Pipeline](#cicd-pipeline)
- [Despliegue en Producción](#despliegue-en-producción)

---

## 📖 Descripción

Dashboard de Seguridad Personal es una aplicación web full-stack diseñada para evaluar el nivel de seguridad digital de los usuarios mediante un cuestionario interactivo de 5 preguntas. La aplicación proporciona:

- **Evaluación personalizada** basada en hábitos de seguridad
- **Score cuantitativo** de 0 a 100 puntos
- **Visualización gráfica** mediante radar chart
- **Recomendaciones específicas** priorizadas por nivel de riesgo
- **Historial de evaluaciones** para seguimiento temporal

---

## ✨ Características

### Frontend
- ✅ Interfaz moderna y responsive con React 18
- ✅ Animaciones fluidas con Framer Motion
- ✅ Diseño adaptable (mobile-first) con TailwindCSS
- ✅ Gráficos interactivos con Recharts
- ✅ Navegación intuitiva entre vistas
- ✅ Validación de formularios en tiempo real

### Backend
- ✅ API REST robusta con Express
- ✅ Validación y sanitización de datos
- ✅ Almacenamiento persistente en JSON
- ✅ Sistema de logging de eventos
- ✅ Manejo centralizado de errores
- ✅ Protección multicapa contra vulnerabilidades

---

## 🛠️ Tecnologías

### Stack Principal

| Componente | Tecnología | Versión |
|------------|------------|---------|
| **Frontend** | React | 18.2.0 |
| **Build Tool** | Vite | 5.0.8 |
| **Estilos** | TailwindCSS | 3.3.6 |
| **Animaciones** | Framer Motion | 10.16.16 |
| **Gráficos** | Recharts | 2.10.3 |
| **Iconos** | Lucide React | 0.294.0 |
| **Backend** | Node.js + Express | 4.18.2 |

### Dependencias de Seguridad

- **helmet** (7.1.0): Headers de seguridad HTTP
- **cors** (2.8.5): Control de acceso entre orígenes
- **express-rate-limit** (7.1.5): Limitación de peticiones
- **express-validator** (7.0.1): Validación de datos
- **dotenv** (16.3.1): Gestión de variables de entorno

---

## 🔐 Medidas de Seguridad

La aplicación implementa 8 capas de seguridad siguiendo las mejores prácticas de OWASP:

### 1. Helmet.js - Headers de Seguridad HTTP
Configura automáticamente headers para proteger contra:
- Clickjacking (X-Frame-Options)
- XSS reflejado (X-XSS-Protection)
- Sniffing de MIME (X-Content-Type-Options)
- Content Security Policy (CSP)

### 2. CORS (Cross-Origin Resource Sharing)
Control estricto de acceso:
- Whitelist de dominios permitidos
- Restricción de métodos HTTP
- Validación de origen

### 3. Rate Limiting
Prevención de ataques de fuerza bruta:
- Límite: 100 peticiones por IP cada 15 minutos
- Respuesta HTTP 429 al exceder
- Aplica a todas las rutas `/api/*`

### 4. Validación de Inputs
Validación exhaustiva con express-validator:
- Tipos de datos correctos
- Longitudes permitidas (nombre: 2-50 chars)
- Formatos válidos (email normalizado)
- Valores permitidos en respuestas

### 5. Sanitización de Datos
Limpieza de inputs para prevenir XSS:
- Eliminación de etiquetas HTML (`< >`)
- Escape de caracteres especiales
- Límite máximo de 500 caracteres

### 6. Content Security Policy (CSP)
Política estricta de carga de recursos:
- Scripts solo del mismo origen
- Estilos inline permitidos con restricciones
- Imágenes HTTPS autorizadas

### 7. Variables de Entorno
Gestión segura de configuración sensible:
- Archivos `.env` excluidos del repositorio
- Configuración diferenciada por entorno
- No exposición de credenciales en código

### 8. Límite de Tamaño de Requests
Prevención de ataques DoS:
- Máximo 10KB por petición
- Rechazo automático de payloads grandes

---

## 🚀 Instalación

### Requisitos Previos

Asegúrate de tener instalado:
- **Node.js** versión 16 o superior
- **npm** versión 8 o superior
- **Git** para clonar el repositorio

Verifica las versiones:
```bash
node --version  # Debe mostrar v16.x.x o superior
npm --version   # Debe mostrar 8.x.x o superior
```

### Paso 1: Clonar el Repositorio
```bash
git clone https://github.com/TU-USUARIO/security-dashboard.git
cd security-dashboard
```

### Paso 2: Instalar Dependencias del Backend
```bash
cd backend
npm install
```

Esto instalará:
- Express y dependencias core
- Paquetes de seguridad (helmet, cors, etc.)
- Validadores y utilidades

**Tiempo estimado:** 1-2 minutos

### Paso 3: Instalar Dependencias del Frontend
```bash
cd ../frontend
npm install
```

Esto instalará:
- React y React DOM
- Vite y plugins
- TailwindCSS y PostCSS
- Librerías de UI (Recharts, Framer Motion, Lucide)

**Tiempo estimado:** 2-3 minutos

---

## ⚙️ Configuración

### Variables de Entorno

La aplicación requiere dos archivos `.env` para funcionar correctamente.

#### Backend: `backend/.env`

Crea el archivo `backend/.env` con el siguiente contenido:
```env
# Puerto del servidor backend
PORT=5000

# URL del frontend (para CORS)
FRONTEND_URL=http://localhost:5173

# Entorno de ejecución
NODE_ENV=development
```

#### Frontend: `frontend/.env`

Crea el archivo `frontend/.env` con el siguiente contenido:
```env
# URL de la API del backend
VITE_API_URL=http://localhost:5000/api
```

> ⚠️ **Importante:** Los archivos `.env` están incluidos en `.gitignore` y no se subirán al repositorio por seguridad.

---

## 💻 Uso

### Ejecución en Modo Desarrollo

Necesitarás **dos terminales** abiertas simultáneamente.

#### Terminal 1: Iniciar el Backend
```bash
cd backend
npm run dev
```

**Salida esperada:**
```
🚀 Servidor corriendo en http://localhost:5000
🔒 Medidas de seguridad activas
📁 Directorio de datos: /ruta/backend/data
```

El servidor backend estará escuchando en el puerto 5000 y listo para recibir peticiones.

#### Terminal 2: Iniciar el Frontend
```bash
cd frontend
npm run dev
```

**Salida esperada:**
```
VITE v5.0.8  ready in 350 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Acceder a la Aplicación

Abre tu navegador y visita:
```
http://localhost:5173
```

Deberías ver la pantalla de inicio del Dashboard de Seguridad Personal.

### Scripts Disponibles

#### Backend
```bash
npm start      # Ejecutar en modo producción
npm run dev    # Ejecutar en modo desarrollo (con nodemon)
```

#### Frontend
```bash
npm run dev       # Servidor de desarrollo con HMR
npm run build     # Construir para producción
npm run preview   # Vista previa del build de producción
```

---

## 📁 Estructura del Proyecto
```
security-dashboard/
│
├── frontend/                      # Aplicación React
│   ├── src/
│   │   ├── App.jsx               # Componente principal (4 vistas)
│   │   ├── main.jsx              # Punto de entrada de React
│   │   └── index.css             # Estilos globales con Tailwind
│   ├── public/                   # Archivos estáticos
│   ├── index.html                # HTML base
│   ├── vite.config.js            # Configuración de Vite
│   ├── tailwind.config.js        # Configuración de Tailwind
│   ├── postcss.config.js         # Configuración de PostCSS
│   ├── package.json              # Dependencias y scripts
│   └── .env                      # Variables de entorno (no versionado)
│
├── backend/                       # API REST con Express
│   ├── server.js                 # Servidor principal
│   ├── data/                     # Almacenamiento de evaluaciones (generado)
│   │   └── evaluation_*.json    # Archivos de evaluaciones
│   ├── package.json              # Dependencias y scripts
│   └── .env                      # Variables de entorno (no versionado)
│
├── .github/
│   └── workflows/
│       └── deploy.yml            # Pipeline CI/CD con GitHub Actions
│
├── .gitignore                    # Archivos excluidos del repositorio
└── README.md                     # Documentación del proyecto
```

### Descripción de Componentes Clave

**`frontend/src/App.jsx`**
- Gestión de estado con React Hooks
- 4 vistas principales: Home, Questionnaire, Results, History
- Lógica de navegación y transiciones
- Comunicación con la API

**`backend/server.js`**
- Configuración de Express y middleware
- Implementación de medidas de seguridad
- Definición de endpoints REST
- Funciones de cálculo de score y recomendaciones
- Sistema de logging

---

## 🌐 API Endpoints

### Base URL (Desarrollo)
```
http://localhost:5000/api
```

### Endpoints Disponibles

#### 1. Health Check
```http
GET /api/health
```

**Descripción:** Verifica el estado del servidor

**Respuesta:**
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

---

#### 2. Crear Evaluación
```http
POST /api/evaluate
```

**Descripción:** Procesa y guarda una nueva evaluación de seguridad

**Body (JSON):**
```json
{
  "name": "Juan Pérez",
  "email": "juan@ejemplo.com",
  "answers": {
    "password": "si",
    "twoFactor": "no",
    "updates": "siempre",
    "publicWifi": "no",
    "backup": "si"
  }
}
```

**Validaciones:**
- `name`: String, 2-50 caracteres
- `email`: Email válido
- `answers.password`: "si" | "no"
- `answers.twoFactor`: "si" | "no"
- `answers.updates`: "siempre" | "a-veces" | "nunca"
- `answers.publicWifi`: "si" | "no"
- `answers.backup`: "si" | "no"

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": {
    "id": "1729795123456",
    "score": 80,
    "recommendations": [
      {
        "title": "Autenticación de Dos Factores",
        "description": "Activa 2FA en todas tus cuentas importantes.",
        "priority": "alta"
      }
    ]
  }
}
```

**Respuesta Error (400):**
```json
{
  "errors": [
    {
      "msg": "Invalid email",
      "param": "email"
    }
  ]
}
```

---

#### 3. Listar Evaluaciones
```http
GET /api/evaluations
```

**Descripción:** Obtiene el historial de todas las evaluaciones

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1729795123456",
      "timestamp": "2025-10-24T10:30:00.000Z",
      "name": "Juan Pérez",
      "score": 80
    },
    {
      "id": "1729795000000",
      "timestamp": "2025-10-23T15:20:00.000Z",
      "name": "María García",
      "score": 60
    }
  ]
}
```

---

#### 4. Obtener Evaluación Específica
```http
GET /api/evaluations/:id
```

**Descripción:** Obtiene los detalles completos de una evaluación

**Parámetros:**
- `id`: ID de la evaluación

**Respuesta (200):**
```json
{
  "success": true,
  "data": {
    "id": "1729795123456",
    "timestamp": "2025-10-24T10:30:00.000Z",
    "name": "Juan Pérez",
    "email": "juan@ejemplo.com",
    "score": 80,
    "recommendations": [...],
    "answers": {...}
  }
}
```

**Respuesta Error (404):**
```json
{
  "success": false,
  "message": "Evaluación no encontrada"
}
```

---

## 🤖 CI/CD Pipeline

### GitHub Actions

El proyecto incluye un pipeline automatizado que se ejecuta en cada push a la rama `main`.

**Ubicación:** `.github/workflows/deploy.yml`

### Jobs Implementados

#### 1. test-backend
- Configura Node.js 18
- Instala dependencias del backend
- Ejecuta auditoría de seguridad (`npm audit`)
- **Duración:** ~15 segundos

#### 2. test-frontend
- Configura Node.js 18
- Instala dependencias del frontend
- Construye la aplicación (`npm run build`)
- Ejecuta auditoría de seguridad
- **Duración:** ~20 segundos

#### 3. deploy
- Se ejecuta solo si los tests anteriores pasan
- Confirma que la aplicación está lista para despliegue
- **Duración:** ~3 segundos

### Características del Pipeline

✅ **Ejecución automática** en cada push  
✅ **Validación de dependencias** sin vulnerabilidades graves  
✅ **Verificación de build** sin errores de compilación  
✅ **Reportes visuales** en la pestaña Actions de GitHub  

### Ver Resultados

1. Ve a tu repositorio en GitHub
2. Click en la pestaña **"Actions"**
3. Selecciona un workflow para ver detalles
4. Cada job muestra logs completos de ejecución

---

## 🌍 Despliegue en Producción

### Opción 1: Vercel (Frontend) + Render (Backend)

#### Desplegar Backend en Render

1. Crea una cuenta en [render.com](https://render.com)
2. Click en **"New +"** → **"Web Service"**
3. Conecta tu repositorio de GitHub
4. Configuración:
   - **Name:** `security-dashboard-backend`
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Variables de entorno:
```
   NODE_ENV=production
   FRONTEND_URL=https://tu-app.vercel.app
```
6. Click **"Create Web Service"**

**Resultado:** `https://security-dashboard-backend.onrender.com`

#### Desplegar Frontend en Vercel

1. Crea una cuenta en [vercel.com](https://vercel.com)
2. Click en **"Add New"** → **"Project"**
3. Importa tu repositorio de GitHub
4. Configuración:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Variables de entorno:
```
   VITE_API_URL=https://security-dashboard-backend.onrender.com/api
```
6. Click **"Deploy"**

**Resultado:** `https://security-dashboard.vercel.app`

### Opción 2: Heroku (Fullstack)
```bash
# Instalar Heroku CLI
heroku login

# Crear aplicación
heroku create security-dashboard

# Configurar variables
heroku config:set NODE_ENV=production
heroku config:set FRONTEND_URL=https://security-dashboard.herokuapp.com

# Desplegar
git push heroku main
```

---

## 👥 Desarrollo

### Desarrollado por

**Universidad Mariano Gálvez de Guatemala**  
Maestría en Seguridad Informática  
Actividad: Implementación Segura de Aplicaciones

### Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

## 📞 Soporte

Para problemas o preguntas:
- Abre un issue en GitHub
- Revisa la documentación técnica
- Consulta los logs del servidor

---

**Desarrollado con ❤️ para promover mejores prácticas de seguridad digital**