const express = require('express');
const router = express.Router();
const withAuth = require('../middleware');
const label_app = require('../controllers/label_app');
const db = require('../database').db;

router.get('/:id_app',withAuth, (req, res) => label_app.getLabelFromApp(req, res, db));
router.post('/', withAuth,(req, res) => label_app.insertLabelApp(req, res, db));
router.delete('/', withAuth,(req, res) => label_app.deleteLabelApp(req, res, db));

module.exports = router;