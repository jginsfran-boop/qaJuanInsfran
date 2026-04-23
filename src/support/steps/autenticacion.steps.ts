import { Given, When, Then } from '@cucumber/cucumber';
import { actorInTheSpotlight, Wait, Duration } from '@serenity-js/core';
import type { Actor } from '@serenity-js/core';
import { Ensure, includes, not } from '@serenity-js/assertions';
import { Navigate, isVisible, Page } from '@serenity-js/web';
import { IniciarSesion } from '../../screenplay/tasks/IniciarSesion';
import { CerrarSesion } from '../../screenplay/tasks/CerrarSesion';
import { PaginaDeLogin } from '../../ui/PaginaDeLogin';
import { cargarDatos } from '../datos';

// ─── Given ────────────────────────────────────────────────────────────────────

Given('{actor} está en la página de inicio de sesión de Instagram', async function (actor: Actor) {
  await actor.attemptsTo(
    Navigate.to('https://www.instagram.com'),
    Wait.until(PaginaDeLogin.campoUsuario(), isVisible()),
    // Pausa extra: Instagram necesita tiempo para inicializar sus event listeners JS
    Wait.for(Duration.ofSeconds(2)),
  );
});

// ─── When ─────────────────────────────────────────────────────────────────────

When('ingresa sus credenciales válidas', async function () {
  const { user_valid } = cargarDatos();
  await actorInTheSpotlight().attemptsTo(
    IniciarSesion.conCredenciales(user_valid.username, user_valid.password),
  );
});

When('ingresa el usuario {string} y la contraseña {string}', async function (usuario: string, contrasena: string) {
  await actorInTheSpotlight().attemptsTo(
    IniciarSesion.conCredenciales(usuario, contrasena),
  );
});

// ─── Then ─────────────────────────────────────────────────────────────────────

Then('debería ver su perfil de Instagram', async function () {
  // Espera el ícono de navegación — confirma feed real cargado (más robusto que URL check)
  await actorInTheSpotlight().attemptsTo(
    Wait.upTo(Duration.ofSeconds(20)).until(PaginaDeLogin.iconoConfiguracion(), isVisible()),
    Ensure.that(
      Page.current().url().as(url => url.href),
      not(includes('/accounts/login')),
    ),
  );
});

Then('puede cerrar sesión correctamente', async function () {
  await actorInTheSpotlight().attemptsTo(
    CerrarSesion.delSistema(),
  );
});

Then('debería ver un mensaje de error de autenticación', async function () {
  // Wait.upTo establece timeout explícito de Serenity/JS (distinto al timeout de Cucumber)
  await actorInTheSpotlight().attemptsTo(
    Wait.upTo(Duration.ofSeconds(15)).until(PaginaDeLogin.mensajeDeError(), isVisible()),
    Ensure.that(PaginaDeLogin.mensajeDeError(), isVisible()),
  );
});
