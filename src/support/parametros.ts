import { defineParameterType } from '@cucumber/cucumber';
import { actorCalled } from '@serenity-js/core';
import type { Actor } from '@serenity-js/core';

defineParameterType({
  name: 'actor',
  regexp: /[A-Z][a-záéíóúñü]+/,
  transformer(nombre: string): Actor {
    return actorCalled(nombre);
  },
});
