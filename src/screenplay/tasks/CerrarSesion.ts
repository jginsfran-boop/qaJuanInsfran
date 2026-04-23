import { Task, Wait, Duration } from '@serenity-js/core';
import { Click, isVisible } from '@serenity-js/web';
import { isPresent } from '@serenity-js/assertions';
import { PaginaDeLogin } from '../../ui/PaginaDeLogin';
import { PaginaPerfil } from '../../ui/PaginaPerfil';

export const CerrarSesion = {
  delSistema: () =>
    Task.where(`#actor cierra sesión en Instagram`,
      // Primero vamos al perfil, ya que ahí sabemos que el ícono de Configuración (ruedita) siempre existe
      Wait.upTo(Duration.ofSeconds(15)).until(PaginaPerfil.iconoPerfilSidebar(), isPresent()),
      Click.on(PaginaPerfil.iconoPerfilSidebar()),
      
      // Hacemos click en el menú de Configuración
      Wait.upTo(Duration.ofSeconds(10)).until(PaginaDeLogin.iconoConfiguracion(), isVisible()),
      Click.on(PaginaDeLogin.iconoConfiguracion()),
      
      // Esperamos el botón Salir del menú desplegado y le damos click
      Wait.upTo(Duration.ofSeconds(10)).until(PaginaDeLogin.botonSalir(), isVisible()),
      Click.on(PaginaDeLogin.botonSalir())
    )
};
