
require('dotenv').config();
const express = require('express');

// use process.env variables to keep private variables,

// Express Middleware
const helmet = require('helmet'); // creates headers that protect from attacks (security)
const bodyParser = require('body-parser'); // turns response into usable format
const cors = require('cors');  // allows/disallows cross-site communication
const morgan = require('morgan'); // logs requests

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




// App
const app = express();
// App Middleware
const whitelist = process.env.NODE_ENV==='production'?[process.env.APP_FRONT]:[process.env.APP_FRONT_LOCAL];
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

const middleware = require('./middleware');

// App Routes

const apps_routes = require('./routes/apps');
const labels_routes = require('./routes/labels');
const users_routes = require('./routes/users');
app.use('/app',apps_routes);
app.use('/label',labels_routes);
app.use('/user',users_routes);

app.get('/checkToken',middleware.withAuth, function(req, res) {
  res.sendStatus(200);
});
// App Server Connection
app.listen(process.env.APP_PORT || 5000, () => {
  console.log(`app is running on port ${process.env.PORT || 5000}`)
});