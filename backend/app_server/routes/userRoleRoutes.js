
const express = require('express');
const {  getUserRole } = require('../controllers/userRoleController');
const router = express.Router();

router.get('/:userId', getUserRole);

module.exports = router;