const express = require('express');
const router = express.Router();

const controller = require('../controllers/users');

router.get('/:id', controller.getUser);
router.get('/', controller.getAll);

module.exports = router;
