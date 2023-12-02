const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId;

// Define the Schema for Blog Model
const blogSchema = new mongoose.Schema({
    // The title of the blog
    title: {
        type: String,
        required: true
    },
    // The content of the blog
    body: {
        type: String,
        required: true
    },
    // The ID of the author associated with the blog
    authorId: {
        type: ObjectId,
        ref: "Author" // Reference to the Author model
    },
    // A flag indicating whether the blog is marked as deleted
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

// Create and export Blog model using the defined schema
module.exports = mongoose.model('blog', blogSchema)