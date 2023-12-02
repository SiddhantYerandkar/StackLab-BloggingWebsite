const mongoose = require('mongoose');

// Define the Schema for Author Model
const authorSchema = new mongoose.Schema({
    // Author's name
    name: {
        type: String,
        required: true
    },
    // Author's email address
    email: {
        type: String,
        required: true,
        unique: true,
    },
    // Author's password
    password: {
        type: String,
        required: true,
    }
}, { timestamps: true })

// Create and export Author model using the defined schema
module.exports = mongoose.model('author', authorSchema)