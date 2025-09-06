const db = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

/**
* @param {import('express').Request} req
* @param {import('express').Response} res
 */
async function getAll(req, res) {
    try {
        res.setHeader('Content-Type', 'application/json')
            .status(200)
            .json(await (await db
                .get()
                .db()
                .collection('Contacts')
                .find()
            ).toArray());
    }
    catch (e) { console.error('Error whilst running "controllers.users.getAll"', e); }
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function getUser(req, res) {
    try {
        res.setHeader('Content-Type', 'application/json')
            .status(200)
            .json((await (db
                .get()
                .db()
                .collection('Contacts')
                .find({ _id: new ObjectId(req.params.id) })
            ).toArray())[0]);
    }

    catch (e) { console.error('Error whilst running "controllers.users.getUser"', e); }
}

module.exports = { getAll, getUser };
