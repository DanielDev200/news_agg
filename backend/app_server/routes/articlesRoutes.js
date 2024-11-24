const express = require('express');
const { getArticles, getSwappedArticle, createArticle } = require('../controllers/articlesController');
const router = express.Router();

router.get('/', getArticles);
router.post('/', createArticle);
router.get('/swap', getSwappedArticle);

module.exports = router;