const table_name = 'user';
const middleware = require('../middleware');
const db = require('../database').db;

const authenticateUser =(req,res) => {
    const authorization = req.headers.authorization;
    const token = authorization.slice(7,authorization.length);
    db.select('id_user').from('user').where({id_user:req.id_user})
        .then(items => {
            if(items.length===0){
                insertUser(req,res);
            }
            res.send(token);
        })
        .catch(err => res.status(400).json({dbError: 'db error '+err}))
};

const getUsers = (req, res) => {
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

const getUserByMail = (req, res) => {
    db.select('*')
        .from(table_name)
        .where({mail_user:req.mail_user})
        .then(items => {
            if (items.length === 1) {
                res.json(items[0])
            } else {
                res.json({dataExists: 'false'})
            }
        })
        .catch(err => res.status(400).json({dbError: 'db error '+err}))
};

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

const getUser = (req, res) => {
    const {mail_user,password_user} = req.body;
    db.select('id_user','name_user','mail_user')
        .from(table_name)
        .where({
            mail_user: mail_user,
            password_user:  password_user
        })
        .then(items => {
            if(items.length===1){
                const id_user = items[0].id_user;
                const name_user = items[0].name_user;
                const payload = {id_user,name_user,mail_user};
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

const insertUser = (req, res) => {
    const id_user = req.id_user;
    const name_user = req.name_user;
    const mail_user = req.mail_user;
    db(table_name).insert({id_user,name_user,mail_user})
        .returning('*')
        .then(item => {
            res.json(item)
        })
        .catch(err => res.status(400).json({dbError: 'db error '+err}))
};

const updateUser = (req, res) => {
    const { name_user } = req.body;
    db(table_name).where({mail_user:middleware.getEmail(req)}).update({name_user:name_user})
        .returning('*')
        .then(item => {
            res.json(item)
        })
        .catch(err => res.status(400).json({dbError: 'db error '+err}))
};

const deleteUser = (req, res) => {
    const { id_user } = req.body;
    db(table_name).where({id_user}).del()
        .then(() => {
            res.json({delete: 'true'})
        })
        .catch(err => res.status(400).json({dbError: 'db error'}))
};

module.exports = {
    authenticateUser,
    getUsers,
    getUserByMail,
    getUser,
    insertUser,
    updateUser,
    deleteUser,
    hasAppOnDashBoard
};