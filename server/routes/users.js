const express = require('express');
const router = express.Router();
const middleware = require('../middleware');
const user = require('../controllers/user');
const app = require('../controllers/app');
const db = require('../database').db;

router.get('/',middleware.withAuth,(req,res) => user.getUserByMail(req,res,db));
router.post('/authenticate', (req,res) => user.getUser(req,res,db));
router.get('/myapps',middleware.withAuth,(req,res) => app.getAppsFromUser(req,res,db));
router.get('/mydownloadedapps',middleware.withAuth,(req,res) => app.getAppsDownloadedByUser(req,res,db));
router.post('/mydownloadedapps/add',middleware.withAuth,(req,res) => app.insertUserApp(req,res,db));
router.delete('/mydownloadedapps/delete',middleware.withAuth,(req,res) => app.deleteUserApp(req,res,db));
router.get('/:id_user/hasdownloadedapp/:id_app',middleware.withAuth,(req,res) => user.hasDownloadedApp(req,res,db));


module.exports = router;
