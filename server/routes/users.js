const express = require('express');
const router = express.Router();
const middleware = require('../middleware');
const user = require('../controllers/user');
const app = require('../controllers/app');
const rank = require('../controllers/rank');
const db = require('../database').db;

router.get('/',middleware.withAuth,(req,res) => user.getUserByMail(req,res,db));
router.post('/authenticate', (req,res) => user.getUser(req,res,db));
router.get('/myapps',middleware.withAuth,(req,res) => app.getAppsFromUser(req,res,db));
router.get('/mydownloadedapps',middleware.withAuth,(req,res) => app.getAppsDownloadedByUser(req,res,db));
router.post('/mydownloadedapps',middleware.withAuth,middleware.verifyId,(req,res) => app.insertUserApp(req,res,db));
router.delete('/mydownloadedapps',middleware.withAuth,middleware.verifyId,(req,res) => app.deleteUserApp(req,res,db));
router.get('/:id_user/hasdownloadedapp/:id_app',middleware.withAuth,(req,res) => user.hasDownloadedApp(req,res,db));
router.post('/app/rank',middleware.withAuth,(req,res) => rank.insertRank(req,res,db));
router.put('/app/rank',middleware.withAuth,(req,res) => rank.updateRank(req,res,db));

module.exports = router;
