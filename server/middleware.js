require('dotenv').config();
const jwt = require('jsonwebtoken');
const withAuth = function(req, res, next) {
    const token = req.headers.authorization
    console.log(token);
    if (!token) {
        res.status(401).send('Unauthorized: No token provided');
    } else {
        jwt.verify(token, process.env.SECRET_TOKEN, function(err, decoded) {
            if (err) {
                res.status(401).send('Unauthorized: Invalid token');
            } else {
                req.email = decoded.email;
                next();
            }
        });
    }
}
module.exports = withAuth;