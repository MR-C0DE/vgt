import { connectToDatabase } from '@/lib/mongodb';
import User from '@/lib/models/UserModel';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { enforceRateLimit } from '@/utils/rateLimit';

const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req, res) {
  if (!enforceRateLimit(req, res, { name: 'login', limit: 10, windowMs: 15 * 60_000 })) return;
  if (!JWT_SECRET || JWT_SECRET.length < 32) {
    return res.status(503).json({ error: 'Authentification non configurée' });
  }
  await connectToDatabase();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { username, password } = req.body;

  if (typeof username !== 'string' || typeof password !== 'string' || username.length > 100 || password.length > 256) {
    return res.status(400).json({ error: 'Requête invalide' });
  }

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(401).json({ error: 'Identifiants invalides' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ error: 'Identifiants invalides' });
  }

  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.status(200).json({ token });
}
