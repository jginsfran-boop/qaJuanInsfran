Feature: Comentar en publicaciones de Instagram
  Como usuario autenticado de Instagram
  Quiero comentar en publicaciones del feed
  Para interactuar y dar retroalimentación al contenido

  @CP004 @comentar
  Scenario Outline: CP004 - Comentar en la primera publicación del feed
    Given Juan está autenticado en Instagram
    When comenta "<comentario>" en la primera publicación del feed
    Then el comentario "<comentario>" debería verse publicado correctamente

    Examples:
      | comentario                                           |
      | Esto es comentario es el texto que queremos comentar |
