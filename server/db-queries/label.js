const table_name = 'label';
const db = require('../database').db;

/**
 * getLabels: query db to have all existing labels
 * @param req
 * @param res
 */
const getLabels = (req, res) => {
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

module.exports = {
    getLabels
}