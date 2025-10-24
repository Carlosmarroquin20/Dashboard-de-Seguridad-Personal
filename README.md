# 🔒 Dashboard de Seguridad Personal

Aplicación web para evaluar tu seguridad digital y recibir recomendaciones.

## 🛠️ Tecnologías

**Frontend:** React + Vite + TailwindCSS  
**Backend:** Node.js + Express  
**Seguridad:** Helmet, CORS, Rate Limiting, Input Validation, CSP

## 🚀 Instalación Local

### 1. Clonar el repositorio
```bash
git clone https://github.com/TU-USUARIO/security-dashboard.git
cd security-dashboard
```

### 2. Instalar Backend
```bash
cd backend
npm install
```

### 3. Instalar Frontend
```bash
cd ../frontend
npm install
```

### 4. Ejecutar (2 terminales)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Abrir:** http://localhost:5173

---

## 👤 PARA PERSONA 2: DESPLIEGUE MANUAL

### Opción A: Vercel (Frontend) + Render (Backend)

#### Backend en Render:
1. Ve a [render.com](https://render.com) → Sign Up
2. Click **"New +"** → **"Web Service"**
3. Conecta tu repositorio de GitHub
4. Configuración:
   - **Name:** `security-dashboard-backend`
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. **Environment Variables** (Add):
```
   NODE_ENV=production
   FRONTEND_URL=https://TU-APP.vercel.app
```
6. Click **"Create Web Service"**
7. Espera 3-5 minutos → Copia la URL (ej: https://security-dashboard-backend.onrender.com)

#### Frontend en Vercel:
1. Ve a [vercel.com](https://vercel.com) → Sign Up
2. Click **"Add New"** → **"Project"**
3. Importa tu repositorio de GitHub
4. Configuración:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. **Environment Variables** (Add):
```
   VITE_API_URL=https://TU-BACKEND.onrender.com/api
```
6. Click **"Deploy"**
7. Espera 2-3 minutos → ¡Listo!

**IMPORTANTE:** Actualiza `backend/.env` con la URL real de Vercel y redeploya el backend.

### Opción B: Heroku (Ambos)
```bash
# Instalar Heroku CLI
heroku login
heroku create mi-security-dashboard

# Configurar variables
heroku config:set NODE_ENV=production
heroku config:set FRONTEND_URL=https://mi-security-dashboard.herokuapp.com

# Deploy
git push heroku main
```

**Documenta TODO con capturas de pantalla.**

---

## 🤖 PARA PERSONA 3: CI/CD PIPELINE

### GitHub Actions - Pipeline Completo

**Crear archivo:** `.github/workflows/deploy.yml`
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install Backend Dependencies
        working-directory: ./backend
        run: npm install
      
      - name: Run Security Audit
        working-directory: ./backend
        run: npm audit --audit-level=moderate
  
  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install Frontend Dependencies
        working-directory: ./frontend
        run: npm install
      
      - name: Build Frontend
        working-directory: ./frontend
        run: npm run build
      
      - name: Run Security Audit
        working-directory: ./frontend
        run: npm audit --audit-level=moderate

  deploy:
    needs: [test-backend, test-frontend]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Production
        run: echo "Deploy configured with hosting provider"
```

**Pasos:**
1. Crea la carpeta `.github/workflows/` en la raíz
2. Crea el archivo `deploy.yml` con el contenido de arriba
3. Haz commit y push
4. Ve a GitHub → pestaña **"Actions"**
5. El pipeline correrá automáticamente en cada push

**Qué hace el pipeline:**
- ✅ Instala dependencias
- ✅ Escanea vulnerabilidades (`npm audit`)
- ✅ Construye la aplicación
- ✅ Valida que todo compile correctamente

---

## 🔒 Medidas de Seguridad Implementadas

1. **Helmet.js** - Headers HTTP seguros
2. **CORS** - Control de acceso entre dominios
3. **Rate Limiting** - Máximo 100 requests/15min por IP
4. **Input Validation** - Validación estricta con express-validator
5. **Input Sanitization** - Limpieza de datos para prevenir XSS
6. **CSP** - Content Security Policy
7. **Environment Variables** - Secrets en archivos .env
8. **Request Size Limit** - Máximo 10KB por request

---

## 📂 Archivos Importantes

- `backend/server.js` - Todas las medidas de seguridad aquí
- `frontend/src/App.jsx` - Lógica completa de la aplicación
- `.env` - Variables de entorno (NO subir a GitHub)

---

**Proyecto desarrollado para Universidad Mariano Gálvez - Maestría en Seguridad Informática**