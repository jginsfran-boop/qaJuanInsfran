import { By, PageElement } from '@serenity-js/web';

export const PaginaFeed = {
  // ─── Navegación ──────────────────────────────────────────────────────────────
  botonNuevaPublicacion: () =>
    PageElement.located(By.css('svg[aria-label="Nueva publicación"]'))
      .describedAs('botón Nueva publicación (+)'),

  // ─── Selectores del feed usando aria-label (confirmados en DOM real) ─────────
  botonMeGusta: () =>
    PageElement.located(By.css('svg[aria-label="Me gusta"]'))
      .describedAs('ícono Me gusta de la primera publicación'),

  botonYaNoMeGusta: () =>
    PageElement.located(By.css('svg[aria-label="Ya no me gusta"]'))
      .describedAs('ícono Ya no me gusta (me gusta activo)'),

  iconoComentario: () =>
    PageElement.located(By.css('[role="button"]:has(svg[aria-label="Comentar"]), [role="link"]:has(svg[aria-label="Comentar"]), [role="button"]:has(svg[aria-label="Comment"]), [role="link"]:has(svg[aria-label="Comment"])'))
      .describedAs('botón Comentar de la primera publicación (contenedor interactivo)'),

  campoComentario: () =>
    PageElement.located(By.css('textarea[aria-label="Añade un comentario..."]:visible, textarea[aria-label="Add a comment..."]:visible'))
      .describedAs('campo de texto del comentario'),

  botonPublicarComentario: () =>
    PageElement.located(By.css('div[role="button"]:has-text("Publicar"):visible, div[role="button"]:has-text("Post"):visible'))
      .describedAs('botón Publicar comentario'),

  comentarioConTexto: (texto: string) =>
    PageElement.located(By.css(`span:has-text("${texto}"):visible, div:has-text("${texto}"):visible`))
      .describedAs(`comentario con texto "${texto}"`),

  usuarioEnComentario: (username: string) =>
    PageElement.located(By.css(`a[href*="/${username}"], a:has-text("${username}"), span:has-text("${username}")`))
      .describedAs(`usuario ${username} en la página`),
};
