const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 100 });
  const context = await browser.newContext({
    locale: 'es-ES',
    extraHTTPHeaders: { 'Accept-Language': 'es-ES,es;q=0.9' },
  });
  const page = await context.newPage();

  console.log('Navegando a Instagram...');
  await page.goto('https://www.instagram.com/');

  console.log('Esperando login...');
  try {
      await page.waitForSelector('input[name="username"]', { timeout: 15000 });
      await page.fill('input[name="username"]', 'automaterortega');
      await page.fill('input[name="password"]', 'Ortega123*');
      await page.click('button[type="submit"]');
  } catch(e) {
      console.log('Login timeout, taking screenshot...');
      await page.screenshot({ path: 'debug-login.png' });
      throw e;
  }

  console.log('Esperando feed...');
  // Esperar a que desaparezca el form o aparezca el nav
  try {
      await page.waitForSelector('svg[aria-label="Inicio"], svg[aria-label="Home"], svg[aria-label="Nueva publicación"], span:has-text("Crear")', { timeout: 15000 });
  } catch(e) {
      console.log('Feed timeout, taking screenshot...');
      await page.screenshot({ path: 'debug-feed.png' });
      throw e;
  }

  // Cerrar popups si aparecen
  try {
    const btnAhoraNo = page.locator('button:has-text("Ahora no"), button:has-text("Not Now")').first();
    if (await btnAhoraNo.isVisible({ timeout: 5000 })) {
      await btnAhoraNo.click();
      console.log('Cerrado popup "Ahora no" (Not Now)');
    }
  } catch (e) {}

  try {
    const btnAhoraNo2 = page.locator('button:has-text("Ahora no"), button:has-text("Not Now")').first();
    if (await btnAhoraNo2.isVisible({ timeout: 5000 })) {
      await btnAhoraNo2.click();
      console.log('Cerrado popup 2 "Ahora no" (Not Now)');
    }
  } catch (e) {}

  // Buscar botón crear
  console.log('Buscando botón crear...');
  const btnCrear = page.locator('svg[aria-label="Nueva publicación"], svg[aria-label="New post"]').first();
  console.log('Encontrado btnCrear:', await btnCrear.count());
  
  // Imprimir HTML del padre del btnCrear para ver qué es
  if (await btnCrear.count() > 0) {
      const parentHTML = await btnCrear.evaluate(node => node.closest('a') ? node.closest('a').outerHTML : (node.closest('div[role="button"]') ? node.closest('div[role="button"]').outerHTML : node.outerHTML));
      console.log('HTML del botón crear (padre):', parentHTML.substring(0, 300) + '...');
      
      // Click
      console.log('Haciendo click en btnCrear...');
      await btnCrear.click({ force: true });
      await page.waitForTimeout(3000); // Esperar animación
      
      console.log('Buscando botones resultantes...');
      const btnPublicacion = page.locator('span:has-text("Publicación"), span:has-text("Post")').first();
      console.log('¿Apareció el menú "Publicación"?', await btnPublicacion.count() > 0 ? 'Sí' : 'No');
      
      const btnSeleccionar = page.locator('button:has-text("Seleccionar de la computadora"), button:has-text("Select from computer")').first();
      console.log('¿Apareció "Seleccionar de la computadora"?', await btnSeleccionar.count() > 0 ? 'Sí' : 'No');

      if (await btnPublicacion.count() > 0 && await btnPublicacion.isVisible()) {
          console.log('Click en Publicación...');
          await btnPublicacion.click({ force: true });
          await page.waitForTimeout(3000);
          const btnSel2 = page.locator('button:has-text("Seleccionar de la computadora"), button:has-text("Select from computer")').first();
          console.log('¿Apareció "Seleccionar de la computadora" luego de Publicación?', await btnSel2.count() > 0 ? 'Sí' : 'No');
          if (await btnSel2.count() > 0) {
              const html = await btnSel2.evaluate(n => n.outerHTML);
              console.log('HTML del botón Seleccionar:', html);
          }
      } else if (await btnSeleccionar.count() > 0) {
          const html = await btnSeleccionar.evaluate(n => n.outerHTML);
          console.log('HTML del botón Seleccionar:', html);
      } else {
          console.log('DOM dump de los modales/diálogos abiertos:');
          const dialogs = await page.$$eval('[role="dialog"], [role="menu"]', nodes => nodes.map(n => n.innerHTML.substring(0, 500)));
          console.log(dialogs);
      }
  }

  await browser.close();
})();
