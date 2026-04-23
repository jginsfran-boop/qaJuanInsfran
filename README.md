# Reto Técnico QA Automation Engineer — Seek 🚀

**Candidato:** Juan Insfran
**Posición:** QA Automation Engineer

Este repositorio contiene la resolución del reto técnico de automatización Web E2E sobre la plataforma de Instagram, diseñado con un enfoque altamente escalable, resiliente y estructurado usando las mejores prácticas.

---

## Evidencias y Demostración (¡Empieza por aquí!)

Dado que los flujos automatizados de Instagram tienen fuertes protecciones anti-bot que dificultan su ejecución en pipelines de CI/CD genéricos sin proxys residenciales, he preparado evidencias concretas para facilitar la revisión técnica:

1. **[🔗 Ver Reporte Serenity BDD Interactivo](https://jginsfran-boop.github.io/qaJuanInsfran/)**
   * Haz clic para ver el reporte de *Living Documentation* generado por Serenity/JS. Encontrarás el detalle paso a paso de cada ejecución en Gherkin, junto con las capturas de pantalla de la UI de Instagram en cada interacción.
2. 🎥 **[Ver Video de Ejecución Local] (Enlace a YouTube/Loom pendiente)**
   * Demostración en video corriendo la suite completa con navegador visible.
3. 📦 **GitHub Release**
   * Puedes descargar el empaquetado exacto de los reportes en formato `.zip` desde la pestaña "Releases" de este repositorio.

---

## 🏗️ Arquitectura y Stack Tecnológico

He seleccionado cuidadosamente el stack para garantizar mantenibilidad a largo plazo y legibilidad funcional:

* **Framework Core:** `Serenity/JS` (v3.42)
* **Automatización Web:** `Playwright` (v1.49)
* **Motor BDD:** `Cucumber` (v11.0)
* **Lenguaje:** `TypeScript` (v5.5)

### ¿Por qué el Patrón Screenplay?
A diferencia de *Page Object Model (POM)* que tiende a crear clases gigantes ("God objects") difíciles de mantener, he implementado el **Patrón Screenplay** porque separa las responsabilidades según los principios SOLID:
* **Actores:** Juan y Ana (quienes interactúan con el sistema).
* **Abilities:** Poder navegar por la web (`BrowseTheWebWithPlaywright`).
* **Tasks:** Acciones de negocio de alto nivel (Ej: `PublicarImagen`, `IniciarSesion`).
* **Interactions:** Interacciones atómicas de bajo nivel (Ej: `Click`, `Enter`).
* **Questions:** Consultas sobre el estado del sistema (`EstadoMeGusta`).

---

## 🛡️ Estrategia Anti-Bot (Resiliencia)
Instagram es una aplicación agresiva contra la automatización. Para asegurar la estabilidad de estos 7 casos de prueba, implementé:
1. **Simulación de tipeo humano:** Delay dinámico (`delay: 80ms`) al ingresar texto para evadir detección heurística.
2. **Manejo de UI Dinámica:** Lógica con bloque `try/catch` para manejar los tests A/B de Instagram (por ejemplo, el botón "+" a veces abre un menú desplegable y a veces abre un modal directo).
3. **Selectores Robustos:** Uso de `PageElements.first()` y localizadores parciales (`button:has-text("Seleccionar")`) para evadir violaciones de modo estricto ("Strict mode violations") y soportar variantes idiomáticas (LatAm vs España).

---

## ⚙️ Configuración y Ejecución Local

Si deseas correr el proyecto en tu máquina local, sigue estos pasos:

### 1. Instalar dependencias
```bash
npm install
npx playwright install chromium
```

### 2. Configurar credenciales seguras
Por seguridad, el archivo de datos real está en el `.gitignore`.
```bash
# Copia la plantilla base
cp data/info.example.json data/info.json
```
Abre `data/info.json` y completa los campos `user_valid` con credenciales de prueba reales de Instagram.

### 3. Comandos de Ejecución

He configurado alias en el `package.json` para facilitar la ejecución. Tienes dos variantes para cada caso: ejecución silenciosa (Headless) y ejecución visible (Headed).

```bash
# Ejecutar TODO de forma transparente
npm test

# Ejecutar TODO viendo el navegador (Recomendado para revisión visual)
npm run test:headed

# Ejecutar casos de prueba individuales de forma VISIBLE:
npm run test:cp001:headed    # CP001 - Login exitoso
npm run test:cp002:headed    # CP002 - Login fallido
npm run test:cp003:headed    # CP003 - Dar Me Gusta
npm run test:cp004:headed    # CP004 - Comentar publicación
npm run test:cp005:headed    # CP005 - Publicar imagen
npm run test:cp006:headed    # CP006 - Eliminar publicación
npm run test:cp007:headed    # CP007 - Seguir sugerencias
```

### 4. Generar el Reporte HTML
Una vez que hayas ejecutado los tests, genera el reporte BDD con:
```bash
npm run report
```
El reporte interactivo estará disponible en `target/site/serenity/index.html`.

---
*Este proyecto fue diseñado como prueba de concepto (PoC) para fines técnicos y no para automatización abusiva de plataformas reales.*
