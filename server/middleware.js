require('dotenv').config();
const jwt = require('jsonwebtoken');
const db = require('./database').db;

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

const verifyId = function(req,res,next) {
    db.select('*')
        .from('user')
        .where({mail_user:getEmail(req)})
        .then(items => {
            if (items[0].id_user.toString() === req.headers.id_user || req.body.id_user) {
                next();
            } else {
                res.status(401).send('Unauthorized')
            }
        })
        .catch(err => res.status(400).json({dbError: 'db error '+err}))
}

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
    getEmail,
    verifyId,
};