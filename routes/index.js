const express = require('express');
const router = express.Router();
const controller = require('../controllers/get');

router.use('/api-docs', require('./docs'));
router.use('/contacts', require('./contacts'));
router.get('/', controller.index);

module.exports = router;
