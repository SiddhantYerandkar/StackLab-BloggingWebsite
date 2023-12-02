// Import necessary modules
const authorModel = require('../models/authorModel')
const { isValidString, isValidPassword, isEmail } = require('../validator/validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')


const createAuthor = async function (req, res, next) {
    try {
        // Extract data from the request body and destructure it
        let data = req.body

        const { name, email, password } = data

        // Check if the request body is empty
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Body can't be empty" })
        }

        // Check if the required fields are present(name, email and password) and validate them
        if (!name) return res.status(400).send({ status: false, msg: "name must not be empty" });
        if (!isValidString(name)) return res.status(400).send({ status: false, msg: "Please Provide Valid Name" });

        if (!email) return res.status(400).send({ status: false, msg: "email must not be empty" });
        if (!isEmail(email)) return res.status(400).send({ status: false, msg: "Please enter a valid EmailId" });

        if (!password) return res.status(400).send({ status: false, msg: "password is required" });
        if (!isValidPassword(password))
            return res.status(400).send({ status: false, msg: "Password Must contain uppercase , lowercase , special character and a number" });

        // Hash the password and name for security
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)
        const hashName = await bcrypt.hash(name, salt)
        data.password = hashPassword
        data.name = hashName

        // Create a new author with the hashed data and send it in response with a success message
        const createData = await authorModel.create(data)
        return res.status(201).send({ status: true, message: "successfully created", data: createData })

    } catch (error) {
        // Pass any errors to the next middleware for centralized error handling
        next(error)
    }
}

const loginUser = async function (req, res, next) {
    try {
        // Extract data from the request body
        let data = req.body

        // Check if the request body is empty
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Body can't be empty" })
        }

        const { email, password } = data
        // Check if the email and password are present
        if (!email) return res.status(400).send({ status: false, message: "email must not be empty" })

        if (!password) return res.status(400).send({ status: false, message: "password must not be empty" })

        // Find the user by email in the database and if not found return a 401 Unauthorized response
        let findUser = await authorModel.findOne({ email: email })

        if (!findUser) return res.status(401).send({ status: false, message: "email or password is incorrect" });

        // Retrieve the hashed password from the database
        let hashPassword = findUser.password

        // Compare the provided password with the hashed password and if password is incorrect return a 400 Bad Request response
        let result = await bcrypt.compare(password, hashPassword)
        if (!result) return res.status(400).send({ status: false, message: "password entered is incorrect" })

        // Generate a JWT token with user information
        let token = jwt.sign(
            {
                userId: findUser._id.toString(),
                email: findUser.email
            },
            "blogging-website-secret-token"
        )
        
        // Set the token in the response header and return a 200 OK response with the token
        res.setHeader("x-api-key", token);
        return res.status(200).send({ status: true, data: token });

    } catch (error) {
        // Pass any errors to the next middleware for centralized error handling
        next(error)
    }
}

// Export all the functions for use in routes
module.exports = { createAuthor, loginUser }