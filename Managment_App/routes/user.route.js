/*const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Récupérer l'utilisateur actuel (pour l'utilisateur connecté)
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'utilisateur' });
  }
});

// Mettre à jour l'utilisateur (par exemple, changer l'email ou le mot de passe)
router.put('/me', authMiddleware, async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    if (email) user.email = email; // Mettre à jour l'email
    if (password) user.password = password; // Mettre à jour le mot de passe (penser à le hasher)

    await user.save();
    res.status(200).json({ message: 'Utilisateur mis à jour avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'utilisateur' });
  }
});

// Supprimer un utilisateur (optionnel)
router.delete('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'utilisateur' });
  }
});

module.exports = router;
*/


const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Register Route
router.post('/register', async (req, res) => {
  const { email, password, role } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }

    // Create a new user
    const newUser = new User({ email, password, role });

    // Hash the password before saving
    await newUser.save();

    // Generate a token for the new user
    const token = jwt.sign(
      { userId: newUser._id },
      process.env.TOKEN, // Use the JWT secret key from the environment
      { expiresIn: '1h' }
    );

    res.status(201).json({ token, message: 'Utilisateur créé avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la création de l\'utilisateur' });
  }
});

// Login Route
/*
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Compare the provided password with the hashed password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mot de passe incorrect' });
    }

    // Generate a token for the user
    const token = jwt.sign(
      { userId: user._id },
      process.env.TOKEN, // Use your JWT secret from .env
      { expiresIn: '1h' }
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la connexion' });
  }
});
*/

/*
// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
  
      // Compare the provided password with the hashed password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Mot de passe incorrect' });
      }
  
      // Generate a token for the user including the 'role'
      const token = jwt.sign(
        { userId: user._id, role: user.role },  // Add role here
        process.env.TOKEN, // Use your JWT secret from .env
        { expiresIn: '1h' }
      );
  
      // Return the token and the role in the response
      res.status(200).json({ token, role: user.role });  // Include role in response
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la connexion' });
    }
  });
  */
  router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
  
      // Compare the provided password with the hashed password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Mot de passe incorrect' });
      }
  
      // Generate a token for the user including the 'role'
      const token = jwt.sign(
        { userId: user._id, role: user.role },  // Ajouter le rôle ici
        process.env.TOKEN, // Utilisez la clé secrète du JWT depuis .env
        { expiresIn: '1h' }
      );
  
      // Retourner le token et le rôle dans la réponse
      res.status(200).json({ token, role: user.role });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ error: 'Erreur lors de la connexion' });
    }
  });
  

module.exports = router;
