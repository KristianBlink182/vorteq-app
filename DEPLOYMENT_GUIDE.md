# 🚀 Guía de Despliegue: TestFlight (iOS) y Web en Producción

Esta guía contiene el paso a paso exacto para desplegar **Vorteq B2B** en **TestFlight** usando **GitHub + Codemagic**, y en **Producción Web** (Vercel / Netlify) con dominio público HTTPS.

---

## 📋 Resumen de lo Configurado en el Repositorio
Ya hemos dejado todo preparado en el código:
1. **Capacitor iOS (`ios/App`)**: Estructura nativa de Xcode lista y sincronizada con el build de React.
2. **`capacitor.config.json`**: Con `appId: "com.vorteq.trade"` y `webDir: "dist"`.
3. **`codemagic.yaml`**: Pipeline CI/CD que instala dependencias, compila React Vite, sincroniza Capacitor, firma la app con Apple y sube el `.ipa` directamente a TestFlight.

---

## 1️⃣ Paso 1: Subir el Proyecto a tu Repositorio de GitHub

Abre tu terminal en la carpeta del proyecto y ejecuta:

```bash
# 1. Inicializar git (si no está inicializado)
git init

# 2. Agregar todos los archivos
git add .

# 3. Crear el primer commit
git commit -m "feat: complete b2b trading platform with ios capacitor and codemagic pipeline"

# 4. Vincular con tu repositorio de GitHub (crea uno nuevo en github.com/new si aún no lo tienes)
git branch -M main
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git

# 5. Subir los cambios a GitHub
git push -u origin main
```

---

## 2️⃣ Paso 2: Configurar Codemagic para subir a TestFlight

### A. Preparar App Store Connect (Apple Developer)
1. Ingresa a [developer.apple.com](https://developer.apple.com/) y asegúrate de tener una cuenta activa de Apple Developer.
2. Ve a [App Store Connect](https://appstoreconnect.apple.com/) -> **Mis Apps** -> pulsa el botón **(+)** y selecciona **Nueva app**:
   - **Plataforma:** iOS
   - **Nombre:** Vorteq B2B (o el nombre que prefieras)
   - **Idioma principal:** Español o Inglés
   - **Bundle ID:** Crea o selecciona `com.vorteq.trade` (o el que hayas registrado)
   - **SKU:** `vorteq-b2b-01`
3. Ve a **Usuarios y acceso** -> pestaña **Integraciones** -> **Claves de la API de App Store Connect**:
   - Pulsa **(+)** para generar una nueva clave.
   - Nombre: `Codemagic CI`
   - Acceso: `Desarrollador` o `Administrador`
   - Guarda los 3 datos:
     - **Issuer ID** (UUID arriba)
     - **Key ID** (ID de la clave generada)
     - **Descarga el archivo `.p8`** (solo se puede descargar una vez).

### B. Conectar en Codemagic
1. Inicia sesión en [codemagic.io](https://codemagic.io/).
2. Ve a **Teams** -> **Integrations** (o Configuración de tu cuenta) -> **Apple Developer Portal**:
   - Haz clic en **Manage keys** -> **Add key**.
   - Ingresa:
     - **Key name:** `Apple App Store Connect`
     - **Issuer ID:** Pega el Issuer ID.
     - **Key ID:** Pega el Key ID.
     - **API key (.p8):** Sube el archivo `.p8` descargado.
3. Ve a **Applications** -> **Add application** -> selecciona **GitHub** y escoge tu repositorio.
4. En tipo de proyecto, selecciona **Capacitor** o **codemagic.yaml detected**.
5. Ve a **Distribution** -> **App Store Connect**:
   - Activa la distribución a **TestFlight**.
   - Selecciona la clave de Apple que acabas de configurar.
6. Pulsa **Start new build** seleccionando la rama `main` y el workflow `ios-release-testflight`.

Codemagic compilará el código, creará el `.ipa` firmado y lo enviará automáticamente a **App Store Connect / TestFlight**.
En 5-10 minutos recibirás el correo de Apple avisando que la compilación está disponible para probar en la app TestFlight de tu iPhone.

---

## 3️⃣ Paso 3: Subir la Página Web a Producción (Vercel / Netlify)

Para ver y compartir la plataforma web en tiempo real:

### Opción A: Vercel (Recomendado - 2 minutos)
1. Entra a [vercel.com](https://vercel.com/) e inicia sesión con tu cuenta de GitHub.
2. Pulsa **Add New...** -> **Project**.
3. Selecciona tu repositorio de GitHub recién subido.
4. Vercel detectará Vite automáticamente:
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Pulsa **Deploy**.
6. En 30 segundos tendrás tu URL pública HTTPS (ej. `vorteq-b2b.vercel.app`) lista para usar en navegadores de escritorio y móviles.

### Opción B: Netlify
1. Entra a [netlify.com](https://netlify.com/) -> **Add new site** -> **Import an existing project**.
2. Conecta GitHub y selecciona el repositorio.
3. Configuración de Build:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Pulsa **Deploy Site**.

---

## 🛠️ Comandos útiles locales

Si quieres probar en tu Mac localmente con Xcode:
```bash
# Sincronizar el build web con el proyecto de Xcode
npm run cap:sync

# Abrir el proyecto directamente en Xcode
npm run cap:open
```
En Xcode solo seleccionas tu dispositivo o simulador y pulsas el botón **Play (Run)**.
