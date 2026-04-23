// serenity.config.js
// Configuración sincrónica con instancias explícitas de clase.
// APIs verificadas en el código fuente de @serenity-js 3.42.x:
//   ArtifactArchiver.storingArtifactsAt(...segments)   → static factory
//   Photographer.whoWill(StrategyClass)                → static factory, recibe la CLASE
//   ConsoleReporter.fromJSON(config)                   → static factory
//   SerenityBDDReporter.fromJSON(config)               → static factory (retorna builder)
//
// IMPORTANTE — cucumber.js v11 solo instancia un formatter por contexto (stdout o file).
// @serenity-js/cucumber debe ir con destino de archivo:
//   '@serenity-js/cucumber:reports/serenity-events.log'
// así entra en formats.files y ES instanciado con eventBroadcaster.
const path = require('path');
const fs = require('fs');
const { configure, ArtifactArchiver } = require('@serenity-js/core');
const { ConsoleReporter } = require('@serenity-js/console-reporter');
const { SerenityBDDReporter } = require('@serenity-js/serenity-bdd');
const { Photographer, TakePhotosOfFailures } = require('@serenity-js/web');

const outputDir = path.join(process.cwd(), 'target', 'site', 'serenity');
fs.mkdirSync(outputDir, { recursive: true });

try {
  configure({
    crew: [
      ConsoleReporter.fromJSON({ theme: 'auto' }),
      SerenityBDDReporter.fromJSON({ specDirectory: './features' }),
      ArtifactArchiver.storingArtifactsAt(process.cwd(), 'target', 'site', 'serenity'),
      Photographer.whoWill(TakePhotosOfFailures),
    ],
  });
  console.log('[serenity.config.js] Crew configurado OK →', outputDir);
} catch (error) {
  console.error('[serenity.config.js] ERROR al configurar crew:', error.message);
}
