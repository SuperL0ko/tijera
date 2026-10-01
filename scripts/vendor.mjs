// Copia ffmpeg.wasm desde node_modules a www/ffmpeg/ para empaquetarlo en el APK.
// Así la app no descarga 32 MB del CDN en cada arranque.
import { mkdirSync, copyFileSync, readdirSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const OUT = 'www/ffmpeg';
mkdirSync(OUT, { recursive: true });

const coreDir = 'node_modules/@ffmpeg/core/dist/umd';
const libDir  = 'node_modules/@ffmpeg/ffmpeg/dist/umd';

const files = ['ffmpeg-core.js', 'ffmpeg-core.wasm'].map(f => [join(coreDir, f), f]);
files.push([join(libDir, 'ffmpeg.js'), 'ffmpeg.js']);

// el worker viene en un chunk con nombre numérico que cambia entre versiones
const worker = readdirSync(libDir).find(f => /^\d+\.ffmpeg\.js$/.test(f));
if (!worker) throw new Error('no se encontró el chunk del worker en ' + libDir);
files.push([join(libDir, worker), worker]);

let total = 0;
for (const [src, name] of files) {
  copyFileSync(src, join(OUT, name));
  const kb = statSync(src).size / 1024;
  total += kb;
  console.log('  ' + name.padEnd(22) + kb.toFixed(0) + ' KB');
}
writeFileSync(join(OUT, 'ok.txt'), 'ok');
console.log('ffmpeg empaquetado: ' + (total / 1024).toFixed(1) + ' MB');
