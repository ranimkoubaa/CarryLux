const mongoose = require('mongoose');

// Définir le schéma pour un "bag"
const bagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // Retirer les espaces inutiles
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0, // Le prix ne peut pas être négatif
    },
    imageUrl: {
      type: String, // L'URL vers l'image du produit
      required: true,
    },
    available: {
      type: Boolean,
      default: true, // Par défaut, le bag est disponible
    },
  },
  { timestamps: true } // Ajoute des timestamps pour la création et la mise à jour
);

// Créer et exporter le modèle
module.exports = mongoose.model('Bag', bagSchema);
