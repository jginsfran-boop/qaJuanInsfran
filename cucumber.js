module.exports = {
  default: {
    format: [
      'progress',
      'html:reports/cucumber-report.html',
      '@serenity-js/cucumber:reports/serenity-events.log',
    ],
    paths: ['features/**/*.feature'],
    require: [
      'src/support/serenity.config.js', // cargado primero como JS puro (mismo módulo que el formatter)
      'src/support/**/*.ts',            // luego el resto como TypeScript
    ],
    requireModule: ['ts-node/register'],
    // 60s por step — suficiente para navegación + interacciones de Instagram
    timeout: 60_000,
  },
};
