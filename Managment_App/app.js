/*
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const userRouter = require('./routes/user.route'); // User routes

// Config dotenv to load environment variables
dotenv.config();

// Initialize the app
const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse incoming requests with JSON payload

// Connect to MongoDB database
mongoose.connect(process.env.DATABASE)
  .then(() => {
    console.log('Database successfully connected');
  })
  .catch((err) => {
    console.error('Unable to connect to database', err);
    process.exit(1); // Exit if DB connection fails
  });

// Use the user routes for /api/users
app.use('/api/users', userRouter);

// Default route for testing
app.get("/", (req, res) => {
  res.send("Welcome to the User API!");
});

// Start the server on the specified port
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app; // Export for testing if needed
*/
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const userRouter = require('./routes/user.route'); // User routes
const bagRouter = require('./routes/bag.route'); // Bag routes

dotenv.config(); // Charger les variables d'environnement depuis le fichier .env

const app = express();

// Middleware
app.use(cors()); // Activer CORS pour toutes les routes
app.use(express.json()); // Parser les données JSON envoyées dans les requêtes

// Connexion à la base de données MongoDB
mongoose.connect(process.env.DATABASE)
  .then(() => {
    console.log('Database successfully connected');
  })
  .catch((err) => {
    console.error('Unable to connect to database', err);
    process.exit(1); // Quitter si la connexion à la DB échoue
  });

// Routes
app.use('/api/users', userRouter);  // Routes pour les utilisateurs
app.use('/api/bags', bagRouter);    // Routes pour les "bags"

// Route par défaut pour tester
app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

// Démarrage du serveur
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app; // Exporter pour les tests
