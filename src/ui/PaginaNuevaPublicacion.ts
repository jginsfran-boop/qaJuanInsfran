import { By, PageElement } from '@serenity-js/web';

export const PaginaNuevaPublicacion = {
  // ─── Paso 1a: Click en el ícono "+" de nueva publicación ─────────────────────
  iconoNuevaPublicacion: () =>
    PageElement.located(By.css('svg[aria-label="Nueva publicación"]'))
      .describedAs('ícono Nueva publicación (+)'),

  // ─── Paso 1b: Opción "Publicación" del menú desplegable ──────────────────────
  opcionPublicacion: () =>
    PageElement.located(By.xpath('//span[normalize-space(text())="Publicación"]'))
      .describedAs('opción Publicación del menú'),

  // ─── Paso 1c: Botón para abrir file chooser del sistema ──────────────────────
  botonSeleccionarDeComputadora: () =>
    PageElement.located(By.xpath('//button[contains(normalize-space(.), "Seleccionar de la computadora") or contains(normalize-space(.), "Select from computer")]'))
      .describedAs('botón Seleccionar de la computadora'),

  // ─── Paso 2 y 3: Ajustes y filtros ──────────────────────────────────────────
  // Instagram usa div[role="button"] (no <button>) con texto "Siguiente"
  botonSiguiente: () =>
    PageElement.located(By.xpath('//div[@role="button" and (normalize-space(text())="Siguiente" or normalize-space(text())="Next")]'))
      .describedAs('botón Siguiente (div role=button)'),

  // ─── Paso 4: Pie de foto ─────────────────────────────────────────────────────
  campoPieDeImagen: () =>
    PageElement.located(By.css('div[aria-label="Escribe un pie de foto..."], div[contenteditable="true"]'))
      .describedAs('campo de pie de foto (caption)'),

  // ─── Paso final: Compartir ───────────────────────────────────────────────────
  // Mismo patrón div[role="button"] con texto "Compartir"
  botonCompartir: () =>
    PageElement.located(By.xpath('//div[@role="button" and (normalize-space(text())="Compartir" or normalize-space(text())="Share")]'))
      .describedAs('botón Compartir (div role=button)'),

  // ─── Confirmación ─────────────────────────────────────────────────────────────
  // DOM real: Puede ser h3, span o div dependiendo de la versión
  mensajePublicacionExitosa: () =>
    PageElement.located(By.css('text="Se compartió tu publicación", text="Your post has been shared", text="Tu publicación está compartida", text="Tu publicación se compartió", text="Post shared"'))
      .describedAs('mensaje de confirmación de publicación'),
};
