const express = require('express');
const router = express.Router();
const middleware = require('../middleware');
const label = require('../controllers/label');
const db = require('../database').db;

router.get('/', (req, res) => label.getLabels(req, res, db));

module.exports = router;