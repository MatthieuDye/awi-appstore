require('dotenv').config();
const jwt = require('jsonwebtoken');
const withAuth = function(req, res, next) {
    const token = req.headers.authorization;
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
};

function getEmail(req){
    const token = req.headers.authorization;
    return jwt.verify(token, process.env.SECRET_TOKEN, function(err, decoded) {
        if (err) {
            return '';
        } else {
            return decoded.email;
        }
    });
};

module.exports = {
    withAuth,
    getEmail
};