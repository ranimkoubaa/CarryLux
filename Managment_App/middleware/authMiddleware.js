/*const jwt = require('jsonwebtoken');

// Middleware pour vérifier le token JWT
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Accès non autorisé' });
  }

  try {
    const decoded = jwt.verify(token, 'secretkey');
    req.user = decoded; // Ajouter les informations utilisateur au request
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token invalide ou expiré' });
  }
};

module.exports = authMiddleware;
*/
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Récupérer le token depuis l'en-tête Authorization
  if (!token) {
    return res.status(403).json({ message: 'Accès refusé. Token manquant.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN); // Vérifier le token
    req.user = decoded; // Stocker les informations de l'utilisateur décodées dans la requête
    next(); // Passer à la route suivante
  } catch (error) {
    res.status(401).json({ message: 'Token invalide ou expiré' });
  }
};

// Middleware pour vérifier si l'utilisateur est un administrateur
const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') { // Vérifier si le rôle est admin
    return res.status(403).json({ message: 'Accès réservé aux administrateurs.' });
  }
  next(); // L'utilisateur a le rôle admin, on passe à la route suivante
};

module.exports = { authMiddleware, adminMiddleware };

