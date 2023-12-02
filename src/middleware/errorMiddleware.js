// Define a middleware to handle errors in the application
const errorMiddleware = (err, req, res, next) => {

    // Extract the status code from the error or default to 500
    const status = err.status || 500;

    // Extract the error message from the error or use a generic message
    const message = err.message || "something went Wrong"

    // Send a response with the appropriate status code and error message
    return res.status(status).send({ error: message })

}

// Export the errorMiddleware for use in other parts of the application
module.exports = errorMiddleware