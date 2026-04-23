Feature: Autenticación en Instagram
  Como usuario registrado de Instagram
  Quiero iniciar sesión con mis credenciales
  Para poder acceder a mi cuenta y su contenido

  @CP001 @login-exitoso
  Scenario: CP001 - Inicio de sesión exitoso con credenciales válidas
    Given Juan está en la página de inicio de sesión de Instagram
    When ingresa sus credenciales válidas
    Then debería ver su perfil de Instagram
    And puede cerrar sesión correctamente

  @CP002 @login-fallido
  Scenario Outline: CP002 - Inicio de sesión fallido con credenciales inválidas
    Given Ana está en la página de inicio de sesión de Instagram
    When ingresa el usuario "<usuario>" y la contraseña "<contrasena>"
    Then debería ver un mensaje de error de autenticación

    Examples:
      | usuario           | contrasena          |
      | usuario_falso_123 | password_incorrecta |
      | otro_usuario      | otra_pass_mal       |
