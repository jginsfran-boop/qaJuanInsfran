import { Page } from '@serenity-js/web';

export const UrlActual = () =>
  Page.current().url().describedAs('URL de la página actual');
