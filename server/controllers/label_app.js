const table_name = 'label_app';
const db = require('../database').db;

//get labels.js from app with id in req.params
const getLabelFromApp = (req, res) => {
    const id_app = req.params.id_app;
    console.log('id '+id_app);
    db.select('label_app.id_label','label.name_label').from(table_name)
        .where('app.id_app',id_app)
        .join('label','label.id_label','=','label_app.id_label')
        .join('app','app.id_app','=','label_app.id_app')
        .then(items => {
            if(items.length){
                res.json(items)
            } else {
                res.json(null)
            }
        })
        .catch(err => res.status(400).json({dbError: 'db error '+err}))
};

//add a label to an app
const insertLabelApp = (req, res) => {
    const { id_label, id_app } = req.body;
    db(table_name).insert({id_label,id_app})
        .returning('*')
        .then(item => {
            res.json(item)
        })
        .catch(err => res.status(400).json({dbError: 'db error'+err}))
};

//delete a label from an app
const deleteLabelApp = (req, res) => {
    const id_app = req.params.id_app;
    const id_label = req.params.id_label;
    db(table_name).where({id_label:id_label,id_app:id_app}).del()
        .then(() => {
            res.json({delete: 'true'})
        })
        .catch(err => res.status(400).json({dbError: 'db error '+err}))
};

const deleteAllLabelAppWithApp = (req, res,next) => {
    const id_app = req.params.id_app;
    db(table_name).where({id_app:id_app}).del()
        .then(
            next()
        )
        .catch(err => res.status(400).json({dbError: 'db error '+err}))
};

module.exports = {
    getLabelFromApp,
    insertLabelApp,
    deleteLabelApp,
    deleteAllLabelAppWithApp
}