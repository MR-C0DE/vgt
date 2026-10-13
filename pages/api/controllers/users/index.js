import { connectToDatabase } from '@/lib/mongodb';
import User from '@/lib/models/UserModel';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';
import { authenticateRequest } from '@/utils/authMiddleware';

export default async function handler(req, res) {
  await connectToDatabase();

  const decoded = authenticateRequest(req, res, ['admin']);
  if (!decoded) return;

  switch (req.method) {
    case 'GET': {
      const { id } = req.query;
      if (id) {
        if (!ObjectId.isValid(id)) return res.status(400).json({ error: "ID invalide" });
        const user = await User.findById(id).select('-password');
        if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });
        return res.status(200).json(user);
      } else {
        const users = await User.find().select('-password').sort({ created_at: -1 });
        return res.status(200).json(users);
      }
    }

    case 'POST': {
      const {
        username,
        password,
        email,
        phone,
        role,
        first_name = req.body.firstName,
        last_name = req.body.lastName,
      } = req.body;

      if (!username || !password || !first_name || !last_name || !email) {
        return res.status(400).json({ error: "Tous les champs requis ne sont pas remplis" });
      }

      const existing = await User.findOne({ $or: [{ username }, { email }] });
      if (existing) {
        return res.status(400).json({ error: "Nom d'utilisateur ou email déjà utilisé" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        username, password: hashedPassword, first_name, last_name, email, phone, role
      });

      const { password: _, ...userWithoutPassword } = user.toObject();
      return res.status(201).json(userWithoutPassword);
    }

    case 'PUT': {
      const { id } = req.query;
      const {
        username,
        email,
        phone,
        role,
        password,
        first_name = req.body.firstName,
        last_name = req.body.lastName,
      } = req.body;

      if (!id) return res.status(400).json({ error: "ID requis" });
      if (!ObjectId.isValid(id)) return res.status(400).json({ error: "ID invalide" });

      if (!username || !first_name || !last_name || !email) {
        return res.status(400).json({ error: "Tous les champs requis ne sont pas remplis" });
      }

      const duplicate = await User.findOne({
        _id: { $ne: id },
        $or: [{ username }, { email }],
      });
      if (duplicate) {
        return res.status(400).json({ error: "Nom d'utilisateur ou email déjà utilisé" });
      }

      const updateData = { username, first_name, last_name, email, phone, role, updated_at: new Date() };
      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }

      const user = await User.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
      if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });
      return res.status(200).json(user);
    }

    case 'DELETE': {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: "ID requis" });
      if (!ObjectId.isValid(id)) return res.status(400).json({ error: "ID invalide" });
      if (decoded.id === id) {
        return res.status(400).json({ error: "Vous ne pouvez pas supprimer votre propre compte" });
      }
      const user = await User.findByIdAndDelete(id);
      if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });
      return res.status(200).json({ success: true });
    }

    default:
      return res.status(405).json({ error: "Méthode non autorisée" });
  }
}
