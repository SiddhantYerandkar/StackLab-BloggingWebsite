const authorModel = require('../models/authorModel')
const blogModel = require('../models/blogModel')
const { isValidId } = require('../validator/validator')

const createBlog = async function (req, res) {
    try {
        let data = req.body

        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Body can't be empty" })
        }

        let { title, body, authorId } = data

        if (!title) return res.status(400).send({ status: false, message: "title is required" });
        if (!body) return res.status(400).send({ status: false, message: "body is required" });
        if (!authorId) return res.status(400).send({ status: false, message: "authorId is required" });

        if (!isValidId(authorId)) return res.status(400).send({ status: false, message: "Invalid AuthorId" })

        let findAuthor = await authorModel.findById(authorId)

        if (!findAuthor) return res.status(404).send({ status: false, message: "Author Not found" })

        const Blog = await blogModel.create(data);
        return res.status(201).send({ status: true, data: Blog, message: "Blog created successfully" });

    } catch (error) {
        next(error)
    }
}

const getBlogPosts = async function (req, res) {
    try {

        const blogData = await blogModel.find({ isDeleted: false })

        return res.status(200).send({ status: true, data: blogData })

    } catch (error) {
        next(error)
    }
}

const getBlogById = async function (req, res) {
    try {

        let blogId = req.params.blogId

        const getData = await blogModel.findById({ _id: blogId })

        return res.status(200).send({ status: true, data: getData })

    } catch (error) {
        next(error)
    }
}


const updateBlog = async function (req, res) {
    try {
        let blogData = req.body

        let { title, body } = blogData

        if (Object.keys(blogData).length == 0) return res.status(400).send({ status: false, msg: "Data not found in body" });

        let blogId = req.params.blogId

        if (!isValidId(blogId)) return res.status(400).send({ status: false, msg: "Invalid blogId" });

        let findBlog = await blogModel.findById(blogId)
        if (!findBlog) return res.status(404).send({ status: false, msg: "Blogs not found" });

        let authorId = findBlog.authorId
        if (authorId != req.decoded.authorId) return res.status(403).send({ status: false, msg: "you dont have access" });

        let updatedBlog = await blogModel.findOneAndUpdate(
            { _id: blogId },
            {
                title: title,
                body: body
            },
            { new: true }
        )

        if (updatedBlog.isDeleted == true) {
            return res.status(404).send({ status: false, msg: "blog not found or deleted" });
        }
        return res.status(200).send({ status: true, data: updatedBlog, message: "blog updated successfully" });

    } catch (error) {
        next(error)
    }
}

const deleteBlog = async function (req, res) {
    try {

        let blogId = req.params.blogId

        if (!isValidId(blogId)) return res.status(400).send({ status: false, msg: "Invalid blogId" });

        let findBlog = await blogModel.findById(blogId)
        if (!findBlog) return res.status(404).send({ status: false, msg: "Blog not found" });

        let authorId = findBlog.authorId
        if (authorId != req.decoded.authorId) return res.status(403).send({ status: false, msg: "you don not have access" });

        let updatedBlog = await blogModel.findOneAndUpdate(
            { _id: blogId, isDeleted: false },
            {
                $set: {
                    isDeleted: true
                }
            },
            { new: true }
        );

        if (!updatedBlog) return res.status(404).send({ status: false, msg: "blog document doesn't exist" });

        return res.status(200).send({ status: true, data: {}, message: "Blog deleted successfully" });

    } catch (error) {
        next(error)
    }
}


module.exports = { createBlog, getBlogPosts, getBlogById, updateBlog, deleteBlog }