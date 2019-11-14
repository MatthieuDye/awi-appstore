const express = require('express');
const router = express.Router();
const middleware = require('../middleware');
const label_app = require('../controllers/label_app');
const db = require('../database').db;

router.get('/:id_app',middleware.withAuth, (req, res) => label_app.getLabelFromApp(req, res, db));
router.post('/', middleware.withAuth,(req, res) => label_app.insertLabelApp(req, res, db));
router.delete('/', middleware.withAuth,(req, res) => label_app.deleteLabelApp(req, res, db));

module.exports = router;