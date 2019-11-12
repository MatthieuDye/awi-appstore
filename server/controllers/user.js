const table_name = 'user';
require('dotenv').config();
const jwt = require('jsonwebtoken');

const getTableData = (req, res, db) => {
    db.select('*').from(table_name)
        .then(items => {
            if(items.length){
                res.json(items)
            } else {
                res.json({dataExists: 'false'})
            }
        })
        .catch(err => res.status(400).json({dbError: 'db error '+err}))
}

const getUserByMail = (req, res, db) => {
    const {email} = req.params;
    const token = req.headers.authorization
    const email_decrypted = jwt.verify(token, process.env.SECRET_TOKEN, function(err, decoded) {
        if (err) {
            return res.status(401).send('Unauthorized: Invalid token');
        } else {
            return decoded.email;
        }
    });
    console.log(email_decrypted);
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
}

const getUserData = (req, res, db) => {
    const {email,password} = req.body
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
}

const postTableData = (req, res, db) => {
    const { id_user,name_user,mail_user } = req.body
    const added = new Date()
    db(table_name).insert({id_user,name_user,mail_user})
        .returning('*')
        .then(item => {
            res.json(item)
        })
        .catch(err => res.status(400).json({dbError: 'db error'}))
}

const putTableData = (req, res, db) => {
    const { id_label,name_label } = req.body
    db(table_name).where({id_label}).update({name_label})
        .returning('*')
        .then(item => {
            res.json(item)
        })
        .catch(err => res.status(400).json({dbError: 'db error'}))
}

const deleteTableData = (req, res, db) => {
    const { id_label } = req.body
    db(table_name).where({id_label}).del()
        .then(() => {
            res.json({delete: 'true'})
        })
        .catch(err => res.status(400).json({dbError: 'db error'}))
}

module.exports = {
    getTableData,
    getUserByMail,
    getUserData,
    postTableData,
    putTableData,
    deleteTableData
}