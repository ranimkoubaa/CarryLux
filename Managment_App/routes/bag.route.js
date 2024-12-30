const express = require('express');
const router = express.Router();
const Bag = require('../models/bag'); // Assurez-vous que le modèle Bag est bien importé

// Route POST pour créer un bag
router.post('/', async (req, res) => {
  const { name, description, price, imageUrl } = req.body;

  try {
    // Créer un nouveau bag à partir des données envoyées
    const newBag = new Bag({ name, description, price, imageUrl });
    await newBag.save();  // Sauvegarder le bag dans la base de données
    res.status(201).json(newBag);  // Retourner le bag créé avec un statut 201
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création du bag' });
  }
});

// Route GET pour récupérer tous les bags
router.get('/', async (req, res) => {
  try {
    const bags = await Bag.find(); // Récupérer tous les bags
    res.status(200).json(bags);  // Retourner les bags avec un statut 200
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des bags' });
  }
});
// Route PUT for updating a bag
router.put('/:id', async (req, res) => {
    const { id } = req.params; // Get bag ID from URL parameter
    const { name, description, price, imageUrl } = req.body; // Get updated data from request body
  
    try {
      const updatedBag = await Bag.findByIdAndUpdate(
        id,
        { name, description, price, imageUrl },
        { new: true }  // Return the updated bag
      );
  
      if (!updatedBag) {
        return res.status(404).json({ error: 'Bag not found' });
      }
  
      res.status(200).json(updatedBag);  // Return the updated bag
    } catch (error) {
      res.status(500).json({ error: 'Error updating the bag' });
    }
  });
  
  // Route DELETE for deleting a bag
  router.delete('/:id', async (req, res) => {
    const { id } = req.params; // Get bag ID from URL parameter
  
    try {
      const deletedBag = await Bag.findByIdAndDelete(id); // Delete bag by ID
  
      if (!deletedBag) {
        return res.status(404).json({ error: 'Bag not found' });
      }
  
      res.status(200).json({ message: 'Bag deleted successfully' });  // Return success message
    } catch (error) {
      res.status(500).json({ error: 'Error deleting the bag' });
    }
  });

module.exports = router;  // Exporter le routeur pour l'utiliser dans app.js
