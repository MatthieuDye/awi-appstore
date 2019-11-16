const table_name = 'rank';
const db = require('../database').db;

const getNbRating = (req,res) => {
    const id_app = req.headers;
    db(table_name).select('id_app',db.raw('count(rank) as nb_rank')).where({id_app:id_app})
        .then(items => {
            if(items.length===1){
                res.json({nb_ratings:items[0].nb_rank})
            }
        })
        .catch(err => res.status(400).json({dbError: 'db error '+err}))
}

const hasRank = (req,res) => {
    const {id_user,id_app} = req.headers;
    db(table_name).select('*').where({id_user:id_user,id_app:id_app})
        .then(items => {
            if(items.length===1){
                res.json({hasRank:true})
            }
            else{
                res.json({hasRank:false})
            }
        })
        .catch(err => res.status(400).json({dbError: 'db error '+err}))
};

const insertRank = (req, res) => {
    const { id_user, id_app,rank } = req.body;
    db(table_name).insert({id_user,id_app,rank})
        .returning('*')
        .then(item => {
            res.json(item)
        })
        .catch(err => res.status(400).json({dbError: 'db error '+err}))
};

const updateRank = (req, res) => {
    const { id_user,id_app,rank } = req.body;
    db(table_name).where({
        id_user: id_user,
        id_app:  id_app
    }).update({rank:rank})
        .returning('*')
        .then()
        .catch(err => res.status(400).json({dbError: 'db error '+err}))
}

const deleteAllRankWithApp = (req, res,next) => {
    const id_app = req.headers.id_app;
    db(table_name).where({
        id_app:  id_app
    }).del()
        .then(() => {
            next();
        })
        .catch(err => res.status(400).json({dbError: 'db error '+err}))
}

module.exports = {
    insertRank,
    updateRank,
    deleteAllRankWithApp,
    hasRank
}