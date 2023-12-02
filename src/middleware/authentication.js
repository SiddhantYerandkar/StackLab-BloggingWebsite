const jwt = require('jsonwebtoken')

const authenticate = function (req, res, next) {
    try {
        //Extract the token from the request headers
        let token = req.headers["x-api-key"];
        //If no token is present, return a 401 Unauthorized response
        if (!token) return res.status(401).send({ status: false, msg: "token must be present" });

        //Verify token using the secret key
        jwt.verify(token, "blogging-website-secret-token", (err, decoded) => {
            // If there's an error during verification, return a 401 Unauthorized response
            if (err) {
                return res.status(401).send({ status: false, msg: err.message });
            } else {
                // If verification is successful, attach the decoded information to the request object
                req.decoded = decoded;
                // Call the next middleware
                return next();
            }
        });

    } catch (error) {
        // If an error occurs, pass it to the error-handling middleware
        next(error)
    }
};

// Export the authenticate middleware for use in other parts of the application
module.exports.authenticate = authenticate;