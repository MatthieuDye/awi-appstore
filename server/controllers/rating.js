const table_name = 'rating';
const db = require('../database').db;


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

const insertRating = (req, res) => {
    const { id_user, id_app,rating } = req.body;
    db(table_name).insert({id_user,id_app,rating})
        .returning('*')
        .then(item => {
            res.json(item)
        })
        .catch(err => res.status(400).json({dbError: 'db error '+err}))
};

const updateRating = (req, res) => {
    const { id_user,id_app,rating } = req.body;
    db(table_name).where({
        id_user: id_user,
        id_app:  id_app
    }).update({rating:rating})
        .returning('*')
        .then()
        .catch(err => res.status(400).json({dbError: 'db error '+err}))
}

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