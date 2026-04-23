Feature: Me Gusta en publicaciones de Instagram
  Como usuario autenticado de Instagram
  Quiero dar me gusta a publicaciones del feed
  Para interactuar con el contenido de otros usuarios

  @CP003 @me-gusta
  Scenario: CP003 - Dar me gusta a la primera publicación del feed
    Given Juan está autenticado en Instagram
    When da me gusta a la primera publicación del feed
    Then la publicación debería mostrar el estado de me gusta activo
