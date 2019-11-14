const express = require('express');
const router = express.Router();
const middleware= require('../middleware');
const app = require('../controllers/app');
const db = require('../database').db;

router.get('/', middleware.withAuth,(req, res) => app.getAppsWithRank(req, res, db));
router.post('/',middleware.withAuth, (req, res) => app.insertApp(req, res, db));
router.put('/',middleware.withAuth, (req, res) => app.updateApp(req, res, db));
router.delete('/',middleware.withAuth, (req, res) => app.deleteApp(req, res, db));
router.get('/:name_app',middleware.withAuth, (req, res) => app.getIdApp(req, res, db));
router.get('/')

module.exports = router;