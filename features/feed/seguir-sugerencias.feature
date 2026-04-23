Feature: Seguir usuarios sugeridos en el feed

  @CP007
  Scenario: CP007 - Seguir a 1 usuario desde la sección "Sugerencias para ti"
    Given Juan está autenticado en Instagram
    When visualiza la sección de "Sugerencias para ti"
    And comienza a seguir a 1 usuario sugerido
    Then debería ver que el estado cambia a "Siguiendo" para esos usuarios
    And puede cerrar sesión correctamente
