const { encrypt } = require('./helpers/handleBcrypt');

(async () => {
  const password = 'password';
  const hashedPassword = await encrypt(password);
  console.log('Contraseña encriptada:', hashedPassword);
})();
