const express = require('express');
const router = express.Router();
const middleware= require('../middleware');
const app = require('../controllers/app');
const label_app = require('../controllers/label_app');
const rank = require('../controllers/rank');

router.get('/', middleware.withAuth,(req, res) => app.getAppsWithRank(req, res));
router.post('/',middleware.withAuth, (req, res) => app.insertApp(req, res));
router.put('/',middleware.withAuth, (req, res) => app.updateApp(req, res));
router.delete('/',middleware.withAuth,
    middleware.verifyId,
    app.deleteAllUserAppWithApp,
    label_app.deleteAllLabelAppWithApp,
    rank.deleteAllRankWithApp,
    (req, res) => app.deleteApp(req, res));
router.get('/:name_app',middleware.withAuth, (req, res) => app.getIdApp(req, res));
router.get('/:id_app/labels',middleware.withAuth,(req,res) => label_app.getLabelFromApp(req,res));
router.post('/labels',middleware.withAuth,(req,res) =>label_app.insertLabelApp(req,res));
router.delete('/labels',middleware.withAuth,(req,res) =>label_app.deleteLabelApp(req,res));

router.get('/nbrank',middleware.withAuth,(req,res) => rank.getNbRating(req,res));



module.exports = router;