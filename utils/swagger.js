require('dotenv').config();
require('swagger-autogen')()('./utils/swagger-output.json', ['./server.js', './routes/index.js'], {
    swagger: '2.0',
    host: process.env.NODE_ENVIRONMENT === 'development' ? 'localhost:5341' : 'cmp-cse341-contacts.onrender.com',
    basePath: '/',
    schemes: process.env.NODE_ENVIRONMENT === 'development' ? ['http', 'https'] : ['https'],
    info: {
        version: '1.0.0',
        title: 'Contact341 REST API',
        description: 'CSE 341 Week 01/02 Contacts API'
    }
}).then(() => require('../server'));
