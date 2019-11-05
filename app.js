import * as process from "custom-env";

const express = require('express');

// use process.env variables to keep private variables,
const env = require('.env.staging');

// Express Middleware
const helmet = require('helmet'); // creates headers that protect from attacks (security)
const bodyParser = require('body-parser'); // turns response into usable format
const cors = require('cors');  // allows/disallows cross-site communication
const morgan = require('morgan'); // logs requests

// db Connection w/ Heroku
// const db = require('knex')({
//   client: 'pg',
//   connection: {
//     connectionString: process.env.DATABASE_URL,
//     ssl: true,
//   }
// });

// db Connection w/ localhost
const db = require('knex')({
  client: 'pg',
  connection: process.env.DB_URL
});



// App
const app = express();

// App Middleware
const whitelist = [process.env.APP_HOST];
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
const label = require('./controllers/label');
const appli = require('./controllers/app');
const label_app = require('./controllers/label_app');

// App Routes - Auth

app.get('/label', (req, res) => label.getTableData(req, res, db));
app.post('/label', (req, res) => label.postTableData(req, res, db));
app.put('/label', (req, res) => label.putTableData(req, res, db));
app.delete('/label', (req, res) => label.deleteTableData(req, res, db));

app.get('/app', (req, res) => appli.getAppWithRank(req, res, db));
app.post('/app', (req, res) => appli.postTableData(req, res, db));
app.put('/app', (req, res) => appli.putTableData(req, res, db));
app.delete('/app', (req, res) => appli.deleteTableData(req, res, db));
app.get('/app/:name_app', (req, res) => appli.getIdTableData(req, res, db));

app.get('/label_app', (req, res) => label_app.getTableData(req, res, db));
app.post('/label_app', (req, res) => label_app.postTableData(req, res, db));
app.put('/label_app', (req, res) => label_app.putTableData(req, res, db));
app.delete('/label_app', (req, res) => label_app.deleteTableData(req, res, db));

// App Server Connection
app.listen(process.env.APP_PORT || 3000, () => {
  console.log(`app is running on port ${process.env.PORT || 3000}`)
});