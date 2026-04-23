import { By, PageElements } from '@serenity-js/web';

export const PaginaSugerencias = {
  tituloSugerencias: () =>
    PageElements.located(By.css('span:has-text("Sugerencias para ti"), div:has-text("Sugerencias para ti")')).first()
      .describedAs('título "Sugerencias para ti"'),

  // Buscamos los botones que tengan el texto exacto "Seguir" (Follow). 
  // En Instagram pueden ser botones o divs con role="button".
  botonesSeguir: () =>
    PageElements.located(By.css('button:has-text("Seguir"), div[role="button"]:text-is("Seguir"), div[role="button"]:has-text("Seguir")'))
      .describedAs('botones "Seguir" de sugerencias'),
};
