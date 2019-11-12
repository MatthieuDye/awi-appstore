
require('dotenv').config();
const express = require('express');

// use process.env variables to keep private variables,

// Express Middleware
const helmet = require('helmet'); // creates headers that protect from attacks (security)
const bodyParser = require('body-parser'); // turns response into usable format
const cors = require('cors');  // allows/disallows cross-site communication
const morgan = require('morgan'); // logs requests
const cookieParser = require('cookie-parser');

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
    })




// App
const app = express();
app.use(cookieParser());
// App Middleware
const whitelist = process.env.NODE_EV==='production'?[process.env.APP_FRONT]:[process.env.APP_FRONT_LOCAL]
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
};
app.use(helmet());
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(morgan('combined')); // use 'tiny' or 'combined'

// Controllers - aka, the db queries
const user = require('./controllers/user');
const label = require('./controllers/label');
const appli = require('./controllers/app');
const label_app = require('./controllers/label_app');
const rank = require('./controllers/rank');
const withAuth = require('./middleware');

// App Routes - Auth

app.post('/authenticate', (req,res) => user.getUserData(req,res,db));
app.get('/idUser/:mail',withAuth,(req,res) => user.getUserByMail(req,res,db));

app.get('/label', (req, res) => label.getTableData(req, res, db));
app.post('/label', (req, res) => label.postTableData(req, res, db));
app.put('/label', (req, res) => label.putTableData(req, res, db));
app.delete('/label', (req, res) => label.deleteTableData(req, res, db));

app.get('/app', withAuth,(req, res) => appli.getAppWithRank(req, res, db));
app.post('/app',withAuth, (req, res) => appli.postTableData(req, res, db));
app.put('/app',withAuth, (req, res) => appli.putTableData(req, res, db));
app.delete('/app',withAuth, (req, res) => appli.deleteTableData(req, res, db));
app.get('/app/:name_app',withAuth, (req, res) => appli.getIdTableData(req, res, db));

app.get('/label_app',withAuth, (req, res) => label_app.getTableData(req, res, db));
app.post('/label_app', withAuth,(req, res) => label_app.postTableData(req, res, db));
app.put('/label_app', withAuth,(req, res) => label_app.putTableData(req, res, db));
app.delete('/label_app', withAuth,(req, res) => label_app.deleteTableData(req, res, db));

app.post('/rank',withAuth,(req,res) => rank.postTableData(req,res,db));

app.get('/checkToken',withAuth, function(req, res) {
  res.sendStatus(200);
});
// App Server Connection
app.listen(process.env.APP_PORT || 5000, () => {
  console.log(`app is running on port ${process.env.PORT || 5000}`)
});