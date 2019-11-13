const express = require('express');
const router = express.Router();
const withAuth = require('../middleware');
const app = require('../controllers/app');
const db = require('../database').db;

router.get('/', withAuth,(req, res) => app.getAppsWithRank(req, res, db));
router.post('/',withAuth, (req, res) => app.insertApp(req, res, db));
router.put('/',withAuth, (req, res) => app.updateApp(req, res, db));
router.delete('/',withAuth, (req, res) => app.deleteApp(req, res, db));
router.get('/:name_app',withAuth, (req, res) => app.getIdApp(req, res, db));

module.exports = router;