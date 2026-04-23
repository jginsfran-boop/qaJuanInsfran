import { By, PageElement, PageElements } from '@serenity-js/web';

export const PaginaPerfil = {
  // Selector genérico: la foto de perfil en el sidebar tiene siempre alt="Foto del perfil de ..."
  // No depende del username → funciona con cualquier cuenta. Usamos PageElements.first()
  // para evitar la violación de modo estricto si hay múltiples fotos de perfil visibles en el feed.
  iconoPerfilSidebar: () =>
    PageElements.located(By.css('img[alt*="Foto del perfil"], img[alt*="Profile photo"]')).first()
      .describedAs('foto de perfil en el menú lateral'),

  // Primera publicación de la grilla. Cualquier enlace /p/ dentro del main.
  primeraPublicacion: () =>
    PageElements.located(By.css('main a[href*="/p/"]')).first()
      .describedAs('primera publicación en la grilla del perfil'),

  // Ícono "Más opciones" (...) en el modal de la publicación abierta
  botonMasOpciones: () =>
    PageElement.located(By.css('svg[aria-label="Más opciones"], svg[aria-label="More options"]'))
      .describedAs('botón Más opciones de la publicación'),

  // Opción Eliminar del menú contextual (texto en rojo en Instagram)
  botonEliminarDelMenu: () =>
    PageElement.located(By.xpath('//button[normalize-space(text())="Eliminar" or normalize-space(text())="Delete"]'))
      .describedAs('opción Eliminar del menú'),

  // Confirmación definitiva de eliminación en el diálogo de alerta
  botonConfirmarEliminacion: () =>
    PageElement.located(By.xpath('(//button[normalize-space(text())="Eliminar" or normalize-space(text())="Delete"])[last()]'))
      .describedAs('botón confirmar eliminación en el diálogo'),
};
