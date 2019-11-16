const express = require('express');
const router = express.Router();
const label = require('../controllers/label');

router.get('/', (req, res) => label.getLabels(req, res));

module.exports = router;