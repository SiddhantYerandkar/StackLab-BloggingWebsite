const jwt = require('jsonwebtoken')

const authenticate = function (req, res, next) {
    try {
        let token = req.headers["x-api-key"];
        if (!token) return res.status(401).send({ status: false, msg: "token must be present" });


        jwt.verify(token, "blogging-website-secret-token", (err, decoded) => {
            if (err) {
                return res.status(401).send({ status: false, msg: err.message });
            } else {
                req.decoded = decoded;
                return next();
            }
        });

    } catch (error) {
        next(error)
    }
};

module.exports.authenticate = authenticate;