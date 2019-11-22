const table_name = 'rating';
const db = require('../config/database').db;

/**
 * hasRating: query db to know if a user has rated an app identified in req.params
 * @param req
 * @param res
 */
const hasRating = (req,res) => {
    const id_app = req.params.id_app;
    const id_user = req.params.id_user;
    db.select('*').from(table_name).where({id_user:id_user,id_app:id_app})
        .then(items => {
            if(items.length===1){
                res.json({hasRating:true})
            }
            else{
                res.json({hasRating:false})
            }
        })
        .catch(err => res.status(400).json({dbError: 'db error '+err}))
};

/**
 * insertRating: insert in db a rating for a user on an app identified in req.body
 * @param req
 * @param res
 */
const insertRating = (req, res) => {
    const { id_user, id_app,rating } = req.body;
    db(table_name).insert({id_user,id_app,rating})
        .returning('*')
        .then(item => {
            res.json(item)
        })
        .catch(err => res.status(400).json({dbError: 'db error '+err}))
};

/**
 * updateRating: update rating from user on an app identified in req.body
 * @param req
 * @param res
 */
const updateRating = (req, res) => {
    const { id_user,id_app,rating } = req.body;
    db(table_name).where({
        id_user: id_user,
        id_app:  id_app
    }).update({rating:rating})
        .returning('*')
        .then()
        .catch(err => res.status(400).json({dbError: 'db error '+err}))
};

/**
 * deleteAllRatingWithApp: delete in db all ratings of an app identified in req.params
 * @param req
 * @param res
 * @param next
 */
const deleteAllRatingWithApp = (req, res,next) => {
    const id_app = req.params.id_app;
    db(table_name).where({
        id_app:  id_app
    }).del()
        .then(() => {
            next();
        })
        .catch(err => res.status(400).json({dbError: 'db error '+err}))
}

module.exports = {
    insertRating,
    updateRating,
    deleteAllRatingWithApp,
    hasRating
}