const express = require('express');
const router = express.Router();
const middleware = require('../config/middleware');
const user = require('../db-queries/user');
const app = require('../db-queries/app');
const label_app = require('../db-queries/label_app');
const rating = require('../db-queries/rating');

//get user who called the route
router.get('/',middleware.withAuth,(req,res) => user.getUserByName(req,res));

//verify that user exists in db and add it if not
router.get('/authenticate', middleware.withAuth,(req,res) => user.authenticateUser(req,res));

//get apps created by a user
router.get('/myapps',middleware.withAuth,(req,res) => app.getAppsFromUser(req,res));

//get apps added on dashboard by a user
router.get('/myappsondashboard',middleware.withAuthWithoutVerify,(req,res) => app.getUserAppsOnDashBoard(req,res));

//add an app to a user dashboard
router.post('/myappsondashboard',middleware.withAuth,middleware.verifyId,(req,res) => app.insertUserApp(req,res));

//remove an app on a user dashboard
router.delete('/:id_user/myappsondashboard/:id_app',middleware.withAuth,(req,res) => app.deleteUserApp(req,res));

router.delete('/name/:name_user/myappsondashboard/:id_app',middleware.withAuthWithoutVerify,(req,res) => app.deleteUserApp(req,res));

//say if an app is on user dashboard
router.get('/:id_user/hasappondashboard/:id_app',middleware.withAuth,(req,res) => user.hasAppOnDashBoard(req,res));

//add a rating for user on an app
router.post('/app/rating',middleware.withAuth,(req,res) => rating.insertRating(req,res));

//edit rating for user on an app
router.put('/app/rating',middleware.withAuth,(req,res) => rating.updateRating(req,res));

//say if user has rated app
router.get('/:id_user/app/:id_app/rating',middleware.withAuth,(req,res) => rating.hasRating(req,res));

//delete an app, before doing that, delete in db data associated to this app
router.delete('/:id_user/app/:id_app',middleware.withAuth,
    middleware.verifyId,
    app.deleteAllUserAppWithApp,
    label_app.deleteAllLabelAppWithApp,
    rating.deleteAllRatingWithApp,
    (req, res) => app.deleteApp(req, res));

//same task but with name_user instead of id_user in params
router.delete('/name/:name_user/app/:id_app',middleware.withAuth,
    middleware.verifyId,
    app.deleteAllUserAppWithApp,
    label_app.deleteAllLabelAppWithApp,
    rating.deleteAllRatingWithApp,
    (req, res) => app.deleteApp(req, res));

module.exports = router;
