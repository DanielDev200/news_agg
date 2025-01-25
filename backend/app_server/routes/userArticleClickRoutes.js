const express = require('express');
const { recordArticleClick, fetchUserArticlesByDate } = require('../controllers/userArticleClickController');
const router = express.Router();

router.post('/', recordArticleClick);
router.get('/by-user-and-date', fetchUserArticlesByDate);

module.exports = router;
