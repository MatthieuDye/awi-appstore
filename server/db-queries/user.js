const table_name = 'user';
const db = require('../config/database').db;

/**
 * authenticateUser: query db to know if user exists thanks to his name in req, and insert it if not
 * @param req
 * @param res
 */
const authenticateUser =(req,res) => {
    db.select('id_user').from('user').where({name_user:req.name_user})
        .then(items => {
            if(items.length===0){
                insertUser(req,res);
            }
            res.status(200).send('Connected');
        })
        .catch(err => res.status(400).json({dbError: 'db error '+err}))
};

/**
 * getUserByName: get a user in db by his name identified in req
 * @param req
 * @param res
 */
const getUserByName = (req, res) => {
    db.select('*')
        .from(table_name)
        .where({name_user:req.name_user})
        .then(items => {
            if (items.length === 1) {
                res.json(items[0])
            } else {
                res.json({dataExists: 'false'})
            }
        })
        .catch(err => res.status(400).json({dbError: 'db error '+err}))
};

/**
 * hasAppOnDashboard: query db to know if a user has an app on his dashboard with user and app info in req.params
 * @param req
 * @param res
 */
const hasAppOnDashBoard = (req,res) =>{
    const id_user = req.params.id_user;
    const id_app = req.params.id_app;
    db.select('*')
        .from('user_app')
        .where({id_user:id_user,id_app:id_app})
        .then(items => {
            if(items.length===1){
                res.json({hasApp:true})
            }
            else{
                res.json({hasApp:false})
            }
        })
        .catch(err => res.status(400).json({dbError: 'db error '+err}))
};

/**
 * insertUser: insert a user in db with info in req
 * @param req
 * @param res
 */
const insertUser = (req, res) => {
    const name_user = req.name_user;
    const mail_user = name_user+'@etu.umontpellier.fr';
    db(table_name).insert({name_user,mail_user})
        .returning('*')
        .then(item => {
            res.json(item)
        })
        .catch(err => res.status(400).json({dbError: 'db error '+err}))
};



module.exports = {
    authenticateUser,
    getUserByName,
    insertUser,
    hasAppOnDashBoard
};