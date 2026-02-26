import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'voiceofgodtabernacle_secret_key_2026';

export const withAuth = (handler, allowedRoles = ['admin', 'editor', 'viewer']) => {
  return async (req, res) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({ error: 'Non autorisé - Token manquant' });
      }

      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Ajouter l'utilisateur à la requête
      req.user = decoded;

      // Vérifier le rôle
      if (!allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ 
          error: 'Accès interdit - Vous n\'avez pas les droits nécessaires' 
        });
      }

      return handler(req, res);
    } catch (error) {
      console.error('Auth error:', error);
      return res.status(401).json({ error: 'Token invalide' });
    }
  };
};

// Helpers pour les rôles spécifiques
export const withAdmin = (handler) => withAuth(handler, ['admin']);
export const withEditor = (handler) => withAuth(handler, ['admin', 'editor']);
export const withViewer = (handler) => withAuth(handler, ['admin', 'editor', 'viewer']);