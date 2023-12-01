
const errorMiddleware = (err, req, res, next) => {

    const status = err.status || 500;

    const message = err.message || "something went Wrong"

    res.status(status).send({ error: message })

}


module.exports = errorMiddleware