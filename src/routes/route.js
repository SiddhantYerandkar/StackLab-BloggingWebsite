// Import necessary modules
const express = require('express')
const router = express.Router()
const authorController = require('../controller/authorController')
const blogController = require('../controller/blogController')
const auth = require('../middleware/authentication')
const errorMiddleware = require('../middleware/errorMiddleware')

//Destructuring functions from controllers
const { createAuthor, loginUser } = authorController
const { createBlog, updateBlog, getBlogById, getBlogPosts, deleteBlog } = blogController

//Endpoint for creating new author
router.post('/register', createAuthor)

//Endpoint for authenticating an author
router.post('/login', loginUser)

//creating new blog endpoint, requires authentication
router.post('/blogs', auth.authenticate, createBlog)

//Endpoint to retrieve all blogs
router.get('/getBlogs', getBlogPosts)

//Retrieve a specific blog by ID endpoint
router.get('/getBlog/:blogId', getBlogById)

//Update a blog by ID endpoint, requires authentication
router.put('/updateBlog/:blogId', auth.authenticate, updateBlog)

//Delete a blog post by ID endpoint, requires authentication
router.delete('/deleteBlog/:blogId', auth.authenticate, deleteBlog)

//Export the router for use in the main application file
module.exports = router