const table_app = 'app';
const table_rating = 'rating';
const table_user = 'user';
const db = require('../database').db;

/**
 * getAppsFromUser: get in database all apps created by user who send the request (find with token)
 * @param req: contains mail_user, mail from user who sent request
 * @param res: will contains results in json format
 */
const getAppsFromUser = (req,res) => {
    db.select('app.id_app','app.name_app','app.description_app','app.link_app','user.id_user','user.name_user',db.raw('avg(rating) as rating'))
        .from(table_app)
        .join(table_user,'app.id_creator','=','user.id_user')
        .join(table_rating,'app.id_app','=','rating.id_app')
        //select only apps created by user with mail in req
        .where({mail_user:req.mail_user})
        .groupBy('app.id_app','app.name_app','app.description_app','app.link_app','user.name_user','user.id_user')
        .then(items => {
        if(items.length){
            //put in res apps created by user
            res.json(items)
        } else {
            //put null in res if no apps
            res.json(null)
        }
    })
        .catch(err => res.status(400).json({dbError: 'db error '+err }))
};

/**
 * getApps: get all apps in database
 * @param req
 * @param res: will contains results in json format
 */
const getApps = (req, res) => {

    db.select('app.id_app','name_app','description_app','id_creator','name_user','link_app',db.raw('avg(rating) as rating'))
        .from(table_app)
        .join(table_user,'user.id_user','=','app.id_creator')
        .join(table_rating,'app.id_app','=','rating.id_app')
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

/**
 * getIdApp: get in database the id of app with name given
 * @param req: contains params.name_app, the name of app we want the id
 * @param res: will contains id_app in json format
 */
const getIdApp = (req, res) => {
    const {name_app} = req.params;
    db.select('id_app').from(table_app).where('name_app',name_app)
        .then(items => {
            if(items.length){
                res.json(items)
            } else {
                res.json(null)
            }
        })
        .catch(err => res.status(400).json({dbError: 'db error '+err}))
};

/**
 * insertApp: insert an app on database
 * @param req: contains req.body with all app info from app to insert in db
 * @param res: will have the item added in json format
 */
const insertApp = (req, res) => {
    const {name_app, id_creator, description_app,link_app } = req.body;

    db(table_app).insert({name_app,id_creator,description_app,link_app})
        .returning('*')
        .then(item => {
            res.json(item)
        })
        .catch(err => res.status(400).json({dbError: 'db error '+err}))
};

/**
 * updateApp: edit an app on database
 * @param req: req.body contains info of the app to edit
 * @param res: will have the app edited in json
 */
const updateApp = (req, res) => {
    const { id_app,name_app, description_app,link_app } = req.body;
    db(table_app).where({id_app}).update({name_app,description_app,link_app})
        .returning('*')
        .then(item => {
            res.json(item)
        })
        .catch(err => res.status(400).json({dbError: 'db error '+err}))
};

/**
 * deleteApp: delete an app on database
 * @param req: params.id_app is the id of app to delete
 * @param res
 */
const deleteApp = (req, res) => {
    const id_app  = req.params.id_app;
    db(table_app).where({id_app:id_app}).del()
        .then(() => {
            res.json({delete: 'true'})
        })
        .catch(err => res.status(400).json({dbError: 'db error '+err}))
};

/**
 * deleteUserApp: remove association between user and app in database (remove from dashboard)
 * @param req: params.id_user & params.id_app
 * @param res
 */
const deleteUserApp = (req, res) => {
    const id_user = req.params.id_user;
    const id_app = req.params.id_app;

    db('user_app').where({id_user:id_user,id_app:id_app}).del()
        .then(() => {
            res.json({delete: 'true'})
        })
        .catch(err => res.status(400).json({dbError: 'db error '+err}))
};

/**
 * deleteAllUserAppWithApp: delete all associations user-app for an app
 * this function is executed before deleting an app, it goes to this step by next param
 * @param req: params.id_app, id_app of app we want to remove all associations
 * @param res
 * @param next: execute the next request
 */
const deleteAllUserAppWithApp = (req,res,next) =>{
    const id_app = req.params.id_app;

    db('user_app').where({id_app:id_app}).del()
        .then(() => {
            next();
        })
        .catch(err => res.status(400).json({dbError: 'db error '+err}))
};
/**
 * getUserAppsOnDashBoard: get all apps on dashboard of user from database
 * @param req: req.mail, mail of user who sent request
 * @param res: apps in json
 */
const getUserAppsOnDashBoard = (req,res) =>{
    db.select('app.id_app','app.name_app','app.description_app','app.link_app','creator.name_user',db.raw('avg(rating) as rating'))
        .from(table_app)
        .join('user AS creator','app.id_creator','=','creator.id_user')
        .join('user_app','app.id_app','=','user_app.id_app')
        .join('user','user_app.id_user','=','user.id_user')
        .join(table_rating,'app.id_app','=','rating.id_app')
        .where({'user.mail_user':req.mail_user})
        .groupBy('app.id_app','app.name_app','app.description_app','app.link_app','user.name_user','creator.name_user')
        .then(items => {
            if(items.length){
                res.json(items)
            } else {
                res.json(null)
            }
        })
        .catch(err => res.status(400).json({dbError: 'db error '+err }))
};

/**
 * insertUserApp: in
 * @param req
 * @param res
 */
const insertUserApp = (req,res) =>{
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
    getUserAppsOnDashBoard,
    getAppsFromUser,
    insertApp,
    insertUserApp,
    updateApp,
    deleteApp,
    deleteUserApp,
    deleteAllUserAppWithApp
};