import User from '../../models/user'; // Assurez-vous que le chemin est correct
import bcrypt from 'bcrypt'; // Assurez-vous que bcrypt est installé
import jwt from 'jsonwebtoken'; // Assurez-vous que jsonwebtoken est installé


export default async function handler(req, res) {
  const { method } = req;

  try {
    switch (method) {
      case 'POST':
        // Créer un nouvel utilisateur
        const { username, password } = req.body;

        // Vérifier si l'utilisateur existe
        const user = await User.getUserByUsername(username);
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé' });
        }



        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(401).json({ error: 'Mot de passe incorrect' });
        }

        

        delete user.password;
        const JWT_SECRET = Object.values(user).join('vyx67shh') ;
        
        const token = jwt.sign({ id: user.id, username: user.username, first_name: user.first_name, last_name: user.last_name, email: user.email, phone: user.phone  }, JWT_SECRET, { expiresIn: '1h' });


        res.status(200).json({ token });

        break;

      default:
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Méthode ${method} non autorisée`);
    }
  } catch (error) {
    console.error('Erreur lors de la gestion de la requête:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
}
