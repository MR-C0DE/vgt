import User from '../../models/user'; // Assurez-vous que le chemin est correct
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET':
        // Récupérer tous les utilisateurs ou rechercher par mot-clé
        const { keyword } = req.query;
        if (keyword) {
          const users = await User.searchUsersByKeyword(keyword);
          res.status(200).json(users);
        } else {
          res.status(400).json({ message: 'Keyword is required' });
        }
        break;

      case 'POST':
        // Créer un nouvel utilisateur
        const { username, password, firstName, lastName, email, phone } = req.body;
        const saltRounds = 10; // Nombre de tours de salage
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = await User.createUser(username, hashedPassword, firstName, lastName, email, phone);
        res.status(201).json(newUser);
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
