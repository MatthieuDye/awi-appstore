require('dotenv').config();

// db Connection with knex
const db = process.env.NODE_ENV==='production'?
    require('knex')({
        client: 'pg',
        connection: process.env.DB_URL
    }):
    require('knex')({
        client: 'pg',
        connection: {
            host : process.env.HOST_LOCAL_DB,
            user : process.env.USER_LOCAL_DB,
            password : process.env.PASSWORD_LOCAL_DB,
            database : process.env.LOCAL_DB
        }
    });

module.exports = {
    db
};