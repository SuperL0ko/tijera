# Tijera

Corta un vídeo en trozos del tamaño que admiten los estados de WhatsApp.
Todo el procesado ocurre en el dispositivo con ffmpeg.wasm: ningún vídeo sale de ahí.

- **Modo rápido**: sin recodificar. Lee los fotogramas clave del MP4 y corta en el
  último que cabe dentro del límite, así ningún trozo se pasa de la duración pedida.
- **Cortes exactos**: recodifica trozo a trozo para que duren justo lo pedido,
  con opción de bajar a 720p. Mucho más lento.

## Cómo sale el APK

El APK lo compila GitHub Actions. No hace falta Android Studio ni nada instalado.

1. Sube este repositorio a GitHub.
2. Pestaña **Actions** → *Construir APK* → **Run workflow** (o simplemente haz push a `main`).
3. Cuando termine, baja el artefacto **tijera-apk** y copia el `.apk` al móvil.
4. Al instalarlo Android pedirá permitir orígenes desconocidos. Es un APK de depuración,
   sin firmar para tienda.

## Estructura

    www/index.html          la app entera, un solo archivo
    www/ffmpeg/             ffmpeg.wasm (lo rellena scripts/vendor.mjs, no va en git)
    scripts/vendor.mjs      copia ffmpeg desde node_modules a www/ffmpeg
    capacitor.config.json   appId es.abelardogarcia.tijera
    assets/                 icono y pantalla de arranque
    .github/workflows/      compilación del APK

## En local (opcional)

    npm install
    npm run sync        # vendoriza ffmpeg y sincroniza el proyecto Android
    cd android && gradlew assembleDebug

`www/index.html` también funciona suelto en un navegador: si no encuentra
`www/ffmpeg/`, se baja ffmpeg del CDN.

## Firmar para distribuir

El workflow genera un APK de depuración. Para uno firmado, crea un keystore,
guárdalo como secreto del repositorio y cambia `assembleDebug` por `assembleRelease`
con la configuración de firma en `android/app/build.gradle`.
