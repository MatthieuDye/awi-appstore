const table_name = 'user';
require('dotenv').config();
const jwt = require('jsonwebtoken');

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
    const token = req.headers.authorization;
    const email_decrypted = jwt.verify(token, process.env.SECRET_TOKEN, function(err, decoded) {
        if (err) {
            return res.status(401).send('Unauthorized: Invalid token');
        } else {
            return decoded.email;
        }
    });
    db.select('*')
        .from(table_name)
        .where({mail_user:email_decrypted})
        .then(items => {
            if (items.length === 1) {
                res.json(items[0])
            } else {
                res.json({dataExists: 'false'})
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
};

const insertUser = (req, res, db) => {
    const { id_user,name_user,mail_user } = req.body;
    db(table_name).insert({id_user,name_user,mail_user})
        .returning('*')
        .then(item => {
            res.json(item)
        })
        .catch(err => res.status(400).json({dbError: 'db error'}))
};

const updateUser = (req, res, db) => {
    const { id_label,name_label } = req.body;
    db(table_name).where({id_label}).update({name_label})
        .returning('*')
        .then(item => {
            res.json(item)
        })
        .catch(err => res.status(400).json({dbError: 'db error'}))
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
    deleteUser
};