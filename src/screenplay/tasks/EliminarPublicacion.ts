import { Task, Wait, Duration, Interaction } from '@serenity-js/core';
import { Click, isVisible } from '@serenity-js/web';
import { isPresent } from '@serenity-js/assertions';
import { PaginaPerfil } from '../../ui/PaginaPerfil';

export const EliminarPublicacion = {
  primeraDelPerfil: () =>
    Task.where(`#actor elimina la primera publicación del perfil`,
      // 1. Entrar al perfil (usamos isPresent por si Instagram lo oculta visualmente bajo otras capas)
      Wait.upTo(Duration.ofSeconds(15)).until(PaginaPerfil.iconoPerfilSidebar(), isPresent()),
      Click.on(PaginaPerfil.iconoPerfilSidebar()),
      
      // 2. Esperar y hacer click en la primera imagen
      Wait.upTo(Duration.ofSeconds(15)).until(PaginaPerfil.primeraPublicacion(), isVisible()),
      Click.on(PaginaPerfil.primeraPublicacion()),
      
      // 3. Esperar que cargue el modal de la publicación y hacer click en "Más opciones" (...)
      Wait.upTo(Duration.ofSeconds(10)).until(PaginaPerfil.botonMasOpciones(), isVisible()),
      Click.on(PaginaPerfil.botonMasOpciones()),
      
      // 4. Hacer click en Eliminar en el menú contextual
      Wait.upTo(Duration.ofSeconds(10)).until(PaginaPerfil.botonEliminarDelMenu(), isVisible()),
      Click.on(PaginaPerfil.botonEliminarDelMenu()),
      
      // 5. Confirmar eliminación en el diálogo
      Wait.upTo(Duration.ofSeconds(10)).until(PaginaPerfil.botonConfirmarEliminacion(), isVisible()),
      Click.on(PaginaPerfil.botonConfirmarEliminacion())
    )
};
