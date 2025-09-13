require('swagger-autogen')()('./swagger-output.json', ['./server.js', './routes/index.js'], {
    swagger: '2.0',
    host: 'localhost:5341',
    basePath: '/',
    schemes: ['http', 'https'],
    info: {
        version: '1.0.0',
        title: 'Contact341 REST API',
        description: 'CSE 341 Week 01/02 Contacts API'
    }
});
