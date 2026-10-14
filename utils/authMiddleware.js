import jwt from 'jsonwebtoken';

export const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET must be configured with at least 32 characters');
  }
  return secret;
};

export const authenticateRequest = (req, res, allowedRoles = ['admin', 'editor', 'viewer']) => {
  const authorization = req.headers.authorization;
  if (!authorization?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Non autorisé' });
    return null;
  }

  try {
    const decoded = jwt.verify(authorization.slice(7), getJwtSecret(), {
      algorithms: ['HS256'],
    });
    if (!allowedRoles.includes(decoded.role)) {
      res.status(403).json({ error: 'Accès interdit' });
      return null;
    }
    return decoded;
  } catch (error) {
    console.error('Auth error:', error.message);
    res.status(401).json({ error: 'Token invalide' });
    return null;
  }
};

export const withAuth = (handler, allowedRoles = ['admin', 'editor', 'viewer']) => {
  return async (req, res) => {
    try {
      const decoded = await authenticateActiveRequest(req, res, allowedRoles);
      if (!decoded) return;
      req.user = decoded;
      return handler(req, res);
    } catch (error) {
      console.error('Auth error:', error);
      return res.status(401).json({ error: 'Token invalide' });
    }
  };
};

export const authenticateActiveRequest = async (
  req,
  res,
  allowedRoles = ['admin', 'editor', 'viewer']
) => {
  const decoded = authenticateRequest(req, res, allowedRoles);
  if (!decoded) return null;

  try {
    const [{ connectToDatabase }, { default: User }] = await Promise.all([
      import('../lib/mongodb.js'),
      import('../lib/models/UserModel.js'),
    ]);
    await connectToDatabase();
    const user = await User.findById(decoded.id).select('role +auth_version');
    const tokenVersion = Number(decoded.auth_version || 0);
    const currentVersion = Number(user?.auth_version || 0);

    if (!user || user.role !== decoded.role || tokenVersion !== currentVersion) {
      res.status(401).json({ error: 'Session expirée' });
      return null;
    }

    return decoded;
  } catch (error) {
    console.error('Active session verification error:', error.message);
    res.status(503).json({ error: 'Vérification de session indisponible' });
    return null;
  }
};

// Helpers pour les rôles spécifiques
export const withAdmin = (handler) => withAuth(handler, ['admin']);
export const withEditor = (handler) => withAuth(handler, ['admin', 'editor']);
export const withViewer = (handler) => withAuth(handler, ['admin', 'editor', 'viewer']);
