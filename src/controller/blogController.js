// Import necessary modules
const authorModel = require('../models/authorModel')
const blogModel = require('../models/blogModel')
const { isValidId } = require('../validator/validator')

const createBlog = async function (req, res, next) {
    try {
        // Extract data from the request body
        let data = req.body

        // Check if request body is empty
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Body can't be empty" })
        }

        // Extract individual fields from the data
        let { title, body, authorId } = data

        // Check if required fields (title, body, authorId) are present
        if (!title) return res.status(400).send({ status: false, message: "title is required" });
        if (!body) return res.status(400).send({ status: false, message: "body is required" });
        if (!authorId) return res.status(400).send({ status: false, message: "authorId is required" });

        // Validate the format of the authorId
        if (!isValidId(authorId)) return res.status(400).send({ status: false, message: "Invalid AuthorId" })

        // Find the author with the specified authorId or show an error in response
        let findAuthor = await authorModel.findById(authorId)
        if (!findAuthor) return res.status(404).send({ status: false, message: "Author Not found" })

        // Create a new blog using the provided data and send it in response
        const Blog = await blogModel.create(data);
        return res.status(201).send({ status: true, data: Blog, message: "Blog created successfully" });

    } catch (error) {
        // Pass any errors to the next middleware for centralized error handling
        next(error)
    }
}

const getBlogPosts = async function (req, res, next) {
    try {
        // Retrieve all blog where isDeleted is false and send it in response
        const blogData = await blogModel.find({ isDeleted: false })

        return res.status(200).send({ status: true, data: blogData })

    } catch (error) {
        // Pass any errors to the next middleware for centralized error handling
        next(error)
    }
}

const getBlogById = async function (req, res, next) {
    try {
        // Extract the blogId from the request parameters
        let blogId = req.params.blogId

        //Find the blog post by its ID
        const getData = await blogModel.findById({ _id: blogId })

        // If the blog post is not found, return a 404 Not Found response
        if (!getData) {
            return res.status(404).send({ status: false, message: "Blog post not found" });
        }
        // Return a 200 OK response with the retrieved blog data
        return res.status(200).send({ status: true, data: getData })

    } catch (error) {
        // Pass any errors to the next middleware for centralized error handling
        next(error)
    }
}


const updateBlog = async function (req, res, next) {
    try {
        // Extract data from request body and destructure it
        let blogData = req.body

        let { title, body } = blogData

        // Check if the request body is empty
        if (Object.keys(blogData).length == 0) return res.status(400).send({ status: false, msg: "Data not found in body" });

        // Extract the blogId from the request parameters
        let blogId = req.params.blogId

        // Validate the format of the blogId
        if (!isValidId(blogId)) return res.status(400).send({ status: false, msg: "Invalid blogId" });

        // Find the blog post by its ID and If not found, return a 404 Not Found response
        let findBlog = await blogModel.findById(blogId)
        if (!findBlog) return res.status(404).send({ status: false, msg: "Blogs not found" });

        // Check if the requesting author has access to update this blog
        let authorId = findBlog.userId
        if (authorId != req.decoded.authorId) return res.status(403).send({ status: false, msg: "you dont have access" });

        // Update the blog post with the provided data
        let updatedBlog = await blogModel.findOneAndUpdate(
            { _id: blogId },
            {
                title: title,
                body: body
            },
            { new: true }
        )

        // Check if the blog post was not found or is marked as deleted
        if (updatedBlog.isDeleted == true) {
            return res.status(404).send({ status: false, msg: "blog not found or deleted" });
        }
        // Return a 200 OK response with the updated blog data
        return res.status(200).send({ status: true, data: updatedBlog, message: "blog updated successfully" });

    } catch (error) {
        // Pass any errors to the next middleware for centralized error handling
        next(error)
    }
}

const deleteBlog = async function (req, res, next) {
    try {
        // Extract the blogId from the request parameters
        let blogId = req.params.blogId

        // Validate the format of the blogId
        if (!isValidId(blogId)) return res.status(400).send({ status: false, msg: "Invalid blogId" });

        // Find the blog post by its ID and if it's not found, return a 404 Not Found response
        let findBlog = await blogModel.findById(blogId)
        if (!findBlog) return res.status(404).send({ status: false, msg: "Blog not found" });


        // Check if the requesting author has access to delete this blog
        let authorId = findBlog.authorId
        if (authorId != req.decoded.userId) return res.status(403).send({ status: false, msg: "you don not have access" });

        // Update the blog post to mark it as deleted
        let updatedBlog = await blogModel.findOneAndUpdate(
            { _id: blogId, isDeleted: false },
            {
                $set: {
                    isDeleted: true
                }
            },
            { new: true }
        );

        // If the blog post document doesn't exist, return a 404 Not Found response
        if (!updatedBlog) return res.status(404).send({ status: false, msg: "blog document doesn't exist" });
        
        // Return a 200 OK response with an empty data object and a success message 
        return res.status(200).send({ status: true, data: {}, message: "Blog deleted successfully" });

    } catch (error) {
        // Pass any errors to the next middleware for centralized error handling
        next(error)
    }
}

// Export all the functions for use in routes
module.exports = { createBlog, getBlogPosts, getBlogById, updateBlog, deleteBlog }