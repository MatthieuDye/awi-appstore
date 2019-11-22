const table_name = 'label_app';
const db = require('../config/database').db;


/**
 *getLabelFromApp: query db to have all labels from app with id in req.params
 * @param req
 * @param res
 */
const getLabelFromApp = (req, res) => {
    const id_app = req.params.id_app;
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

/**
 * insertLabelApp: insert in db association between a label and an app identified in req.body
 * @param req
 * @param res
 */
const insertLabelApp = (req, res) => {
    const { id_label, id_app } = req.body;
    db(table_name).insert({id_label,id_app})
        .returning('*')
        .then(item => {
            res.json(item)
        })
        .catch(err => res.status(400).json({dbError: 'db error'+err}))
};

/**
 * deleteLabelApp: delete in db association between a label and an app identified in req.params
 * @param req
 * @param res
 */
const deleteLabelApp = (req, res) => {
    const id_app = req.params.id_app;
    const id_label = req.params.id_label;
    db(table_name).where({id_label:id_label,id_app:id_app}).del()
        .then(() => {
            res.json({delete: 'true'})
        })
        .catch(err => res.status(400).json({dbError: 'db error '+err}))
};

/**
 * deleteAllLabelAppWithApp: delete in db association between an app identified in req.params and all its labels
 * @param req
 * @param res
 * @param next
 */
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