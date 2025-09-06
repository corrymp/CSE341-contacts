const express = require('express');
const router = express.Router();

const getController = require('../controllers/get');
//const postController = require('../controllers/post');
//const putController = require('../controllers/put');
//const deleteController = require('../controllers/delete');

router.use('/users', require('./users'));

router.get('/', getController.index);
//router.post('/', postController.index);
//router.put('/', putController.index);
//router.delete('/', deleteController.index);

module.exports = router;
