const table_name = 'label';

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
    const { name_label } = req.body
    const added = new Date()
    db(table_name).insert({name_label})
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
    postTableData,
    putTableData,
    deleteTableData
}