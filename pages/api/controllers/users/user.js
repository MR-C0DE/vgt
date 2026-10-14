import { connectToDatabase } from '@/lib/mongodb';
import User from '@/lib/models/UserModel';
import bcrypt from 'bcryptjs';
import { authenticateActiveRequest } from '@/utils/authMiddleware';

export default async function handler(req, res) {
  if (!await authenticateActiveRequest(req, res, ['admin'])) return;
  const { method } = req;

  try {
    await connectToDatabase();

    switch (method) {
      case 'GET':
        const { keyword } = req.query;
        if (keyword) {
          const regex = new RegExp(keyword, 'i');
          const users = await User.find({
            $or: [
              { username: regex },
              { first_name: regex },
              { last_name: regex },
              { email: regex },
            ],
          }).select('-password');
          res.status(200).json(users);
        } else {
          res.status(400).json({ message: 'Keyword is required' });
        }
        break;

      case 'POST':
        const { username, password, firstName, lastName, email, phone } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
          username,
          password: hashedPassword,
          first_name: firstName,
          last_name: lastName,
          email,
          phone,
          role: 'editor',
        });
        newUser.password = undefined;
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
