const express = require('express');
const { saveUserLocation, getUserLocation } = require('../controllers/userLocationController');
const router = express.Router();

router.post('/', saveUserLocation);
router.get('/', getUserLocation);

module.exports = router;
