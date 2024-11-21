const express = require('express');
const { getArticles, getUnservedArticle } = require('../controllers/articlesController');
const router = express.Router();

router.get('/', getArticles);
router.get('/unserved', getUnservedArticle);

module.exports = router;