require('dotenv').config();
// db Connection
const db = process.env.NODE_ENV==='production'?
    require('knex')({
        client: 'pg',
        connection: process.env.DB_URL
    }):
    require('knex')({
        client: 'pg',
        connection: {
            host : '127.0.0.1',
            user : 'castelstore_user',
            password : 'dB604Tn',
            database : 'castelstore'
        }
    });

module.exports = {
    db
};