const bcrypt = require('bcryptjs');

async function generateHashes() {
  const password = 'admin123';
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  
  console.log('Mot de passe: admin123');
  console.log('Hash généré:', hash);
  console.log('\nCopiez ce hash dans votre base de données:');
  console.log(`UPDATE users SET password = '${hash}' WHERE username IN ('admin', 'pasteur.jean', 'secretariat', 'andre.mulaja', 'communication');`);
}

generateHashes();