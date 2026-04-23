import { Interaction } from '@serenity-js/core';
import { BrowseTheWebWithPlaywright, PlaywrightPage } from '@serenity-js/playwright';

export const SeguirUsuarios = {
  unUsuarioSugerido: () => Interaction.where(`#actor sigue a 1 usuario sugerido`, async actor => {
    const page = await BrowseTheWebWithPlaywright.as(actor).currentPage();
    const nativePage = await (page as unknown as PlaywrightPage).nativePage();

    // Localizador que busque exactamente la palabra "Seguir" (para evitar que atrape "Siguiendo")
    // Usamos xpath o text estricto para ser exactos.
    const botonesSeguir = nativePage.locator('text="Seguir"');
    
    // Esperamos que haya al menos 1 visible antes de empezar
    await botonesSeguir.first().waitFor({ state: 'visible', timeout: 15000 });

    let seguidos = 0;
    // Solo seguimos a 1 usuario
    for (let i = 0; i < 1; i++) {
      const btn = botonesSeguir.first();
      // Verificamos si realmente existe y está visible
      if (await btn.isVisible({ timeout: 5000 })) {
        // Extraemos el nombre de usuario buscando el tag <a> más cercano en la jerarquía
        const username = await btn.evaluate((node: any) => {
          let parent = node.parentElement;
          for (let j = 0; j < 6; j++) {
            if (!parent) break;
            const link = parent.querySelector('a');
            if (link && link.innerText && link.innerText.trim() !== '') {
              return link.innerText.trim();
            }
            parent = parent.parentElement;
          }
          return "Usuario desconocido";
        });
        
        console.log(`\n✅ CP007 - Se comenzó a seguir al usuario: ${username}\n`);
        
        await btn.click({ force: true });
        seguidos++;
        // Pausa breve para dejar que Instagram procese la acción y cambie el botón a "Siguiendo"
        await nativePage.waitForTimeout(1500);
      }
    }

    if (seguidos < 1) {
      throw new Error(`No se pudo seguir al usuario.`);
    }
  })
};
