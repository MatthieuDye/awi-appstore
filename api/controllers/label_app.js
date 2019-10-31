const table_name = 'label_app';

const getTableData = (req, res, db) => {
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

const postTableData = (req, res, db) => {
    const { id_label, id_app } = req.body
    db(table_name).insert({id_label,id_app})
        .returning('*')
        .then(item => {
            res.json(item)
        })
        .catch(err => res.status(400).json({dbError: 'db error'+err}))
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
    postTableData,
    putTableData,
    deleteTableData
}