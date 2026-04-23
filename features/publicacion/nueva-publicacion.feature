Feature: Publicar imágenes en Instagram
  Como usuario autenticado de Instagram
  Quiero publicar una imagen con un pie de foto
  Para compartir contenido con mis seguidores

  @CP005 @publicar-imagen
  Scenario: CP005 - Publicar una imagen desde el equipo
    Given Juan está autenticado en Instagram
    When publica la imagen "data/test-image.png" con el caption "Automatización BDD con Serenity/JS + Playwright #QAEngineer"
    Then la imagen debería publicarse exitosamente
