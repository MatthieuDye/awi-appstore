const table_name = 'label';
const db = require('../database').db;

const getLabels = (req, res) => {
    db.select('*').from(table_name)
        .then(items => {
            if(items.length){
                res.json(items)
            } else {
                res.json({dataExists: 'false'})
            }
        })
        .catch(err => res.status(400).json({dbError: 'db error'}))
}

const insertLabel = (req, res) => {
    const { name_label } = req.body;
    db(table_name).insert({name_label})
        .returning('*')
        .then(item => {
            res.json(item)
        })
        .catch(err => res.status(400).json({dbError: 'db error'}))
}

const updateLabel = (req, res) => {
    const { id_label,name_label } = req.body
    db(table_name).where({id_label}).update({name_label})
        .returning('*')
        .then(item => {
            res.json(item)
        })
        .catch(err => res.status(400).json({dbError: 'db error'}))
}

const deleteLabel = (req, res) => {
    const { id_label } = req.body
    db(table_name).where({id_label}).del()
        .then(() => {
            res.json({delete: 'true'})
        })
        .catch(err => res.status(400).json({dbError: 'db error'}))
}

module.exports = {
    getLabels,
    insertLabel,
    updateLabel,
    deleteLabel
}