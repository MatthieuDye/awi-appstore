const table_name = 'label_app';

//get labels from app with id in req.params
const getLabelFromApp = (req, res, db) => {
    const {id_app} = req.params;
    db.select('label_app.id_label,label.name_label').from(table_name)
        .where({id_app:id_app})
        .join('app','app.id_app','=','label_app.id_app')
        .then(items => {
            if(items.length){
                res.json(items)
            } else {
                res.json({dataExists: 'false'})
            }
        })
        .catch(err => res.status(400).json({dbError: 'db error'}))
};

//add a label to an app
const insertLabelApp = (req, res, db) => {
    const { id_label, id_app } = req.body;
    db(table_name).insert({id_label,id_app})
        .returning('*')
        .then(item => {
            res.json(item)
        })
        .catch(err => res.status(400).json({dbError: 'db error'+err}))
};

//delete a label from an app
const deleteLabelApp = (req, res, db) => {
    const { id_label,id_app } = req.body;
    db(table_name).where({id_label:id_label,id_app:id_app}).del()
        .then(() => {
            res.json({delete: 'true'})
        })
        .catch(err => res.status(400).json({dbError: 'db error '+err}))
};

module.exports = {
    getLabelFromApp,
    insertLabelApp,
    deleteLabelApp
}