/*const mongoose = require('mongoose');

// Définir le schéma de l'utilisateur
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
}, {
  timestamps: true, // Ajouter des timestamps (createdAt et updatedAt)
});

const User = mongoose.model('User', userSchema);

module.exports = User;
*/
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the schema for the user
const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Hash the password before saving it to the database
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    try {
      const salt = await bcrypt.genSalt(10); // Generate a salt
      this.password = await bcrypt.hash(this.password, salt); // Hash the password
      next(); // Proceed with the save
    } catch (error) {
      next(error); // Handle errors
    }
  } else {
    next(); // Proceed with the save if password is not modified
  }
});

// Compare a provided password with the hashed password in the database
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password); // Compare the input password with the hashed password
};

const User = mongoose.model('User', userSchema);

module.exports = User;
