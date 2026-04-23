import { Task, Interaction, Wait, Duration } from '@serenity-js/core';
import { TakeScreenshot } from '@serenity-js/web';
import { BrowseTheWebWithPlaywright, PlaywrightPage } from '@serenity-js/playwright';

// Usa la API nativa de Playwright para encontrar y clickear el SVG de Me gusta
const ClickearMeGusta = Interaction.where(
  '#actor da me gusta a la primera publicación visible',
  async actor => {
    const page = await BrowseTheWebWithPlaywright.as(actor).currentPage();
    const nativePage = await (page as unknown as PlaywrightPage).nativePage();

    const likeBtn = nativePage.locator('svg[aria-label="Me gusta"]').first();
    await likeBtn.waitFor({ state: 'visible', timeout: 10_000 });
    await likeBtn.click();
  },
);

export const DarMeGusta = {
  alaUltimPublicacion: () =>
    Task.where('#actor da me gusta a la primera publicación del feed',
      TakeScreenshot.of('feed antes del me gusta'),
      ClickearMeGusta,
      Wait.for(Duration.ofSeconds(1)),
      TakeScreenshot.of('me gusta dado'),
    ),
};
