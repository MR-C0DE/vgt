const bcrypt = require('bcryptjs');

async function generateHash() {
  const password = 'admin123';
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  
  console.log('Mot de passe: admin123');
  console.log('Hash généré:', hash);
  console.log('\nCopiez ce hash dans vos requêtes SQL:');
  console.log(`'${hash}'`);
  
  // Générer les requêtes INSERT avec ce hash
  console.log('\n--- Requêtes INSERT ---');
  const users = [
    ['admin', 'Admin', 'Principal', 'admin@voiceofgodtabernacle.com', '+1 (613) 555-0101', 'admin'],
    ['pasteur.jean', 'Jean', 'Dupuy', 'jean.dupuy@voiceofgodtabernacle.com', '+1 (613) 555-0102', 'admin'],
    ['secretariat', 'Marie', 'Claire', 'secretariat@voiceofgodtabernacle.com', '+1 (613) 555-0103', 'editor'],
    ['andre.mulaja', 'Andre', 'Mulaja', 'andre.mulaja@voiceofgodtabernacle.com', '+1 (613) 555-0104', 'admin'],
    ['communication', 'Sophie', 'Martin', 'communication@voiceofgodtabernacle.com', '+1 (613) 555-0105', 'editor']
  ];
  
  users.forEach(user => {
    console.log(`INSERT INTO users (username, password, first_name, last_name, email, phone, role) VALUES ('${user[0]}', '${hash}', '${user[1]}', '${user[2]}', '${user[3]}', '${user[4]}', '${user[5]}');`);
  });
}

generateHash();