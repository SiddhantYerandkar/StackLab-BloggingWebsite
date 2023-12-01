const authorModel = require('../models/authorModel')
const { isValidString, isValidPassword, isEmail } = require('../validator/validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')


const createAuthor = async function (req, res) {
    try {
        let data = req.body

        const { name, email, password } = data

        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Body can't be empty" })
        }

        if (!name) return res.status(400).send({ status: false, msg: "name must not be empty" });
        if (!isValidString(name)) return res.status(400).send({ status: false, msg: "Please Provide Valid Name" });

        if (!email) return res.status(400).send({ status: false, msg: "email must not be empty" });
        if (!isEmail(email)) return res.status(400).send({ status: false, msg: "Please enter a valid EmailId" });

        if (!password) return res.status(400).send({ status: false, msg: "password is required" });
        if (!isValidPassword(password))
            return res.status(400).send({ status: false, msg: "Password Must contain uppercase , lowercase , special character and a number" });

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)
        const hashName = await bcrypt.hash(name, salt)
        data.password = hashPassword
        data.name = hashName

        const createData = await authorModel.create(data)
        return res.status(201).send({ status: true, message: "successfully created", data: createData })

    } catch (error) {
        next(error)
    }
}

const loginUser = async function (req, res) {
    try {
        let data = req.body

        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Body can't be empty" })
        }

        const { email, password } = data

        if (!email) return res.status(400).send({ status: false, message: "email must not be empty" })

        if (!password) return res.status(400).send({ status: false, message: "password must not be empty" })

        let findUser = await authorModel.findOne({ email: email })

        if (!findUser) return res.status(401).send({ status: false, message: "email or password is incorrect" });

        let hashPassword = findUser.password

        let result = await bcrypt.compare(password, hashPassword)
        if (!result) return res.status(400).send({ status: false, message: "password enterend is incorrect" })

        let token = jwt.sign(
            {
                userId: findUser._id.toString(),
                email: findUser.email
            },
            "blogging-website-secret-token"
        )

        res.setHeader("x-api-key", token);
        return res.status(200).send({ status: true, data: token });

    } catch (error) {
        next(error)
    }
}


module.exports = { createAuthor, loginUser }