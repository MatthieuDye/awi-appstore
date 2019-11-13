const express = require('express');
const router = express.Router();
const withAuth = require('../middleware');
const user = require('../controllers/user');
const db = require('../database').db;

router.get('/idUser/:mail',withAuth,(req,res) => user.getUserByMail(req,res,db));
router.post('/authenticate', (req,res) => user.getUser(req,res,db));

module.exports = router;
