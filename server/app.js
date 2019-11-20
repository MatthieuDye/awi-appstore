
require('dotenv').config();
const express = require('express');

// Express Middleware
const helmet = require('helmet'); // creates headers that protect from attacks (security)
const bodyParser = require('body-parser'); // turns response into usable format
const cors = require('cors');  // allows/disallows cross-site communication
const morgan = require('morgan'); // logs requests

// App
const app = express();

// Allowed URL to send request to this server
const whitelist = [process.env.NODE_ENV==='production'?process.env.APP_FRONT:process.env.APP_FRONT_LOCAL,"https://mydash.igpolytech.fr","https://mydash-dev.igpolytech.fr","http://localhost:3000"];

//verify that URL requester is in the whitelist, if not, send it an error message
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
app.use(morgan('combined'));

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