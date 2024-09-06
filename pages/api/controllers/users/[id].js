import User from '../../../models/user'; // Assurez-vous que le chemin est correct

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  try {
    switch (method) {
      case 'GET':
        if (id) {
          // Récupérer un utilisateur par ID
          const user = await User.getUserById(parseInt(id));
          if (user) {
            res.status(200).json(user);
          } else {
            res.status(404).json({ message: 'User not found' });
          }
        } else {
          // Récupérer tous les utilisateurs
          res.status(400).json({ message: 'ID is required' });
        }
        break;

      case 'PUT':
        // Mettre à jour un utilisateur
        const { username, password, firstName, lastName, email, phone } = req.body;
        const updateResult = await User.updateUser(parseInt(id), username, password, firstName, lastName, email, phone);
        res.status(200).json(updateResult);
        break;

      case 'DELETE':
        // Supprimer un utilisateur
        await User.deleteUser(parseInt(id));
        res.status(204).end();
        break;

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
