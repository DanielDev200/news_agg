const express = require('express');
const { recordArticleClick } = require('../controllers/userArticleClickController');
const router = express.Router();

router.post('/', recordArticleClick);

module.exports = router;
