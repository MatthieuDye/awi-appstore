const express = require('express');
const router = express.Router();
const middleware= require('../middleware');
const app = require('../controllers/app');
const label_app = require('../controllers/label_app');

//get all apps
router.get('/', middleware.withAuth,(req, res) => app.getApps(req, res));
//add an app
router.post('/',middleware.withAuth, (req, res) => app.insertApp(req, res));
//edit an app
router.put('/',middleware.withAuth, (req, res) => app.updateApp(req, res));
//get id of app with given name
router.get('/:name_app',middleware.withAuth, (req, res) => app.getIdApp(req, res));
//get labels of an app
router.get('/:id_app/labels',middleware.withAuth,(req,res) => label_app.getLabelFromApp(req,res));
//add a label to an app
router.post('/labels',middleware.withAuth,(req,res) =>label_app.insertLabelApp(req,res));
//remove a label from an app
router.delete('/:id_app/labels/:id_label',middleware.withAuth,(req,res) =>label_app.deleteLabelApp(req,res));



module.exports = router;