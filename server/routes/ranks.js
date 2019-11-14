const express = require('express');
const router = express.Router();
const middleware = require('../middleware');
const rank = require('../controllers/rank');
const db = require('../database').db;

router.post('/',middleware.withAuth,(req,res) => rank.insertRank(req,res,db));

module.exports = router;