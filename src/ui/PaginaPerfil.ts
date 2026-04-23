import { By, PageElement, PageElements } from '@serenity-js/web';

export const PaginaPerfil = {
  // Encontramos múltiples enlaces al perfil (feed, sugerencias, menú), así que elegimos el primero
  iconoPerfilSidebar: () =>
    PageElements.located(By.css('a[href="/eldenringpy/"], img[alt="Foto del perfil de eldenringpy"]')).first()
      .describedAs('ícono del perfil en el menú'),

  // La primera publicación de la grilla. Usamos el href exacto que empieza por el usuario y /p/
  // Usamos PageElements.first() porque habrá múltiples fotos en la grilla (evita strict mode violation).
  primeraPublicacion: () =>
    PageElements.located(By.css('a[href^="/eldenringpy/p/"]')).first()
      .describedAs('primera publicación en la grilla del perfil'),

  // Icono de "Más opciones" (...) en el modal de la publicación abierta
  botonMasOpciones: () =>
    PageElement.located(By.css('svg[aria-label="Más opciones"], svg[aria-label="More options"]'))
      .describedAs('botón Más opciones de la publicación'),

  // Botón rojo de Eliminar en el menú emergente
  botonEliminarDelMenu: () =>
    PageElement.located(By.css('button:has-text("Eliminar"), button:has-text("Delete")'))
      .describedAs('opción Eliminar del menú'),

  // Botón de confirmación definitiva de eliminar en el diálogo modal
  botonConfirmarEliminacion: () =>
    PageElement.located(By.css('button:has-text("Eliminar"), button:has-text("Delete")'))
      .describedAs('botón para confirmar eliminación'),
};
