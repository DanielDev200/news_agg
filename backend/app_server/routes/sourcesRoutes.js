const express = require('express');
const { getSources, createSource, updateSource } = require('../controllers/sourcesController');
const router = express.Router();

router.get('/', getSources);
router.post('/', createSource);
router.put('/:id', updateSource);

module.exports = router;