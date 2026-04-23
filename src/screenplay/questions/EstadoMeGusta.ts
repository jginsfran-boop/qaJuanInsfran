import { PaginaFeed } from '../../ui/PaginaFeed';

// Devuelve el PageElement que representa el estado "me gusta activo".
// Se usa con Ensure.that(EstadoMeGusta.boton(), isVisible()) en los steps.
export const EstadoMeGusta = {
  boton: () => PaginaFeed.botonYaNoMeGusta(),
};
