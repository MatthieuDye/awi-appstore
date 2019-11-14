const table_name = 'app';
const table_rank = 'rank';
const table_user = 'user';
const middleware = require('../middleware');


const getApps = (req, res, db) => {
    db.select('id_app','name_app','description_app','name_user').from(table_name)
        .join(table_user,'user.id_user','=','app.id_creator')
        .then(items => {
            if(items.length){
                res.json(items)
            } else {
                res.json(null)
            }
        })
        .catch(err => res.status(400).json({dbError: 'db error'}))
};

const getAppsFromUser = (req,res,db) => {
    db.select('app.id_app','app.name_app','app.description_app','app.link_app','user.name_user',db.raw('avg(rank) as rank'))
        .from(table_name)
        .join(table_user,'app.id_creator','=','user.id_user')
        .join(table_rank,'app.id_app','=','rank.id_app')
        .where({mail_user:middleware.getEmail(req)})
        .groupBy('app.id_app','app.name_app','app.description_app','app.link_app','user.name_user')
        .then(items => {
        if(items.length){
            res.json(items)
        } else {
            res.json(null)
        }
    })
        .catch(err => res.status(400).json({dbError: 'db error '+err }))
};

const getAppsWithRank = (req, res, db) => {

    db.select('app.id_app','name_app','description_app','name_user','link_app',db.raw('avg(rank) as rank'))
        .from(table_name)
        .join(table_user,'user.id_user','=','app.id_creator')
        .join(table_rank,'app.id_app','=','rank.id_app')
        .groupBy('app.id_app','name_app','description_app','name_user')
        .then(items => {
            if(items.length){
                res.json(items)
            } else {
                res.json(null)
            }
        })
        .catch(err => res.status(400).json({dbError: 'db error '+err }))
};

const getIdApp = (req, res, db) => {
    const {name_app} = req.params;
    db.select('id_app').from(table_name).where('name_app',name_app)
        .then(items => {
            if(items.length){
                res.json(items)
            } else {
                res.json(null)
            }
        })
        .catch(err => res.status(400).json({dbError: 'db error '+err}))
};

const insertApp = (req, res, db) => {
    const {name_app, id_creator, description_app,link_app } = req.body;

    db(table_name).insert({name_app,id_creator,description_app,link_app})
        .returning('*')
        .then(item => {
            res.json(item)
        })
        .catch(err => res.status(400).json({dbError: 'db error '+err}))
};

const updateApp = (req, res, db) => {
    const { id_app,name_app, description_app } = req.body;
    db(table_name).where({id_app}).update({name_app,description_app})
        .returning('*')
        .then(item => {
            res.json(item)
        })
        .catch(err => res.status(400).json({dbError: 'db error'}))
};

const deleteApp = (req, res, db) => {
    const { id_app } = req.body;
    db(table_name).where({id_app}).del()
        .then(() => {
            res.json({delete: 'true'})
        })
        .catch(err => res.status(400).json({dbError: 'db error'}))
};

const deleteUserApp = (req, res, db) => {
    const id_user = req.headers.id_user;
    const id_app = req.headers.id_app;
    db('user_app').where({id_user:id_user,id_app:id_app}).del()
        .then(() => {
            res.json({delete: 'true'})
        })
        .catch(err => res.status(400).json({dbError: 'db error '+err}))
};

const getAppsDownloadedByUser = (req,res,db) =>{
    db.select('app.id_app','app.name_app','app.description_app','app.link_app','user.name_user',db.raw('avg(rank) as rank'))
        .from(table_name)
        .join('user','app.id_creator','=','user.id_user')
        .join('user_app','app.id_app','=','user_app.id_app')
        .join(table_rank,'app.id_app','=','rank.id_app')
        .where({'user.mail_user':middleware.getEmail(req)})
        .groupBy('app.id_app','app.name_app','app.description_app','app.link_app','user.name_user','user.name_user')
        .then(items => {
            if(items.length){
                res.json(items)
            } else {
                res.json(null)
            }
        })
        .catch(err => res.status(400).json({dbError: 'db error '+err }))
};

const insertUserApp = (req,res,db) =>{
    const {id_user,id_app} = req.body;

    db('user_app').insert({id_user,id_app})
        .returning('*')
        .then(item => {
            res.json(item)
        })
        .catch(err => res.status(400).json({dbError: 'db error '+err}))
};


module.exports = {
    getApps,
    getIdApp,
    getAppsDownloadedByUser,
    getAppsWithRank,
    getAppsFromUser,
    insertApp,
    insertUserApp,
    updateApp,
    deleteApp,
    deleteUserApp
};