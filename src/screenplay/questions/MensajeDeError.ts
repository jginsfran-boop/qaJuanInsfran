import { Text } from '@serenity-js/web';
import { PaginaDeLogin } from '../../ui/PaginaDeLogin';

export const MensajeDeError = {
  texto: () =>
    Text.of(PaginaDeLogin.mensajeDeError())
      .describedAs('texto del mensaje de error'),
};
