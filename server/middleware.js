require('dotenv').config();
const jwt = require('jsonwebtoken');
const db = require('./database').db;

/**
 * withAuth
 * @param req
 * @param res
 * @param next
 * verify if request provide a valid token. If yes, send to next request step. If no, raise an error
 */
const withAuth = function(req, res, next) {
    const authorization = req.headers.authorization;
    if(authorization.startsWith('Bearer ')){
        const token = authorization.slice(7,authorization.length);
        if (!token) {
            res.status(401).send('Unauthorized: No token provided');
        } else {
            jwt.verify(token, process.env.SECRET_TOKEN, function(err, decoded) {
                if (err) {
                    res.status(401).send('Unauthorized: Invalid token');
                } else {
                    req.name_user = decoded.firstname+"."+decoded.lastname;
                    next();
                }
            });
        }
    }
    else{
        res.status(401).send('Unauthorized: Not a Bearer Authorization');
    }

};

const verifyId = function(req,res,next) {
    db.select('*')
        .from('user')
        .where({name_user:req.name_user})
        .then(items => {
            if (items[0].id_user.toString() === req.headers.id_user || req.body.id_user || req.params.id_user) {
                next();
            } else {
                res.status(401).send('Unauthorized')
            }
        })
        .catch(err => res.status(400).json({dbError: 'db error '+err}))
};

module.exports = {
    withAuth,
    verifyId,
};