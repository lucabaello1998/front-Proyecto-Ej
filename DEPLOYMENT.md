# Muestrario de Proyectos - Frontend

## 🚀 Deployment en Vercel

### Variables de entorno requeridas:

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega:

```
VITE_API_URL=https://back-proyecto-ej.onrender.com
```

4. Aplica a: Production, Preview, Development

### Desarrollo Local

```bash
# 1. Copia el archivo de ejemplo
cp .env.example .env

# 2. El .env ya está configurado para localhost:3000

# 3. Instala dependencias
npm install

# 4. Inicia el servidor
npm run dev
```

## 📝 Notas

- ⚠️ **NUNCA** subas el archivo `.env` a GitHub
- ✅ El `.env.example` muestra qué variables se necesitan
- ✅ Configura las variables de entorno directamente en Vercel
