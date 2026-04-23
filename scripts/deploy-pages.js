/**
 * deploy-pages.js
 * Deploy manual del reporte Serenity a la rama gh-pages.
 * Usa git directamente desde rutas cortas (C:\sr, C:\ghd) para
 * evitar el límite de 260 caracteres de Windows.
 */
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const SOURCE_DIR  = path.join(process.cwd(), 'target', 'site', 'serenity');
const TEMP_REPORT = 'C:\\sr';   // copia del reporte (ruta corta)
const TEMP_GIT    = 'C:\\ghd';  // repo git temporal (ruta corta)

// Obtener la URL remota del repo
const REPO_URL = execSync('git remote get-url origin', { encoding: 'utf8' }).trim();

// ─── Helpers ────────────────────────────────────────────────────────────────
function run(cmd, cwd) {
  execSync(cmd, { cwd: cwd || TEMP_GIT, shell: 'cmd.exe', stdio: 'inherit' });
}

function tryRun(cmd, cwd) {
  try { run(cmd, cwd); } catch (_) {}
}

function cleanup() {
  tryRun(`rmdir /S /Q ${TEMP_REPORT}`, 'C:\\');
  tryRun(`rmdir /S /Q ${TEMP_GIT}`,    'C:\\');
}

// ─── Verificar reporte ───────────────────────────────────────────────────────
if (!fs.existsSync(path.join(SOURCE_DIR, 'index.html'))) {
  console.error('❌ No se encontró target/site/serenity/index.html');
  console.error('   Ejecuta primero: npm run report');
  process.exit(1);
}

// ─── Paso 1: Copiar reporte a ruta corta ────────────────────────────────────
console.log('\n📂 [1/4] Copiando reporte a C:\\sr ...');
tryRun(`rmdir /S /Q ${TEMP_REPORT}`, 'C:\\');
fs.mkdirSync(TEMP_REPORT, { recursive: true });

try {
  execSync(`robocopy "${SOURCE_DIR}" "${TEMP_REPORT}" /E /NP /NFL /NDL`, {
    shell: 'cmd.exe', stdio: 'inherit'
  });
} catch (e) {
  if (e.status >= 8) {
    console.error('❌ Error al copiar archivos:', e.status);
    process.exit(1);
  }
}
console.log('   ✅ Copiados correctamente.');

// ─── Paso 2: Clonar repo a ruta corta ───────────────────────────────────────
console.log('\n🔗 [2/4] Clonando repositorio en C:\\ghd ...');
tryRun(`rmdir /S /Q ${TEMP_GIT}`, 'C:\\');
run(`git clone ${REPO_URL} ${TEMP_GIT}`, 'C:\\');
console.log('   ✅ Clonado.');

// ─── Paso 3: Preparar rama gh-pages ─────────────────────────────────────────
console.log('\n🌿 [3/4] Preparando rama gh-pages ...');
try {
  // Si la rama ya existe en el remoto, la usamos
  run(`git checkout gh-pages`);
  // Borrar todos los archivos existentes para hacer un deploy limpio
  tryRun(`git rm -rf .`);
} catch (_) {
  // Si no existe, la creamos como rama huérfana (sin historial)
  run(`git checkout --orphan gh-pages`);
  tryRun(`git rm -rf .`);
}

// Copiar el reporte desde C:\sr al directorio del repo clonado
try {
  execSync(`robocopy "${TEMP_REPORT}" "${TEMP_GIT}" /E /NP /NFL /NDL`, {
    shell: 'cmd.exe', stdio: 'inherit'
  });
} catch (e) {
  if (e.status >= 8) {
    console.error('❌ Error copiando a gh-pages dir:', e.status);
    cleanup();
    process.exit(1);
  }
}

// .nojekyll evita que GitHub Pages procese los archivos con Jekyll
fs.writeFileSync(path.join(TEMP_GIT, '.nojekyll'), '');
// .gitignore vacío para no excluir ningún PNG ni JSON
fs.writeFileSync(path.join(TEMP_GIT, '.gitignore'), '');

// ─── Paso 4: Commit y push ───────────────────────────────────────────────────
console.log('\n🚀 [4/4] Publicando en GitHub Pages ...');
run(`git config user.email "deploy@gh-pages"`);
run(`git config user.name "Deploy Bot"`);
run(`git add -A`);
run(`git commit -m "docs: deploy reporte Serenity BDD con capturas de pantalla"`);
run(`git push origin gh-pages --force`);

// ─── Limpieza ────────────────────────────────────────────────────────────────
cleanup();

console.log('\n✅ ¡Reporte publicado exitosamente!');
console.log('🌐 URL: https://jginsfran-boop.github.io/qaJuanInsfran/');
console.log('⏳ Puede tardar 1-2 minutos en verse reflejado.\n');
