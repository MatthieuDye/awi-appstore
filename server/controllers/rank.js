const table_name = 'rank';

const insertRank = (req, res, db) => {
    const { id_user, id_app,rank } = req.body;
    db(table_name).insert({id_user,id_app,rank})
        .returning('*')
        .then(item => {
            res.json(item)
        })
        .catch(err => res.status(400).json({dbError: 'db error '+err}))
};

const updateRank = (req, res, db) => {
    const { id_user,id_app,rank } = req.body;
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

const deleteRank = (req, res, db) => {
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
    insertRank,
    updateRank,
    deleteRank
}