import mysql from 'mysql2/promise'; // Assurez-vous d'importer mysql2 avec promesse

// Créez le pool de connexions
const pool = mysql.createPool({
  host: 'vgt.cf0wq2me40rb.ca-central-1.rds.amazonaws.com',
  user: 'admin',
  password: 'voiceofgod',
  database: 'vgt',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export const db = pool;
