Feature: Eliminar publicación en Instagram

  @CP006
  Scenario: CP006 - Eliminar la primera publicación del perfil
    Given Juan está autenticado en Instagram
    When Juan se dirige a su perfil
    And elimina la primera publicación
    Then debería ver el mensaje de confirmación "Publicación eliminada."
    And puede cerrar sesión correctamente
