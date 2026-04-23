import { Given, When, Then } from '@cucumber/cucumber';
import { actorInTheSpotlight, Wait, Duration } from '@serenity-js/core';
import type { Actor } from '@serenity-js/core';
import { Ensure, isPresent } from '@serenity-js/assertions';
import { isVisible } from '@serenity-js/web';
import { Autenticarse } from '../../screenplay/tasks/Autenticarse';
import { DarMeGusta } from '../../screenplay/tasks/DarMeGusta';
import { Comentar } from '../../screenplay/tasks/Comentar';
import { EstadoMeGusta } from '../../screenplay/questions/EstadoMeGusta';
import { PaginaFeed } from '../../ui/PaginaFeed';
import { cargarDatos } from '../datos';

// ─── Given ────────────────────────────────────────────────────────────────────

Given('{actor} está autenticado en Instagram', async function (actor: Actor) {
  const { user_valid } = cargarDatos();
  await actor.attemptsTo(
    Autenticarse.enInstagram(user_valid.username, user_valid.password),
  );
});

// ─── When ─────────────────────────────────────────────────────────────────────

When('da me gusta a la primera publicación del feed', async function () {
  await actorInTheSpotlight().attemptsTo(
    DarMeGusta.alaUltimPublicacion(),
  );
});

When('comenta {string} en la primera publicación del feed', async function (comentario: string) {
  await actorInTheSpotlight().attemptsTo(
    Comentar.enLaPrimeraPublicacion(comentario),
  );
});

// ─── Then ─────────────────────────────────────────────────────────────────────

Then('la publicación debería mostrar el estado de me gusta activo', async function () {
  await actorInTheSpotlight().attemptsTo(
    Wait.upTo(Duration.ofSeconds(5)).until(EstadoMeGusta.boton(), isVisible()),
    Ensure.that(EstadoMeGusta.boton(), isVisible()),
  );
});

Then('el comentario {string} debería verse publicado correctamente', async function (comentario: string) {
  const { user_valid } = cargarDatos();
  await actorInTheSpotlight().attemptsTo(
    Wait.upTo(Duration.ofSeconds(10)).until(PaginaFeed.usuarioEnComentario(user_valid.username), isPresent()),
    Ensure.that(PaginaFeed.usuarioEnComentario(user_valid.username), isPresent()),
    Ensure.that(PaginaFeed.comentarioConTexto(comentario), isPresent()),
  );
});
