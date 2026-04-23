module.exports = {
  default: {
    format: [
      'progress',
      'html:reports/cucumber-report.html',
      '@serenity-js/cucumber:reports/serenity-events.log',
    ],
    paths: [
      'features/autenticacion/login.feature',
      'features/interacciones/me-gusta.feature',
      'features/interacciones/comentar.feature',
      'features/publicacion/nueva-publicacion.feature',
      'features/publicacion/eliminar-publicacion.feature',
      'features/feed/seguir-sugerencias.feature'
    ],
    require: [
      'src/support/serenity.config.js', // cargado primero como JS puro (mismo módulo que el formatter)
      'src/support/**/*.ts',            // luego el resto como TypeScript
    ],
    requireModule: ['ts-node/register'],
    // 60s por step — suficiente para navegación + interacciones de Instagram
    timeout: 60_000,
  },
};
