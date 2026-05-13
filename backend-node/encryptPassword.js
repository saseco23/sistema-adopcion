const { encrypt } = require('./helpers/handleBcrypt');

(async () => {
  const password = 'tu_password';  // La contraseña que deseas encriptar
  const hashedPassword = await encrypt(password);
  console.log('Contraseña encriptada:', hashedPassword);
})();
