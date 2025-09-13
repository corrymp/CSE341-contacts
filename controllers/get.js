/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const index = (req, res) => {
    res.status(200).send('Hello World');
    /* #swagger.description = 'say hello'
        #swagger.produces = ['text/plain']
       #swagger.responses[200] = {
            description: "Hello World"
       }*/
};

module.exports = { index };
