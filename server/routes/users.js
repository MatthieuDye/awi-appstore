const express = require('express');
const router = express.Router();
const middleware = require('../middleware');
const user = require('../controllers/user');
const app = require('../controllers/app');
const rank = require('../controllers/rank');

router.get('/',middleware.withAuth,(req,res) => user.getUserByMail(req,res));
router.post('/authenticate', (req,res) => user.getUser(req,res));
router.get('/myapps',middleware.withAuth,(req,res) => app.getAppsFromUser(req,res));
router.get('/mydownloadedapps',middleware.withAuth,(req,res) => app.getAppsDownloadedByUser(req,res));
router.post('/mydownloadedapps',middleware.withAuth,middleware.verifyId,(req,res) => app.insertUserApp(req,res));
router.delete('/mydownloadedapps',middleware.withAuth,middleware.verifyId,(req,res) => app.deleteUserApp(req,res));
router.get('/:id_user/hasdownloadedapp/:id_app',middleware.withAuth,(req,res) => user.hasDownloadedApp(req,res));
router.post('/app/rank',middleware.withAuth,(req,res) => rank.insertRank(req,res));
router.put('/app/rank',middleware.withAuth,(req,res) => rank.updateRank(req,res));
router.get('/app/rank',middleware.withAuth,(req,res) => rank.hasRank(req,res));

module.exports = router;
