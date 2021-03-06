const express = require('express');
const router = express.Router();
const label = require('../db-queries/label');

//get all labels
router.get('/', (req, res) => label.getLabels(req, res));

module.exports = router;