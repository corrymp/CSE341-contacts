const port = process.env.PORT;
const bodyParser = require('body-parser');

require('./db/connect').init(err => {
    if (err) return console.error(err);

    require('express')()

        // I just don't like it
        .disable('x-powered-by')

        // access control
        .use((req, res, next) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            next();
        })

        .use(require('cors')({ origin: '*' }))

        // middleware
        .use(bodyParser.json())
        .use(bodyParser.urlencoded({ extended: true }))

        // router
        .use(require('./routes'))

        // 404 route
        .use((req, res, next) => next({ status: 404, message: '404' }))

        // error handler
        .use((err, req, res) => {
            if (err.status !== 404) console.error(`An error occured whilst accessing "${req.originalUrl}":`, err.message);
            res.status(err.status ?? 500).send(err.message);
        })

        // listener && running message
        .listen(port, () => console.log(`database conected - app listening on ${process.env.HOST}:${port}`));
});
