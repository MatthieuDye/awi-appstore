const express = require('express');
const router = express.Router();
const middleware= require('../middleware');
const app = require('../controllers/app');
const label_app = require('../controllers/label_app');
const db = require('../database').db;

router.get('/', middleware.withAuth,(req, res) => app.getAppsWithRank(req, res, db));
router.post('/',middleware.withAuth, (req, res) => app.insertApp(req, res, db));
router.put('/',middleware.withAuth, (req, res) => app.updateApp(req, res, db));
router.delete('/',middleware.withAuth, (req, res) => app.deleteApp(req, res, db));
router.get('/:name_app',middleware.withAuth, (req, res) => app.getIdApp(req, res, db));
router.get('/:id_app/labels',middleware.withAuth,(req,res) => label_app.getLabelFromApp(req,res,db));
router.post('/labels',middleware.withAuth,(req,res) =>label_app.insertLabelApp(req,res,db));
router.delete('/labels',middleware.withAuth,(req,res) =>label_app.deleteLabelApp(req,res,db));

module.exports = router;