const table_name = 'rank';

const postTableData = (req, res, db) => {
    const { id_user, id_app,rank } = req.body
    db(table_name).insert({id_user,id_app,rank})
        .returning('*')
        .then(item => {
            res.json(item)
        })
        .catch(err => res.status(400).json({dbError: 'db error '+err}))
}

const putTableData = (req, res, db) => {
    const { id_user,id_app,rank } = req.body
    db(table_name).where({
        id_user: id_user,
        id_app:  id_app
    }).update({rank})
        .returning('*')
        .then(item => {
            res.json(item)
        })
        .catch(err => res.status(400).json({dbError: 'db error'}))
}

const deleteTableData = (req, res, db) => {
    const { id_user,id_app } = req.body
    db(table_name).where({
        id_user: id_user,
        id_app:  id_app
    }).del()
        .then(() => {
            res.json({delete: 'true'})
        })
        .catch(err => res.status(400).json({dbError: 'db error'}))
}

module.exports = {
    postTableData,
    putTableData,
    deleteTableData
}