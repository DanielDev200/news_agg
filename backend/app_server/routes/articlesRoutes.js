const express = require('express');
const { getArticles } = require('../controllers/articlesController');
const router = express.Router();

router.get('/', getArticles);

module.exports = router;