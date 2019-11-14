const table_name = 'user';
const middleware = require('../middleware');

const getUsers = (req, res, db) => {
    db.select('*').from(table_name)
        .then(items => {
            if(items.length){
                res.json(items)
            } else {
                res.json({dataExists: 'false'})
            }
        })
        .catch(err => res.status(400).json({dbError: 'db error '+err}))
};

const getUserByMail = (req, res, db) => {
    db.select('*')
        .from(table_name)
        .where({mail_user:middleware.getEmail(req)})
        .then(items => {
            if (items.length === 1) {
                res.json(items[0])
            } else {
                res.json({dataExists: 'false'})
            }
        })
        .catch(err => res.status(400).json({dbError: 'db error '+err}))
};

const hasDownloadedApp = (req,res, db) =>{
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

const getUser = (req, res, db) => {
    const {email,password} = req.body;
    db.select('id_user','name_user','mail_user')
        .from(table_name)
        .where({
            mail_user: email,
            password_user:  password
        })
        .then(items => {
            if(items.length===1){
                const payload = {email};
                const jwt = require('jsonwebtoken');
                //Issue token
                const token = jwt.sign(payload, process.env.SECRET_TOKEN, {
                    expiresIn: '1h'
                });
                res.send(token);
            }
            else{
                res.json({error:'incorrect mail or password'})
            }
        })
        .catch(err => res.status(400).json({dbError: 'db error '+err}))
};

const insertUser = (req, res, db) => {
    const { id_user,name_user,mail_user } = req.body;
    db(table_name).insert({id_user,name_user,mail_user})
        .returning('*')
        .then(item => {
            res.json(item)
        })
        .catch(err => res.status(400).json({dbError: 'db error '+err}))
};

const updateUser = (req, res, db) => {
    const { name_user } = req.body;
    db(table_name).where({mail_user:middleware.getEmail(req)}).update({name_user:name_user})
        .returning('*')
        .then(item => {
            res.json(item)
        })
        .catch(err => res.status(400).json({dbError: 'db error '+err}))
};

const deleteUser = (req, res, db) => {
    const { id_user } = req.body;
    db(table_name).where({id_user}).del()
        .then(() => {
            res.json({delete: 'true'})
        })
        .catch(err => res.status(400).json({dbError: 'db error'}))
};

module.exports = {
    getUsers,
    getUserByMail,
    getUser,
    insertUser,
    updateUser,
    deleteUser,
    hasDownloadedApp
};