require('dotenv').config();
const jwt = require('jsonwebtoken');
const db = require('./database').db;

/**
 * withAuth: verify if request provide a valid token. If yes, send to next request step. If no, raise an error
 * @param req
 * @param res
 * @param next
 *
 */
const withAuth = function(req, res, next) {
    const authorization = req.headers.authorization;
    //authorization has to be a bearer
    if(authorization.startsWith('Bearer ')){
        //get the token
        const token = authorization.slice(7,authorization.length);
        if (!token) {
            res.status(401).send('Unauthorized: No token provided');
        } else {
            //verify token
            jwt.verify(token, process.env.SECRET_TOKEN, function(err, decoded) {
                if (err) {
                    res.status(401).send('Unauthorized: Invalid token');
                } else {
                    //store in req the name of user provided in token for the next requests
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

/**
 * verifyId: verify that user identify in param, body or header is the user who sent the request
 * @param req
 * @param res
 * @param next
 */
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