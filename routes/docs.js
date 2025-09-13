const swaggerUi = require('swagger-ui-express');
const router = require('express').Router();

router.use('/', swaggerUi.serve, swaggerUi.setup(require('../utils/swagger-output.json')));

module.exports = router;
